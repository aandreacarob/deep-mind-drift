import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import sunflowerField from "@/assets/sunflower-field.jpg";

const MuseumEntrance = () => {
  const navigate = useNavigate();

  const doors = [
    { id: 1, label: "I. LA DERIVA", route: "/seccion-1" },
    { id: 2, label: "II. RAÍCES", route: "/seccion-2" },
    { id: 3, label: "III. CINCO MOMENTOS", route: "/seccion-3" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${sunflowerField})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="h-px w-16 md:w-24 bg-[#F5F5DC]/60" />
            <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl lg:text-7xl text-[#F5F5DC] tracking-wide">
              MUSEO DIGITAL
            </h1>
            <div className="h-px w-16 md:w-24 bg-[#F5F5DC]/60" />
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl lg:text-6xl text-[#F5F5DC] mb-6">
            de la Atención Fragmentada
          </h2>
          <p className="font-['Lora'] text-base md:text-lg lg:text-xl text-[#F5F5DC]/80 max-w-2xl mx-auto leading-relaxed">
            Una experiencia inmersiva sobre cómo<br />
            la tecnología reescribe nuestro cerebro
          </p>
        </motion.div>

        {/* Three Doors */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-12 w-full max-w-5xl"
        >
          {doors.map((door, index) => (
            <motion.button
              key={door.id}
              onClick={() => navigate(door.route)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-b from-[#8B1A1A] to-[#6B0F1A] rounded-lg p-8 md:p-12 shadow-2xl border-4 border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all duration-300"
              style={{
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(212, 175, 55, 0.2)"
              }}
            >
              {/* Door Panel Effect */}
              <div className="absolute inset-4 border-2 border-[#D4AF37]/20 rounded" />
              
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-[#D4AF37]/0 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Door Label */}
              <div className="relative z-10">
                <span className="block font-['Playfair_Display'] text-2xl md:text-3xl text-[#F5F5DC] group-hover:text-[#D4AF37] transition-colors duration-300 tracking-wide">
                  {door.label}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="font-['Lora'] italic text-sm md:text-base text-[#F5F5DC]/60 text-center"
        >
          Recomendamos seguir el recorrido sugerido
        </motion.p>
      </div>
    </div>
  );
};

export default MuseumEntrance;
