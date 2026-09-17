"use client";
import { useEffect, useRef } from "react";

export function NetworkOrb({ state }: { state: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const color =
      state === "recording"
        ? "110,200,242"
        : state === "thinking" || state === "transcribing"
          ? "184,128,238"
          : "232,184,107";
    const nodes = [
      { a: 0, r: 0 },
      ...[5, 9, 14].flatMap((count, layer) =>
        Array.from({ length: count }, (_, i) => ({
          a: (i / count) * Math.PI * 2 + layer * 0.31,
          r: [25, 55, 90][layer],
        })),
      ),
    ];
    const draw = (time: number) => {
      const t = reduced.matches ? 0 : time / 2200;
      ctx.clearRect(0, 0, 360, 360);
      ctx.save();
      ctx.translate(180, 180);
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 135);
      glow.addColorStop(0, `rgba(${color},.24)`);
      glow.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(-180, -180, 360, 360);
      const points = nodes.map((n, i) => ({
        x:
          Math.cos(n.a + Math.sin(t + i) * 0.03) *
          (n.r + Math.sin(t * 1.1 + i) * 2),
        y: Math.sin(n.a + Math.sin(t + i) * 0.03) * (n.r + Math.cos(t + i) * 2),
      }));
      points.forEach((p, i) => {
        points.slice(i + 1).forEach((q) => {
          if (Math.hypot(p.x - q.x, p.y - q.y) < 58) {
            ctx.strokeStyle = `rgba(${color},${0.09 + Math.sin(t + i) * 0.04})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${i ? 0.5 + Math.sin(t + i) * 0.18 : 1})`;
        ctx.shadowColor = `rgb(${color})`;
        ctx.shadowBlur = i ? 4 : 12;
        ctx.arc(p.x, p.y, i ? 1.8 : 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    };
    draw(0);
    const change = () => {
      cancelAnimationFrame(frame);
      draw(0);
    };
    reduced.addEventListener("change", change);
    return () => {
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", change);
    };
  }, [state]);
  return (
    <div className={`helga-network ${state}`}>
      <div className="helga-network-ring" />
      <canvas
        ref={canvas}
        width={360}
        height={360}
        aria-label={`Helga is ${state}`}
      />
    </div>
  );
}
