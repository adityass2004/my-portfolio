'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getCertifications, Certification } from '../data/portfolioService';
import { useRouter } from 'next/navigation';

const Certificates: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getCertifications().then(data => {
      setCertifications(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load certifications:', error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);
      else if (width < 1024) setVisibleCount(2);
      else setVisibleCount(2);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [visibleCount]);

  const featuredCertificates = certifications.filter(c => c.featured).sort((a, b) => b.id - a.id);
  const totalPages = Math.max(1, Math.ceil(featuredCertificates.length / visibleCount));
  const safeIndex = Math.min(activeIndex, totalPages - 1);

  useEffect(() => {
    if (shouldReduceMotion || totalPages <= 1) return;

    const autoplay = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalPages);
    }, 4000);

    return () => window.clearInterval(autoplay);
  }, [shouldReduceMotion, totalPages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const slidePages = Array.from({ length: totalPages }, (_, pageIndex) =>
    featuredCertificates.slice(pageIndex * visibleCount, pageIndex * visibleCount + visibleCount)
  );

  const moveCarousel = (direction: 'prev' | 'next') => {
    setActiveIndex((current) => {
      if (direction === 'prev') return current === 0 ? totalPages - 1 : current - 1;
      return (current + 1) % totalPages;
    });
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      moveCarousel(delta > 0 ? 'next' : 'prev');
    }
    setTouchStartX(null);
  };

  return (
    <section id="certifications" className="page-section border-b border-border-new bg-paper">
      <div className="container-shell">
        <div className="section-header fade-in visible">
          <span className="section-num">06</span>
          <h2 className="font-serif text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.08] text-ink">Certifications</h2>
        </div>

        <div className="relative fade-in visible" aria-label="Certificate carousel" aria-live="polite" ref={containerRef}>
          <div className="flex items-center justify-end gap-2 mb-4">
            <button
              type="button"
              aria-label="Previous certificates"
              onClick={() => moveCarousel('prev')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-new/60 bg-white/80 text-ink transition hover:border-accent-new hover:text-accent-new"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next certificates"
              onClick={() => moveCarousel('next')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-new/60 bg-white/80 text-ink transition hover:border-accent-new hover:text-accent-new"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              className="flex"
              animate={{ x: `-${safeIndex * 100}%` }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: 'easeInOut' }}
            >
              {slidePages.map((page, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0 pr-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {page.map((cert) => (
                      <motion.div
                        key={cert.id}
                        whileHover={shouldReduceMotion ? undefined : { y: -5, borderColor: 'var(--accent-new)' }}
                        className="bg-white/5 backdrop-blur-sm border border-border-new/40 rounded-2xl transition-all duration-300 group flex flex-col overflow-hidden"
                      >
                        {cert.image ? (
                          <button onClick={() => setModalImage(cert.image)} className="relative w-full aspect-[16/9] overflow-hidden bg-paper-warm group/img text-left">
                            <img
                              src={cert.image}
                              alt={cert.name}
                              loading="lazy"
                              onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                              className="w-full h-full object-cover group-hover/img:scale-[1.03] transition-transform duration-500"
                            />
                            <span className="absolute bottom-2 right-2 font-mono text-[0.62rem] tracking-[0.08em] uppercase bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">View ⤢</span>
                          </button>
                        ) : (
                          <div className="w-full aspect-[16/9] flex items-center justify-center bg-paper-warm text-muted">
                            <Award size={40} className="opacity-40" />
                          </div>
                        )}
                        <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-6">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-accent-new mb-2">{cert.issuer}</span>
                              <h3 className="font-serif text-lg text-ink leading-snug group-hover:text-accent-new transition-colors">{cert.name}</h3>
                            </div>
                            <div className="w-10 h-10 bg-accent-new/10 text-accent-new rounded-lg flex items-center justify-center shrink-0 ml-3">
                              <Award size={20} />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-border-new/20">
                            <span className="font-mono text-[0.75rem] text-muted">{cert.date || '—'}</span>
                            {cert.link ? (
                              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="font-mono text-[0.75rem] tracking-[0.06em] uppercase text-muted hover:text-accent-new transition-all flex items-center gap-1.5">
                                Verify Credential <ExternalLink size={12} />
                              </a>
                            ) : cert.image ? (
                              <button onClick={() => setModalImage(cert.image)} className="font-mono text-[0.75rem] tracking-[0.06em] uppercase text-muted hover:text-accent-new transition-all flex items-center gap-1.5">
                                View Certificate <ExternalLink size={12} />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to certificate slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === safeIndex ? 'w-8 bg-accent-new' : 'w-2.5 bg-border-new/70 hover:bg-accent-new/70'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-10 fade-in visible">
          <button
            className="btn-ghost rounded-full hover:bg-accent-new hover:text-white hover:border-accent-new transition-all"
            onClick={() => router.push('/all-certificates')}
          >
            View All Certifications ↗
          </button>
        </div>

        {modalImage && (
          <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4" onClick={() => setModalImage(null)}>
            <div className="relative max-w-4xl w-full bg-paper border border-border-new p-2 shadow-2xl">
              <button
                onClick={() => setModalImage(null)}
                className="absolute -top-10 right-0 font-mono text-sm text-white bg-transparent border border-white/30 px-3 py-1 hover:border-white transition-colors"
              >
                ✕ Close
              </button>
              <img src={modalImage} alt="Certificate" className="w-full h-auto max-h-[85vh] object-contain block" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
