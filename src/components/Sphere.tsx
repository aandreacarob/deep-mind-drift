import { motion } from "framer-motion";
import type { SphereData } from "@/pages/Seccion3";

interface SphereProps {
  sphere: SphereData;
  onClick: () => void;
  isExplored: boolean;
  delay: number;
}

export const Sphere = ({ sphere, onClick, isExplored, delay }: SphereProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="absolute cursor-pointer"
      style={{
        left: `${sphere.position.x}%`,
        top: `${sphere.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          backgroundColor: sphere.color,
          opacity: 0.4,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sphere */}
      <div
        className="relative w-32 h-32 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm border-2 border-white/30 shadow-2xl"
        style={{
          backgroundColor: `${sphere.color}99`,
          boxShadow: `0 0 40px ${sphere.color}80`,
        }}
      >
        {sphere.emoji}

        {/* Explored indicator */}
        {isExplored && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
          >
            ✓
          </motion.div>
        )}
      </div>

      {/* Floating animation */}
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
