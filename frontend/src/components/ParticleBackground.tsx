import { useEffect, useRef, useMemo } from "react";
import { usePreviewNavigationContext } from "../contexts/PreviewNavigationContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  homeZ: number;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { current } = usePreviewNavigationContext();
  const currentView = current.view;

  // Settings
  const particleCount = 1024;
  const attraction = 0.04;
  const damping = 0.4;
  const repelStrength = 2;

  // State refs to avoid frequent re-renders
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const angle = useRef(0);

  // Check for reduced motion
  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    const size = window.innerHeight * 0.35;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 2 * size;
      const y = (Math.random() - 0.5) * 2 * size;
      const z = (Math.random() - 0.5) * 2 * size;

      newParticles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        homeX: x,
        homeY: y,
        homeZ: z,
      });
    }
    particles.current = newParticles;
  }, []);

  // Check if we should be visible and animating
  const isVisible = currentView !== "workspace-detail" && !prefersReducedMotion;

  // If the user prefers reduced motion, we don't render at all.
  if (prefersReducedMotion) return null;

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // IMPORTANT: If not visible (e.g. faded out), we stop the loop entirely.
    // This means zero processing power is used for physics or drawing.
    if (!isVisible) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width * 0.95;
      const centerY = height * 0.5;
      const repelRadius = 200;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(centerX, centerY);

      const cosA = Math.cos(angle.current);
      const sinA = Math.sin(angle.current);
      const cosB = Math.cos(angle.current * 0.6);
      const sinB = Math.sin(angle.current * 0.6);

      const mX = mouse.current.x - centerX;
      const mY = mouse.current.y - centerY;
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";

      for (const pt of particles.current) {
        // 1. 3D Rotation to 2D Projecton
        const x1 = pt.homeX * cosA - pt.homeZ * sinA;
        const z1 = pt.homeZ * cosA + pt.homeX * sinA;
        const y2 = pt.homeY * cosB - z1 * sinB;

        const targetX = x1;
        const targetY = y2;

        // 2. Physics
        const dx = targetX - pt.x;
        const dy = targetY - pt.y;

        pt.vx += dx * attraction;
        pt.vy += dy * attraction;

        const rdx = pt.x - mX;
        const rdy = pt.y - mY;
        const distSq = rdx * rdx + rdy * rdy;

        if (distSq < repelRadius * repelRadius && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = repelStrength * (1 - dist / repelRadius);
          pt.vx += (rdx / dist) * force;
          pt.vy += (rdy / dist) * force;
        }

        pt.vx *= damping;
        pt.vy *= damping;
        pt.x += pt.vx;
        pt.y += pt.vy;

        ctx.fillRect(pt.x, pt.y, 2.5, 2.5);
      }
      angle.current += 0.001;

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: isVisible ? 0.8 : 0,
        pointerEvents: "none",
        overflow: "hidden",
        transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};
