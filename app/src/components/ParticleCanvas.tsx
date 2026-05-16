import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  depth: number;
  color: string;
}

interface ParticleCanvasProps {
  count?: number;
  className?: string;
  variant?: 'hero' | 'contact';
}

export default function ParticleCanvas({ count = 50, className = '', variant = 'hero' }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const colors = variant === 'hero'
      ? ['rgba(255, 183, 197, 0.6)', 'rgba(245, 232, 211, 0.5)', 'rgba(255, 240, 245, 0.4)']
      : ['rgba(255, 183, 197, 0.7)', 'rgba(244, 194, 194, 0.6)', 'rgba(255, 240, 245, 0.5)'];

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: variant === 'hero' ? 4 + Math.random() * 8 : 6 + Math.random() * 12,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: 0.3 + Math.random() * 0.7,
      rotation: Math.random() * 360,
      rotationSpeed: 0.5 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.4,
      depth: Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        // Update position
        p.y += p.speedY * (0.5 + p.depth * 0.5);
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.3;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;

        // Draw petal
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity * (0.5 + p.depth * 0.5);

        if (variant === 'contact' && p.size > 10) {
          // 5-petal flower shape for larger contact particles
          const petalLen = p.size * 0.6;
          ctx.fillStyle = p.color;
          for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * 72 * Math.PI) / 180);
            ctx.beginPath();
            ctx.ellipse(0, -petalLen, p.size * 0.25, petalLen, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          // Center
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 240, 245, 0.8)';
          ctx.fill();
        } else {
          // Elliptical petal for hero
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.3, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-canvas ${className}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}
