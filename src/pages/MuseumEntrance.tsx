import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThreadVineBackground } from "@/components/ThreadVineBackground";
import { CustomCursor } from "@/components/CustomCursor";

const MuseumEntrance = () => {
  const navigate = useNavigate();

  const doors = [
    { id: 1, label: "I. LA DERIVA", route: "/seccion-1" },
    { id: 2, label: "II. RAÍCES", route: "/seccion-2" },
    { id: 3, label: "III. CINCO MOMENTOS", route: "/seccion-3" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <CustomCursor />
      {/* Thread Vine p5 Background */}
      <ThreadVineBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-['Playfair_Display'] text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-4">
              MUSEO DIGITAL
            </h1>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-4xl text-white/90">
            Mil Caminos, Tres Puertas.
          </h2>
        </motion.div>

        {/* Three Doors */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 w-full max-w-6xl"
        >
          {doors.map((door, index) => (
            <motion.div
              key={door.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              className="flex flex-col items-center"
            >
              {/* Door Label */}
              <p className="font-['Playfair_Display'] text-lg md:text-xl text-white/80 mb-4 tracking-wide">
                {door.label}
              </p>
              
              {/* Door */}
              <motion.button
                onClick={() => navigate(door.route)}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-[#F5F5DC] rounded-sm shadow-2xl transition-all duration-300 w-full aspect-[3/4] max-w-[280px] overflow-hidden"
                style={{
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.8)"
                }}
                onMouseEnter={(e) => {
                  // Blue glow for LA DERIVA (door 1), yellow for others
                  if (door.id === 1) {
                    e.currentTarget.style.boxShadow = `
                      0 0 30px rgba(135, 206, 250, 0.6),
                      0 0 50px rgba(100, 149, 237, 0.4),
                      0 0 70px rgba(135, 206, 250, 0.3),
                      0 15px 40px rgba(0, 0, 0, 0.8)
                    `;
                  } else {
                    e.currentTarget.style.boxShadow = `
                      0 0 30px rgba(255, 255, 255, 0.6),
                      0 0 50px rgba(255, 215, 0, 0.4),
                      0 0 70px rgba(255, 192, 203, 0.3),
                      0 15px 40px rgba(0, 0, 0, 0.8)
                    `;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.8)";
                }}
              >
                {/* Glow perlado en hover - capa base */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm"
                  style={
                    door.id === 1 
                      ? {
                          // Blue sky glow for LA DERIVA
                          background: `
                            radial-gradient(circle at 30% 30%, rgba(135, 206, 250, 0.5) 0%, transparent 50%),
                            radial-gradient(circle at 70% 70%, rgba(100, 149, 237, 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(173, 216, 230, 0.3) 0%, transparent 60%),
                            radial-gradient(circle at 20% 80%, rgba(135, 206, 250, 0.3) 0%, transparent 50%)
                          `,
                          boxShadow: `
                            0 0 30px rgba(135, 206, 250, 0.8),
                            0 0 50px rgba(100, 149, 237, 0.6),
                            0 0 70px rgba(173, 216, 230, 0.4),
                            0 0 90px rgba(135, 206, 250, 0.3),
                            inset 0 0 40px rgba(135, 206, 250, 0.15)
                          `,
                          filter: 'blur(2px)',
                        }
                      : {
                          // Original yellow glow for other doors
                          background: `
                            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 70% 70%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(255, 192, 203, 0.2) 0%, transparent 60%),
                            radial-gradient(circle at 20% 80%, rgba(200, 230, 255, 0.2) 0%, transparent 50%)
                          `,
                          boxShadow: `
                            0 0 30px rgba(255, 255, 255, 0.8),
                            0 0 50px rgba(255, 215, 0, 0.6),
                            0 0 70px rgba(255, 192, 203, 0.4),
                            0 0 90px rgba(200, 230, 255, 0.3),
                            inset 0 0 40px rgba(255, 255, 255, 0.15)
                          `,
                          filter: 'blur(2px)',
                        }
                  }
                />
                
                {/* Efecto de brillo animado */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  animate={
                    door.id === 1
                      ? {
                          // Blue animated glow for LA DERIVA
                          background: [
                            'radial-gradient(circle at 0% 0%, rgba(135, 206, 250, 0.4), transparent 50%)',
                            'radial-gradient(circle at 100% 100%, rgba(100, 149, 237, 0.4), transparent 50%)',
                            'radial-gradient(circle at 0% 0%, rgba(135, 206, 250, 0.4), transparent 50%)',
                          ],
                        }
                      : {
                          // Original yellow animated glow for other doors
                          background: [
                            'radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.4), transparent 50%)',
                            'radial-gradient(circle at 100% 100%, rgba(255, 215, 0, 0.4), transparent 50%)',
                            'radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.4), transparent 50%)',
                          ],
                        }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    mixBlendMode: 'overlay',
                  }}
                />
                
                {/* Outer Door Frame */}
                <div className="absolute inset-0 border-[6px] border-[#2a2a2a] rounded-sm z-10" />
              
                {/* Inner Door Panel */}
                <div className="absolute inset-6 border-[3px] border-[#3a3a3a] rounded-sm z-10" />
              
                {/* Door Knob */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3a3a3a] shadow-inner z-20" />
              
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-sm z-10" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MuseumEntrance;
