'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Building, Briefcase, Star, Target, Code, Server, Database, Cloud, Settings, Brain, Globe, LucideIcon } from 'lucide-react';
import { getExperience, type Experience as ExperienceType } from '../data/portfolioService';
import { useRouter } from 'next/navigation';

interface TechIcon {
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

const Experience: React.FC = () => {
  const [experience, setExperience] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
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

  // Tech icon mapping for experience technologies
  const techIconMap: { [key: string]: TechIcon } = {
    'React': { icon: Code, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'Python': { icon: Code, bgColor: 'bg-blue-600', textColor: 'text-white' },
    'TensorFlow': { icon: Brain, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'AWS': { icon: Cloud, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'Docker': { icon: Settings, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'Flutter': { icon: Globe, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'Dart': { icon: Code, bgColor: 'bg-blue-600', textColor: 'text-white' },
    'Firebase': { icon: Cloud, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'Git': { icon: Settings, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'REST APIs': { icon: Server, bgColor: 'bg-green-500', textColor: 'text-white' },
    'Node.js': { icon: Server, bgColor: 'bg-green-600', textColor: 'text-white' },
    'Express.js': { icon: Server, bgColor: 'bg-gray-600', textColor: 'text-white' },
    'MongoDB': { icon: Database, bgColor: 'bg-green-600', textColor: 'text-white' },
    'PostgreSQL': { icon: Database, bgColor: 'bg-blue-600', textColor: 'text-white' },
    'Pandas': { icon: Code, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'Scikit-learn': { icon: Brain, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'JavaScript': { icon: Code, bgColor: 'bg-yellow-500', textColor: 'text-black' },
    'HTML/CSS': { icon: Code, bgColor: 'bg-orange-500', textColor: 'text-white' },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Filter for featured experiences
  const featuredExperience = experience.filter(e => e.featured).sort((a, b) => b.id - a.id);

  return (
    <section id="experience" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">05</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">Work Experience</h2>
      </div>

      <div className="relative pl-8 md:pl-12 fade-in visible">
        {/* Vertical Line */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-new via-accent-soft to-transparent ml-[5px] md:ml-[7px]"></div>

        {featuredExperience.map((exp, index) => (
          <motion.div 
            key={exp.id} 
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
                <span className="font-mono text-[0.75rem] tracking-[0.1em] text-accent-new uppercase font-medium">{exp.period}</span>
                <span className="font-serif text-lg text-ink mt-1">{exp.company}</span>
                <div className="flex items-center gap-1.5 text-muted mt-1">
                  <MapPin size={12} />
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider">{exp.location}</span>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-border-new/40 p-8 rounded-2xl hover:border-accent-new/30 transition-all duration-300 shadow-sm hover:shadow-xl group">
                <h3 className="font-serif text-xl text-ink mb-4 group-hover:text-accent-new transition-colors">{exp.title}</h3>
                <p className="text-[0.95rem] text-muted mb-6 leading-relaxed">{exp.description}</p>
                
                <ul className="flex flex-col gap-3 mb-8">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-[0.92rem] text-muted leading-relaxed pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-accent-new/70 before:font-bold">{achievement}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="font-mono text-[0.68rem] text-muted border border-border-new/30 px-3 py-1 rounded-full group-hover:border-accent-new/20 transition-colors">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-16 fade-in visible">
        <button
          className="btn-ghost rounded-full px-10 py-4 hover:bg-accent-new hover:text-white hover:border-accent-new transition-all"
          onClick={() => router.push('/all-experience')}
        >
          View Full Career Path ↗
        </button>
      </div>
    </section>
  );
};

export default Experience;
