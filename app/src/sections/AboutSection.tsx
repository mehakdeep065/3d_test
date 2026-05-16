import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    days: 'Days 1-3',
    city: 'Osaka',
    photos: [
      { src: '/images/timeline-osaka-castle.jpg', alt: 'Osaka Castle', offset: -1 },
      { src: '/images/timeline-osaka-city.jpg', alt: 'Osaka City', offset: 1 },
    ],
  },
  {
    days: 'Days 4-6',
    city: 'Kyoto',
    photos: [
      { src: '/images/timeline-kyoto-pagoda.jpg', alt: 'Kyoto Pagoda', offset: 1 },
      { src: '/images/timeline-kyoto-shrine.jpg', alt: 'Kyoto Shrine', offset: -1 },
    ],
  },
  {
    days: 'Days 7-10',
    city: 'Tokyo',
    photos: [
      { src: '/images/timeline-tokyo-shibuya.jpg', alt: 'Tokyo Shibuya', offset: -1 },
      { src: '/images/timeline-tokyo-street.jpg', alt: 'Tokyo Street', offset: 1 },
    ],
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Hairline rules grow
      gsap.fromTo(
        [lineLeftRef.current, lineRightRef.current],
        { width: 0 },
        {
          width: '100%',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Body text fade in
      const textLines = textRef.current?.querySelectorAll('.text-line');
      if (textLines) {
        gsap.fromTo(
          textLines,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Highlight glow activation
      const highlights = section.querySelectorAll('.text-highlight');
      highlights.forEach((h) => {
        gsap.fromTo(
          h,
          { textShadow: '0 0 0px rgba(212, 248, 122, 0)' },
          {
            textShadow: '0 0 20px rgba(212, 248, 122, 0.5)',
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: h,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // ===== TIMELINE STAGGER REVEAL =====
      // Each city cluster reveals sequentially with 200ms stagger
      const nodes = timelineRef.current?.querySelectorAll('.timeline-node');
      nodes?.forEach((node, i) => {
        // Start each node hidden
        gsap.set(node, { opacity: 0, y: 40 });

        // Create a per-node timeline with stagger delay
        const nodeTl = gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.2, // 200ms stagger between cities
        });

        // 1. Whole node fades in (editorial page-turn feel)
        nodeTl.to(node, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        });

        const circle = node.querySelector('.node-circle');
        const label = node.querySelector('.node-label');
        const photos = node.querySelectorAll('.cluster-photo');

        // 2. Circle pulses in
        nodeTl.fromTo(
          circle,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
          '-=0.5'
        );

        // 3. Label slides in
        nodeTl.fromTo(
          label,
          { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );

        // 4. Photos materialize
        nodeTl.fromTo(
          photos,
          {
            opacity: 0,
            x: (_j: number) => (_j === 0 ? -60 : 60),
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
          },
          '-=0.3'
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Heading with hairlines */}
        <div className="flex items-center gap-6 mb-16 lg:mb-24">
          <div ref={lineLeftRef} className="h-px bg-[#FAFAFA]/20 flex-1" style={{ width: 0 }} />
          <h2
            ref={headingRef}
            className="text-4xl sm:text-5xl lg:text-7xl xl:text-[120px] font-normal uppercase tracking-[0.15em] text-[#FAFAFA] whitespace-nowrap"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            ABOUT THE TOUR
          </h2>
          <div ref={lineRightRef} className="h-px bg-[#FAFAFA]/20 flex-1" style={{ width: 0 }} />
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Text */}
          <div ref={textRef} className="space-y-6">
            <p className="text-line text-lg lg:text-xl text-[#FAFAFA]/90 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              We&apos;ve planned a simple and convenient 10-day itinerary for your trip to Japan. You&apos;ll visit three cities:{' '}
              <span className="text-highlight text-[#D4F87A] font-medium"> Osaka, Kyoto, and Tokyo</span>.
            </p>
            <p className="text-line text-lg lg:text-xl text-[#FAFAFA]/90 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              No need to worry about routes, schedules, or finding places — everything is already organized. We&apos;ll show you where to go, what to see, and where to eat, so you can simply{' '}
              <span className="text-highlight text-[#D4F87A] font-medium">enjoy the journey</span>.
            </p>
          </div>

          {/* Right - Timeline */}
          <div ref={timelineRef} className="relative pl-8 lg:pl-12">
            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#FAFAFA]/15" />

            {/* Timeline nodes */}
            <div className="space-y-16 lg:space-y-24">
              {timelineData.map((item, i) => (
                <div key={i} className="timeline-node relative">
                  {/* Node circle */}
                  <div
                    className="node-circle absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full bg-[#D4F87A]"
                    style={{ animation: 'node-pulse 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite' }}
                  />

                  {/* Label */}
                  <div className="node-label mb-4">
                    <span
                      className="text-xs tracking-[0.25em] uppercase text-[#888888] block mb-1"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.days}
                    </span>
                    <span
                      className="text-2xl lg:text-3xl text-[#FAFAFA] uppercase tracking-[0.1em]"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      {item.city}
                    </span>
                  </div>

                  {/* Photo cluster */}
                  <div className="flex gap-3 lg:gap-4" style={{ perspective: '600px' }}>
                    {item.photos.map((photo, j) => (
                      <div
                        key={j}
                        className="cluster-photo group relative"
                        style={{
                          '--base-rotation': `${photo.offset * 3}deg`,
                          animation: `photo-drift 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
                          animationDelay: `${-(i * 2 + j)}s`,
                        } as React.CSSProperties}
                      >
                        <div
                          className="w-28 h-20 sm:w-36 sm:h-24 lg:w-44 lg:h-32 overflow-hidden rounded border-2 border-white/10 shadow-lg transition-all duration-400 group-hover:-translate-y-4 group-hover:shadow-xl group-hover:border-[#D4F87A]/30"
                          style={{
                            transform: `rotate(${photo.offset * 3}deg)`,
                          }}
                        >
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
