import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
    id: "profundo",
    color: "#4A90E2",
    emoji: "📚",
    title: "Pensamiento Profundo",
    description: `La capacidad de sostener tu atención 
en una idea compleja 
por períodos extendidos de tiempo.

Concentración sin interrupciones.
Inmersión total.
Flujo.`,
    examples: [
      "Leer un libro completo sin revisar el teléfono",
      "Resolver un problema matemático complejo",
      "Escribir durante 2 horas seguidas",
      "Tener una conversación sin distracciones digitales",
      "Ver una película sin pausarla ni revisar el móvil",
    ],
    neuroscience: `Activa principalmente la corteza prefrontal dorsolateral, 
asociada con la función ejecutiva y el razonamiento abstracto.

Requiere:
- Glucosa constante
- Entorno de baja estimulación sensorial  
- Práctica sostenida durante años

Se debilita con:
- Interrupciones frecuentes
- Multitasking crónico
- Consumo superficial de contenido`,
    position: { x: 20, y: 30 },
  },
  {
    id: "fragmentado",
    color: "#F5A623",
    emoji: "⚡",
    title: "Pensamiento Fragmentado",
    description: `Saltar entre múltiples tareas o estímulos
sin completar profundamente ninguno.

Tu atención es un malabarista exhausto
que nunca puede descansar.`,
    examples: [
      "Revisar 3 apps mientras ves una serie",
      "Leer un artículo con 10 pestañas abiertas",
      "Responder mensajes durante una reunión",
      "Cambiar de canción antes de que termine",
      "Trabajar con notificaciones activadas",
    ],
    neuroscience: `Genera un "costo de cambio" cognitivo medible.

Cada interrupción requiere que el cerebro 
recargue el contexto completo de la tarea.

Consecuencias:
- Pérdida de hasta 40% de eficiencia cognitiva
- Aumento de cortisol (hormona del estrés)
- Se necesitan 23 minutos para recuperar 
  el foco completo después de una distracción

El cerebro NO está diseñado para multitasking.
Está diseñado para alternar rápidamente,
pero cada cambio tiene un costo.`,
    position: { x: 70, y: 25 },
  },
  {
    id: "delegado",
    color: "#E74C3C",
    emoji: "🤖",
    title: "Pensamiento Delegado",
    description: `Usar IA o motores de búsqueda
en lugar de recuperar tu propio conocimiento
o razonar desde cero.

Google es tu memoria externa.
ChatGPT es tu procesador auxiliar.`,
    examples: [
      "Preguntarle a ChatGPT antes de intentar recordar",
      "Googlear cada duda inmediata sin reflexionar",
      "Usar calculadora para operaciones mentales simples",
      "Depender de GPS incluso en rutas conocidas",
      "No recordar cumpleaños sin recordatorios digitales",
    ],
    neuroscience: `El "Efecto Google":

Cuando externalizamos la memoria,
el hipocampo (archivador de recuerdos) se atrofia.

El cerebro optimiza recordando DÓNDE está la información,
no la información misma.

Esto se llama "memoria transactiva":
Delegamos el almacenamiento a sistemas externos.

Es eficiente para tareas mecánicas.
Pero tiene un costo para el pensamiento profundo:
Si no retienes información básica,
no puedes establecer conexiones complejas.`,
    position: { x: 30, y: 70 },
  },
  {
    id: "aumentado",
    color: "#7ED321",
    emoji: "🧩",
    title: "Pensamiento Aumentado",
    description: `Usar tecnología como colaborador
que expande tus capacidades cognitivas,
no como sustituto.

La herramienta te potencia.
No te reemplaza.`,
    examples: [
      "Usar IA para revisar y mejorar tu propio razonamiento",
      "Herramientas de visualización de datos complejos",
      "Apps que organizan tu conocimiento (Notion, Obsidian)",
      "Calculadora para cálculos complejos después de entender el proceso matemático",
      "Traducción automática como puente para aprender idiomas",
    ],
    neuroscience: `Activa redes de "cognición distribuida":

El cerebro aprende a integrar herramientas externas
como extensiones funcionales de sí mismo.

Similar a cómo las gafas se vuelven 
"parte transparente" de tu visión.

La diferencia clave con el Pensamiento Delegado:

DELEGADO: La herramienta sustituye tu proceso cognitivo
AUMENTADO: La herramienta amplifica tu proceso cognitivo

Ejemplo:
- ChatGPT escribe por ti = Delegado
- ChatGPT critica tu escritura = Aumentado`,
    position: { x: 65, y: 65 },
  },
  {
    id: "hibrido",
    color: "#BD10E0",
    emoji: "🔮",
    title: "Pensamiento Híbrido",
    description: `El futuro cercano:

Interfaces cerebro-computadora
que borran la línea entre
pensamiento biológico y digital.

¿Dónde termina tu mente?
¿Dónde empieza la máquina?`,
    examples: [
      "Neuralink y otras BCIs (Brain-Computer Interfaces)",
      "Realidad aumentada cognitiva permanente",
      "Memoria expandida artificialmente en tiempo real",
      "Prótesis cognitivas que compensan déficits neurológicos",
      "Interfaces neuronales para comunicación directa",
    ],
    neuroscience: `Territorio inexplorado.

La pregunta fundamental:

¿Seguirá siendo "tu" pensamiento
si está mediado por un algoritmo en tiempo real?

¿La identidad personal sobrevive 
la integración con una inteligencia no biológica?

¿Dónde está la frontera del "yo"?

Estas preguntas no son ciencia ficción.
Son dilemas que la próxima generación
tendrá que resolver.

No en teoría.
En práctica.`,
    position: { x: 45, y: 50 },
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
      <Constellation
        userJourney={userJourney}
        spheresData={spheresData}
        onGeneratePainting={() => setStage("painting")}
        onBack={() => navigate("/seccion-2")}
      />
    );
  }

  if (stage === "painting") {
    return (
      <CognitivePainting
        userJourney={userJourney}
        spheresData={spheresData}
        onBack={() => setStage("constellation")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-white mb-8">
            Cinco formas de pensar en la era digital
          </h1>
          <p className="text-xl text-gray-300 mb-4 whitespace-pre-line">
            {`Cada esfera representa un patrón cognitivo
que tu cerebro ha desarrollado.

Algunos te expanden.
Otros te fragmentan.`}
          </p>
          <p className="text-lg text-gray-400 mt-8">
            Explora cada una. Descubre cuál domina en ti.
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
          <p className="text-gray-400 mb-4">
            Has explorado {userJourney.spheresClicked.length} de 5 esferas
          </p>
          {canViewConstellation && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleViewConstellation}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              → Ver mi constelación
            </motion.button>
          )}
        </motion.div>

        {/* Back button */}
        <button
          onClick={() => navigate("/seccion-2")}
          className="fixed bottom-8 left-8 z-50 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105"
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
  );
};

export default Seccion3;
