import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
}

export const TreeLeaf = ({
  x,
  y,
  rotation,
  color,
  isActive,
  title,
  content,
}: TreeLeafProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.g
        style={{ cursor: isActive ? "pointer" : "default", pointerEvents: isActive ? "auto" : "none" }}
        onClick={() => isActive && setIsOpen(true)}
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

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-4" style={{ color }}>
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-base whitespace-pre-line leading-relaxed text-foreground">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
