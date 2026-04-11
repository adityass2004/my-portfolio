"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import CodingProfile from "./components/CodingProfile";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Certificates from "./components/Certificates";
import Education from "./components/Education";
import Contact from "./components/Contact";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="font-serif text-[2.5rem] text-ink mb-2 animate-pulse">
            Aditya Sagar<span className="text-accent-new">.</span>
          </div>
          <div className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted">
            Portfolio 2026
          </div>
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