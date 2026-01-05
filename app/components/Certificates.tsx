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
  const featuredCertificates = certifications.filter(c => c.featured).sort((a, b) => b.id - a.id).slice(0, 2);

  return (
    <section id="certificates" className="mobile-padding section-bg">
      <div className="max-w-7xl mx-auto mobile-optimized">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary flex items-center justify-center">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-primary-500" />
            Featured <span className="gradient-text ml-1">Certificates</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary max-w-2xl sm:max-w-3xl mx-auto px-4">
            A selection of my most relevant certifications
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredCertificates.map((cert) => (
            <div key={cert.id} className="bg-card border border-card rounded-xl p-4 flex flex-col items-center">
              <div className="w-full sm:w-64 h-32 sm:h-40 mb-3 rounded-lg overflow-hidden cursor-pointer bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center" onClick={() => setModalImage(cert.image)}>
                <img src={cert.image} alt={cert.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="text-lg font-semibold text-primary mb-1">{cert.name}</div>
              <div className="text-sm text-secondary mb-1">{cert.issuer}</div>
              <div className="text-xs text-secondary mb-2">{cert.date}</div>
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline">Verify</a>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            onClick={() => router.push('/all-certificates')}
          >
            <Award className="w-4 h-4 mr-2 inline" />
            View All Certificates
          </button>
        </div>
      </div>
      {/* Modal for certificate image enlargement - overlays whole page */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-black bg-white rounded-full p-1 z-10" onClick={() => setModalImage(null)}>&times;</button>
            <img src={modalImage} alt="Certificate" className="w-full h-auto max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Certificates;
