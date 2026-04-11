'use client';

import React, { useState, useEffect } from 'react';
import { Save, LogOut, Edit2, Trash2, Copy, Plus,  Check, AlertCircle, Loader, Upload } from 'lucide-react';

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
    { key: 'personalInfo', label: 'Personal Info', icon: '👤', count: null },
    { key: 'contactInfo', label: 'Contact', icon: '📧', count: null },
    { key: 'projects', label: 'Projects', icon: '💼', count: data?.projects?.length },
    { key: 'experience', label: 'Experience', icon: '🏢', count: data?.experience?.length },
    { key: 'certifications', label: 'Certifications', icon: '🏆', count: data?.certifications?.length },
    { key: 'education', label: 'Education', icon: '🎓', count: data?.education?.length }
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
      <div className="bg-card border-card sticky top-20 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">AS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Portfolio Admin</h1>
                <p className="text-sm text-secondary">Manage your portfolio content</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveData}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-card sticky top-[153px] z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-dark-800 text-secondary hover:bg-gray-200 dark:hover:bg-dark-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card border-card rounded-xl shadow-xl p-8">
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Name" value={data?.personalInfo?.name} onChange={(v: any) => updateField('personalInfo', 'name', v)} />
        <InputField label="Title" value={data?.personalInfo?.title} onChange={(v: any) => updateField('personalInfo', 'title', v)} />
        <InputField label="Subtitle" value={data?.personalInfo?.subtitle} onChange={(v: any) => updateField('personalInfo', 'subtitle', v)} className="md:col-span-2" />
        <InputField label="Avatar" value={data?.personalInfo?.avatar} onChange={(v: any) => updateField('personalInfo', 'avatar', v)} />
        <InputField label="GitHub URL" value={data?.personalInfo?.github} onChange={(v: any) => updateField('personalInfo', 'github', v)} />
        <InputField label="LinkedIn URL" value={data?.personalInfo?.linkedin} onChange={(v: any) => updateField('personalInfo', 'linkedin', v)} />
        <InputField label="LeetCode URL" value={data?.personalInfo?.leetcode} onChange={(v: any) => updateField('personalInfo', 'leetcode', v)} />
        
        {/* Resume Upload Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary mb-2">Resume/CV</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <InputField label="" value={data?.personalInfo?.resumeLink} onChange={(v: any) => updateField('personalInfo', 'resumeLink', v)} />
            </div>
            <div>
              <label className={`px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                uploadingResume ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}>
                {uploadingResume ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload PDF</>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  disabled={uploadingResume}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleResumeUpload(file);
                  }}
                />
              </label>
            </div>
          </div>
          {data?.personalInfo?.resumeLink && (
            <div className="mt-2">
              <a href={data.personalInfo.resumeLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                View Current Resume
              </a>
            </div>
          )}
        </div>
        
        <TextAreaField label="Bio" value={data?.personalInfo?.bio} onChange={(v: any) => updateField('personalInfo', 'bio', v)} className="md:col-span-2" rows={4} />
      </div>
    </div>
  );
};

const ContactInfoSection = ({ data, updateField, updateNestedField }: any) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField label="Email" type="email" value={data?.contactInfo?.email} onChange={(v: any) => updateField('contactInfo', 'email', v)} />
      <InputField label="Phone" value={data?.contactInfo?.phone} onChange={(v: any) => updateField('contactInfo', 'phone', v)} />
      <InputField label="Location" value={data?.contactInfo?.location} onChange={(v: any) => updateField('contactInfo', 'location', v)} />
      <InputField label="Availability" value={data?.contactInfo?.availability} onChange={(v: any) => updateField('contactInfo', 'availability', v)} />
      <div className="md:col-span-2 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="GitHub" value={data?.contactInfo?.social?.github} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'github', v)} />
          <InputField label="LinkedIn" value={data?.contactInfo?.social?.linkedin} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'linkedin', v)} />
          <InputField label="Instagram" value={data?.contactInfo?.social?.instagram} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'instagram', v)} />
          <InputField label="Twitter" value={data?.contactInfo?.social?.twitter} onChange={(v: any) => updateNestedField('contactInfo', 'social', 'twitter', v)} />
        </div>
      </div>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Projects</h2>
        <div className="flex gap-2">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="GitHub username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="px-3 py-2 border-2 border-card rounded-lg focus:border-primary-500 focus:outline-none bg-card text-primary"
            />
            <button
              onClick={fetchGitHubRepos}
              disabled={importing}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {importing ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {importing ? 'Loading...' : 'Fetch Repos'}
            </button>
          </div>
          <button
            onClick={() => addItem('projects')}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Project
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
    <div className="space-y-4">
      {data?.projects?.map((project: any) => (
        <div key={project.id} className={`border-2 rounded-xl p-6 transition-all ${
          editingItem === project.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-primary">{project.title || 'Untitled Project'}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(editingItem === project.id ? null : project.id)}
                className={`p-2 rounded-lg transition-colors ${
                  editingItem === project.id ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg'
                } text-white`}
              >
                {editingItem === project.id ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </button>
              <button onClick={() => duplicateItem('projects', project)} className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={() => deleteItem('projects', project.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {editingItem === project.id ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Title" value={project.title} onChange={(v: any) => updateItem('projects', project.id, { title: v })} />
              <InputField label="Category" value={project.category} onChange={(v: any) => updateItem('projects', project.id, { category: v })} />
              <TextAreaField label="Description" value={project.description} onChange={(v: any) => updateItem('projects', project.id, { description: v })} className="md:col-span-2" rows={3} />
              <InputField label="Image URL" value={project.image} onChange={(v: any) => updateItem('projects', project.id, { image: v })} />
              <InputField label="Technologies (comma-separated)" value={project.technologies?.join(', ')} onChange={(v: string) => updateItem('projects', project.id, { technologies: v.split(',').map((s: string) => s.trim()) })} />
              <InputField label="GitHub URL" value={project.github} onChange={(v: any) => updateItem('projects', project.id, { github: v })} />
              <InputField label="Live URL" value={project.live} onChange={(v: any) => updateItem('projects', project.id, { live: v })} />
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={project.featured} onChange={(e) => updateItem('projects', project.id, { featured: e.target.checked })} className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-primary">Featured Project</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-secondary">
              <p><strong className="text-primary">Category:</strong> {project.category}</p>
              <p><strong className="text-primary">Description:</strong> {project.description}</p>
              <p><strong className="text-primary">Technologies:</strong> {project.technologies?.join(', ')}</p>
              {project.featured && <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Featured</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

const ExperienceSection = ({ data, addItem, updateItem, deleteItem }: any) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-primary">Experience</h2>
      <button onClick={() => addItem('experience')} className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Experience
      </button>
    </div>
    <div className="space-y-4">
      {data?.experience?.map((exp: any) => (
        <div key={exp.id} className="border-2 border-card rounded-xl p-6 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Job Title" value={exp.title} onChange={(v: any) => updateItem('experience', exp.id, { title: v })} />
            <InputField label="Company" value={exp.company} onChange={(v: any) => updateItem('experience', exp.id, { company: v })} />
            <InputField label="Period" value={exp.period} onChange={(v: any) => updateItem('experience', exp.id, { period: v })} />
            <InputField label="Location" value={exp.location} onChange={(v: any) => updateItem('experience', exp.id, { location: v })} />
            <TextAreaField label="Description" value={exp.description} onChange={(v: any) => updateItem('experience', exp.id, { description: v })} className="md:col-span-2" rows={3} />
            <InputField label="Image URL" value={exp.image} onChange={(v: any) => updateItem('experience', exp.id, { image: v })} />
            <InputField label="Technologies (comma-separated)" value={exp.technologies?.join(', ')} onChange={(v: string) => updateItem('experience', exp.id, { technologies: v.split(',').map((s: string) => s.trim()) })} />
            <TextAreaField label="Achievements (comma-separated)" value={exp.achievements?.join(', ')} onChange={(v: string) => updateItem('experience', exp.id, { achievements: v.split(',').map((s: string) => s.trim()) })} className="md:col-span-2" rows={2} />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={exp.featured} onChange={(e) => updateItem('experience', exp.id, { featured: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm font-medium">Featured</span>
              </label>
              <button onClick={() => deleteItem('experience', exp.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Certifications</h2>
        <button onClick={() => addItem('certifications')} className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>
      <div className="space-y-4">
        {data?.certifications?.map((cert: any) => (
          <div key={cert.id} className="border-2 border-card rounded-xl p-6 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Name" value={cert.name} onChange={(v: any) => updateItem('certifications', cert.id, { name: v })} />
              <InputField label="Issuer" value={cert.issuer} onChange={(v: any) => updateItem('certifications', cert.id, { issuer: v })} />
              <InputField label="Date" value={cert.date} onChange={(v: any) => updateItem('certifications', cert.id, { date: v })} />
              <InputField label="Credential ID" value={cert.credentialId} onChange={(v: any) => updateItem('certifications', cert.id, { credentialId: v })} />
              <InputField label="Link" value={cert.link} onChange={(v: any) => updateItem('certifications', cert.id, { link: v })} className="md:col-span-2" />
              
              {/* Image Upload Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-2">Certificate Image</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <InputField label="" value={cert.image} onChange={(v: any) => updateItem('certifications', cert.id, { image: v })} />
                  </div>
                  <div>
                    <label className={`px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                      uploading === cert.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}>
                      {uploading === cert.id ? (
                        <><Loader className="w-4 h-4 animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> Upload</>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading === cert.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(cert.id, file);
                        }}
                      />
                    </label>
                  </div>
                </div>
                {cert.image && (
                  <div className="mt-2">
                    <img src={cert.image} alt="Preview" className="h-24 rounded border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 md:col-span-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={cert.featured} onChange={(e) => updateItem('certifications', cert.id, { featured: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm font-medium">Featured</span>
                </label>
                <button onClick={() => deleteItem('certifications', cert.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EducationSection = ({ data, addItem, updateItem, deleteItem }: any) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-primary">Education</h2>
      <button onClick={() => addItem('education')} className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Education
      </button>
    </div>
    <div className="space-y-4">
      {data?.education?.map((edu: any) => (
        <div key={edu.id} className="border-2 border-card rounded-xl p-6 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Degree" value={edu.degree} onChange={(v: any) => updateItem('education', edu.id, { degree: v })} />
            <InputField label="School" value={edu.school} onChange={(v: any) => updateItem('education', edu.id, { school: v })} />
            <InputField label="Period" value={edu.period} onChange={(v: any) => updateItem('education', edu.id, { period: v })} />
            <InputField label="Location" value={edu.location} onChange={(v: any) => updateItem('education', edu.id, { location: v })} />
            <TextAreaField label="Description" value={edu.description} onChange={(v: any) => updateItem('education', edu.id, { description: v })} className="md:col-span-2" rows={3} />
            <TextAreaField label="Achievements (comma-separated)" value={edu.achievements?.join(', ')} onChange={(v: string) => updateItem('education', edu.id, { achievements: v.split(',').map((s: string) => s.trim()) })} className="md:col-span-2" rows={2} />
            <div>
              <button onClick={() => deleteItem('education', edu.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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