"use client";

import React, { useMemo } from "react";

export interface GradientConfig {
  from: string;
  via?: string;
  to: string;
  direction?: "diagonal" | "horizontal" | "vertical";
}

export interface AbstractCubeIsometricLoaderProps {
  dotSize?: number;
  gap?: number;
  speed?: number;
  color?: string;
  gradient?: GradientConfig;
  bloom?: boolean;
  opacity?: number;
  className?: string;
}

const MATRIX = ["00100", "01110", "10101", "11011", "01110"] as const;
const ROWS = MATRIX.length;
const COLS = MATRIX[0]?.length || 5;

const colorCache = new Map<string, [number, number, number] | null>();

function parseColorToRgb(color: string): [number, number, number] | null {
  if (!color || color === "currentColor") return null;
  if (colorCache.has(color)) return colorCache.get(color)!;

  let result: [number, number, number] | null = null;
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length === 6) {
      const num = parseInt(hex, 16);
      result = [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }
  } else {
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgbMatch) {
      result = [
        parseInt(rgbMatch[1], 10),
        parseInt(rgbMatch[2], 10),
        parseInt(rgbMatch[3], 10),
      ];
    }
  }
  colorCache.set(color, result);
  return result;
}

function interpolateColor(
  c1: [number, number, number],
  c2: [number, number, number],
  factor: number,
): string {
  const r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
  const g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
  const b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
  return `rgb(${r}, ${g}, ${b})`;
}

function getMultiGradientColor(
  gradient: GradientConfig,
  col: number,
  row: number,
  totalCols: number,
  totalRows: number,
): string | undefined {
  const cFrom = parseColorToRgb(gradient.from);
  const cTo = parseColorToRgb(gradient.to);
  const cVia = gradient.via ? parseColorToRgb(gradient.via) : null;

  if (!cFrom || !cTo) return undefined;

  let progress = 0;
  const maxDim = Math.max(1, totalCols - 1);
  const maxRow = Math.max(1, totalRows - 1);

  if (gradient.direction === "horizontal") {
    progress = col / maxDim;
  } else if (gradient.direction === "vertical") {
    progress = row / maxRow;
  } else {
    progress = (col + row) / (maxDim + maxRow);
  }

  progress = Math.max(0, Math.min(1, progress));

  if (!cVia) {
    return interpolateColor(cFrom, cTo, progress);
  }

  if (progress < 0.5) {
    const factor = progress / 0.5;
    return interpolateColor(cFrom, cVia, factor);
  } else {
    const factor = (progress - 0.5) / 0.5;
    return interpolateColor(cVia, cTo, factor);
  }
}

export function AbstractCubeIsometricLoader({
  dotSize = 7,
  gap = 6,
  speed = 1.2,
  color = "#1a1d2d",
  gradient,
  bloom = false,
  opacity = 0.12,
  className = "",
}: AbstractCubeIsometricLoaderProps) {
  const dots = useMemo(() => {
    const list: {
      key: string;
      active: boolean;
      delay: number;
      color?: string;
      x: number;
      y: number;
    }[] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const active = MATRIX[r]?.[c] === "1";
        const delay = (r * COLS + c) * 0.05;

        let dotColor: string | undefined = undefined;
        if (gradient) {
          dotColor = getMultiGradientColor(gradient, c, r, COLS, ROWS);
        } else if (color && color !== "currentColor") {
          dotColor = color;
        }

        list.push({
          key: `${r}-${c}`,
          active,
          delay,
          color: dotColor,
          x: c,
          y: r,
        });
      }
    }
    return list;
  }, [color, gradient]);

  return (
    <div
      className={`relative inline-grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${COLS}, ${dotSize}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${dotSize}px)`,
        gap: `${gap}px`,
        transform: "rotateX(55deg) rotateZ(-45deg)",
        transformStyle: "preserve-3d",
      }}
      aria-label="Loading: Abstract Cube Isometric"
      role="status"
    >
      {dots.map((dot) => {
        return (
          <span
            key={dot.key}
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              borderRadius: "50%",
              backgroundColor: dot.color || color,
              opacity: dot.active ? 1 : opacity,
              boxShadow: dot.active && bloom ? `0 0 10px ${dot.color || color}` : undefined,
              animation: dot.active ? `isometricOrbit ${speed}s ease-in-out infinite` : undefined,
              animationDelay: `${dot.delay}s`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes isometricOrbit {
          0%, 100% {
            transform: translateZ(0px) scale(0.9);
            opacity: 0.35;
          }
          50% {
            transform: translateZ(18px) scale(1.25);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default AbstractCubeIsometricLoader;
