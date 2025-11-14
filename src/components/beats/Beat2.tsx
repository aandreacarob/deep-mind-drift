import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import appIcons from "@/assets/app-icons.png";
import { MouseParallax } from "../MouseParallax";
import { Particles } from "../Particles";
import { Tilt3D } from "../Tilt3D";

const openingText = [
  "Durante el día, lo haces 47 veces más.",
  "A veces porque vibra.",
  'A veces porque recuerdas algo que "necesitas" buscar.',
  "A veces... sin razón.",
];

const routeText = [
  "Tu cerebro aprendió una ruta.",
  "Mano → bolsillo → desbloqueo → scroll.",
  "Un bucle tan suave que se siente invisible.",
];

export const Beat2 = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [iconCount, setIconCount] = useState(5);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIconCount(40);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-20 bg-narrative-teal overflow-hidden"
    >
      <Particles count={70} color="narrative-teal" behavior="fall" />

      {/* Pink clouds at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-narrative-pink/30 to-transparent" />

      <MouseParallax strength={25}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Opening text */}
          <div className="mb-16 space-y-4">
            {openingText.map((line, index) => (
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

          {/* Icons area */}
          <div className="my-20 relative h-96">
            {/* Initial floating icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: iconCount === 5 ? 1 : 0 } : {}}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Tilt3D key={i} maxRotation={10}>
                  <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      delay: 1 + i * 0.2,
                      duration: 0.8,
                      type: "spring",
                      damping: 10,
                    }}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${20 + (i % 2) * 30}%`,
                    }}
                  >
                    <img
                      src={appIcons}
                      alt="App icon"
                      className="w-20 h-20 opacity-80"
                      style={{
                        clipPath: `inset(${(i * 20)}% ${80 - (i * 20)}% ${80 - (i * 20)}% ${i * 20}%)`,
                      }}
                    />
                  </motion.div>
                </Tilt3D>
              ))}
            </motion.div>

            {/* Multiplied icons in spiral */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={iconCount === 40 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0"
            >
              {Array.from({ length: 40 }).map((_, i) => {
                const angle = (i / 40) * Math.PI * 4;
                const radius = 150 + (i / 40) * 50;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ scale: 1, x, y, rotate: angle * 57.3 }}
                    transition={{
                      delay: i * 0.05,
                      duration: 1.5,
                      type: "spring",
                    }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <motion.img
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      src={appIcons}
                      alt="App icon"
                      className="w-12 h-12 opacity-70"
                      style={{
                        clipPath: `inset(${(i % 5) * 20}% ${80 - ((i % 5) * 20)}% ${80 - ((i % 5) * 20)}% ${(i % 5) * 20}%)`,
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Route text */}
          <div className="mb-16 space-y-4">
            {routeText.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 4 + index * 0.8, duration: 0.8 }}
                className="text-xl md:text-2xl text-white text-handwritten"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Key question */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 6, duration: 1 }}
          >
            <h3 className="text-3xl md:text-4xl font-semibold text-narrative-yellow text-handwritten">
              ¿Cuántas veces hoy agarraste tu teléfono sin saber por qué?
            </h3>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 6.5, duration: 1 }}
              className="h-1 bg-narrative-yellow mt-4 mx-auto max-w-lg"
            />
          </motion.div>
        </div>
      </MouseParallax>
    </section>
  );
};
