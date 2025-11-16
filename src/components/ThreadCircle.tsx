import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Thread {
  id: number;
  angle: number;
  radius: number;
  color: string;
  thickness: number;
  speed: number;
  waveAmplitude: number;
  waveFrequency: number;
}

export const ThreadCircle = () => {
  const [threads, setThreads] = useState<Thread[]>([]);

  const pastelColors = [
    "rgba(255, 182, 193, 0.8)", // pink
    "rgba(179, 229, 252, 0.8)", // light blue
    "rgba(204, 255, 204, 0.8)", // mint green
    "rgba(255, 218, 185, 0.8)", // peach
    "rgba(221, 160, 221, 0.8)", // plum
    "rgba(255, 255, 153, 0.8)", // light yellow
    "rgba(255, 204, 229, 0.8)", // light pink
    "rgba(204, 229, 255, 0.8)", // sky blue
  ];

  useEffect(() => {
    const threadCount = 300;
    const newThreads: Thread[] = [];

    for (let i = 0; i < threadCount; i++) {
      // Create multiple layers of circles in the wreath
      const layer = Math.floor(i / 60);
      const baseRadius = 35 + layer * 3;
      
      newThreads.push({
        id: i,
        angle: (Math.PI * 2 * i) / 60 + (layer * 0.5), // Offset each layer
        radius: baseRadius + Math.random() * 4,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        thickness: Math.random() * 1.5 + 0.8,
        speed: Math.random() * 0.3 + 0.2,
        waveAmplitude: Math.random() * 2 + 1,
        waveFrequency: Math.random() * 3 + 2,
      });
    }

    setThreads(newThreads);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" style={{ filter: "blur(0.5px)" }}>
        <defs>
          {/* Thread texture pattern */}
          <pattern
            id="threadTexture"
            x="0"
            y="0"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect width="4" height="4" fill="none" />
            <path
              d="M 0 2 Q 1 0, 2 2 T 4 2"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>

          {/* Glow filter for depth */}
          <filter id="threadGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {threads.map((thread) => (
          <ThreadPath key={thread.id} thread={thread} />
        ))}
      </svg>
    </div>
  );
};

const ThreadPath = ({ thread }: { thread: Thread }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setTime((prev) => prev + thread.speed * 0.01);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [thread.speed]);

  // Calculate circle path with dynamic movement
  const wave = Math.sin(time * 2) * thread.waveAmplitude;
  const currentRadius = thread.radius + wave;
  
  const x = 50 + Math.cos(thread.angle + time * 0.5) * currentRadius;
  const y = 50 + Math.sin(thread.angle + time * 0.5) * currentRadius;
  
  // Circle size varies
  const circleSize = thread.thickness + Math.sin(time * 3) * 0.5;

  return (
    <motion.circle
      cx={`${x}%`}
      cy={`${y}%`}
      r={circleSize}
      fill="none"
      stroke={thread.color}
      strokeWidth={thread.thickness * 0.5}
      style={{
        filter: "url(#threadGlow)",
        mixBlendMode: "screen",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.8, scale: 1 }}
      transition={{ duration: 1.5, delay: thread.id * 0.003 }}
    />
  );
};
