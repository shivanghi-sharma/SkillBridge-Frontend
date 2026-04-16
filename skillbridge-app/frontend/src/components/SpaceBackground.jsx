/* ============================================================
   SpaceBackground – 3D animated space scene
   Uses React Three Fiber + Drei for a rotating moon, star
   field, floating particles, and mouse-based parallax.
   Fixed behind all pages; hidden on mobile for performance.
   ============================================================ */
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '../hooks/useMousePosition';

/* ── Rotating Moon ──────────────────────────────────────────── */
const Moon = () => {
  const meshRef = useRef();

  // Slowly rotate the moon each frame
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[4, 2, -5]}>
      {/* Distort material gives the moon a subtle organic wobble */}
      <MeshDistortMaterial
        color="#c084fc"
        emissive="#7c3aed"
        emissiveIntensity={0.3}
        roughness={0.7}
        metalness={0.2}
        distort={0.25}
        speed={1.5}
      />
    </Sphere>
  );
};

/* ── Floating Particles ─────────────────────────────────────── */
const FloatingParticles = ({ count = 120 }) => {
  const meshRef = useRef();

  // Generate random particle positions and sizes once
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
        ],
        size: Math.random() * 0.04 + 0.01,
      });
    }
    return temp;
  }, [count]);

  // Slowly rotate the entire particle cloud
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
      meshRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#ec4899' : '#c084fc'}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ── Parallax Rig – moves the entire scene based on mouse ──── */
const ParallaxRig = ({ children }) => {
  const groupRef = useRef();
  const mouse = useMousePosition();

  useFrame(() => {
    if (groupRef.current) {
      // Smoothly lerp towards the mouse position
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.x * 0.08,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.05,
        0.05
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

/* ── Glowing Orbs – decorative ambient lights ──────────────── */
const GlowOrbs = () => (
  <>
    {/* Purple orb – top left */}
    <Float speed={1.2} rotationIntensity={0} floatIntensity={2}>
      <Sphere args={[0.3, 32, 32]} position={[-6, 3, -8]}>
        <meshBasicMaterial color="#a855f7" transparent opacity={0.35} />
      </Sphere>
    </Float>
    {/* Pink orb – bottom right */}
    <Float speed={1.5} rotationIntensity={0} floatIntensity={1.8}>
      <Sphere args={[0.2, 32, 32]} position={[5, -3, -6]}>
        <meshBasicMaterial color="#ec4899" transparent opacity={0.3} />
      </Sphere>
    </Float>
    {/* Small accent – centre-ish */}
    <Float speed={2} rotationIntensity={0} floatIntensity={3}>
      <Sphere args={[0.15, 32, 32]} position={[-3, -2, -10]}>
        <meshBasicMaterial color="#f472b6" transparent opacity={0.25} />
      </Sphere>
    </Float>
  </>
);

/* ── Main export ────────────────────────────────────────────── */
const SpaceBackground = () => (
  <div className="three-canvas-wrapper fixed inset-0 -z-10" aria-hidden="true">
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}            /* Limit pixel ratio for perf */
      gl={{ antialias: false }}  /* Disable AA for speed */
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {/* Ambient + point lights for subtle illumination */}
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#a855f7" />
        <pointLight position={[-10, -5, 5]} intensity={0.3} color="#ec4899" />

        <ParallaxRig>
          {/* Drei's Stars – dense far-away star field */}
          <Stars
            radius={80}
            depth={60}
            count={2500}
            factor={4}
            saturation={0.5}
            fade
            speed={0.8}
          />
          <Moon />
          <FloatingParticles count={100} />
          <GlowOrbs />
        </ParallaxRig>
      </Suspense>
    </Canvas>
  </div>
);

export default SpaceBackground;