'use client';

import React, { useEffect, useRef } from 'react';

const SYMBOLS = [
  '~', '}', ')', '!', '>', '#', '<', '$', '@', '-', '+', '_', ']', 
  '[', '{', '}', '*', '^', '?', ':', ';', '%', '&', '|', '=', '/'
];

export default function InteractiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track mouse coordinates and window status
  const mouseRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    inWindow: false,
    activeIntensity: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.inWindow = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.inWindow = false;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      mouseRef.current.inWindow = true;
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      // Initialize position on first entry to avoid jumping
      if (mouseRef.current.currentX === 0 && mouseRef.current.currentY === 0) {
        mouseRef.current.currentX = e.clientX;
        mouseRef.current.currentY = e.clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Grid config
    const spacing = 28; // Grid gap size
    const spotlightRadius = 140; // Reveal radius

    // Render loop
    let animationId: number;

    const render = () => {
      const mouse = mouseRef.current;

      // Smooth mouse easing
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.12;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.12;

      // Fade spotlight intensity in/out based on mouse presence
      const targetIntensity = mouse.inWindow ? 1 : 0;
      mouse.activeIntensity += (targetIntensity - mouse.activeIntensity) * 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cx = c * spacing;
          const cy = r * spacing;

          // Distance to eased cursor position
          const dx = cx - mouse.currentX;
          const dy = cy - mouse.currentY;
          const dist = Math.hypot(dx, dy);

          if (dist < spotlightRadius && mouse.activeIntensity > 0.01) {
            // Morph into glowing code character
            const rawFactor = 1 - dist / spotlightRadius;
            const factor = rawFactor * mouse.activeIntensity; // Overall transparency

            // Seed a stable pseudo-random symbol based on coordinate hash
            const seed = Math.abs(Math.sin(c * 12.9898 + r * 78.233)) * 1000;
            const symbol = SYMBOLS[Math.floor(seed % SYMBOLS.length)];

            ctx.save();
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Transition color from light-zinc to glowing emerald green
            const rVal = Math.round(161 - (161 - 16) * factor); // From 161 (zinc-400) to 16 (emerald-500)
            const gVal = Math.round(161 - (161 - 185) * factor); // From 161 to 185
            const bVal = Math.round(170 - (170 - 129) * factor); // From 170 to 129
            
            ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${0.15 + factor * 0.65})`;
            
            // Add subtle shadow glow
            if (factor > 0.3) {
              ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
              ctx.shadowBlur = factor * 8;
            }

            ctx.fillText(symbol, cx, cy);
            ctx.restore();
          } else {
            // Standard faint background dot
            ctx.beginPath();
            ctx.arc(cx, cy, 1, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(63, 63, 70, 0.15)'; // Zinc-700/800 at low opacity
            ctx.fill();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none block z-0"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
