import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (typeof window === "undefined") return () => {};

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    autoRaf: false,
    smoothWheel: true,
    lerp: 0.12,
    wheelMultiplier: 0.9,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const onTick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(onTick);
    lenis?.destroy();
    lenis = null;
  };
}

export function getLenis() {
  return lenis;
}
