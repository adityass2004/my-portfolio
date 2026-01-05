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

  // Only show 2 featured projects on main page
  const featuredProjects = projects.filter(p => p.featured).slice(0, 2);

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
    <section id="projects" className="mobile-padding section-bg relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-500/5 to-primary-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto mobile-optimized relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary flex items-center justify-center"
          >
            <FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-primary-500" />
            Featured <span className="gradient-text">Projects</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-secondary max-w-2xl sm:max-w-3xl mx-auto mb-6 sm:mb-8 px-4"
          >
            Showcasing my best work and technical expertise
          </motion.p>

          {/* Projects Grid - Only 2 featured projects, with view all button */}
          <motion.div
            variants={containerVariants}
            className="flex justify-center"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="card-hover bg-card border border-card rounded-xl overflow-hidden relative">
                    {/* Project Image */}
                    <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 overflow-hidden">
                      {/* Project Image or Fallback */}
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={`${project.title} screenshot`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const nextSibling = target.nextSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback with gradient and project initial */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ${project.image ? 'hidden' : 'flex'}`}>
                        <div className="text-4xl sm:text-6xl font-bold gradient-text opacity-20">
                          {project.title.charAt(0)}
                        </div>
                      </div>
                      
                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 sm:space-x-4">
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        >
                          <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        >
                          <Github size={18} className="sm:w-5 sm:h-5" />
                        </motion.a>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">{project.title}</h3>
                      <p className="text-secondary text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                        {project.technologies.map((tech) => {
                          const techInfo = techIconMap[tech];
                          const IconComponent = techInfo ? techInfo.icon : Code;
                          const bgColor = techInfo ? techInfo.bgColor : 'bg-gray-500';
                          const textColor = techInfo ? techInfo.textColor : 'text-white';
                          
                          return (
                            <span
                              key={tech}
                              className={`px-2 sm:px-3 py-1 ${bgColor} ${textColor} text-xs rounded-full flex items-center space-x-1`}
                            >
                              <IconComponent className="w-3 h-3" />
                              <span>{tech}</span>
                            </span>
                          );
                        })}
                      </div>

                      {/* Category */}
                      <div className="text-xs sm:text-sm text-secondary flex items-center">
                        <FolderOpen className="w-3 h-3 mr-1" />
                        <span className="text-primary-500 font-medium">{project.category}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* View All Projects Button */}
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 sm:px-8 py-3 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
              onClick={() => router.push('/all-projects')}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              View All Projects
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
