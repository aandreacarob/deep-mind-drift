import { useEffect, useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MouseParallaxProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export const MouseParallax = ({ children, strength = 20, className = "" }: MouseParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = (e.clientX - centerX) / rect.width;
      const distanceY = (e.clientY - centerY) / rect.height;

      mouseX.set(distanceX * strength);
      mouseY.set(distanceY * strength);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, strength]);

  return (
    <motion.div ref={ref} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
};
