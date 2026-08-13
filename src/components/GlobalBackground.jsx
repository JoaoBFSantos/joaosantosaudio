import { useEffect, useRef, useState } from 'react';

export default function GlobalBackground({ intensity = 1 }) {
  const backgroundRef = useRef(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const updateFlags = () => {
      setIsReducedMotion(motionQuery.matches);
      setIsCoarsePointer(pointerQuery.matches);
    };

    updateFlags();
    motionQuery.addEventListener('change', updateFlags);
    pointerQuery.addEventListener('change', updateFlags);
    return () => {
      motionQuery.removeEventListener('change', updateFlags);
      pointerQuery.removeEventListener('change', updateFlags);
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion || isCoarsePointer) return;
    let animationFrame = 0;
    const handleMouseMove = (event) => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        backgroundRef.current?.style.setProperty('--glow-x', `${x * 100}%`);
        backgroundRef.current?.style.setProperty('--glow-y', `${y * 100}%`);
        backgroundRef.current?.style.setProperty('--glow-x-secondary', `${100 - x * 50}%`);
        backgroundRef.current?.style.setProperty('--glow-y-secondary', `${100 - y * 50}%`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [isReducedMotion, isCoarsePointer]);

  useEffect(() => {
    if (isReducedMotion || !isCoarsePointer) return;

    let animationFrame = 0;
    let lastPaint = 0;
    let currentX = 50;
    let currentY = 45;
    let touchX = 50;
    let touchY = 45;
    let touchActiveUntil = 0;

    const handleTouch = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchX = (touch.clientX / window.innerWidth) * 100;
      touchY = (touch.clientY / window.innerHeight) * 100;
      touchActiveUntil = performance.now() + 1600;
    };

    const animateGlow = (timestamp) => {
      if (!document.hidden && timestamp - lastPaint >= 50) {
        lastPaint = timestamp;
        const followingTouch = timestamp < touchActiveUntil;
        const targetX = followingTouch
          ? touchX
          : 50 + Math.sin(timestamp / 7600) * 30;
        const targetY = followingTouch
          ? touchY
          : 45 + Math.sin(timestamp / 9800 + 1.35) * 27;
        const easing = followingTouch ? 0.2 : 0.045;

        currentX += (targetX - currentX) * easing;
        currentY += (targetY - currentY) * easing;
        backgroundRef.current?.style.setProperty('--glow-x', `${currentX}%`);
        backgroundRef.current?.style.setProperty('--glow-y', `${currentY}%`);
        backgroundRef.current?.style.setProperty('--glow-x-secondary', `${100 - currentX * 0.55}%`);
        backgroundRef.current?.style.setProperty('--glow-y-secondary', `${100 - currentY * 0.55}%`);
      }
      animationFrame = window.requestAnimationFrame(animateGlow);
    };

    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    animationFrame = window.requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [isReducedMotion, isCoarsePointer]);

  const glowOpacity = isCoarsePointer ? 0.82 : 1;
  const greenAlpha = 0.09 * glowOpacity * intensity;
  const purpleAlpha = 0.06 * glowOpacity * intensity;
  const vignetteAlpha = (isCoarsePointer || isReducedMotion ? 0.02 : 0.03) * intensity;
  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-x-secondary': '50%',
        '--glow-y-secondary': '50%',
        background: `
          radial-gradient(120% 90% at 50% 0%, rgba(255, 255, 255, ${vignetteAlpha}) 0%, transparent 60%),
          radial-gradient(ellipse 80% 60% at var(--glow-x) var(--glow-y), rgba(0, 255, 178, ${greenAlpha}) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at var(--glow-x-secondary) var(--glow-y-secondary), rgba(137, 117, 255, ${purpleAlpha}) 0%, transparent 70%)
        `
      }}
    />
  );
}
