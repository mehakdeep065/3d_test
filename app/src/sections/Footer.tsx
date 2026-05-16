import { useEffect, useRef } from 'react';
import { Globe, Instagram, Facebook, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'HOME', id: 'top' },
  { label: 'ABOUT', id: 'about' },
  { label: 'INCLUDED', id: 'included' },
  { label: 'CONTACTS', id: 'contact' },
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      // Hairline grow from center
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Content fade in
      const items = footer.querySelectorAll('.footer-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full py-12 bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hairline */}
        <div
          ref={lineRef}
          className="h-px bg-[#FAFAFA]/10 mb-8 origin-center"
          style={{ transform: 'scaleX(0)' }}
        />

        {/* Content row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Wordmark */}
          <div className="footer-item flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#F5E8D3]" />
            <span
              className="text-xs tracking-[0.2em] uppercase text-[#F5E8D3]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              JAPAN TOURS
            </span>
          </div>

          {/* Navigation */}
          <nav className="footer-item flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="nav-link text-xs tracking-[0.25em] uppercase text-[#FAFAFA]/70 transition-all duration-300 hover:text-[#D4F87A]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Social icons */}
          <div className="footer-item flex items-center gap-4">
            {[Instagram, Facebook, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-[#FAFAFA]/40 hover:text-[#D4F87A] transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
