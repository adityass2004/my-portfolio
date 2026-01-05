'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { getExperience, Experience } from '../data/portfolioService';
import { useRouter } from 'next/navigation';

const AllExperience: React.FC = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getExperience().then(data => {
      setExperience(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load experience:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  // Show all experiences, most recent first
  const allExperience = experience.slice().sort((a, b) => b.id - a.id);

  return (
    <section className="mobile-padding section-bg min-h-screen">
      <div className="max-w-5xl mx-auto mobile-optimized">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary flex items-center justify-center">
            <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-primary-500" />
            All <span className="gradient-text ml-1">Experience</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto px-4">
            My complete professional journey
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {allExperience.map((exp) => (
            <div key={exp.id} className="w-full relative bg-card border border-card rounded-xl p-6 flex flex-col">
              <div className="flex items-start space-x-6 mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer" onClick={() => setModalImage(exp.image)}>
                  {exp.image ? (
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-xl">{exp.company.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1 flex items-center">
                    {exp.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-secondary mb-2">
                    <span className="flex items-center">{exp.company}</span>
                    <span className="flex items-center">{exp.location}</span>
                    <span className="flex items-center">{exp.period}</span>
                  </div>
                  <p className="text-secondary mb-2 leading-relaxed text-sm sm:text-base">{exp.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-primary-500/10 text-primary-500 rounded-full text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ul className="list-disc list-inside text-xs text-secondary space-y-1">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
      {/* Modal for experience image enlargement - overlays whole page */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-black bg-white rounded-full p-1 z-10" onClick={() => setModalImage(null)}>&times;</button>
            <img src={modalImage} alt="Experience" className="w-full h-auto max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </section>
  );
};

export default AllExperience;
