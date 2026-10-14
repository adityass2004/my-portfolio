'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, Eye, Code, Sparkles, X, LucideIcon } from 'lucide-react';
import { getPersonalInfo, getContactInfo, getStats, PersonalInfo, ContactInfo, StatItem } from '../data/portfolioService';

interface SocialLink {
  icon: React.ComponentType<any>;
  href: string;
  label: string;
}

const Hero: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentText, setCurrentText] = useState<number>(0);
  const [showResume, setShowResume] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const techMarqueeItems = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Express.js',
    'PostgreSQL',
    'Redis',
    'AWS',
    'Docker',
    'Prisma',
    'Tailwind',
    'MongoDB',
    'Python',
    'GitHub',
    'System Design',
  ];

  useEffect(() => {
    Promise.all([getPersonalInfo(), getContactInfo(), getStats()]).then(([personal, contact, statsData]) => {
      setPersonalInfo(personal);
      setContactInfo(contact);
      setStats(statsData);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load data:', error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!personalInfo || shouldReduceMotion) return;
    const texts = [
      personalInfo.title,
      personalInfo.subtitle,
      ...personalInfo.specialties.slice(0, 2),
    ];
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [personalInfo, shouldReduceMotion]);

  if (loading || !personalInfo || !contactInfo) {
    return <div>Loading...</div>;
  }

  const texts: string[] = [
    personalInfo.title,
    personalInfo.subtitle,
    ...personalInfo.specialties.slice(0, 2),
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
    <section id="home" className="page-section border-b border-border-new bg-paper relative overflow-hidden">
      <div className="container-shell grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: 'easeOut' }}
          className="w-full min-w-0 max-w-[530px]"
        >
          <motion.span
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.05 }}
            className="hero-tag"
          >
            {personalInfo.title.split('|')[0].trim()}{personalInfo.heroLocation ? ` · ${personalInfo.heroLocation}` : ''}
          </motion.span>

          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.08 }}
            className="font-serif text-[clamp(2.7rem,5vw,4.4rem)] leading-[0.98] tracking-[-0.04em] text-ink mb-4"
          >
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
          </motion.h1>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.12 }}
            className="font-mono text-[0.82rem] md:text-[0.9rem] text-muted tracking-[0.08em] mb-5 min-h-[1.5em]"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentText}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                className="inline-block"
              >
                {texts[currentText]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.16 }}
            className="text-[0.96rem] md:text-base text-muted leading-[1.7] max-w-[440px] mb-8"
          >
            {personalInfo.subtitle}
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="flex flex-wrap items-center gap-3 mb-7"
          >
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="btn-primary"
              onClick={() => setShowResume(true)}
            >
              View Resume ↗
            </motion.button>
            <motion.a
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              href="#contact"
              className="btn-ghost"
            >
              Get in touch
            </motion.a>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.24 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-muted no-underline px-3 py-2 border border-border-new rounded-full transition-all duration-300 hover:text-accent-new hover:border-accent-new hover:bg-accent-new/5 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-new/40"
                href={social.href}
                target="_blank"
                rel="noopener"
              >
                <social.icon className="w-3.5 h-3.5" />
                {social.label}
              </motion.a>
            ))}
          </motion.div>

          <div className="tech-marquee mt-7 max-w-[520px]" aria-label="Technology stack">
            <div className="tech-marquee-track">
              {[...techMarqueeItems, ...techMarqueeItems].map((tech, index) => (
                <span key={`${tech}-${index}`} className="tech-marquee-item">{tech}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1, ease: 'easeOut' }}
          className="relative flex w-full min-w-0 flex-col gap-4 lg:pl-4"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-new/5 blur-[110px] rounded-full -z-10" />

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.15 }}
            className="relative w-full max-w-[360px] mx-auto lg:mx-0 p-3 rounded-[1.6rem] bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl overflow-hidden group"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-[1.2rem]">
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-accent-new flex items-center justify-center text-white rounded-full shadow-lg">
              <Sparkles size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="inline-flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.08em] text-ink px-4 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm w-fit shadow-sm mx-auto lg:mx-0"
          >
            <span className="dot"></span>
            {personalInfo.availabilityBadge ?? contactInfo.availability}
          </motion.div>

          <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto lg:mx-0 w-full">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : i * 0.05 }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-[4px] h-0 bg-accent-new group-hover:h-full transition-all duration-500"></div>
                <div className="font-serif text-[1.8rem] text-ink leading-none mb-1">{stat.value}</div>
                <div className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {showResume && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[200] flex items-center justify-center p-4">
          <div className="relative w-[90vw] max-w-[860px]">
            <button
              onClick={() => setShowResume(false)}
              className="absolute -top-10 right-0 font-mono text-[0.78rem] tracking-[0.08em] text-white bg-transparent border border-white/30 p-[0.4rem_1rem] cursor-pointer"
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
