"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    ContactShadows,
    Float,
    Html,
    OrbitControls,
    RoundedBox,
    Sparkles,
    Text,
} from "@react-three/drei";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type MutableRefObject,
} from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";
import type { PortfolioProfile, PortfolioSkill } from "@/types/portfolio";
import {
    getDefaultImageUrl,
    getPrimaryRole,
} from "@/lib/portfolio-utils";

/* ------------------------------ Constants ------------------------------ */

const DESK_TOP = 0.15;
const SCENE_Y = 0.55;

const C = {
    deskTop: "#8E969D",
    deskLeg: "#646C73",
    bezel: "#9EA6AD",
    stand: "#707980",
    keyboardBody: "#A8B0B7",
    keyboardInset: "#687179",
    key: "#D2D7DB",
    mouse: "#A8B0B7",
    lampArm: "#69727A",
    lampShade: "#969EA5",
    lime: "#C7FF00",
    white: "#FFFFFF",
};

const silver = (color: string) => ({
    color,
    metalness: 0.35,
    roughness: 0.35,
});

type Vec3 = [number, number, number];
type CursorTarget = MutableRefObject<{ u: number; v: number }>;

/* ------------------------------- Helpers ------------------------------- */

/** "Ketan Suthar" -> "KS" */
function makeInitials(name?: string | null) {
    const parts = (name ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) return "?";

    const first = parts[0][0];
    const last =
        parts.length > 1 ? parts[parts.length - 1][0] : "";

    return (first + last).toUpperCase();
}

// Tags on both sides of the monitor
const sideTagPositions = (x: number): Vec3[] => [
    [-x, 3.5, 0.6],
    [x, 3.5, 0.6],
    [-x, 2.7, 0.6],
    [x, 2.7, 0.6],
    [-x, 1.9, 0.6],
    [x, 1.9, 0.6],
];

// Tags above the monitor when there is no space at the sides
const STACKED_TAG_POSITIONS: Vec3[] = [
    [-1.1, 3.95, 0.6],
    [1.1, 3.95, 0.6],
    [-1.1, 4.6, 0.6],
    [1.1, 4.6, 0.6],
    [-1.1, 5.25, 0.6],
    [1.1, 5.25, 0.6],
];

const MOBILE_TAG_POSITIONS: Vec3[] = [
    [-2.35, 3.45, 0.6],
    [2.35, 3.45, 0.6],

    [-2.35, 2.75, 0.6],
    [2.35, 2.75, 0.6],

    [-2.35, 2.05, 0.6],
    [2.35, 2.05, 0.6],
];

/* ---------------------------- Mouse -> cursor ---------------------------- */

const MOUSE_Y = DESK_TOP + 0.1;

const MOUSE_LIMITS = {
    minX: 1.4,
    maxX: 2.6,
    minZ: 1.0,
    maxZ: 1.42,
};

function clampMouse(x: number, z: number) {
    const cx = THREE.MathUtils.clamp(
        x,
        MOUSE_LIMITS.minX,
        MOUSE_LIMITS.maxX
    );

    let cz = THREE.MathUtils.clamp(
        z,
        MOUSE_LIMITS.minZ,
        MOUSE_LIMITS.maxZ
    );

    if (cx > 1.6 && cz < 1.22) {
        cz = 1.22;
    }

    return { x: cx, z: cz };
}

// Desk position -> screen position (-1..1)
function toScreenUV(x: number, z: number) {
    const { minX, maxX, minZ, maxZ } = MOUSE_LIMITS;

    return {
        u: ((x - minX) / (maxX - minX)) * 2 - 1,
        v: -(((z - minZ) / (maxZ - minZ)) * 2 - 1),
    };
}

/* ------------------------------ Lamp light ------------------------------ */

const LAMP_SHADE_POS = new THREE.Vector3(0.08, 1.2, 0.05);
const LAMP_TARGET = new THREE.Vector3(1.5, 0.1, 0.4);

const LAMP_DIR = LAMP_TARGET
    .clone()
    .sub(LAMP_SHADE_POS)
    .normalize();

const LAMP_QUAT = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    LAMP_DIR.clone().negate()
);

const LAMP_OPENING = LAMP_SHADE_POS
    .clone()
    .addScaledVector(LAMP_DIR, 0.18);

const LAMP_BULB_POS = LAMP_SHADE_POS
    .clone()
    .addScaledVector(LAMP_DIR, 0.06);

const LAMP_SPREAD = 0.3;
const LAMP_SHADE_RADIUS = 0.27;

const LAMP_DESK = {
    minX: -0.45,
    maxX: 4.05,
    minZ: -1.0,
    maxZ: 0.9,
    y: 0.004,
};

function makeGeometry(
    positions: number[],
    colors: number[],
    indices: number[]
) {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 4)
    );

    geometry.setIndex(indices);

    return geometry;
}

function buildLampLight() {
    const SEGMENTS = 48;

    const clampToDesk = (p: THREE.Vector3) => {
        p.x = THREE.MathUtils.clamp(
            p.x,
            LAMP_DESK.minX,
            LAMP_DESK.maxX
        );

        p.z = THREE.MathUtils.clamp(
            p.z,
            LAMP_DESK.minZ,
            LAMP_DESK.maxZ
        );

        p.y = LAMP_DESK.y;

        return p;
    };

    const up =
        Math.abs(LAMP_DIR.y) > 0.9
            ? new THREE.Vector3(1, 0, 0)
            : new THREE.Vector3(0, 1, 0);

    const u = new THREE.Vector3()
        .crossVectors(LAMP_DIR, up)
        .normalize();

    const v = new THREE.Vector3()
        .crossVectors(LAMP_DIR, u)
        .normalize();

    const starts: THREE.Vector3[] = [];
    const ends: THREE.Vector3[] = [];

    for (let i = 0; i < SEGMENTS; i++) {
        const angle =
            (i / SEGMENTS) * Math.PI * 2;

        const radial = u
            .clone()
            .multiplyScalar(Math.cos(angle))
            .addScaledVector(v, Math.sin(angle));

        const start = LAMP_OPENING
            .clone()
            .addScaledVector(
                radial,
                LAMP_SHADE_RADIUS
            );

        const dir = LAMP_DIR
            .clone()
            .addScaledVector(
                radial,
                Math.tan(LAMP_SPREAD)
            )
            .normalize();

        const t =
            dir.y < -0.05
                ? (LAMP_DESK.y - start.y) / dir.y
                : 6;

        const end = clampToDesk(
            start.clone().addScaledVector(dir, t)
        );

        starts.push(start);
        ends.push(end);
    }

    const beamPos: number[] = [];
    const beamCol: number[] = [];
    const beamIdx: number[] = [];

    starts.forEach((p) => {
        beamPos.push(p.x, p.y, p.z);
        beamCol.push(1, 0.91, 0.66, 0.16);
    });

    ends.forEach((p) => {
        beamPos.push(p.x, p.y, p.z);
        beamCol.push(1, 0.91, 0.66, 0.05);
    });

    for (let i = 0; i < SEGMENTS; i++) {
        const next = (i + 1) % SEGMENTS;

        beamIdx.push(
            i,
            next,
            SEGMENTS + i,
            next,
            SEGMENTS + next,
            SEGMENTS + i
        );
    }

    const t =
        (LAMP_DESK.y - LAMP_OPENING.y) /
        LAMP_DIR.y;

    const center = clampToDesk(
        LAMP_OPENING
            .clone()
            .addScaledVector(LAMP_DIR, t)
    );

    const poolPos: number[] = [
        center.x,
        center.y,
        center.z,
    ];

    const poolCol: number[] = [
        1,
        0.91,
        0.66,
        0.32,
    ];

    const poolIdx: number[] = [];

    ends.forEach((p) => {
        poolPos.push(p.x, p.y, p.z);
        poolCol.push(1, 0.91, 0.66, 0);
    });

    for (let i = 0; i < SEGMENTS; i++) {
        poolIdx.push(
            0,
            i + 1,
            ((i + 1) % SEGMENTS) + 1
        );
    }

    return {
        beam: makeGeometry(
            beamPos,
            beamCol,
            beamIdx
        ),
        pool: makeGeometry(
            poolPos,
            poolCol,
            poolIdx
        ),
    };
}

const LAMP_LIGHT = buildLampLight();

/* -------------------------------------------------------------------------- */
/*                                   AVATAR                                   */
/* -------------------------------------------------------------------------- */

function Avatar({
    hovered,
    imageUrl,
    initials,
}: {
    hovered: boolean;
    imageUrl: string | null;
    initials: string;
}) {
    const [texture, setTexture] =
        useState<THREE.Texture | null>(null);

    useEffect(() => {
        if (!imageUrl) {
            setTexture(null);
            return;
        }

        let cancelled = false;
        let loaded: THREE.Texture | null = null;

        const loader = new THREE.TextureLoader();

        loader.setCrossOrigin("anonymous");

        loader.load(
            imageUrl,
            (tex) => {
                if (cancelled) {
                    tex.dispose();
                    return;
                }

                tex.colorSpace =
                    THREE.SRGBColorSpace;

                const {
                    width,
                    height,
                } = tex.image as {
                    width: number;
                    height: number;
                };

                const aspect = width / height;

                if (aspect > 1) {
                    tex.repeat.set(
                        1 / aspect,
                        1
                    );

                    tex.offset.set(
                        (1 - 1 / aspect) / 2,
                        0
                    );
                } else {
                    tex.repeat.set(
                        1,
                        aspect
                    );

                    tex.offset.set(
                        0,
                        (1 - aspect) / 2
                    );
                }

                loaded = tex;
                setTexture(tex);
            },
            undefined,
            () => {
                if (!cancelled) {
                    setTexture(null);
                }
            }
        );

        return () => {
            cancelled = true;
            loaded?.dispose();
        };
    }, [imageUrl]);

    return (
        <group
            position={[0, 0.2, 0.01]}
            scale={hovered ? 1.06 : 1}
        >
            <mesh position={[0, 0, -0.005]}>
                <ringGeometry
                    args={[0.52, 0.56, 64]}
                />

                <meshBasicMaterial
                    color={C.lime}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            <mesh>
                <circleGeometry
                    args={[0.5, 64]}
                />

                <meshBasicMaterial
                    key={
                        texture
                            ? "with-map"
                            : "no-map"
                    }
                    map={texture ?? undefined}
                    color={
                        texture
                            ? "#FFFFFF"
                            : "#101510"
                    }
                    toneMapped={false}
                />
            </mesh>

            {!texture && (
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.32}
                    color={C.lime}
                    anchorX="center"
                    anchorY="middle"
                >
                    {initials}
                </Text>
            )}
        </group>
    );
}

/* -------------------------------------------------------------------------- */
/*                               SCREEN CURSOR                                */
/* -------------------------------------------------------------------------- */

function ScreenCursor({
    target,
    isDark,
}: {
    target: CursorTarget;
    isDark: boolean;
}) {
    const ref = useRef<THREE.Mesh>(null);

    const shape = useMemo(() => {
        const s = new THREE.Shape();

        s.moveTo(0, 0);
        s.lineTo(0, -0.22);
        s.lineTo(0.055, -0.17);
        s.lineTo(0.1, -0.27);
        s.lineTo(0.135, -0.25);
        s.lineTo(0.09, -0.16);
        s.lineTo(0.16, -0.16);
        s.closePath();

        return s;
    }, []);

    useFrame(() => {
        if (!ref.current) return;

        const { u, v } = target.current;

        ref.current.position.x =
            THREE.MathUtils.lerp(
                ref.current.position.x,
                u * 1.6,
                0.25
            );

        ref.current.position.y =
            THREE.MathUtils.lerp(
                ref.current.position.y,
                v * 0.75 - 0.1,
                0.25
            );
    });

    return (
        <mesh
            ref={ref}
            position={[0, 0, 0.04]}
            raycast={() => null}
        >
            <shapeGeometry args={[shape]} />

            <meshBasicMaterial
                color={
                    isDark
                        ? "#FFFFFF"
                        : "#111111"
                }
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}

/* -------------------------------------------------------------------------- */
/*                                   MONITOR                                  */
/* -------------------------------------------------------------------------- */

type MonitorProps = {
    onOpen: () => void;
    profile: PortfolioProfile;
    role: string | null;
    imageUrl: string | null;
    cursorTarget: CursorTarget;
    isDark: boolean;
};

function MonitorScreen({
    onOpen,
    profile,
    role,
    imageUrl,
    cursorTarget,
    isDark,
}: MonitorProps) {
    const [hovered, setHovered] =
        useState(false);

    useEffect(() => {
        document.body.style.cursor =
            hovered ? "pointer" : "auto";

        return () => {
            document.body.style.cursor = "auto";
        };
    }, [hovered]);

    const screenColor = isDark
        ? "#080B08"
        : "#F1F2EE";

    const screenEmissive = isDark
        ? "#172000"
        : "#DDE7B0";

    const topBarColor = isDark
        ? "#111411"
        : "#E2E4DF";

    const primaryText = isDark
        ? "#FFFFFF"
        : "#111111";

    const mutedText = isDark
        ? "#737873"
        : "#686D68";

    const secondaryText = isDark
        ? "#E5EAE5"
        : "#303530";

    return (
        <group position={[0, 0, 0.095]}>
            {/* Clickable screen */}
            <mesh
                onClick={onOpen}
                onPointerOver={() =>
                    setHovered(true)
                }
                onPointerOut={() =>
                    setHovered(false)
                }
            >
                <planeGeometry
                    args={[3.7, 2.25]}
                />

                <meshStandardMaterial
                    color={screenColor}
                    emissive={screenEmissive}
                    emissiveIntensity={
                        hovered ? 1.2 : 0.45
                    }
                    roughness={0.2}
                />
            </mesh>

            {/* Top bar */}
            <mesh
                position={[0, 1.0, 0.005]}
            >
                <planeGeometry
                    args={[3.7, 0.25]}
                />

                <meshBasicMaterial
                    color={topBarColor}
                />
            </mesh>

            {[C.lime, primaryText, "#555555"].map(
                (color, index) => (
                    <mesh
                        key={color}
                        position={[
                            -1.7 +
                            index * 0.12,
                            1.0,
                            0.01,
                        ]}
                    >
                        <circleGeometry
                            args={[0.035, 16]}
                        />

                        <meshBasicMaterial
                            color={color}
                            transparent
                            opacity={
                                index === 0
                                    ? 0.9
                                    : 0.45
                            }
                        />
                    </mesh>
                )
            )}

            <Text
                position={[
                    -1.3,
                    1.0,
                    0.01,
                ]}
                fontSize={0.09}
                color={mutedText}
                anchorX="left"
                anchorY="middle"
            >
                profile.tsx
            </Text>

            <group
                position={[0, 0, 0.01]}
            >
                <Avatar
                    hovered={hovered}
                    imageUrl={imageUrl}
                    initials={makeInitials(
                        profile.name
                    )}
                />

                <Text
                    position={[0, -0.55, 0]}
                    fontSize={0.17}
                    color={primaryText}
                    anchorX="center"
                    anchorY="middle"
                >
                    {profile.name}
                </Text>

                <Text
                    position={[0, -0.78, 0]}
                    fontSize={0.1}
                    color={C.lime}
                    anchorX="center"
                    anchorY="middle"
                >
                    {role}
                </Text>

                <Text
                    position={[0, -0.98, 0]}
                    fontSize={0.075}
                    color={
                        hovered
                            ? secondaryText
                            : mutedText
                    }
                    anchorX="center"
                    anchorY="middle"
                >
                    Click to explore
                </Text>
            </group>

            <ScreenCursor
                target={cursorTarget}
                isDark={isDark}
            />
        </group>
    );
}

function Monitor(props: MonitorProps) {
    return (
        <group position={[0, 2.0, 0]}>
            {/* Bezel */}
            <RoundedBox
                args={[4.0, 2.55, 0.18]}
                radius={0.1}
                smoothness={5}
            >
                <meshStandardMaterial
                    {...silver(C.bezel)}
                    metalness={0.5}
                    roughness={0.25}
                />
            </RoundedBox>

            <MonitorScreen {...props} />

            {/* Stand */}
            <mesh
                position={[0, -1.48, 0]}
            >
                <boxGeometry
                    args={[0.25, 0.65, 0.25]}
                />

                <meshStandardMaterial
                    {...silver(C.stand)}
                />
            </mesh>

            <RoundedBox
                args={[1.1, 0.1, 0.62]}
                radius={0.04}
                smoothness={3}
                position={[0, -1.8, 0]}
            >
                <meshStandardMaterial
                    {...silver(C.stand)}
                />
            </RoundedBox>

            <pointLight
                position={[0, 0, 1.2]}
                intensity={1.4}
                distance={4}
                color={C.lime}
            />
        </group>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  KEYBOARD                                  */
/* -------------------------------------------------------------------------- */

function Keyboard() {
    const rows = 4;
    const cols = 12;

    const keys: [number, number][] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            keys.push([
                (c - (cols - 1) / 2) * 0.175,
                (r - (rows - 1) / 2) * 0.13,
            ]);
        }
    }

    return (
        <group
            position={[
                -0.2,
                DESK_TOP + 0.065,
                1.1,
            ]}
        >
            <RoundedBox
                args={[2.6, 0.13, 0.82]}
                radius={0.06}
                smoothness={3}
            >
                <meshStandardMaterial
                    {...silver(C.keyboardBody)}
                />
            </RoundedBox>

            <RoundedBox
                args={[2.3, 0.03, 0.62]}
                radius={0.03}
                smoothness={2}
                position={[0, 0.075, 0]}
            >
                <meshStandardMaterial
                    color={C.keyboardInset}
                    roughness={0.5}
                />
            </RoundedBox>

            {keys.map(([x, z], index) => (
                <mesh
                    key={index}
                    position={[x, 0.105, z]}
                >
                    <boxGeometry
                        args={[
                            0.14,
                            0.03,
                            0.1,
                        ]}
                    />

                    <meshStandardMaterial
                        color={C.key}
                        roughness={0.5}
                    />
                </mesh>
            ))}

            {/* Lime accent */}
            <mesh
                position={[0, 0, 0.415]}
            >
                <boxGeometry
                    args={[2.3, 0.02, 0.01]}
                />

                <meshBasicMaterial
                    color={C.lime}
                />
            </mesh>
        </group>
    );
}

/* -------------------------------------------------------------------------- */
/*                                    MOUSE                                   */
/* -------------------------------------------------------------------------- */

function Mouse({
    cursorTarget,
}: {
    cursorTarget: CursorTarget;
}) {
    const groupRef =
        useRef<THREE.Group>(null);

    const pos = useRef({
        x: 1.5,
        z: 1.1,
    });

    const grabOffset = useRef({
        x: 0,
        z: 0,
    });

    const [hovered, setHovered] =
        useState(false);

    const [dragging, setDragging] =
        useState(false);

    const controls = useThree(
        (state) =>
            state.controls as {
                enabled: boolean;
            } | null
    );

    useEffect(() => {
        cursorTarget.current =
            toScreenUV(
                pos.current.x,
                pos.current.z
            );
    }, [cursorTarget]);

    useEffect(() => {
        document.body.style.cursor =
            dragging
                ? "grabbing"
                : hovered
                    ? "grab"
                    : "auto";

        return () => {
            document.body.style.cursor =
                "auto";
        };
    }, [hovered, dragging]);

    const stopDrag = () => {
        setDragging(false);

        if (controls) {
            controls.enabled = true;
        }
    };

    useEffect(() => {
        if (!dragging) return;

        window.addEventListener(
            "pointerup",
            stopDrag
        );

        return () =>
            window.removeEventListener(
                "pointerup",
                stopDrag
            );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragging]);

    const toLocal = (
        point: THREE.Vector3
    ) => {
        const parent =
            groupRef.current?.parent;

        return parent
            ? parent.worldToLocal(
                point.clone()
            )
            : point;
    };

    const moveTo = (
        x: number,
        z: number
    ) => {
        const c = clampMouse(x, z);

        pos.current = c;

        groupRef.current?.position.set(
            c.x,
            MOUSE_Y,
            c.z
        );

        cursorTarget.current =
            toScreenUV(c.x, c.z);
    };

    return (
        <>
            <group
                ref={groupRef}
                position={[
                    1.5,
                    MOUSE_Y,
                    1.1,
                ]}
                scale={
                    hovered || dragging
                        ? 1.06
                        : 1
                }
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={() =>
                    setHovered(false)
                }
                onPointerDown={(e) => {
                    e.stopPropagation();

                    const p = toLocal(
                        e.point
                    );

                    grabOffset.current = {
                        x:
                            pos.current.x -
                            p.x,
                        z:
                            pos.current.z -
                            p.z,
                    };

                    setDragging(true);

                    if (controls) {
                        controls.enabled =
                            false;
                    }
                }}
            >
                <mesh
                    scale={[
                        0.75,
                        0.5,
                        1,
                    ]}
                >
                    <sphereGeometry
                        args={[
                            0.28,
                            32,
                            20,
                        ]}
                    />

                    <meshStandardMaterial
                        {...silver(C.mouse)}
                    />
                </mesh>

                <mesh
                    position={[
                        0,
                        0.13,
                        -0.02,
                    ]}
                >
                    <boxGeometry
                        args={[
                            0.02,
                            0.015,
                            0.13,
                        ]}
                    />

                    <meshBasicMaterial
                        color={C.lime}
                    />
                </mesh>
            </group>

            {/* Invisible plane that tracks the pointer while dragging */}
            {dragging && (
                <mesh
                    position={[
                        0,
                        MOUSE_Y + 0.05,
                        0.5,
                    ]}
                    rotation={[
                        -Math.PI / 2,
                        0,
                        0,
                    ]}
                    onPointerMove={(e) => {
                        const p = toLocal(
                            e.point
                        );

                        moveTo(
                            p.x +
                            grabOffset
                                .current
                                .x,
                            p.z +
                            grabOffset
                                .current
                                .z
                        );
                    }}
                    onPointerUp={stopDrag}
                >
                    <planeGeometry
                        args={[8, 6]}
                    />

                    <meshBasicMaterial
                        transparent
                        opacity={0}
                        depthWrite={false}
                        side={
                            THREE.DoubleSide
                        }
                    />
                </mesh>
            )}
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  DESK LAMP                                 */
/* -------------------------------------------------------------------------- */

const lightMaterialProps = {
    vertexColors: true,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
} as const;

function DeskLamp({
    on,
    onToggle,
}: {
    on: boolean;
    onToggle: () => void;
}) {
    const [hovered, setHovered] =
        useState(false);

    useEffect(() => {
        document.body.style.cursor =
            hovered ? "pointer" : "auto";

        return () => {
            document.body.style.cursor =
                "auto";
        };
    }, [hovered]);

    return (
        <group
            position={[
                -2.25,
                DESK_TOP,
                0.6,
            ]}
            scale={1.25}
        >
            {/* Invisible click area */}
            <mesh
                position={[0, 0.65, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={() =>
                    setHovered(false)
                }
            >
                <cylinderGeometry
                    args={[
                        0.5,
                        0.5,
                        1.6,
                        12,
                    ]}
                />

                <meshBasicMaterial
                    transparent
                    opacity={0}
                    depthWrite={false}
                />
            </mesh>

            {/* Base */}
            <mesh
                position={[0, 0.04, 0]}
            >
                <cylinderGeometry
                    args={[
                        0.27,
                        0.3,
                        0.08,
                        24,
                    ]}
                />

                <meshStandardMaterial
                    {...silver(C.stand)}
                />
            </mesh>

            {/* Arm */}
            <mesh
                position={[0, 0.6, 0]}
            >
                <cylinderGeometry
                    args={[
                        0.035,
                        0.035,
                        1.1,
                        12,
                    ]}
                />

                <meshStandardMaterial
                    {...silver(C.lampArm)}
                />
            </mesh>

            {/* Shade */}
            <mesh
                position={LAMP_SHADE_POS}
                quaternion={LAMP_QUAT}
            >
                <coneGeometry
                    args={[
                        LAMP_SHADE_RADIUS,
                        0.36,
                        24,
                        1,
                        true,
                    ]}
                />

                <meshStandardMaterial
                    {...silver(
                        C.lampShade
                    )}
                    side={THREE.DoubleSide}
                    emissive={
                        on
                            ? "#FFD98A"
                            : "#000000"
                    }
                    emissiveIntensity={
                        on ? 0.35 : 0
                    }
                />
            </mesh>

            {/* Bulb */}
            <mesh
                position={LAMP_BULB_POS}
            >
                <sphereGeometry
                    args={[
                        0.07,
                        16,
                        16,
                    ]}
                />

                <meshBasicMaterial
                    color={
                        on
                            ? "#FFF7D6"
                            : "#6B6F73"
                    }
                />
            </mesh>

            {on && (
                <>
                    {/* Glow around the bulb */}
                    <mesh
                        position={
                            LAMP_BULB_POS
                        }
                    >
                        <sphereGeometry
                            args={[
                                0.16,
                                16,
                                16,
                            ]}
                        />

                        <meshBasicMaterial
                            color="#FFE9A8"
                            transparent
                            opacity={0.25}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* Beam */}
                    <mesh
                        geometry={
                            LAMP_LIGHT.beam
                        }
                        renderOrder={2}
                    >
                        <meshBasicMaterial
                            {...lightMaterialProps}
                        />
                    </mesh>

                    {/* Light pool */}
                    <mesh
                        geometry={
                            LAMP_LIGHT.pool
                        }
                        renderOrder={1}
                    >
                        <meshBasicMaterial
                            {...lightMaterialProps}
                        />
                    </mesh>
                </>
            )}

            <pointLight
                position={LAMP_BULB_POS}
                intensity={on ? 14 : 0}
                distance={7}
                decay={2}
                color="#FFF4D0"
            />
        </group>
    );
}

/* -------------------------------------------------------------------------- */
/*                                    PLANT                                   */
/* -------------------------------------------------------------------------- */

const PLANT_LEAVES: [
    number,
    number,
    number,
    number,
    string
][] = [
        [-0.2, 0.75, -0.6, 0.38, "#3E7A55"],
        [0.2, 0.85, 0.6, 0.4, "#4E8F65"],
        [-0.08, 1.0, -0.2, 0.42, "#5FA575"],
        [0.1, 1.1, 0.25, 0.36, "#6FB585"],
        [0, 0.65, 0, 0.3, "#3E7A55"],
    ];

function Plant() {
    return (
        <group
            position={[
                2.25,
                DESK_TOP,
                0.6,
            ]}
            scale={1.3}
        >
            <mesh
                position={[0, 0.19, 0]}
            >
                <cylinderGeometry
                    args={[
                        0.26,
                        0.2,
                        0.38,
                        24,
                    ]}
                />

                <meshStandardMaterial
                    color="#7F878D"
                    roughness={0.5}
                />
            </mesh>

            <mesh
                position={[0, 0.6, 0]}
            >
                <cylinderGeometry
                    args={[
                        0.02,
                        0.025,
                        0.7,
                        10,
                    ]}
                />

                <meshStandardMaterial
                    color="#3F5E48"
                    roughness={0.8}
                />
            </mesh>

            {PLANT_LEAVES.map(
                (
                    [
                        x,
                        y,
                        rotation,
                        height,
                        color,
                    ],
                    index
                ) => (
                    <mesh
                        key={index}
                        position={[
                            x,
                            y,
                            0,
                        ]}
                        rotation={[
                            0,
                            0,
                            rotation,
                        ]}
                        scale={[
                            0.14,
                            height,
                            0.05,
                        ]}
                    >
                        <sphereGeometry
                            args={[
                                1,
                                16,
                                12,
                            ]}
                        />

                        <meshStandardMaterial
                            color={color}
                            roughness={0.7}
                        />
                    </mesh>
                )
            )}
        </group>
    );
}

/* -------------------------------------------------------------------------- */
/*                                    DESK                                    */
/* -------------------------------------------------------------------------- */

function Desk({
    lampOn,
    onLampToggle,
    cursorTarget,
}: {
    lampOn: boolean;
    onLampToggle: () => void;
    cursorTarget: CursorTarget;
}) {
    return (
        <group>
            {/* Surface */}
            <RoundedBox
                args={[5.8, 0.3, 2.5]}
                radius={0.08}
                smoothness={4}
                position={[0, 0, 0.5]}
            >
                <meshStandardMaterial
                    {...silver(C.deskTop)}
                />
            </RoundedBox>

            {/* Lime accent */}
            <mesh
                position={[
                    0,
                    -0.16,
                    1.76,
                ]}
            >
                <boxGeometry
                    args={[
                        5.4,
                        0.025,
                        0.025,
                    ]}
                />

                <meshBasicMaterial
                    color={C.lime}
                />
            </mesh>

            {/* Legs */}
            {[-2.4, 2.4].flatMap((x) =>
                [-0.55, 1.55].map(
                    (z) => (
                        <mesh
                            key={`${x}-${z}`}
                            position={[
                                x,
                                -1.1,
                                z,
                            ]}
                        >
                            <boxGeometry
                                args={[
                                    0.25,
                                    2.1,
                                    0.25,
                                ]}
                            />

                            <meshStandardMaterial
                                {...silver(
                                    C.deskLeg
                                )}
                            />
                        </mesh>
                    )
                )
            )}

            <Keyboard />
            <Mouse
                cursorTarget={
                    cursorTarget
                }
            />

            <DeskLamp
                on={lampOn}
                onToggle={
                    onLampToggle
                }
            />

            <Plant />
        </group>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  TECH TAGS                                 */
/* -------------------------------------------------------------------------- */

function TechTag({
    position,
    title,
    subtitle,
    compact,
    isDark,
}: {
    position: Vec3;
    title: string;
    subtitle: string;
    compact: boolean;
    isDark: boolean;
}) {
    const background = isDark
        ? "rgba(10,12,10,0.9)"
        : "rgba(247,247,245,0.94)";

    const titleColor = isDark
        ? "#FFFFFF"
        : "#111111";

    const subtitleColor = isDark
        ? "#737873"
        : "#666B66";

    const shadow = isDark
        ? "0 8px 25px rgba(0,0,0,0.5)"
        : "0 8px 25px rgba(0,0,0,0.12)";

    return (
        <Float
            speed={1}
            rotationIntensity={0}
            floatIntensity={0.2}
        >
            <group position={position}>
                <Html
                    center
                    zIndexRange={[20, 0]}
                    style={{
                        pointerEvents:
                            "none",
                    }}
                >
                    <div
                        className={`flex max-w-[130px] select-none items-center whitespace-nowrap rounded-lg border border-[#C7FF00]/50 backdrop-blur-md ${compact
                                ? "px-1.5 py-1"
                                : "px-2 py-1.5"
                            }`}
                        style={{
                            background,
                            boxShadow: shadow,
                        }}
                    >
                        <span className="flex min-w-0 flex-col leading-tight">
                            <span
                                className={`truncate font-semibold ${compact
                                        ? "text-[10px]"
                                        : "text-xs"
                                    }`}
                                style={{
                                    color: titleColor,
                                }}
                            >
                                {title}
                            </span>

                            <span
                                className={`truncate ${compact
                                        ? "text-[8px]"
                                        : "text-[9px]"
                                    }`}
                                style={{
                                    color: subtitleColor,
                                }}
                            >
                                {subtitle}
                            </span>
                        </span>
                    </div>
                </Html>
            </group>
        </Float>
    );
}

/* -------------------------------------------------------------------------- */
/*                                PROFILE MODAL                               */
/* -------------------------------------------------------------------------- */

function ProfileModal({
    onClose,
    profile,
    role,
    skills,
    imageUrl,
}: {
    onClose: () => void;
    profile: PortfolioProfile;
    role: string | null;
    skills: PortfolioSkill[];
    imageUrl: string | null;
}) {
    const [imageError, setImageError] =
        useState(false);

    const { resolvedTheme } =
        useTheme();

    const isDark =
        resolvedTheme !== "light";

    return (
        <div
            className="
                fixed inset-0 z-[100]
                flex items-center justify-center
                px-4 py-6
                backdrop-blur-md
                sm:px-5
            "
            style={{
                background: isDark
                    ? "rgba(0,0,0,0.75)"
                    : "rgba(20,20,20,0.35)",
            }}
            onClick={onClose}
        >
            <div
                className="
                    relative max-h-[90vh]
                    w-full max-w-2xl
                    overflow-y-auto
                    rounded-2xl
                    shadow-[0_0_80px_rgba(199,255,0,0.08)]
                    sm:rounded-3xl
                "
                style={{
                    border: isDark
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid rgba(0,0,0,0.1)",
                    background: isDark
                        ? "rgba(11,11,11,0.95)"
                        : "rgba(247,247,245,0.97)",
                }}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <div
                    className="
                        pointer-events-none
                        absolute -left-24 -top-24
                        h-64 w-64
                        rounded-full
                        bg-[#C7FF00]/[0.06]
                        blur-[90px]
                    "
                />

                <div className="relative grid gap-6 p-5 sm:grid-cols-[180px_1fr] sm:gap-8 sm:p-9">
                    {/* Image */}
                    <div className="flex items-center justify-center">
                        <div
                            className="
                                relative aspect-square
                                w-full max-w-[130px]
                                overflow-hidden
                                rounded-2xl
                                shadow-[0_0_45px_rgba(199,255,0,0.08)]
                                sm:max-w-[220px]
                            "
                            style={{
                                border: "1px solid rgba(199,255,0,0.2)",
                                background:
                                    isDark
                                        ? "#171717"
                                        : "#E8E8E4",
                            }}
                        >
                            {imageUrl &&
                                !imageError ? (
                                <img
                                    src={imageUrl}
                                    alt={
                                        profile.name
                                    }
                                    onError={() =>
                                        setImageError(
                                            true
                                        )
                                    }
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className="
                                        flex h-full w-full
                                        items-center justify-center
                                        text-4xl
                                        font-semibold
                                        text-[#C7FF00]
                                    "
                                    style={{
                                        background:
                                            isDark
                                                ? "#101510"
                                                : "#E5E9DF",
                                    }}
                                >
                                    {makeInitials(
                                        profile.name
                                    )}
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C7FF00]" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#C7FF00]">
                                Developer Profile
                            </span>
                        </div>

                        <h2
                            className="
                                text-2xl
                                font-medium
                                tracking-tight
                                sm:text-3xl
                            "
                            style={{
                                color: isDark
                                    ? "#FFFFFF"
                                    : "#111111",
                            }}
                        >
                            {profile.name}
                        </h2>

                        {role && (
                            <p className="mt-2 text-sm font-medium text-[#C7FF00]">
                                {role}
                            </p>
                        )}

                        {profile.bio && (
                            <p
                                className="mt-4 max-w-md text-sm leading-6"
                                style={{
                                    color: isDark
                                        ? "#A3A3A3"
                                        : "#5F625F",
                                }}
                            >
                                {profile.bio}
                            </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                            {skills.map(
                                (skill) => (
                                    <span
                                        key={
                                            skill.id
                                        }
                                        className="
                                            rounded-full
                                            border
                                            px-3 py-1.5
                                            text-[11px]
                                        "
                                        style={{
                                            borderColor:
                                                isDark
                                                    ? "rgba(255,255,255,0.1)"
                                                    : "rgba(0,0,0,0.1)",
                                            background:
                                                isDark
                                                    ? "rgba(255,255,255,0.04)"
                                                    : "rgba(0,0,0,0.035)",
                                            color:
                                                isDark
                                                    ? "#D4D4D4"
                                                    : "#454845",
                                        }}
                                    >
                                        {
                                            skill.name
                                        }
                                    </span>
                                )
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                            <span
                                className="text-xs"
                                style={{
                                    color: isDark
                                        ? "#525252"
                                        : "#737773",
                                }}
                            >
                                {
                                    profile.location
                                }
                            </span>

                            <button
                                type="button"
                                onClick={
                                    onClose
                                }
                                className="
                                    rounded-full
                                    border
                                    px-4 py-2
                                    text-[11px]
                                    font-medium
                                    transition
                                    hover:border-[#C7FF00]/30
                                    hover:text-[#C7FF00]
                                "
                                style={{
                                    borderColor:
                                        isDark
                                            ? "rgba(255,255,255,0.1)"
                                            : "rgba(0,0,0,0.1)",
                                    background:
                                        isDark
                                            ? "rgba(255,255,255,0.04)"
                                            : "rgba(0,0,0,0.035)",
                                    color:
                                        isDark
                                            ? "#D4D4D4"
                                            : "#454845",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                    SCENE                                   */
/* -------------------------------------------------------------------------- */

function Scene({
    onOpenProfile,
    profile,
    role,
    skills,
    imageUrl,
    isDark,
}: {
    onOpenProfile: () => void;
    profile: PortfolioProfile;
    role: string | null;
    skills: PortfolioSkill[];
    imageUrl: string | null;
    isDark: boolean;
}) {
    const groupRef =
        useRef<THREE.Group>(null);

    const cursorTarget =
        useRef({
            u: 0,
            v: 0,
        });

    const {
        size,
        camera,
        gl,
    } = useThree();

    const [lampOn, setLampOn] =
        useState(false);

    const isMobile =
        size.width < 640;

    const compact =
        size.width < 1024;

    useFrame((state) => {
        if (!groupRef.current) return;

        groupRef.current.position.y =
            SCENE_Y +
            Math.sin(
                state.clock.elapsedTime *
                0.5
            ) *
            0.03;
    });

    const {
        distance,
        tagsFitAtSides,
        sideX,
    } = useMemo(() => {
        const cam =
            camera as THREE.PerspectiveCamera;

        const aspect =
            size.width / size.height;

        const tanHalf = Math.tan(
            THREE.MathUtils.degToRad(
                cam.fov / 2
            )
        );

        const neededWidth =
            isMobile ? 7.2 : 9.4;

        const dist = Math.max(
            11.5,
            neededWidth /
            (2 *
                tanHalf *
                aspect)
        );

        const halfVisibleW =
            (dist - 0.6) *
            tanHalf *
            aspect;

        const worldPerPx =
            (2 * halfVisibleW) /
            size.width;

        const tagHalfW =
            60 * worldPerPx;

        const x = Math.min(
            3.4,
            halfVisibleW -
            tagHalfW -
            0.15
        );

        return {
            distance: dist,
            sideX: x,
            tagsFitAtSides:
                x >= 2.55,
        };
    }, [
        camera,
        size.width,
        size.height,
        isMobile,
    ]);

    useEffect(() => {
        const cam =
            camera as THREE.PerspectiveCamera;

        cam.position.set(
            0,
            1.6,
            distance
        );

        cam.lookAt(
            0,
            1.2,
            0
        );

        cam.updateProjectionMatrix();
    }, [
        camera,
        distance,
    ]);

    useEffect(() => {
        gl.domElement.style.touchAction =
            "pan-y";
    }, [gl]);

    const tagPositions = isMobile
        ? MOBILE_TAG_POSITIONS
        : tagsFitAtSides
            ? sideTagPositions(sideX)
            : STACKED_TAG_POSITIONS;

    const ambientIntensity =
        isDark ? 0.5 : 0.7;

    const directionalColor =
        isDark
            ? "#FFFFFF"
            : "#E5E5E0";

    const secondaryLight =
        isDark
            ? "#FFFFFF"
            : "#CFCFC8";

    return (
        <>
            {/* Lights */}
            <ambientLight
                intensity={
                    lampOn
                        ? ambientIntensity +
                        0.15
                        : ambientIntensity
                }
            />

            <hemisphereLight
                args={[
                    directionalColor,
                    isDark
                        ? "#050505"
                        : "#DADAD4",
                    0.65,
                ]}
            />

            <directionalLight
                position={[4, 6, 6]}
                intensity={
                    isDark ? 1.5 : 1.15
                }
                color={directionalColor}
            />

            <pointLight
                position={[
                    -5,
                    3,
                    3,
                ]}
                intensity={8}
                distance={14}
                color={C.lime}
            />

            <pointLight
                position={[
                    5,
                    2,
                    -2,
                ]}
                intensity={
                    isDark ? 5 : 3
                }
                distance={12}
                color={secondaryLight}
            />

            <group
                ref={groupRef}
                position={[
                    0,
                    SCENE_Y,
                    0,
                ]}
            >
                <Desk
                    lampOn={lampOn}
                    onLampToggle={() =>
                        setLampOn(
                            (v) => !v
                        )
                    }
                    cursorTarget={
                        cursorTarget
                    }
                />

                <Monitor
                    onOpen={
                        onOpenProfile
                    }
                    profile={profile}
                    role={role}
                    imageUrl={imageUrl}
                    cursorTarget={
                        cursorTarget
                    }
                    isDark={isDark}
                />

                {skills
                    .slice(
                        0,
                        tagPositions.length
                    )
                    .map(
                        (
                            skill,
                            index
                        ) => (
                            <TechTag
                                key={
                                    skill.id
                                }
                                position={
                                    tagPositions[
                                    index
                                    ]
                                }
                                title={
                                    skill.name
                                }
                                subtitle={
                                    skill.category
                                }
                                compact={
                                    compact
                                }
                                isDark={
                                    isDark
                                }
                            />
                        )
                    )}

                {/* Floor ring */}
                <mesh
                    rotation={[
                        -Math.PI / 2,
                        0,
                        0,
                    ]}
                    position={[
                        0,
                        -2.14,
                        0.5,
                    ]}
                >
                    <ringGeometry
                        args={[
                            3.2,
                            3.3,
                            64,
                        ]}
                    />

                    <meshBasicMaterial
                        color={C.lime}
                        transparent
                        opacity={0.16}
                    />
                </mesh>

                <ContactShadows
                    position={[
                        0,
                        -2.14,
                        0.5,
                    ]}
                    opacity={
                        isDark
                            ? 0.55
                            : 0.3
                    }
                    scale={12}
                    blur={2.5}
                    far={4}
                />

                <Sparkles
                    count={28}
                    scale={[9, 6, 3]}
                    size={1.6}
                    speed={0.15}
                    color={
                        isDark
                            ? "#FFFFFF"
                            : "#222222"
                    }
                    position={[
                        0,
                        2,
                        0,
                    ]}
                />
            </group>

            <OrbitControls
                makeDefault
                target={[
                    0,
                    1.2,
                    0,
                ]}
                enableZoom={false}
                enablePan={false}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={0.55}
                minAzimuthAngle={-0.85}
                maxAzimuthAngle={0.85}
                minPolarAngle={
                    Math.PI / 2.6
                }
                maxPolarAngle={
                    Math.PI / 1.85
                }
            />
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*                                 HERO SCENE                                 */
/* -------------------------------------------------------------------------- */

type HeroSceneProps = {
    profile: PortfolioProfile;
    skills: PortfolioSkill[];
};

export default function HeroScene({
    profile,
    skills,
}: HeroSceneProps) {
    const [
        isProfileOpen,
        setIsProfileOpen,
    ] = useState(false);

    const {
        resolvedTheme,
    } = useTheme();

    const isDark =
        resolvedTheme !== "light";

    const role =
        getPrimaryRole(
            profile.roles
        );

    const imageUrl =
        getDefaultImageUrl(
            profile
        ) || null;

    return (
        <>
            <div className="h-full min-h-[420px] w-full cursor-grab active:cursor-grabbing">
                <Canvas
                    camera={{
                        position: [
                            0,
                            1.6,
                            11.5,
                        ],
                        fov: 48,
                    }}
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: true,
                        alpha: true,
                    }}
                >
                    <Scene
                        onOpenProfile={() =>
                            setIsProfileOpen(
                                true
                            )
                        }
                        profile={profile}
                        role={role}
                        skills={skills}
                        imageUrl={imageUrl}
                        isDark={isDark}
                    />
                </Canvas>
            </div>

            {isProfileOpen && (
                <ProfileModal
                    onClose={() =>
                        setIsProfileOpen(
                            false
                        )
                    }
                    profile={profile}
                    role={role}
                    skills={skills}
                    imageUrl={imageUrl}
                />
            )}
        </>
    );
}