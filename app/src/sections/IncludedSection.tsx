import { useEffect, useRef } from 'react';
import { Users, Plane, Bus, Building } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    icon: Users,
    title: 'GUIDES',
    description: '2 awesome guides who know everything about Japan!',
  },
  {
    icon: Plane,
    title: 'FLIGHTS',
    description: 'Routes: Moscow — Osaka, Tokyo — Moscow',
  },
  {
    icon: Bus,
    title: 'TRANSFERS',
    description: 'From the airport to the hotels',
  },
  {
    icon: Building,
    title: 'HOTELS',
    description: 'Comfortable accommodation, 2 people per room (breakfasts included)',
  },
];

export default function IncludedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading slide in
      gsap.fromTo(
        headingRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Hairline grow
      gsap.fromTo(
        lineRef.current,
        { width: 0 },
        {
          width: '100%',
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards 3D flip entrance
      const cardEls = cardsRef.current?.querySelectorAll('.glass-card');
      if (cardEls) {
        cardEls.forEach((card, i) => {
          gsap.fromTo(
            card,
            {
              rotateY: i % 2 === 0 ? -90 : 90,
              opacity: 0,
            },
            {
              rotateY: 0,
              opacity: 1,
              duration: 0.7,
              delay: 0.3 + i * 0.15,
              ease: 'back.out(1.2)',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="included"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 lg:mb-16">
          <h2
            className="text-4xl sm:text-5xl lg:text-7xl xl:text-[120px] font-normal uppercase tracking-[0.15em] text-[#FAFAFA] mb-4"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            WHAT&apos;S INCLUDED
          </h2>
          <div ref={lineRef} className="h-px bg-[#FAFAFA]/20" style={{ width: 0 }} />
        </div>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 gap-6 lg:gap-8"
          style={{ perspective: '800px' }}
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="glass-card holo-border group relative p-6 lg:p-8 rounded-xl transition-all duration-400 cursor-default hover:-translate-y-1"
                style={{
                  transformStyle: 'preserve-3d',
                  animation: `card-breathe 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
                  animationDelay: `${-i * 1.5}s`,
                }}
              >
                {/* Icon */}
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[10deg]">
                  <Icon
                    className="w-6 h-6 text-[#D4F87A]"
                    style={{ animation: `icon-pulse 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite` }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="text-lg lg:text-xl uppercase tracking-[0.2em] text-[#FAFAFA] mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm lg:text-base text-[#FAFAFA]/70 leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {card.description}
                </p>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(212, 248, 122, 0.2)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
