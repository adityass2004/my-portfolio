import React, { useState, useEffect } from 'react';
import { loadPortfolioData, PortfolioData, PersonalInfo } from '../data/portfolioService';

export default function PortfolioEditor() {
  const [activeTab, setActiveTab] = useState<keyof PortfolioData>('personalInfo');
  const [formData, setFormData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    loadPortfolioData().then(data => {
      setFormData(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load portfolio data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Failed to load data</div>
      </div>
    );
  }

  const handlePersonalInfoChange = (field: keyof typeof formData.personalInfo, value: string | string[]) => {
    if (!formData) return;
    setFormData(prev => ({
      ...prev!,
      personalInfo: { ...prev!.personalInfo, [field]: value }
    }));
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetId) return;

    const items = [...formData.projects];
    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetId);
    
    const [draggedProject] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedProject);

    setFormData(prev => ({ ...prev!, projects: items }));
    setDraggedItem(null);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: 'New Project',
      description: 'Project description...',
      image: '',
      technologies: ['React'],
      github: '',
      live: '',
      category: 'Web Development',
      featured: false
    };
    setFormData(prev => ({
      ...prev!,
      projects: [...prev!.projects, newProject]
    }));
  };

  const updateProject = (id: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev!,
      projects: prev!.projects.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const deleteProject = (id: number) => {
    setFormData(prev => ({
      ...prev!,
      projects: prev!.projects.filter(p => p.id !== id)
    }));
  };

  const handleImageUpload = (projectId: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      updateProject(projectId, 'image', imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const exportData = () => {
    const dataStr = `export const portfolioData = ${JSON.stringify(formData, null, 2)};`;
    const dataBlob = new Blob([dataStr], { type: 'text/javascript' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolioData.js';
    link.click();
  };

  const tabs = [
    { key: 'personalInfo', label: '👤 Personal', icon: '👤' },
    { key: 'projects', label: '🚀 Projects', icon: '🚀' },
    { key: 'experience', label: '💼 Experience', icon: '💼' },
    { key: 'certifications', label: '🏆 Certificates', icon: '🏆' },
    { key: 'education', label: '🎓 Education', icon: '🎓' }
  ] as const;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            ✨ Portfolio Editor
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
            Drag, drop, and edit your portfolio with ease
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e5e7eb',
          background: '#f8fafc',
          overflowX: 'auto'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as keyof PortfolioData)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '1rem',
                border: 'none',
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? '#667eea' : '#64748b',
                fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                borderBottom: activeTab === tab.key ? '3px solid #667eea' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '0.9rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', minHeight: '60vh' }}>
          {activeTab === 'personalInfo' && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>
                👤 Personal Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {Object.entries(formData.personalInfo).slice(0, 8).map(([key, value]) => (
                  <div key={key}>
                    <label style={{ 
                      display: 'block', 
                      fontWeight: '600', 
                      marginBottom: '0.5rem', 
                      color: '#374151',
                      textTransform: 'capitalize'
                    }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    {key === 'bio' || key === 'about' ? (
                      <textarea
                        value={Array.isArray(value) ? value.join('\n') : value}
                        onChange={(e) => handlePersonalInfoChange(key as keyof PersonalInfo, 
                          key === 'about' ? e.target.value.split('\n') : e.target.value)}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    ) : (
                      <input
                        type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                        value={Array.isArray(value) ? value.join(', ') : value}
                        onChange={(e) => handlePersonalInfoChange(key as keyof PersonalInfo, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          transition: 'border-color 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                  🚀 Projects ({formData.projects.length})
                </h2>
                <button
                  onClick={addProject}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  ➕ Add Project
                </button>
              </div>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {formData.projects.map((project, index) => (
                  <div 
                    key={project.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, project.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, project.id)}
                    style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      background: project.featured ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#ffffff',
                      cursor: 'grab',
                      transition: 'all 0.3s',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span style={{ 
                        background: '#667eea', 
                        color: 'white', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        #{index + 1}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={project.featured}
                            onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>⭐ Featured</span>
                        </label>
                        <button
                          onClick={() => deleteProject(project.id)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Category</label>
                        <select
                          value={project.category}
                          onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        >
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile App">Mobile App</option>
                          <option value="AI/ML">AI/ML</option>
                          <option value="Full Stack">Full Stack</option>
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>GitHub URL</label>
                        <input
                          type="url"
                          value={project.github}
                          onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                          placeholder="https://github.com/..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Live URL</label>
                        <input
                          type="url"
                          value={project.live}
                          onChange={(e) => updateProject(project.id, 'live', e.target.value)}
                          placeholder="https://..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs remain the same but with better styling */}
          {activeTab === 'experience' && (
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>
                💼 Work Experience
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {formData.experience.map(exp => (
                  <div key={exp.id} style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '2rem',
                    background: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1e293b', fontSize: '1.3rem' }}>{exp.title}</h3>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#667eea', fontWeight: '600' }}>{exp.company}</p>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{exp.period} • {exp.location}</p>
                      </div>
                      <span style={{
                        padding: '0.5rem 1rem',
                        background: exp.featured ? '#10b981' : '#64748b',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {exp.featured ? '⭐ Featured' : 'Regular'}
                      </span>
                    </div>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>{exp.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {exp.technologies.map((tech, i) => (
                        <span key={i} style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div style={{
          padding: '2rem',
          borderTop: '2px solid #e5e7eb',
          background: '#f8fafc',
          textAlign: 'center'
        }}>
          <button
            onClick={exportData}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            💾 Export Portfolio Data
          </button>
        </div>
      </div>
    </div>
  );
}