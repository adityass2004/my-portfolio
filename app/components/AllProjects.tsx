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
    <section className="mobile-padding section-bg min-h-screen">
      <div className="max-w-7xl mx-auto mobile-optimized">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary flex items-center justify-center">
            <FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-primary-500" />
            All <span className="gradient-text ml-1">Projects</span>
          </h2>
          <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto px-4">
            Browse all my projects and technical work
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group relative bg-card border border-card rounded-xl overflow-hidden flex flex-col">
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 overflow-hidden cursor-pointer" onClick={() => setModalImage(project.image)}>
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center">
                    <div className="text-4xl sm:text-6xl font-bold gradient-text opacity-20">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col p-4">
                <div className="text-lg font-semibold text-primary mb-1">{project.title}</div>
                <div className="text-sm text-secondary mb-2">{project.category}</div>
                <div className="text-xs text-secondary mb-2">{project.description}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies && project.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-primary-500/10 text-primary-500 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-3 mt-auto">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary-500">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary-500">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
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
      {/* Modal for project image enlargement - overlays whole page */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-black bg-white rounded-full p-1 z-10" onClick={() => setModalImage(null)}>&times;</button>
            <img src={modalImage} alt="Project" className="w-full h-auto max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </section>
  );
};

export default AllProjects;
