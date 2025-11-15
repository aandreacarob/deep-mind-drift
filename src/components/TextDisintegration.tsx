import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  shape: "circle" | "star";
}

interface TextDisintegrationProps {
  text: string;
  boundingRect: DOMRect;
  onComplete?: () => void;
}

export const TextDisintegration = ({ text, boundingRect, onComplete }: TextDisintegrationProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Crear partículas desde el texto
    const newParticles: Particle[] = [];
    
    // Calcular cuántas partículas por letra (3-5)
    const particlesPerLetter = 4;
    const letterWidth = 12; // Aproximado
    const letterHeight = 24; // Aproximado
    
    // Estimar número de letras
    const estimatedLetters = Math.min(text.length, 50); // Máximo 50 letras para no saturar
    const totalParticles = Math.min(estimatedLetters * particlesPerLetter, 200);
    
    // Determinar color basado en las clases del texto
    const getColor = (): string => {
      if (text.includes('highlight-doubt') || text.includes('FFDD4A')) return '#FFDD4A';
      if (text.includes('highlight-action') || text.includes('FF9A3C')) return '#FF9A3C';
      if (text.includes('highlight-question')) return '#FFFFFF';
      return 'rgba(255, 255, 255, 0.8)';
    };

    for (let i = 0; i < totalParticles; i++) {
      const progress = i / totalParticles;
      const x = boundingRect.left + (boundingRect.width * progress) + (Math.random() - 0.5) * letterWidth;
      const y = boundingRect.top + boundingRect.height / 2 + (Math.random() - 0.5) * letterHeight;
      
      newParticles.push({
        id: `particle-${i}-${Date.now()}`,
        x,
        y,
        color: getColor(),
        size: Math.random() * 4 + 4, // 4-8px
        velocityX: (Math.random() - 0.5) * 30, // Movimiento horizontal ondulante
        velocityY: -(Math.random() * 100 + 150), // Velocidad hacia arriba variable
        rotation: Math.random() * 360,
        shape: Math.random() > 0.5 ? "circle" : "star",
      });
    }
    
    setParticles(newParticles);
    
    // Limpiar después de la animación
    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [text, boundingRect, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={particle.shape === "circle" ? "rounded-full" : "star-shape"}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.shape === "circle" ? particle.color : "transparent",
            borderColor: particle.color,
          }}
          initial={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: particle.rotation,
          }}
          animate={{
            opacity: [1, 0.8, 0],
            x: [
              0,
              particle.velocityX * 0.3,
              particle.velocityX * 0.6,
              particle.velocityX,
            ],
            y: [
              0,
              particle.velocityY * 0.3,
              particle.velocityY * 0.7,
              particle.velocityY,
            ],
            scale: [1, 1.1, 0.9, 0.7],
            rotate: particle.rotation + (Math.random() - 0.5) * 180,
          }}
          transition={{
            duration: 2.5,
            ease: [0.4, 0.0, 0.2, 1],
            times: [0, 0.3, 0.7, 1],
          }}
        >
          {particle.shape === "star" && (
            <svg
              width={particle.size}
              height={particle.size}
              viewBox="0 0 20 20"
              fill={particle.color}
              style={{ filter: "blur(0.5px)" }}
            >
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
