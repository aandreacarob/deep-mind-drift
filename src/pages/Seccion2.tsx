import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TreeLeaf } from "@/components/TreeLeaf";
import { LeafPreview } from "@/components/LeafPreview";
import { FallingLeaf } from "@/components/FallingLeaf";
import { CustomCursor } from "@/components/CustomCursor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import fondoAzul from "@/assets/fondoazul.png";
import treeImage from "@/assets/tree.png";

gsap.registerPlugin(ScrollTrigger);

interface LeafData {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  title: string;
  summary: string;
  content: string;
  position: "left" | "right" | "center";
  activationPercent: number;
}

const Seccion2 = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLeaves, setActiveLeaves] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState<LeafData | null>(null);
  const [hoveredLeaf, setHoveredLeaf] = useState<LeafData | null>(null);
  const [showScrollIndicators, setShowScrollIndicators] = useState(true);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [fallingLeaves, setFallingLeaves] = useState<Array<{
    id: number;
    startX: number;
    startY: number;
    rotation: number;
    delay: number;
    duration: number;
    color: string;
    createdAt: number;
    finalX?: number;
    finalY?: number;
  }>>([]);
  const lastScrollBatchRef = useRef<Set<number>>(new Set());
  const accumulatedLeavesRef = useRef<Array<{ x: number; y: number; id: number }>>([]);

  const leaves: LeafData[] = [
    {
      id: 10,
      x: 400,
      y: 650,
      rotation: 0,
      color: "#FFD700",
      title: "EL MAPA CEREBRAL",
      summary: "Tu cerebro tiene 86 mil millones de neuronas. No necesitas conocerlas todas. Solo necesitas entender cuatro regiones que se activan cada vez que interactúas con una pantalla.",
      content: `Tu cerebro tiene 86 mil millones de neuronas.

No necesitas conocerlas todas.
Solo necesitas entender cuatro regiones.

Cuatro áreas que se activan cada vez 
que interactúas con una pantalla.

Cuatro sistemas diseñados para la supervivencia...
siendo utilizados para el engagement.

No es una conspiración.
No es malicia.

Es diseño.

Ellos conocen tu cerebro mejor de lo 
que tú lo conoces.

Hasta ahora.`,
      position: "center",
      activationPercent: 10,
    },
    {
      id: 1,
      x: 250,
      y: 550,
      rotation: -25,
      color: "#F4C430",
      title: "47 SEGUNDOS",
      summary: "47 segundos es el tiempo promedio que pasas en una pantalla antes de cambiar. No es falta de atención, es fragmentación aprendida.",
      content: `Ese es el tiempo promedio que pasas mirando 
una sola pantalla antes de cambiar a otra cosa.

No son 8 segundos, como dice el mito popular.

No es que tu capacidad de atención sea corta.
Es que tu atención está siendo constantemente 
redirigida.`,
      position: "left",
      activationPercent: 20,
    },
    {
      id: 2,
      x: 200,
      y: 450,
      rotation: -35,
      color: "#FFE55C",
      title: "23 MINUTOS",
      summary: "23 minutos y 15 segundos. Ese es el tiempo que tu cerebro necesita para recuperar la concentración plena después de una interrupción. No es el segundo que tardas en revisar la notificación, es el cuarto de hora que pierdes después.",
      content: `Ese es el tiempo que tu cerebro necesita para 
recuperar la concentración plena después de 
una interrupción.

No es el segundo que tardas en revisar la 
notificación.

Es el cuarto de hora que pierdes después.

Y esto sucede docenas de veces al día.`,
      position: "left",
      activationPercent: 30,
    },
    {
      id: 3,
      x: 180,
      y: 350,
      rotation: -20,
      color: "#FFC125",
      title: "40% DE PÉRDIDA",
      summary: "40% de pérdida de productividad. Esa es la penalización que paga tu cerebro por los 'costos de cambio' acumulados. Milisegundos que se acumulan hasta convertirse en horas perdidas.",
      content: `Esa es la penalización que paga tu cerebro 
por los "costos de cambio" acumulados.

Cada vez que saltas de una tarea a otra,
tu cerebro necesita tiempo para reconfigurar 
su enfoque.

Milisegundos, en realidad.
Pero milisegundos que se acumulan.

Hasta convertirse en horas perdidas.`,
      position: "left",
      activationPercent: 40,
    },
    {
      id: 4,
      x: 550,
      y: 530,
      rotation: 25,
      color: "#DAA520",
      title: "CORTEZA PREFRONTAL",
      summary: "Tu 'CEO Interno'. La parte que razona, planifica y dice 'no' a los impulsos. Cuando estás constantemente cambiando entre tareas, ella trabaja más duro. No se apaga, se sobrecarga.",
      content: `Tu "CEO Interno"

Justo detrás de tu frente.
La parte que razona.
La que planifica.
La que dice "no" a los impulsos.

Cuando lees esto, ella está trabajando.
Cuando te concentras profundamente, 
ella está trabajando.

Pero cuando estás constantemente 
cambiando entre tareas...
Cuando tienes 15 pestañas abiertas...

Ella trabaja más duro.
No se apaga.
Se sobrecarga.

Necesita más esfuerzo para hacer lo mismo.`,
      position: "right",
      activationPercent: 50,
    },
    {
      id: 5,
      x: 600,
      y: 430,
      rotation: 35,
      color: "#FFDB58",
      title: "NÚCLEO ACCUMBENS",
      summary: "Tu Centro de Recompensa. Se enciende cuando recibes un 'like', un mensaje o descubres un video. Las apps te recompensan a veces, impredeciblemente. Esto se llama 'refuerzo variable'.",
      content: `Tu Centro de Recompensa

Escondido en el centro de tu cerebro.

El que se enciende cuando comes algo delicioso.
Cuando alguien te abraza.
Cuando logras algo difícil.

Y también cuando...
Ves que alguien le dio "like" a tu foto.
Recibes un mensaje.
Descubres un video que te hace reír.

Las apps no te recompensan siempre.
Te recompensan a veces.
Impredeciblemente.

Esto se llama "refuerzo variable."
Es la forma más efectiva de condicionar 
un comportamiento.

No es adicción.
Es tu cerebro funcionando exactamente 
como está diseñado.

El problema es que alguien más también 
sabe cómo está diseñado.`,
      position: "right",
      activationPercent: 60,
    },
    {
      id: 6,
      x: 620,
      y: 330,
      rotation: 20,
      color: "#FFD966",
      title: "AMÍGDALA",
      summary: "Tu Detector de Amenazas. Heredado de cuando vivías en la sabana. Ella no distingue entre un tigre que te persigue y una notificación que vibra. Para ella, todo es una alarma.",
      content: `Tu Detector de Amenazas

Heredado de cuando vivías en la sabana.
Cuando los tigres eran reales.

Ella no distingue entre:
Un tigre que te persigue.
Un email con asunto "URGENTE."
Una notificación que vibra en tu bolsillo.

Para ella, todo es una alarma.

Cada notificación...
Cada ping...
Cada vibración...
...activa una micro-respuesta de estrés.

Cortisol. Adrenalina. Alerta.

Y el FOMO.
El "miedo a quedarse fuera."

No es superficial.
Es procesado aquí como un miedo real 
a la exclusión social.

Tu amígdala está haciendo su trabajo.
Protegerte.

No sabe que la amenaza es... 
una notificación de un juego.`,
      position: "right",
      activationPercent: 70,
    },
    {
      id: 7,
      x: 600,
      y: 230,
      rotation: 15,
      color: "#D4AF37",
      title: "HIPOCAMPO",
      summary: "Tu Archivador de Memorias. Solo guarda lo que considera importante. Pero cuando puedes Googlearlo, tu hipocampo aprende: 'No necesito guardar esto'. Se llama 'Efecto Google'.",
      content: `Tu Archivador de Memorias

Donde guardas experiencias.
Donde conviertes el presente en pasado.
Donde almacenas lo aprendido.

Pero tiene una peculiaridad.
Solo guarda lo que considera importante.
Lo que es probable que necesites recordar.

¿La capital de Australia?

Opción A: Hacer el esfuerzo de recordar.
Opción B: Googlearlo.

Y tu hipocampo aprende:
"No necesito guardar esto."
"Google lo tiene."

Se llama "Efecto Google."

Tu cerebro aprende que ya no necesita 
almacenar la información.
Solo la ruta para encontrarla.

No es que tu memoria se atrofie.
Es que delega.

Y cada vez que delega,
se vuelve un poco mejor en delegar...
y un poco peor en recordar.`,
      position: "right",
      activationPercent: 80,
    },
    {
      id: 8,
      x: 380,
      y: 280,
      rotation: -10,
      color: "#B8860B",
      title: "SIN VILLANOS",
      summary: "La mecánica sin villanos. Cuatro sistemas. Ninguno roto. Todos funcionando perfectamente. El problema es que fueron diseñados para un mundo diferente. Y alguien más lo sabe.",
      content: `Cuatro sistemas.
Ninguno roto.

Tu corteza prefrontal no es débil.
Tu núcleo accumbens no es adicto.
Tu amígdala no es paranoica.
Tu hipocampo no es vago.

Todos están funcionando perfectamente.

El problema es que...
fueron diseñados para un mundo diferente.

Para amenazas reales, no notificaciones.
Para recompensas escasas, no infinitas.
Para información limitada, no ilimitada.
Para atención sostenida, no fragmentada.

Y alguien más lo sabe.

Los diseñadores de apps estudiaron estos sistemas.
Los ingenieros de engagement los midieron.
Los algoritmos los optimizaron.

No para hacerte daño.
Para hacerte quedarte.`,
      position: "center",
      activationPercent: 90,
    },
    {
      id: 9,
      x: 400,
      y: 150,
      rotation: 0,
      color: "#EEC900",
      title: "LA PREGUNTA ESPEJO",
      summary: "La pregunta ya no es: '¿Por qué me pasa esto?'. La pregunta ahora es: '¿Lo noto cuando sucede?'. Porque si lo notas, si ves la mecánica mientras sucede, entonces puedes elegir.",
      content: `Has visto el mapa.
Has visto cómo funciona.

Los 47 segundos.
Los 23 minutos.
Las cuatro estaciones del cerebro mediático.

La pregunta ya no es:
"¿Por qué me pasa esto?"

La pregunta ahora es:
"¿Lo noto cuando sucede?"

¿Notas cuando tu mano va al teléfono 
sin que lo decidas?

¿Notas cuando la notificación activa 
tu amígdala?

¿Notas cuando scrolleas buscando 
la recompensa del núcleo accumbens?

¿Notas cuando delegas en Google 
en lugar de recordar?

Porque si lo notas...
Si ves la mecánica mientras sucede...

...entonces puedes elegir.

No si usas o no la tecnología.
Sino cómo la habitas.`,
      position: "center",
      activationPercent: 95,
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress * 100;
        
        // Activate leaves based on scroll progress
        const newActiveLeaves = leaves
          .filter((leaf) => progress >= leaf.activationPercent)
          .map((leaf) => leaf.id);
        
        setActiveLeaves(newActiveLeaves);

        // Add falling leaves at different scroll percentages (more frequently)
        const scrollPercentages = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
        
        scrollPercentages.forEach((percent) => {
          const rangeStart = percent;
          const rangeEnd = percent + 1;
          
          if (progress >= rangeStart && progress < rangeEnd && !lastScrollBatchRef.current.has(percent)) {
            lastScrollBatchRef.current.add(percent);
            
            // Vary the number of leaves per batch
            const leafCount = percent % 20 === 0 ? 4 : percent % 15 === 0 ? 3 : 2;
            
            const newFallingLeaves = Array.from({ length: leafCount }, (_, i) => {
              // Calculate natural accumulation position with more variation
              const baseX = Math.random() * window.innerWidth;
              const baseY = window.innerHeight - 50;
              
              // Find nearby leaves within a wider radius for more natural clustering
              const nearbyLeaves = accumulatedLeavesRef.current.filter(
                leaf => Math.abs(leaf.x - baseX) < 150
              );
              
              // Calculate Y position based on nearby leaves (stack on top)
              // Create more natural layering with varied heights
              let finalY;
              if (nearbyLeaves.length > 0) {
                const lowestY = Math.min(...nearbyLeaves.map(l => l.y));
                // Stack on top with natural variation - some leaves higher, some lower
                const stackOffset = -15 - Math.random() * 35;
                finalY = lowestY + stackOffset;
              } else {
                // No nearby leaves - place at varied heights in the bottom third
                finalY = baseY - Math.random() * 80 - Math.random() * 40;
              }
              
              // Ensure leaves don't stack too high (max 250px from bottom)
              finalY = Math.max(finalY, baseY - 250);
              
              // More horizontal variation for natural spread
              const finalX = baseX + (Math.random() - 0.5) * 80;
              
              return {
                id: Date.now() + i + percent * 100,
                startX: baseX,
                startY: -50 - Math.random() * 100,
                rotation: Math.random() * 360,
                delay: i * (300 + Math.random() * 400),
                duration: 4000 + Math.random() * 3000,
                color: [
                  "#FFD700", "#F4C430", "#FFE55C", "#FFC125", 
                  "#DAA520", "#FFDB58", "#FFD966", "#D4AF37", 
                  "#B8860B", "#EEC900"
                ][Math.floor(Math.random() * 10)],
                createdAt: Date.now(),
                finalX,
                finalY,
              };
            });
            
            setFallingLeaves((prev) => [...prev, ...newFallingLeaves]);
          }
        });

        // Trigger transition at 100%
        if (progress >= 99 && !isTransitioning) {
          setIsTransitioning(true);
          setTimeout(() => {
            // Shine effect and fade out
            gsap.to(".tree-container", {
              opacity: 0,
              duration: 1.5,
              ease: "power2.out",
            });
          }, 1000);
        }
      },
    });

    return () => {
      scrollTrigger.kill();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isTransitioning]);

  // Automatic falling leaves interval
  useEffect(() => {
    const autoLeafInterval = setInterval(() => {
      // Generate 1-2 leaves automatically every 3-5 seconds
      const leafCount = Math.random() > 0.5 ? 1 : 2;
      const newLeaves = Array.from({ length: leafCount }, (_, i) => {
        // Calculate natural accumulation position with more variation
        const baseX = Math.random() * window.innerWidth;
        const baseY = window.innerHeight - 50;
        
        // Find nearby leaves within a wider radius for more natural clustering
        const nearbyLeaves = accumulatedLeavesRef.current.filter(
          leaf => Math.abs(leaf.x - baseX) < 150
        );
        
        // Calculate Y position based on nearby leaves (stack on top)
        // Create more natural layering with varied heights
        let finalY;
        if (nearbyLeaves.length > 0) {
          const lowestY = Math.min(...nearbyLeaves.map(l => l.y));
          // Stack on top with natural variation - some leaves higher, some lower
          const stackOffset = -15 - Math.random() * 35;
          finalY = lowestY + stackOffset;
        } else {
          // No nearby leaves - place at varied heights in the bottom third
          finalY = baseY - Math.random() * 80 - Math.random() * 40;
        }
        
        // Ensure leaves don't stack too high (max 250px from bottom)
        finalY = Math.max(finalY, baseY - 250);
        
        // More horizontal variation for natural spread
        const finalX = baseX + (Math.random() - 0.5) * 80;
        
        return {
          id: Date.now() + i,
          startX: baseX,
          startY: -50 - Math.random() * 100,
          rotation: Math.random() * 360,
          delay: i * 200,
          duration: 4000 + Math.random() * 3000,
          color: [
            "#FFD700", "#F4C430", "#FFE55C", "#FFC125", 
            "#DAA520", "#FFDB58", "#FFD966", "#D4AF37", 
            "#B8860B", "#EEC900"
          ][Math.floor(Math.random() * 10)],
          createdAt: Date.now(),
          finalX,
          finalY,
        };
      });
      
      setFallingLeaves((prev) => [...prev, ...newLeaves]);
    }, 3000 + Math.random() * 2000); // Every 3-5 seconds

    return () => {
      clearInterval(autoLeafInterval);
    };
  }, []);

  // Keep all falling leaves - they accumulate at the bottom instead of being removed
  // Removed cleanup interval so leaves stay visible and accumulate like autumn leaves

  // Hide scroll indicators on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicators(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <CustomCursor />
      <div
        ref={containerRef}
        className="min-h-[300vh] relative"
        style={{
          backgroundImage: `url(${fondoAzul})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Sticky tree container */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <motion.div
            className="tree-container relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Tree image */}
            <img
              src={treeImage}
              alt="Árbol neuronal"
              className="w-full h-auto max-h-[90vh] object-contain"
              style={{ maxWidth: "800px", pointerEvents: "none" }}
            />
            
            {/* Interactive leaves overlay */}
            <svg
              width="800"
              height="800"
              viewBox="0 0 800 800"
              className="absolute inset-0 w-full h-auto max-h-[90vh]"
              style={{ pointerEvents: "auto" }}
            >
              {/* Leaves */}
              {leaves.map((leaf) => (
                <TreeLeaf
                  key={leaf.id}
                  {...leaf}
                  isActive={activeLeaves.includes(leaf.id)}
                  onClick={() => {
                    if (activeLeaves.includes(leaf.id)) {
                      setSelectedLeaf(leaf);
                    }
                  }}
                  onMouseEnter={() => {
                    if (activeLeaves.includes(leaf.id)) {
                      // Clear any existing timeout
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                        hoverTimeoutRef.current = null;
                      }
                      setHoveredLeaf(leaf);
                    }
                  }}
                  onMouseLeave={() => {
                    // Add delay before hiding preview
                    hoverTimeoutRef.current = setTimeout(() => {
                      setHoveredLeaf(null);
                    }, 500);
                  }}
                />
              ))}
            </svg>
            
            {/* Leaf Preview on Hover */}
            {hoveredLeaf && activeLeaves.includes(hoveredLeaf.id) && (
              <LeafPreview
                title={hoveredLeaf.title}
                summary={hoveredLeaf.summary}
                color={hoveredLeaf.color}
                x={hoveredLeaf.x}
                y={hoveredLeaf.y}
                position={hoveredLeaf.position}
                onReadMore={() => {
                  setSelectedLeaf(hoveredLeaf);
                  setHoveredLeaf(null);
                }}
                onMouseEnter={() => {
                  // Cancel timeout when hovering over preview
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                  }
                }}
                onMouseLeave={() => {
                  // Add delay when leaving preview
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredLeaf(null);
                  }, 500);
                }}
              />
            )}
          </motion.div>

          {/* Scroll Indicators */}
          {showScrollIndicators && (
            <>
              {/* Left Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute left-12 top-[35%] -translate-y-1/2 pointer-events-none"
              >
                <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
                  {/* Primera V gruesa con puntas redondeadas */}
                  <path
                    d="M 12 8 L 30 28 L 48 8"
                    stroke="rgba(255, 255, 255, 0.95)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{
                      filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 25px rgba(240, 240, 255, 0.8)) drop-shadow(0 0 35px rgba(230, 230, 250, 0.6))'
                    }}
                  />
                  {/* Segunda V gruesa con puntas redondeadas */}
                  <path
                    d="M 12 38 L 30 58 L 48 38"
                    stroke="rgba(255, 255, 255, 0.95)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{
                      filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 25px rgba(240, 240, 255, 0.8)) drop-shadow(0 0 35px rgba(230, 230, 250, 0.6))'
                    }}
                  />
                </svg>
              </motion.div>

              {/* Right Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute right-12 top-[35%] -translate-y-1/2 pointer-events-none"
              >
                <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
                  {/* Primera V gruesa con puntas redondeadas */}
                  <path
                    d="M 12 8 L 30 28 L 48 8"
                    stroke="rgba(255, 255, 255, 0.95)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{
                      filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 25px rgba(240, 240, 255, 0.8)) drop-shadow(0 0 35px rgba(230, 230, 250, 0.6))'
                    }}
                  />
                  {/* Segunda V gruesa con puntas redondeadas */}
                  <path
                    d="M 12 38 L 30 58 L 48 38"
                    stroke="rgba(255, 255, 255, 0.95)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{
                      filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 25px rgba(240, 240, 255, 0.8)) drop-shadow(0 0 35px rgba(230, 230, 250, 0.6))'
                    }}
                  />
                </svg>
              </motion.div>
            </>
          )}
        </div>

        {/* Falling Decorative Leaves */}
        {fallingLeaves.map((leaf) => (
          <FallingLeaf
            key={leaf.id}
            id={leaf.id}
            startX={leaf.startX}
            startY={leaf.startY}
            rotation={leaf.rotation}
            delay={leaf.delay}
            duration={leaf.duration}
            color={leaf.color}
            finalX={leaf.finalX}
            finalY={leaf.finalY}
            onAnimationComplete={(x, y) => {
              // Register this leaf's final position for future accumulation
              accumulatedLeavesRef.current.push({ x, y, id: leaf.id });
            }}
          />
        ))}

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => navigate("/")}
          className="fixed-lobby-btn"
        >
          <svg className="clover-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Trébol de 4 hojas */}
            <circle cx="12" cy="8" r="4" fill="url(#pearlGradient1)" />
            <circle cx="16" cy="12" r="4" fill="url(#pearlGradient2)" />
            <circle cx="12" cy="16" r="4" fill="url(#pearlGradient3)" />
            <circle cx="8" cy="12" r="4" fill="url(#pearlGradient4)" />
            {/* Centro */}
            <circle cx="12" cy="12" r="2.5" fill="#F5F5F5" opacity="0.9" />
            {/* Tallo */}
            <path d="M12 14 L12 20" stroke="#E8E8E8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Gradientes perla */}
            <defs>
              <radialGradient id="pearlGradient1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#F8F8FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F0F0F5" stopOpacity="0.85" />
              </radialGradient>
              <radialGradient id="pearlGradient2">
                <stop offset="0%" stopColor="#FFFAF0" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FFF8F8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F5F5F0" stopOpacity="0.85" />
              </radialGradient>
              <radialGradient id="pearlGradient3">
                <stop offset="0%" stopColor="#F8F8FF" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#F0F0FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E8E8F5" stopOpacity="0.85" />
              </radialGradient>
              <radialGradient id="pearlGradient4">
                <stop offset="0%" stopColor="#FFFFF0" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FFFAف8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F5F5E8" stopOpacity="0.85" />
              </radialGradient>
            </defs>
          </svg>
          ← Lobby
        </motion.button>


        {/* Modal Dialog */}
        <Dialog open={selectedLeaf !== null} onOpenChange={(open) => !open && setSelectedLeaf(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedLeaf && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold mb-4 font-['Cormorant_Garamond'] italic" style={{ color: 'hsl(225, 73%, 57%)' }}>
                    {selectedLeaf.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="text-lg whitespace-pre-line leading-relaxed text-foreground font-['Cormorant_Garamond']">
                  {selectedLeaf.content}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Seccion2;
