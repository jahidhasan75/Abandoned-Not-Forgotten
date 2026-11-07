import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MISSIONS_DATA } from '../data/missionsData';
import { STATUS_COLORS } from '../data/status';
import { MissionArtifact } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import earth4k from '../assets/textures/earth_4k.webp';
import earth2k from '../assets/textures/earth_2k.webp';
import moon4k from '../assets/textures/moon_4k.webp';
import moon2k from '../assets/textures/moon_2k.webp';
import mars4k from '../assets/textures/mars_4k.webp';
import mars2k from '../assets/textures/mars_2k.webp';

export type GlobeBody = 'EARTH' | 'MOON' | 'MARS';

interface BodyConfig {
  radius: number;
  position: THREE.Vector3;
  textures: { hi: string; lo: string };
  atmosphere?: { color: number; opacity: number };
  spin: number; // idle rotation speed (rad/s)
}

// Sizes and spacing are for storytelling, not to scale.
const BODIES: Record<GlobeBody, BodyConfig> = {
  EARTH: { radius: 2.2, position: new THREE.Vector3(0, 0, 0), textures: { hi: earth4k, lo: earth2k }, atmosphere: { color: 0x62a8ff, opacity: 0.22 }, spin: 0.05 },
  MOON: { radius: 1.6, position: new THREE.Vector3(16, 0.6, -4), textures: { hi: moon4k, lo: moon2k }, spin: 0.035 },
  MARS: { radius: 1.8, position: new THREE.Vector3(38, -0.4, -9), textures: { hi: mars4k, lo: mars2k }, atmosphere: { color: 0xd0704a, opacity: 0.12 }, spin: 0.04 },
};

/** Planetocentric lat/lon (degrees, east-positive) -> point on a Three.js SphereGeometry.
 *  Matches the default sphere UV layout, so markers line up with the equirectangular texture. */
export const latLonToVector = (lat: number, lon: number, radius: number) => {
  const phi = ((lon + 180) / 360) * Math.PI * 2;
  const theta = ((90 - lat) / 180) * Math.PI;
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

/** Globe rotation that turns the given lat/lon to face the camera (+Z). */
const rotationFacing = (lat: number, lon: number) => {
  const p = latLonToVector(lat, lon, 1);
  return { y: Math.atan2(-p.x, p.z), x: THREE.MathUtils.degToRad(lat) };
};

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface PlanetGlobeProps {
  view: GlobeBody;
  focusArtifactId: string | null;
  onHoverArtifact: (artifact: MissionArtifact | null) => void;
  onPickArtifact: (artifact: MissionArtifact) => void;
  onArrive?: (body: GlobeBody) => void;
  /** Called once all three surface textures have loaded. */
  onReady?: () => void;
}

export const PlanetGlobe: React.FC<PlanetGlobeProps> = ({
  view,
  focusArtifactId,
  onHoverArtifact,
  onPickArtifact,
  onArrive,
  onReady,
}) => {
  const { t } = useI18n();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Bridges between React props and the render loop (the scene is built once)
  const viewRef = useRef<GlobeBody>(view);
  const focusRef = useRef<string | null>(focusArtifactId);
  const callbacksRef = useRef({ onHoverArtifact, onPickArtifact, onArrive, onReady });
  callbacksRef.current = { onHoverArtifact, onPickArtifact, onArrive, onReady };
  const apiRef = useRef<{ flyTo: (body: GlobeBody) => void; focus: (id: string | null) => void } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowRes = window.innerWidth < 900 || (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglFailed(true);
      setLoading(false);
      callbacksRef.current.onReady?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'pan-y';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 500);

    // Lighting: a sun from the upper left plus soft fill so the night side stays readable
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-20, 12, 30);
    scene.add(sun);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 120 + Math.random() * 80;
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      starPos.set([r * s * Math.cos(t) + 19, r * u, r * s * Math.sin(t)], i * 3);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xeef0f5, size: 0.4, sizeAttenuation: true, transparent: true, opacity: 0.5 }));
    scene.add(stars);

    // Bodies
    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    let pendingTextures = 3;
    const globes = {} as Record<GlobeBody, THREE.Group>;
    const markerMeshes: THREE.Mesh[] = [];
    const markerRings: THREE.Mesh[] = [];

    (Object.keys(BODIES) as GlobeBody[]).forEach((key) => {
      const cfg = BODIES[key];
      const anchor = new THREE.Group(); // fixed position in space
      anchor.position.copy(cfg.position);
      const globe = new THREE.Group(); // rotates
      anchor.add(globe);
      globe.rotation.order = 'XYZ';

      const material = new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 1, metalness: 0 });
      loader.load(lowRes ? cfg.textures.lo : cfg.textures.hi, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        material.map = tex;
        material.color.set(0xffffff);
        material.needsUpdate = true;
        pendingTextures -= 1;
        requestRender();
        if (pendingTextures === 0) {
          setLoading(false);
          callbacksRef.current.onReady?.();
        }
      });
      globe.add(new THREE.Mesh(new THREE.SphereGeometry(cfg.radius, 96, 64), material));

      if (cfg.atmosphere) {
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(cfg.radius * 1.06, 64, 48),
          new THREE.MeshBasicMaterial({ color: cfg.atmosphere.color, transparent: true, opacity: cfg.atmosphere.opacity, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        anchor.add(glow);
      }

      // Artifact markers at their real coordinates
      if (key !== 'EARTH') {
        MISSIONS_DATA.filter((m) => m.destination === key).forEach((m) => {
          const pos = latLonToVector(m.coordinates.latNum, m.coordinates.lngNum, cfg.radius * 1.004);
          const color = new THREE.Color(STATUS_COLORS[m.status]);
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(cfg.radius * 0.022, 16, 12),
            new THREE.MeshBasicMaterial({ color })
          );
          dot.position.copy(pos);
          dot.userData = { artifactId: m.id };
          globe.add(dot);

          const ring = new THREE.Mesh(
            new THREE.RingGeometry(cfg.radius * 0.035, cfg.radius * 0.05, 32),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false })
          );
          ring.position.copy(pos);
          ring.lookAt(pos.clone().multiplyScalar(2));
          ring.userData = { artifactId: m.id, baseOpacity: 0.6 };
          globe.add(ring);
          markerRings.push(ring);

          // Larger invisible hit target so markers are easy to click and tap
          const hit = new THREE.Mesh(
            new THREE.SphereGeometry(cfg.radius * 0.07, 8, 6),
            new THREE.MeshBasicMaterial({ visible: false })
          );
          hit.position.copy(pos);
          hit.userData = { artifactId: m.id };
          globe.add(hit);
          markerMeshes.push(hit);
        });
      }

      scene.add(anchor);
      globes[key] = globe;
    });

    // ---------- Camera flight ----------
    const cameraTargetFor = (body: GlobeBody) => {
      const cfg = BODIES[body];
      const distance = cfg.radius * (container.clientWidth < 640 ? 4.4 : 3.4);
      return { pos: cfg.position.clone().add(new THREE.Vector3(0, cfg.radius * 0.15, distance)), look: cfg.position.clone() };
    };

    let current: GlobeBody = viewRef.current;
    const start = cameraTargetFor(current);
    camera.position.copy(start.pos);
    const lookAt = start.look.clone();
    camera.lookAt(lookAt);

    let flight: null | {
      from: THREE.Vector3; to: THREE.Vector3; lookFrom: THREE.Vector3; lookTo: THREE.Vector3;
      t: number; duration: number; arc: number; target: GlobeBody;
    } = null;

    const flyTo = (body: GlobeBody) => {
      if (body === current && !flight) return;
      const to = cameraTargetFor(body);
      const distance = camera.position.distanceTo(to.pos);
      flight = {
        from: camera.position.clone(), to: to.pos, lookFrom: lookAt.clone(), lookTo: to.look,
        t: 0, duration: reduceMotion ? 0 : Math.min(2.6, 1.2 + distance / 30), arc: Math.min(6, distance * 0.18), target: body,
      };
      current = body;
      requestRender();
    };

    // ---------- Rotation: idle spin, drag, and "face this artifact" ----------
    const targetRot = {} as Record<GlobeBody, { x: number; y: number } | null>;
    (Object.keys(BODIES) as GlobeBody[]).forEach((k) => (targetRot[k] = null));
    let userInteracting = false;
    let idleTimer = 0;

    const focus = (id: string | null) => {
      if (!id) return;
      const artifact = MISSIONS_DATA.find((m) => m.id === id);
      if (!artifact) return;
      const body = artifact.destination as GlobeBody;
      const rot = rotationFacing(artifact.coordinates.latNum, artifact.coordinates.lngNum);
      const g = globes[body];
      // take the shortest way round
      const twoPi = Math.PI * 2;
      const dy = ((((rot.y - g.rotation.y) % twoPi) + twoPi * 1.5) % twoPi) - Math.PI;
      targetRot[body] = { x: rot.x, y: g.rotation.y + dy };
      idleTimer = 6;
      if (current !== body) flyTo(body);
      requestRender();
    };

    apiRef.current = { flyTo, focus };

    // Pointer: drag to rotate, click/tap a marker to pick it
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let dragMoved = 0;
    let lastX = 0;
    let lastY = 0;
    let hoveredId: string | null = null;

    const setPointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const pick = (): string | null => {
      raycaster.setFromCamera(pointer, camera);
      const visible = markerMeshes.filter((m) => {
        const body = MISSIONS_DATA.find((a) => a.id === m.userData.artifactId)?.destination;
        return body === current;
      });
      const hit = raycaster.intersectObjects(visible, false)[0];
      if (!hit) return null;
      // ignore markers on the far side of the globe
      const globeHit = raycaster.intersectObject(globes[current].children[0], false)[0];
      if (globeHit && globeHit.distance < hit.distance - BODIES[current].radius * 0.08) return null;
      return hit.object.userData.artifactId as string;
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragMoved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      userInteracting = true;
      targetRot[current] = null;
    };
    const onPointerMove = (e: PointerEvent) => {
      setPointer(e);
      if (dragging && !flight) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        dragMoved += Math.abs(dx) + Math.abs(dy);
        lastX = e.clientX;
        lastY = e.clientY;
        const g = globes[current];
        g.rotation.y += dx * 0.006;
        g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + dy * 0.004, -1.2, 1.2);
        requestRender();
        return;
      }
      const id = pick();
      if (id !== hoveredId) {
        hoveredId = id;
        renderer.domElement.style.cursor = id ? 'pointer' : 'grab';
        callbacksRef.current.onHoverArtifact(id ? MISSIONS_DATA.find((m) => m.id === id) ?? null : null);
        markerRings.forEach((r) => r.scale.setScalar(r.userData.artifactId === id ? 1.6 : 1));
        requestRender();
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      if (dragging && dragMoved < 6) {
        setPointer(e);
        const id = pick();
        const artifact = id ? MISSIONS_DATA.find((m) => m.id === id) : null;
        if (artifact) {
          spaceAudio.playTelemetryPing(1100, 0.08);
          focus(artifact.id);
          callbacksRef.current.onPickArtifact(artifact);
        }
      }
      dragging = false;
      userInteracting = false;
      idleTimer = 4;
    };
    const onPointerLeave = () => {
      dragging = false;
      userInteracting = false;
      if (hoveredId) {
        hoveredId = null;
        callbacksRef.current.onHoverArtifact(null);
        markerRings.forEach((r) => r.scale.setScalar(1));
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.style.cursor = 'grab';

    // ---------- Render loop (only while visible) ----------
    const timer = new THREE.Timer();
    timer.connect(document);
    let frame = 0;
    let running = false;
    let needsOneFrame = false;

    const tick = (timestamp?: number) => {
      frame = requestAnimationFrame(tick);
      timer.update(timestamp);
      const dt = Math.min(timer.getDelta(), 0.1);
      const elapsed = timer.getElapsed();

      if (flight) {
        flight.t = flight.duration === 0 ? 1 : Math.min(1, flight.t + dt / flight.duration);
        const k = easeInOutCubic(flight.t);
        camera.position.lerpVectors(flight.from, flight.to, k);
        camera.position.y += Math.sin(k * Math.PI) * flight.arc;
        lookAt.lerpVectors(flight.lookFrom, flight.lookTo, easeInOutCubic(Math.min(1, flight.t * 1.15)));
        if (flight.t >= 1) {
          const arrived = flight.target;
          flight = null;
          callbacksRef.current.onArrive?.(arrived);
        }
      }
      camera.lookAt(lookAt);

      if (idleTimer > 0) idleTimer -= dt;
      (Object.keys(globes) as GlobeBody[]).forEach((k) => {
        const g = globes[k];
        const target = targetRot[k];
        if (target) {
          const ease = reduceMotion ? 1 : 1 - Math.pow(0.02, dt);
          g.rotation.y += (target.y - g.rotation.y) * ease;
          g.rotation.x += (target.x - g.rotation.x) * ease;
          if (Math.abs(target.y - g.rotation.y) < 0.0005 && Math.abs(target.x - g.rotation.x) < 0.0005) targetRot[k] = null;
        } else if (!reduceMotion && !(userInteracting && k === current) && idleTimer <= 0) {
          g.rotation.y += BODIES[k].spin * dt;
          if (k === current) g.rotation.x += (0 - g.rotation.x) * Math.min(1, dt * 0.4);
        }
      });

      renderer.render(scene, camera);
      if (needsOneFrame && !running) {
        needsOneFrame = false;
        cancelAnimationFrame(frame);
      }
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      timer.reset();
      frame = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    function requestRender() {
      if (!running) {
        needsOneFrame = true;
        frame = requestAnimationFrame(tick);
      }
    }

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()), { rootMargin: '120px' });
    visibility.observe(container);

    const resize = new ResizeObserver(() => {
      if (!container.clientWidth || !container.clientHeight) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      if (!flight) {
        const t = cameraTargetFor(current);
        camera.position.copy(t.pos);
      }
      requestRender();
    });
    resize.observe(container);

    return () => {
      stopLoop();
      visibility.disconnect();
      resize.disconnect();
      timer.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
        mats.forEach((m) => {
          (m as THREE.MeshStandardMaterial).map?.dispose();
          m.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
      apiRef.current = null;
    };
  }, []);

  // React -> scene
  useEffect(() => {
    viewRef.current = view;
    apiRef.current?.flyTo(view);
  }, [view]);

  useEffect(() => {
    focusRef.current = focusArtifactId;
    apiRef.current?.focus(focusArtifactId);
  }, [focusArtifactId]);

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
      {loading && !webglFailed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-mono-data text-fg-2">{t('globe.loading')}</span>
        </div>
      )}
      {webglFailed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs font-mono-data text-fg-2">
          3D globe unavailable on this device (WebGL disabled). Use the list to explore each site.
        </div>
      )}
    </div>
  );
};

export default PlanetGlobe;
