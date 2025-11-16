import { useEffect, useRef, useState } from "react";

interface InteractivePaintLayerProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export const InteractivePaintLayer = ({ className = "" }: InteractivePaintLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseTrailRef = useRef<Array<{ x: number; y: number; time: number }>>([]);

  // Colors matching the Van Gogh theme
  const colors = [
    { r: 74, g: 144, b: 226 },   // Blue
    { r: 255, g: 215, b: 0 },    // Yellow
    { r: 189, g: 16, b: 224 },   // Purple
    { r: 126, g: 211, b: 33 },   // Green
    { r: 255, g: 165, b: 0 },    // Orange
    { r: 168, g: 85, b: 199 },   // Light Purple
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create offscreen canvas for base texture
    const baseCanvas = document.createElement("canvas");
    const baseCtx = baseCanvas.getContext("2d");
    if (!baseCtx) return;

    // Initialize base paint texture once
    const initBaseTexture = () => {
      baseCtx.fillStyle = "transparent";
      baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);

      // Create organic paint blobs with seeded positions for consistent texture
      let localSeed = 12345;
      for (let i = 0; i < 15; i++) {
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand1 = localSeed / 233280;
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand2 = localSeed / 233280;
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand3 = localSeed / 233280;
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand4 = localSeed / 233280;
        
        const x = rand1 * baseCanvas.width;
        const y = rand2 * baseCanvas.height;
        const radius = 80 + rand3 * 120;
        const color = colors[Math.floor(rand4 * colors.length)];
        
        const gradient = baseCtx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.08)`);
        gradient.addColorStop(1, "transparent");

        baseCtx.fillStyle = gradient;
        baseCtx.beginPath();
        baseCtx.arc(x, y, radius, 0, Math.PI * 2);
        baseCtx.fill();
      }

      // Add some brushstroke-like texture
      localSeed = 54321; // Different seed for strokes
      for (let i = 0; i < 20; i++) {
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand1 = localSeed / 233280;
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand2 = localSeed / 233280;
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand3 = localSeed / 233280;
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand4 = localSeed / 233280;
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand5 = localSeed / 233280;
        localSeed = (localSeed * 9301 + 49297) % 233280;
        const rand6 = localSeed / 233280;
        
        const x1 = rand1 * baseCanvas.width;
        const y1 = rand2 * baseCanvas.height;
        const length = 40 + rand3 * 80;
        const angle = rand4 * Math.PI * 2;
        const x2 = x1 + Math.cos(angle) * length;
        const y2 = y1 + Math.sin(angle) * length;
        const color = colors[Math.floor(rand5 * colors.length)];

        baseCtx.beginPath();
        baseCtx.moveTo(x1, y1);
        baseCtx.lineTo(x2, y2);
        baseCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`;
        baseCtx.lineWidth = 15 + rand6 * 20;
        baseCtx.lineCap = "round";
        baseCtx.stroke();
      }
    };

    // Function to redraw base texture (for resize)
    const redrawBaseTexture = () => {
      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;
      initBaseTexture();
    };

    // Set canvas size
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawBaseTexture();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Handle mouse movement - track from window to work behind spheres
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      
      // Check if mouse is within container bounds
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });
      
      // Add to mouse trail
      mouseTrailRef.current.push({ x, y, time: Date.now() });
      if (mouseTrailRef.current.length > 10) {
        mouseTrailRef.current.shift();
      }

      // Create particles at mouse position
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 8 + Math.random() * 15,
          color: `rgba(${color.r}, ${color.g}, ${color.b}, ${0.4 + Math.random() * 0.4})`,
          opacity: 0.6 + Math.random() * 0.4,
          life: 0,
          maxLife: 60 + Math.random() * 40,
        });
      }

      // Create paint blob at mouse position
      const blobGradient = ctx.createRadialGradient(x, y, 0, x, y, 60);
      blobGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
      blobGradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
      blobGradient.addColorStop(1, "transparent");

      ctx.fillStyle = blobGradient;
      ctx.beginPath();
      ctx.arc(x, y, 60, 0, Math.PI * 2);
      ctx.fill();

      // Add brushstroke effect
      const strokeLength = 30 + Math.random() * 40;
      const strokeAngle = Math.random() * Math.PI * 2;
      const x2 = x + Math.cos(strokeAngle) * strokeLength;
      const y2 = y + Math.sin(strokeAngle) * strokeLength;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`;
      ctx.lineWidth = 12 + Math.random() * 18;
      ctx.lineCap = "round";
      ctx.stroke();
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Clear canvas and redraw base texture
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseCanvas, 0, 0);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.life++;
        particle.opacity *= 0.98;

        if (particle.life < particle.maxLife && particle.opacity > 0.01) {
          // Draw particle with blur effect
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add glow
          ctx.shadowBlur = particle.size * 2;
          ctx.shadowColor = particle.color;
          ctx.fill();
          ctx.restore();

          return true;
        }
        return false;
      });

      // Draw mouse trail
      mouseTrailRef.current = mouseTrailRef.current.filter((point) => {
        const age = Date.now() - point.time;
        if (age < 500) {
          const alpha = 1 - age / 500;
          const size = 20 * alpha;
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          ctx.save();
          ctx.globalAlpha = alpha * 0.3;
          const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size);
          gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          return true;
        }
        return false;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 5 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "multiply" }}
      />
    </div>
  );
};

