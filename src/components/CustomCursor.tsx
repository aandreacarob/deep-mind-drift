import { useEffect, useRef } from "react";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Actualización directa e instantánea usando requestAnimationFrame para suavidad
      requestAnimationFrame(() => {
        cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      });
      cursor.style.opacity = '1';
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    // Inicializar posición
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;
    cursor.style.transform = `translate(${initialX - 16}px, ${initialY - 16}px)`;
    cursor.style.opacity = '1';

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        width: '32px',
        height: '32px',
        willChange: 'transform',
        transition: 'opacity 0.2s ease-out',
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
