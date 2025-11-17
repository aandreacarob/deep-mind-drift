import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import leafImage from "@/assets/leaf.png";

interface FallingLeafProps {
  id: number;
  startX: number;
  startY: number;
  rotation: number;
  delay: number;
  duration: number;
  color: string;
  finalX?: number;
  finalY?: number;
  onAnimationComplete?: (x: number, y: number) => void;
}

export const FallingLeaf = ({
  startX,
  startY,
  rotation,
  delay,
  duration,
  color,
  finalX: providedFinalX,
  finalY: providedFinalY,
  onAnimationComplete,
}: FallingLeafProps) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  const {
    endYAbsolute,
    endYRelative,
    finalXAbsolute,
    driftAmount,
  } = useMemo(() => {
    const baseY = typeof window !== "undefined" ? window.innerHeight - 50 : 1000;
    const absoluteY = providedFinalY !== undefined ? providedFinalY : baseY;

    const computedFinalX =
      providedFinalX !== undefined
        ? providedFinalX
        : startX + (Math.random() - 0.5) * 300;

    return {
      endYAbsolute: absoluteY,
      endYRelative: absoluteY - startY,
      finalXAbsolute: computedFinalX,
      driftAmount: computedFinalX - startX,
    };
  }, [startX, startY, providedFinalX, providedFinalY]);

  // More natural rotation - continuous rotation (stable across renders)
  const { totalRotation, finalRotation } = useMemo(() => {
    const speed = 100 + Math.random() * 200; // degrees per second
    const total = (duration / 1000) * speed;
    return {
      totalRotation: total,
      finalRotation: rotation + total,
    };
  }, [duration, rotation]);

  // Final position values (relative to start position)
  const finalX = driftAmount;
  const finalY = endYRelative;
  const finalOpacity = 1;
  const finalScale = 0.7;

  // If animation is complete, render a static element (no framer-motion)
  if (animationComplete) {
    return (
      <div
        className="fixed pointer-events-none z-10"
        style={{
          left: `${finalXAbsolute}px`,
          top: `${endYAbsolute}px`,
          opacity: finalOpacity,
          transform: `rotate(${finalRotation}deg) scale(${finalScale})`,
          transformOrigin: "center center",
        }}
      >
        <img
          src={leafImage}
          alt="Falling leaf"
          className="w-16 h-24 object-contain"
          style={{
            filter:
              "hue-rotate(170deg) saturate(2.2) brightness(1.7) drop-shadow(0 2px 8px rgba(255, 215, 0, 0.4))",
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="fixed pointer-events-none z-10"
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
      }}
      initial={{
        opacity: 0,
        scale: 0.5,
        rotate: rotation,
        x: 0,
        y: 0,
      }}
      animate={animationComplete ? {
        // Static state after animation completes - no more animation
        opacity: finalOpacity,
        scale: finalScale,
        rotate: finalRotation,
        x: finalX,
        y: finalY,
      } : {
        // Animated state while falling
        opacity: [0, 1, 1, 1, 1],
        scale: [0.5, 0.65, 0.7, 0.75, 0.7],
        rotate: [rotation, rotation + totalRotation * 0.25, rotation + totalRotation * 0.5, rotation + totalRotation * 0.75, finalRotation],
        x: [0, driftAmount * 0.2, driftAmount * 0.6, driftAmount * 0.9, driftAmount],
        y: [0, endYRelative * 0.15, endYRelative * 0.5, endYRelative * 0.85, endYRelative],
      }}
      transition={animationComplete ? {
        // No transition when static - instant
        duration: 0,
      } : {
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.25, 0.1, 0.25, 1],
        times: [0, 0.2, 0.5, 0.8, 1],
      }}
      onAnimationComplete={() => {
        // Stop animation when it reaches the bottom
        setAnimationComplete(true);
        // Notify parent of final position for accumulation tracking
        if (onAnimationComplete) {
          onAnimationComplete(finalXAbsolute, endYAbsolute);
        }
      }}
    >
      <img
        src={leafImage}
        alt="Falling leaf"
        className="w-16 h-24 object-contain"
        style={{
          filter: `hue-rotate(170deg) saturate(2.2) brightness(1.7) drop-shadow(0 2px 8px rgba(255, 215, 0, 0.4))`,
        }}
      />
    </motion.div>
  );
};

