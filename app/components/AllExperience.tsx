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
    <section id="all-experience" className="p-[8rem_4rem_5rem] min-h-screen bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">Archive</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">All Experience</h2>
      </div>

      <div className="flex flex-col fade-in visible">
        {allExperience.map((exp) => (
          <div key={exp.id} className="exp-item">
            <div className="exp-left">
              <div className="ep font-mono text-[0.7rem] tracking-[0.08em] text-muted mb-[0.3rem]">{exp.period}</div>
              <div className="ec font-serif text-[1.1rem] text-ink mb-[0.15rem]">{exp.company}</div>
              <div className="el font-mono text-[0.66rem] text-muted">{exp.location}</div>
            </div>
            <div className="exp-right">
              <div className="er font-semibold text-base text-ink mb-[0.5rem]">{exp.title}</div>
              <div className="ed text-[0.9rem] text-muted mb-[0.9rem] leading-[1.7]">{exp.description}</div>
              <ul className="epoints list-none flex flex-col gap-[0.5rem] mb-[0.9rem]">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-[0.9rem] text-muted leading-[1.65] pl-[1.2rem] relative before:content-['→'] before:absolute before:left-0 before:text-accent-new before:text-[0.76rem]">{achievement}</li>
                ))}
              </ul>
              <div className="etechs flex flex-wrap gap-[0.35rem]">
                {exp.technologies.map((tech) => (
                  <span key={tech} className="pill">{tech}</span>
                ))}
              </div>
            </div>
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
    </section>
  );
};

export default AllExperience;
