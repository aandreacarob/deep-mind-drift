import { motion } from "framer-motion";
import type { SphereData } from "@/pages/Seccion3";
import { X } from "lucide-react";

interface SphereModalProps {
  sphere: SphereData;
  onClose: () => void;
}

export const SphereModal = ({ sphere, onClose }: SphereModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl"
        style={{
          borderColor: sphere.color,
          boxShadow: `0 0 60px ${sphere.color}60`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: sphere.color }}
            >
              {sphere.emoji}
            </div>
            <h2
              className="text-3xl font-bold"
              style={{ color: sphere.color }}
            >
              {sphere.title}
            </h2>
          </div>
          <p className="text-lg text-gray-300 whitespace-pre-line leading-relaxed">
            {sphere.description}
          </p>
        </div>

        {/* Examples section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            EJEMPLOS COTIDIANOS
          </h3>
          <ul className="space-y-3">
            {sphere.examples.map((example, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <span className="text-lg mt-1" style={{ color: sphere.color }}>
                  →
                </span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Neuroscience section */}
        <div
          className="p-6 rounded-2xl border-2"
          style={{
            backgroundColor: `${sphere.color}15`,
            borderColor: `${sphere.color}40`,
          }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🧠</span>
            NEUROCIENCIA
          </h3>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {sphere.neuroscience}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
