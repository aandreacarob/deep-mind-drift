import { useState } from "react";
import { motion } from "framer-motion";
import leafImage from "@/assets/leaf.png";

interface TreeLeafProps {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  isActive: boolean;
  title: string;
  content: string;
  position: "left" | "right" | "center";
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const TreeLeaf = ({
  x,
  y,
  rotation,
  isActive,
  color,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TreeLeafProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (isActive) {
      setIsHovered(true);
      onMouseEnter?.();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  return (
    <motion.g
      style={{ cursor: isActive ? "pointer" : "default", pointerEvents: isActive ? "auto" : "none" }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0 }}
      animate={
        isActive
          ? { 
              opacity: 1, 
              scale: isHovered ? 1.25 : 1 
            }
          : { opacity: 0, scale: 0 }
      }
      transition={{ duration: isHovered ? 0.2 : 0.8, ease: "easeOut" }}
    >
      {/* Glow effect on hover */}
      {isHovered && isActive && (
        <circle
          cx={x}
          cy={y}
          r="60"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.6"
          style={{
            filter: `blur(8px)`,
            pointerEvents: "none",
          }}
        >
          <animate
            attributeName="r"
            values="60;80;60"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.3;0.6"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* Leaf image */}
      <image
        href={leafImage}
        x={x - 40}
        y={y - 60}
        width="80"
        height="120"
        transform={`rotate(${rotation} ${x} ${y})`}
        style={{
          filter: isActive 
            ? isHovered 
              ? `hue-rotate(200deg) saturate(1.8) brightness(1.5) contrast(1.1) drop-shadow(0 12px 30px ${color}CC) drop-shadow(0 0 20px ${color}AA) drop-shadow(0 0 15px ${color}88)` 
              : `hue-rotate(200deg) saturate(1.6) brightness(1.4) contrast(1.05) drop-shadow(0 4px 12px ${color}66) drop-shadow(0 0 8px ${color}44)`
            : "none",
          pointerEvents: isActive ? "auto" : "none",
          transition: "filter 0.2s ease-out",
        }}
      />
    </motion.g>
  );
};
