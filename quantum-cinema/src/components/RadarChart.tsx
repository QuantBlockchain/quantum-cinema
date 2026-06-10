"use client";

import { motion } from "framer-motion";

interface RadarDataPoint {
  axis: string;
  value: number; // 0-100
}

interface RadarSeries {
  name: string;
  color: string;
  rgb: string;
  data: RadarDataPoint[];
}

interface RadarChartProps {
  series: RadarSeries[];
  size?: number;
}

export default function RadarChart({ series, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = size * 0.38;
  const levels = 5;

  if (!series.length || !series[0].data.length) return null;

  const axes = series[0].data.map((d) => d.axis);
  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;
  // Start from top (-PI/2)
  const startAngle = -Math.PI / 2;

  const getPoint = (angle: number, radius: number) => ({
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  });

  const getPolygonPoints = (data: RadarDataPoint[]) => {
    return data
      .map((d, i) => {
        const angle = startAngle + i * angleStep;
        const radius = (d.value / 100) * maxRadius;
        const p = getPoint(angle, radius);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  };

  // Pad the viewBox so axis labels (placed outside maxRadius) are not clipped
  // at the SVG edge. Horizontal labels overrun the most, so pad sides more.
  const padX = 92;
  const padY = 32;

  return (
    <svg
      viewBox={`${-padX} ${-padY} ${size + padX * 2} ${size + padY * 2}`}
      className="w-full h-full"
    >
      {/* Grid levels */}
      {Array.from({ length: levels }, (_, i) => {
        const r = ((i + 1) / levels) * maxRadius;
        const points = Array.from({ length: numAxes }, (_, j) => {
          const angle = startAngle + j * angleStep;
          const p = getPoint(angle, r);
          return `${p.x},${p.y}`;
        }).join(" ");

        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const angle = startAngle + i * angleStep;
        const end = getPoint(angle, maxRadius);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Data polygons */}
      {series.map((s, sIdx) => (
        <motion.polygon
          key={s.name}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: sIdx * 0.2 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
          points={getPolygonPoints(s.data)}
          fill={`rgba(${s.rgb}, 0.12)`}
          stroke={s.color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      ))}

      {/* Data points */}
      {series.map((s, sIdx) =>
        s.data.map((d, i) => {
          const angle = startAngle + i * angleStep;
          const radius = (d.value / 100) * maxRadius;
          const p = getPoint(angle, radius);
          return (
            <motion.circle
              key={`${s.name}-${i}`}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: 3 }}
              transition={{ duration: 0.3, delay: 0.6 + sIdx * 0.2 + i * 0.05 }}
              cx={p.x}
              cy={p.y}
              fill={s.color}
            />
          );
        })
      )}

      {/* Axis labels */}
      {axes.map((label, i) => {
        const angle = startAngle + i * angleStep;
        const labelR = maxRadius + 24;
        const p = getPoint(angle, labelR);

        let textAnchor: "start" | "middle" | "end" = "middle";
        if (Math.cos(angle) > 0.3) textAnchor = "start";
        else if (Math.cos(angle) < -0.3) textAnchor = "end";

        return (
          <text
            key={label}
            x={p.x}
            y={p.y}
            textAnchor={textAnchor}
            dominantBaseline="central"
            className="fill-foreground/85"
            style={{
              fontSize: "9.5px",
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
