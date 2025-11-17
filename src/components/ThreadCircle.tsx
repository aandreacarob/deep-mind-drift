import { useEffect, useMemo, useRef } from "react";

interface Thread {
  id: number;
  angle: number;
  radius: number; // normalized radius relative to viewport
  color: string;
  thickness: number;
  speed: number;
  waveAmplitude: number;
  waveFrequency: number;
  phase: number;
}

const createThreads = (count: number, colors: string[]): Thread[] => {
  const perLayer = 60;
  return Array.from({ length: count }, (_, index) => {
    const layer = Math.floor(index / perLayer);

    return {
      id: index,
      angle: ((Math.PI * 2) / perLayer) * (index % perLayer) + layer * 0.4,
      radius: 0.28 + layer * 0.04 + Math.random() * 0.015,
      color: colors[Math.floor(Math.random() * colors.length)],
      thickness: Math.random() * 0.8 + 0.4,
      speed: Math.random() * 0.4 + 0.15,
      waveAmplitude: Math.random() * 0.8 + 0.4,
      waveFrequency: Math.random() * 1.2 + 0.6,
      phase: Math.random() * Math.PI * 2,
    };
  });
};

export const ThreadCircle = () => {
  const pastelColors = useMemo(
    () => [
      "rgba(255, 182, 193, 0.8)", // pink
      "rgba(179, 229, 252, 0.8)", // light blue
      "rgba(204, 255, 204, 0.8)", // mint green
      "rgba(255, 218, 185, 0.8)", // peach
      "rgba(221, 160, 221, 0.8)", // plum
      "rgba(255, 255, 153, 0.8)", // light yellow
      "rgba(255, 204, 229, 0.8)", // light pink
      "rgba(204, 229, 255, 0.8)", // sky blue
    ],
    []
  );

  const threads = useMemo(() => createThreads(180, pastelColors), [pastelColors]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      const minDim = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      context.globalCompositeOperation = "lighter";

      for (const thread of threads) {
        thread.phase += thread.speed * 0.008;
        const wave = Math.sin(thread.phase * thread.waveFrequency) * thread.waveAmplitude;
        const radiusPx = thread.radius * minDim + wave * 8;
        const orbitalShift = thread.phase * 0.12;
        const x = centerX + Math.cos(thread.angle + orbitalShift) * radiusPx;
        const y = centerY + Math.sin(thread.angle + orbitalShift) * radiusPx;
        const circleSize = Math.max(0.1, thread.thickness + Math.sin(thread.phase * 0.9) * 0.5);

        context.beginPath();
        context.fillStyle = thread.color;
        context.globalAlpha = 0.65;
        context.shadowColor = thread.color;
        context.shadowBlur = 12;
        context.arc(x, y, circleSize, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [threads]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full opacity-90" />
    </div>
  );
};
