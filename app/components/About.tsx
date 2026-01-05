import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Code, Coffee, User, Star, Target, Zap, LucideIcon } from 'lucide-react';
import { getPersonalInfo, PersonalInfo } from '../data/portfolioService';

const About: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getPersonalInfo().then(data => {
      setPersonalInfo(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load personal info:', error);
      setLoading(false);
    });
  }, []);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (loading || !personalInfo) {
    return <div>Loading...</div>;
  }

  const stats: any[] = []; // Empty stats array since not in JSON

  const iconMap: { [key: string]: LucideIcon } = {
    Award: Award,
    Users: Users,
    Code: Code,
    Coffee: Coffee,
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="mobile-padding section-bg">
      <div className="max-w-7xl mx-auto mobile-optimized">
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
            <User className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-primary-500" />
            About <span className="gradient-text">Me</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-secondary max-w-2xl sm:max-w-3xl mx-auto px-4"
          >
            {personalInfo.subtitle}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Column - Image and Stats */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Profile Image */}
            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-xl opacity-30"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full p-2">
                  <div className="w-full h-full bg-card rounded-full overflow-hidden">
                    <img
                      src={personalInfo.profileImage}
                      alt={personalInfo.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const nextSibling = target.nextSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center text-4xl sm:text-6xl font-bold gradient-text" style={{ display: 'none' }}>
                      {personalInfo.avatar}
                    </div>
                  </div>
                </div>
                {/* Floating elements around avatar */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary-500/20 rounded-full"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon ? iconMap[stat.icon] : undefined;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-4 sm:p-6 bg-card border border-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative">
                      {IconComponent && (
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full opacity-60"
                      />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-secondary">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-primary-500" />
              Turning Ideas Into <span className="gradient-text">Reality</span>
            </h3>
            
            <p className="text-secondary leading-relaxed mb-4 sm:mb-6 mobile-text">
              {personalInfo.bio}
            </p>
            
            {personalInfo.about.map((paragraph, index) => (
              <p key={index} className="text-secondary leading-relaxed mb-4 sm:mb-6 mobile-text">
                {paragraph}
              </p>
            ))}

            <div className="space-y-3 sm:space-y-4">
              {personalInfo.specialties.map((specialty, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 ${index % 2 === 0 ? 'bg-primary-500' : 'bg-secondary-500'} rounded-full`}></div>
                  <span className="text-secondary mobile-text">{specialty}</span>
                  {index === 0 && <Star className="w-4 h-4 text-yellow-500 ml-auto" />}
                  {index === 1 && <Zap className="w-4 h-4 text-blue-500 ml-auto" />}
                  {index === 2 && <Code className="w-4 h-4 text-green-500 ml-auto" />}
                  {index === 3 && <Target className="w-4 h-4 text-purple-500 ml-auto" />}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 sm:px-8 py-3 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
            >
              <User className="w-4 h-4 mr-2" />
              Learn More About Me
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
