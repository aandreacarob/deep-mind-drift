import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TreeLeaf } from "@/components/TreeLeaf";
import { CustomCursor } from "@/components/CustomCursor";
import vangoghBg from "@/assets/vangogh-background.jpg";
import watercolorTree from "@/assets/watercolor-tree.png";
import { removeBackground, loadImage } from "@/utils/removeBackground";

gsap.registerPlugin(ScrollTrigger);

interface LeafData {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  title: string;
  content: string;
  position: "left" | "right" | "center";
  activationPercent: number;
}

const Seccion2 = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLeaves, setActiveLeaves] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [processedTreeImage, setProcessedTreeImage] = useState<string | null>(null);

  const leaves: LeafData[] = [
    {
      id: 10,
      x: 400,
      y: 650,
      rotation: 0,
      color: "#E8DFF5",
      title: "EL MAPA CEREBRAL",
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
      color: "#7FB3D5",
      title: "47 SEGUNDOS",
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
      color: "#95C2E0",
      title: "23 MINUTOS",
      content: `23 MINUTOS Y 15 SEGUNDOS

Ese es el tiempo que tu cerebro necesita para 
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
      color: "#A8D5E2",
      title: "40% DE PÉRDIDA",
      content: `40% DE PÉRDIDA DE PRODUCTIVIDAD

Esa es la penalización que paga tu cerebro 
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
      color: "#5D9BD5",
      title: "CORTEZA PREFRONTAL",
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
      color: "#E76F51",
      title: "NÚCLEO ACCUMBENS",
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
      color: "#F4A261",
      title: "AMÍGDALA",
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
      color: "#8FB996",
      title: "HIPOCAMPO",
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
      color: "#9B87B5",
      title: "SIN VILLANOS",
      content: `LA MECÁNICA SIN VILLANOS

Cuatro sistemas.
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
      color: "#B8A5C8",
      title: "LA PREGUNTA ESPEJO",
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
    // Process the tree image to remove background
    const processImage = async () => {
      try {
        const response = await fetch(watercolorTree);
        const blob = await response.blob();
        const img = await loadImage(blob);
        const processedBlob = await removeBackground(img);
        const url = URL.createObjectURL(processedBlob);
        setProcessedTreeImage(url);
      } catch (error) {
        console.error('Error processing tree image:', error);
        // Fallback to original image
        setProcessedTreeImage(watercolorTree);
      }
    };
    
    processImage();
    
    return () => {
      if (processedTreeImage && processedTreeImage !== watercolorTree) {
        URL.revokeObjectURL(processedTreeImage);
      }
    };
  }, []);

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
    };
  }, [isTransitioning]);

  return (
    <>
      <CustomCursor />
      <div
        ref={containerRef}
        className="min-h-[300vh] relative"
        style={{
          backgroundImage: `url(${vangoghBg})`,
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
            {/* Watercolor tree image */}
            {processedTreeImage ? (
              <img
                src={processedTreeImage}
                alt="Árbol de acuarela"
                className="w-full h-auto max-h-[90vh] object-contain"
                style={{ maxWidth: "800px" }}
              />
            ) : (
              <div className="w-[800px] h-[800px] flex items-center justify-center">
                <div className="text-purple-600">Procesando imagen...</div>
              </div>
            )}
            
            {/* Interactive leaves overlay */}
            <svg
              width="800"
              height="800"
              viewBox="0 0 800 800"
              className="absolute inset-0 w-full h-auto max-h-[90vh]"
              style={{ pointerEvents: "none" }}
            >
              {/* Leaves */}
              {leaves.map((leaf) => (
                <TreeLeaf
                  key={leaf.id}
                  {...leaf}
                  isActive={activeLeaves.includes(leaf.id)}
                />
              ))}
            </svg>
          </motion.div>
        </div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => navigate("/")}
          className="fixed bottom-8 left-8 z-50 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-narrative-purple font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105"
        >
          ← Volver
        </motion.button>
      </div>
    </>
  );
};

export default Seccion2;
