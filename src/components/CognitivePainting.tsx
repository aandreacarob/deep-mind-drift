import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { SphereData, UserJourney } from "@/pages/Seccion3";

interface CognitivePaintingProps {
  userJourney: UserJourney;
  spheresData: SphereData[];
  onBack: () => void;
}

export const CognitivePainting = ({
  userJourney,
  spheresData,
  onBack,
}: CognitivePaintingProps) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 900;
    canvas.height = 600;

    // Background
    ctx.fillStyle = "#f4f1de";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate color distribution based on time spent
    const totalTime = Object.values(userJourney.timeSpent).reduce((a, b) => a + b, 0);
    const colorDistribution: Array<{ color: string; weight: number }> = [];

    spheresData.forEach((sphere) => {
      if (userJourney.spheresClicked.includes(sphere.id)) {
        const weight = (userJourney.timeSpent[sphere.id] || 0) / totalTime;
        colorDistribution.push({ color: sphere.color, weight });
      }
    });

    // Generate Van Gogh style brushstrokes
    const brushstrokes = 250;
    let strokesDrawn = 0;

    const drawBrushstroke = () => {
      if (strokesDrawn >= brushstrokes) {
        setIsGenerating(false);
        return;
      }

      // Select color based on distribution
      const rand = Math.random();
      let cumulativeWeight = 0;
      let selectedColor = colorDistribution[0].color;

      for (const dist of colorDistribution) {
        cumulativeWeight += dist.weight;
        if (rand <= cumulativeWeight) {
          selectedColor = dist.color;
          break;
        }
      }

      // Random position
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      // Random curve parameters
      const length = 30 + Math.random() * 60;
      const angle = Math.random() * Math.PI * 2;
      const curve = (Math.random() - 0.5) * Math.PI;
      const width = 8 + Math.random() * 12;

      // Draw curved brushstroke
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, 0);

      for (let i = 0; i <= length; i += 5) {
        const progress = i / length;
        const curveOffset = Math.sin(progress * Math.PI) * curve * 20;
        ctx.lineTo(i, curveOffset);
      }

      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.6 + Math.random() * 0.4;
      ctx.stroke();

      ctx.restore();

      strokesDrawn++;
      setTimeout(drawBrushstroke, 20);
    };

    drawBrushstroke();

    // Add signature
    setTimeout(() => {
      ctx.font = "italic 16px serif";
      ctx.fillStyle = "#333";
      ctx.globalAlpha = 0.8;
      ctx.fillText(
        `Tu cognición · ${new Date().toLocaleDateString()}`,
        20,
        canvas.height - 20
      );
    }, brushstrokes * 20 + 500);
  }, [userJourney, spheresData]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `mi-pintura-cognitiva-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #E8DFF5 0%, #f4f1de 50%, #faf8f3 100%)'
    }}>
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-semibold mb-6" style={{
            fontFamily: 'Inter, sans-serif',
            color: '#2D1B3D'
          }}>
            TU DÍA DIGITAL, PINTADO
          </h1>
          <p className="text-lg mb-8" style={{
            fontFamily: 'Crimson Pro, serif',
            color: '#4A3A5A',
            lineHeight: '1.8'
          }}>
            ¿Cómo se vería tu mente<br />
            si la pintara un algoritmo?
          </p>
        </motion.div>

        {/* Canvas and Legend */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center mb-12">
          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              className="rounded-2xl shadow-2xl border-4 border-white/20 max-w-full h-auto"
            />
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl backdrop-blur-sm">
                <div className="text-white text-xl font-semibold">
                  Generando tu pintura...
                </div>
              </div>
            )}
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-8"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(155, 135, 181, 0.3)'
            }}
          >
            <h3 className="text-lg font-semibold mb-6" style={{
              fontFamily: 'Inter, sans-serif',
              color: '#8B6BA5',
              letterSpacing: '0.1em'
            }}>
              LEYENDA
            </h3>
            <div className="space-y-3">
              {spheresData.map((sphere) => (
                <div key={sphere.id} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ 
                      backgroundColor: sphere.color,
                      filter: 'blur(0.3px)',
                      opacity: 0.8
                    }}
                  />
                  <span style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: '14px',
                    color: '#4A3A5A'
                  }}>
                    {sphere.title}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <p className="whitespace-pre-line" style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: '16px',
            color: '#4A3A5A',
            lineHeight: '1.8'
          }}>
            {`Esta es tu huella cognitiva.

Más pinceladas de un color = 
más tiempo en ese patrón.

No hay pinturas buenas o malas.
Solo patrones.

Y los patrones pueden cambiar.`}
          </p>
        </motion.div>

        {/* Download button */}
        {!isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <button
              onClick={handleDownload}
              className="px-10 py-5 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-2xl"
              style={{
                backgroundColor: '#7B6795',
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px'
              }}
            >
              ⬇ Descargar mi pintura
            </button>
            <p className="mt-4" style={{
              fontFamily: 'Crimson Pro, serif',
              fontStyle: 'italic',
              fontSize: '14px',
              color: '#8B6BA5'
            }}>
              Guárdala. Revísala en 6 meses.<br />
              ¿Cambió tu patrón?
            </p>
          </motion.div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="fixed bottom-8 left-8 z-50 px-6 py-3 backdrop-blur-md border rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#1a1a1a',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          🌳 ← Lobby
        </button>
      </div>
    </div>
  );
};
