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
}

export const TreeLeaf = ({
  x,
  y,
  rotation,
  isActive,
  onClick,
}: TreeLeafProps) => {
  return (
    <motion.g
      style={{ cursor: isActive ? "pointer" : "default", pointerEvents: isActive ? "auto" : "none" }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={
        isActive
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0 }
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Leaf image */}
      <image
        href={leafImage}
        x={x - 40}
        y={y - 60}
        width="80"
        height="120"
        transform={`rotate(${rotation} ${x} ${y})`}
        style={{
          filter: isActive ? "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" : "none",
        }}
      />
    </motion.g>
  );
};
