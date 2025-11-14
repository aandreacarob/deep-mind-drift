import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticlesProps {
  count?: number;
  color?: string;
  behavior?: "float" | "fall" | "static";
}

export const Particles = ({ count = 50, color = "narrative-purple", behavior = "float" }: ParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, [count]);

  const getAnimation = (behavior: string) => {
    switch (behavior) {
      case "fall":
        return {
          y: ["0%", "100%"],
          opacity: [1, 0],
        };
      case "float":
        return {
          y: ["-10%", "10%", "-10%"],
          x: ["-5%", "5%", "-5%"],
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full bg-${color} opacity-30`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={getAnimation(behavior)}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
