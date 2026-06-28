'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { getPersonalInfo, PersonalInfo } from '../data/portfolioService';

interface NavItem {
  name: string;
  href: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    getPersonalInfo().then(setPersonalInfo).catch(console.error);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!personalInfo) {
    return null;
  }

  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'GitHub Repos', href: '/github-repos' },
    { name: 'LeetCode Stats', href: '/leetcode-stats' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center p-[1.4rem_2rem] md:p-[1.6rem_4rem] bg-paper/70 backdrop-blur-[10px] border-b border-white/5 sticky-navbar">
      <Link href="/" className="nav-logo font-serif text-[1.3rem] md:text-[1.5rem] text-ink no-underline font-medium tracking-tight hover:text-accent-new transition-colors">
        Aditya Sagar.
      </Link>

      <ul className="hidden md:flex gap-[3rem] list-none items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name} className="relative">
              <Link
                href={item.href}
                className={`font-mono text-[0.8rem] md:text-[0.85rem] font-normal no-underline tracking-[0.1em] uppercase transition-colors duration-300 hover:text-accent-new py-2 ${isActive ? 'text-accent-new' : 'text-muted'
                  }`}
              >
                {item.name}
              </Link>
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-new rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </li>
          );
        })}
        <li className="ml-2"><ThemeToggle /></li>
      </ul>

      <button
        className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-none border-none p-2 rounded-lg hover:bg-ink/5 dark:hover:bg-white/5 transition-colors text-ink"
        onClick={() => setIsOpen(true)}
        aria-label="Open Menu"
      >
        <span className="block w-6 h-[2px] bg-current"></span>
        <span className="block w-6 h-[2px] bg-current"></span>
        <span className="block w-6 h-[2px] bg-current"></span>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 w-full h-[100dvh] bg-white/95 dark:bg-black/95 backdrop-blur-xl z-[200] flex flex-col justify-start items-center gap-6 overflow-y-auto pt-24 pb-12"
          >
            <button
              className="absolute top-6 right-6 font-mono text-[0.78rem] border border-border-new p-[0.4rem_0.8rem] cursor-pointer text-ink hover:border-ink hover:text-accent-new transition-all rounded"
              onClick={() => setIsOpen(false)}
            >
              ✕ Close
            </button>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-serif text-[1.5rem] md:text-[2rem] no-underline transition-colors hover:text-accent-new ${pathname === item.href ? 'text-accent-new' : 'text-ink'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 mt-6 border-t border-border-new/40 pt-6 w-1/2 justify-center">
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-muted">Theme</span>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
