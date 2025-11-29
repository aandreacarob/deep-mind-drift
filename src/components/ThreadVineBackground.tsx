import { useEffect, useRef } from "react";
import p5 from "p5";

interface Cursor {
  anguloPrincipal: number;
  tiempoRuidoRadio: number;
  tiempoRuidoAngulo: number;
  prevX: number | null;
  prevY: number | null;
  colorOffset: number;
  outlierPhase: number;
  outlierIntensity: number;
  isOutlier: boolean;
}

export const ThreadVineBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const numCursors = 90; // Más cursores
      const cursors: Cursor[] = [];
      let globalRotation = 0; // Rotación global del frame
      let mouseInfluenceRadius = 0; // Radio de influencia del mouse
      let targetMouseRadius = 0; // Radio objetivo para suavizar

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(containerRef.current!);
        // Reduce pixel density on mobile for better performance
        const isMobile = window.innerWidth < 768;
        p.pixelDensity(isMobile ? 1 : (window.devicePixelRatio || 1));
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(0);
        p.noFill();
        p.strokeWeight(1);

        // Initialize multiple cursors with different starting parameters
        for (let i = 0; i < numCursors; i++) {
          const isOutlier = p.random() < 0.25; // 15% de cursores son outliers
          cursors.push({
            anguloPrincipal: (p.TWO_PI / numCursors) * i,
            tiempoRuidoRadio: p.random(1000),
            tiempoRuidoAngulo: p.random(1000, 2000),
            prevX: null,
            prevY: null,
            colorOffset: p.random(360),
            outlierPhase: p.random(p.TWO_PI),
            outlierIntensity: isOutlier ? p.random(0.8, 1.5) : 0,
            isOutlier: isOutlier,
          });
        }
      };

      p.mouseMoved = () => {
        // Activar influencia del mouse cuando se mueve
        const minDim = Math.min(p.width, p.height);
        targetMouseRadius = minDim * 0.25;
        return false; // Permite que otros eventos se propaguen
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // Reset background on resize
        p.background(0);
        // Reset previous positions
        cursors.forEach(cursor => {
          cursor.prevX = null;
          cursor.prevY = null;
        });
      };

      p.draw = () => {
        // Fade ajustado para que los trazos no queden grises por mucho tiempo
        p.push();
        p.noStroke();
        p.fill(0, 0, 0, 4); // Aumentado de 1.5 a 4 para que desaparezcan más rápido
        p.rect(0, 0, p.width, p.height);
        p.pop();

        const minDim = Math.min(p.width, p.height);
        const centroX = p.width / 2;
        const centroY = p.height / 2 - minDim * 0.04;
        const radioBase = minDim * 0.48; // Aumentado aún más: de 0.42 a 0.48 (circunferencia MUCHO más grande)

        // Actualizar rotación global suave
        globalRotation += 0.0008; // Rotación muy suave

        // Suavizar el radio de influencia del mouse
        mouseInfluenceRadius = p.lerp(mouseInfluenceRadius, targetMouseRadius, 0.1);
        // Decrementar gradualmente cuando el mouse no se mueve
        targetMouseRadius *= 0.95;

        // Draw each cursor
        for (const cursor of cursors) {
          // PASO A: Calcular el Radio con ruido más delgado (banda más estrecha)
          const oscilacionRadio = p.map(
            p.noise(cursor.tiempoRuidoRadio),
            0,
            1,
            -minDim * 0.10, // Reducido de 0.18 a 0.10 para anillo más delgado
            minDim * 0.10
          );
          
          // Añadir movimiento circular adicional al radio (epicycles) - reducidos para mantener banda delgada
          const circuloSecundario = Math.sin(cursor.anguloPrincipal * 3.5) * minDim * 0.025;
          const circuloTerciario = Math.cos(cursor.anguloPrincipal * 7.2) * minDim * 0.015;
          
          // OUTLIERS: Algunos cursores se escapan ocasionalmente
          let outlierOffset = 0;
          if (cursor.isOutlier) {
            cursor.outlierPhase += 0.008;
            // Función de onda que hace que el cursor se escape y regrese
            const escapeWave = Math.sin(cursor.outlierPhase) * Math.abs(Math.sin(cursor.outlierPhase * 0.5));
            outlierOffset = escapeWave * minDim * 0.25 * cursor.outlierIntensity;
          }
          
          const radioActual = radioBase + oscilacionRadio + circuloSecundario + circuloTerciario + outlierOffset;

          // PASO B: Calcular el Ángulo con MÁS garabato
          const oscilacionAngulo = p.map(
            p.noise(cursor.tiempoRuidoAngulo),
            0,
            1,
            -1.2, // Aumentado de 0.8 a 1.2 para más caos
            1.2
          );
          
          // Añadir oscilaciones circulares adicionales al ángulo
          const anguloCircular1 = Math.sin(cursor.tiempoRuidoAngulo * 0.15) * 0.6;
          const anguloCircular2 = Math.cos(cursor.tiempoRuidoRadio * 0.12) * 0.4;
          
          const anguloLocal = cursor.anguloPrincipal + oscilacionAngulo + anguloCircular1 + anguloCircular2;

          // PASO C: Convertir Coordenadas Polares a Cartesianas (sin rotación aún)
          const xLocal = radioActual * Math.cos(anguloLocal);
          const yLocal = radioActual * Math.sin(anguloLocal);
          
          // Aplicar rotación global
          const cosR = Math.cos(globalRotation);
          const sinR = Math.sin(globalRotation);
          const xRotated = xLocal * cosR - yLocal * sinR;
          const yRotated = xLocal * sinR + yLocal * cosR;
          
          // Posición antes de la influencia del mouse
          let x = centroX + xRotated;
          let y = centroY + yRotated;
          
          // INTERACCIÓN CON EL MOUSE: Los cursores se alejan del mouse
          if (mouseInfluenceRadius > 0) {
            const dx = x - p.mouseX;
            const dy = y - p.mouseY;
            const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
            
            if (distanceToMouse < mouseInfluenceRadius && distanceToMouse > 0) {
              // Calcular fuerza de repulsión (más fuerte cerca del mouse)
              const force = p.map(distanceToMouse, 0, mouseInfluenceRadius, 1, 0);
              const pushStrength = force * force * minDim * 0.15; // Efecto cuadrático para más impacto
              
              // Aplicar desplazamiento en dirección opuesta al mouse
              const angle = Math.atan2(dy, dx);
              x += Math.cos(angle) * pushStrength;
              y += Math.sin(angle) * pushStrength;
            }
          }

          // PASO D: Dibujar
          if (cursor.prevX !== null && cursor.prevY !== null) {
            // Color cycling based on angle and noise
            cursor.colorOffset = (cursor.colorOffset + 0.6) % 360;
            const hue = cursor.colorOffset;
            const saturation = 65 + p.map(p.noise(cursor.tiempoRuidoRadio * 0.5), 0, 1, 0, 25);
            const brightness = 90 + p.map(p.noise(cursor.tiempoRuidoAngulo * 0.5), 0, 1, -10, 10);
            const alpha = 50 + p.map(p.noise(cursor.tiempoRuidoRadio + 500), 0, 1, 0, 30);

            p.stroke(hue, saturation, brightness, alpha);
            p.strokeWeight(0.8 + p.noise(cursor.tiempoRuidoRadio * 2) * 0.7);
            
            // Draw line from previous position to current
            p.line(cursor.prevX, cursor.prevY, x, y);

            // Más círculos para más densidad
            if (p.frameCount % 2 === 0) {
              const circleSize = 5 + p.noise(cursor.tiempoRuidoRadio * 3) * 10;
              p.stroke(hue, saturation * 0.8, brightness, alpha * 0.65);
              p.strokeWeight(0.6);
              p.circle(x, y, circleSize);
            }
            
            // Círculos adicionales ocasionales
            if (p.frameCount % 5 === 0) {
              const circleSize2 = 8 + p.noise(cursor.tiempoRuidoAngulo * 2) * 12;
              p.stroke(hue, saturation * 0.6, brightness, alpha * 0.4);
              p.strokeWeight(0.4);
              p.circle(x, y, circleSize2);
            }
          }

          // Update previous position
          cursor.prevX = x;
          cursor.prevY = y;

          // PASO E: Avanzar en el Tiempo con MÁS velocidad y variación
          cursor.anguloPrincipal += 0.022 + p.noise(cursor.tiempoRuidoRadio * 0.1) * 0.015; // Más rápido y variable
          cursor.tiempoRuidoRadio += 0.035; // Aumentado de 0.025 a 0.035
          cursor.tiempoRuidoAngulo += 0.042; // Aumentado de 0.03 a 0.042
        }
      };
    };

    instanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      instanceRef.current?.remove();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-95"
      style={{ 
        width: '100vw', 
        height: '100vh',
        overflow: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};

