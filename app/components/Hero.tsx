'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Eye, Code, Sparkles, X, LucideIcon } from 'lucide-react';
import { getPersonalInfo, getContactInfo, PersonalInfo, ContactInfo } from '../data/portfolioService';

interface SocialLink {
  icon: React.ComponentType<any>;
  href: string;
  label: string;
}

const Hero: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentText, setCurrentText] = useState<number>(0);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    Promise.all([getPersonalInfo(), getContactInfo()]).then(([personal, contact]) => {
      setPersonalInfo(personal);
      setContactInfo(contact);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load data:', error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!personalInfo) return;
    const texts = [
      personalInfo.title,
      'Flutter App Developer',
      'Backend & Database Engineer',
      'AI Integrator'
    ];
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [personalInfo]);

  if (loading || !personalInfo || !contactInfo) {
    return <div>Loading...</div>;
  }

  const texts: string[] = [
    personalInfo.title,
    'Flutter App Developer',
    'Backend & Database Engineer',
    'AI Integrator'
  ];

  const socialLinks: SocialLink[] = [
    { 
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ), 
      href: contactInfo.social.github, 
      label: 'GitHub' 
    },
    { icon: Linkedin, href: contactInfo.social.linkedin, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${contactInfo.email}`, label: 'Email' },
  ];

  return (
    <section id="home" className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] items-center p-[100px_4rem] gap-20 border-b border-border-new bg-paper relative overflow-hidden">
      <div className="hero-left fade-in visible max-w-[520px]">
        <span className="hero-tag">Full Stack Developer · SRM KTR · Chennai</span>
        <h1 className="font-serif text-[clamp(3rem,5.5vw,4.8rem)] leading-[1.05] tracking-[-0.02em] text-ink mb-[1.2rem]">
          {personalInfo.name.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              {i === 0 ? (
                <>
                  {word}
                  <br />
                </>
              ) : i === 1 ? (
                <em className="italic text-accent-new">{word}</em>
              ) : (
                ` ${word}`
              )}
            </React.Fragment>
          ))}
        </h1>
        <div className="font-mono text-[0.95rem] text-muted tracking-[0.06em] mb-[1.8rem] min-h-[1.6em]">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="role-text"
            >
              {texts[currentText]}
            </motion.span>
          </AnimatePresence>
        </div>
        <p className="text-base text-muted leading-[1.8] max-w-[460px] mb-12">
          {personalInfo.subtitle}
        </p>
        <div className="flex gap-5 flex-wrap mb-10">
          <button 
            className="btn-primary" 
            onClick={() => setShowResume(true)}
          >
            View Resume ↗
          </button>
          <a href="#contact" className="btn-ghost">Get in touch</a>
        </div>
        <div className="flex gap-[1rem] flex-wrap items-center">
          {socialLinks.map((social) => (
            <a 
              key={social.label} 
              className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-muted no-underline p-[0.5rem_1rem] border border-border-new rounded-full transition-all duration-300 hover:text-accent-new hover:border-accent-new hover:bg-accent-new/5 flex items-center gap-2" 
              href={social.href} 
              target="_blank" 
              rel="noopener"
            >
              <social.icon className="w-4 h-4" />
              {social.label}
            </a>
          ))}
        </div>
      </div>
      
      <div className="hero-right flex flex-col gap-[1.8rem] lg:pl-16 relative fade-in visible">
        {/* Background glow behind image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-new/5 blur-[120px] rounded-full -z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full aspect-square max-w-[360px] p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden group"
        >
          <div className="relative w-full h-full overflow-hidden transition-all duration-700 rounded-xl">
            <img 
              src={personalInfo.profileImage} 
              alt={personalInfo.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-accent-new flex items-center justify-center text-white rounded-full shadow-lg">
            <Sparkles size={24} />
          </div>
        </motion.div>

        <div className="inline-flex items-center gap-[0.8rem] font-mono text-[0.75rem] tracking-[0.08em] text-ink p-[0.7rem_1.4rem] rounded-full border border-white/10 bg-white/5 backdrop-blur-sm w-fit shadow-sm">
          <span className="dot"></span>
          Available for internships & roles
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          {[
            { value: "8.97", label: "CGPA / 10" },
            { value: "1633", label: "LeetCode Rating" },
            { value: "120+", label: "LC Problems" },
            { value: "9+", label: "Projects" },
            { value: "30%", label: "API latency cut" },
            { value: "8", label: "Certifications" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-[1.5rem] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-[4px] h-0 bg-accent-new group-hover:h-full transition-all duration-500"></div>
              <div className="font-serif text-[2.2rem] text-ink leading-none mb-[0.4rem]">{stat.value}</div>
              <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Resume Popup */}
      {showResume && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[200] flex items-center justify-center p-4">
          <div className="relative w-[90vw] max-w-[860px]">
            <button
              onClick={() => setShowResume(false)}
              className="absolute -top-10 right-0 font-mono text-[0.78rem] tracking-[0.08em] color-white bg-transparent border border-white/30 p-[0.4rem_1rem] cursor-pointer text-white"
            >
              ✕ Close
            </button>
            <iframe
              src={personalInfo?.resumeLink}
              className="w-full h-[90vh] border-none block"
              title="Resume"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
