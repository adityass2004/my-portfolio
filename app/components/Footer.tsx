'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Heart, LucideIcon, Instagram, Youtube } from 'lucide-react';
import { portfolioService } from '../data/portfolioService';

interface LinkItem {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: LinkItem[];
}

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await portfolioService.getPortfolioData();
        setPortfolioData(data);
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      }
    };
    loadData();
  }, []);

  const footerLinks: FooterSection[] = [
    {
      title: 'Navigation',
      links: [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Experience', href: '#experience' },
        { name: 'Contact', href: '#contact' },
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Web Development', href: '#' },
        { name: 'Mobile Development', href: '#' },
        { name: 'UI/UX Design', href: '#' },
        { name: 'Consulting', href: '#' },
        { name: 'Technical Support', href: '#' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '#' },
        { name: 'Portfolio', href: '#' },
        { name: 'Resume', href: '#' },
        { name: 'GitHub', href: '#' },
        { name: 'LinkedIn', href: '#' },
      ]
    }
  ];

  const socialLinks: SocialLink[] = [
    { icon: Github, href: portfolioData?.contactInfo?.social?.github || '#', label: 'GitHub' },
    { icon: Linkedin, href: portfolioData?.contactInfo?.social?.linkedin || '#', label: 'LinkedIn' },
    { icon: Twitter, href: portfolioData?.contactInfo?.social?.twitter || '#', label: 'Twitter' },
    { icon: Instagram, href: portfolioData?.contactInfo?.social?.instagram || '#', label: 'Instagram' },
    { icon: Youtube, href: portfolioData?.contactInfo?.social?.youtube || '#', label: 'YouTube' },
    { icon: Mail, href: `mailto:${portfolioData?.contactInfo?.email || ''}`, label: 'Email' },
  ].filter(link => link.href && link.href !== '#');

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-card border-t border-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{portfolioData?.personalInfo?.avatar || 'P'}</span>
                </div>
                <span className="text-xl font-bold gradient-text">{portfolioData?.personalInfo?.name || 'Portfolio'}</span>
              </div>
              <p className="text-secondary leading-relaxed">
                {portfolioData?.personalInfo?.bio || 'Full Stack Developer passionate about creating exceptional digital experiences and turning ideas into reality through innovative solutions.'}
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center text-secondary hover:text-primary-500 hover:shadow-lg transition-all duration-300"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-primary mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }
                      }}
                      whileHover={{ x: 5 }}
                      className="text-secondary hover:text-primary-500 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-card pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-secondary text-sm">
              <span>© {currentYear} {portfolioData?.personalInfo?.name || 'Portfolio'}. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">and lots of coffee</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-secondary">
              <button className="hover:text-primary-500 transition-colors duration-300">
                Privacy Policy
              </button>
              <button className="hover:text-primary-500 transition-colors duration-300">
                Terms of Service
              </button>
              <button className="hover:text-primary-500 transition-colors duration-300">
                Cookie Policy
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </footer>
  );
};

export default Footer;
