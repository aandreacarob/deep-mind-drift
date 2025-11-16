import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sphere } from "@/components/Sphere";
import { SphereModal } from "@/components/SphereModal";

export interface SphereData {
  id: string;
  color: string;
  symbol: string;
  title: string;
  description: string;
  examples: string;
  neuroscience: string;
  light: string;
  shadow: string;
  phrase: string;
  position: { x: number; y: number };
}

const spheresData: SphereData[] = [
  {
    id: "fragmentado",
    color: "#F39C35",
    symbol: "fragmentado",
    title: "El Fragmentado",
    description: "Vives en modo multitarea constante. 15 pestañas abiertas. Revisas el teléfono mientras trabajas, comes, conversas.",
    examples: "→ Trabajar con 15 pestañas abiertas, cambiando entre ellas cada 30 segundos\n→ Ver una serie mientras scrolleas Instagram y respondes mensajes\n→ Empezar 5 tareas diferentes en una hora y no terminar ninguna",
    neuroscience: "Sobrecarga el sistema de atención ejecutiva. Cada cambio de tarea cuesta entre 5-15 minutos de recuperación cognitiva. Activa constantemente el núcleo accumbens (dopamina de novedad) sin permitir satisfacción profunda.",
    light: "Alta capacidad de procesar múltiples fuentes de información simultáneamente. Conectado con muchos frentes.",
    shadow: "Atención superficial. Nunca estás completamente presente en ningún lado. Fatiga cognitiva crónica.",
    phrase: "Estoy en todas partes y en ninguna al mismo tiempo.",
    position: { x: 10, y: 20 },
  },
  {
    id: "acumulador",
    color: "#45B329",
    symbol: "acumulador",
    title: "El Acumulador",
    description: "Guardas todo. 847 artículos marcados, 234 videos guardados, 15 cursos iniciados. Consumes inspiración pero no creas acción.",
    examples: "→ Guardar cientos de artículos en Pocket que nunca leerás\n→ Tener 15 cursos online comenzados y 0 terminados\n→ 847 pestañas abiertas en Chrome \"para revisar después\"\n→ Descargar PDFs que nunca abrirás",
    neuroscience: "Genera una ilusión de productividad sin acción real. El acto de guardar activa el circuito de recompensa (dopamina), pero sin el beneficio del aprendizaje consolidado que requiere procesamiento profundo.",
    light: "Curioso, siempre aprendiendo, valoras el conocimiento. Tienes un archivo mental rico.",
    shadow: "Parálisis por abundancia. La información acumulada se vuelve una carga. Confundes consumir con hacer.",
    phrase: "Algún día haré algo con todo esto.",
    position: { x: 15, y: 65 },
  },
  {
    id: "reactivo",
    color: "#4A89C8",
    symbol: "reactivo",
    title: "El Reactivo",
    description: "Vives respondiendo a estímulos externos. Cada notificación es urgente. Tu tiempo está secuestrado por las demandas digitales de otros.",
    examples: "→ Revisar el teléfono cada vez que suena una notificación\n→ Responder emails y mensajes instantáneamente sin importar lo que estés haciendo\n→ Sentir ansiedad si no revisas redes sociales cada hora\n→ Interrumpir conversaciones presenciales para responder mensajes",
    neuroscience: "Mantiene el sistema nervioso simpático (lucha o huida) constantemente activado. Genera picos continuos de cortisol. El cerebro entra en modo de hipervigilancia crónica, similar al estrés postraumático leve.",
    light: "Altamente responsivo, atento a tu comunidad, disponible para otros.",
    shadow: "No tienes tiempo propio. Tu agenda la escriben otros. Agotamiento por hiperconexión. El FOMO te gobierna.",
    phrase: "¿Qué me perdí mientras no estaba mirando?",
    position: { x: 50, y: 45 },
  },
  {
    id: "buscador",
    color: "#E85D5D",
    symbol: "buscador",
    title: "El Buscador",
    description: "Usas la tecnología como herramienta intencional. Sabes qué quieres encontrar. Entras, tomas lo que necesitas, sales.",
    examples: "→ Desactivar todas las notificaciones excepto las esenciales\n→ Usar apps en modo \"no molestar\" por defecto\n→ Entrar a redes sociales con un objetivo específico y salir cuando lo cumples\n→ Horarios definidos para revisar email (ej: 10am, 3pm, 6pm)",
    neuroscience: "Fortalece la corteza prefrontal dorsolateral (control ejecutivo) y la capacidad de regulación atencional. Similar al entrenamiento de meditación: aumenta materia gris en áreas de autocontrol.",
    light: "Control sobre tu atención. Usas la tecnología en lugar de ser usado por ella. Propósito claro.",
    shadow: "Puedes perderte la serendipia. A veces la rigidez te impide descubrir lo inesperado. Riesgo de aislamiento.",
    phrase: "Entro cuando decido, salgo cuando termino.",
    position: { x: 78, y: 22 },
  },
  {
    id: "ausente",
    color: "#A04FD3",
    symbol: "ausente",
    title: "El Ausente",
    description: "Resistencia activa o pasiva. Minimizas tu presencia digital. Puede ser por elección consciente o por alienación.",
    examples: "→ No tener redes sociales o tenerlas inactivas\n→ Teléfono sin datos móviles, solo WiFi en casa\n→ Responder mensajes una vez al día o menos\n→ Preferir llamadas telefónicas o encuentros presenciales\n→ Usar teléfono básico en lugar de smartphone",
    neuroscience: "Permite la restauración del modo de red por defecto (Default Mode Network), esencial para la creatividad, consolidación de memoria y procesamiento emocional. El cerebro necesita 'aburrimiento' para funcionar óptimamente.",
    light: "Proteges tu atención profunda. Menos ruido, más silencio. Capacidad de concentración sostenida.",
    shadow: "Puedes estar desconectado de conversaciones importantes. Riesgo de quedarse fuera de comunidades. A veces es huida, no elección.",
    phrase: "Prefiero no estar ahí.",
    position: { x: 75, y: 68 },
  },
];

const Seccion3 = () => {
  const navigate = useNavigate();
  const [selectedSphere, setSelectedSphere] = useState<SphereData | null>(null);
  const [clickedSpheres, setClickedSpheres] = useState<string[]>([]);

  const handleSphereClick = (sphere: SphereData) => {
    setSelectedSphere(sphere);
    if (!clickedSpheres.includes(sphere.id)) {
      setClickedSpheres(prev => [...prev, sphere.id]);
    }
  };

  const handleModalClose = () => {
    setSelectedSphere(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Watercolor background layers */}
      <div className="absolute inset-0" style={{ backgroundColor: '#E8DFF5' }}>
        <div className="absolute inset-0 opacity-40" style={{
          background: 'radial-gradient(ellipse 800px 600px at 20% 30%, rgba(208, 196, 224, 0.8) 0%, rgba(232, 223, 245, 0) 60%)',
          filter: 'blur(50px)',
          mixBlendMode: 'multiply'
        }} />
        <div className="absolute inset-0 opacity-40" style={{
          background: 'radial-gradient(ellipse 700px 700px at 80% 60%, rgba(216, 211, 225, 0.6) 0%, rgba(232, 223, 245, 0) 55%)',
          filter: 'blur(60px)',
          mixBlendMode: 'multiply'
        }} />
        <div className="absolute inset-0 opacity-40" style={{
          background: 'radial-gradient(ellipse 500px 800px at 50% 80%, rgba(240, 234, 248, 0.7) 0%, rgba(232, 223, 245, 0) 50%)',
          filter: 'blur(45px)',
          mixBlendMode: 'multiply'
        }} />
        <div className="absolute inset-0 opacity-40" style={{
          background: 'radial-gradient(ellipse 600px 500px at 10% 90%, rgba(248, 244, 232, 0.5) 0%, rgba(232, 223, 245, 0) 60%)',
          filter: 'blur(55px)',
          mixBlendMode: 'multiply'
        }} />
      </div>

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
      }} />

      {/* SVG filter for watercolor effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="watercolor-effect">
            <feTurbulence baseFrequency="0.03" numOctaves="3" seed="2" />
            <feDisplacementMap in="SourceGraphic" scale="8" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h1 className="text-6xl font-bold mb-6" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#2D1B3D',
            lineHeight: '1.2',
            textShadow: '2px 2px 8px rgba(155, 135, 181, 0.15)'
          }}>
            Cinco formas de pensar<br />en la era digital
          </h1>
          <p className="text-lg" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#4A3A5A',
            lineHeight: '1.6'
          }}>
            Explora cada esfera.<br />
            Descubre cuál es <em style={{ fontStyle: 'italic', fontWeight: 500 }}>la tuya</em>.
          </p>
        </motion.div>

        {/* Spheres */}
        <div className="relative w-full h-[600px] mb-16">
          {spheresData.map((sphere, index) => (
            <Sphere
              key={sphere.id}
              sphere={sphere}
              onClick={() => handleSphereClick(sphere)}
              isExplored={clickedSpheres.includes(sphere.id)}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Closing text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="italic" style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '20px',
            color: '#4A3A5A',
            lineHeight: '1.8'
          }}>
            No se trata de elegir el patrón "correcto".<br />
            Se trata de notar cuál habitas ahora.<br />
            Y decidir si es el que quieres habitar mañana.
          </p>
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
  );
};

export default Seccion3;
