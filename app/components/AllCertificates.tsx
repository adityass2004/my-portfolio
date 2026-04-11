"use client";

import React, { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { getCertifications, Certification } from "../data/portfolioService";
import { useRouter } from "next/navigation";

const AllCertificates: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCertifications()
      .then((data) => {
        setCertifications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load certifications:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="all-certifications" className="p-[8rem_4rem_5rem] min-h-screen bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">Archive</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">All Certifications</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1.2rem] fade-in visible">
        {certifications.map((cert) => (
          <div key={cert.id} className="cert-card">
            <span className="ci font-mono text-[0.64rem] tracking-[0.12em] uppercase text-accent-new">{cert.issuer}</span>
            <div className="cn font-semibold text-[0.88rem] text-ink leading-[1.4] flex-1">{cert.name}</div>
            <div className="cd font-mono text-[0.68rem] text-muted">{cert.date}</div>
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="clink font-mono text-[0.68rem] tracking-[0.06em] uppercase text-muted no-underline pt-[0.4rem] border-t border-border-new transition-all duration-200 hover:text-accent-new">Verify ↗</a>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 fade-in visible">
        <button
          className="btn-ghost"
          onClick={() => router.push('/')}
        >
          Back to Home ↗
        </button>
      </div>

      {/* Modal for certificate image enlargement */}
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
    </section>
  );
};

export default AllCertificates;