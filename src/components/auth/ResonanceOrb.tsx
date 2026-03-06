"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, MeshDisplayMaterial } from "@react-three/drei";
import * as THREE from "three";

function OrbCore() {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial
                color="#1d9bf0"
                speed={2}
                distort={0.4}
                radius={1}
                emissive="#1d9bf0"
                emissiveIntensity={2}
                roughness={0}
                metalness={1}
            />
        </mesh>
    );
}

function OrbitingFragments() {
    const groupRef = useRef<THREE.Group>(null!);

    const fragments = useMemo(() => {
        const data = [];
        for (let i = 0; i < 20; i++) {
            data.push({
                position: [
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                ] as [number, number, number],
                size: Math.random() * 0.05 + 0.02,
                speed: Math.random() * 0.5 + 0.2,
            });
        }
        return data;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.5;
            groupRef.current.rotation.z = time * 0.3;
        }
    });

    return (
        <group ref={groupRef}>
            {fragments.map((frag, i) => (
                <mesh key={i} position={frag.position}>
                    <boxGeometry args={[frag.size, frag.size, frag.size]} />
                    <meshStandardMaterial color="#ffffff" emissive="#1d9bf0" emissiveIntensity={1} />
                </mesh>
            ))}
        </group>
    );
}

function WireframeShield() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        ref.current.rotation.y = -state.clock.getElapsedTime() * 0.1;
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[1.4, 32, 32]} />
            <meshStandardMaterial
                wireframe
                color="#1d9bf0"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export default function ResonanceOrb() {
    return (
        <div className="w-full h-full min-h-[400px] relative cursor-pointer">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#1d9bf0" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />

                <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                    <OrbCore />
                    <WireframeShield />
                    <OrbitingFragments />
                </Float>
            </Canvas>

            {/* Visual glow overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent rounded-full blur-[100px] opacity-40 scale-75" />
        </div>
    );
}
