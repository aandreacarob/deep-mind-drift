import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import caminoBackground from "@/assets/camino.png";

gsap.registerPlugin(ScrollTrigger);

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  messageId: number;
  sectionIndex: number;
}

interface MessageSection {
  id: number;
  content: string | null;
  className?: string;
}

const messages: MessageSection[] = [
  { id: 1, content: "6:47 AM.\nAbres los ojos.\nTu mano ya se está moviendo.\n<em class='highlight-doubt'>No fue una decisión consciente.</em>" },
  { id: 2, content: "<em class='highlight-doubt'>No pensaste: \"Voy a revisar mi teléfono.\"</em>" },
  { id: 3, content: "<em class='highlight-action'>Simplemente... ya lo estás sosteniendo.</em>" },
  { id: 4, content: "<em>Tres notificaciones.</em>" },
  { id: 5, content: "<em>Doce mensajes sin leer.</em>" },
  { id: 6, content: "<em>Un email urgente que no es urgente.</em>" },
  { id: 7, content: null },
  { id: 8, content: "<em>Todavía no has pensado en el día que te espera.</em>" },
  { id: 9, content: "<em>Todavía no has decidido cómo te sientes.</em>" },
  { id: 10, content: "<em>Pero ya sabes qué está pasando en el mundo digital.</em>" },
  { id: 11, content: "<h2 class='highlight-question'>¿Cuándo decidiste que esto fuera lo primero?</h2>", className: "heading" },
  { id: 12, content: "<em class='highlight-action'>Durante el día, lo haces 47 veces más.</em>" },
  { id: 13, content: "<em>A veces porque vibra.</em>" },
  { id: 14, content: "<em>A veces porque recuerdas algo que \"necesitas\" buscar.</em>" },
  { id: 15, content: "<em class='highlight-doubt'>A veces... sin razón.</em>" },
  { id: 16, content: null },
  { id: 17, content: "<em>Tu cerebro aprendió una ruta.</em>" },
  { id: 18, content: "<span class='highlight-action'>Mano → bolsillo → desbloqueo → scroll.</span>" },
  { id: 19, content: "<em>Un bucle tan suave que se siente invisible.</em>" },
  { id: 20, content: "<span class='highlight-question'>¿Cuántas veces hoy agarraste tu teléfono sin saber por qué?</span>" },
  { id: 21, content: "Intentas explicárselo a alguien cercano.\n<em>\"¿No te parece extraño que lo primero que hacemos al despertar sea revisar Instagram?\"</em>" },
  { id: 22, content: "\"Sí, tienes razón.\"" },
  { id: 23, content: "<em class='highlight-action'>Siguen scrolleando.</em>" },
  { id: 24, content: "<em>No te escucharon mal.</em>\n<em>No están en desacuerdo.</em>" },
  { id: 25, content: "<em class='highlight-doubt'>Simplemente... no lo sienten como un problema.</em>" },
  { id: 26, content: null },
  { id: 27, content: "<h2 class='highlight-question'>¿Y si el problema eres tú, que sí lo notas?</h2>", className: "heading" },
  { id: 28, content: "<em>Tal vez no hay nada malo aquí.</em>" },
  { id: 29, content: "<em>Tal vez esto es solo... evolución.</em>" },
  { id: 30, content: "<em>Nuestras manos aprendieron a usar herramientas.</em>" },
  { id: 31, content: "<em>Ahora nuestros cerebros aprenden a habitar pantallas.</em>" },
  { id: 32, content: "<span class='small-text'>o tal vez...</span>" },
  { id: 33, content: "<em class='highlight-doubt'>Tal vez hay algo que todos sentimos pero nadie nombra.</em>" },
  { id: 34, content: "<em>Una incomodidad.</em>" },
  { id: 35, content: "<em>Una sospecha.</em>" },
  { id: 36, content: "<em>Una pregunta que se queda suspendida:</em>" },
  { id: 37, content: "<h2 class='highlight-question'>\"¿Cuándo dejé de elegir?\"</h2>", className: "heading" },
  { id: 38, content: "<em class='highlight-action'>No estás loco.</em>" },
  { id: 39, content: "<em class='highlight-action'>Algo está pasando.</em>" },
  { id: 40, content: "<em>No es apocalíptico.</em>\n<em>No es una adicción.</em>\n<em>No es el fin del mundo.</em>" },
  { id: 41, content: "<em class='highlight-doubt'>Es algo más sutil.</em>\n<em class='highlight-doubt'>Más profundo.</em>\n<em class='highlight-doubt'>Más... invisible.</em>" },
  { id: 42, content: "<h2 class='highlight-question'>¿Quieres ver qué es?</h2>\n<button class='continue-btn'>→ Continuar</button>", className: "heading final" },
];

const Seccion1 = () => {
  const navigate = useNavigate();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      const box = section.querySelector(".message-box");
      if (!box) return;

      if (prefersReducedMotion) {
        gsap.set(box, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(box, { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "top -5%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(box, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          });
        },
        onLeave: () => {
          const messageBox = box as HTMLElement;
          const rect = messageBox.getBoundingClientRect();
          const textContent = messageBox.textContent || "";
          const currentIndex = index;
          
          // Posición final aleatoria para la burbuja
          const finalX = Math.random() * 80 + 10;
          const finalY = Math.random() * 30 + 5;
          const finalSize = Math.random() * 12 + 8;
          
          // Timeline de transformación completa
          const tl = gsap.timeline();
          
          // 1. Fade out del texto
          tl.to(box.querySelectorAll('*'), {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
          
          // 2. Transformar el card en burbuja
          tl.to(box, {
            scale: 0.15,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, hsl(175 45% 55% / 0.8), hsl(176 62% 37% / 0.6), hsl(198 62% 29% / 0.4))",
            backdropFilter: "none",
            border: "none",
            boxShadow: "0 0 20px hsl(175 45% 55% / 0.6), 0 0 40px hsl(175 45% 55% / 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)",
            duration: 0.8,
            ease: "power2.inOut",
          }, "-=0.1");
          
          // 3. Mover a posición final en el cielo
          tl.to(box, {
            x: `${finalX}vw`,
            y: `${finalY}vh`,
            duration: 1.2,
            ease: "power1.out",
            onComplete: () => {
              // Ocultar el card original
              gsap.set(box, { opacity: 0 });
              
              // Crear burbuja permanente en sky-bubbles
              const newBubble: Bubble = {
                id: Date.now() + Math.random(),
                x: finalX,
                y: finalY,
                size: finalSize,
                delay: 0,
                messageId: messages[currentIndex].id,
                sectionIndex: currentIndex,
              };
              setBubbles((prev) => [...prev, newBubble]);
              
              // Resetear el card para la próxima vez
              gsap.set(box, {
                scale: 1,
                borderRadius: "",
                background: "",
                backdropFilter: "",
                border: "",
                boxShadow: "",
                x: 0,
                y: 30,
              });
              gsap.set(box.querySelectorAll('*'), { opacity: 1 });
            }
          }, "-=0.4");
        },
        onLeaveBack: () => {
          gsap.to(box, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.in",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleContinue = () => {
    navigate("/seccion-2");
  };

  const handleBubbleClick = (bubble: Bubble) => {
    const section = sectionsRef.current[bubble.sectionIndex];
    if (!section) return;

    // Scroll a la sección
    section.scrollIntoView({ behavior: "smooth", block: "center" });

    // Remover la burbuja del cielo después de un pequeño delay
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      
      // Resetear y mostrar el mensaje original
      const box = section.querySelector(".message-box") as HTMLElement;
      if (box) {
        gsap.set(box, {
          opacity: 1,
          y: 0,
          scale: 1,
          borderRadius: "",
          background: "",
          backdropFilter: "",
          border: "",
          boxShadow: "",
          x: 0,
        });
        gsap.set(box.querySelectorAll('*'), { opacity: 1 });
      }
    }, 300);
  };

  return (
    <div className="scrollytelling-container">
      <div
        className="fixed-background"
        style={{
          backgroundImage: `url(${caminoBackground})`,
        }}
      />
      
      {/* Burbujas que adornan el cielo */}
      <div className="sky-bubbles">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="sky-bubble"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDelay: `${bubble.delay}s`,
              cursor: 'pointer',
            }}
            onClick={() => handleBubbleClick(bubble)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleBubbleClick(bubble);
              }
            }}
          >
            <div className="bubble-glow" />
          </div>
        ))}
      </div>

      {messages.map((message, index) => (
        <section
          key={message.id}
          ref={(el) => (sectionsRef.current[index] = el)}
          className={`story-section ${message.className || ""}`}
        >
          {message.content && (
            <div className="message-box">
              <div 
                dangerouslySetInnerHTML={{ __html: message.content }} 
                onClick={(e) => {
                  if ((e.target as HTMLElement).classList.contains('continue-btn')) {
                    handleContinue();
                  }
                }}
              />
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default Seccion1;
