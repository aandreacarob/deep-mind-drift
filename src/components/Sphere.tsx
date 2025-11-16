import { motion } from "framer-motion";
import type { SphereData } from "@/pages/Seccion3";

interface SphereProps {
  sphere: SphereData;
  onClick: () => void;
  isExplored: boolean;
  delay: number;
}

const getSymbolPath = (type: string) => {
  switch (type) {
    case "fragmentado":
      // Líneas fragmentadas radiando
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="currentColor" strokeWidth="3" fill="none" opacity="0.7">
            <line x1="40" y1="20" x2="40" y2="30" />
            <line x1="52" y1="24" x2="58" y2="30" />
            <line x1="60" y1="40" x2="50" y2="40" />
            <line x1="52" y1="56" x2="58" y2="50" />
            <line x1="40" y1="60" x2="40" y2="50" />
            <line x1="28" y1="56" x2="22" y2="50" />
            <line x1="20" y1="40" x2="30" y2="40" />
            <line x1="28" y1="24" x2="22" y2="30" />
          </g>
        </svg>
      );
    case "delegado":
      // Flechas saliendo del centro
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.7">
            <path d="M40 40 L40 20 M35 25 L40 20 L45 25" />
            <path d="M40 40 L60 40 M55 35 L60 40 L55 45" />
            <path d="M40 40 L40 60 M35 55 L40 60 L45 55" />
            <path d="M40 40 L20 40 M25 35 L20 40 L25 45" />
          </g>
        </svg>
      );
    case "aumentado":
      // Red de nodos
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.7">
            <line x1="40" y1="25" x2="30" y2="45" />
            <line x1="40" y1="25" x2="50" y2="45" />
            <line x1="30" y1="45" x2="50" y2="45" />
            <line x1="30" y1="45" x2="40" y2="55" />
            <line x1="50" y1="45" x2="40" y2="55" />
            <circle cx="40" cy="25" r="4" />
            <circle cx="30" cy="45" r="4" />
            <circle cx="50" cy="45" r="4" />
            <circle cx="40" cy="55" r="4" />
          </g>
        </svg>
      );
    case "hibrido":
      // Formas fusionándose
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g fill="currentColor" opacity="0.6">
            <ellipse cx="32" cy="40" rx="15" ry="20" />
            <ellipse cx="48" cy="40" rx="15" ry="20" />
          </g>
        </svg>
      );
    case "profundo":
      // Espiral concéntrica
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.7">
            <path d="M40 40 Q45 35 50 40 T50 50 Q45 55 40 50 T30 40 Q35 30 45 30" />
          </g>
        </svg>
      );
    default:
      return null;
  }
};

export const Sphere = ({ sphere, onClick, isExplored, delay }: SphereProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="absolute cursor-pointer group"
      style={{
        left: `${sphere.position.x}%`,
        top: `${sphere.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Soft glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          backgroundColor: sphere.color,
          opacity: 0.3,
          width: '180px',
          height: '180px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [0.98, 1, 0.98],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sphere with watercolor texture */}
      <div
        className="relative rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
        style={{
          width: '180px',
          height: '180px',
          backgroundColor: sphere.color,
          opacity: 0.85,
          filter: 'blur(0.5px)',
          boxShadow: `0 8px 32px ${sphere.color}60, inset 0 0 20px rgba(255,255,255,0.2)`,
        }}
      >
        {/* Symbol */}
        <div style={{ color: `${sphere.color}` }} className="brightness-75">
          {getSymbolPath(sphere.emoji)}
        </div>

        {/* Explored indicator */}
        {isExplored && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
            style={{
              backgroundColor: '#7ED321'
            }}
          >
            ✓
          </motion.div>
        )}
      </div>

      {/* Subtle floating */}
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [-3, 3, -3],
        }}
        transition={{
          duration: 5 + Math.random(),
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
