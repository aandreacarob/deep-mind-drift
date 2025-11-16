import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CustomCursor } from "@/components/CustomCursor";
import { Sphere } from "@/components/Sphere";
import { SphereModal } from "@/components/SphereModal";
import { Constellation } from "@/components/Constellation";
import { CognitivePainting } from "@/components/CognitivePainting";
import { InteractivePaintLayer } from "@/components/InteractivePaintLayer";

export interface SphereData {
  id: string;
  color: string;
  emoji: string;
  title: string;
  description: string;
  examples: string[];
  neuroscience: string;
  position: { x: number; y: number };
}

export interface UserJourney {
  spheresClicked: string[];
  timeSpent: Record<string, number>;
  clickOrder: string[];
  dominantSphere: string;
  timestamp: string;
}

const spheresData: SphereData[] = [
  {
    id: "fragmentado",
    color: "#F5A623",
    emoji: "fragmentado",
    title: "Pensamiento Fragmentado",
    description: `Saltar constantemente entre tareas, apps y estímulos. 
Tu atención está dividida en docenas de microtareas 
simultáneas. Nunca terminas nada profundamente.`,
    examples: [
      "Trabajar con 15 pestañas abiertas, cambiando entre ellas cada 30 segundos",
      "Ver una serie mientras scrolleas Instagram y respondes mensajes",
      "Empezar 5 tareas diferentes en una hora y no terminar ninguna",
    ],
    neuroscience: `Sobrecarga el sistema de atención ejecutiva. Cada cambio de tarea cuesta entre 5-15 minutos de recuperación cognitiva. Activa constantemente el núcleo accumbens (dopamina de novedad) sin permitir satisfacción profunda.`,
    position: { x: 20, y: 25 },
  },
  {
    id: "delegado",
    color: "#E74C3C",
    emoji: "delegado",
    title: "Pensamiento Delegado",
    description: `Has externalizado tu memoria y razonamiento a Google, ChatGPT y algoritmos. Ya no recuerdas números de teléfono, direcciones, o datos que "están en internet".`,
    examples: [
      "Googlear algo que sabías hace 5 años pero ya no recuerdas",
      "Depender de GPS incluso para ir a lugares que has visitado 20 veces",
      "No recordar cumpleaños sin que Facebook te lo recuerde",
    ],
    neuroscience: `Atrofia el hipocampo (responsable de la memoria a largo plazo). El cerebro aprende que no necesita retener información porque "está disponible externamente". Fenómeno conocido como "Efecto Google" o amnesia digital.`,
    position: { x: 75, y: 30 },
  },
  {
    id: "aumentado",
    color: "#7ED321",
    emoji: "aumentado",
    title: "Pensamiento Aumentado",
    description: `Usas la tecnología como una extensión intencional de tu cognición. No delegas, sino que amplificas. Usas herramientas digitales para pensar mejor, no para pensar menos.`,
    examples: [
      "Usar Notion/Obsidian para construir un 'segundo cerebro' conectando ideas",
      "Investigar en profundidad con múltiples fuentes, luego sintetizar sin IA",
      "Usar apps de meditación, aprendizaje espaciado, o journaling estructurado",
    ],
    neuroscience: `Fortalece la corteza prefrontal mediante el uso intencional de herramientas cognitivas. Crea "andamiaje mental" que extiende la capacidad de procesamiento sin atrofiar habilidades base.`,
    position: { x: 30, y: 65 },
  },
  {
    id: "hibrido",
    color: "#BD10E0",
    emoji: "hibrido",
    title: "Pensamiento Híbrido",
    description: `Alternas conscientemente entre modos cognitivos según el contexto. Sabes cuándo necesitas profundidad y cuándo necesitas rapidez. Controlas tu relación con la tecnología en vez de ser controlado por ella.`,
    examples: [
      "Modo 'deep work' (2 horas sin interrupciones) + Modo 'comunicación' (30 min respondiendo todo)",
      "Usar IA como co-pensador (le preguntas, cuestionas sus respuestas, sintetizas)",
      "Reconocer cuándo estás en modo fragmentado y conscientemente cambiar de estado",
    ],
    neuroscience: `Metacognición avanzada: tu corteza prefrontal monitorea y regula tus propios estados cognitivos. Requiere entrenamiento en mindfulness y autoobservación. Es el estado más difícil de sostener pero el más poderoso.`,
    position: { x: 70, y: 70 },
  },
  {
    id: "profundo",
    color: "#4A90E2",
    emoji: "profundo",
    title: "Pensamiento Profundo",
    description: `Es la capacidad de sostener la atención en una sola tarea compleja durante períodos extendidos. Leer un libro completo, escribir un ensayo, resolver un problema matemático sin interrupciones.`,
    examples: [
      "Leer un libro físico durante 2 horas sin revisar el teléfono",
      "Escribir un documento importante con notificaciones desactivadas",
      "Resolver un problema complejo siguiendo un hilo de pensamiento sin interrupciones",
    ],
    neuroscience: `Activa principalmente la corteza prefrontal dorsolateral y el hipocampo. Requiere altos niveles de dopamina sostenida y baja activación de la amígdala (ansiedad por FOMO).`,
    position: { x: 50, y: 45 },
  },
];

const Seccion3 = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"intro" | "constellation" | "painting">("intro");
  const [selectedSphere, setSelectedSphere] = useState<SphereData | null>(null);
  const [modalOpenTime, setModalOpenTime] = useState<number>(0);
  const [userJourney, setUserJourney] = useState<UserJourney>({
    spheresClicked: [],
    timeSpent: {},
    clickOrder: [],
    dominantSphere: "",
    timestamp: new Date().toISOString(),
  });

  const handleSphereClick = (sphere: SphereData) => {
    setSelectedSphere(sphere);
    setModalOpenTime(Date.now());

    // Track click if first time
    if (!userJourney.spheresClicked.includes(sphere.id)) {
      setUserJourney((prev) => ({
        ...prev,
        spheresClicked: [...prev.spheresClicked, sphere.id],
        clickOrder: [...prev.clickOrder, sphere.id],
      }));
    }
  };

  const handleModalClose = () => {
    if (selectedSphere && modalOpenTime) {
      const timeSpent = Date.now() - modalOpenTime;
      setUserJourney((prev) => ({
        ...prev,
        timeSpent: {
          ...prev.timeSpent,
          [selectedSphere.id]: (prev.timeSpent[selectedSphere.id] || 0) + timeSpent,
        },
      }));
    }
    setSelectedSphere(null);
  };

  const handleViewConstellation = () => {
    // Calculate dominant sphere
    const dominant = Object.entries(userJourney.timeSpent).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];

    setUserJourney((prev) => ({
      ...prev,
      dominantSphere: dominant,
    }));

    setStage("constellation");
  };

  const canViewConstellation = userJourney.spheresClicked.length >= 3;

  if (stage === "constellation") {
    return (
      <>
        <CustomCursor />
        <Constellation
          userJourney={userJourney}
          spheresData={spheresData}
          onGeneratePainting={() => setStage("painting")}
          onBack={() => navigate("/seccion-2")}
        />
      </>
    );
  }

  if (stage === "painting") {
    return (
      <>
        <CustomCursor />
        <CognitivePainting
          userJourney={userJourney}
          spheresData={spheresData}
          onBack={() => setStage("constellation")}
        />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen relative overflow-hidden">
      {/* Base vibrant Van Gogh inspired background */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(135deg, #FFE5B4 0%, #FFC8A2 25%, #E8B4F0 50%, #B4D4FF 75%, #A8E6CF 100%)
        `,
      }} />
      
      {/* Van Gogh style brushstroke layer 1 - Blue strokes */}
      <div className="absolute inset-0 opacity-60" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3Cfilter id='blur'%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M100,150 Q200,100 300,150 T500,150 Q600,100 700,150' stroke='%234A90E2' stroke-width='25' fill='none' stroke-linecap='round' opacity='0.7' filter='url(%23blur)'/%3E%3Cpath d='M800,200 Q850,150 900,200 T1000,200 Q1050,150 1100,200' stroke='%235B9BD5' stroke-width='20' fill='none' stroke-linecap='round' opacity='0.6' filter='url(%23blur)'/%3E%3Cpath d='M200,400 Q250,350 300,400 T400,400 Q450,350 500,400' stroke='%2367B3E8' stroke-width='30' fill='none' stroke-linecap='round' opacity='0.65' filter='url(%23blur)'/%3E%3Cpath d='M600,500 Q700,450 800,500 T1000,500 Q1100,450 1200,500' stroke='%234A90E2' stroke-width='22' fill='none' stroke-linecap='round' opacity='0.7' filter='url(%23blur)'/%3E%3Cpath d='M50,600 Q150,550 250,600 T450,600 Q550,550 650,600' stroke='%235B9BD5' stroke-width='28' fill='none' stroke-linecap='round' opacity='0.6' filter='url(%23blur)'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        mixBlendMode: 'multiply',
      }} />
      
      {/* Van Gogh style brushstroke layer 2 - Yellow/Orange strokes */}
      <div className="absolute inset-0 opacity-55" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3Cfilter id='blur2'%3E%3CfeGaussianBlur stdDeviation='4'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M150,100 Q200,50 250,100 T350,100 Q400,50 450,100' stroke='%23FFD700' stroke-width='30' fill='none' stroke-linecap='round' opacity='0.75' filter='url(%23blur2)'/%3E%3Cpath d='M500,250 Q550,200 600,250 T700,250 Q750,200 800,250' stroke='%23FFA500' stroke-width='25' fill='none' stroke-linecap='round' opacity='0.7' filter='url(%23blur2)'/%3E%3Cpath d='M300,300 Q400,250 500,300 T700,300 Q800,250 900,300' stroke='%23FFB84D' stroke-width='32' fill='none' stroke-linecap='round' opacity='0.65' filter='url(%23blur2)'/%3E%3Cpath d='M100,450 Q200,400 300,450 T500,450 Q600,400 700,450' stroke='%23FFD700' stroke-width='28' fill='none' stroke-linecap='round' opacity='0.7' filter='url(%23blur2)'/%3E%3Cpath d='M850,350 Q950,300 1050,350 T1200,350' stroke='%23FFA500' stroke-width='24' fill='none' stroke-linecap='round' opacity='0.6' filter='url(%23blur2)'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        mixBlendMode: 'multiply',
      }} />
      
      {/* Van Gogh style brushstroke layer 3 - Purple/Magenta strokes */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3Cfilter id='blur3'%3E%3CfeGaussianBlur stdDeviation='3.5'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M400,200 Q450,150 500,200 T600,200 Q650,150 700,200' stroke='%23BD10E0' stroke-width='26' fill='none' stroke-linecap='round' opacity='0.7' filter='url(%23blur3)'/%3E%3Cpath d='M200,350 Q300,300 400,350 T600,350 Q700,300 800,350' stroke='%23D94DFF' stroke-width='29' fill='none' stroke-linecap='round' opacity='0.65' filter='url(%23blur3)'/%3E%3Cpath d='M50,500 Q150,450 250,500 T450,500 Q550,450 650,500' stroke='%23A855C7' stroke-width='27' fill='none' stroke-linecap='round' opacity='0.7' filter='url(%23blur3)'/%3E%3Cpath d='M750,600 Q850,550 950,600 T1150,600' stroke='%23BD10E0' stroke-width='24' fill='none' stroke-linecap='round' opacity='0.6' filter='url(%23blur3)'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        mixBlendMode: 'multiply',
      }} />
      
      {/* Van Gogh style brushstroke layer 4 - Green strokes */}
      <div className="absolute inset-0 opacity-45" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3Cfilter id='blur4'%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M300,150 Q350,100 400,150 T500,150 Q550,100 600,150' stroke='%237ED321' stroke-width='28' fill='none' stroke-linecap='round' opacity='0.7' filter='url(%23blur4)'/%3E%3Cpath d='M700,300 Q800,250 900,300 T1100,300' stroke='%235CB85C' stroke-width='25' fill='none' stroke-linecap='round' opacity='0.65' filter='url(%23blur4)'/%3E%3Cpath d='M100,550 Q200,500 300,550 T500,550 Q600,500 700,550' stroke='%234CAF50' stroke-width='30' fill='none' stroke-linecap='round' opacity='0.7' filter='url(%23blur4)'/%3E%3Cpath d='M800,700 Q900,650 1000,700 T1200,700' stroke='%237ED321' stroke-width='26' fill='none' stroke-linecap='round' opacity='0.6' filter='url(%23blur4)'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        mixBlendMode: 'multiply',
      }} />
      
      {/* Watercolor blobs - Large organic color patches */}
      <div className="absolute inset-0 opacity-50" style={{
        background: `
          radial-gradient(ellipse 800px 600px at 10% 20%, rgba(255, 215, 0, 0.4) 0%, transparent 60%),
          radial-gradient(ellipse 700px 500px at 90% 30%, rgba(74, 144, 226, 0.35) 0%, transparent 55%),
          radial-gradient(ellipse 900px 700px at 50% 50%, rgba(189, 16, 224, 0.3) 0%, transparent 65%),
          radial-gradient(ellipse 600px 800px at 20% 80%, rgba(126, 211, 33, 0.35) 0%, transparent 60%),
          radial-gradient(ellipse 750px 600px at 80% 70%, rgba(255, 165, 0, 0.4) 0%, transparent 55%),
          radial-gradient(ellipse 500px 600px at 5% 50%, rgba(168, 85, 199, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 650px 500px at 95% 80%, rgba(91, 155, 213, 0.35) 0%, transparent 60%)
        `,
        filter: 'blur(50px)',
        mixBlendMode: 'multiply',
      }} />
      
      {/* Additional vibrant color splashes */}
      <div className="absolute inset-0 opacity-40" style={{
        background: `
          radial-gradient(circle 400px at 15% 25%, rgba(255, 184, 77, 0.5) 0%, transparent 50%),
          radial-gradient(circle 350px at 85% 15%, rgba(74, 144, 226, 0.45) 0%, transparent 45%),
          radial-gradient(circle 450px at 50% 75%, rgba(189, 16, 224, 0.4) 0%, transparent 55%),
          radial-gradient(circle 380px at 25% 90%, rgba(126, 211, 33, 0.45) 0%, transparent 50%),
          radial-gradient(circle 420px at 75% 60%, rgba(255, 215, 0, 0.5) 0%, transparent 48%),
          radial-gradient(circle 300px at 5% 60%, rgba(168, 85, 199, 0.4) 0%, transparent 45%),
          radial-gradient(circle 400px at 95% 45%, rgba(91, 155, 213, 0.45) 0%, transparent 50%)
        `,
        filter: 'blur(35px)',
        mixBlendMode: 'screen',
      }} />
      
      {/* Paper texture with visible grain */}
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px',
        mixBlendMode: 'overlay',
      }} />
      
      {/* Additional brushstroke texture overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3Cfilter id='blur5'%3E%3CfeGaussianBlur stdDeviation='2'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M0,200 Q100,150 200,200 T400,200 Q500,150 600,200 T800,200 Q900,150 1000,200 T1200,200' stroke='%23FFD700' stroke-width='15' fill='none' stroke-linecap='round' opacity='0.4' filter='url(%23blur5)'/%3E%3Cpath d='M0,400 Q150,350 300,400 T600,400 Q750,350 900,400 T1200,400' stroke='%234A90E2' stroke-width='18' fill='none' stroke-linecap='round' opacity='0.35' filter='url(%23blur5)'/%3E%3Cpath d='M0,600 Q120,550 240,600 T480,600 Q600,550 720,600 T960,600 Q1080,550 1200,600' stroke='%23BD10E0' stroke-width='16' fill='none' stroke-linecap='round' opacity='0.4' filter='url(%23blur5)'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        mixBlendMode: 'multiply',
      }} />

      {/* Interactive Paint Layer - behind spheres */}
      <InteractivePaintLayer />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h1 className="mb-8" style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '56px',
            fontWeight: 700,
            color: '#2D1B3D',
            lineHeight: '1.3',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 8px rgba(45, 27, 61, 0.15)',
          }}>
            Cinco formas de pensar<br />en la era digital
          </h1>
          <p className="mb-4" style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '20px',
            fontWeight: 400,
            color: '#4A3A5A',
            lineHeight: '1.8',
          }}>
            Explora cada esfera.<br />
            <span style={{ fontStyle: 'italic' }}>Descubre cuál es la tuya.</span>
          </p>
        </motion.div>

        {/* Spheres */}
        <div className="relative w-full h-[600px] mb-16" style={{ zIndex: 10 }}>
          {spheresData.map((sphere, index) => (
            <Sphere
              key={sphere.id}
              sphere={sphere}
              onClick={() => handleSphereClick(sphere)}
              isExplored={userJourney.spheresClicked.includes(sphere.id)}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="mb-6" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#8B6BA5'
          }}>
            Has explorado {userJourney.spheresClicked.length} de 5
          </p>
          {canViewConstellation && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleViewConstellation}
              className="px-10 py-4 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
              style={{
                backgroundColor: '#9B87B5',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              → Ver mi constelación
            </motion.button>
          )}
        </motion.div>

        {/* Back button */}
        <button
          onClick={() => navigate("/seccion-2")}
          className="fixed bottom-8 left-8 z-50 px-6 py-3 backdrop-blur-sm border rounded-full font-semibold hover:scale-105 transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderColor: '#9B87B5',
            color: '#2D1B3D',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          ← Volver
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedSphere && (
          <SphereModal
            sphere={selectedSphere}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default Seccion3;
