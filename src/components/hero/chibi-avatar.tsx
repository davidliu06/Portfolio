import Image from "next/image";

export function ChibiAvatar() {
  return (
    <div className="relative mx-auto w-full max-w-[250px]">
      <div className="absolute inset-x-8 bottom-3 h-8 rounded-full bg-violet-950/70 blur-md" />
      <Image
        src="/images/david-chibi.png"
        alt="Chibi game-style avatar of David"
        width={497}
        height={914}
        className="relative z-10 h-auto w-full animate-float drop-shadow-[0_28px_30px_rgba(8,7,25,0.45)]"
      />
    </div>
  );
}
