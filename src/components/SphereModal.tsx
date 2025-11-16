import { motion } from "framer-motion";
import type { SphereData } from "@/pages/Seccion3";
import { X } from "lucide-react";

interface SphereModalProps {
  sphere: SphereData;
  onClose: () => void;
}

const getSymbolPath = (type: string, size: number = 40) => {
  const scale = size / 80;
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
    case "delegado":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.8">
            <path d="M40 40 L40 20 M35 25 L40 20 L45 25" />
            <path d="M40 40 L60 40 M55 35 L60 40 L55 45" />
            <path d="M40 40 L40 60 M35 55 L40 60 L45 55" />
            <path d="M40 40 L20 40 M25 35 L20 40 L25 45" />
          </g>
        </svg>
      );
    case "aumentado":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.8">
            <line x1="40" y1="25" x2="30" y2="45" />
            <line x1="40" y1="25" x2="50" y2="45" />
            <line x1="30" y1="45" x2="50" y2="45" />
            <line x1="30" y1="45" x2="40" y2="55" />
            <line x1="50" y1="45" x2="40" y2="55" />
            <circle cx="40" cy="25" r="4" />
            <circle cx="30" cy="45" r="4" />
            <circle cx="50" cy="45" r="4" />
            <circle cx="40" cy="55" r="4" />
          </g>
        </svg>
      );
    case "hibrido":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g fill="currentColor" opacity="0.7">
            <ellipse cx="32" cy="40" rx="15" ry="20" />
            <ellipse cx="48" cy="40" rx="15" ry="20" />
          </g>
        </svg>
      );
    case "profundo":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <g stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.8">
            <path d="M40 40 Q45 35 50 40 T50 50 Q45 55 40 50 T30 40 Q35 30 45 30" />
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="relative rounded-3xl p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{
          backgroundColor: 'rgba(250, 248, 243, 0.95)',
          border: `3px solid ${sphere.color}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.3)`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          style={{ color: sphere.color }}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div style={{ color: sphere.color }}>
              {getSymbolPath(sphere.emoji, 40)}
            </div>
            <h2
              className="font-semibold"
              style={{ 
                color: '#2D1B3D',
                fontSize: '22px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}
            >
              {sphere.title}
            </h2>
          </div>
          <p className="whitespace-pre-line" style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '18px',
            color: '#3A2A4A',
            lineHeight: '1.7'
          }}>
            {sphere.description}
          </p>
        </div>

        {/* Separator */}
        <div className="h-px mb-8" style={{ backgroundColor: '#E8DFF5' }} />

        {/* Examples section */}
        <div className="mb-8">
          <h3 className="mb-4" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#8B6BA5',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            EJEMPLOS COTIDIANOS
          </h3>
          <ul className="space-y-3">
            {sphere.examples.map((example, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1" style={{ color: sphere.color, fontSize: '16px' }}>
                  →
                </span>
                <span style={{
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: '16px',
                  color: '#4A3A5A',
                  lineHeight: '1.7'
                }}>
                  {example}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Separator */}
        <div className="h-px mb-8" style={{ backgroundColor: '#E8DFF5' }} />

        {/* Neuroscience section */}
        <div>
          <h3 className="mb-4" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#8B6BA5',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            NEUROCIENCIA
          </h3>
          <p className="whitespace-pre-line" style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '16px',
            color: '#4A3A5A',
            lineHeight: '1.7'
          }}>
            {sphere.neuroscience}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
