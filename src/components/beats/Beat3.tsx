import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import silhouettes from "@/assets/silhouettes.png";
import { Particles } from "../Particles";

const openingText = "Intentas explicárselo a alguien cercano.";
const dialogue1 = '"¿No te parece extraño que lo primero que hacemos al despertar sea revisar Instagram?"';
const response = '"Sí, tienes razón."';

const reflection = [
  "Siguen scrolleando.",
  "",
  "No te escucharon mal.",
  "No están en desacuerdo.",
  "Simplemente... no lo sienten como un problema.",
];

export const Beat3 = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-20 bg-narrative-gray overflow-hidden"
    >
      <Particles count={50} color="gray-400" behavior="static" />

      {/* Mist divider effect */}
      <motion.div
        animate={{ x: [-10, 10, -10], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute left-1/2 top-0 bottom-0 w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-2xl"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Opening text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-2xl md:text-3xl text-gray-800 text-handwritten text-center mb-12"
        >
          {openingText}
        </motion.p>

        {/* Silhouettes */}
        <div className="relative flex justify-center items-center my-20">
          <motion.div
            initial={{ clipPath: "inset(0 50% 0 0)" }}
            animate={inView ? { clipPath: "inset(0 0 0 0)" } : {}}
            transition={{ delay: 1, duration: 1.5 }}
            className="relative"
          >
            <img
              src={silhouettes}
              alt="Two silhouettes with internal gardens"
              className="w-full max-w-4xl h-auto"
            />
          </motion.div>
        </div>

        {/* Dialogue */}
        <div className="space-y-8 mb-16 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 text-handwritten text-center"
          >
            {dialogue1}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 3.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 text-handwritten text-center"
          >
            {response}
          </motion.p>
        </div>

        {/* Reflection text */}
        <div className="space-y-4 mb-16 max-w-3xl mx-auto">
          {reflection.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 4.5 + index * 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-800 text-handwritten text-center"
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Key question */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 7, duration: 1 }}
          className="text-center"
        >
          <h3 className="text-3xl md:text-4xl font-semibold text-narrative-yellow text-handwritten">
            ¿Y si el problema eres tú, que sí lo notas?
          </h3>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 7.5, duration: 1 }}
            className="h-1 bg-narrative-yellow mt-4 mx-auto max-w-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};
