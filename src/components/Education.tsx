import React, { useState, useEffect } from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { getEducation, type Education as EducationType } from '../data/portfolioService';

const Education: React.FC = () => {
  const [education, setEducation] = useState<EducationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEducation().then(data => {
      setEducation(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load education:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <section id="education" className="mobile-padding section-bg">
      <div className="max-w-7xl mx-auto mobile-optimized">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary flex items-center justify-center">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-primary-500" />
            Education
          </h2>
          <p className="text-lg sm:text-xl text-secondary max-w-2xl sm:max-w-3xl mx-auto px-4">
            My academic background and achievements
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {education.map((edu) => (
            <div key={edu.id} className="bg-card border border-card rounded-xl p-6 flex flex-col">
              <div className="flex items-center mb-3">
                <GraduationCap className="w-6 h-6 text-primary-500 mr-2" />
                <span className="text-lg font-semibold text-primary">{edu.degree}</span>
              </div>
              <div className="text-sm text-secondary mb-1">{edu.school}</div>
              <div className="text-xs text-secondary mb-1">{edu.period} | {edu.location}</div>
              <div className="text-xs text-secondary mb-2">{edu.description}</div>
              <ul className="list-disc list-inside text-xs text-secondary space-y-1">
                {edu.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-center">
                    <Award className="w-3 h-3 mr-1 text-yellow-500" />
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
