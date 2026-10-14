import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Code, Coffee, User, Star, Target, Zap, LucideIcon } from 'lucide-react';
import { getPersonalInfo, getContactInfo, getResearch, PersonalInfo, ContactInfo, ResearchItem } from '../data/portfolioService';

const About: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Promise.all([getPersonalInfo(), getContactInfo(), getResearch()]).then(([personal, contact, researchData]) => {
      setPersonalInfo(personal);
      setContactInfo(contact);
      setResearch(researchData);
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
    <section id="about" className="page-section border-b border-border-new bg-paper">
      <div className="container-shell">
        <div className="section-header fade-in visible">
          <span className="section-num">01</span>
          <h2 className="font-serif text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.08] text-ink">A bit about me</h2>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="about-text fade-in visible">
            {personalInfo.about.map((para, i) => (
              <p key={i} className="text-[0.96rem] md:text-base text-muted leading-[1.7] mb-5 last:mb-0"
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}

            <div className="mt-7">
              <div className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted mb-3">Specialties</div>
              <div className="flex flex-wrap gap-2.5">
                {personalInfo.specialties.map((specialty, index) => (
                  <span key={index} className="pill rounded-full hover:bg-accent-new/5 hover:border-accent-new/30 transition-all cursor-default">{specialty}</span>
                ))}
              </div>
            </div>

            <div className="research-card rounded-[1.5rem] border border-border-new/60 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden p-5 md:p-6 mt-8">
              {research.map((item) => (
                <React.Fragment key={item.id}>
                  <span className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-white bg-accent-new px-3 py-1.5 rounded-full inline-block mb-3">{item.status}</span>
                  <div className="font-serif text-xl text-ink leading-[1.25] mb-2">{item.title}</div>
                  <div className="font-mono text-[0.72rem] text-muted mb-3">{item.institution}</div>
                  <div className="text-[0.92rem] text-muted leading-[1.7] mb-4">{item.description}</div>
                  <ul className="list-none mb-4 flex flex-col gap-2">
                    {item.highlights.map((point) => (
                      <li key={point} className="text-[0.88rem] text-muted leading-[1.6] pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-accent-new before:text-[0.85rem]">{point}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords.map(tag => (
                      <span key={tag} className="font-mono text-[0.62rem] text-muted border border-border-new px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="about-aside flex flex-col gap-3 fade-in visible">
            {[
              { label: "Currently studying", value: personalInfo.college ?? "B.Tech CSE — SRM KTR, Chennai" },
              { label: "Graduating", value: personalInfo.graduating ?? "May 2027" },
              { label: "Current CGPA", value: personalInfo.cgpa ?? "9.0 / 10.0" },
              { label: "Focus areas", value: personalInfo.focusAreas ?? "Backend · Distributed Systems · DSA" },
              { label: "Based in", value: personalInfo.location },
              { label: "LeetCode", value: personalInfo.leetcodeHighlight ?? "Rating 1930+ · Top 5% globally" },
              { label: "Availability", value: contactInfo?.availability ?? "Open to opportunities" }
            ].map((item, i) => (
              <div key={i} className="aside-item rounded-2xl p-4 md:p-4.5 hover:bg-accent-new/5 transition-colors group border border-transparent hover:border-accent-new/10">
                <div className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted mb-1 group-hover:text-accent-new transition-colors">{item.label}</div>
                <div className="text-[0.92rem] text-ink font-medium">{item.value}</div>
              </div>
            ))}
            <a href={personalInfo.resumeLink} download className="btn-ghost justify-center mt-2 rounded-full border-border-new hover:border-accent-new hover:text-accent-new">Download Resume ↓</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
