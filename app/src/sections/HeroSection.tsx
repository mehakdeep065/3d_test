import { useEffect, useRef } from 'react';
import { Instagram, Facebook, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleCanvas from '../components/ParticleCanvas';

gsap.registerPlugin(ScrollTrigger);

const polaroids = [
  { img: '/images/polaroid-kyoto.jpg', caption: '3 cities in Japan', rotation: -8 },
  { img: '/images/polaroid-rice.jpg', caption: '10 days', rotation: -3 },
  { img: '/images/polaroid-shrine.jpg', caption: 'gigabytes of photos', rotation: 2 },
  { img: '/images/polaroid-ramen.jpg', caption: 'eat ramen', rotation: 6 },
  { img: '/images/polaroid-shinjuku.jpg', caption: 'enjoy the vibe', rotation: -1 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mountainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const kimonoRef = useRef<HTMLDivElement>(null);
  const polaroidsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // === ENTRANCE TIMELINE ===
      const tl = gsap.timeline({ delay: 0.2 });

      // Background gradient fade
      tl.fromTo(
        section.querySelector('.hero-bg-gradient'),
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );

      // Mountain layer
      tl.fromTo(
        mountainRef.current,
        { scale: 1.1, opacity: 0, filter: 'blur(8px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power3.out' },
        0.2
      );

      // JAPAN text
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'back.out(1.2)' },
        0.4
      );

      // Kimono figure
      tl.fromTo(
        kimonoRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        0.8
      );

      // Polaroid cards
      const cards = polaroidsRef.current?.querySelectorAll('.polaroid-card');
      if (cards) {
        tl.fromTo(
          cards,
          { opacity: 0, scale: 0, rotateZ: -30 },
          {
            opacity: 1,
            scale: 1,
            rotateZ: (i: number) => polaroids[i]?.rotation || 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.5)',
          },
          1
        );
      }

      // === SCROLL-LINKED PARALLAX ===
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      // Mountain moves slowest (0.3x — anchors the scene)
      scrollTl.fromTo(
        mountainRef.current,
        { y: 0, scale: 1 },
        { y: -80, scale: 1.05, ease: 'none' },
        0
      );

      // JAPAN text at medium speed (0.5x)
      scrollTl.fromTo(
        textRef.current,
        { y: 0 },
        { y: -130, ease: 'none' },
        0
      );

      // Kimono stays fixed — visual anchor (no parallax)

      // Polaroids drift left (0.4x)
      scrollTl.fromTo(
        polaroidsRef.current,
        { x: 0, rotateZ: 0 },
        { x: '-15vw', rotateZ: 5, ease: 'none' },
        0
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Background gradient */}
      <div
        className="hero-bg-gradient absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(26, 26, 46, 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(232, 168, 124, 0.15) 0%, transparent 40%),
            linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)
          `,
        }}
      />

      {/* JAPAN Typography — z-[1], sits BEHIND the mountain */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 1,
          willChange: 'transform',
          transformStyle: 'preserve-3d',
          animation: 'text-breathe 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        }}
      >
        <h1
          className="text-[18vw] font-light leading-[0.85] tracking-[-0.04em] select-none"
          style={{
            fontFamily: 'Oswald, sans-serif',
            WebkitTextStroke: '2px #F5E8D3',
            WebkitTextFillColor: 'rgba(245, 232, 211, 0.12)',
            textShadow: '0 0 60px rgba(212, 248, 122, 0.15)',
          }}
        >
          JAPAN
        </h1>
      </div>

      {/* Mountain Layer — z-[2], sits IN FRONT of JAPAN text */}
      {/* Uses gradient mask to make the sky transparent so JAPAN peeks through */}
      <div
        ref={mountainRef}
        className="absolute inset-0"
        style={{
          zIndex: 2,
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/hero-mountain.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            maskImage: `linear-gradient(to bottom,
              rgba(0,0,0,0.15) 0%,
              rgba(0,0,0,0.25) 20%,
              rgba(0,0,0,0.7) 35%,
              rgba(0,0,0,1) 45%,
              rgba(0,0,0,1) 60%,
              rgba(0,0,0,0) 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom,
              rgba(0,0,0,0.15) 0%,
              rgba(0,0,0,0.25) 20%,
              rgba(0,0,0,0.7) 35%,
              rgba(0,0,0,1) 45%,
              rgba(0,0,0,1) 60%,
              rgba(0,0,0,0) 100%)`,
          }}
        />
      </div>

      {/* Particle Overlay */}
      <div className="absolute inset-0" style={{ zIndex: 15 }}>
        <ParticleCanvas count={45} variant="hero" />
      </div>

      {/* Kimono Figure — visual anchor, no parallax */}
      <div
        ref={kimonoRef}
        className="absolute"
        style={{
          right: '5%',
          bottom: '15%',
          zIndex: 4,
          width: '20vw',
          maxWidth: '280px',
          animation: 'ethereal-float 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        }}
      >
        <img
          src="/images/hero-kimono.png"
          alt="Woman in kimono"
          className="w-full h-auto object-contain drop-shadow-2xl"
          loading="eager"
        />
      </div>

      {/* Polaroid Cards — explicit inline sizing as safety net */}
      <div
        ref={polaroidsRef}
        className="absolute flex"
        style={{
          bottom: '8%',
          left: '3%',
          zIndex: 5,
          gap: '12px',
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
      >
        {polaroids.map((p, i) => (
          <div
            key={i}
            className="polaroid-card group cursor-pointer"
            style={{
              '--base-rotation': `${p.rotation}deg`,
              animation: `orbital-drift 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
              animationDelay: `${-i * 2}s`,
            } as React.CSSProperties}
          >
            <div
              className="polaroid-card-inner relative rounded"
              style={{
                '--rotation': `${p.rotation}deg`,
                backgroundColor: '#0A0A0A',
                padding: '8px',
                paddingBottom: '32px',
              } as React.CSSProperties}
            >
              {/* Explicit sizing on the image container */}
              <div
                style={{
                  width: 'clamp(100px, 10vw, 160px)',
                  height: 'clamp(130px, 13vw, 200px)',
                  overflow: 'hidden',
                  borderRadius: '2px',
                }}
              >
                <img
                  src={p.img}
                  alt={p.caption}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  loading="lazy"
                />
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  fontSize: '8px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#888888',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {p.caption}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Book Button near kimono */}
      <div className="absolute" style={{ right: '8%', bottom: '8%', zIndex: 6 }}>
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="rounded-full transition-all duration-300 hover:bg-[#D4F87A] hover:shadow-[0_0_40px_rgba(212,248,122,0.4)] hover:-translate-y-1"
          style={{
            padding: '12px 32px',
            backgroundColor: 'rgba(245, 232, 211, 0.9)',
            backdropFilter: 'blur(8px)',
            color: '#0A0A0A',
            fontSize: '14px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Book
        </button>
      </div>

      {/* Social Icons - Right Edge */}
      <div
        className="absolute flex flex-col"
        style={{
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 6,
          gap: '16px',
        }}
      >
        {[Instagram, Facebook, Send].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className="hover:text-[#D4F87A] transition-all duration-300 hover:-translate-y-1"
            style={{ color: 'rgba(250, 250, 250, 0.4)' }}
          >
            <Icon style={{ width: '16px', height: '16px' }} />
          </a>
        ))}
      </div>

      {/* Carousel Dots */}
      <div
        className="absolute flex"
        style={{
          bottom: '3%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          gap: '8px',
        }}
      >
        {polaroids.map((_, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: `1px solid ${i === 0 ? '#D4F87A' : 'rgba(250,250,250,0.3)'}`,
              backgroundColor: i === 0 ? '#D4F87A' : 'transparent',
              transform: i === 0 ? 'scale(1.25)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  );
}
