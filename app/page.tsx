'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import CodingProfile from './components/CodingProfile';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Certificates from './components/Certificates';
import Education from './components/Education';
import Contact from './components/Contact';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold gradient-text">Loading Portfolio...<span className="loading-dots"></span></h2>
        </motion.div>
      </div>
    );
  }

  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <CodingProfile />
      <Projects />
      <Experience />
      <Certificates />
      <Education />
      <Contact />
    </main>
  );
}