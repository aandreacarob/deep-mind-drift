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
      // Líneas fragmentadas radiando (※)
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="3" fill="none">
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
    case "acumulador":
      // Diamante (◈)
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2.5" fill="none">
            <path d="M40 20 L55 40 L40 60 L25 40 Z" />
            <line x1="40" y1="20" x2="40" y2="60" />
            <line x1="25" y1="40" x2="55" y2="40" />
          </g>
        </svg>
      );
    case "reactivo":
      // Cruz decorada (✤)
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2.5" fill="none">
            <line x1="40" y1="20" x2="40" y2="60" />
            <line x1="20" y1="40" x2="60" y2="40" />
            <circle cx="40" cy="20" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="60" cy="40" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="40" cy="60" r="3" fill="rgba(255, 255, 255, 0.6)" />
            <circle cx="20" cy="40" r="3" fill="rgba(255, 255, 255, 0.6)" />
          </g>
        </svg>
      );
    case "buscador":
      // Círculo con punto central (◉)
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="rgba(255, 255, 255, 0.6)" fill="none">
            <circle cx="40" cy="40" r="20" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="6" fill="rgba(255, 255, 255, 0.6)" />
          </g>
        </svg>
      );
    case "ausente":
      // Semicírculo (◐)
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 m-auto">
          <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2.5" fill="none">
            <circle cx="40" cy="40" r="20" />
            <path d="M40 20 L40 60" fill="rgba(255, 255, 255, 0.6)" />
            <path d="M40 20 A20 20 0 0 1 40 60 Z" fill="rgba(255, 255, 255, 0.6)" />
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
        className="relative flex items-center justify-center shadow-xl transition-all duration-500"
        style={{
          width: '200px',
          height: '200px',
          backgroundColor: sphere.color,
          borderRadius: '48% 52% 49% 51% / 52% 48% 51% 49%',
          filter: 'contrast(1.05) brightness(1.02)',
          boxShadow: `10px 15px 20px ${sphere.color}4D`,
        }}
      >
        {/* Watercolor effect overlay */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: 'inherit',
            background: 'inherit',
            opacity: 0.15,
            filter: 'url(#watercolor-effect)'
          }}
        />
        
        {/* Symbol */}
        <div className="relative z-10">
          {getSymbolPath(sphere.symbol)}
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
