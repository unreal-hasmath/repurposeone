"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HERO_PLATFORM_CARDS } from "@/data/heroCards";

export interface TunnelCardData {
  item: typeof HERO_PLATFORM_CARDS[0];
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const TUNNEL_CARDS: TunnelCardData[] = HERO_PLATFORM_CARDS.map((item, i) => {
  const goldenAngle = i * 137.5 * (Math.PI / 180);
  const radiusFactorX = 0.28 + (i % 3) * 0.08;
  const radiusFactorY = 0.26 + (i % 2) * 0.09;

  return {
    item,
    angleCos: Math.cos(goldenAngle),
    angleSin: Math.sin(goldenAngle),
    radiusFactorX,
    radiusFactorY,
    rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    index: i,
  };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(140, Math.min(190, stage.width * 0.4))
    : Math.max(220, Math.min(285, stage.width * 0.19));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]: number[]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    }
  );

  return (
    <motion.div
      style={{
        width: cardWidth,
        transform,
        opacity,
        zIndex: card.index + 1,
      }}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none cursor-pointer"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-2xl shadow-indigo-950/15 ring-1 ring-indigo-200/50 hover:ring-indigo-400 transition-all duration-500 hover:shadow-indigo-500/25 hover:scale-[1.02]">
        <img
          src={card.item.svg}
          alt={card.item.title}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent flex items-end p-4">
          <div>
            <div className="inline-block px-2 py-0.5 rounded-md bg-white/90 text-slate-950 text-[10px] font-mono font-bold tracking-wider mb-1">
              {card.item.badge}
            </div>
            <div className="text-xs text-white/90 font-medium">
              {card.item.subtitle}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PerspectiveTunnelHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [stage, setStage] = useState<StageDimensions>({
    width: 1440,
    height: 900,
    isMobile: false,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Smooth scroll tracking across the 320vh corridor
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 28,
    restDelta: 0.0001,
  });

  const pointer = useCameraParallax(!reduce);

  // Center typography scales and fades smoothly on scroll down and reverse on scroll up
  const titleScale = useTransform(smoothProgress, [0, 1], [1, 0.88]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [1, 0.85, 0.35, 0.12]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320vh]"
    >
      {/* Sticky 100vh Viewport Stage */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#f8f9fd] text-[#1a1d2d] select-none flex items-center justify-center"
        style={{
          perspective: stage.isMobile ? "900px" : "1100px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft radial lavender glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(216, 212, 255, 0.45) 0%, rgba(235, 238, 255, 0.2) 35%, rgba(248, 249, 253, 0.98) 70%)"
          }}
        />

        {/* 3 Concentric Ultra-Faint Circular Radar Rings */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="absolute w-[360px] h-[360px] rounded-full border border-[rgba(130,140,220,0.16)]" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-[rgba(130,140,220,0.12)]" />
          <div className="absolute w-[920px] h-[920px] rounded-full border border-[rgba(130,140,220,0.08)]" />
        </div>

        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(130,140,220,0.14)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />

        {/* Center Typography: INTO THE REPURPOSEONE. */}
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity }}
          className="pointer-events-none z-0 flex flex-col items-center text-center px-6 max-w-2xl will-change-transform"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#7c84b8] font-semibold mb-5">
            CONTENT TRANSFORMATION SEQUENCE
          </p>

          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-[-0.04em] leading-[0.95] uppercase bg-gradient-to-b from-[#1a1d2d] to-[#434968] bg-clip-text text-transparent">
            INTO THE
            <br />
            REPURPOSEONE.
          </h1>

          <p className="mt-5 max-w-[320px] text-[15px] font-normal text-[#7c829e] leading-[1.5]">
            Scroll to transform your content across the digital universe.
          </p>
        </motion.div>

        {/* Bottom Scroll Prompt */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#8c92b0]"
        >
          <span>Scroll to Explore</span>
          <div className="h-5 w-px bg-[#8c92b0]/50 animate-pulse" />
        </motion.div>

        {/* 3D Spatial Corridor Plane */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {TUNNEL_CARDS.map((card, i) => (
            <TunnelCard
              key={i}
              card={card}
              progress={smoothProgress}
              pointer={pointer}
              total={TUNNEL_CARDS.length}
              stage={stage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
