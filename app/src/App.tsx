import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './components/Header';
import CustomCursor from './components/CustomCursor';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import IncludedSection from './sections/IncludedSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll with production config
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 0, // Disable smooth scroll on touch devices for performance
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen">
      <CustomCursor />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <IncludedSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
