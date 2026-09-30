"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Stars } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function ParticleField({
    isDark,
}: {
    isDark: boolean;
}) {
    const pointsRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const count = 700;
        const array = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            array[i] = (Math.random() - 0.5) * 14;
            array[i + 1] = (Math.random() - 0.5) * 8;
            array[i + 2] = (Math.random() - 0.5) * 8;
        }

        return array;
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;

        pointsRef.current.rotation.y =
            state.clock.elapsedTime * 0.015;

        pointsRef.current.rotation.x =
            Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    });

    return (
        <Points
            ref={pointsRef}
            positions={positions}
            stride={3}
            frustumCulled
        >
            <PointMaterial
                transparent
                color={isDark ? "#FFFFFF" : "#111111"}
                size={0.022}
                sizeAttenuation
                depthWrite={false}
                opacity={0.35}
            />
        </Points>
    );
}

function FloatingOrb({
    position,
    scale = 1,
}: {
    position: [number, number, number];
    scale?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;

        meshRef.current.position.y =
            position[1] +
            Math.sin(time * 0.6 + position[0]) * 0.15;

        meshRef.current.rotation.x = time * 0.15;
        meshRef.current.rotation.y = time * 0.2;
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
        >
            <sphereGeometry args={[0.35, 32, 32]} />

            <meshPhysicalMaterial
                color="#C7FF00"
                transparent
                opacity={0.06}
                roughness={0.2}
                metalness={0.3}
                transmission={0.5}
                thickness={0.5}
            />
        </mesh>
    );
}

function Scene({
    mouse,
    isDark,
}: {
    mouse: React.MutableRefObject<{
        x: number;
        y: number;
    }>;
    isDark: boolean;
}) {
    const sceneRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!sceneRef.current) return;

        const targetRotationX = mouse.current.y * 0.12;
        const targetRotationY = mouse.current.x * 0.16;

        sceneRef.current.rotation.x +=
            (targetRotationX - sceneRef.current.rotation.x) * 0.04;

        sceneRef.current.rotation.y +=
            (targetRotationY - sceneRef.current.rotation.y) * 0.04;
    });

    return (
        <group ref={sceneRef}>
            <ambientLight intensity={0.25} />

            {/* Lime atmosphere light */}
            <pointLight
                position={[4, 4, 5]}
                intensity={8}
                distance={15}
                color="#C7FF00"
            />

            {/* Secondary light */}
            <pointLight
                position={[-4, -2, 3]}
                intensity={isDark ? 3 : 1.5}
                distance={12}
                color={isDark ? "#FFFFFF" : "#777777"}
            />

            {/* Stars */}
            {isDark && (
                <Stars
                    radius={12}
                    depth={8}
                    count={120}
                    factor={0.8}
                    saturation={0}
                    fade
                    speed={0.15}
                />
            )}

            {/* Small moving particles */}
            <ParticleField isDark={isDark} />

            {/* Very subtle lime floating elements */}
            <FloatingOrb
                position={[-4, 2, -1]}
                scale={0.8}
            />

            <FloatingOrb
                position={[4, -1.5, -2]}
                scale={1.2}
            />

            <FloatingOrb
                position={[-2, -2.5, -1]}
                scale={0.5}
            />
        </group>
    );
}

export default function Background() {
    const { resolvedTheme } = useTheme();

    const isDark = resolvedTheme !== "light";

    const mouse = useRef({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouse.current.x =
                (event.clientX / window.innerWidth) * 2 - 1;

            mouse.current.y =
                (event.clientY / window.innerHeight) * 2 - 1;
        };

        window.addEventListener(
            "mousemove",
            handleMouseMove
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );
        };
    }, []);

    return (
        <div
            className="
                pointer-events-none
                fixed inset-0
                z-0
                overflow-hidden
                bg-[#F7F7F5]
                dark:bg-black
            "
        >
            {/* Subtle technical grid */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            ${isDark
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.35)"
                        } 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            ${isDark
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.35)"
                        } 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Very subtle lime atmosphere */}
            <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#C7FF00]/[0.025] blur-[160px]" />

            <div className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-[#C7FF00]/[0.018] blur-[160px]" />

            {/* Three.js background */}
            <div className="absolute inset-0">
                <Canvas
                    camera={{
                        position: [0, 0, 8],
                        fov: 60,
                    }}
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: true,
                        alpha: true,
                    }}
                >
                    <Scene
                        mouse={mouse}
                        isDark={isDark}
                    />
                </Canvas>
            </div>

            {/* Subtle noise */}
            <div
                className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E\")",
                }}
            />
        </div>
    );
}