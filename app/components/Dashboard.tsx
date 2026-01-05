'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Home,
  FolderOpen,
  Code,
  BarChart3,
  FileText,
  Mail,
  Menu,
  X,
  Github,
  ExternalLink,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Star,
  GitBranch,
  Database,
  Server,
//   Docker,
  Zap
} from 'lucide-react';
import { loadPortfolioData, PortfolioData } from '../data/portfolioService';
import ThemeToggle from './ThemeToggle';

interface GithubData {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  publicRepos: number;
  stars: number;
  profileUrl: string;
  contributions: Array<{ date: string; count: number; level: number }>;
}

interface LeetCodeData {
  name: string;
  avatar: string;
  country: string;
  ranking: number;
  star: number;
  solved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  submissions: number;
  profileUrl: string;
  monthlySubmissions: Array<{
    month: string;
    submissions: number;
    monthName: string;
  }>;
}

interface SidebarItem {
  name: string;
  icon: React.ComponentType<any>;
  href: string;
}

interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  type: 'internship' | 'project' | 'certification' | 'hackathon';
}

const Dashboard: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [githubData, setGithubData] = useState<GithubData | null>(null);
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPortfolioData().then(data => {
      setPortfolioData(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load portfolio data:', error);
      setLoading(false);
    });
  }, []);

  if (loading || !portfolioData) {
    return <div>Loading...</div>;
  }

  const { personalInfo, projects, skills, experience, certifications } = portfolioData;

  const sidebarItems: SidebarItem[] = [
    { name: 'Home', icon: Home, href: '#home' },
    { name: 'Projects', icon: FolderOpen, href: '#projects' },
    { name: 'GitHub Repos', icon: Github, href: '/github-repos' },
    { name: 'Skills', icon: Code, href: '#skills' },
    { name: 'Analytics', icon: BarChart3, href: '#analytics' },
    { name: 'Resume', icon: FileText, href: '#resume' },
    { name: 'Contact', icon: Mail, href: '#contact' },
  ];

  // Fetch API data on component mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setApiLoading(true);
        setApiError(null);

        // Extract GitHub username from personalInfo.github
        let ghUsername = "";
        try {
          const url = new URL(personalInfo.github);
          ghUsername = url.pathname.replace(/\//g, "");
        } catch {
          ghUsername = personalInfo.github.split("/").pop() || "";
        }

        // Extract LeetCode username from personalInfo.leetcode
        let lcUsername = "";
        try {
          const url = new URL(personalInfo.leetcode);
          const parts = url.pathname.split("/").filter(Boolean);
          lcUsername = parts[0] === "u" && parts.length >= 2 ? parts[1] : parts[0] || "";
        } catch {
          lcUsername = personalInfo.leetcode.split("/").pop() || "";
        }

        // Fetch GitHub data
        if (ghUsername) {
          try {
            const githubRes = await fetch(`/api/github?username=${encodeURIComponent(ghUsername)}`);
            if (githubRes.ok) {
              const githubData = await githubRes.json();
              setGithubData(githubData);
            }
          } catch (error) {
            console.warn("Failed to fetch GitHub data:", error);
          }
        }

        // Fetch LeetCode data
        if (lcUsername) {
          try {
            const leetcodeRes = await fetch(`/api/leetcode?username=${encodeURIComponent(lcUsername)}`);
            if (leetcodeRes.ok) {
              const leetcodeData = await leetcodeRes.json();
              setLeetcodeData(leetcodeData);
            }
          } catch (error) {
            console.warn("Failed to fetch LeetCode data:", error);
          }
        }

      } catch (error) {
        console.error("Error fetching API data:", error);
        setApiError("Failed to load some data from external APIs");
      } finally {
        setApiLoading(false);
      }
    };

    fetchApiData();
  }, []);

  // Calculate metrics from real data
  const metrics = {
    totalProjects: projects.length,
    githubRepos: githubData?.publicRepos ?? 0,
    leetcodeSolved: leetcodeData?.solved.total ?? 0,
    experienceYears: Math.max(1, Math.floor((new Date().getFullYear() - new Date(experience[0]?.period.split(' - ')[0] || '2023').getFullYear()))),
    githubStars: githubData?.stars ?? 0,
    monthlyContributions: githubData?.contributions?.reduce((sum, contrib) => sum + contrib.count, 0) ?? 0
  };

  // Transform skills data for dashboard
  const dashboardSkills: Skill[] = skills.categories.flatMap(category =>
    category.skills.map(skill => ({
      name: skill.name,
      level: skill.level,
      category: category.name
    }))
  );

  // Transform projects data for dashboard
  const dashboardProjects: Project[] = projects
    .filter(project => project.featured)
    .slice(0, 3)
    .map(project => ({
      name: project.title,
      description: project.description,
      techStack: project.technologies,
      githubUrl: project.github,
      liveUrl: project.live || undefined,
      featured: project.featured
    }));

  // Transform experience data for dashboard
  const dashboardExperiences: Experience[] = [
    ...experience.map(exp => ({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      type: 'internship' as const
    })),
    ...certifications
      .filter(cert => cert.featured)
      .slice(0, 2)
      .map(cert => ({
        title: cert.name,
        company: cert.issuer,
        period: cert.date,
        description: `Certification: ${cert.name}`,
        type: 'certification' as const
      }))
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) {
      // It's a route, navigate to it
      router.push(href);
    } else {
      // It's an anchor, scroll to it
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-70 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 z-50 shadow-xl"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AS</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">Portfolio</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-primary-500 transition-all duration-200"
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2024 Portfolio Dashboard
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-70">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-700 px-4 lg:px-8 py-4 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl lg:text-2xl font-bold gradient-text">
                  {personalInfo.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Backend Developer | Node.js | System Design
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  Open to Opportunities
                </span>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8 space-y-8">
          {/* API Loading/Error State */}
          {apiError && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="text-yellow-600 dark:text-yellow-400">⚠️</div>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">{apiError}</p>
              </div>
            </div>
          )}

          {/* Overview Metrics */}
          <section id="home">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Key metrics and performance indicators
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Projects"
                value={metrics.totalProjects}
                icon={FolderOpen}
                trend="Active"
                color="blue"
                loading={false}
              />
              <MetricCard
                title="GitHub Repos"
                value={apiLoading ? "..." : metrics.githubRepos}
                icon={Github}
                trend={apiLoading ? "Loading" : "+8%"}
                color="purple"
                loading={apiLoading}
              />
              <MetricCard
                title="Problems Solved"
                value={apiLoading ? "..." : metrics.leetcodeSolved}
                icon={Target}
                trend={apiLoading ? "Loading" : "+25%"}
                color="green"
                loading={apiLoading}
              />
              <MetricCard
                title="Experience"
                value={`${metrics.experienceYears}+ Years`}
                icon={Calendar}
                trend="Active"
                color="orange"
                loading={false}
              />
            </div>
          </section>

          {/* Contribution Analytics */}
          <section id="analytics">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Contribution Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                GitHub activity and coding patterns
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    GitHub Contribution Heatmap
                  </h3>
                  {githubData?.contributions && githubData.contributions.length > 0 ? (
                    <ContributionChart contributions={githubData.contributions} />
                  ) : (
                    <div className="text-center py-8">
                      <Github size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {apiLoading ? "Loading contribution data..." : "No contribution data available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Language Usage
                  </h3>
                  <div className="space-y-3">
                    {dashboardSkills
                      .filter(skill => skill.category === 'Programming Languages')
                      .slice(0, 4)
                      .map((skill, index) => (
                        <LanguageBar
                          key={index}
                          name={skill.name}
                          percentage={skill.level}
                          color={getLanguageColor(skill.name)}
                        />
                      ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    LeetCode Monthly Progress
                  </h3>
                  {leetcodeData?.monthlySubmissions && leetcodeData.monthlySubmissions.length > 0 ? (
                    <MonthlyChart data={leetcodeData.monthlySubmissions} />
                  ) : (
                    <div className="text-center py-8">
                      <Target size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {apiLoading ? "Loading monthly data..." : "No monthly submission data available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Projects Snapshot */}
          <section id="projects">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Projects
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Highlighted work and technical implementations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </section>

          {/* Skills Intelligence */}
          <section id="skills">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Skills Intelligence
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Technical expertise and proficiency levels
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Backend & Databases
                </h3>
                <div className="space-y-4">
                  {dashboardSkills.filter(skill => ['Backend & Databases', 'Computer Science Fundamentals'].includes(skill.category)).map((skill, index) => (
                    <SkillBar key={index} skill={skill} />
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  DevOps & Tools
                </h3>
                <div className="space-y-4">
                  {dashboardSkills.filter(skill => ['Tools & Platforms', 'Programming Languages', 'Frontend Development'].includes(skill.category)).map((skill, index) => (
                    <SkillBar key={index} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Problem Solving & Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problem Solving */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Problem Solving
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  DSA and algorithmic proficiency
                </p>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {leetcodeData?.solved.easy ?? 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Easy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500 mb-1">
                      {leetcodeData?.solved.medium ?? 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500 mb-1">
                      {leetcodeData?.solved.hard ?? 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Hard</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="text-yellow-500" size={20} />
                    <span className="font-medium text-gray-900 dark:text-white">Total Solved</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-500">
                    {leetcodeData?.solved.total ?? 0}
                  </span>
                </div>
              </div>
            </section>

            {/* Experience Timeline */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Experience Timeline
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Career milestones and achievements
                </p>
              </div>

              <div className="space-y-4">
                {dashboardExperiences.map((exp, index) => (
                  <ExperienceCard key={index} experience={exp} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

// Component Definitions
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  trend: string;
  color: string;
  loading?: boolean;
}> = ({ title, value, icon: Icon, trend, color, loading = false }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={24} className="text-white" />
        </div>
        <span className={`text-sm font-medium ${loading ? 'text-gray-400' : 'text-green-600 dark:text-green-400'}`}>
          {trend}
        </span>
      </div>
      <div className="space-y-1">
        <p className={`text-2xl font-bold ${loading ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {value}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
};

const LanguageBar: React.FC<{ name: string; percentage: number; color: string }> = ({ name, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-700 dark:text-gray-300">{name}</span>
      <span className="text-gray-500 dark:text-gray-400">{percentage}%</span>
    </div>
    <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full">
      <div
        className="h-2 rounded-full transition-all duration-1000"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
      <div className="flex space-x-2">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <Github size={16} />
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>

    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
      {project.description}
    </p>

    <div className="flex flex-wrap gap-2">
      {project.techStack.map((tech, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
        >
          {tech}
        </span>
      ))}
    </div>
  </motion.div>
);

const SkillBar: React.FC<{ skill: Skill }> = ({ skill }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
      <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
    </div>
    <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${skill.level}%` }}
        transition={{ duration: 1, delay: 0.1 }}
        className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
      ></motion.div>
    </div>
  </div>
);

const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'internship': return <Star className="text-blue-500" size={20} />;
      case 'project': return <GitBranch className="text-green-500" size={20} />;
      case 'certification': return <Trophy className="text-yellow-500" size={20} />;
      case 'hackathon': return <Target className="text-purple-500" size={20} />;
      default: return <Calendar className="text-gray-500" size={20} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex space-x-4 p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700"
    >
      <div className="flex-shrink-0">
        {getIcon(experience.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {experience.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {experience.company} • {experience.period}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {experience.description}
        </p>
      </div>
    </motion.div>
  );
};

function getLanguageColor(languageName: string): string {
  const colorMap: Record<string, string> = {
    'JavaScript': '#f7df1e',
    'TypeScript': '#3178c6',
    'Python': '#3776ab',
    'C++': '#00599c',
    'HTML': '#e34f26',
    'CSS': '#1572b6',
    'Java': '#007396',
    'Go': '#00add8',
    'Rust': '#000000',
    'PHP': '#777bb4',
    'Ruby': '#cc342d',
    'Swift': '#fa7343',
    'Kotlin': '#7f52ff',
    'Dart': '#00b4ab',
    'SQL': '#336791'
  };

  return colorMap[languageName] || '#6b7280'; // Default gray color
}

function ContributionChart({ contributions }: { contributions: Array<{ date: string; count: number; level: number }> }) {
  // Group contributions by month and week
  const monthlyData = processContributions(contributions);

  return (
    <div style={{ overflowX: "auto", padding: "1rem 0" }}>
      <div style={{ display: "flex", gap: "4px", minWidth: "800px" }}>
        {monthlyData.map((month, monthIndex) => (
          <div key={monthIndex} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {/* Month label */}
            <div style={{ height: "20px", display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  transform: "rotate(-45deg)",
                  transformOrigin: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {month.monthName}
              </span>
            </div>

            {/* Week cells */}
            {month.weeks.map((week, weekIndex) => (
              <div key={weekIndex} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      backgroundColor: getContributionColor(day.level),
                      border: "1px solid rgba(148,163,184,0.2)",
                    }}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "2px",
              backgroundColor: getContributionColor(level),
              border: "1px solid rgba(148,163,184,0.2)",
            }}
          />
        ))}
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>More</span>
      </div>
    </div>
  );
}

function MonthlyChart({ data }: { data: Array<{ month: string; submissions: number; monthName: string }> }) {
  const maxSubmissions = Math.max(...data.map(d => d.submissions));
  const chartHeight = 200;
  const chartWidth = 600;
  const barWidth = chartWidth / data.length - 10;

  return (
    <div style={{ overflowX: "auto", padding: "1rem 0" }}>
      <svg
        width={chartWidth}
        height={chartHeight + 40}
        style={{ minWidth: chartWidth }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartHeight - (ratio * chartHeight);
          const value = Math.round(maxSubmissions * ratio);
          return (
            <g key={i}>
              <line
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="rgba(148,163,184,0.2)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x={-10}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.submissions / maxSubmissions) * chartHeight;
          const x = index * (chartWidth / data.length) + 5;
          const y = chartHeight - barHeight;

          return (
            <g key={item.month}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#gradient)"
                rx="4"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(168,85,247,0.3))"
                }}
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight + 15}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
                transform={`rotate(45, ${x + barWidth / 2}, ${chartHeight + 15})`}
              >
                {item.monthName}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#a855f7"
              >
                {item.submissions}
              </text>
            </g>
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function processContributions(contributions: Array<{ date: string; count: number; level: number }>) {
  const monthlyData: Array<{
    monthName: string;
    weeks: Array<Array<{ date: string; count: number; level: number }>>;
  }> = [];

  // Group by month
  const contributionsByMonth: Record<string, Array<{ date: string; count: number; level: number }>> = {};
  contributions.forEach((contrib) => {
    const date = new Date(contrib.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!contributionsByMonth[monthKey]) {
      contributionsByMonth[monthKey] = [];
    }
    contributionsByMonth[monthKey].push(contrib);
  });

  // Process each month
  Object.keys(contributionsByMonth)
    .sort()
    .slice(-12) // Last 12 months
    .forEach((monthKey) => {
      const monthContributions = contributionsByMonth[monthKey];
      const monthName = new Date(monthKey + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit'
      });

      // Group by weeks
      const weeks: Array<Array<{ date: string; count: number; level: number }>> = [];
      let currentWeek: Array<{ date: string; count: number; level: number }> = [];

      monthContributions.forEach((contrib) => {
        const date = new Date(contrib.date);
        const dayOfWeek = date.getDay(); // 0 = Sunday

        // Start new week on Sunday
        if (dayOfWeek === 0 && currentWeek.length > 0) {
          weeks.push([...currentWeek]);
          currentWeek = [];
        }

        currentWeek.push({
          date: contrib.date,
          count: contrib.count,
          level: contrib.level
        });
      });

      // Add remaining days
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }

      monthlyData.push({
        monthName,
        weeks
      });
    });

  return monthlyData;
}

function getContributionColor(level: number): string {
  switch (level) {
    case 0: return "#161b22"; // No contributions
    case 1: return "#0e4429"; // Light green
    case 2: return "#006d32"; // Medium green
    case 3: return "#26a641"; // Bright green
    case 4: return "#39d353"; // Very bright green
    default: return "#161b22";
  }
}

export default Dashboard;