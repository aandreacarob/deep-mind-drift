import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CustomCursor } from "@/components/CustomCursor";

const Seccion2 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-narrative-purple via-narrative-teal to-narrative-yellow flex items-center justify-center px-4 relative overflow-hidden">
      <CustomCursor />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="max-w-4xl text-center relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl md:text-6xl font-bold text-white text-handwritten mb-8"
        >
          Sección 2: Próximamente
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-xl md:text-2xl text-white/90 text-handwritten mb-12"
        >
          La narrativa continúa...
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => navigate("/seccion-1")}
          className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-lg font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105"
        >
          ← Volver a Sección 1
        </motion.button>
      </motion.div>

      {/* Decorative animated circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-narrative-yellow/20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-narrative-purple/20 blur-3xl"
      />
    </div>
  );
};

export default Seccion2;
