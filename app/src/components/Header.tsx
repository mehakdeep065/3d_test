import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 lg:px-12 py-5 flex items-center justify-between">
        {/* Wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group"
        >
          <Globe className="w-4 h-4 text-[#F5E8D3] group-hover:text-[#D4F87A] transition-colors duration-300" />
          <span
            className="text-xs tracking-[0.3em] uppercase text-[#F5E8D3] font-normal"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            JAPAN TOURS
          </span>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: 'ABOUT', id: 'about' },
            { label: 'INCLUDED', id: 'included' },
            { label: 'CONTACTS', id: 'contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="nav-link text-xs tracking-[0.25em] uppercase text-[#FAFAFA] transition-all duration-300 hover:text-[#D4F87A]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Book Button */}
        <button
          onClick={() => scrollTo('contact')}
          className="px-5 py-2 border border-[#FAFAFA]/30 rounded-full text-xs tracking-[0.2em] uppercase text-[#FAFAFA] transition-all duration-300 hover:bg-[#F5E8D3] hover:text-[#0A0A0A] hover:border-[#F5E8D3] hover:shadow-[0_0_30px_rgba(212,248,122,0.3)]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Book
        </button>
      </div>
    </header>
  );
}
