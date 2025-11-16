import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CustomCursor } from "@/components/CustomCursor";
import { Sphere } from "@/components/Sphere";
import { SphereModal } from "@/components/SphereModal";
import { Constellation } from "@/components/Constellation";
import { CognitivePainting } from "@/components/CognitivePainting";

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
      <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #E8DFF5 0%, #f4f1de 50%, #faf8f3 100%)'
    }}>
      {/* Watercolor texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
        backgroundSize: '200px 200px'
      }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h1 className="text-6xl font-semibold mb-8" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#2D1B3D',
            lineHeight: '1.3'
          }}>
            Cinco formas de pensar<br />en la era digital
          </h1>
          <p className="text-xl mb-4" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#2D1B3D',
            lineHeight: '1.8'
          }}>
            Explora cada esfera.<br />
            Descubre cuál es la tuya.
          </p>
        </motion.div>

        {/* Spheres */}
        <div className="relative w-full h-[600px] mb-16">
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
