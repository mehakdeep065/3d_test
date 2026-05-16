import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleCanvas from '../components/ParticleCanvas';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Background parallax
      gsap.fromTo(
        bgRef.current,
        { y: 0, scale: 1 },
        {
          y: -50,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Form entrance
      gsap.fromTo(
        formRef.current,
        { y: 80, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 0.8,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Form fields stagger
      const fields = formRef.current?.querySelectorAll('.form-field');
      if (fields) {
        gsap.fromTo(
          fields,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Button
      const btn = formRef.current?.querySelector('.send-btn');
      if (btn) {
        gsap.fromTo(
          btn,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            delay: 0.6,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', comment: '' });
    }, 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center"
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-[1]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/contact-bg.jpg)' }}
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.1) 50%, rgba(10, 10, 10, 0.5) 100%)',
          }}
        />
      </div>

      {/* Sakura particles */}
      <div className="absolute inset-0 z-[2]">
        <ParticleCanvas count={70} variant="contact" />
      </div>

      {/* Form */}
      <div className="relative z-[3] w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div
          ref={formRef}
          className="liquid-glass max-w-md p-8 lg:p-10 rounded-2xl"
        >
          {/* Heading */}
          <div className="mb-8">
            <h3
              className="text-2xl lg:text-3xl text-[#FAFAFA] italic mb-3"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Want to join us, but still have questions?
            </h3>
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#781118]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Leave a request
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4F87A] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#FAFAFA] text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                Thank you! We&apos;ll be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="form-field input-wrapper relative">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-[#FAFAFA]/20 py-3 text-[#FAFAFA] placeholder:text-[#4E5E7D] outline-none transition-colors duration-300 focus:border-[#D4F87A]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  required
                />
                <div className="input-underline" />
              </div>

              {/* Phone */}
              <div className="form-field input-wrapper relative">
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-[#FAFAFA]/20 py-3 text-[#FAFAFA] placeholder:text-[#4E5E7D] outline-none transition-colors duration-300 focus:border-[#D4F87A]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  required
                />
                <div className="input-underline" />
              </div>

              {/* Comment */}
              <div className="form-field input-wrapper relative">
                <textarea
                  placeholder="Comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border-b border-[#FAFAFA]/20 py-3 text-[#FAFAFA] placeholder:text-[#4E5E7D] outline-none transition-colors duration-300 focus:border-[#D4F87A] resize-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <div className="input-underline" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="send-btn w-full py-4 bg-[#F5E8D3] text-[#0A0A0A] text-sm tracking-[0.2em] uppercase rounded-full transition-all duration-300 hover:bg-[#D4F87A] hover:shadow-[0_10px_30px_rgba(212,248,122,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
