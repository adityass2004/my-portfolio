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
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center p-[1.1rem_4rem] bg-paper/70 backdrop-blur-[10px] border-b border-white/5 sticky-navbar">
      <Link href="/" className="nav-logo font-serif text-[1.2rem] text-ink no-underline font-medium tracking-tight">
        Aditya Sagar.
      </Link>

      <ul className="hidden md:flex gap-[2.5rem] list-none items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name} className="relative">
              <Link
                href={item.href}
                className={`font-mono text-[0.75rem] font-normal no-underline tracking-[0.1em] uppercase transition-colors duration-300 hover:text-accent-new py-2 ${isActive ? 'text-accent-new' : 'text-muted'
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
        className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-none border-none p-1"
        onClick={() => setIsOpen(true)}
        aria-label="Menu"
      >
        <span className="block w-6 h-[2px] bg-ink"></span>
        <span className="block w-6 h-[2px] bg-ink"></span>
        <span className="block w-6 h-[2px] bg-ink"></span>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-paper/95 backdrop-blur-md z-[200] flex flex-col justify-center items-center gap-10"
          >
            <button
              className="absolute top-6 right-6 font-mono text-[0.78rem] border border-border-new p-[0.4rem_0.8rem] cursor-pointer text-ink"
              onClick={() => setIsOpen(false)}
            >
              ✕ Close
            </button>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-serif text-[2rem] no-underline ${pathname === item.href ? 'text-accent-new' : 'text-ink'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 mt-4">
              <span className="font-mono text-sm text-muted">Theme</span>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
