import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { SphereData, UserJourney } from "@/pages/Seccion3";
import { AnimalSilhouette } from "./AnimalSilhouette";

interface CognitivePaintingProps {
  userJourney: UserJourney;
  spheresData: SphereData[];
  onBack: () => void;
}

export const CognitivePainting = ({
  userJourney,
  spheresData,
  onBack,
}: CognitivePaintingProps) => {
  const navigate = useNavigate();

  // Get explored spheres
  const exploredSpheres = spheresData.filter((s) =>
    userJourney.spheresClicked.includes(s.id)
  );

  // Determine dominant sphere and colors
  const { dominantType, animalColors } = useMemo(() => {
    let dominant = userJourney.dominantSphere;
    
    // If no dominant sphere is set, calculate it from ratings
    if (!dominant && exploredSpheres.length > 0) {
      if (Object.keys(userJourney.ratings || {}).length > 0) {
        const entries = Object.entries(userJourney.ratings);
        dominant = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
      } else {
        dominant = exploredSpheres[0].id;
      }
    }

    // Get colors from explored spheres (sorted by rating or time)
    const colors = exploredSpheres
      .sort((a, b) => {
        const ratingA = userJourney.ratings?.[a.id] || 0;
        const ratingB = userJourney.ratings?.[b.id] || 0;
        return ratingB - ratingA;
      })
      .map(s => s.color)
      .slice(0, 3); // Top 3 colors

    return { dominantType: dominant, animalColors: colors };
  }, [userJourney, exploredSpheres]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #E8DFF5 0%, #f4f1de 50%, #faf8f3 100%)'
    }}>
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
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
          className="text-center mb-12"
        >
          <h1 className="font-semibold mb-6" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            color: '#6B5D4F',
            fontSize: '56px'
          }}>
            Tu Animal Espiritual Cognitivo
          </h1>
          <p className="mb-8" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#8B7BA8',
            lineHeight: '1.8',
            fontSize: '24px'
          }}>
            Una representación visual de tu mente<br />
            en la era digital
          </p>
        </motion.div>

        {/* Animal Silhouette and Legend - Side by side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-16 max-w-7xl mx-auto"
        >
          {/* Animal */}
          <div className="flex flex-col items-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30">
              <AnimalSilhouette 
                animalType={dominantType} 
                colors={animalColors}
                size={450}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-center"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '32px',
                fontStyle: 'italic',
                color: '#6B5D4F'
              }}
            >
              {(() => {
                switch(dominantType) {
                  case "fragmentado": return "Tu espíritu: La Mariposa";
                  case "profundo": return "Tu espíritu: El Búho";
                  case "delegado": return "Tu espíritu: El Pulpo";
                  case "aumentado": return "Tu espíritu: El Águila";
                  case "hibrido": return "Tu espíritu: El Camaleón";
                  default: return "Tu Esencia Cognitiva";
                }
              })()}
            </motion.p>
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="flex-shrink-0"
          >
            <div className="rounded-2xl p-8 bg-white/50 backdrop-blur-sm border border-white/30 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-center" style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: '#6B5D4F',
                fontStyle: 'italic'
              }}>
                Colores de tu Mente
              </h3>
              <div className="space-y-4">
                {exploredSpheres.map((sphere) => {
                  const rating = userJourney.ratings?.[sphere.id] || 0;
                  return (
                    <div key={sphere.id} className="flex items-center gap-4">
                      <div
                        className="w-7 h-7 rounded-full shadow-md flex-shrink-0"
                        style={{ 
                          backgroundColor: sphere.color,
                          boxShadow: `0 0 15px ${sphere.color}60`
                        }}
                      />
                      <div className="flex-1 min-w-[200px]">
                        <span style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '16px',
                          color: '#4A3A5A',
                          fontWeight: 500
                        }}>
                          {sphere.title}
                        </span>
                        {rating > 0 && (
                          <span style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            color: sphere.color,
                            marginLeft: '10px'
                          }}>
                            ★ {rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <p className="whitespace-pre-line" style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '22px',
            color: '#4A3A5A',
            lineHeight: '1.9'
          }}>
            {`Esta es tu esencia cognitiva.

Cada color representa un modo de pensar que exploraste.
La intensidad refleja tu nivel de identificación.

No hay animales buenos o malos.
Solo patrones.

Y los patrones evolucionan con la consciencia.`}
          </p>
        </motion.div>

        {/* Botones organizados: Constelación arriba, Lobby abajo */}
        <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-3">
          {/* Constelación button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onBack}
            className="px-6 py-3 backdrop-blur-md border rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#1a1a1a',
              fontFamily: 'Inter, sans-serif',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <svg className="clover-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
              {/* Estrella/Constelación */}
              <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" fill="url(#starGradient1)" />
              <circle cx="12" cy="12" r="1.5" fill="#F5F5F5" opacity="0.9" />
              {/* Gradientes perla para estrella */}
              <defs>
                <radialGradient id="starGradient1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#F8F8FF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F0F0F5" stopOpacity="0.85" />
                </radialGradient>
              </defs>
            </svg>
            ← Constelación
          </motion.button>

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 backdrop-blur-md border rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#1a1a1a',
              fontFamily: 'Inter, sans-serif',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            🌳 ← Lobby
          </button>
        </div>
      </div>
    </div>
  );
};
