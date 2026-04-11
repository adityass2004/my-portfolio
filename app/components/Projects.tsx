'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
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
    <section id="projects" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">04</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">Selected Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in visible">
        {featuredProjects.map((project) => (
          <motion.div 
            key={project.id} 
            whileHover={{ y: -10, scale: 1.02 }}
            className="flex flex-col h-full bg-white/5 backdrop-blur-sm border border-border-new/40 rounded-[20px] overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-2xl"
          >
            {/* Image Placeholder / Gradient */}
            <div className="aspect-[16/10] w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-new/20 to-accent-soft/20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                <FolderOpen size={48} className="text-accent-new" />
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-paper/80 backdrop-blur-md rounded-full text-ink hover:bg-accent-new hover:text-white transition-all shadow-sm">
                    <Github size={16} />
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-2 bg-paper/80 backdrop-blur-md rounded-full text-ink hover:bg-accent-new hover:text-white transition-all shadow-sm">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
              <span className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-accent-new mb-3 block">{project.category}</span>
              <h3 className="font-serif text-xl text-ink leading-tight mb-4 group-hover:text-accent-new transition-colors">{project.title}</h3>
              <p className="text-[0.9rem] text-muted leading-relaxed mb-6 flex-1 line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span key={tech} className="font-mono text-[0.65rem] text-muted bg-paper-warm/50 border border-border-new/30 px-3 py-1 rounded-full">{tech}</span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="font-mono text-[0.65rem] text-muted bg-paper-warm/50 border border-border-new/30 px-3 py-1 rounded-full">+{project.technologies.length - 4}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-16 fade-in visible">
        <button
          className="btn-ghost rounded-full px-10 py-4 hover:bg-accent-new hover:text-white hover:border-accent-new transition-all"
          onClick={() => router.push('/all-projects')}
        >
          Explore All Work ↗
        </button>
      </div>
    </section>
  );
};

export default Projects;
