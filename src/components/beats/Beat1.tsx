import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import handPhone from "@/assets/hand-phone.png";
import neuralBranches from "@/assets/neural-branches.png";
import { Tilt3D } from "../Tilt3D";
import { MouseParallax } from "../MouseParallax";
import { Particles } from "../Particles";

const textLines = [
  "Abres los ojos.",
  "Tu mano ya se está moviendo.",
  "",
  "No fue una decisión consciente.",
  'No pensaste: "Voy a revisar mi teléfono."',
  "Simplemente... ya lo estás sosteniendo.",
];

const notifications = [
  "Tres notificaciones.",
  "Doce mensajes sin leer.",
  "Un email urgente que no es urgente.",
];

const reflection = [
  "Todavía no has pensado en el día que te espera.",
  "Todavía no has decidido cómo te sientes.",
  "Pero ya sabes qué está pasando en el mundo digital.",
];

export const Beat1 = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-20 bg-narrative-purple overflow-hidden"
    >
      <Particles count={40} color="narrative-purple" behavior="float" />

      <MouseParallax strength={10}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.5 }}
            className="mb-12"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-narrative-yellow text-glow text-handwritten">
              6:47 AM.
            </h2>
          </motion.div>

          {/* Opening text */}
          <div className="mb-16 space-y-4">
            {textLines.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.5 + index * 0.8, duration: 0.8 }}
                className="text-2xl md:text-3xl text-white text-handwritten"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Central illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 3, duration: 1.2, type: "spring" }}
            className="relative my-16 flex justify-center items-center"
          >
            <Tilt3D maxRotation={12}>
              <div className="relative">
                <img
                  src={handPhone}
                  alt="Hand holding glowing phone"
                  className="w-64 md:w-96 h-auto relative z-10"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-narrative-yellow rounded-full blur-3xl opacity-30"
                />
              </div>
            </Tilt3D>

            {/* Neural branches */}
            <motion.img
              src={neuralBranches}
              alt="Neural branches"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={inView ? { opacity: 0.8, scaleY: 1 } : {}}
              transition={{ delay: 4, duration: 1.5 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-32 md:w-48 h-auto opacity-60"
            />
            <motion.img
              src={neuralBranches}
              alt="Neural branches"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={inView ? { opacity: 0.8, scaleY: 1 } : {}}
              transition={{ delay: 4.3, duration: 1.5 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-32 md:w-48 h-auto opacity-60 scale-x-[-1]"
            />
          </motion.div>

          {/* Notifications */}
          <div className="mb-12 space-y-3">
            {notifications.map((notif, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 5 + index * 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-narrative-teal text-handwritten"
              >
                {notif}
              </motion.p>
            ))}
          </div>

          {/* Reflection */}
          <div className="mb-16 space-y-4">
            {reflection.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 6.5 + index * 0.8, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/90 text-handwritten"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Key question */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 8, duration: 1 }}
          >
            <motion.h3
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl md:text-4xl font-semibold text-narrative-yellow text-handwritten"
            >
              ¿Cuándo decidiste que esto fuera lo primero?
            </motion.h3>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 8.5, duration: 1 }}
              className="h-1 bg-narrative-yellow mt-4 mx-auto max-w-md"
            />
          </motion.div>
        </div>
      </MouseParallax>
    </section>
  );
};
