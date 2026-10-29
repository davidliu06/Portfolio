"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/** Illustrative near-field coupling, not an RF simulation or measured LED timing. */
export function NfcDemo({ progress, chapters, coil, led }: { progress: MutableRefObject<number>; chapters: number; coil: THREE.Vector3; led: THREE.Vector3 }) {
  const root = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const field = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const spill = useRef<THREE.PointLight>(null);
  const blinkTime = useRef(0);
  const screen = useRef<THREE.Mesh>(null);
  const { invalidate } = useThree();
  const textures = useMemo(() => ["Hold near card", "Reading card", "Link received"].map((label, index) => {
    const canvas = document.createElement("canvas"); canvas.width = 600; canvas.height = 1120;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#101a26"; ctx.fillRect(0, 0, 600, 1120);
    ctx.textAlign = "center"; ctx.fillStyle = "#eef4fc";
    ctx.font = "300 104px sans-serif"; ctx.fillText("9:41", 300, 260);
    ctx.font = "26px sans-serif"; ctx.fillStyle = "#adc0d3"; ctx.fillText("Thursday, October 29", 300, 310);
    ctx.fillStyle = index === 2 ? "#e8f3ef" : "#213243";
    ctx.beginPath(); ctx.roundRect(32, 395, 536, index === 2 ? 290 : 195, 32); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = index === 2 ? "#21664f" : "#9fdccb";
    ctx.font = "bold 24px sans-serif"; ctx.fillText(index === 2 ? "NFC TAG DETECTED" : "NFC READER", 62, 446);
    ctx.font = "bold 36px sans-serif"; ctx.fillStyle = index === 2 ? "#102c24" : "#ffffff"; ctx.fillText(label, 62, 503);
    ctx.font = "24px sans-serif"; ctx.fillStyle = index === 2 ? "#36554c" : "#bccbd9";
    ctx.fillText(index === 2 ? "David Liu / Engineering portfolio" : index === 1 ? "Keep your phone close." : "Move the top toward the antenna.", 62, 548);
    if (index === 2) {
      ctx.font = "20px sans-serif"; ctx.fillText("david-s-portfolio-eta.vercel.app", 62, 590);
      ctx.fillStyle = "#21664f"; ctx.font = "bold 24px sans-serif"; ctx.fillText("Open in browser  >", 62, 644);
    }
    ctx.textAlign = "center"; ctx.fillStyle = "#a4b5c5"; ctx.font = "22px sans-serif"; ctx.fillText("0" + (index + 1) + " / 03", 300, 955);
    ctx.fillStyle = "#e8eef4"; ctx.beginPath(); ctx.roundRect(210, 1060, 180, 8, 4); ctx.fill();
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }), []);
  useEffect(() => () => textures.forEach(texture => texture.dispose()), [textures]);
  const haloTexture = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,50,30,0.6)");
    gradient.addColorStop(0.22, "rgba(255,15,5,0.22)");
    gradient.addColorStop(1, "rgba(255,0,0,0)");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useEffect(() => () => haloTexture.dispose(), [haloTexture]);
  useFrame(({ clock }, delta) => {
    const step = progress.current * (chapters - 1);
    if (!root.current || !phone.current || !field.current || !glow.current || !screen.current) return;
    root.current.visible = step > 4.2 && step < 7.9;
    if (!root.current.visible) { blinkTime.current = 0; return; }
    const arrival = THREE.MathUtils.smoothstep(step, 4.4, 5.7);
    const departure = THREE.MathUtils.smoothstep(step, 7.3, 7.9);
    phone.current.position.set(-1.1 - (1 - arrival) * 2.8 - departure * 4, -0.15, -0.65);
    phone.current.rotation.y = Math.PI - 0.1;
    const power = THREE.MathUtils.smoothstep(step, 5.7, 5.95);
    const response = THREE.MathUtils.smoothstep(step, 6.5, 6.95);
    const fade = 1 - THREE.MathUtils.smoothstep(step, 7.25, 7.9);
    // A short electrical-looking flash with a distinct off interval, not a breathing animation.
    if (power > 0.01) blinkTime.current += Math.min(delta, 0.05);
    else blinkTime.current = 0;
    const phase = blinkTime.current % 1.15;
    const pulse = THREE.MathUtils.smoothstep(phase, 0, 0.008) * (1 - THREE.MathUtils.smoothstep(phase, 0.15, 0.195));
    const brightness = power * fade * pulse;
    const ripple = (clock.elapsedTime * 0.65) % 1;
    field.current.scale.setScalar(0.75 + ripple * 0.3);
    (field.current.material as THREE.MeshBasicMaterial).opacity = power * (1 - response) * (1 - ripple) * 0.2;
    (glow.current.material as THREE.MeshBasicMaterial).opacity = brightness;
    if (halo.current) halo.current.material.opacity = brightness * 0.65;
    if (spill.current) spill.current.intensity = brightness * 0.025;
    (screen.current.material as THREE.MeshBasicMaterial).map = textures[response > 0.6 ? 2 : power > 0.5 ? 1 : 0];
    invalidate();
  });
  return <group ref={root} visible={false}>
    <group ref={phone}>
      <RoundedBox args={[1.12, 2.18, 0.12]} radius={0.12} smoothness={4}><meshStandardMaterial color="#747e89" metalness={0.8} roughness={0.25} /></RoundedBox>
      <RoundedBox args={[1.04, 2.1, 0.025]} radius={0.1} position={[0, 0, 0.073]}><meshStandardMaterial color="#040609" /></RoundedBox>
      <mesh ref={screen} position={[0, 0, 0.09]}><planeGeometry args={[0.96, 1.92]} /><meshBasicMaterial map={textures[0]} /></mesh>
      <RoundedBox args={[0.32, 0.08, 0.015]} radius={0.035} position={[0, 0.88, 0.105]}><meshBasicMaterial color="#030507" /></RoundedBox>
    </group>
    <mesh ref={field} position={[coil.x, coil.y, coil.z - 0.015]}><ringGeometry args={[0.47, 0.48, 64]} /><meshBasicMaterial color="#a5ebd5" side={THREE.DoubleSide} transparent opacity={0} depthWrite={false} /></mesh>
    <mesh ref={glow} position={led}><planeGeometry args={[0.022, 0.035]} /><meshBasicMaterial color="#ff4935" side={THREE.DoubleSide} toneMapped={false} transparent opacity={0} depthWrite={false} /></mesh>
    <sprite ref={halo} position={led} scale={[0.16, 0.16, 1]}><spriteMaterial map={haloTexture} transparent opacity={0} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
    <pointLight ref={spill} position={[led.x, led.y, led.z - 0.025]} color="#ff2010" intensity={0} distance={0.22} decay={2} />
  </group>;
}
