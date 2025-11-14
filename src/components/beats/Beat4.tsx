import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import brainTree from "@/assets/brain-tree.png";
import petalImg from "@/assets/petal.png";
import { Tilt3D } from "../Tilt3D";
import { MouseParallax } from "../MouseParallax";
import { Particles } from "../Particles";

const doubtText = [
  "Tal vez no hay nada malo aquí.",
  "Tal vez esto es solo... evolución.",
  "Nuestras manos aprendieron a usar herramientas.",
  "Ahora nuestros cerebros aprenden a habitar pantallas.",
];

const suspicionText = [
  "Tal vez hay algo que todos sentimos pero nadie nombra.",
  "Una incomodidad.",
  "Una sospecha.",
  "Una pregunta que se queda suspendida:",
];

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export const Beat4 = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setPetals((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 80 + 10,
            delay: 0,
            duration: Math.random() * 2 + 4,
          },
        ]);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-20 bg-narrative-pink overflow-hidden"
    >
      <Particles count={60} color="narrative-pink" behavior="float" />

      {/* Lightning effects */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-10 w-32 h-32 bg-narrative-yellow/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        className="absolute top-20 right-20 w-40 h-40 bg-narrative-yellow/20 rounded-full blur-3xl"
      />

      <MouseParallax strength={35}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Doubt text */}
          <div className="mb-16 space-y-4">
            {doubtText.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.8, duration: 0.8 }}
                className="text-2xl md:text-3xl text-white text-handwritten"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* "Or maybe..." with shake */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 3.5, duration: 0.5 }}
            className="text-3xl md:text-4xl text-narrative-yellow text-handwritten mb-12"
          >
            <motion.span
              animate={{ x: [-2, 2, -2, 2, 0] }}
              transition={{ delay: 4, duration: 0.5 }}
            >
              O tal vez...
            </motion.span>
          </motion.p>

          {/* Brain-Tree */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 4.5, duration: 2, type: "spring" }}
            className="relative my-16 flex justify-center"
          >
            <Tilt3D maxRotation={18}>
              <motion.div
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative"
              >
                <img
                  src={brainTree}
                  alt="Brain-tree hybrid"
                  className="w-80 md:w-96 h-auto"
                />
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-narrative-purple/10 rounded-full blur-2xl"
                />
              </motion.div>
            </Tilt3D>

            {/* Falling petals */}
            {petals.map((petal) => (
              <motion.img
                key={petal.id}
                src={petalImg}
                alt="Falling petal"
                initial={{ y: -50, x: `${petal.x}%`, opacity: 1, rotate: 0 }}
                animate={{
                  y: 600,
                  opacity: 0,
                  rotate: 360,
                  x: `${petal.x + (Math.random() * 20 - 10)}%`,
                }}
                transition={{ duration: petal.duration, ease: "easeIn" }}
                className="absolute top-0 w-6 h-6 pointer-events-none"
                onAnimationComplete={() => {
                  setPetals((prev) => prev.filter((p) => p.id !== petal.id));
                }}
              />
            ))}
          </motion.div>

          {/* Suspicion text */}
          <div className="mb-16 space-y-4">
            {suspicionText.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 6 + index * 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-white text-handwritten"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Key question */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 8, duration: 1 }}
          >
            <motion.h3
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl md:text-5xl font-bold text-narrative-yellow text-glow text-handwritten"
            >
              "¿Cuándo dejé de elegir?"
            </motion.h3>
          </motion.div>
        </div>
      </MouseParallax>
    </section>
  );
};
