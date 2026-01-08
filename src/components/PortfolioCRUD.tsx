// import React, { useState, useEffect } from 'react';
// import { loadPortfolioData, PortfolioData } from '../data/portfolioService';

// export default function PortfolioCRUD() {
//   const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<keyof PortfolioData>('personalInfo');
//   const [formData, setFormData] = useState<PortfolioData | null>(null);

//   useEffect(() => {
//     loadPortfolioData().then(data => {
//       setPortfolioData(data);
//       setFormData(data);
//       setLoading(false);
//     }).catch(error => {
//       console.error('Failed to load portfolio data:', error);
//       setLoading(false);
//     });
//   }, []);

//   if (loading || !formData) {
//     return <div>Loading...</div>;
//   }

//   const handlePersonalInfoChange = (field: keyof PortfolioData['personalInfo'], value: string | string[]) => {
//     setFormData(prev => ({
//       ...prev,
//       personalInfo: { ...prev.personalInfo, [field]: value }
//     }));
//   };

//   const addProject = () => {
//     const newProject = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       image: '',
//       technologies: [],
//       github: '',
//       live: '',
//       category: '',
//       featured: false
//     };
//     setFormData(prev => ({
//       ...prev,
//       projects: [...prev.projects, newProject]
//     }));
//   };

//   const updateProject = (id: number, field: string, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       projects: prev.projects.map(p => 
//         p.id === id ? { ...p, [field]: value } : p
//       )
//     }));
//   };

//   const deleteProject = (id: number) => {
//     setFormData(prev => ({
//       ...prev,
//       projects: prev.projects.filter(p => p.id !== id)
//     }));
//   };

//   const exportData = () => {
//     const dataStr = JSON.stringify(formData, null, 2);
//     const dataBlob = new Blob([dataStr], { type: 'application/json' });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'portfolio-data.json';
//     link.click();
//   };

//   const tabs = [
//     { key: 'personalInfo', label: 'Personal Info' },
//     { key: 'projects', label: 'Projects' },
//     { key: 'experience', label: 'Experience' },
//     { key: 'certifications', label: 'Certifications' },
//     { key: 'education', label: 'Education' }
//   ];

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       padding: '2rem'
//     }}>
//       <div style={{
//         maxWidth: '1200px',
//         margin: '0 auto',
//         background: 'rgba(255, 255, 255, 0.95)',
//         borderRadius: '20px',
//         boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
//         overflow: 'hidden'
//       }}>
//         {/* Header */}
//         <div style={{
//           background: 'linear-gradient(135deg, #667eea, #764ba2)',
//           color: 'white',
//           padding: '2rem',
//           textAlign: 'center'
//         }}>
//           <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
//             Portfolio Manager
//           </h1>
//           <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
//             Manage your portfolio data with ease
//           </p>
//         </div>

//         {/* Tabs */}
//         <div style={{
//           display: 'flex',
//           borderBottom: '2px solid #e5e7eb',
//           background: '#f9fafb'
//         }}>
//           {tabs.map(tab => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key as keyof PortfolioData)}
//               style={{
//                 flex: 1,
//                 padding: '1rem',
//                 border: 'none',
//                 background: activeTab === tab.key ? 'white' : 'transparent',
//                 color: activeTab === tab.key ? '#667eea' : '#6b7280',
//                 fontWeight: activeTab === tab.key ? 'bold' : 'normal',
//                 borderBottom: activeTab === tab.key ? '3px solid #667eea' : 'none',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s'
//               }}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div style={{ padding: '2rem' }}>
//           {activeTab === 'personalInfo' && (
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
//               <div>
//                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>Name</label>
//                 <input
//                   type="text"
//                   value={formData.personalInfo.name}
//                   onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '8px',
//                     fontSize: '1rem'
//                   }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>Title</label>
//                 <input
//                   type="text"
//                   value={formData.personalInfo.title}
//                   onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '8px',
//                     fontSize: '1rem'
//                   }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>Email</label>
//                 <input
//                   type="email"
//                   value={formData.personalInfo.email}
//                   onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '8px',
//                     fontSize: '1rem'
//                   }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>Phone</label>
//                 <input
//                   type="tel"
//                   value={formData.personalInfo.phone}
//                   onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '8px',
//                     fontSize: '1rem'
//                   }}
//                 />
//               </div>
//               <div style={{ gridColumn: '1 / -1' }}>
//                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>Bio</label>
//                 <textarea
//                   value={formData.personalInfo.bio}
//                   onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
//                   rows={4}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '8px',
//                     fontSize: '1rem',
//                     resize: 'vertical'
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {activeTab === 'projects' && (
//             <div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
//                 <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', margin: 0 }}>Projects</h2>
//                 <button
//                   onClick={addProject}
//                   style={{
//                     background: 'linear-gradient(135deg, #667eea, #764ba2)',
//                     color: 'white',
//                     border: 'none',
//                     padding: '0.75rem 1.5rem',
//                     borderRadius: '8px',
//                     fontWeight: 'bold',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Add Project
//                 </button>
//               </div>
              
//               <div style={{ display: 'grid', gap: '1.5rem' }}>
//                 {formData.projects.map(project => (
//                   <div key={project.id} style={{
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '12px',
//                     padding: '1.5rem',
//                     background: '#f9fafb'
//                   }}>
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
//                       <div>
//                         <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>Title</label>
//                         <input
//                           type="text"
//                           value={project.title}
//                           onChange={(e) => updateProject(project.id, 'title', e.target.value)}
//                           style={{
//                             width: '100%',
//                             padding: '0.5rem',
//                             border: '1px solid #d1d5db',
//                             borderRadius: '6px'
//                           }}
//                         />
//                       </div>
//                       <div>
//                         <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>Category</label>
//                         <input
//                           type="text"
//                           value={project.category}
//                           onChange={(e) => updateProject(project.id, 'category', e.target.value)}
//                           style={{
//                             width: '100%',
//                             padding: '0.5rem',
//                             border: '1px solid #d1d5db',
//                             borderRadius: '6px'
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <div style={{ marginBottom: '1rem' }}>
//                       <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>Description</label>
//                       <textarea
//                         value={project.description}
//                         onChange={(e) => updateProject(project.id, 'description', e.target.value)}
//                         rows={3}
//                         style={{
//                           width: '100%',
//                           padding: '0.5rem',
//                           border: '1px solid #d1d5db',
//                           borderRadius: '6px',
//                           resize: 'vertical'
//                         }}
//                       />
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                         <input
//                           type="checkbox"
//                           checked={project.featured}
//                           onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
//                         />
//                         <span style={{ fontWeight: 'bold', color: '#374151' }}>Featured</span>
//                       </label>
//                       <button
//                         onClick={() => deleteProject(project.id)}
//                         style={{
//                           background: '#ef4444',
//                           color: 'white',
//                           border: 'none',
//                           padding: '0.5rem 1rem',
//                           borderRadius: '6px',
//                           cursor: 'pointer'
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === 'experience' && (
//             <div>
//               <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '1.5rem' }}>Experience</h2>
//               <div style={{ display: 'grid', gap: '1.5rem' }}>
//                 {formData.experience.map(exp => (
//                   <div key={exp.id} style={{
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '12px',
//                     padding: '1.5rem',
//                     background: '#f9fafb'
//                   }}>
//                     <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#374151' }}>{exp.title}</h3>
//                     <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>{exp.company}</p>
//                     <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>{exp.period} • {exp.location}</p>
//                     <p style={{ margin: 0, color: '#374151' }}>{exp.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === 'certifications' && (
//             <div>
//               <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '1.5rem' }}>Certifications</h2>
//               <div style={{ display: 'grid', gap: '1rem' }}>
//                 {formData.certifications.map(cert => (
//                   <div key={cert.id} style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     padding: '1rem',
//                     border: '1px solid #e5e7eb',
//                     borderRadius: '8px',
//                     background: '#f9fafb'
//                   }}>
//                     <div>
//                       <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#374151' }}>{cert.name}</h3>
//                       <p style={{ margin: 0, color: '#6b7280' }}>{cert.issuer} • {cert.date}</p>
//                     </div>
//                     <span style={{
//                       padding: '0.25rem 0.75rem',
//                       background: cert.featured ? '#10b981' : '#6b7280',
//                       color: 'white',
//                       borderRadius: '20px',
//                       fontSize: '0.875rem'
//                     }}>
//                       {cert.featured ? 'Featured' : 'Regular'}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === 'education' && (
//             <div>
//               <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '1.5rem' }}>Education</h2>
//               <div style={{ display: 'grid', gap: '1.5rem' }}>
//                 {formData.education.map(edu => (
//                   <div key={edu.id} style={{
//                     border: '2px solid #e5e7eb',
//                     borderRadius: '12px',
//                     padding: '1.5rem',
//                     background: '#f9fafb'
//                   }}>
//                     <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#374151' }}>{edu.degree}</h3>
//                     <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>{edu.school}</p>
//                     <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>{edu.period} • {edu.location}</p>
//                     <p style={{ margin: 0, color: '#374151' }}>{edu.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Export Button */}
//         <div style={{
//           padding: '2rem',
//           borderTop: '2px solid #e5e7eb',
//           background: '#f9fafb',
//           textAlign: 'center'
//         }}>
//           <button
//             onClick={exportData}
//             style={{
//               background: 'linear-gradient(135deg, #10b981, #059669)',
//               color: 'white',
//               border: 'none',
//               padding: '1rem 2rem',
//               borderRadius: '12px',
//               fontSize: '1.1rem',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
//             }}
//           >
//             Export Portfolio Data
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }