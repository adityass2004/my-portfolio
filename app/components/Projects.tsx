'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, FolderOpen, Star, Globe, Smartphone, Brain, Code, Server, Database, Cloud, Settings, LucideIcon } from 'lucide-react';
import { getProjects, Project } from '../data/portfolioService';
import { useRouter } from 'next/navigation';

interface TechIcon {
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load projects:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Tech icon mapping for project technologies
  const techIconMap: { [key: string]: TechIcon } = {
    'GitHub': { icon: Github, bgColor: 'bg-black', textColor: 'text-white' },
    'Vercel': { icon: ExternalLink, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'Netlify': { icon: ExternalLink, bgColor: 'bg-green-500', textColor: 'text-white' },
    'MySQL': { icon: Database, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'PostgreSQL': { icon: Database, bgColor: 'bg-blue-600', textColor: 'text-white' },
    'MongoDB': { icon: Database, bgColor: 'bg-green-600', textColor: 'text-white' },
    'AWS': { icon: Cloud, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'Docker': { icon: Settings, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'React': { icon: Code, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'Node.js': { icon: Server, bgColor: 'bg-green-600', textColor: 'text-white' },
    'Python': { icon: Code, bgColor: 'bg-blue-600', textColor: 'text-white' },
    'Flutter': { icon: Smartphone, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'Firebase': { icon: Cloud, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'TensorFlow': { icon: Brain, bgColor: 'bg-orange-500', textColor: 'text-white' },
    'OpenAI API': { icon: Brain, bgColor: 'bg-green-500', textColor: 'text-white' },
    'Flask': { icon: Server, bgColor: 'bg-gray-600', textColor: 'text-white' },
    'WebSocket': { icon: Globe, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'Stripe': { icon: ExternalLink, bgColor: 'bg-purple-500', textColor: 'text-white' },
    'Chart.js': { icon: Code, bgColor: 'bg-blue-500', textColor: 'text-white' },
    'MQTT': { icon: Globe, bgColor: 'bg-green-500', textColor: 'text-white' },
    'Google Fit API': { icon: Smartphone, bgColor: 'bg-green-500', textColor: 'text-white' },
  };

  // Only show featured projects on main page
  const featuredProjects = projects.filter(p => p.featured);

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

  return (
    <section id="projects" className="page-section border-b border-border-new bg-paper">
      <div className="container-shell">
        <div className="section-header fade-in visible">
          <span className="section-num">04</span>
          <h2 className="font-serif text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.08] text-ink">Selected Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 fade-in visible">
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : index * 0.06 }}
              whileHover={shouldReduceMotion ? undefined : { y: -8 }}
              className="flex flex-col h-full bg-white/5 backdrop-blur-sm border border-border-new/40 rounded-[1.4rem] overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-xl focus-within:ring-2 focus-within:ring-accent-new/40"
            >
              <div className="aspect-[16/10] w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-new/18 to-accent-soft/12 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                  <FolderOpen size={44} className="text-accent-new" />
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-paper/80 backdrop-blur-md rounded-full text-ink hover:bg-accent-new hover:text-white transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-new/40">
                      <Github size={15} />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-2 bg-paper/80 backdrop-blur-md rounded-full text-ink hover:bg-accent-new hover:text-white transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-new/40">
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5 md:p-6 flex flex-col flex-1">
                <span className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-accent-new mb-2.5 block">{project.category}</span>
                <h3 className="font-serif text-xl text-ink leading-tight mb-3 group-hover:text-accent-new transition-colors">{project.title}</h3>
                <p className="text-[0.9rem] text-muted leading-relaxed mb-5 flex-1 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="font-mono text-[0.62rem] text-muted bg-paper-warm/50 border border-border-new/30 px-2.5 py-1 rounded-full">{tech}</span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="font-mono text-[0.62rem] text-muted bg-paper-warm/50 border border-border-new/30 px-2.5 py-1 rounded-full">+{project.technologies.length - 4}</span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
          className="flex justify-center mt-10"
        >
          <button
            className="btn-ghost rounded-full hover:bg-accent-new hover:text-white hover:border-accent-new transition-all"
            onClick={() => router.push('/all-projects')}
          >
            Explore All Work ↗
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
