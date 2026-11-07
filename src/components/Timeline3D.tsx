import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MISSIONS_DATA } from '../data/missionsData';
import { MissionArtifact } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { CatalogueTag } from './CatalogueTag';

interface Timeline3DProps {
  onOpenDetails: (artifact: MissionArtifact) => void;
}

// Missions sorted chronologically (data is static, so compute once per module load)
const sortedMissions = [...MISSIONS_DATA].sort((a, b) => a.landingYear - b.landingYear);
const SPACING = 26;
const CRUISE_SECONDS = 4.5;

const nodePosition = (idx: number) =>
  new THREE.Vector3(Math.sin(idx * 0.9) * 6, Math.cos(idx * 0.8) * 3, -idx * SPACING);

export const Timeline3D: React.FC<Timeline3DProps> = ({ onOpenDetails }) => {
  const { t, tx } = useI18n();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [webglFailed, setWebglFailed] = useState<boolean>(false);

  // The render loop reads these refs, so the scene is built only once.
  const isPlayingRef = useRef<boolean>(false);
  const selectedIndexRef = useRef<number>(0);
  isPlayingRef.current = isPlaying;
  selectedIndexRef.current = selectedMissionIndex;

  const currentMission = sortedMissions[selectedMissionIndex];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglFailed(true);
      return;
    }

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Neutral fog the colour of the stage, so distant markers recede without a tint
    scene.fog = new THREE.FogExp2(0x07080d, 0.014);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Starfield Background
    const starsCount = 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    // Dim, neutral, still stars
    const starMaterial = new THREE.PointsMaterial({
      color: 0xeef0f5,
      size: 0.5,
      transparent: true,
      opacity: 0.35,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // One quiet matte sphere per mission, in the neutral ramp; the current mission turns rust.
    const NEUTRAL = new THREE.Color(0x7a8296);
    const CURRENT = new THREE.Color(0xd0704a);
    const missionObjects: THREE.Mesh[] = [];
    const markerGeo = new THREE.SphereGeometry(0.6, 32, 24);

    sortedMissions.forEach((_, idx) => {
      const marker = new THREE.Mesh(
        markerGeo,
        new THREE.MeshLambertMaterial({ color: NEUTRAL.clone() })
      );
      marker.position.copy(nodePosition(idx));
      scene.add(marker);
      missionObjects.push(marker);
    });

    // The path between missions: a thin neutral hairline
    const curvePoints = sortedMissions.map((_, idx) => nodePosition(idx));
    const spline = new THREE.CatmullRomCurve3(curvePoints);
    const pathGeo = new THREE.BufferGeometry().setFromPoints(spline.getPoints(240));
    const path = new THREE.Line(
      pathGeo,
      new THREE.LineBasicMaterial({ color: 0xeef0f5, transparent: true, opacity: 0.18 })
    );
    scene.add(path);

    // Soft, even light so the spheres read as solid objects, not glowing ones
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(-6, 8, 10);
    scene.add(key);

    // Camera starts at the first mission and then eases towards the selected one
    const startPos = nodePosition(selectedIndexRef.current);
    camera.position.set(startPos.x * 0.7, startPos.y * 0.7 + 1.2, startPos.z + 10);
    const lookTarget = startPos.clone();

    let animationId = 0;
    let running = false;
    let isVisible = false;
    const timer = new THREE.Timer();
    timer.connect(document);
    let cruiseTimer = 0;
    let lastIndex = -1;

    const animate = (timestamp?: number) => {
      animationId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const delta = Math.min(timer.getDelta(), 0.1);
      const selected = selectedIndexRef.current;

      // Restart the cruise countdown whenever the selection changes (manual or automatic)
      if (selected !== lastIndex) {
        lastIndex = selected;
        cruiseTimer = 0;
      }

      // The current mission is slightly larger and rust; the rest stay neutral
      missionObjects.forEach((obj, idx) => {
        const isCurrent = idx === selected;
        const targetScale = isCurrent ? 1.3 : 0.9;
        const k = prefersReducedMotion ? 1 : Math.min(1, delta * 6);
        obj.scale.setScalar(obj.scale.x + (targetScale - obj.scale.x) * k);
        (obj.material as THREE.MeshLambertMaterial).color.copy(isCurrent ? CURRENT : NEUTRAL);
      });

      // Automatic cruise mode
      if (isPlayingRef.current) {
        cruiseTimer += delta;
        if (cruiseTimer > CRUISE_SECONDS) {
          cruiseTimer = 0;
          setSelectedMissionIndex((prev) => (prev + 1) % sortedMissions.length);
        }
      }

      // Frame-rate independent easing towards the selected mission
      const target = missionObjects[selected]?.position;
      if (target) {
        const ease = prefersReducedMotion ? 1 : 1 - Math.pow(0.04, delta);
        camera.position.x += (target.x * 0.7 - camera.position.x) * ease;
        camera.position.y += (target.y * 0.7 + 1.2 - camera.position.y) * ease;
        camera.position.z += (target.z + 10 - camera.position.z) * ease;
        lookTarget.lerp(target, ease);
        camera.lookAt(lookTarget);
      }

      renderer.render(scene, camera);
    };

    // Only render while the section is on screen (saves battery and CPU)
    const start = () => {
      if (running) return;
      running = true;
      timer.reset();
      animationId = requestAnimationFrame(animate);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationId);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      },
      { rootMargin: '100px' }
    );
    visibilityObserver.observe(container);

    const resizeObserver = new ResizeObserver(() => {
      if (!container.clientWidth || !container.clientHeight) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      if (!running) renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    return () => {
      stop();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      timer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((mat) => mat.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSelectIndex = (idx: number) => {
    spaceAudio.playTelemetryPing(900 + idx * 40, 0.05);
    setSelectedMissionIndex(idx);
  };

  const handlePrev = () => {
    const nextIdx = (selectedMissionIndex - 1 + sortedMissions.length) % sortedMissions.length;
    handleSelectIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (selectedMissionIndex + 1) % sortedMissions.length;
    handleSelectIndex(nextIdx);
  };

  return (
    <section id="timeline-3d" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="section-label">{t('timeline.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('timeline.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-2xl">
              {t('timeline.intro')}
            </p>
          </div>

          {/* 3D Timeline Flight Controls */}
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
              <button
                onClick={handlePrev}
                aria-label="Previous mission in 3D timeline"
                className="p-2 rounded text-fg-2 hover:text-fg hover:bg-raised transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <span className="text-xs font-mono-data px-2 text-fg-2">
                {selectedMissionIndex + 1} / {sortedMissions.length}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next mission in 3D timeline"
                className="p-2 rounded text-fg-2 hover:text-fg hover:bg-raised transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Canvas Stage Container */}
        <div className="relative rounded-2xl border border-line bg-ink overflow-hidden min-h-128 h-144">
          {/* Three.js Canvas Mount */}
          <div ref={mountRef} className="w-full h-full" aria-hidden="true" />
          {webglFailed && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono-data text-fg-2 p-6 text-center">
              3D view unavailable on this device (WebGL disabled). Use the arrows above to browse missions.
            </div>
          )}

          {/* Current position in the flight: year and mission name */}
          <div className="absolute top-4 left-4 right-4 flex items-center pointer-events-none text-xs text-fg-2" aria-live="polite">
            <div className="bg-page/85 px-2 py-1 rounded flex items-center gap-2 max-w-full">
              <span className="font-mono-data text-fg">{currentMission.landingYear}</span>
              <span className="truncate">{currentMission.name}</span>
            </div>
          </div>

          {/* Active Mission HUD Floating Overlay Card */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md z-20 bg-card border border-line p-4 sm:p-5 rounded-xl">
            <h3 className="font-serif text-xl sm:text-2xl text-fg leading-tight">{currentMission.name}</h3>
            <p className="text-sm text-fg-2 mt-1">
              {currentMission.mission} · {t(`body.name.${currentMission.destination}`)}
            </p>
            <CatalogueTag artifact={currentMission} className="mt-2" />
            <p className="hidden sm:block text-sm text-fg-2 line-clamp-2 mt-3">{tx(currentMission, 'story')}</p>
            <button onClick={() => onOpenDetails(currentMission)} className="btn-secondary mt-3 sm:mt-4 py-2">
              {t('timeline.inspect')}
            </button>
          </div>

          {/* Year scrubber, top-centre on desktop (kept clear of the mission card below) */}
          <div className="hidden lg:flex absolute top-16 right-4 left-4 justify-center z-20 pointer-events-none">
          <div className="pointer-events-auto bg-page/90 border border-line p-1 rounded-xl flex flex-wrap justify-center items-center gap-1">
            {sortedMissions.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => handleSelectIndex(idx)}
                title={`${m.landingYear}: ${m.name}`}
                aria-label={`${m.landingYear}: ${m.name}`}
                aria-current={selectedMissionIndex === idx ? 'step' : undefined}
                className={`px-2 py-1 rounded text-xs font-mono-data transition-colors ${
                  selectedMissionIndex === idx ? 'bg-raised text-accent' : 'text-fg-2 hover:text-fg hover:bg-raised'
                }`}
              >
                {m.landingYear}
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};
