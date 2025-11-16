import { motion } from "framer-motion";
import type { SphereData } from "@/pages/Seccion3";
import { X } from "lucide-react";

interface SphereModalProps {
  sphere: SphereData;
  onClose: () => void;
}

const getSymbolPath = (type: string, size: number = 40) => {
  switch (type) {
    case "fragmentado":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g stroke="currentColor" strokeWidth="3" fill="none" opacity="0.8">
            <line x1="40" y1="20" x2="40" y2="30" />
            <line x1="52" y1="24" x2="58" y2="30" />
            <line x1="60" y1="40" x2="50" y2="40" />
            <line x1="52" y1="56" x2="58" y2="50" />
            <line x1="40" y1="60" x2="40" y2="50" />
            <line x1="28" y1="56" x2="22" y2="50" />
            <line x1="20" y1="40" x2="30" y2="40" />
            <line x1="28" y1="24" x2="22" y2="30" />
          </g>
        </svg>
      );
    case "acumulador":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.8">
            <path d="M40 20 L55 40 L40 60 L25 40 Z" />
            <line x1="40" y1="20" x2="40" y2="60" />
            <line x1="25" y1="40" x2="55" y2="40" />
          </g>
        </svg>
      );
    case "reactivo":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.8">
            <line x1="40" y1="20" x2="40" y2="60" />
            <line x1="20" y1="40" x2="60" y2="40" />
            <circle cx="40" cy="20" r="3" fill="currentColor" />
            <circle cx="60" cy="40" r="3" fill="currentColor" />
            <circle cx="40" cy="60" r="3" fill="currentColor" />
            <circle cx="20" cy="40" r="3" fill="currentColor" />
          </g>
        </svg>
      );
    case "buscador":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g stroke="currentColor" fill="none" opacity="0.8">
            <circle cx="40" cy="40" r="20" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="6" fill="currentColor" />
          </g>
        </svg>
      );
    case "ausente":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.8">
            <circle cx="40" cy="40" r="20" />
            <path d="M40 20 L40 60" fill="currentColor" />
            <path d="M40 20 A20 20 0 0 1 40 60 Z" fill="currentColor" />
          </g>
        </svg>
      );
    default:
      return null;
  }
};

export const SphereModal = ({ sphere, onClose }: SphereModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(45, 27, 61, 0.6)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative rounded-3xl p-10 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: `3px solid ${sphere.color}66`,
          boxShadow: `0 20px 60px rgba(45, 27, 61, 0.2)`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-all duration-200 hover:rotate-90"
          style={{ color: '#8B6BA5' }}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div style={{ color: sphere.color }}>
              {getSymbolPath(sphere.symbol, 40)}
            </div>
            <h2
              className="font-bold"
              style={{ 
                color: sphere.color,
                fontSize: '24px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700
              }}
            >
              {sphere.title}
            </h2>
          </div>
          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '16px',
            color: '#3A2A4A',
            lineHeight: '1.7'
          }}>
            {sphere.description}
          </p>
        </div>

        {/* Examples section */}
        <div className="mb-4 p-4 rounded-xl" style={{
          backgroundColor: 'rgba(139, 107, 165, 0.08)'
        }}>
          <h3 className="mb-2" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#8B6BA5',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Ejemplos cotidianos
          </h3>
          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '15px',
            color: '#3A2A4A',
            lineHeight: '1.7',
            margin: 0,
            whiteSpace: 'pre-line'
          }}>
            {sphere.examples}
          </p>
        </div>

        {/* Neuroscience section */}
        <div className="mb-6 p-4 rounded-xl" style={{
          backgroundColor: 'rgba(74, 137, 200, 0.08)'
        }}>
          <h3 className="mb-2" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#4A89C8',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Neurociencia
          </h3>
          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '15px',
            color: '#3A2A4A',
            lineHeight: '1.7',
            margin: 0
          }}>
            {sphere.neuroscience}
          </p>
        </div>

        {/* Light section */}
        <div className="mb-4 p-4 rounded-xl" style={{
          backgroundColor: 'rgba(91, 199, 59, 0.08)'
        }}>
          <h3 className="mb-2" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#5BC73B',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Luz ☀
          </h3>
          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '15px',
            color: '#3A2A4A',
            lineHeight: '1.7',
            margin: 0
          }}>
            {sphere.light}
          </p>
        </div>

        {/* Shadow section */}
        <div className="mb-6 p-4 rounded-xl" style={{
          backgroundColor: 'rgba(160, 79, 211, 0.08)'
        }}>
          <h3 className="mb-2" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#A04FD3',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Sombra ☾
          </h3>
          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '15px',
            color: '#3A2A4A',
            lineHeight: '1.7',
            margin: 0
          }}>
            {sphere.shadow}
          </p>
        </div>

        {/* Phrase */}
        <p className="text-center pt-5 border-t italic" style={{
          fontFamily: 'Crimson Pro, serif',
          fontSize: '18px',
          fontWeight: 500,
          color: sphere.color,
          lineHeight: '1.6',
          borderTopColor: 'rgba(0, 0, 0, 0.1)'
        }}>
          "{sphere.phrase}"
        </p>
      </motion.div>
    </motion.div>
  );
};
