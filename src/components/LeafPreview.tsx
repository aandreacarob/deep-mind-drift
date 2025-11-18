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
      className="absolute z-40 w-80 backdrop-blur-sm p-6 pointer-events-auto"
      style={{
        ...getPreviewPosition(),
        background: 'linear-gradient(135deg, rgba(245, 245, 220, 0.95) 0%, rgba(255, 250, 240, 0.92) 100%)',
        borderRadius: '45% 55% 52% 48% / 48% 45% 55% 52%',
        boxShadow: '0 8px 32px rgba(139, 69, 19, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(210, 180, 140, 0.2)',
        border: '2px solid rgba(210, 180, 140, 0.4)',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 248, 220, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(245, 222, 179, 0.3) 0%, transparent 50%)',
      }}
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
        className="text-xl font-semibold mb-3 font-['Cormorant_Garamond'] italic tracking-wide"
        style={{ 
          color: 'hsl(225, 73%, 57%)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        {title}
      </h3>
      <p className="text-base mb-5 leading-relaxed font-['Cormorant_Garamond']" style={{ color: 'hsl(25, 20%, 25%)' }}>
        {summary}
      </p>
      <p className="w-full text-right text-sm font-medium italic font-['Cormorant_Garamond']" style={{ color: 'hsl(225, 73%, 57%)' }}>
        Da click en la hoja para leer mas
      </p>
    </motion.div>
  );
};

