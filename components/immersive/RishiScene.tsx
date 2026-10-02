"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneBus } from "./scene-bus";

function unit(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function smoothstep(value: number, edge0: number, edge1: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function petalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.08);
  shape.bezierCurveTo(0.42, 0.55, 0.34, 1.35, 0, 1.92);
  shape.bezierCurveTo(-0.34, 1.35, -0.42, 0.55, 0, 0.08);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.016,
    bevelSegments: 1,
  });
  geometry.translate(0, -0.12, -0.03);
  return geometry;
}

function circuitLoop(radius: number, squash: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius * squash, 0, Math.PI * 2, false, 0);
  const points = curve.getPoints(sceneBus.mobile ? 72 : 128).map((point) => new THREE.Vector3(point.x, 0, point.y));
  return new THREE.BufferGeometry().setFromPoints(points);
}

function LotusCore() {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => petalGeometry(), []);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node || !sceneBus.visible) return;
    const fold = smoothstep(sceneBus.scroll, 0.34, 0.88);
    const open = Math.max(0.08, sceneBus.boot * (1 - fold * 0.78));
    node.scale.setScalar(open);
    node.rotation.y += delta * (0.22 + sceneBus.scroll * 0.55);
    node.rotation.x = 0.48 + sceneBus.py * 0.22 - fold * 0.2;
    node.rotation.z = sceneBus.px * 0.16;
    if (wire.current) wire.current.rotation.y -= delta * 0.35;
  });

  return (
    <group ref={group}>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh key={index} geometry={geometry} rotation={[0.55, 0, (index * Math.PI) / 4]}>
          <meshStandardMaterial
            color={index % 2 === 0 ? "#8a6a32" : "#2c2748"}
            emissive={index % 2 === 0 ? "#f0d090" : "#8b7cff"}
            emissiveIntensity={index % 2 === 0 ? 1.35 : 0.85}
            metalness={0.62}
            roughness={0.28}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <mesh ref={wire}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial color="#c4b6ff" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.34, 0.008, 8, 64]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.7} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#fff8ea" emissive="#f0d090" emissiveIntensity={3.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshBasicMaterial
          color="#d4b46a"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function OrbitRings() {
  const group = useRef<THREE.Group>(null);
  const loops = useMemo(
    () => [circuitLoop(1.95, 0.72), circuitLoop(2.45, 0.58), circuitLoop(2.95, 0.8)],
    [],
  );

  useFrame((_, delta) => {
    const node = group.current;
    if (!node || !sceneBus.visible) return;
    const spread = 0.2 + sceneBus.boot * 0.8 + smoothstep(sceneBus.scroll, 0.04, 0.5) * 0.95;
    node.scale.setScalar(spread);
    node.rotation.y += delta * (0.14 + sceneBus.px * 0.05);
    node.rotation.x = sceneBus.py * 0.12;
  });

  const rings: Array<{ radius: number; color: string; rotation: [number, number, number] }> = [
    { radius: 1.9, color: "#f0d090", rotation: [Math.PI / 2.2, 0.2, 0.1] },
    { radius: 2.45, color: "#8b7cff", rotation: [1.15, 0.85, 0.25] },
    { radius: 2.95, color: "#67e8f9", rotation: [Math.PI / 2.7, -0.55, 0.4] },
    { radius: 3.35, color: "#f3eee4", rotation: [1.35, 0.15, -0.4] },
  ];

  return (
    <group ref={group}>
      {rings.map((ring) => (
        <mesh key={ring.radius} rotation={ring.rotation}>
          <torusGeometry args={[ring.radius, 0.008, 8, sceneBus.mobile ? 72 : 140]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.72} />
        </mesh>
      ))}
      {loops.map((geometry, index) => (
        <lineLoop key={index} geometry={geometry} rotation={[0.4 + index * 0.35, index * 0.4, 0.2]}>
          <lineBasicMaterial color={index === 1 ? "#67e8f9" : "#d4b46a"} transparent opacity={0.35} />
        </lineLoop>
      ))}
      {Array.from({ length: sceneBus.mobile ? 6 : 10 }, (_, index) => {
        const angle = (index / (sceneBus.mobile ? 6 : 10)) * Math.PI * 2;
        const radius = 2.15 + (index % 3) * 0.45;
        return (
          <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(angle * 2) * 0.18, Math.sin(angle) * radius * 0.72]}>
            <sphereGeometry args={[index % 3 === 0 ? 0.045 : 0.028, 10, 10]} />
            <meshBasicMaterial color={index % 2 === 0 ? "#f0d090" : "#67e8f9"} />
          </mesh>
        );
      })}
    </group>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const count = sceneBus.mobile ? 90 : 380;
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = ["#d4b46a", "#67e8f9", "#8b7cff", "#f3eee4"].map((hex) => new THREE.Color(hex));
    for (let index = 0; index < count; index += 1) {
      const radius = 1.4 + unit(index + 1) * 4.2;
      const theta = unit(index + 17) * Math.PI * 2;
      const phi = Math.acos(2 * unit(index + 29) - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.62;
      positions[index * 3 + 2] = radius * Math.cos(phi);
      const color = palette[index % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return buffer;
  }, [count]);

  useFrame((_, delta) => {
    const node = points.current;
    if (!node || !sceneBus.visible) return;
    const material = node.material as THREE.PointsMaterial;
    material.opacity = 0.12 + sceneBus.boot * 0.7 + sceneBus.mastery * 0.15;
    node.rotation.y += delta * (0.045 + Math.abs(sceneBus.px) * 0.08);
    node.rotation.x = sceneBus.py * 0.18;
    const disperse = 0.35 + sceneBus.boot * 0.85 + smoothstep(sceneBus.scroll, 0.15, 0.7) * 0.45;
    const gather = smoothstep(sceneBus.scroll, 0.72, 1);
    node.scale.setScalar(disperse * (1 - gather * 0.25));
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={sceneBus.mobile ? 0.02 : 0.012}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function KnowledgeNet() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const count = 11;
    const radius = 2.65;
    const nodes: THREE.Vector3[] = [];
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
      nodes.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 2) * 0.42,
          Math.sin(angle) * radius * 0.7,
        ),
      );
    }
    const pairs: number[] = [];
    nodes.forEach((node, index) => {
      const next = nodes[(index + 1) % count];
      const skip = nodes[(index + 3) % count];
      pairs.push(node.x, node.y, node.z, next.x, next.y, next.z);
      if (index % 2 === 0) pairs.push(node.x, node.y, node.z, skip.x, skip.y, skip.z);
    });
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(pairs, 3));
    return { buffer, nodes };
  }, []);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node || !sceneBus.visible) return;
    const reveal = Math.max(smoothstep(sceneBus.scroll, 0.22, 0.78), sceneBus.mastery);
    node.scale.setScalar(0.15 + reveal * 1.35);
    node.position.y = (1 - reveal) * -0.4;
    const lines = node.children[0] as THREE.LineSegments;
    const material = lines.material;
    if (material instanceof THREE.LineBasicMaterial) material.opacity = reveal * 0.9;
    const lit = Math.round(sceneBus.mastery * (node.children.length - 1));
    for (let index = 1; index < node.children.length; index += 1) {
      const mesh = node.children[index] as THREE.Mesh;
      const mat = mesh.material;
      if (!(mat instanceof THREE.MeshBasicMaterial)) continue;
      const on = index <= lit || sceneBus.scroll > 0.55;
      mat.color.set(on ? (index === 1 ? "#f3eee4" : index % 3 === 0 ? "#67e8f9" : "#d4b46a") : "#3a3428");
      const scale = on ? 1 : 0.45;
      mesh.scale.setScalar(scale);
    }
    node.rotation.y += delta * 0.1;
    node.rotation.x = sceneBus.py * 0.08;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={geometry.buffer}>
        <lineBasicMaterial color="#f0d090" transparent opacity={0} />
      </lineSegments>
      {geometry.nodes.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[index === 0 ? 0.08 : 0.05, 12, 12]} />
          <meshBasicMaterial color={index === 0 ? "#f3eee4" : index % 3 === 0 ? "#67e8f9" : "#d4b46a"} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig() {
  const light = useRef<THREE.PointLight>(null);
  useFrame((state, delta) => {
    if (!sceneBus.visible) return;
    sceneBus.boot = Math.min(1, sceneBus.boot + delta * 0.55);
    const ease = 1 - (1 - sceneBus.boot) ** 3;
    const depth = THREE.MathUtils.lerp(7.4, 4.35, smoothstep(sceneBus.scroll, 0, 0.85));
    const targetZ = THREE.MathUtils.lerp(13.5, depth, ease);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, sceneBus.px * 0.85, 0.06);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.35 - sceneBus.py * 0.4, 0.06);
    state.camera.lookAt(sceneBus.px * 0.2, 0.78 - sceneBus.scroll * 0.15, 0);
    if (light.current) {
      light.current.position.set(sceneBus.px * 2.6, 1.6 - sceneBus.py * 1.2, 2.2);
      light.current.intensity = 8 + sceneBus.boot * 6 + sceneBus.scroll * 4 + sceneBus.mastery * 10;
    }
  });

  return <pointLight ref={light} color="#f0d090" intensity={12} distance={14} />;
}

function Space() {
  return (
    <>
      <color attach="background" args={["#08080b"]} />
      <fog attach="fog" args={["#08080b", 8, 18]} />
      <ambientLight intensity={0.28} />
      <pointLight position={[-3.2, -1.4, 1]} color="#7aa2ff" intensity={8} distance={12} />
      <pointLight position={[2.4, 2.2, -1]} color="#c084fc" intensity={4} distance={10} />
      <CameraRig />
      <LotusCore />
      <OrbitRings />
      <ParticleField />
      <KnowledgeNet />
    </>
  );
}

export default function RishiScene({ awake }: { awake: boolean }) {
  return (
    <Canvas
      dpr={sceneBus.mobile ? [1, 1.15] : [1, 1.5]}
      camera={{ position: [0, 0.35, 13.5], fov: 36, near: 0.1, far: 40 }}
      gl={{ antialias: !sceneBus.mobile, alpha: false, powerPreference: "high-performance" }}
      frameloop={awake ? "always" : "never"}
    >
      <Space />
    </Canvas>
  );
}
