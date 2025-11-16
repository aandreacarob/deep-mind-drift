import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { SphereData, UserJourney } from "@/pages/Seccion3";

interface ConstellationProps {
  userJourney: UserJourney;
  spheresData: SphereData[];
  onGeneratePainting: () => void;
  onBack: () => void;
}

const insights: Record<string, { title: string; message: string }> = {
  profundo: {
    title: "Tu esfera dominante: Pensamiento Profundo",
    message: `Valoras concentrarte profundamente.

En un mundo que premia la velocidad,
esto es una ventaja.

Pero el entorno digital no está diseñado para ti.`,
  },
  fragmentado: {
    title: "Tu esfera dominante: Pensamiento Fragmentado",
    message: `Reconoces tu atención dividida.

Ser consciente es el primer paso.
No eres débil.
Estás respondiendo a un mundo diseñado 
para fragmentar.

La pregunta es: ¿quieres cambiarlo?`,
  },
  delegado: {
    title: "Tu esfera dominante: Pensamiento Delegado",
    message: `Te preguntas qué perdemos cuando 
delegamos todo.

Hacerte esta pregunta ya es pensamiento crítico.`,
  },
  aumentado: {
    title: "Tu esfera dominante: Pensamiento Aumentado",
    message: `Buscas balance.

No quieres rechazar la tecnología,
pero tampoco ser dominado por ella.

Esta es la zona más sana.`,
  },
  hibrido: {
    title: "Tu esfera dominante: Pensamiento Híbrido",
    message: `Controlas conscientemente tus estados cognitivos.

Esta metacognición es el nivel más avanzado
de relación con la tecnología.

Es difícil de sostener, pero poderoso.`,
  },
};

export const Constellation = ({
  userJourney,
  spheresData,
  onGeneratePainting,
  onBack,
}: ConstellationProps) => {
  const exploredSpheres = spheresData.filter((s) =>
    userJourney.spheresClicked.includes(s.id)
  );

  const insight = insights[userJourney.dominantSphere] || insights.profundo;

  // Calculate sphere sizes based on time spent
  const maxTime = Math.max(...Object.values(userJourney.timeSpent));
  const getSphereSize = (id: string) => {
    const time = userJourney.timeSpent[id] || 0;
    return 80 + (time / maxTime) * 80; // 80px to 160px
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #3A2A4A 0%, #2C3E50 100%)'
    }}>
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-semibold text-white mb-4" style={{
            fontFamily: 'Inter, sans-serif'
          }}>
            TU CONSTELACIÓN COGNITIVA
          </h1>
          <p className="text-lg" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#D1C4E0'
          }}>
            Lo que exploraste<br />
            y el tiempo que dedicaste a cada esfera
          </p>
        </motion.div>

        {/* Constellation Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative w-full max-w-4xl mx-auto h-[600px] mb-16 rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(58, 42, 74, 0.6) 0%, rgba(44, 62, 80, 0.6) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <svg className="absolute inset-0 w-full h-full">
            {/* Draw connecting lines */}
            {exploredSpheres.map((sphere1, i) =>
              exploredSpheres.slice(i + 1).map((sphere2, j) => (
                <motion.line
                  key={`${sphere1.id}-${sphere2.id}`}
                  x1={`${sphere1.position.x}%`}
                  y1={`${sphere1.position.y}%`}
                  x2={`${sphere2.position.x}%`}
                  y2={`${sphere2.position.y}%`}
                  stroke="white"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.2 + j * 0.1 }}
                />
              ))
            )}
          </svg>

          {/* Draw spheres */}
          {exploredSpheres.map((sphere, index) => {
            const size = getSphereSize(sphere.id);
            return (
              <motion.div
                key={sphere.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.2, type: "spring" }}
                className="absolute flex items-center justify-center rounded-full border-2 border-white/50"
                style={{
                  left: `${sphere.position.x}%`,
                  top: `${sphere.position.y}%`,
                  width: size,
                  height: size,
                  backgroundColor: sphere.color,
                  transform: "translate(-50%, -50%)",
                  boxShadow: `0 0 40px ${sphere.color}80`,
                }}
              >
                <span style={{ fontSize: size * 0.4 }}>{sphere.emoji}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-6" style={{
            fontFamily: 'Inter, sans-serif'
          }}>
            {insight.title}
          </h2>
          <p className="text-lg whitespace-pre-line" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#D1C4E0',
            lineHeight: '1.8'
          }}>
            {insight.message}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center"
        >
          <button
            onClick={onGeneratePainting}
            className="px-10 py-5 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-2xl"
            style={{
              backgroundColor: '#9B87B5',
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px'
            }}
          >
            → Generar mi pintura cognitiva
          </button>
        </motion.div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="fixed bottom-8 left-8 z-50 px-6 py-3 backdrop-blur-sm border rounded-full font-semibold hover:scale-105 transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};
