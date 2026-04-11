'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, Star, ExternalLink, Github } from 'lucide-react';
import { getProjects, Project } from '../data/portfolioService';
import { useRouter } from 'next/navigation';

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
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

  return (
    <section id="all-projects" className="p-[8rem_4rem_5rem] min-h-screen bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">Archive</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">All Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.4rem] fade-in visible">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="flex justify-between items-start mb-2">
              <span className="pcat font-mono text-[0.64rem] tracking-[0.12em] uppercase text-accent-new">{project.category}</span>
              {project.featured && (
                <span className="font-mono text-[0.6rem] text-white bg-accent-new px-2 py-0.5 uppercase tracking-wider">Featured</span>
              )}
            </div>
            <h3 className="pname font-serif text-[1.15rem] text-ink leading-[1.3]">{project.title}</h3>
            <p className="pdesc text-[0.87rem] text-muted leading-[1.7] flex-1 line-clamp-4 overflow-hidden">{project.description}</p>
            <div className="ptechs flex flex-wrap gap-[0.35rem]">
              {project.technologies.map((tech) => (
                <span key={tech} className="tp font-mono text-[0.63rem] text-accent-new border border-accent-soft px-[0.5rem] py-[0.16rem]">{tech}</span>
              ))}
            </div>
            <div className="plinks flex gap-[0.8rem] pt-[0.5rem] border-t border-border-new">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="plink font-mono text-[0.68rem] tracking-[0.06em] uppercase text-muted no-underline transition-all duration-200 hover:text-accent-new">Live ↗</a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="plink font-mono text-[0.68rem] tracking-[0.06em] uppercase text-muted no-underline transition-all duration-200 hover:text-accent-new">GitHub</a>
              )}
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

      {/* Modal for project image enlargement */}
      {modalImage && (
        <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4" onClick={() => setModalImage(null)}>
          <div className="relative max-w-4xl w-full bg-paper border border-border-new p-2 shadow-2xl">
            <button 
              onClick={() => setModalImage(null)} 
              className="absolute -top-10 right-0 font-mono text-sm text-white bg-transparent border border-white/30 px-3 py-1 hover:border-white transition-colors"
            >
              ✕ Close
            </button>
            <img src={modalImage} alt="Project" className="w-full h-auto max-h-[85vh] object-contain block" />
          </div>
        </div>
      )}
    </section>
  );
};

export default AllProjects;
