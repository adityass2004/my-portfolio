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
    <section id="about" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">01</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">A bit about me</h2>
      </div>
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-start">
        <div className="about-text fade-in visible">
          <p className="text-base text-muted leading-[1.75] mb-[1.8rem]">
            I'm a <strong className="text-ink font-semibold">3rd-year CSE student at SRM KTR</strong>, Chennai. Most of my real learning has
            happened outside the classroom — late-night debugging sessions, half-finished side projects that
            eventually shipped, and databases that refused to behave under load until I made them.
          </p>
          <p className="text-base text-muted leading-[1.75] mb-[1.8rem]">
            I specialise in building <strong className="text-ink font-semibold">full-stack web applications</strong> with React.js, Node.js,
            Express.js, and databases like MongoDB, PostgreSQL, and MySQL. My approach is clean architecture,
            responsive UI, and maintainable code — while continuously sharpening problem-solving through DSA and
            real-world projects.
          </p>
          <p className="text-base text-muted leading-[1.75] mb-[1.8rem]">
            Beyond web dev, I've been going deeper into <strong className="text-ink font-semibold">AI/ML</strong> — RAG pipelines, computer vision,
            NLP, and neural network research that's currently under review at my department. There's something
            genuinely interesting about the intersection of systems engineering and intelligent behaviour.
          </p>

          <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted mb-[1rem]">Specialties</div>
          <div className="flex flex-wrap gap-3 mb-12">
            {personalInfo.specialties.map((specialty, index) => (
              <span key={index} className="pill rounded-full px-4 py-2 hover:bg-accent-new/5 hover:border-accent-new/30 transition-all cursor-default">{specialty}</span>
            ))}
          </div>

          <div className="research-card rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden before:hidden p-8 mt-10">
            <span className="font-mono text-[0.66rem] tracking-[0.1em] uppercase text-white bg-accent-new px-[0.8rem] py-[0.3rem] rounded-full inline-block mb-[1rem]">Under Review</span>
            <div className="font-serif text-xl text-ink leading-[1.3] mb-3">Damage-Guided Adaptive Recovery for Efficient Neural Network Pruning</div>
            <div className="font-mono text-[0.75rem] text-muted mb-[1rem]">Dept. of Computing Technologies, SRMIST KTR</div>
            <div className="text-[0.92rem] text-muted leading-[1.7] mb-[1.2rem]">A damage-aware pruning framework addressing irreversible performance degradation in deep learning model compression — combining weight magnitude, gradient sensitivity, and activation frequency into a composite importance metric.</div>
            <ul className="list-none mb-[1.2rem] flex flex-col gap-[0.6rem]">
              <li className="text-[0.9rem] text-muted leading-[1.65] pl-[1.4rem] relative before:content-['→'] before:absolute before:left-0 before:text-accent-new before:text-[0.85rem]">70% parameter reduction & ~60% FLOP reduction while maintaining or surpassing baseline accuracy.</li>
              <li className="text-[0.9rem] text-muted leading-[1.65] pl-[1.4rem] relative before:content-['→'] before:absolute before:left-0 before:text-accent-new before:text-[0.85rem]">Experiments on CIFAR-10, CIFAR-100, and FashionMNIST.</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              {["Neural Network Pruning", "Model Compression", "Deep Learning"].map(tag => (
                <span key={tag} className="font-mono text-[0.65rem] text-muted border border-border-new px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="about-aside flex flex-col gap-[1.2rem] fade-in visible">
          {[
            { label: "Currently studying", value: "B.Tech CSE — SRM KTR, Chennai" },
            { label: "Graduating", value: "May 2027" },
            { label: "Current CGPA", value: "8.97 / 10.0" },
            { label: "Focus areas", value: "Full Stack · Backend · DSA · ML" },
            { label: "Based in", value: "Muzaffarpur, Bihar, India" },
            { label: "LeetCode", value: "Rating 1633 · Top 20% globally" },
            { label: "Availability", value: "Open to internship opportunities" }
          ].map((item, i) => (
            <div key={i} className="aside-item rounded-full p-[0.8rem_1.4rem] hover:bg-accent-new/5 transition-colors group">
              <div className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted mb-[0.1rem] group-hover:text-accent-new transition-colors">{item.label}</div>
              <div className="text-[0.92rem] text-ink font-medium">{item.value}</div>
            </div>
          ))}
          <a href="/data_files/resume.pdf" download className="btn-ghost justify-center mt-4 rounded-full border-border-new hover:border-accent-new hover:text-accent-new">Download Resume ↓</a>
        </div>
      </div>
    </section>
  );
};

export default About;
