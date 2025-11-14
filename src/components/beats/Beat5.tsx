import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Particles } from "../Particles";
import { MouseParallax } from "../MouseParallax";

const openingText = ["No estás loco.", "Algo está pasando."];

const negations = [
  "No es apocalíptico.",
  "No es una adicción.",
  "No es el fin del mundo.",
];

const description = ["Es algo más sutil.", "Más profundo.", "Más... invisible."];

interface LightParticle {
  id: number;
  x: number;
  delay: number;
}

export const Beat5 = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [lightParticles, setLightParticles] = useState<LightParticle[]>([]);

  useEffect(() => {
    if (inView) {
      const particles = Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: 45 + Math.random() * 10,
        delay: i * 0.1,
      }));
      setLightParticles(particles);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-br from-narrative-purple via-narrative-purple to-narrative-yellow overflow-hidden"
    >
      <Particles count={45} color="narrative-yellow" behavior="float" />

      {/* Radial gradient animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 2 } : {}}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-radial-gradient from-narrative-yellow/30 to-transparent"
      />

      {/* The crack/fissure */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 2 }}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          d="M200,0 Q195,100 200,200 Q205,300 198,400 Q202,500 200,600 Q198,700 200,800"
          stroke="rgba(244, 228, 193, 0.5)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Light particles ascending from crack */}
      {lightParticles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-100vh", opacity: [0, 1, 0] }}
          transition={{
            delay: particle.delay,
            duration: 6,
            ease: "easeOut",
            repeat: Infinity,
          }}
          className="absolute w-2 h-2 bg-narrative-yellow rounded-full blur-sm"
          style={{ left: `${particle.x}%` }}
        />
      ))}

      <MouseParallax strength={12}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Opening */}
          <div className="mb-16 space-y-6">
            {openingText.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 1, duration: 1.5 }}
                className={`${
                  index === 0 ? "text-xl md:text-2xl" : "text-3xl md:text-4xl font-semibold"
                } text-white text-handwritten`}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Negations */}
          <div className="mb-16 space-y-4">
            {negations.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 2.5 + index * 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/90 text-handwritten"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Description */}
          <div className="mb-16 space-y-4">
            {description.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 4.5 + index * 0.6, duration: 0.8 }}
                className="text-2xl md:text-3xl text-white text-handwritten"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Final question */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 6, duration: 1.5 }}
            className="mb-12"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-narrative-yellow text-glow text-handwritten">
              ¿Quieres ver qué es?
            </h3>
          </motion.div>

          {/* Continue indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1, y: [-10, 0, -10] } : {}}
            transition={{
              opacity: { delay: 7, duration: 1 },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="text-narrative-yellow text-2xl"
          >
            → Continuar
          </motion.div>
        </div>
      </MouseParallax>
    </section>
  );
};
