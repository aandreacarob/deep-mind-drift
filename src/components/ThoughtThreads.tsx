import { useEffect, useRef } from "react";

interface Thread {
  id: number;
  points: { x: number; y: number }[];
  color: string;
  speed: number;
  phase: number;
  attempting: "circle" | "line" | "wave" | "spiral";
  progress: number;
}

export const ThoughtThreads = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threadsRef = useRef<Thread[]>([]);
  const animationRef = useRef<number>();

  const colors = [
    "#00ffff", // cyan
    "#ff00ff", // magenta
    "#ffff00", // yellow
    "#00ff00", // lime
    "#ff8800", // orange
    "#ff0088", // pink
  ];

  const attempts = ["circle", "line", "wave", "spiral"] as const;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize threads
    const threadCount = 15;
    threadsRef.current = Array.from({ length: threadCount }, (_, i) => {
      const pointCount = 30 + Math.floor(Math.random() * 20);
      const points = Array.from({ length: pointCount }, (_, j) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }));

      return {
        id: i,
        points,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.0005 + Math.random() * 0.001,
        phase: Math.random() * Math.PI * 2,
        attempting: attempts[Math.floor(Math.random() * attempts.length)],
        progress: 0,
      };
    });

    const animate = (time: number) => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      threadsRef.current.forEach((thread) => {
        // Update thread attempting to form shape
        thread.progress += thread.speed;
        if (thread.progress > 1) {
          thread.progress = 0;
          thread.attempting = attempts[Math.floor(Math.random() * attempts.length)];
        }

        // Draw thread with fiber texture
        ctx.strokeStyle = thread.color;
        ctx.lineWidth = 3 + Math.random() * 2; // Irregular thickness
        ctx.lineCap = "round";
        ctx.shadowBlur = 15;
        ctx.shadowColor = thread.color;

        ctx.beginPath();
        thread.points.forEach((point, index) => {
          // Animate points trying to form shapes but failing
          const t = time * thread.speed + thread.phase + index * 0.1;
          const influence = Math.sin(thread.progress * Math.PI); // 0 -> 1 -> 0

          let targetX = point.x;
          let targetY = point.y;

          // Try to form shape based on attempting
          if (thread.attempting === "circle") {
            const angle = (index / thread.points.length) * Math.PI * 2;
            const radius = 200;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            targetX = centerX + Math.cos(angle) * radius;
            targetY = centerY + Math.sin(angle) * radius;
          } else if (thread.attempting === "line") {
            targetX = (index / thread.points.length) * canvas.width;
            targetY = canvas.height / 2;
          } else if (thread.attempting === "wave") {
            targetX = (index / thread.points.length) * canvas.width;
            targetY = canvas.height / 2 + Math.sin(index * 0.2) * 100;
          } else if (thread.attempting === "spiral") {
            const angle = (index / thread.points.length) * Math.PI * 4;
            const radius = (index / thread.points.length) * 300;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            targetX = centerX + Math.cos(angle) * radius;
            targetY = centerY + Math.sin(angle) * radius;
          }

          // Blend between random position and target shape (but never complete)
          const blendFactor = influence * 0.6; // Max 60% towards target
          const x = point.x + (targetX - point.x) * blendFactor + Math.sin(t) * 20;
          const y = point.y + (targetY - point.y) * blendFactor + Math.cos(t) * 20;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            // Irregular curves for organic fiber look
            const prevPoint = thread.points[index - 1];
            const prevT = time * thread.speed + thread.phase + (index - 1) * 0.1;
            const prevX = prevPoint.x + (targetX - prevPoint.x) * blendFactor + Math.sin(prevT) * 20;
            const prevY = prevPoint.y + (targetY - prevPoint.y) * blendFactor + Math.cos(prevT) * 20;
            
            const cpX = (prevX + x) / 2 + Math.sin(t + index) * 10;
            const cpY = (prevY + y) / 2 + Math.cos(t + index) * 10;
            ctx.quadraticCurveTo(cpX, cpY, x, y);
          }
        });

        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
