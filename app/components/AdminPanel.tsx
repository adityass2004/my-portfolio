'use client';

import React, { useState, useEffect } from 'react';
import { Save, LogOut, Edit2, Trash2, Copy, Plus, Check, AlertCircle, Loader, Upload, ChevronDown, ChevronRight, Search, Star, Image as ImageIcon, X } from 'lucide-react';

interface PortfolioData {
  personalInfo: any;
  projects: any[];
  experience: any[];
  certifications: any[];
  education: any[];
  contactInfo: any;
}

// Mock API Service - Replace with your actual backend URLs
const API_BASE_URL = '/api';

const apiService = {
  // GET all portfolio data
  async getPortfolio(): Promise<PortfolioData> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`);
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      // Return mock data as fallback
      return getMockData();
    }
  },

  // UPDATE entire portfolio
  async updatePortfolio(data: PortfolioData): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      return false;
    }
  },

  // CREATE new item in a section
  async createItem(section: string, item: any): Promise<any> {
    // For Next.js API route, we handle IDs locally and save the whole portfolio
    return { ...item, id: Date.now() };
  },

  // UPDATE specific item
  async updateItem(section: string, id: number, updates: any): Promise<boolean> {
    // We update local state and use the main PUT to save
    return true;
  },

  // DELETE specific item
  async deleteItem(section: string, id: number): Promise<boolean> {
    // We update local state and use the main PUT to save
    return true;
  }
};

// ── Compact admin primitives (small inputs, collapsible rows, fast fill) ──
const inputCls = "w-full rounded-lg border border-border-new bg-paper px-2.5 py-1.5 text-[0.8rem] text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent-new transition-colors";
const labelCls = "block font-mono text-[0.6rem] tracking-[0.1em] uppercase text-muted mb-0.5";
const cardCls = "rounded-xl border border-border-new/60 bg-card overflow-hidden";

const Field = ({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) => (
  <label className={`block min-w-0 ${span ? 'col-span-full' : ''}`}>
    <span className={labelCls}>{label}</span>
    {children}
  </label>
);
const TI = ({ value, onChange, ph }: { value: any; onChange: (v: string) => void; ph?: string }) => (
  <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={ph} className={inputCls} />
);
const TA = ({ value, onChange, rows = 2 }: { value: any; onChange: (v: string) => void; rows?: number }) => (
  <textarea value={Array.isArray(value) ? value.join('\n') : (value ?? '')} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${inputCls} resize-y leading-relaxed`} />
);
const arr2str = (a: any) => Array.isArray(a) ? a.join(', ') : (a ?? '');
const str2arr = (s: string) => s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
const Thumb = ({ src, alt }: { src?: string; alt: string }) => {
  const [err, setErr] = useState(false);
  if (!src || err) return <span className="w-10 h-10 rounded-lg bg-paper-warm border border-border-new/50 flex items-center justify-center text-muted shrink-0"><ImageIcon size={15} /></span>;
  return <img src={src} alt={alt} onError={() => setErr(true)} loading="lazy" className="w-10 h-10 rounded-lg object-cover border border-border-new/50 shrink-0 bg-paper-warm" />;
};

// Mock data function
const getMockData = (): PortfolioData => ({
  personalInfo: {
    name: "Aditya Sagar Sharma",
    title: "B.Tech CSE Student & Full Stack Developer",
    subtitle: "Building scalable web applications with React, Node.js & Databases",
    avatar: "AS",
    bio: "I'm a B.Tech Computer Science student focused on full-stack web development.",
    github: "https://github.com/adityass2004",
    linkedin: "https://www.linkedin.com/in/aditya-sagar-sharma-1955a7288/",
    leetcode: "https://leetcode.com/u/adityasagar9991",
    resumeLink: "/data_files/resume.pdf"
  },
  projects: [
    {
      id: 1,
      title: "TrackIt – Academic Tracker",
      description: "Smart academic tracking platform for students",
      image: "/projects/trackit.jpg",
      technologies: ["Next.js", "MongoDB", "Tailwind CSS", "Node.js"],
      github: "https://github.com/adityass2004/track-it-nextjs",
      live: "https://trackitsrm.vercel.app",
      category: "Full Stack",
      featured: true
    }
  ],
  experience: [
    {
      id: 1,
      title: "Web Development Intern",
      company: "Cognifyz Technologies",
      period: "Jul 2025 - Aug 2025",
      location: "Remote",
      description: "Worked on building responsive interfaces",
      achievements: ["Created React UI", "Delivered 5+ features"],
      technologies: ["React.js", "Node.js", "JavaScript"],
      image: "/data_images/cognifyz.jpeg",
      featured: true
    }
  ],
  certifications: [
    {
      id: 1,
      name: "Flipkart Workshop",
      issuer: "AARUSH",
      date: "Sep-2023",
      credentialId: "Flip_3002",
      link: "https://www.aaruush.org/verify/Flip_3002",
      image: "/data_images/flipkart_workshop.jpg",
      featured: true
    }
  ],
  education: [
    {
      id: 1,
      degree: "B.Tech in Computer Science and Engineering",
      school: "SRM Institute of Science and Technology",
      period: "Aug 2023 - May 2027",
      location: "Chennai, Tamil Nadu, India",
      description: "Focus on software engineering and web development",
      achievements: ["GPA: 8.87"]
    }
  ],
  contactInfo: {
    email: "adityasagar9991@gmail.com",
    phone: "+91 9709303105",
    location: "Muzaffarpur, Bihar, India",
    availability: "Available for internship opportunities",
    social: {
      github: "https://github.com/adityass2004",
      linkedin: "https://www.linkedin.com/in/aditya-sagar-sharma-1955a7288/",
      instagram: "https://instagram.com/adityass0401",
      twitter: ""
    }
  }
});

const AdminPanel: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const ADMIN_PASSWORD = '1';

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const portfolioData = await apiService.getPortfolio();
      setData(portfolioData);
    } catch (error) {
      showNotification('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const saveData = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const success = await apiService.updatePortfolio(data);
      if (success) {
        showNotification('success', 'All changes saved successfully!');
      } else {
        showNotification('error', 'Failed to save changes');
      }
    } catch (error) {
      showNotification('error', 'Error saving data');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section: string, field: string, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: { ...prev[section as keyof PortfolioData], [field]: value }
      };
    });
  };

  const updateNestedField = (section: string, parent: string, field: string, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof PortfolioData],
          [parent]: { ...(prev[section as keyof PortfolioData] as any)[parent], [field]: value }
        }
      };
    });
  };

  const addItem = async (section: string) => {
    const templates: any = {
      projects: {
        title: 'New Project',
        description: '',
        image: '',
        technologies: [],
        github: '',
        live: '',
        category: 'Full Stack',
        featured: false
      },
      experience: {
        title: 'New Position',
        company: '',
        period: '',
        location: '',
        description: '',
        achievements: [],
        technologies: [],
        image: '',
        featured: false
      },
      certifications: {
        name: 'New Certification',
        issuer: '',
        date: '',
        credentialId: '',
        link: '',
        image: '',
        featured: false
      },
      education: {
        degree: 'New Degree',
        school: '',
        period: '',
        location: '',
        description: '',
        achievements: []
      }
    };

    const newItem = await apiService.createItem(section, templates[section]);
    
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: [...(prev as any)[section], newItem]
      };
    });
    
    setEditingItem(newItem.id);
    showNotification('success', `New ${section.slice(0, -1)} created`);
  };

  const updateItem = async (section: string, id: number, updates: any) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: (prev as any)[section].map((item: any) =>
          item.id === id ? { ...item, ...updates } : item
        )
      };
    });
  };

  const deleteItem = async (section: string, id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    const success = await apiService.deleteItem(section, id);
    if (success) {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [section]: (prev as any)[section].filter((item: any) => item.id !== id)
        };
      });
      showNotification('success', 'Item deleted successfully');
    } else {
      showNotification('error', 'Failed to delete item');
    }
  };

  const duplicateItem = (section: string, item: any) => {
    const duplicated = {
      ...item,
      id: Date.now(),
      title: item.title ? `${item.title} (Copy)` : undefined,
      name: item.name ? `${item.name} (Copy)` : undefined,
      degree: item.degree ? `${item.degree} (Copy)` : undefined
    };
    
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: [...(prev as any)[section], duplicated]
      };
    });
    showNotification('success', 'Item duplicated');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">AS</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter password to manage your portfolio</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'personalInfo', label: 'Profile', icon: '👤', count: null },
    { key: 'contactInfo', label: 'Contact', icon: '📧', count: null },
    { key: 'projects', label: 'Projects', icon: '💼', count: data?.projects?.length },
    { key: 'experience', label: 'Work', icon: '🏢', count: data?.experience?.length },
    { key: 'certifications', label: 'Certs', icon: '🏆', count: data?.certifications?.length },
    { key: 'education', label: 'Edu', icon: '🎓', count: data?.education?.length }
  ];

  return (
    <div className="min-h-screen section-bg pt-20">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-slide-in`}>
          {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-card border-card sticky top-20 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">AS</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-primary leading-tight truncate">Portfolio Admin</h1>
                <p className="font-mono text-[0.6rem] text-secondary truncate">{(data?.projects?.length ?? 0) + (data?.experience?.length ?? 0) + (data?.certifications?.length ?? 0) + (data?.education?.length ?? 0)} items · {data?.certifications?.length ?? 0} certs</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={saveData}
                disabled={saving}
                className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg text-[0.78rem] font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[0.78rem] font-medium hover:bg-red-600 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-card sticky top-[61px] z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1.5 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-[0.78rem] font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow'
                    : 'bg-gray-100 dark:bg-dark-800 text-secondary hover:bg-gray-200 dark:hover:bg-dark-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.count !== null && (
                  <span className={`px-1.5 py-px rounded-full text-[0.65rem] font-bold ${
                    activeTab === tab.key ? 'bg-white/20' : 'bg-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-card border-card rounded-xl shadow-lg p-3 sm:p-4">
          {activeTab === 'personalInfo' && (
            <PersonalInfoSection data={data} updateField={updateField} />
          )}
          
          {activeTab === 'contactInfo' && (
            <ContactInfoSection data={data} updateField={updateField} updateNestedField={updateNestedField} />
          )}
          
          {activeTab === 'projects' && (
            <ProjectsSection
              data={data}
              addItem={addItem}
              updateItem={updateItem}
              deleteItem={deleteItem}
              duplicateItem={duplicateItem}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
            />
          )}
          
          {activeTab === 'experience' && (
            <ExperienceSection
              data={data}
              addItem={addItem}
              updateItem={updateItem}
              deleteItem={deleteItem}
            />
          )}
          
          {activeTab === 'certifications' && (
            <CertificationsSection
              data={data}
              addItem={addItem}
              updateItem={updateItem}
              deleteItem={deleteItem}
            />
          )}
          
          {activeTab === 'education' && (
            <EducationSection
              data={data}
              addItem={addItem}
              updateItem={updateItem}
              deleteItem={deleteItem}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Section Components
const SecHead = ({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-2 mb-2">
    <div className="min-w-0">
      <h2 className="text-base font-bold text-primary leading-tight">{title}</h2>
      {sub ? <p className="font-mono text-[0.62rem] text-secondary truncate">{sub}</p> : null}
    </div>
    {right}
  </div>
);

const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button onClick={onClick} className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg text-[0.75rem] hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 shrink-0">
    <Plus className="w-3.5 h-3.5" />{label}
  </button>
);

const PreviewModal = ({ src, title, onClose }: { src: string | null; title: string; onClose: () => void }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-3xl w-full bg-paper border border-border-new rounded-xl p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-9 right-0 font-mono text-xs text-white bg-transparent border border-white/30 px-2.5 py-1 rounded hover:border-white transition-colors flex items-center gap-1"><X size={12} /> Close</button>
        <div className="font-mono text-[0.65rem] text-muted px-1.5 py-1.5 truncate">{title}</div>
        <img src={src} alt={title} className="w-full h-auto max-h-[75vh] object-contain block rounded-lg bg-black" />
      </div>
    </div>
  );
};

const PersonalInfoSection = ({ data, updateField }: any) => {
  const [uploadingResume, setUploadingResume] = React.useState(false);

  const handleResumeUpload = async (file: File) => {
    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        updateField('personalInfo', 'resumeLink', result.path);
        alert(`Resume uploaded successfully!\nPath: ${result.path}`);
      } else {
        alert('Upload failed. Next.js API for upload not implemented yet.');
      }
    } catch (error) {
      alert('Upload failed.');
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div>
      <SecHead title="Personal Information" sub="Name, links, bio & resume" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
        <Field label="Name"><TI value={data?.personalInfo?.name} onChange={(v: any) => updateField('personalInfo', 'name', v)} /></Field>
        <Field label="Avatar"><TI value={data?.personalInfo?.avatar} onChange={(v: any) => updateField('personalInfo', 'avatar', v)} ph="AS" /></Field>
        <Field label="Title" span><TI value={data?.personalInfo?.title} onChange={(v: any) => updateField('personalInfo', 'title', v)} /></Field>
        <Field label="Subtitle" span><TI value={data?.personalInfo?.subtitle} onChange={(v: any) => updateField('personalInfo', 'subtitle', v)} /></Field>
        <Field label="GitHub"><TI value={data?.personalInfo?.github} onChange={(v: any) => updateField('personalInfo', 'github', v)} /></Field>
        <Field label="LinkedIn"><TI value={data?.personalInfo?.linkedin} onChange={(v: any) => updateField('personalInfo', 'linkedin', v)} /></Field>
        <Field label="LeetCode"><TI value={data?.personalInfo?.leetcode} onChange={(v: any) => updateField('personalInfo', 'leetcode', v)} /></Field>
        <Field label="College"><TI value={data?.personalInfo?.college} onChange={(v: any) => updateField('personalInfo', 'college', v)} /></Field>
        <Field label="Graduating"><TI value={data?.personalInfo?.graduating} onChange={(v: any) => updateField('personalInfo', 'graduating', v)} /></Field>
        <Field label="CGPA"><TI value={data?.personalInfo?.cgpa} onChange={(v: any) => updateField('personalInfo', 'cgpa', v)} /></Field>
        <Field label="Focus"><TI value={data?.personalInfo?.focusAreas} onChange={(v: any) => updateField('personalInfo', 'focusAreas', v)} /></Field>
        <Field label="Hero loc"><TI value={data?.personalInfo?.heroLocation} onChange={(v: any) => updateField('personalInfo', 'heroLocation', v)} /></Field>
        <Field label="Badge"><TI value={data?.personalInfo?.availabilityBadge} onChange={(v: any) => updateField('personalInfo', 'availabilityBadge', v)} /></Field>
        <Field label="LC highlight"><TI value={data?.personalInfo?.leetcodeHighlight} onChange={(v: any) => updateField('personalInfo', 'leetcodeHighlight', v)} /></Field>
        <Field label="Profile img"><TI value={data?.personalInfo?.profileImage} onChange={(v: any) => updateField('personalInfo', 'profileImage', v)} ph="/profile-image.jpg" /></Field>
        <Field label="Resume" span>
          <div className="flex gap-1.5">
            <div className="flex-1"><TI value={data?.personalInfo?.resumeLink} onChange={(v: any) => updateField('personalInfo', 'resumeLink', v)} ph="/data_files/resume_new.pdf" /></div>
            <label className={`px-2.5 py-1.5 rounded-lg text-[0.72rem] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${uploadingResume ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
              {uploadingResume ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploadingResume ? '...' : 'PDF'}
              <input type="file" accept=".pdf" className="hidden" disabled={uploadingResume} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleResumeUpload(file); }} />
            </label>
          </div>
        </Field>
        <Field label="Bio" span><TA value={data?.personalInfo?.bio} onChange={(v: any) => updateField('personalInfo', 'bio', v)} rows={2} /></Field>
        <Field label="About (one per line)" span><TA value={(data?.personalInfo?.about ?? []).join('\n')} onChange={(v: any) => updateField('personalInfo', 'about', v.split('\n').map((s: string) => s.trim()).filter(Boolean))} rows={3} /></Field>
        <Field label="Specialties (comma separated)" span><TI value={arr2str(data?.personalInfo?.specialties)} onChange={(v: any) => updateField('personalInfo', 'specialties', str2arr(v))} ph="Backend, DSA, AWS" /></Field>
      </div>
    </div>
  );
};

const ContactInfoSection = ({ data, updateField, updateNestedField }: any) => (
  <div>
    <SecHead title="Contact Information" sub="Email, phone, socials & form" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
      <Field label="Email"><TI value={data?.contactInfo?.email} onChange={(v: any) => updateField('contactInfo', 'email', v)} /></Field>
      <Field label="Phone"><TI value={data?.contactInfo?.phone} onChange={(v: any) => updateField('contactInfo', 'phone', v)} /></Field>
      <Field label="Location"><TI value={data?.contactInfo?.location} onChange={(v: any) => updateField('contactInfo', 'location', v)} /></Field>
      <Field label="Availability"><TI value={data?.contactInfo?.availability} onChange={(v: any) => updateField('contactInfo', 'availability', v)} /></Field>
      <Field label="GitHub"><TI value={data?.contactInfo?.social?.github} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'github', v)} /></Field>
      <Field label="LinkedIn"><TI value={data?.contactInfo?.social?.linkedin} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'linkedin', v)} /></Field>
      <Field label="LeetCode"><TI value={data?.contactInfo?.social?.leetcode ?? data?.personalInfo?.leetcode} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'leetcode', v)} /></Field>
      <Field label="Instagram"><TI value={data?.contactInfo?.social?.instagram} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'instagram', v)} /></Field>
      <Field label="Twitter"><TI value={data?.contactInfo?.social?.twitter} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'twitter', v)} /></Field>
      <Field label="Formspree ID"><TI value={data?.contactInfo?.formspreeId} onChange={(v: any) => updateField('contactInfo', 'formspreeId', v)} ph="mzznaryk" /></Field>
      <Field label="Contact intro" span><TA value={data?.contactInfo?.contactIntro} onChange={(v: any) => updateField('contactInfo', 'contactIntro', v)} rows={2} /></Field>
    </div>
  </div>
);

const ProjectsSection = ({ data, addItem, updateItem, deleteItem, duplicateItem, editingItem, setEditingItem }: any) => {
  const [importing, setImporting] = React.useState(false);
  const [githubUsername, setGithubUsername] = React.useState('');
  const [repos, setRepos] = React.useState<any[]>([]);
  const [selectedRepos, setSelectedRepos] = React.useState<Set<number>>(new Set());
  const [showRepoList, setShowRepoList] = React.useState(false);

  const fetchGitHubRepos = async () => {
    if (!githubUsername.trim()) {
      alert('Please enter a GitHub username');
      return;
    }
    
    setImporting(true);
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=50`);
      if (!response.ok) throw new Error('Failed to fetch repos');
      
      const repoData = await response.json();
      const nonForkedRepos = repoData.filter((repo: any) => !repo.fork);
      setRepos(nonForkedRepos);
      setShowRepoList(true);
    } catch (error) {
      alert('Failed to fetch GitHub repos. Check username.');
    } finally {
      setImporting(false);
    }
  };

  const importSelectedRepos = async () => {
    if (selectedRepos.size === 0) {
      alert('Please select at least one repository');
      return;
    }

    setImporting(true);
    try {
      const existingData = await (await fetch('/api/portfolio')).json();
      
      repos.forEach((repo, index) => {
        if (selectedRepos.has(index)) {
          const newProject = {
            id: Date.now() + Math.random(),
            title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            description: repo.description || 'No description provided',
            image: '',
            technologies: repo.language ? [repo.language] : [],
            github: repo.html_url,
            live: repo.homepage || '',
            category: 'Full Stack',
            featured: false
          };
          existingData.projects.push(newProject);
        }
      });
      
      await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(existingData)
      });
      
      setShowRepoList(false);
      setSelectedRepos(new Set());
      setRepos([]);
      window.location.reload();
    } catch (error) {
      alert('Failed to import.');
    } finally {
      setImporting(false);
    }
  };

  const toggleRepo = (index: number) => {
    const newSelected = new Set(selectedRepos);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRepos(newSelected);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <h2 className="text-base font-bold text-primary leading-tight">Projects</h2>
          <p className="font-mono text-[0.62rem] text-secondary">{data?.projects?.length ?? 0} total</p>
        </div>
        <div className="flex gap-1.5 items-center">
          <div className="flex gap-1.5 items-center">
            <input
              type="text"
              placeholder="gh user"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className={`${inputCls} !w-24 !py-1 !text-[0.72rem]`}
            />
            <button
              onClick={fetchGitHubRepos}
              disabled={importing}
              className="px-2.5 py-1.5 bg-green-500 text-white rounded-lg text-[0.72rem] hover:bg-green-600 transition-colors flex items-center gap-1 disabled:opacity-50 shrink-0"
            >
              {importing ? <Loader className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              {importing ? '...' : 'Fetch'}
            </button>
          </div>
          <button
            onClick={() => addItem('projects')}
            className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg text-[0.75rem] hover:shadow-lg transition-all duration-200 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* Repository Selection Modal */}
      {showRepoList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border-card rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-card">
              <h3 className="text-xl font-bold text-primary">Select Repositories to Import</h3>
              <p className="text-sm text-secondary mt-1">{selectedRepos.size} selected</p>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid gap-3">
                {repos.map((repo, index) => (
                  <div
                    key={index}
                    onClick={() => toggleRepo(index)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRepos.has(index)
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-card hover:border-primary-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedRepos.has(index)}
                        onChange={() => toggleRepo(index)}
                        className="mt-1 w-4 h-4"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary">{repo.name}</h4>
                        <p className="text-sm text-secondary mt-1">{repo.description || 'No description'}</p>
                        <div className="flex gap-2 mt-2">
                          {repo.language && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">{repo.language}</span>
                          )}
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-500 rounded text-xs">⭐ {repo.stargazers_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-card flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRepoList(false);
                  setSelectedRepos(new Set());
                  setRepos([]);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={importSelectedRepos}
                disabled={importing || selectedRepos.size === 0}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {importing ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Import {selectedRepos.size} Selected
              </button>
            </div>
          </div>
        </div>
      )}
    <div className="grid md:grid-cols-2 gap-1.5">
      {data?.projects?.map((project: any) => (
        <div key={project.id} className={`${cardCls} ${editingItem === project.id ? '!border-accent-new/60' : ''}`}>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <button type="button" onClick={() => setEditingItem(editingItem === project.id ? null : project.id)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
              {editingItem === project.id ? <ChevronDown size={14} className="text-muted shrink-0" /> : <ChevronRight size={14} className="text-muted shrink-0" />}
              <Thumb src={project.image} alt={project.title} />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.8rem] font-semibold text-primary truncate leading-tight">{project.title || 'Untitled'}</span>
                <span className="block font-mono text-[0.6rem] text-muted truncate">{project.category}{project.featured ? ' · ★' : ''}</span>
              </span>
            </button>
            <button type="button" title="Featured" onClick={() => updateItem('projects', project.id, { featured: !project.featured })} className={`p-1.5 rounded-lg border transition-all shrink-0 ${project.featured ? 'border-accent-new/60 text-accent-new bg-accent-new/10' : 'border-border-new/60 text-muted hover:text-accent-new'}`}>
              <Star size={12} className={project.featured ? 'fill-current' : ''} />
            </button>
            <button type="button" title="Edit" onClick={() => setEditingItem(editingItem === project.id ? null : project.id)} className="p-1.5 rounded-lg border border-border-new/60 text-muted hover:text-accent-new hover:border-accent-new/50 transition-all shrink-0">
              {editingItem === project.id ? <Check size={12} /> : <Edit2 size={12} />}
            </button>
            <button type="button" title="Duplicate" onClick={() => duplicateItem('projects', project)} className="p-1.5 rounded-lg border border-border-new/60 text-muted hover:text-accent-new hover:border-accent-new/50 transition-all shrink-0">
              <Copy size={12} />
            </button>
            <button type="button" title="Delete" onClick={() => deleteItem('projects', project.id)} className="p-1.5 rounded-lg border border-border-new/60 text-muted hover:!text-red-500 hover:!border-red-400 transition-all shrink-0">
              <Trash2 size={12} />
            </button>
          </div>
          
          {editingItem === project.id ? (
            <div className="px-2 pb-2 pt-1.5 border-t border-border-new/40 grid grid-cols-2 gap-1.5">
              <Field label="Title" span><TI value={project.title} onChange={(v: any) => updateItem('projects', project.id, { title: v })} /></Field>
              <Field label="Category"><TI value={project.category} onChange={(v: any) => updateItem('projects', project.id, { category: v })} /></Field>
              <Field label="Tech (comma)"><TI value={arr2str(project.technologies)} onChange={(v: string) => updateItem('projects', project.id, { technologies: str2arr(v) })} /></Field>
              <Field label="Image" span><TI value={project.image} onChange={(v: any) => updateItem('projects', project.id, { image: v })} ph="/data_images/..." /></Field>
              <Field label="GitHub" span><TI value={project.github} onChange={(v: any) => updateItem('projects', project.id, { github: v })} /></Field>
              <Field label="Live" span><TI value={project.live} onChange={(v: any) => updateItem('projects', project.id, { live: v })} /></Field>
              <Field label="Description" span><TA value={project.description} onChange={(v: any) => updateItem('projects', project.id, { description: v })} rows={2} /></Field>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
  );
};

const ExperienceSection = ({ data, addItem, updateItem, deleteItem }: any) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const list = (data?.experience ?? []).filter((e: any) => !query || `${e.title} ${e.company}`.toLowerCase().includes(query.toLowerCase()));
  return (
  <div>
    <SecHead title="Experience" sub={`${data?.experience?.length ?? 0} roles`} right={<AddBtn onClick={() => { const id = addItem('experience'); setOpenId(typeof id === 'number' ? id : null); }} label="Add" />} />
    <div className="relative mb-2">
      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter roles..." className={`${inputCls} !pl-8`} />
    </div>
    <div className="grid md:grid-cols-2 gap-1.5">
      {list.map((exp: any) => (
        <div key={exp.id} className={cardCls}>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <button type="button" onClick={() => setOpenId(openId === exp.id ? null : exp.id)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
              {openId === exp.id ? <ChevronDown size={14} className="text-muted shrink-0" /> : <ChevronRight size={14} className="text-muted shrink-0" />}
              <Thumb src={exp.image} alt={exp.title} />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.8rem] font-semibold text-primary truncate leading-tight">{exp.title || 'Untitled'}</span>
                <span className="block font-mono text-[0.6rem] text-muted truncate">{exp.company}{exp.featured ? ' · ★' : ''}</span>
              </span>
            </button>
            <button type="button" title="Featured" onClick={() => updateItem('experience', exp.id, { featured: !exp.featured })} className={`p-1.5 rounded-lg border transition-all shrink-0 ${exp.featured ? 'border-accent-new/60 text-accent-new bg-accent-new/10' : 'border-border-new/60 text-muted hover:text-accent-new'}`}>
              <Star size={12} className={exp.featured ? 'fill-current' : ''} />
            </button>
            <button type="button" title="Delete" onClick={() => deleteItem('experience', exp.id)} className="p-1.5 rounded-lg border border-border-new/60 text-muted hover:!text-red-500 hover:!border-red-400 transition-all shrink-0"><Trash2 size={12} /></button>
          </div>
          {openId === exp.id && (
          <div className="px-2 pb-2 pt-1.5 border-t border-border-new/40 grid grid-cols-2 gap-1.5">
            <Field label="Job title"><TI value={exp.title} onChange={(v: any) => updateItem('experience', exp.id, { title: v })} /></Field>
            <Field label="Company"><TI value={exp.company} onChange={(v: any) => updateItem('experience', exp.id, { company: v })} /></Field>
            <Field label="Period"><TI value={exp.period} onChange={(v: any) => updateItem('experience', exp.id, { period: v })} ph="Jul 2025 - Aug 2025" /></Field>
            <Field label="Location"><TI value={exp.location} onChange={(v: any) => updateItem('experience', exp.id, { location: v })} /></Field>
            <Field label="Image"><TI value={exp.image} onChange={(v: any) => updateItem('experience', exp.id, { image: v })} ph="/data_images/..." /></Field>
            <Field label="Tech (comma)"><TI value={arr2str(exp.technologies)} onChange={(v: string) => updateItem('experience', exp.id, { technologies: str2arr(v) })} /></Field>
            <Field label="Description" span><TA value={exp.description} onChange={(v: any) => updateItem('experience', exp.id, { description: v })} rows={2} /></Field>
            <Field label="Achievements (comma)" span><TI value={arr2str(exp.achievements)} onChange={(v: string) => updateItem('experience', exp.id, { achievements: str2arr(v) })} /></Field>
          </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

const CertificationsSection = ({ data, addItem, updateItem, deleteItem }: any) => {
  const [uploading, setUploading] = React.useState<number | null>(null);

  const handleImageUpload = async (certId: number, file: File) => {
    setUploading(certId);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        updateItem('certifications', certId, { image: result.path });
        alert(`Image uploaded successfully!\nPath: ${result.path}`);
      } else {
        alert('Upload failed. Next.js API for upload not implemented yet.');
      }
    } catch (error) {
      alert('Upload failed.');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div>
      <SecHead title="Certifications" sub={`${data?.certifications?.length ?? 0} total · ★ = home page`} right={<AddBtn onClick={() => addItem('certifications')} label="Add" />} />
      <CertGrid data={data} updateItem={updateItem} deleteItem={deleteItem} handleImageUpload={handleImageUpload} uploading={uploading} />
    </div>
  );
};

const CertGrid = ({ data, updateItem, deleteItem, handleImageUpload, uploading }: any) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(null);
  const list = (data?.certifications ?? []).filter((c: any) => !query || `${c.name} ${c.issuer}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <div className="relative mb-2">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter certs... (name, issuer)" className={`${inputCls} !pl-8`} />
      </div>
      <div className="grid md:grid-cols-2 gap-1.5">
        {list.map((cert: any) => (
          <div key={cert.id} className={cardCls}>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <button type="button" onClick={() => setOpenId(openId === cert.id ? null : cert.id)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                {openId === cert.id ? <ChevronDown size={14} className="text-muted shrink-0" /> : <ChevronRight size={14} className="text-muted shrink-0" />}
                <span onClick={(e) => { if (cert.image) { e.stopPropagation(); setPreview({ src: cert.image, title: cert.name }); } }} className={cert.image ? 'cursor-zoom-in' : ''}>
                  <Thumb src={cert.image} alt={cert.name} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.8rem] font-semibold text-primary truncate leading-tight">{cert.name || 'Untitled'}</span>
                  <span className="block font-mono text-[0.6rem] text-muted truncate">{cert.issuer}{cert.featured ? ' · ★' : ''}</span>
                </span>
              </button>
              <button type="button" title="Featured" onClick={() => updateItem('certifications', cert.id, { featured: !cert.featured })} className={`p-1.5 rounded-lg border transition-all shrink-0 ${cert.featured ? 'border-accent-new/60 text-accent-new bg-accent-new/10' : 'border-border-new/60 text-muted hover:text-accent-new'}`}>
                <Star size={12} className={cert.featured ? 'fill-current' : ''} />
              </button>
              <button type="button" title="Delete" onClick={() => deleteItem('certifications', cert.id)} className="p-1.5 rounded-lg border border-border-new/60 text-muted hover:!text-red-500 hover:!border-red-400 transition-all shrink-0"><Trash2 size={12} /></button>
            </div>
            {openId === cert.id && (
            <div className="px-2 pb-2 pt-1.5 border-t border-border-new/40 grid grid-cols-2 gap-1.5">
              <Field label="Name" span><TI value={cert.name} onChange={(v: any) => updateItem('certifications', cert.id, { name: v })} /></Field>
              <Field label="Issuer"><TI value={cert.issuer} onChange={(v: any) => updateItem('certifications', cert.id, { issuer: v })} /></Field>
              <Field label="Date"><TI value={cert.date} onChange={(v: any) => updateItem('certifications', cert.id, { date: v })} ph="2025" /></Field>
              <Field label="Credential ID" span><TI value={cert.credentialId} onChange={(v: any) => updateItem('certifications', cert.id, { credentialId: v })} /></Field>
              <Field label="Verify link" span><TI value={cert.link} onChange={(v: any) => updateItem('certifications', cert.id, { link: v })} ph="https://..." /></Field>
              <Field label="Image path" span>
                <div className="flex gap-1.5">
                  <div className="flex-1"><TI value={cert.image} onChange={(v: any) => updateItem('certifications', cert.id, { image: v })} ph="/data_images/xyz.jpg" /></div>
                  <label className={`px-2 py-1.5 rounded-lg text-[0.7rem] transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${uploading === cert.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                    {uploading === cert.id ? <Loader className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading === cert.id} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(cert.id, f); }} />
                  </label>
                  {cert.image ? <button type="button" onClick={() => setPreview({ src: cert.image, title: cert.name })} className="px-2 rounded-lg border border-border-new/60 text-[0.7rem] text-muted hover:text-accent-new hover:border-accent-new/50 shrink-0">View</button> : null}
                </div>
              </Field>
            </div>
            )}
          </div>
        ))}
      </div>
      <PreviewModal src={preview?.src ?? null} title={preview?.title ?? ''} onClose={() => setPreview(null)} />
    </>
  );
};

const EducationSection = ({ data, addItem, updateItem, deleteItem }: any) => {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
  <div>
    <SecHead title="Education" sub={`${data?.education?.length ?? 0} entries`} right={<AddBtn onClick={() => addItem('education')} label="Add" />} />
    <div className="grid md:grid-cols-2 gap-1.5">
      {data?.education?.map((edu: any) => (
        <div key={edu.id} className={cardCls}>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <button type="button" onClick={() => setOpenId(openId === edu.id ? null : edu.id)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
              {openId === edu.id ? <ChevronDown size={14} className="text-muted shrink-0" /> : <ChevronRight size={14} className="text-muted shrink-0" />}
              <span className="min-w-0 flex-1">
                <span className="block text-[0.8rem] font-semibold text-primary truncate leading-tight">{edu.degree || 'Untitled'}</span>
                <span className="block font-mono text-[0.6rem] text-muted truncate">{edu.school} · {edu.period}</span>
              </span>
            </button>
            <button type="button" title="Delete" onClick={() => deleteItem('education', edu.id)} className="p-1.5 rounded-lg border border-border-new/60 text-muted hover:!text-red-500 hover:!border-red-400 transition-all shrink-0"><Trash2 size={12} /></button>
          </div>
          {openId === edu.id && (
          <div className="px-2 pb-2 pt-1.5 border-t border-border-new/40 grid grid-cols-2 gap-1.5">
            <Field label="Degree" span><TI value={edu.degree} onChange={(v: any) => updateItem('education', edu.id, { degree: v })} /></Field>
            <Field label="School"><TI value={edu.school} onChange={(v: any) => updateItem('education', edu.id, { school: v })} /></Field>
            <Field label="Period"><TI value={edu.period} onChange={(v: any) => updateItem('education', edu.id, { period: v })} /></Field>
            <Field label="Location" span><TI value={edu.location} onChange={(v: any) => updateItem('education', edu.id, { location: v })} /></Field>
            <Field label="Description" span><TA value={edu.description} onChange={(v: any) => updateItem('education', edu.id, { description: v })} rows={2} /></Field>
            <Field label="Achievements (comma)" span><TI value={arr2str(edu.achievements)} onChange={(v: string) => updateItem('education', edu.id, { achievements: str2arr(v) })} /></Field>
          </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

// Reusable Input Components
const TextAreaField = ({ label, value, onChange, rows = 3, className = '' }: any) => (
  <div className={className}>
    <label className="block text-sm font-medium text-primary mb-2">{label}</label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full border-2 border-card rounded-lg px-4 py-2.5 focus:border-primary-500 focus:outline-none transition-colors resize-none bg-card text-primary"
    />
  </div>
);

const InputField = ({ label, value, onChange, type = 'text', className = '' }: any) => (
  <div className={className}>
    <label className="block text-sm font-medium text-primary mb-2">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-2 border-card rounded-lg px-4 py-2.5 focus:border-primary-500 focus:outline-none transition-colors bg-card text-primary"
    />
  </div>
);

export default AdminPanel;