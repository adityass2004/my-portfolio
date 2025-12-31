import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CodingProfile from './components/CodingProfile';
import Footer from './components/Footer';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Projects from './components/Projects';
import Education from './components/Education';
import Experience from './components/Experience';
import AllProjects from './components/AllProjects';
import Certificates from './components/Certificates';
import AllExperience from './components/AllExperience';
import AllCertificates from './components/AllCertificates';
// import PortfolioEditor from './components/PortfolioEditor';
import AdminPanel from './components/AdminPanel';

import GithubRepos from './components/GithubRepos';
import LeetCodeStats from './components/LeetCodeStats';
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
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
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-dark-900">
          <CustomCursor />
          <Navbar />
          <Routes>
            <Route path="/" element={
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
            } />
            <Route path="/all-projects" element={<AllProjects />} />
            <Route path="/all-certificates" element={<AllCertificates />} />
            <Route path="/all-experience" element={<AllExperience />} />
            <Route path="/github-repos" element={<GithubRepos />} />
            <Route path="/leetcode-stats" element={<LeetCodeStats />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

