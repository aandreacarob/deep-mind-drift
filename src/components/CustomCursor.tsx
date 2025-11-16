import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      {/* Burbuja neón principal */}
      <div 
        className="w-6 h-6 rounded-full relative"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.9), rgba(0, 200, 255, 0.8), rgba(0, 150, 255, 0.6))',
          boxShadow: `
            0 0 10px rgba(0, 255, 255, 1),
            0 0 20px rgba(0, 255, 255, 0.8),
            0 0 30px rgba(0, 255, 255, 0.6),
            0 0 40px rgba(0, 200, 255, 0.4),
            inset 0 0 10px rgba(255, 255, 255, 0.3)
          `,
        }}
      >
        {/* Reflejo de luz en la burbuja */}
        <div 
          className="absolute top-1 left-1 w-2 h-2 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 5px rgba(255, 255, 255, 1)',
          }}
        />
      </div>
      {/* Resplandor exterior adicional */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3), transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
    </motion.div>
  );
};
