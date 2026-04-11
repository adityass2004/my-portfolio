import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { getEducation, type Education as EducationType } from '../data/portfolioService';

const Education: React.FC = () => {
  const [education, setEducation] = useState<EducationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEducation().then(data => {
      setEducation(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load education:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <section id="education" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">07</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">Education</h2>
      </div>

      <div className="relative pl-8 md:pl-12 fade-in visible">
        {/* Vertical Line */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-new via-accent-soft to-transparent ml-[5px] md:ml-[7px]"></div>

        {education.map((edu, index) => (
          <motion.div 
            key={edu.id} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative mb-16 last:mb-0"
          >
            {/* Dot */}
            <div className="absolute -left-8 md:-left-12 top-0 w-[12px] md:w-[16px] h-[12px] md:h-[16px] bg-paper border-2 border-accent-new rounded-full z-10 flex items-center justify-center">
              <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-accent-new rounded-full animate-pulse"></div>
            </div>

            <div className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-12">
              <div className="flex flex-col pt-1">
                <span className="font-mono text-[0.75rem] tracking-[0.1em] text-accent-new uppercase font-medium">{edu.period}</span>
                <span className="font-serif text-lg text-ink mt-1">{edu.school}</span>
                <div className="flex items-center gap-1.5 text-muted mt-1">
                  <GraduationCap size={12} />
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider">{edu.location}</span>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-border-new/40 p-8 rounded-2xl hover:border-accent-new/30 transition-all duration-300 shadow-sm hover:shadow-xl group">
                <h3 className="font-serif text-xl text-ink mb-3 group-hover:text-accent-new transition-colors">{edu.degree}</h3>
                <p className="text-[0.95rem] text-muted mb-6 leading-relaxed">{edu.description}</p>
                
                {edu.achievements.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {edu.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-[0.9rem] text-muted leading-relaxed pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-accent-new/70 before:font-bold">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Education;
