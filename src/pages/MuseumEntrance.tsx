import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MuseumEntrance = () => {
  const navigate = useNavigate();
  const [circles, setCircles] = useState<Array<{ x: number; y: number; size: number; color: string; delay: number }>>([]);

  const doors = [
    { id: 1, label: "I. LA DERIVA", route: "/seccion-1" },
    { id: 2, label: "II. RAÍCES", route: "/seccion-2" },
    { id: 3, label: "III. CINCO MOMENTOS", route: "/seccion-3" },
  ];

  useEffect(() => {
    // Generate random colorful circles for the wreath effect
    const colors = [
      'rgba(255, 100, 150, 0.6)',
      'rgba(100, 200, 255, 0.6)',
      'rgba(150, 255, 100, 0.6)',
      'rgba(255, 200, 100, 0.6)',
      'rgba(200, 100, 255, 0.6)',
      'rgba(255, 150, 100, 0.6)',
    ];

    const newCircles = [];
    for (let i = 0; i < 150; i++) {
      // Create wreath pattern - circles around the edges
      const angle = (Math.PI * 2 * i) / 150;
      const radiusVariation = Math.random() * 200 + 250;
      const centerX = 50;
      const centerY = 50;
      
      newCircles.push({
        x: centerX + Math.cos(angle) * radiusVariation + (Math.random() - 0.5) * 150,
        y: centerY + Math.sin(angle) * radiusVariation + (Math.random() - 0.5) * 150,
        size: Math.random() * 80 + 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
      });
    }
    setCircles(newCircles);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Colorful Circles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {circles.map((circle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border-2 opacity-70"
            style={{
              left: `${circle.x}%`,
              top: `${circle.y}%`,
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              borderColor: circle.color,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, delay: circle.delay }}
          />
        ))}
      </div>

      {/* Decorative Sparkle Bottom Right */}
      <motion.div
        className="fixed bottom-8 right-8 w-12 h-12"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.6, rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#888" />
        </svg>
      </motion.div>

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
                className="group relative bg-[#F5F5DC] rounded-sm shadow-2xl transition-all duration-300 w-full aspect-[3/4] max-w-[280px]"
                style={{
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.8)"
                }}
              >
                {/* Outer Door Frame */}
                <div className="absolute inset-0 border-[6px] border-[#2a2a2a] rounded-sm" />
                
                {/* Inner Door Panel */}
                <div className="absolute inset-6 border-[3px] border-[#3a3a3a] rounded-sm" />
                
                {/* Door Knobs */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3a3a3a] shadow-inner" />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3a3a3a] shadow-inner" />
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-sm" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MuseumEntrance;
