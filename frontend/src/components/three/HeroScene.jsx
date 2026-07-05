import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges, RoundedBox } from '@react-three/drei';

// The floating "CV card": a rounded box with a glowing edge outline and a few
// thin bars on its face standing in for text lines, so it silhouettes as a resume.
const CVCard = () => {
    const lineWidths = useMemo(() => [0.9, 0.6, 0.75, 0.4, 0.65, 0.5, 0.8], []);

    return (
        <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.1}>
            <group rotation={[0.15, -0.4, 0]}>
                <RoundedBox args={[2.6, 3.4, 0.14]} radius={0.12} smoothness={4}>
                    <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.4} />
                    <Edges scale={1.001} threshold={15}>
                        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.9} />
                    </Edges>
                </RoundedBox>

                {/* Avatar circle */}
                <mesh position={[-0.75, 1.15, 0.08]}>
                    <circleGeometry args={[0.32, 32]} />
                    <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
                </mesh>

                {/* Header bars */}
                <mesh position={[0.35, 1.28, 0.08]}>
                    <planeGeometry args={[1.1, 0.16]} />
                    <meshStandardMaterial color="#e2e8f0" />
                </mesh>
                <mesh position={[0.25, 1.02, 0.08]}>
                    <planeGeometry args={[0.9, 0.1]} />
                    <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.4} />
                </mesh>

                {/* Body text lines */}
                {lineWidths.map((w, i) => (
                    <mesh key={i} position={[-1.3 + (w * 1.8) / 2, 0.55 - i * 0.32, 0.08]}>
                        <planeGeometry args={[w * 1.8, 0.08]} />
                        <meshStandardMaterial color="#64748b" />
                    </mesh>
                ))}
            </group>
        </Float>
    );
};

// A ring of small polyhedra orbiting the card, representing skills/tech nodes.
const OrbitNodes = () => {
    const group = useRef();
    const nodes = useMemo(() => {
        const count = 8;
        return new Array(count).fill(0).map((_, i) => ({
            angle: (i / count) * Math.PI * 2,
            radius: 2.6 + (i % 3) * 0.35,
            speed: 0.15 + (i % 4) * 0.05,
            yOffset: Math.sin(i) * 0.8,
            color: i % 2 === 0 ? '#3b82f6' : '#8b5cf6',
            geo: i % 3 === 0 ? 'octahedron' : i % 3 === 1 ? 'icosahedron' : 'tetrahedron',
        }));
    }, []);

    useFrame((state, delta) => {
        if (group.current) group.current.rotation.y += delta * 0.08;
    });

    return (
        <group ref={group}>
            {nodes.map((n, i) => (
                <OrbitNode key={i} {...n} />
            ))}
        </group>
    );
};

const OrbitNode = ({ angle, radius, speed, yOffset, color, geo }) => {
    const mesh = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime * speed + angle;
        if (mesh.current) {
            mesh.current.position.set(Math.cos(t) * radius, yOffset + Math.sin(t * 0.7) * 0.4, Math.sin(t) * radius);
            mesh.current.rotation.x += 0.01;
            mesh.current.rotation.y += 0.015;
        }
    });

    return (
        <mesh ref={mesh}>
            {geo === 'octahedron' && <octahedronGeometry args={[0.22, 0]} />}
            {geo === 'icosahedron' && <icosahedronGeometry args={[0.2, 0]} />}
            {geo === 'tetrahedron' && <tetrahedronGeometry args={[0.24, 0]} />}
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.2} metalness={0.6} />
        </mesh>
    );
};

// Moves the camera slightly toward the pointer for a subtle parallax feel.
const ParallaxRig = () => {
    useFrame((state) => {
        const targetX = state.pointer.x * 0.8;
        const targetY = state.pointer.y * 0.5;
        state.camera.position.x += (targetX - state.camera.position.x) * 0.03;
        state.camera.position.y += (targetY - state.camera.position.y) * 0.03;
        state.camera.lookAt(0, 0, 0);
    });
    return null;
};

const HeroScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.75]}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} color="#3b82f6" />
            <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#8b5cf6" />
            <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffffff" />

            <CVCard />
            <OrbitNodes />
            <ParallaxRig />
        </Canvas>
    );
};

export default HeroScene;
