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
    <footer className="p-[2rem_4rem] flex justify-between items-center font-mono text-[0.7rem] text-muted tracking-[0.06em] bg-paper border-t border-border-new">
      <div className="fade-in visible">
        © {currentYear} {portfolioData?.personalInfo?.name || 'Aditya Sagar'}. Built with Next.js & Tailwind.
      </div>
      <div className="flex gap-6 fade-in visible">
        <a href="https://github.com/adityass2004" target="_blank" rel="noopener" className="no-underline hover:text-accent-new transition-colors duration-200">GitHub</a>
        <a href="https://www.linkedin.com/in/aditya-sagar-sharma-1955a7288/" target="_blank" rel="noopener" className="no-underline hover:text-accent-new transition-colors duration-200">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;
