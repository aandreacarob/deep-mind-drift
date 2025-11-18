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
      className="absolute z-40 w-80 backdrop-blur-md p-6 pointer-events-auto"
      style={{
        ...getPreviewPosition(),
        background: 'linear-gradient(135deg, rgba(255, 252, 240, 0.98) 0%, rgba(255, 248, 230, 0.98) 100%)',
        borderRadius: '45% 55% 52% 48% / 48% 45% 55% 52%',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.6), 0 0 30px rgba(210, 180, 140, 0.5)',
        border: '3px solid rgba(139, 69, 19, 0.3)',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 245, 210, 0.6) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(245, 222, 179, 0.5) 0%, transparent 50%)',
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
        className="text-xl font-bold mb-3 font-['Cormorant_Garamond'] italic tracking-wide"
        style={{ 
          color: 'hsl(225, 73%, 47%)',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.5)'
        }}
      >
        {title}
      </h3>
      <p className="text-base mb-5 leading-relaxed font-['Cormorant_Garamond']" style={{ color: 'hsl(25, 30%, 20%)', fontWeight: 500 }}>
        {summary}
      </p>
      <p className="w-full text-right text-sm font-bold italic font-['Cormorant_Garamond']" style={{ color: 'hsl(225, 73%, 47%)' }}>
        Da click en la hoja para leer mas
      </p>
    </motion.div>
  );
};

