import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MISSIONS_DATA } from '../data/missionsData';
import { MissionArtifact } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { CatalogueTag } from './CatalogueTag';
import { STATUS_COLORS } from '../data/status';
import { easeInOutCubic, latLonToVector, nearestAngle, rotationFacing } from '../lib/globe';
import earth2k from '../assets/textures/earth_2k.webp';
import moon2k from '../assets/textures/moon_2k.webp';
import mars2k from '../assets/textures/mars_2k.webp';

interface Timeline3DProps {
  onOpenDetails: (artifact: MissionArtifact) => void;
}

type Body = 'EARTH' | 'MOON' | 'MARS';

// Missions in landing order (static data, so sorted once)
const sortedMissions = [...MISSIONS_DATA].sort((a, b) => a.landingYear - b.landingYear);
const CRUISE_SECONDS = 2.5;

// Same layout as the globes higher up the page; sizes and distances are for storytelling, not to scale.
// Surfaces: Earth from NASA GIBS Blue Marble, the Moon from the LRO LROC WAC mosaic (Moon Trek),
// Mars from the Viking MDIM 2.1 mosaic (Mars Trek).
const BODIES: Record<Body, { radius: number; pos: THREE.Vector3; tex: string; atmosphere?: { color: number; opacity: number } }> = {
  EARTH: { radius: 2.2, pos: new THREE.Vector3(0, 0, 0), tex: earth2k, atmosphere: { color: 0x62a8ff, opacity: 0.22 } },
  MOON: { radius: 1.6, pos: new THREE.Vector3(16, 0.6, -4), tex: moon2k },
  MARS: { radius: 1.8, pos: new THREE.Vector3(38, -0.4, -9), tex: mars2k, atmosphere: { color: 0xd0704a, opacity: 0.12 } },
};
const FLAT_MAP: Record<'MOON' | 'MARS', string> = { MOON: moon2k, MARS: mars2k };

export const Timeline3D: React.FC<Timeline3DProps> = ({ onOpenDetails }) => {
  const { t, tx } = useI18n();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [webglFailed, setWebglFailed] = useState<boolean>(false);

  // The render loop reads these refs, so the scene is built only once
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;
  const apiRef = useRef<{ goTo: (idx: number) => void } | null>(null);

  const currentMission = sortedMissions[selectedMissionIndex];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 600);

    // Sunlight from the upper left, with a soft fill so the night side stays readable
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-20, 12, 30);
    scene.add(sun);

    // Distant, still stars on a sphere around the scene
    const starCount = 1600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 140 + Math.random() * 80;
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      starPos.set([r * s * Math.cos(a) + 19, r * u, r * s * Math.sin(a)], i * 3);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xeef0f5, size: 0.4, transparent: true, opacity: 0.5 })));

    // ---------- The three worlds, with every object at its catalogued coordinates ----------
    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const globes = {} as Record<Body, THREE.Group>;
    (Object.keys(BODIES) as Body[]).forEach((key) => {
      const cfg = BODIES[key];
      const anchor = new THREE.Group();
      anchor.position.copy(cfg.pos);
      const globe = new THREE.Group();
      globe.rotation.order = 'XYZ';
      anchor.add(globe);

      const material = new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 1, metalness: 0 });
      loader.load(cfg.tex, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        material.map = tex;
        material.color.set(0xffffff);
        material.needsUpdate = true;
        requestRender();
      });
      globe.add(new THREE.Mesh(new THREE.SphereGeometry(cfg.radius, 96, 64), material));

      if (cfg.atmosphere) {
        anchor.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(cfg.radius * 1.06, 64, 48),
            new THREE.MeshBasicMaterial({ color: cfg.atmosphere.color, transparent: true, opacity: cfg.atmosphere.opacity, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
          )
        );
      }

      if (key !== 'EARTH') {
        MISSIONS_DATA.filter((m) => m.destination === key).forEach((m) => {
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(cfg.radius * 0.016, 12, 8),
            new THREE.MeshBasicMaterial({ color: new THREE.Color(STATUS_COLORS[m.status]), transparent: true, opacity: 0.75 })
          );
          dot.position.copy(latLonToVector(m.coordinates.latNum, m.coordinates.lngNum, cfg.radius * 1.003));
          globe.add(dot);
        });
      }
      scene.add(anchor);
      globes[key] = globe;
    });

    // The pin for the mission on screen: a bright dot and a ring flat on the surface
    const pin = new THREE.Group();
    const pinDot = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xd0704a }));
    const pinRing = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 2.3, 40),
      new THREE.MeshBasicMaterial({ color: 0xeef0f5, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false })
    );
    pin.add(pinDot, pinRing);

    const placePin = (m: MissionArtifact) => {
      const body = m.destination as Body;
      const r = BODIES[body].radius;
      const pos = latLonToVector(m.coordinates.latNum, m.coordinates.lngNum, r * 1.006);
      pin.removeFromParent();
      globes[body].add(pin);
      pin.position.copy(pos);
      // Lay the ring flat on the surface (orientation is relative to the globe, so no lookAt in world space)
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
      pinDot.scale.setScalar(r * 0.024);
      pinRing.scale.setScalar(r * 0.024);
    };

    // ---------- Camera: frame a world, fly between worlds via Earth ----------
    const frame = (body: Body) => {
      const { radius, pos } = BODIES[body];
      // Framing by stage width. Wide: the globe fills the open space between the year chips and the
      // bottom edge, clear of the card (left) and the photo plate (right). Medium: a little further
      // away, beside the narrower card. Phone: above the card.
      const w = container.clientWidth;
      const tier = w < 640 ? 'narrow' : w < 1024 ? 'medium' : 'wide';
      const distance = { narrow: 6.2, medium: 5.4, wide: 4.75 }[tier];
      const lookUp = { narrow: -0.7, medium: -0.25, wide: 0.32 }[tier];
      // Medium screens have no year chips but a card on the left, so the globe sits right of centre
      const lookSide = { narrow: 0, medium: -0.95, wide: 0 }[tier];
      return {
        pos: pos.clone().add(new THREE.Vector3(radius * lookSide, radius * 0.1, radius * distance)),
        look: pos.clone().add(new THREE.Vector3(radius * lookSide, radius * lookUp, 0)),
      };
    };

    const targetRot = {} as Record<Body, { x: number; y: number } | null>;
    (Object.keys(BODIES) as Body[]).forEach((k) => (targetRot[k] = null));

    let currentBody: Body = sortedMissions[0].destination as Body;
    const startFrame = frame(currentBody);
    camera.position.copy(startFrame.pos);
    const lookAt = startFrame.look.clone();

    let flight: null | { p0: THREE.Vector3; p1: THREE.Vector3; p2: THREE.Vector3; l0: THREE.Vector3; l1: THREE.Vector3; l2: THREE.Vector3; t: number; duration: number } = null;
    const bezier = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, k: number, out: THREE.Vector3) =>
      out.set(0, 0, 0).addScaledVector(a, (1 - k) * (1 - k)).addScaledVector(b, 2 * (1 - k) * k).addScaledVector(c, k * k);

    const goTo = (idx: number) => {
      const m = sortedMissions[idx];
      const body = m.destination as Body;
      placePin(m);
      const rot = rotationFacing(m.coordinates.latNum, m.coordinates.lngNum);
      const g = globes[body];
      targetRot[body] = { x: rot.x, y: nearestAngle(g.rotation.y, rot.y) };
      if (reduceMotion) {
        g.rotation.set(rot.x, rot.y, 0);
        targetRot[body] = null;
      }
      if (body !== currentBody) {
        const to = frame(body);
        // Between the Moon and Mars the camera passes by Earth, where every journey began
        const via = BODIES.EARTH.pos.clone().add(new THREE.Vector3(0, 5, 16));
        flight = { p0: camera.position.clone(), p1: via, p2: to.pos, l0: lookAt.clone(), l1: BODIES.EARTH.pos.clone(), l2: to.look, t: 0, duration: reduceMotion ? 0 : 3.4 };
        currentBody = body;
      }
      requestRender();
    };
    apiRef.current = { goTo };

    // ---------- Render loop (only while the section is on screen) ----------
    const timer = new THREE.Timer();
    timer.connect(document);
    let animationId = 0;
    let running = false;
    let cruise = 0;
    const tmp = new THREE.Vector3();

    const tick = (timestamp?: number) => {
      animationId = requestAnimationFrame(tick);
      timer.update(timestamp);
      const dt = Math.min(timer.getDelta(), 0.1);
      const elapsed = timer.getElapsed();

      if (flight) {
        flight.t = flight.duration === 0 ? 1 : Math.min(1, flight.t + dt / flight.duration);
        const k = easeInOutCubic(flight.t);
        bezier(flight.p0, flight.p1, flight.p2, k, camera.position);
        bezier(flight.l0, flight.l1, flight.l2, k, tmp);
        lookAt.copy(tmp);
        if (flight.t >= 1) flight = null;
      } else {
        // Settle on the framing for this world (also after a resize)
        const f = frame(currentBody);
        const ease = reduceMotion ? 1 : 1 - Math.pow(0.05, dt);
        camera.position.lerp(f.pos, ease);
        lookAt.lerp(f.look, ease);
      }
      camera.lookAt(lookAt);

      (Object.keys(globes) as Body[]).forEach((k) => {
        const g = globes[k];
        const target = targetRot[k];
        if (target) {
          const ease = reduceMotion ? 1 : 1 - Math.pow(0.03, dt);
          g.rotation.y += (target.y - g.rotation.y) * ease;
          g.rotation.x += (target.x - g.rotation.x) * ease;
          if (Math.abs(target.y - g.rotation.y) < 0.0005 && Math.abs(target.x - g.rotation.x) < 0.0005) targetRot[k] = null;
        } else if (!reduceMotion && k !== currentBody) {
          g.rotation.y += 0.04 * dt; // worlds off screen turn slowly
        }
      });

      if (!reduceMotion) {
        const pulse = 1 + 0.25 * Math.sin(elapsed * 3);
        pinRing.scale.setScalar(pinDot.scale.x * pulse);
      }

      if (isPlayingRef.current && !flight) {
        cruise += dt;
        if (cruise > CRUISE_SECONDS) {
          cruise = 0;
          setSelectedMissionIndex((prev) => (prev + 1) % sortedMissions.length);
        }
      } else if (!isPlayingRef.current) {
        cruise = 0;
      }

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running) return;
      running = true;
      timer.reset();
      animationId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationId);
    };
    function requestRender() {
      if (!running) renderer.render(scene, camera);
    }

    goTo(0);
    // Start already facing the first site
    const first = sortedMissions[0];
    const r0 = rotationFacing(first.coordinates.latNum, first.coordinates.lngNum);
    globes[first.destination as Body].rotation.set(r0.x, r0.y, 0);
    targetRot[first.destination as Body] = null;

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { rootMargin: '100px' });
    visibility.observe(container);
    const resize = new ResizeObserver(() => {
      if (!container.clientWidth || !container.clientHeight) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      requestRender();
    });
    resize.observe(container);

    return () => {
      stop();
      visibility.disconnect();
      resize.disconnect();
      timer.dispose();
      apiRef.current = null;
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        const mats = Array.isArray(material) ? material : material ? [material] : [];
        mats.forEach((mat) => {
          (mat as THREE.MeshStandardMaterial).map?.dispose();
          mat.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  // Tell the scene whenever the mission changes (buttons, year chips, keys or cruise)
  useEffect(() => {
    apiRef.current?.goTo(selectedMissionIndex);
  }, [selectedMissionIndex]);

  const handleSelectIndex = (idx: number) => {
    spaceAudio.playTelemetryPing(900 + idx * 40, 0.05);
    setSelectedMissionIndex(idx);
  };
  const handlePrev = () => handleSelectIndex((selectedMissionIndex - 1 + sortedMissions.length) % sortedMissions.length);
  const handleNext = () => handleSelectIndex((selectedMissionIndex + 1) % sortedMissions.length);

  const m = currentMission;
  const bodyName = t(`body.name.${m.destination}`);
  const sitePct = { x: ((m.coordinates.lngNum + 180) / 360) * 100, y: ((90 - m.coordinates.latNum) / 180) * 100 };

  /** The museum plate: the object's NASA photograph, and the same site from orbit where one exists. */
  const plate = (
    <figure key={m.id} className="animate-fadeIn">
      {m.orbitalView ? (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <img src={m.image} alt={tx(m, 'imageCaption')} className="w-full aspect-square object-cover rounded-md bg-ink" />
            <span className="block mt-1 text-xs text-fg-2">{t('modal.thenLabel')}</span>
          </div>
          <div>
            <img src={m.orbitalView.image} alt={tx(m, 'orbitalCaption')} className="w-full aspect-square object-cover rounded-md bg-ink" />
            <span className="block mt-1 text-xs text-fg-2">{t('modal.nowLabel')}</span>
          </div>
        </div>
      ) : (
        <img src={m.image} alt={tx(m, 'imageCaption')} className="w-full aspect-[4/3] object-cover rounded-md bg-ink" />
      )}
      <figcaption className="mt-2 catalogue-tag text-fg-2">
        {m.imageNasaId} · {m.imageCredit}
        {m.orbitalView && ` · ${m.orbitalView.nasaId}`}
      </figcaption>
    </figure>
  );

  return (
    <section id="timeline-3d" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="section-label">{t('timeline.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('timeline.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-2xl">{t('timeline.intro')}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(1000, 0.06);
                setIsPlaying(!isPlaying);
              }}
              aria-pressed={isPlaying}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${
                isPlaying ? 'bg-raised border-line-strong text-fg' : 'border-line text-fg hover:bg-raised'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" strokeWidth={1.5} /> : <Play className="w-4 h-4" strokeWidth={1.5} />}
              <span>{isPlaying ? t('timeline.pause') : t('timeline.play')}</span>
            </button>
            <div className="flex items-center gap-1 border border-line p-1 rounded-lg">
              <button onClick={handlePrev} aria-label={t('timeline.prev')} className="p-2 rounded text-fg-2 hover:text-fg hover:bg-raised transition-colors">
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <span className="text-xs font-mono-data px-2 text-fg-2">
                {selectedMissionIndex + 1} / {sortedMissions.length}
              </span>
              <button onClick={handleNext} aria-label={t('timeline.next')} className="p-2 rounded text-fg-2 hover:text-fg hover:bg-raised transition-colors">
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* The stage: real NASA globes in 3D; left and right arrow keys move between missions */}
        <div
          tabIndex={0}
          role="group"
          aria-label={t('timeline.stageAria')}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              handlePrev();
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              handleNext();
            }
          }}
          className="relative rounded-2xl border border-line bg-ink overflow-hidden min-h-128 h-144 outline-none focus-visible:ring-2 focus-visible:ring-fg"
        >
          <div ref={mountRef} className="w-full h-full" aria-hidden="true" />

          {/* Without WebGL: the same NASA map, flat, with the site marked */}
          {webglFailed && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="relative w-full max-w-2xl aspect-[2/1] rounded-lg overflow-hidden">
                <img src={FLAT_MAP[m.destination]} alt="" className="w-full h-full object-cover" />
                <span
                  className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent border-2 border-fg"
                  style={{ left: `${sitePct.x}%`, top: `${sitePct.y}%` }}
                  aria-hidden="true"
                />
              </div>
              <p className="absolute bottom-2 left-0 right-0 text-center text-xs font-mono-data text-fg-2">{t('timeline.noWebgl')}</p>
            </div>
          )}

          {/* Where we are: year, object, and an honest scale note */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2 pointer-events-none text-xs text-fg-2" aria-live="polite">
            <div className="bg-page/85 px-2 py-1 rounded flex items-center gap-2 max-w-full">
              <span className="font-mono-data text-fg">{m.landingYear}</span>
              <span className="truncate">
                {m.name} · {bodyName}
              </span>
            </div>
            <span className="bg-page/85 px-2 py-1 rounded">{t('timeline.notToScale')}</span>
          </div>

          {/* The mission card */}
          <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-xs lg:max-w-sm z-20 bg-card/95 border border-line p-3 sm:p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <img src={m.image} alt="" className="lg:hidden w-12 h-12 rounded-md object-cover bg-ink shrink-0" />
              <div className="min-w-0">
                <h3 className="font-serif text-lg sm:text-xl text-fg leading-tight">{m.name}</h3>
                <p className="text-xs text-fg-2 mt-0.5">
                  {m.mission} · {bodyName}
                </p>
              </div>
            </div>
            <CatalogueTag artifact={m} className="mt-1.5" />
            <p className="hidden sm:block text-sm text-fg-2 mt-2 leading-snug">{tx(m, 'hook')}</p>
            <button onClick={() => onOpenDetails(m)} className="btn-secondary mt-2.5 px-3 py-1.5 text-sm">
              {t('timeline.inspect')}
            </button>
          </div>

          {/* The photo plate (large screens) */}
          <div className="hidden lg:block absolute bottom-3 right-3 w-64 z-20 bg-card/95 border border-line p-3 rounded-xl">{plate}</div>

          {/* Year chips */}
          <div className="hidden lg:flex absolute top-16 right-4 left-4 justify-center z-20 pointer-events-none">
            <div className="pointer-events-auto bg-page/90 border border-line p-1 rounded-xl flex flex-wrap justify-center items-center gap-1">
              {sortedMissions.map((mm, idx) => (
                <button
                  key={mm.id}
                  onClick={() => handleSelectIndex(idx)}
                  title={`${mm.landingYear}: ${mm.name}`}
                  aria-label={`${mm.landingYear}: ${mm.name}`}
                  aria-current={selectedMissionIndex === idx ? 'step' : undefined}
                  className={`px-2 py-1 rounded text-xs font-mono-data transition-colors ${
                    selectedMissionIndex === idx ? 'bg-raised text-accent' : 'text-fg-2 hover:text-fg hover:bg-raised'
                  }`}
                >
                  {mm.landingYear}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
