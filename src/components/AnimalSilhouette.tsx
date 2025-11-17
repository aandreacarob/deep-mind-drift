import { motion } from "framer-motion";

interface AnimalSilhouetteProps {
  animalType: string;
  colors: string[];
  size?: number;
}

export const AnimalSilhouette = ({ animalType, colors, size = 400 }: AnimalSilhouetteProps) => {
  const getGradientId = (index: number) => `gradient-${animalType}-${index}`;

  // Helper to create gradient
  const createGradient = (id: string, color1: string, color2: string) => (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={color1} stopOpacity="1" />
      <stop offset="100%" stopColor={color2} stopOpacity="1" />
    </linearGradient>
  );

  const renderAnimal = () => {
    switch (animalType) {
      case "fragmentado": // Mariposa
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
            <defs>
              {createGradient(getGradientId(0), colors[0] || "#F5A623", colors[1] || "#E74C3C")}
              {createGradient(getGradientId(1), colors[1] || "#E74C3C", colors[2] || "#7ED321")}
            </defs>
            {/* Cuerpo */}
            <ellipse cx="100" cy="100" rx="8" ry="35" fill={colors[0] || "#4A3A5A"} />
            {/* Ala superior izquierda */}
            <path d="M 92 80 Q 50 50 40 70 Q 35 85 50 95 Q 70 100 92 90 Z" 
                  fill={`url(#${getGradientId(0)})`} />
            {/* Ala inferior izquierda */}
            <path d="M 92 110 Q 50 150 40 130 Q 35 115 50 105 Q 70 100 92 110 Z" 
                  fill={`url(#${getGradientId(1)})`} />
            {/* Ala superior derecha */}
            <path d="M 108 80 Q 150 50 160 70 Q 165 85 150 95 Q 130 100 108 90 Z" 
                  fill={`url(#${getGradientId(0)})`} />
            {/* Ala inferior derecha */}
            <path d="M 108 110 Q 150 150 160 130 Q 165 115 150 105 Q 130 100 108 110 Z" 
                  fill={`url(#${getGradientId(1)})`} />
            {/* Antenas */}
            <line x1="95" y1="65" x2="90" y2="50" stroke={colors[0] || "#4A3A5A"} strokeWidth="2" strokeLinecap="round" />
            <line x1="105" y1="65" x2="110" y2="50" stroke={colors[0] || "#4A3A5A"} strokeWidth="2" strokeLinecap="round" />
            <circle cx="90" cy="48" r="3" fill={colors[0] || "#4A3A5A"} />
            <circle cx="110" cy="48" r="3" fill={colors[0] || "#4A3A5A"} />
          </svg>
        );

      case "profundo": // Búho
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
            <defs>
              {createGradient(getGradientId(0), colors[0] || "#4A90E2", colors[1] || "#7ED321")}
            </defs>
            {/* Cuerpo */}
            <ellipse cx="100" cy="120" rx="45" ry="55" fill={`url(#${getGradientId(0)})`} />
            {/* Cabeza */}
            <circle cx="100" cy="70" r="40" fill={colors[0] || "#4A90E2"} />
            {/* Ojos */}
            <circle cx="85" cy="70" r="12" fill="white" />
            <circle cx="115" cy="70" r="12" fill="white" />
            <circle cx="85" cy="70" r="6" fill="#2C3E50" />
            <circle cx="115" cy="70" r="6" fill="#2C3E50" />
            {/* Pico */}
            <path d="M 100 75 L 95 85 L 105 85 Z" fill={colors[1] || "#E74C3C"} />
            {/* Orejas */}
            <path d="M 65 50 L 70 35 L 80 50 Z" fill={colors[0] || "#4A90E2"} />
            <path d="M 135 50 L 130 35 L 120 50 Z" fill={colors[0] || "#4A90E2"} />
            {/* Alas */}
            <ellipse cx="60" cy="120" rx="15" ry="40" fill={colors[1] || "#7ED321"} opacity="0.8" />
            <ellipse cx="140" cy="120" rx="15" ry="40" fill={colors[1] || "#7ED321"} opacity="0.8" />
            {/* Cola */}
            <path d="M 90 165 L 100 175 L 110 165" fill="none" stroke={colors[0] || "#4A90E2"} strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case "delegado": // Pulpo
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
            <defs>
              {createGradient(getGradientId(0), colors[0] || "#E74C3C", colors[1] || "#BD10E0")}
            </defs>
            {/* Cabeza */}
            <ellipse cx="100" cy="70" rx="40" ry="35" fill={`url(#${getGradientId(0)})`} />
            {/* Ojos */}
            <circle cx="90" cy="65" r="8" fill="white" />
            <circle cx="110" cy="65" r="8" fill="white" />
            <circle cx="90" cy="65" r="4" fill="#2C3E50" />
            <circle cx="110" cy="65" r="4" fill="#2C3E50" />
            {/* Tentáculos */}
            <path d="M 70 90 Q 50 120 45 160" fill="none" stroke={colors[0] || "#E74C3C"} strokeWidth="12" strokeLinecap="round" />
            <path d="M 80 95 Q 65 130 60 170" fill="none" stroke={colors[1] || "#BD10E0"} strokeWidth="12" strokeLinecap="round" />
            <path d="M 90 100 Q 85 140 85 180" fill="none" stroke={colors[0] || "#E74C3C"} strokeWidth="12" strokeLinecap="round" />
            <path d="M 100 100 Q 100 145 100 185" fill="none" stroke={colors[1] || "#BD10E0"} strokeWidth="12" strokeLinecap="round" />
            <path d="M 110 100 Q 115 140 115 180" fill="none" stroke={colors[0] || "#E74C3C"} strokeWidth="12" strokeLinecap="round" />
            <path d="M 120 95 Q 135 130 140 170" fill="none" stroke={colors[1] || "#BD10E0"} strokeWidth="12" strokeLinecap="round" />
            <path d="M 130 90 Q 150 120 155 160" fill="none" stroke={colors[0] || "#E74C3C"} strokeWidth="12" strokeLinecap="round" />
          </svg>
        );

      case "aumentado": // Águila
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
            <defs>
              {createGradient(getGradientId(0), colors[0] || "#7ED321", colors[1] || "#F5A623")}
              {createGradient(getGradientId(1), colors[1] || "#F5A623", colors[2] || "#4A90E2")}
            </defs>
            {/* Cuerpo */}
            <ellipse cx="100" cy="110" rx="25" ry="40" fill={`url(#${getGradientId(0)})`} />
            {/* Cabeza */}
            <circle cx="100" cy="60" r="20" fill={colors[0] || "#7ED321"} />
            {/* Pico */}
            <path d="M 100 60 L 110 65 L 100 70 Z" fill={colors[1] || "#F5A623"} />
            {/* Ojo */}
            <circle cx="95" cy="58" r="4" fill="white" />
            <circle cx="95" cy="58" r="2" fill="#2C3E50" />
            {/* Ala izquierda */}
            <path d="M 75 100 Q 30 90 10 100 Q 20 110 40 115 Q 60 120 75 120 Z" 
                  fill={`url(#${getGradientId(1)})`} />
            {/* Ala derecha */}
            <path d="M 125 100 Q 170 90 190 100 Q 180 110 160 115 Q 140 120 125 120 Z" 
                  fill={`url(#${getGradientId(1)})`} />
            {/* Cola */}
            <path d="M 90 145 L 100 165 L 110 145" fill="none" stroke={colors[0] || "#7ED321"} strokeWidth="10" strokeLinecap="round" />
          </svg>
        );

      case "hibrido": // Camaleón
        return (
          <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
            <defs>
              {createGradient(getGradientId(0), colors[0] || "#BD10E0", colors[1] || "#7ED321")}
              {createGradient(getGradientId(1), colors[1] || "#7ED321", colors[2] || "#4A90E2")}
            </defs>
            {/* Cuerpo curvado */}
            <path d="M 60 80 Q 80 70 100 75 Q 130 80 150 95 Q 160 110 155 130" 
                  fill="none" stroke={`url(#${getGradientId(0)})`} strokeWidth="35" strokeLinecap="round" />
            {/* Cabeza */}
            <ellipse cx="55" cy="75" rx="18" ry="15" fill={colors[0] || "#BD10E0"} />
            {/* Ojo */}
            <circle cx="50" cy="72" r="8" fill="white" />
            <circle cx="50" cy="72" r="4" fill="#2C3E50" />
            {/* Cresta */}
            <path d="M 60 65 L 65 55 L 58 60" fill={colors[0] || "#BD10E0"} />
            {/* Patas */}
            <line x1="90" y1="85" x2="85" y2="105" stroke={colors[1] || "#7ED321"} strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="90" x2="120" y2="110" stroke={colors[1] || "#7ED321"} strokeWidth="6" strokeLinecap="round" />
            <line x1="145" y1="105" x2="150" y2="125" stroke={colors[1] || "#7ED321"} strokeWidth="6" strokeLinecap="round" />
            {/* Cola enrollada */}
            <path d="M 155 130 Q 165 145 160 160 Q 155 170 145 168 Q 140 166 142 158" 
                  fill="none" stroke={`url(#${getGradientId(1)})`} strokeWidth="15" strokeLinecap="round" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center justify-center"
    >
      {renderAnimal()}
    </motion.div>
  );
};

