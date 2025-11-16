import { motion } from "framer-motion";
import type { SphereData } from "@/pages/Seccion3";

interface SphereProps {
  sphere: SphereData;
  onClick: () => void;
  isExplored: boolean;
  delay: number;
}

// Symbols for crystal spheres (Inside Out style)
const getSymbol = (type: string) => {
  switch (type) {
    case "fragmentado":
      return "※";
    case "delegado":
      return "◈";
    case "aumentado":
      return "✤";
    case "hibrido":
      return "◉";
    case "profundo":
      return "◐";
    default:
      return "○";
  }
};

// Convert hex to RGBA for crystal effects
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generate crystal color variations
const getCrystalColors = (baseColor: string) => {
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return {
    base: baseColor,
    glow: `rgba(${r}, ${g}, ${b}, 0.6)`,
    innerGlow: `rgba(${r}, ${g}, ${b}, 0.4)`,
    translucent: `rgba(${r}, ${g}, ${b}, 0.15)`,
    shadow: `rgba(${r}, ${g}, ${b}, 0.3)`,
    highlight: `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, 0.3)`,
  };
};

export const Sphere = ({ sphere, onClick, isExplored, delay }: SphereProps) => {
  // Generate unique animation parameters for each sphere
  const floatDuration = 4 + (delay * 0.5);
  const floatOffset = 8 + (delay * 2);
  const breatheDuration = 3 + (delay * 0.3);
  
  // Generate size variation (180px, 190px, 200px, 195px, 210px)
  const sizeVariations = [180, 190, 200, 195, 210];
  const sphereSize = sizeVariations[Math.floor(delay * 2) % sizeVariations.length];
  
  // Get crystal colors
  const colors = getCrystalColors(sphere.color);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute cursor-pointer group"
      style={{
        left: `${sphere.position.x}%`,
        top: `${sphere.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.1,
      }}
      transition={{
        delay,
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Floating wrapper */}
      <motion.div
        className="relative"
        animate={{
          y: [
            -floatOffset * 0.5,
            floatOffset * 0.3,
            -floatOffset * 0.7,
            floatOffset * 0.2,
            -floatOffset * 0.5
          ],
          x: [
            -floatOffset * 0.3,
            floatOffset * 0.5,
            -floatOffset * 0.2,
            floatOffset * 0.4,
            -floatOffset * 0.3
          ],
        }}
        transition={{
          delay: delay + 0.5,
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        {/* Translucent colored shadow - 3D shadow with light passing through */}
        <motion.div
          className="absolute"
          style={{
            width: `${sphereSize * 1.2}px`,
            height: `${sphereSize * 0.6}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -30%) translateY(20px)',
            borderRadius: '50%',
            background: `
              radial-gradient(ellipse at center, ${colors.shadow} 0%, ${hexToRgba(sphere.color, 0.2)} 30%, transparent 70%)
            `,
            filter: 'blur(25px)',
            opacity: 0.7,
          }}
          animate={{
            scaleX: [0.9, 1.1, 0.95, 1.05, 0.9],
            scaleY: [0.8, 1.0, 0.85, 0.95, 0.8],
            opacity: [0.6, 0.8, 0.5, 0.75, 0.6],
          }}
          transition={{
            duration: breatheDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Secondary shadow layer for more depth */}
        <motion.div
          className="absolute"
          style={{
            width: `${sphereSize * 0.8}px`,
            height: `${sphereSize * 0.4}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -20%) translateY(25px)',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 60%)`,
            filter: 'blur(15px)',
            opacity: 0.4,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.2, 0.45, 0.3],
          }}
          transition={{
            duration: breatheDuration * 1.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer glow - light emission */}
        <motion.div
          className="absolute"
          style={{
            width: `${sphereSize + 40}px`,
            height: `${sphereSize + 40}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            filter: 'blur(15px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: breatheDuration * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Crystal sphere container - 3D context */}
        <motion.div
          className="relative"
          style={{
            width: `${sphereSize}px`,
            height: `${sphereSize}px`,
            borderRadius: '50%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
          animate={{
            scale: [1, 1.02, 0.98, 1.01, 1],
          }}
          transition={{
            duration: breatheDuration * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.6, 0.8, 1],
          }}
        >
          {/* Base crystal sphere - main body with 3D depth */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 40%),
                radial-gradient(circle at 75% 75%, ${colors.translucent} 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, ${hexToRgba(sphere.color, 0.25)} 0%, ${hexToRgba(sphere.color, 0.15)} 40%, ${hexToRgba(sphere.color, 0.1)} 100%)
              `,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: `2px solid ${hexToRgba(sphere.color, 0.4)}`,
              boxShadow: `
                inset -20px -20px 50px rgba(0,0,0,0.2),
                inset 20px 20px 50px ${colors.innerGlow},
                0 0 80px ${colors.glow},
                0 25px 50px ${colors.shadow},
                0 10px 30px rgba(0,0,0,0.3)
              `,
              transform: 'translateZ(0)',
            }}
          />

          {/* Secondary highlight - bottom right for depth */}
          <div
            className="absolute rounded-full"
            style={{
              width: '45%',
              height: '45%',
              left: '55%',
              top: '55%',
              background: `radial-gradient(circle, ${hexToRgba(sphere.color, 0.2)} 0%, transparent 70%)`,
              filter: 'blur(12px)',
              transform: 'translateZ(10px)',
            }}
          />

          {/* Main highlight - top left (primary light source) */}
          <div
            className="absolute rounded-full"
            style={{
              width: '40%',
              height: '40%',
              left: '15%',
              top: '12%',
              background: `radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, transparent 80%)`,
              filter: 'blur(6px)',
              transform: 'translateZ(15px)',
            }}
          />

          {/* Secondary highlight - smaller bright spot */}
          <div
            className="absolute rounded-full"
            style={{
              width: '20%',
              height: '20%',
              left: '25%',
              top: '20%',
              background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)`,
              filter: 'blur(4px)',
              transform: 'translateZ(20px)',
            }}
          />

          {/* Inner light source - glowing from inside with 3D depth */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '55%',
              height: '55%',
              left: '22.5%',
              top: '22.5%',
              background: `radial-gradient(circle, ${colors.innerGlow} 0%, ${hexToRgba(sphere.color, 0.1)} 50%, transparent 80%)`,
              filter: 'blur(15px)',
              transform: 'translateZ(-10px)',
            }}
            animate={{
              scale: [1, 1.3, 0.85, 1.15, 1],
              opacity: [0.6, 0.9, 0.4, 0.8, 0.6],
            }}
            transition={{
              duration: breatheDuration * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Refraction effect - light bending through crystal */}
          <div
            className="absolute rounded-full"
            style={{
              width: '70%',
              height: '70%',
              left: '15%',
              top: '15%',
              background: `
                radial-gradient(ellipse at 30% 30%, ${hexToRgba(sphere.color, 0.15)} 0%, transparent 60%),
                radial-gradient(ellipse at 70% 70%, ${hexToRgba(sphere.color, 0.1)} 0%, transparent 60%)
              `,
              filter: 'blur(20px)',
              transform: 'translateZ(-5px)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Dark edge shadow for 3D depth */}
          <div
            className="absolute rounded-full"
            style={{
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.3) 100%)`,
              transform: 'translateZ(0)',
            }}
          />

          {/* Content inside the sphere - symbol with 3D positioning */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: 'translateZ(25px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.div
              style={{ 
                color: sphere.color,
                fontSize: '56px',
                fontFamily: 'Crimson Pro, serif',
                fontWeight: 700,
                textShadow: `
                  0 0 25px ${colors.glow},
                  0 0 50px ${colors.glow},
                  0 0 75px ${hexToRgba(sphere.color, 0.5)},
                  0 5px 10px rgba(0,0,0,0.3)
                `,
                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
                transform: 'translateZ(30px)',
              }}
              animate={{
                filter: [
                  'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
                  'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
                ],
              }}
              transition={{
                duration: breatheDuration * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {getSymbol(sphere.emoji)}
            </motion.div>
          </div>

          {/* Explored indicator - crystal style */}
          {isExplored && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-2 -right-2 w-9 h-9 flex items-center justify-center text-white text-lg font-bold rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, #7ED321, #6BB81A)`,
                boxShadow: `
                  0 0 20px rgba(126, 211, 33, 0.6),
                  0 4px 12px rgba(110, 184, 26, 0.4),
                  inset 0 2px 4px rgba(255,255,255,0.3)
                `,
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            >
              ✓
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
