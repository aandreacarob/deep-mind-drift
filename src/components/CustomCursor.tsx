import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Inicializar posición al cargar
    if (typeof window !== 'undefined') {
      setMousePosition({ 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      });
    }

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        width: '32px',
        height: '32px',
        left: `${mousePosition.x - 16}px`,
        top: `${mousePosition.y - 16}px`,
        transform: 'translate(0, 0)',
      }}
    >
      {/* Girasol pequeño */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
        }}
      >
        {/* Pétalos del girasol - 8 pétalos alrededor del centro */}
        <ellipse cx="16" cy="6" rx="3" ry="6" fill="#FFD700" />
        <ellipse cx="23" cy="9" rx="3" ry="6" fill="#FFD700" transform="rotate(45 16 16)" />
        <ellipse cx="26" cy="16" rx="3" ry="6" fill="#FFD700" transform="rotate(90 16 16)" />
        <ellipse cx="23" cy="23" rx="3" ry="6" fill="#FFD700" transform="rotate(135 16 16)" />
        <ellipse cx="16" cy="26" rx="3" ry="6" fill="#FFD700" transform="rotate(180 16 16)" />
        <ellipse cx="9" cy="23" rx="3" ry="6" fill="#FFD700" transform="rotate(225 16 16)" />
        <ellipse cx="6" cy="16" rx="3" ry="6" fill="#FFD700" transform="rotate(270 16 16)" />
        <ellipse cx="9" cy="9" rx="3" ry="6" fill="#FFD700" transform="rotate(315 16 16)" />
        
        {/* Centro del girasol */}
        <circle cx="16" cy="16" r="5" fill="#8B4513" />
        <circle cx="16" cy="16" r="3" fill="#A0522D" />
      </svg>
    </div>
  );
};
