// Data service for loading portfolio data from JSON
export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  avatar: string;
  profileImage: string;
  heroImage: string;
  favicon: string;
  bio: string;
  about: string[];
  specialties: string[];
  resumeLink: string;
  cvLink: string;
  leetcode: string;
}

export interface Skill {
  name: string;
  level: number;
  color: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  live: string;
  category: string;
  featured: boolean;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  image: string;
  featured: boolean;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  link: string;
  image: string;
  featured: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  availability: string;
  responseTime: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: SkillsData;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  contactInfo: ContactInfo;
}

let portfolioData: PortfolioData | null = null;

export const loadPortfolioData = async (): Promise<PortfolioData> => {
  if (portfolioData) {
    return portfolioData;
  }

  try {
    const response = await fetch('/portfolioData.json');
    if (!response.ok) {
      throw new Error('Failed to load portfolio data');
    }
    portfolioData = await response.json();
    return portfolioData!;
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    throw error;
  }
};

// Individual data getters
export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const data = await loadPortfolioData();
  return data.personalInfo;
};

export const getProjects = async (): Promise<Project[]> => {
  const data = await loadPortfolioData();
  return data.projects;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter(project => project.featured);
};

export const getExperience = async (): Promise<Experience[]> => {
  const data = await loadPortfolioData();
  return data.experience;
};

export const getEducation = async (): Promise<Education[]> => {
  const data = await loadPortfolioData();
  return data.education;
};

export const getCertifications = async (): Promise<Certification[]> => {
  const data = await loadPortfolioData();
  return data.certifications;
};

export const getSkills = async (): Promise<SkillsData> => {
  const data = await loadPortfolioData();
  return data.skills;
};

export const getContactInfo = async (): Promise<ContactInfo> => {
  const data = await loadPortfolioData();
  return data.contactInfo;
};

// Export portfolioService object for compatibility
export const portfolioService = {
  getPortfolioData: loadPortfolioData,
  getPersonalInfo,
  getProjects,
  getFeaturedProjects,
  getExperience,
  getEducation,
  getCertifications,
  getSkills,
  getContactInfo
};

// All data is loaded from JSON - no legacy exports