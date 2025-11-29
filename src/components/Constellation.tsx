import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useRef } from "react";
import type { SphereData, UserJourney } from "@/pages/Seccion3";

interface ConstellationProps {
  userJourney: UserJourney;
  spheresData: SphereData[];
  onGeneratePainting: () => void;
  onBack: () => void;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  twinkleDuration: number;
}

interface ConstellationPoint {
  x: number;
  y: number;
  size: number;
  isMain?: boolean;
  sphereId?: string;
}

// Constellation shapes based on dominant thinking type
const getConstellationShape = (dominantType: string): ConstellationPoint[] => {
  switch (dominantType) {
    case "fragmentado": // Mariposa (dispersión, fragmentación)
      return [
        // Cuerpo central
        { x: 50, y: 50, size: 2 },
        { x: 50, y: 45, size: 2 },
        { x: 50, y: 55, size: 2 },
        // Ala izquierda superior
        { x: 35, y: 35, size: 3 },
        { x: 30, y: 30, size: 2.5 },
        { x: 28, y: 32, size: 2 },
        { x: 32, y: 28, size: 2 },
        // Ala izquierda inferior
        { x: 35, y: 65, size: 3 },
        { x: 30, y: 70, size: 2.5 },
        { x: 28, y: 68, size: 2 },
        { x: 32, y: 72, size: 2 },
        // Ala derecha superior
        { x: 65, y: 35, size: 3 },
        { x: 70, y: 30, size: 2.5 },
        { x: 72, y: 32, size: 2 },
        { x: 68, y: 28, size: 2 },
        // Ala derecha inferior
        { x: 65, y: 65, size: 3 },
        { x: 70, y: 70, size: 2.5 },
        { x: 72, y: 68, size: 2 },
        { x: 68, y: 72, size: 2 },
        // Antenas
        { x: 48, y: 38, size: 1.5 },
        { x: 52, y: 38, size: 1.5 },
      ];
    
    case "profundo": // Búho (sabiduría, profundidad)
      return [
        // Cabeza
        { x: 50, y: 35, size: 3 },
        { x: 45, y: 32, size: 2 },
        { x: 55, y: 32, size: 2 },
        // Ojos
        { x: 45, y: 35, size: 2.5 },
        { x: 55, y: 35, size: 2.5 },
        // Pico
        { x: 50, y: 38, size: 2 },
        // Cuerpo
        { x: 50, y: 45, size: 3 },
        { x: 50, y: 52, size: 3.5 },
        { x: 50, y: 60, size: 3 },
        // Alas
        { x: 40, y: 48, size: 2.5 },
        { x: 35, y: 52, size: 2 },
        { x: 32, y: 56, size: 2 },
        { x: 60, y: 48, size: 2.5 },
        { x: 65, y: 52, size: 2 },
        { x: 68, y: 56, size: 2 },
        // Cola
        { x: 47, y: 65, size: 2 },
        { x: 50, y: 68, size: 2 },
        { x: 53, y: 65, size: 2 },
        // Orejas/plumas
        { x: 42, y: 28, size: 2 },
        { x: 58, y: 28, size: 2 },
      ];
    
    case "delegado": // Pulpo (múltiples brazos, delegación)
      return [
        // Cabeza central
        { x: 50, y: 40, size: 4 },
        { x: 48, y: 38, size: 2 },
        { x: 52, y: 38, size: 2 },
        // Tentáculos
        { x: 35, y: 50, size: 2.5 },
        { x: 28, y: 58, size: 2 },
        { x: 25, y: 65, size: 1.5 },
        { x: 42, y: 52, size: 2.5 },
        { x: 38, y: 62, size: 2 },
        { x: 35, y: 70, size: 1.5 },
        { x: 50, y: 55, size: 2.5 },
        { x: 50, y: 65, size: 2 },
        { x: 50, y: 73, size: 1.5 },
        { x: 58, y: 52, size: 2.5 },
        { x: 62, y: 62, size: 2 },
        { x: 65, y: 70, size: 1.5 },
        { x: 65, y: 50, size: 2.5 },
        { x: 72, y: 58, size: 2 },
        { x: 75, y: 65, size: 1.5 },
      ];
    
    case "aumentado": // Águila (visión ampliada, perspectiva)
      return [
        // Cabeza
        { x: 50, y: 30, size: 3 },
        { x: 48, y: 28, size: 2 },
        { x: 52, y: 32, size: 2 },
        // Cuello y cuerpo
        { x: 50, y: 38, size: 2.5 },
        { x: 50, y: 45, size: 3 },
        { x: 50, y: 52, size: 3.5 },
        // Ala izquierda
        { x: 42, y: 45, size: 2.5 },
        { x: 35, y: 42, size: 2.5 },
        { x: 28, y: 40, size: 2 },
        { x: 22, y: 38, size: 2 },
        { x: 38, y: 48, size: 2 },
        { x: 30, y: 50, size: 2 },
        { x: 25, y: 52, size: 1.5 },
        // Ala derecha
        { x: 58, y: 45, size: 2.5 },
        { x: 65, y: 42, size: 2.5 },
        { x: 72, y: 40, size: 2 },
        { x: 78, y: 38, size: 2 },
        { x: 62, y: 48, size: 2 },
        { x: 70, y: 50, size: 2 },
        { x: 75, y: 52, size: 1.5 },
        // Cola
        { x: 48, y: 60, size: 2 },
        { x: 50, y: 65, size: 2 },
        { x: 52, y: 60, size: 2 },
      ];
    
    case "hibrido": // Camaleón (adaptabilidad, cambio)
      return [
        // Cabeza
        { x: 35, y: 35, size: 3 },
        { x: 32, y: 33, size: 2 },
        { x: 30, y: 36, size: 1.5 }, // ojo
        // Cresta
        { x: 36, y: 30, size: 2 },
        { x: 38, y: 28, size: 1.5 },
        // Cuerpo curvado
        { x: 40, y: 38, size: 2.5 },
        { x: 45, y: 42, size: 3 },
        { x: 50, y: 45, size: 3.5 },
        { x: 55, y: 48, size: 3.5 },
        { x: 60, y: 52, size: 3 },
        { x: 63, y: 56, size: 2.5 },
        // Patas
        { x: 42, y: 45, size: 2 },
        { x: 40, y: 50, size: 1.5 },
        { x: 52, y: 50, size: 2 },
        { x: 50, y: 55, size: 1.5 },
        { x: 60, y: 55, size: 2 },
        { x: 58, y: 60, size: 1.5 },
        // Cola enrollada
        { x: 66, y: 60, size: 2.5 },
        { x: 68, y: 65, size: 2 },
        { x: 68, y: 70, size: 2 },
        { x: 65, y: 72, size: 2 },
        { x: 62, y: 70, size: 1.5 },
      ];
    
    default:
      return [];
  }
};

const Constellation = ({
  userJourney,
  spheresData,
  onGeneratePainting,
  onBack,
}: ConstellationProps) => {
  const navigate = useNavigate();
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const tiktokEmbedRef = useRef<HTMLDivElement>(null);

  // Cargar el script de TikTok embed
  useEffect(() => {
    // Verificar si el script ya existe
    const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // No removemos el script ya que puede ser usado por otros componentes
      // El script se procesará automáticamente cuando encuentre blockquotes con clase tiktok-embed
    };
  }, []);

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

  const exploredSpheres = spheresData.filter((s) =>
    userJourney.spheresClicked.includes(s.id)
  );

  const insight = insights[userJourney.dominantSphere] || insights.profundo;

  // Calculate sphere sizes based on ratings (if available) or time spent
  const hasRatings = Object.keys(userJourney.ratings || {}).length > 0;
  
  const getSphereSize = (id: string) => {
    if (hasRatings && userJourney.ratings[id]) {
      // Use ratings: scale from 8 to 16
      const rating = userJourney.ratings[id];
      return 8 + (rating - 1) * 2; // 8, 10, 12, 14, 16
    } else if (userJourney.timeSpent[id]) {
      // Fallback to time spent
      const maxTime = Math.max(...Object.values(userJourney.timeSpent));
      const time = userJourney.timeSpent[id] || 0;
      return 8 + (time / maxTime) * 8; // 8px to 16px
    }
    return 10; // Default size
  };

  // Generate background stars with more variety
  const backgroundStars = useMemo<Star[]>(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 1200; i++) {
      const size = Math.random();
      stars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: size < 0.7 ? Math.random() * 1.5 + 0.5 : Math.random() * 2.5 + 2, // Most small, some big
        opacity: size < 0.7 ? Math.random() * 0.5 + 0.3 : Math.random() * 0.8 + 0.5,
        twinkleDelay: Math.random() * 8,
        twinkleDuration: Math.random() * 4 + 1.5,
      });
    }
    return stars;
  }, []);

  // Get constellation shape based on dominant type and scale it to use more space
  const constellationShape = useMemo(() => {
    // Determine the dominant sphere - use the one from userJourney or calculate it
    let dominantType = userJourney.dominantSphere;
    
    // If no dominant sphere is set, calculate it from ratings or clicked spheres
    if (!dominantType && exploredSpheres.length > 0) {
      if (Object.keys(userJourney.ratings || {}).length > 0) {
        const entries = Object.entries(userJourney.ratings);
        dominantType = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
      } else {
        // Default to first explored sphere
        dominantType = exploredSpheres[0].id;
      }
    }
    
    console.log('🌟 Dominant Type:', dominantType); // Debug log
    console.log('📊 Ratings:', userJourney.ratings); // Debug log
    
    const baseShape = getConstellationShape(dominantType);
    
    // Scale the constellation to use more of the canvas (from ~10% to ~90% instead of ~25% to ~75%)
    // This expands the constellation by approximately 1.5x
    const scaleFactor = 1.5;
    const centerX = 50;
    const centerY = 50;
    const minBound = 8; // Minimum position (8% from edge)
    const maxBound = 92; // Maximum position (92% from edge)
    
    return baseShape.map(point => {
      const scaledX = centerX + (point.x - centerX) * scaleFactor;
      const scaledY = centerY + (point.y - centerY) * scaleFactor;
      
      return {
        ...point,
        x: Math.max(minBound, Math.min(maxBound, scaledX)),
        y: Math.max(minBound, Math.min(maxBound, scaledY)),
      };
    });
  }, [userJourney.dominantSphere, userJourney.ratings, exploredSpheres]);

  // Assign explored spheres to main constellation points
  const constellationPoints = useMemo(() => {
    const shape = [...constellationShape];
    const mainPoints: ConstellationPoint[] = [];
    
    // Mark key points as main stars (where user's spheres will be placed)
    exploredSpheres.forEach((sphere, index) => {
      if (index < shape.length) {
        // Find larger points in the constellation
        const largePoints = shape.filter(p => p.size >= 2.5).sort((a, b) => b.size - a.size);
        if (largePoints[index]) {
          mainPoints.push({
            ...largePoints[index],
            isMain: true,
            sphereId: sphere.id,
          });
        }
      }
    });
    
    // Add remaining constellation points as supporting stars
    const supportPoints = shape.filter(p => 
      !mainPoints.some(mp => mp.x === p.x && mp.y === p.y)
    );
    
    return [...mainPoints, ...supportPoints];
  }, [constellationShape, exploredSpheres]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1e 50%, #050510 100%)'
    }}>
      {/* Background Stars - Twinkling with sparkle effect */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundStars.map((star) => {
          const isBig = star.size > 2;
          return (
            <div
              key={star.id}
              className="absolute"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
            >
              {/* Main star */}
              <motion.div
                className="absolute bg-white rounded-full"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  boxShadow: isBig ? `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.6)` : 'none',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  opacity: [star.opacity, star.opacity * 0.2, star.opacity],
                  scale: isBig ? [1, 1.2, 1] : [1, 0.8, 1],
                }}
                transition={{
                  duration: star.twinkleDuration,
                  repeat: Infinity,
                  delay: star.twinkleDelay,
                  ease: "easeInOut",
                }}
              />
              
              {/* Sparkle cross effect for bigger stars */}
              {isBig && (
                <>
                  <motion.div
                    className="absolute bg-white"
                    style={{
                      width: `${star.size * 3}px`,
                      height: '1px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      opacity: [0, star.opacity * 0.8, 0],
                      scaleX: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: star.twinkleDuration,
                      repeat: Infinity,
                      delay: star.twinkleDelay,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute bg-white"
                    style={{
                      width: '1px',
                      height: `${star.size * 3}px`,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      opacity: [0, star.opacity * 0.8, 0],
                      scaleY: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: star.twinkleDuration,
                      repeat: Infinity,
                      delay: star.twinkleDelay,
                      ease: "easeInOut",
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-7xl font-semibold text-white mb-4" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
          }}>
            Tu Constelación Cognitiva
          </h1>
          <p className="text-3xl mb-3" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#B8A9D4',
            opacity: 0.9
          }}>
            {(() => {
              // Calculate dominant sphere if not set
              let dominant = userJourney.dominantSphere;
              if (!dominant && exploredSpheres.length > 0) {
                if (Object.keys(userJourney.ratings || {}).length > 0) {
                  const entries = Object.entries(userJourney.ratings);
                  dominant = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
                } else {
                  dominant = exploredSpheres[0].id;
                }
              }
              
              switch(dominant) {
                case "fragmentado": return "La Mariposa - Transformación y Dispersión";
                case "profundo": return "El Búho - Sabiduría y Contemplación";
                case "delegado": return "El Pulpo - Múltiples Caminos";
                case "aumentado": return "El Águila - Visión Expandida";
                case "hibrido": return "El Camaleón - Adaptación Consciente";
                default: return "Tu Constelación Única";
              }
            })()}
          </p>
          <p className="text-xl" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#8B7BA8',
            opacity: 0.8
          }}>
            Las estrellas brillantes representan tus formas de pensar
          </p>
        </motion.div>

        {/* Constellation Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative w-full max-w-6xl mx-auto mb-16"
          style={{
            height: '800px',
          }}
        >
          <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))' }}>
            {/* Draw connecting lines sequentially to form the constellation shape */}
            {constellationPoints.map((point, i) => {
              if (i === constellationPoints.length - 1) return null;
              const nextPoint = constellationPoints[i + 1];
              
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={`${point.x}%`}
                  y1={`${point.y}%`}
                  x2={`${nextPoint.x}%`}
                  y2={`${nextPoint.y}%`}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + i * 0.1, 
                    ease: "easeOut" 
                  }}
                />
              );
            })}
            
            {/* Connect main points with brighter lines */}
            {constellationPoints.filter(p => p.isMain).map((point1, i, mainPoints) => 
              mainPoints.slice(i + 1).map((point2, j) => {
                const sphere1 = exploredSpheres.find(s => s.id === point1.sphereId);
                const sphere2 = exploredSpheres.find(s => s.id === point2.sphereId);
                if (!sphere1 || !sphere2) return null;
                
                return (
                  <motion.line
                    key={`main-${point1.sphereId}-${point2.sphereId}`}
                    x1={`${point1.x}%`}
                    y1={`${point1.y}%`}
                    x2={`${point2.x}%`}
                    y2={`${point2.y}%`}
                    stroke={sphere1.color}
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ 
                      duration: 1.5, 
                      delay: 1.5 + i * 0.2 + j * 0.2, 
                      ease: "easeInOut" 
                    }}
                  />
                );
              })
            )}
          </svg>

          {/* Draw supporting constellation stars (white dots) */}
          {constellationPoints.filter(p => !p.isMain).map((point, index) => (
            <motion.div
              key={`support-${index}`}
              className="absolute"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.05, duration: 0.4 }}
            >
              {/* Star dot */}
              <motion.div
                className="rounded-full bg-white"
                style={{
                  width: `${point.size * 2}px`,
                  height: `${point.size * 2}px`,
                  boxShadow: `0 0 ${point.size * 4}px rgba(255, 255, 255, 0.6)`,
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
              
              {/* Sparkle cross */}
              <motion.div
                className="absolute bg-white"
                style={{
                  width: `${point.size * 4}px`,
                  height: '1px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scaleX: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
              <motion.div
                className="absolute bg-white"
                style={{
                  width: '1px',
                  height: `${point.size * 4}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scaleY: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            </motion.div>
          ))}

          {/* Draw main constellation stars (user's spheres) */}
          {constellationPoints.filter(p => p.isMain).map((point, index) => {
            const sphere = exploredSpheres.find(s => s.id === point.sphereId);
            if (!sphere) return null;
            
            const size = getSphereSize(sphere.id);
            const isHovered = hoveredStar === sphere.id;
            
            return (
              <motion.div
                key={sphere.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: isHovered ? 1.4 : 1,
                }}
                transition={{ 
                  delay: 2 + index * 0.3, 
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
                className="absolute cursor-pointer"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredStar(sphere.id)}
                onMouseLeave={() => setHoveredStar(null)}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: size * 6,
                    height: size * 6,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, ${sphere.color}50 0%, ${sphere.color}20 40%, transparent 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Main star core */}
                <motion.div
                  className="relative rounded-full"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: sphere.color,
                    boxShadow: `
                      0 0 ${size * 2}px ${sphere.color}99,
                      0 0 ${size * 4}px ${sphere.color}66,
                      inset 0 0 ${size * 0.4}px rgba(255, 255, 255, 0.8)
                    `,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 ${size * 2}px ${sphere.color}99, 0 0 ${size * 4}px ${sphere.color}66, inset 0 0 ${size * 0.4}px rgba(255, 255, 255, 0.8)`,
                      `0 0 ${size * 3}px ${sphere.color}FF, 0 0 ${size * 6}px ${sphere.color}80, inset 0 0 ${size * 0.6}px rgba(255, 255, 255, 1)`,
                      `0 0 ${size * 2}px ${sphere.color}99, 0 0 ${size * 4}px ${sphere.color}66, inset 0 0 ${size * 0.4}px rgba(255, 255, 255, 0.8)`,
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Star 4-point sparkle effect */}
                <motion.div
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Horizontal beam */}
                  <motion.div
                    className="absolute"
                    style={{
                      width: `${size * 4}px`,
                      height: '2px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: `linear-gradient(90deg, transparent 0%, ${sphere.color} 50%, transparent 100%)`,
                      boxShadow: `0 0 8px ${sphere.color}`,
                    }}
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scaleX: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  {/* Vertical beam */}
                  <motion.div
                    className="absolute"
                    style={{
                      width: '2px',
                      height: `${size * 4}px`,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: `linear-gradient(180deg, transparent 0%, ${sphere.color} 50%, transparent 100%)`,
                      boxShadow: `0 0 8px ${sphere.color}`,
                    }}
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scaleY: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  {/* Diagonal beams */}
                  <motion.div
                    className="absolute"
                    style={{
                      width: `${size * 3}px`,
                      height: '1.5px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%) rotate(45deg)',
                      background: `linear-gradient(90deg, transparent 0%, ${sphere.color} 50%, transparent 100%)`,
                      boxShadow: `0 0 6px ${sphere.color}`,
                    }}
                    animate={{
                      opacity: [0.2, 0.7, 0.2],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                  <motion.div
                    className="absolute"
                    style={{
                      width: `${size * 3}px`,
                      height: '1.5px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%) rotate(-45deg)',
                      background: `linear-gradient(90deg, transparent 0%, ${sphere.color} 50%, transparent 100%)`,
                      boxShadow: `0 0 6px ${sphere.color}`,
                    }}
                    animate={{
                      opacity: [0.2, 0.7, 0.2],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                  />
                </motion.div>

                {/* Hover tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-xl z-50"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      border: `2px solid ${sphere.color}`,
                      boxShadow: `0 0 30px ${sphere.color}60`,
                    }}
                  >
                    <p className="text-white text-sm font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {sphere.title}
                    </p>
                    {hasRatings && userJourney.ratings[sphere.id] && (
                      <p className="text-xs" style={{ color: sphere.color, fontFamily: 'Crimson Pro, serif' }}>
                        ★ Identificación: {userJourney.ratings[sphere.id]}/5
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <motion.div
            className="backdrop-blur-sm rounded-3xl p-8 border"
            style={{
              backgroundColor: 'rgba(26, 26, 46, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 className="text-3xl font-semibold text-white mb-6" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
            }}>
              {insight.title}
            </h2>
            <p className="text-lg whitespace-pre-line" style={{
              fontFamily: 'Crimson Pro, serif',
              color: '#D1C4E0',
              lineHeight: '1.9',
              opacity: 0.95
            }}>
              {insight.message}
            </p>
          </motion.div>
        </motion.div>

        {/* Ratings Summary (if available) - More subtle */}
        {hasRatings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div 
              className="backdrop-blur-sm rounded-3xl p-8 border"
              style={{
                backgroundColor: 'rgba(26, 26, 46, 0.4)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3 className="text-2xl font-semibold text-white mb-8 text-center" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                color: '#E8DFF5'
              }}>
                Intensidad de tu identificación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exploredSpheres.map((sphere) => {
                  const rating = userJourney.ratings[sphere.id];
                  if (!rating) return null;
                  
                  return (
                    <motion.div 
                      key={sphere.id} 
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        border: `1px solid ${sphere.color}30`,
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderColor: `${sphere.color}60`,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: sphere.color,
                          boxShadow: `0 0 20px ${sphere.color}60`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium mb-2 truncate" style={{
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {sphere.title}
                        </p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className="w-5 h-5 rounded-full transition-all"
                              style={{
                                backgroundColor: star <= rating ? sphere.color : 'rgba(255, 255, 255, 0.1)',
                                opacity: star <= rating ? 1 : 0.3,
                                boxShadow: star <= rating ? `0 0 8px ${sphere.color}80` : 'none',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div 
                        className="text-3xl font-bold flex-shrink-0 w-12 text-center"
                        style={{ 
                          color: sphere.color,
                          textShadow: `0 0 10px ${sphere.color}80`,
                          fontFamily: "'Playfair Display', serif"
                        }}
                      >
                        {rating}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA - Layout vertical: video centrado arriba y botón debajo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
          className="flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto px-4"
        >
          {/* Video TikTok centrado */}
          <div className="flex flex-col items-center justify-center">
            <h3 
              className="mb-4 text-white font-semibold text-center max-w-2xl mx-auto px-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                fontWeight: 600,
                fontStyle: 'italic',
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)',
                lineHeight: '1.5'
              }}
            >
              Mira este video para seguir scrolleando conscientemente y vuelve para descubrir tu animal espiritual, haz clik abajo
            </h3>
            {/* Contenedor tipo TikTok */}
            <div 
              ref={tiktokEmbedRef}
              className="relative bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
              style={{
                width: '360px',
                height: '640px',
                maxWidth: '100%',
                aspectRatio: '9/16'
              }}
            >
              {/* Embed de TikTok */}
              <blockquote 
                className="tiktok-embed" 
                cite="https://www.tiktok.com/@andreacarob/video/7577978105667636492" 
                data-video-id="7577978105667636492"
                style={{ 
                  maxWidth: '100%', 
                  minWidth: '325px',
                  width: '100%',
                  height: '100%'
                }}
              >
                <section>
                  <a 
                    target="_blank" 
                    title="@andreacarob" 
                    href="https://www.tiktok.com/@andreacarob/video/7577978105667636492?refer=embed"
                    style={{ display: 'none' }}
                  >
                    @andreacarob
                  </a>
                </section>
              </blockquote>
            </div>
          </div>

          {/* Botón debajo del video */}
          <div className="flex flex-col items-center justify-center">
            <motion.button
              onClick={onGeneratePainting}
              className="px-12 py-5 text-white font-semibold rounded-full transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #9B87B5 0%, #7B68A0 100%)',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '20px',
                fontStyle: 'italic',
                boxShadow: '0 8px 32px rgba(155, 135, 181, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 48px rgba(155, 135, 181, 0.6)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              ✨ Descubrir mi animal espiritual
            </motion.button>
          </div>
        </motion.div>

        {/* Back button */}
        <motion.button
          onClick={() => navigate("/")}
          className="fixed bottom-8 left-8 z-50 px-6 py-3 backdrop-blur-md border rounded-full font-semibold transition-all duration-300"
          style={{
            backgroundColor: 'rgba(26, 26, 46, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#E8DFF5',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: 'rgba(26, 26, 46, 0.85)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
          }}
          whileTap={{ scale: 0.98 }}
        >
          🌳 ← Lobby
        </motion.button>
      </div>
    </div>
  );
};

export { Constellation };
