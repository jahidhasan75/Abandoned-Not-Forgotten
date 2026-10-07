import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MISSIONS_DATA } from '../data/missionsData';
import { MissionArtifact } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { Play, Pause, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

interface Timeline3DProps {
  onOpenDetails: (artifact: MissionArtifact) => void;
}

export const Timeline3D: React.FC<Timeline3DProps> = ({ onOpenDetails }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  // Sorted missions chronologically
  const sortedMissions = [...MISSIONS_DATA].sort((a, b) => a.landingYear - b.landingYear);
  const currentMission = sortedMissions[selectedMissionIndex];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.015);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Starfield Background
    const starsCount = 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;

      // Subtle cyan, amber, white tints
      const tint = Math.random();
      if (tint > 0.7) {
        starColors[i * 3] = 0.38;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 1.0;
      } else if (tint > 0.4) {
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.71;
        starColors[i * 3 + 2] = 0.38;
      } else {
        starColors[i * 3] = 0.85;
        starColors[i * 3 + 1] = 0.87;
        starColors[i * 3 + 2] = 0.89;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 3D Mission Waypoint nodes along chronological timeline corridor
    // Node spacing along Z-axis: 0, -25, -50, -75, etc.
    const spacing = 26;
    const missionObjects: THREE.Group[] = [];

    sortedMissions.forEach((m, idx) => {
      const group = new THREE.Group();
      const zPos = -idx * spacing;
      // Slight sinusoidal wave offset along X and Y
      const xPos = Math.sin(idx * 0.9) * 6;
      const yPos = Math.cos(idx * 0.8) * 3;
      group.position.set(xPos, yPos, zPos);

      // Core sphere
      const isMars = m.destination === 'MARS';
      const color = isMars ? 0xb85c38 : 0x62d9ff;
      const sphereGeo = new THREE.SphereGeometry(1.2, 24, 24);
      const sphereMat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Inner glowing core
      const innerGeo = new THREE.OctahedronGeometry(0.7, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: isMars ? 0xff7a45 : 0xffffff,
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      group.add(inner);

      // Planetary orbital ring
      const ringGeo = new THREE.RingGeometry(1.8, 2.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3;
      group.add(ring);

      scene.add(group);
      missionObjects.push(group);
    });

    // Spline curve connecting missions
    const curvePoints = sortedMissions.map((_, idx) => {
      const z = -idx * spacing;
      const x = Math.sin(idx * 0.9) * 6;
      const y = Math.cos(idx * 0.8) * 3;
      return new THREE.Vector3(x, y, z);
    });

    const spline = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(spline, 120, 0.15, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x62d9ff,
      transparent: true,
      opacity: 0.35,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Initial Camera target
    let targetCameraZ = 12;
    let targetCameraX = 0;
    let targetCameraY = 0;
    camera.position.set(0, 0, targetCameraZ);

    let animationId: number;
    let clock = new THREE.Clock();
    let cruiseTimer = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Spin waypoint markers
      missionObjects.forEach((obj, idx) => {
        obj.rotation.y = elapsed * 0.8 + idx;
        obj.rotation.x = Math.sin(elapsed * 0.5 + idx) * 0.2;
      });

      // Slowly rotate starfield
      starField.rotation.y = elapsed * 0.02;

      // Automatic Cruise Mode when playing
      if (isPlayingRef.current) {
        cruiseTimer += delta;
        if (cruiseTimer > 4.5) {
          cruiseTimer = 0;
          setSelectedMissionIndex((prev) => (prev + 1) % sortedMissions.length);
        }
      }

      // Smooth camera interpolation towards selected mission
      const currGroup = missionObjects[selectedMissionIndex];
      if (currGroup) {
        targetCameraZ = currGroup.position.z + 10;
        targetCameraX = currGroup.position.x * 0.7;
        targetCameraY = currGroup.position.y * 0.7 + 1.2;
      }

      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;

      if (currGroup) {
        camera.lookAt(currGroup.position.x, currGroup.position.y, currGroup.position.z);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
    };
  }, [selectedMissionIndex]);

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
    <section id="timeline-3d" className="relative py-24 bg-[#05070B] border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D CHRONOLOGICAL FLIGHT TRAJECTORY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              Spacetime Mission Flight
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-2xl font-light">
              Fly through the decades in 3D perspective. Track human engineering milestones from humanity’s
              first Moon landing stages in 1967 to deep Mars interior seismology in the 2020s.
            </p>
          </div>

          {/* 3D Timeline Flight Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(1000, 0.06);
                setIsPlaying(!isPlaying);
              }}
              className={`px-4 py-2 rounded-lg font-hud text-xs font-semibold tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                isPlaying
                  ? 'bg-[#62D9FF] text-[#05070B] shadow-md shadow-[#62D9FF]/20'
                  : 'bg-[#0B1018] border border-white/20 text-white hover:border-[#62D9FF]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE CRUISE' : 'AUTO CRUISE'}</span>
            </button>
            <div className="flex items-center gap-1 bg-[#0B1018] border border-white/20 p-1 rounded-lg">
              <button
                onClick={handlePrev}
                aria-label="Previous mission in 3D timeline"
                className="p-1.5 text-[#8D98A8] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono-data px-2 text-[#62D9FF]">
                {selectedMissionIndex + 1} / {sortedMissions.length}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next mission in 3D timeline"
                className="p-1.5 text-[#8D98A8] hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Canvas Stage Container */}
        <div className="relative rounded-2xl border border-white/15 bg-[#05070B] overflow-hidden min-h-[500px] h-[580px] shadow-2xl">
          {/* Three.js Canvas Mount */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top HUD Telemetry Banner */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none text-xs font-mono-data text-[#8D98A8]">
            <div className="bg-[#05070B]/80 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#62D9FF] animate-pulse" />
              <span className="text-white font-medium">3D SPATIAL CHRONOMETER</span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="hidden sm:inline">WARP VECTOR Z: -{selectedMissionIndex * 26} m</span>
            </div>
            <div className="bg-[#05070B]/80 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md">
              <span className="text-[#F3B562] font-semibold">{currentMission.landingYear} CE</span>
            </div>
          </div>

          {/* Active Mission HUD Floating Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6 md:left-6 md:right-auto md:max-w-md z-20 bg-[#0B1018]/90 border border-white/20 p-5 rounded-xl backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/10">
              <span className="text-xs font-mono-data text-[#62D9FF]">
                {currentMission.artifactId}
              </span>
              <span
                className={`text-[10px] font-hud px-2 py-0.5 rounded font-bold uppercase ${
                  currentMission.destination === 'MARS'
                    ? 'bg-[#B85C38]/20 text-[#B85C38] border border-[#B85C38]/40'
                    : 'bg-[#D9DDE3]/20 text-[#D9DDE3] border border-white/20'
                }`}
              >
                {currentMission.destination}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-xl font-bold font-hud text-white leading-tight">
                {currentMission.name}
              </h3>
              <p className="text-xs text-[#8D98A8] mt-0.5">
                {currentMission.mission} · Landing: {currentMission.landingYear}
              </p>
            </div>

            <p className="text-xs text-[#D9DDE3] line-clamp-2 mt-3 font-light leading-relaxed">
              {currentMission.story}
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono-data text-[#8D98A8]">
                Coords: {currentMission.coordinates.lat}, {currentMission.coordinates.lng}
              </span>
              <button
                onClick={() => onOpenDetails(currentMission)}
                className="inline-flex items-center gap-1.5 text-xs font-hud font-semibold text-[#62D9FF] hover:text-white transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Dossier</span>
              </button>
            </div>
          </div>

          {/* Horizontal Scrubber / Timeline Bar at Bottom Right on Desktop */}
          <div className="hidden lg:flex absolute bottom-6 right-6 z-20 bg-[#05070B]/85 border border-white/15 p-2 rounded-xl backdrop-blur-md items-center gap-2">
            {sortedMissions.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => handleSelectIndex(idx)}
                title={`${m.landingYear}: ${m.name}`}
                className={`px-2.5 py-1.5 rounded text-xs font-mono-data transition-all cursor-pointer ${
                  selectedMissionIndex === idx
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-[#8D98A8] hover:text-white hover:bg-white/5'
                }`}
              >
                {m.landingYear}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
