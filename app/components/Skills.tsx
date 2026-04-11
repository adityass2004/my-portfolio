import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code,
  Cloud,
  Palette,
  Server,
  Brain,
  Globe,
  Settings,
  Github,
  ExternalLink,
  Database as DatabaseIcon,
  ShieldCheck,
  Zap,
  Smartphone,
} from "lucide-react";
import { getSkills, SkillsData } from "../data/portfolioService";

interface TechIconInfo {
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    getSkills()
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load skills:", error);
        setLoading(false);
      });
  }, []);

  if (loading || !skills) {
    return <div>Loading...</div>;
  }

  const iconMap: Record<string, React.ElementType> = {
    "Frontend Development": Palette,
    "Backend Development": Server,
    "Tools & Technologies": Settings,
    DBMS: DatabaseIcon, // Added to match resume section
  };

  const techIconMap: Record<string, TechIconInfo> = {
    GitHub: { icon: Github, bgColor: "bg-black", textColor: "text-white" },
    Netlify: {
      icon: ExternalLink,
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    Vercel: {
      icon: ExternalLink,
      bgColor: "bg-black",
      textColor: "text-white",
    }, // Added
    Firebase: {
      icon: Cloud,
      bgColor: "bg-orange-500",
      textColor: "text-white",
    },
    MySQL: {
      icon: DatabaseIcon,
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
    PostgreSQL: {
      icon: DatabaseIcon,
      bgColor: "bg-blue-600",
      textColor: "text-white",
    },
    MongoDB: {
      icon: DatabaseIcon,
      bgColor: "bg-green-600",
      textColor: "text-white",
    },
    Prisma: { icon: Zap, bgColor: "bg-slate-700", textColor: "text-white" }, // Added
    JWT: {
      icon: ShieldCheck,
      bgColor: "bg-purple-600",
      textColor: "text-white",
    }, // Added
    OAuth: {
      icon: ShieldCheck,
      bgColor: "bg-blue-500",
      textColor: "text-white",
    },
    "AWS (basic)": {
      icon: Cloud,
      bgColor: "bg-orange-500",
      textColor: "text-white",
    },
    "React.js": { icon: Code, bgColor: "bg-blue-500", textColor: "text-white" },
    "Next.js": { icon: Code, bgColor: "bg-black", textColor: "text-white" },
    "Node.js": {
      icon: Server,
      bgColor: "bg-green-600",
      textColor: "text-white",
    },
    "Express.js": {
      icon: Server,
      bgColor: "bg-gray-800",
      textColor: "text-white",
    },
    Python: { icon: Code, bgColor: "bg-blue-600", textColor: "text-white" },
    "C++": { icon: Code, bgColor: "bg-blue-700", textColor: "text-white" },
    JavaScript: {
      icon: Code,
      bgColor: "bg-yellow-500",
      textColor: "text-black",
    },
    TypeScript: { icon: Code, bgColor: "bg-blue-600", textColor: "text-white" }, // Added
    HTML: { icon: Code, bgColor: "bg-orange-500", textColor: "text-white" },
    CSS: { icon: Code, bgColor: "bg-blue-500", textColor: "text-white" },
    "Tailwind CSS": {
      icon: Palette,
      bgColor: "bg-cyan-500",
      textColor: "text-white",
    },
    Git: { icon: Settings, bgColor: "bg-orange-600", textColor: "text-white" },
    NPM: { icon: Settings, bgColor: "bg-red-500", textColor: "text-white" }, // Added
    Flutter: {
      icon: Smartphone,
      bgColor: "bg-blue-400",
      textColor: "text-white",
    }, // Added
    "REST APIs": {
      icon: Server,
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    Jupyter: { icon: Brain, bgColor: "bg-orange-400", textColor: "text-white" },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="skills" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">02</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">Skills & Expertise</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 fade-in visible">
        {skills.categories.map((category) => (
          <motion.div 
            key={category.name}
            whileHover={{ y: -5 }}
            className="bg-white/5 backdrop-blur-sm border border-border-new/40 p-8 rounded-2xl hover:border-accent-new/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent-new/10 rounded-xl flex items-center justify-center text-accent-new group-hover:bg-accent-new group-hover:text-white transition-all duration-300">
                {React.createElement(iconMap[category.name] || Code, { size: 24 })}
              </div>
              <h3 className="font-serif text-xl text-ink">{category.name}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span 
                  key={skill.name} 
                  className="font-mono text-[0.7rem] text-muted border border-border-new/30 px-3 py-1 rounded-full group-hover:border-accent-new/20 transition-colors"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fade-in visible">
        <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted mb-6 flex items-center gap-4">
          <span className="h-[1px] w-8 bg-border-new"></span>
          Full Technical Stack
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            "C++", "JavaScript", "Python", "HTML", "CSS", "React.js", "Next.js", 
            "Node.js", "Express.js", "Tailwind CSS", "MongoDB", "MySQL", 
            "PostgreSQL", "Git", "Firebase", "Netlify", "AWS (basic)", 
            "REST APIs", "Jupyter", "Prisma", "JWT", "Vercel", "NPM", 
            "Flutter", "TypeScript"
          ].map((skill) => (
            <span key={skill} className="pill rounded-full px-4 py-2 hover:bg-accent-new/5 hover:border-accent-new/30 transition-all cursor-default shadow-sm">{skill}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
