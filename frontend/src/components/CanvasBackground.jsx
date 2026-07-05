import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const FloatingParticles = ({ count = 150 }) => {
  const mesh = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 40;
        const y = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        const factor = Math.random() * 100;
        const speed = 0.01 + Math.random() / 200;
        temp.push({ x, y, z, factor, speed });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { factor, speed, x, y, z } = particle;

      const t = (particle.factor += speed);

      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      dummy.scale.setScalar(0.05 + Math.sin(t) * 0.05);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.8} transparent opacity={0.6}/>
    </instancedMesh>
  );
};

// Gently drifts the camera toward the pointer so the background feels alive
// without distracting from foreground content.
const ParallaxCamera = ({ strength = 1.2 }) => {
  useFrame((state) => {
    const targetX = state.pointer.x * strength;
    const targetY = state.pointer.y * strength * 0.6;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const CanvasBackground = ({ variant = 'landing' }) => {
  const isApp = variant === 'app';

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
      {/* Lighting */}
      <ambientLight intensity={isApp ? 0.35 : 0.5} />
      <directionalLight position={[10, 10, 5]} intensity={isApp ? 0.6 : 1} color="#3b82f6" />
      <directionalLight position={[-10, -10, -5]} intensity={isApp ? 0.6 : 1} color="#8b5cf6" />

      {/* Elements */}
      <Stars radius={100} depth={50} count={isApp ? 2000 : 5000} factor={4} saturation={0} fade speed={1} />
      <FloatingParticles count={isApp ? 60 : 150} />
      <ParallaxCamera strength={isApp ? 0.5 : 1.2} />
    </Canvas>
  );
};

export default CanvasBackground;
