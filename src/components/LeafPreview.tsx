import { motion } from "framer-motion";

interface LeafPreviewProps {
  title: string;
  summary: string;
  color: string;
  x: number;
  y: number;
  position: "left" | "right" | "center";
  onReadMore: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const LeafPreview = ({
  title,
  summary,
  color,
  x,
  y,
  position,
  onReadMore,
  onMouseEnter,
  onMouseLeave,
}: LeafPreviewProps) => {
  // Calculate preview position based on leaf position
  // x and y are in SVG coordinates (0-800), need to convert to percentage
  // The SVG is 800x800 but displayed at max 800px width and 90vh height
  const svgToPercentX = (svgX: number) => (svgX / 800) * 100;
  const svgToPercentY = (svgY: number) => (svgY / 800) * 100;
  
  const getPreviewPosition = () => {
    // Calculate offsets based on position
    const offsetXPercent = position === "left" ? -45 : position === "right" ? 15 : -12;
    const offsetYPercent = -10;
    
    return {
      left: `calc(${svgToPercentX(x)}% + ${offsetXPercent}%)`,
      top: `calc(${svgToPercentY(y)}% + ${offsetYPercent}%)`,
    };
  };

  return (
    <motion.div
      className="absolute z-40 w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200/50 p-4 pointer-events-auto"
      style={getPreviewPosition()}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        onMouseEnter?.();
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        onMouseLeave?.();
      }}
    >
      <h3
        className="text-lg font-semibold mb-2 font-['Cormorant_Garamond'] italic"
        style={{ color }}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-700 mb-4 leading-relaxed font-['Cormorant_Garamond']">
        {summary}
      </p>
      <p className="w-full text-right text-sm font-medium italic font-['Cormorant_Garamond']" style={{ color }}>
        Da click en la hoja para leer mas
      </p>
    </motion.div>
  );
};

