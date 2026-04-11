'use client';

import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { getCertifications, Certification } from '../data/portfolioService';
import { useRouter } from 'next/navigation';

const Certificates: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCertifications().then(data => {
      setCertifications(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load certifications:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  // Sort featured certificates by id descending (most recent first)
  const featuredCertificates = certifications.filter(c => c.featured).sort((a, b) => b.id - a.id);

  return (
    <section id="certifications" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">06</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">Certifications</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in visible">
        {featuredCertificates.map((cert) => (
          <motion.div 
            key={cert.id} 
            whileHover={{ y: -5, borderColor: 'var(--accent-new)' }}
            className="bg-white/5 backdrop-blur-sm border border-border-new/40 p-8 rounded-2xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-accent-new mb-2">{cert.issuer}</span>
                <h3 className="font-serif text-lg text-ink leading-snug group-hover:text-accent-new transition-colors">{cert.name}</h3>
              </div>
              <div className="w-10 h-10 bg-accent-new/10 text-accent-new rounded-lg flex items-center justify-center">
                <Award size={20} />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-border-new/20">
              <span className="font-mono text-[0.75rem] text-muted">{cert.date}</span>
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="font-mono text-[0.75rem] tracking-[0.06em] uppercase text-muted hover:text-accent-new transition-all flex items-center gap-1.5">
                Verify Credential <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-16 fade-in visible">
        <button
          className="btn-ghost rounded-full px-10 py-4 hover:bg-accent-new hover:text-white hover:border-accent-new transition-all"
          onClick={() => router.push('/all-certificates')}
        >
          View All Certifications ↗
        </button>
      </div>
    </section>
  );
};

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
export default Certificates;
