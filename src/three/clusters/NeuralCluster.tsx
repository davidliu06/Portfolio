"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useJourneyStore } from "@/store/journeyStore";
import { NeuralNode } from "@/three/components/NeuralNode";

const LAYER_SIZES = [5, 7, 7, 4];
const LAYER_X = [-3.3, -1.1, 1.1, 3.3];

function buildLayers(): THREE.Vector3[][] {
  return LAYER_SIZES.map((count, layerIndex) => {
    const x = LAYER_X[layerIndex];
    return Array.from({ length: count }, (_, i) => {
      const y = (i - (count - 1) / 2) * 0.62;
      const z = Math.sin(i * 1.7 + layerIndex) * 0.5;
      return new THREE.Vector3(x, y, z);
    });
  });
}

function buildConnections(layers: THREE.Vector3[][]) {
  const lines: [THREE.Vector3, THREE.Vector3][] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    const fromLayer = layers[l];
    const toLayer = layers[l + 1];
    fromLayer.forEach((a) => {
      const linkCount = Math.min(toLayer.length, 3);
      const shuffled = [...toLayer].sort(() => Math.random() - 0.5);
      shuffled.slice(0, linkCount).forEach((b) => lines.push([a, b]));
    });
  }
  return lines;
}

function createPulse(layers: THREE.Vector3[][]) {
  const layerIndex = Math.floor(Math.random() * (layers.length - 1));
  const fromLayer = layers[layerIndex];
  const toLayer = layers[layerIndex + 1];
  return {
    from: fromLayer[Math.floor(Math.random() * fromLayer.length)],
    to: toLayer[Math.floor(Math.random() * toLayer.length)],
    t: Math.random(),
    speed: 0.5 + Math.random() * 0.5
  };
}

function DataPulses({ layers, count = 14 }: { layers: THREE.Vector3[][]; count?: number }) {
  const pulses = useRef(Array.from({ length: count }, () => createPulse(layers)));
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    pulses.current.forEach((pulse, i) => {
      pulse.t += delta * pulse.speed;
      if (pulse.t >= 1) {
        pulses.current[i] = createPulse(layers);
        return;
      }
      const mesh = meshRefs.current[i];
      if (mesh) mesh.position.lerpVectors(pulse.from, pulse.to, pulse.t);
    });
  });

  return (
    <>
      {pulses.current.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#dff3ff" toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/** Active only during the ai chapter. */
export function NeuralCluster() {
  const groupRef = useRef<THREE.Group>(null);
  const layers = useMemo(buildLayers, []);
  const connections = useMemo(() => buildConnections(layers), [layers]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = useJourneyStore.getState().activeChapter === "ai";
  });

  return (
    <group ref={groupRef}>
      {connections.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color="#8B5CF6" transparent opacity={0.3} lineWidth={1} />
      ))}
      {layers.map((layer, layerIndex) =>
        layer.map((position, nodeIndex) => (
          <NeuralNode
            key={`${layerIndex}-${nodeIndex}`}
            position={[position.x, position.y, position.z]}
            color={layerIndex % 2 === 0 ? "#2F5DFF" : "#FF5D3A"}
          />
        ))
      )}
      <DataPulses layers={layers} />
    </group>
  );
}
