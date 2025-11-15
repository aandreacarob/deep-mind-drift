import { motion } from "framer-motion";
import { useState } from "react";

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
}

export const TreeLeaf = ({
  x,
  y,
  rotation,
  color,
  isActive,
  title,
  content,
  position,
}: TreeLeafProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTooltipPosition = () => {
    switch (position) {
      case "left":
        return { left: "calc(100% + 20px)", top: "50%", transform: "translateY(-50%)" };
      case "right":
        return { right: "calc(100% + 20px)", top: "50%", transform: "translateY(-50%)" };
      case "center":
        return { left: "50%", bottom: "calc(100% + 20px)", transform: "translateX(-50%)" };
    }
  };

  return (
    <motion.g
      style={{ cursor: isActive ? "pointer" : "default" }}
      onMouseEnter={() => isActive && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0.4, scale: 0.8 }}
      animate={
        isActive
          ? { opacity: 1, scale: 1 }
          : { opacity: 0.4, scale: 0.8 }
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Leaf shape */}
      <motion.ellipse
        cx={x}
        cy={y}
        rx="45"
        ry="70"
        fill={isActive ? color : "#C8B8D8"}
        opacity={isActive ? 1 : 0.4}
        transform={`rotate(${rotation} ${x} ${y})`}
        style={{
          filter: isActive ? "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" : "none",
        }}
      />
      
      {/* Leaf vein */}
      <motion.line
        x1={x}
        y1={y - 60}
        x2={x}
        y2={y + 60}
        stroke={isActive ? "rgba(255,255,255,0.3)" : "rgba(200,184,216,0.3)"}
        strokeWidth="2"
        transform={`rotate(${rotation} ${x} ${y})`}
      />

      {/* Tooltip */}
      {isHovered && (
        <foreignObject
          x={position === "left" ? x + 65 : position === "right" ? x - 385 : x - 160}
          y={position === "center" ? y - 300 : y - 150}
          width="320"
          height="300"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg"
            style={{
              border: `2px solid ${color}20`,
              boxShadow: `0 8px 24px ${color}15`,
            }}
          >
            <h3
              className="font-semibold text-lg mb-3 tracking-tight"
              style={{ color: "#2D1B3D", letterSpacing: "-0.02em" }}
            >
              {title}
            </h3>
            <div
              className="text-base whitespace-pre-line"
              style={{
                color: "#3A2A4A",
                lineHeight: "1.75",
                fontFamily: "'Crimson Text', Georgia, serif",
              }}
            >
              {content}
            </div>
          </motion.div>
        </foreignObject>
      )}
    </motion.g>
  );
};
