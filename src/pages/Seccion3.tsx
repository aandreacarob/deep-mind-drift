import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CustomCursor } from "@/components/CustomCursor";
import { Sphere } from "@/components/Sphere";
import { SphereModal } from "@/components/SphereModal";
import { Constellation } from "@/components/Constellation";
import { CognitivePainting } from "@/components/CognitivePainting";
import { InteractivePaintLayer } from "@/components/InteractivePaintLayer";
import acuarelaImage from "@/assets/acuarela.png";

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
  ratings: Record<string, number>; // 1-5 rating for each sphere
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
    ratings: {},
    dominantSphere: "",
    timestamp: new Date().toISOString(),
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cognitiveJourney");
    if (saved) {
      try {
        setUserJourney(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading cognitive journey:", e);
      }
    }
  }, []);

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

  const handleRatingChange = (sphereId: string, rating: number) => {
    setUserJourney((prev) => {
      const updated = {
        ...prev,
        ratings: {
          ...prev.ratings,
          [sphereId]: rating,
        },
      };
      // Save to localStorage
      localStorage.setItem("cognitiveJourney", JSON.stringify(updated));
      return updated;
    });
  };

  const handleModalClose = () => {
    if (selectedSphere && modalOpenTime) {
      const timeSpent = Date.now() - modalOpenTime;
      setUserJourney((prev) => {
        const updated = {
          ...prev,
          timeSpent: {
            ...prev.timeSpent,
            [selectedSphere.id]: (prev.timeSpent[selectedSphere.id] || 0) + timeSpent,
          },
        };
        // Save to localStorage
        localStorage.setItem("cognitiveJourney", JSON.stringify(updated));
        return updated;
      });
    }
    setSelectedSphere(null);
  };

  const handleViewConstellation = () => {
    // Calculate dominant sphere based on ratings (if available) or time spent
    let dominant = "";
    
    if (Object.keys(userJourney.ratings).length > 0) {
      // Use ratings if available
      const entries = Object.entries(userJourney.ratings);
      if (entries.length > 0) {
        dominant = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
      }
    } else if (Object.keys(userJourney.timeSpent).length > 0) {
      // Fallback to time spent
      const entries = Object.entries(userJourney.timeSpent);
      if (entries.length > 0) {
        dominant = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
      }
    }

    const updated = {
      ...userJourney,
      dominantSphere: dominant,
    };
    
    setUserJourney(updated);
    localStorage.setItem("cognitiveJourney", JSON.stringify(updated));
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
      {/* Acuarela background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${acuarelaImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Interactive Paint Layer - behind spheres */}
      <InteractivePaintLayer />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-4xl mx-auto relative"
        >
          {/* Decorative elements - subtle leaf shapes */}
          <div className="absolute -top-8 left-[10%] text-3xl" style={{ color: '#8B6F47', transform: 'rotate(-15deg)', opacity: 0.4 }}>✿</div>
          <div className="absolute top-0 right-[15%] text-2xl" style={{ color: '#A0826D', transform: 'rotate(25deg)', opacity: 0.4 }}>❀</div>
          <div className="absolute -bottom-4 left-[20%] text-2xl" style={{ color: '#6B5D4F', transform: 'rotate(-20deg)', opacity: 0.4 }}>✿</div>
          <div className="absolute bottom-8 right-[25%] text-3xl" style={{ color: '#7D6B57', transform: 'rotate(15deg)', opacity: 0.4 }}>❀</div>
          
          <h1 className="mb-8 flex flex-wrap justify-center items-center gap-4 px-4" style={{
            fontFamily: "'Playfair Display', 'Bodoni Moda', 'Cormorant Garamond', 'EB Garamond', serif",
            fontSize: '64px',
            fontWeight: 700,
            lineHeight: '1.2',
            letterSpacing: '0.01em',
          }}>
            <motion.span 
              style={{ 
                color: '#8B6F47',
                display: 'inline-block',
                fontStyle: 'italic',
              }}
              whileHover={{ scale: 1.05 }}
            >
              Cinco
            </motion.span>
            <motion.span 
              style={{ 
                color: '#A0826D',
                display: 'inline-block',
                fontStyle: 'italic',
              }}
              whileHover={{ scale: 1.05 }}
            >
              formas
            </motion.span>
            <motion.span 
              style={{ 
                color: '#6B5D4F',
                display: 'inline-block',
                fontSize: '56px',
              }}
              whileHover={{ scale: 1.05 }}
            >
              de
            </motion.span>
            <motion.span 
              style={{ 
                color: '#7D6B57',
                display: 'inline-block',
                fontStyle: 'italic',
              }}
              whileHover={{ scale: 1.05 }}
            >
              pensar
            </motion.span>
            <motion.span 
              style={{ 
                color: '#8B7355',
                display: 'inline-block',
                fontSize: '56px',
              }}
              whileHover={{ scale: 1.05 }}
            >
              en
            </motion.span>
            <motion.span 
              style={{ 
                color: '#9A8169',
                display: 'inline-block',
                fontSize: '56px',
              }}
              whileHover={{ scale: 1.05 }}
            >
              la
            </motion.span>
            <motion.span 
              style={{ 
                color: '#6D5A45',
                display: 'inline-block',
                fontStyle: 'italic',
              }}
              whileHover={{ scale: 1.05 }}
            >
              era
            </motion.span>
            <motion.span 
              style={{ 
                color: '#8B6F47',
                display: 'inline-block',
                fontStyle: 'italic',
              }}
              whileHover={{ scale: 1.05 }}
            >
              digital
            </motion.span>
          </h1>
          <p className="mb-4" style={{
            fontFamily: "'Cormorant Garamond', 'EB Garamond', 'Crimson Pro', serif",
            fontSize: '24px',
            fontWeight: 400,
            color: '#7D6B57',
            lineHeight: '1.7',
            letterSpacing: '0.02em',
          }}>
            <span style={{ fontStyle: 'italic', color: '#8B6F47' }}>Explora cada esfera.</span>
            <br />
            <span style={{ fontWeight: 500, color: '#6B5D4F' }}>Descubre cuál es la tuya.</span>
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
          onClick={() => navigate("/")}
          className="fixed bottom-8 left-8 z-50 px-6 py-3 backdrop-blur-md border rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
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

      {/* Modal */}
      <AnimatePresence>
        {selectedSphere && (
          <SphereModal
            sphere={selectedSphere}
            onClose={handleModalClose}
            currentRating={userJourney.ratings[selectedSphere.id] || 0}
            onRatingChange={handleRatingChange}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default Seccion3;
