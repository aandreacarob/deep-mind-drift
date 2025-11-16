import { motion } from "framer-motion";
import leafImage from "@/assets/leaf.png";

interface FallingLeafProps {
  id: number;
  startX: number;
  startY: number;
  rotation: number;
  delay: number;
  duration: number;
  color: string;
}

export const FallingLeaf = ({
  startX,
  startY,
  rotation,
  delay,
  duration,
  color,
}: FallingLeafProps) => {
  // Calculate end position (bottom of viewport)
  const endY = typeof window !== "undefined" ? window.innerHeight + 100 : 1000;
  // More natural horizontal drift - starts slow, accelerates, then slows
  const driftAmount = (Math.random() - 0.5) * 300;
  
  // More natural rotation - continuous rotation
  const rotationSpeed = 100 + Math.random() * 200; // degrees per second
  const totalRotation = (duration / 1000) * rotationSpeed;
  const finalRotation = rotation + totalRotation;

  return (
    <motion.div
      className="fixed pointer-events-none z-30"
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
      }}
      initial={{
        opacity: 0,
        scale: 0.5,
        rotate: rotation,
        x: 0,
        y: 0,
      }}
      animate={{
        opacity: [0, 1, 1, 0.7, 0],
        scale: [0.5, 0.65, 0.7, 0.75, 0.6],
        rotate: [rotation, rotation + totalRotation * 0.25, rotation + totalRotation * 0.5, rotation + totalRotation * 0.75, finalRotation],
        x: [0, driftAmount * 0.2, driftAmount * 0.6, driftAmount * 0.9, driftAmount],
        y: [0, (endY - startY) * 0.15, (endY - startY) * 0.5, (endY - startY) * 0.85, endY - startY],
      }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.25, 0.1, 0.25, 1], // Custom cubic bezier for natural falling
        times: [0, 0.2, 0.5, 0.8, 1],
      }}
    >
      <img
        src={leafImage}
        alt="Falling leaf"
        className="w-16 h-24 object-contain"
        style={{
          filter: `hue-rotate(170deg) saturate(2.2) brightness(1.7) drop-shadow(0 2px 8px rgba(255, 215, 0, 0.4))`,
        }}
      />
    </motion.div>
  );
};

