import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Top slim route loading progress bar (Vercel/YouTube style)
 * Triggers automatically on route/pathname changes with glowing gradient and smooth easing.
 */
export default function RouteProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    // When route changes, kick off progress animation
    clearAllTimers();
    setIsVisible(true);
    setProgress(25);

    const t1 = setTimeout(() => {
      setProgress(65);
    }, 80);

    const t2 = setTimeout(() => {
      setProgress(90);
    }, 180);

    const t3 = setTimeout(() => {
      setProgress(100);
    }, 280);

    const t4 = setTimeout(() => {
      setIsVisible(false);
    }, 450);

    const t5 = setTimeout(() => {
      setProgress(0);
    }, 600);

    timersRef.current = [t1, t2, t3, t4, t5];

    return () => {
      clearAllTimers();
    };
  }, [location.pathname, location.search]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Progress track fill */}
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '120ms' : '200ms',
        }}
      />
      {/* Leading edge glow bead */}
      <div
        className="absolute top-0 h-full w-24 bg-white/40 blur-xs transition-all ease-out pointer-events-none"
        style={{
          left: `calc(${progress}% - 96px)`,
          opacity: progress > 10 && progress < 100 ? 1 : 0,
        }}
      />
    </div>
  );
}
