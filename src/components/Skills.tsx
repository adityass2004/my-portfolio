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
    <section
      id="skills"
      className="mobile-padding section-bg-alt relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary-500/5 to-primary-500/5 rounded-full blur-3xl"
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
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-primary-500" />
            My <span className="gradient-text">Skills</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-secondary max-w-2xl sm:max-w-3xl mx-auto px-4"
          >
            Specializing in Backend development and full-stack React
            applications
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {skills.categories.map((category, categoryIndex) => {
            const IconComponent = iconMap[category.name] || Code;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="bg-card border border-card rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-primary">
                      {category.name}
                    </h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-secondary text-xs sm:text-sm font-medium">
                            {skill.name}
                          </span>
                          <span className="text-primary-500 text-xs sm:text-sm font-medium">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-1.5 sm:h-2 relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${skill.level}%` } : {}}
                            transition={{
                              duration: 1,
                              delay: categoryIndex * 0.1 + skillIndex * 0.05,
                            }}
                            className={`h-1.5 sm:h-2 bg-gradient-to-r ${skill.color} rounded-full relative`}
                          >
                            <motion.div
                              animate={{
                                opacity: [0.5, 1, 0.5],
                                scale: [1, 1.02, 1],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-white/20 rounded-full"
                            />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 sm:mt-16"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-primary text-center mb-6 sm:mb-8 flex items-center justify-center">
            <Globe className="w-6 h-6 mr-2 text-primary-500" />
            Technical <span className="gradient-text">Stack</span>
          </h3>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              "C++",
              "JavaScript",
              "Python",
              "HTML",
              "CSS",
              "React.js",
              "Next.js",
              "Node.js",
              "Express.js",
              "Tailwind CSS",
              "MongoDB",
              "MySQL",
              "PostgreSQL",
              "Git",
              "Firebase",
              "Netlify",
              "AWS (basic)",
              "REST APIs",
              "Jupyter",
              "Prisma",
              "JWT",
              "Vercel",
              "NPM",
              "Flutter",
              "TypeScript",
              /* Skills not in resume commented out:
              , 'Docker',  'SASS', 'Redux', 
              'MobX', 'Jest', 'Cypress', 'Webpack', 'Vite', 'Yarn',
              'Microservices', 'OAuth', 'Socket.io',
              'WebSockets', 'GraphQL', 'Apollo', 'Prisma', 'TypeORM',
              'Redis', 'Elasticsearch', 'Heroku', 'DigitalOcean',
              'Kubernetes', 'Jenkins', 'GitHub Actions', 'CircleCI'
              */
            ].map((skill, index) => {
              const techInfo = techIconMap[skill];
              const IconComponent = techInfo ? techInfo.icon : Code;
              const bgColor = techInfo ? techInfo.bgColor : "bg-gray-500";
              const textColor = techInfo ? techInfo.textColor : "text-white";

              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.02 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${bgColor} ${textColor} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    {skill}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
