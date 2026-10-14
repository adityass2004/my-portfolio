'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Copy, Check, ExternalLink, Search, ClipboardList } from 'lucide-react';
import type { PortfolioData } from '../data/portfolioService';

// ─── Copy hook ────────────────────────────────────────────────────────────────

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement('textarea');
      el.value = text; el.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }, []);
  return { copied, copy };
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button onClick={() => copy(text)} aria-label={`Copy ${label ?? text}`}
      className={`inline-flex items-center gap-1.5 font-mono text-[0.68rem] tracking-[0.08em] uppercase px-2.5 py-1 rounded-full border transition-all shrink-0 ${
        copied ? 'bg-accent-new/10 border-accent-new/50 text-accent-new'
               : 'border-border-new/40 text-muted hover:border-accent-new/50 hover:text-accent-new'}`}>
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Row({ label, value, isUrl }: { label: string; value: string; isUrl?: boolean }) {
  if (!value?.trim()) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border-new/20 last:border-0">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted">{label}</span>
        <span className="text-[0.85rem] text-ink break-words leading-snug">{value}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
        {isUrl && (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[0.68rem] tracking-[0.08em] uppercase text-muted border border-border-new/40 px-2.5 py-1 rounded-full hover:border-accent-new/50 hover:text-accent-new transition-all">
            <ExternalLink size={10} /> Open
          </a>
        )}
        <CopyBtn text={value} label={label} />
      </div>
    </div>
  );
}

function LongRow({ label, value }: { label: string; value: string }) {
  if (!value?.trim()) return null;
  return (
    <div className="flex flex-col gap-2 py-2 border-b border-border-new/20 last:border-0">
      <span className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted">{label}</span>
      <p className="text-[0.85rem] text-ink leading-relaxed whitespace-pre-wrap break-words">{value}</p>
      <div className="flex justify-end"><CopyBtn text={value} label={label} /></div>
    </div>
  );
}

// ─── Item Card (cert / project / experience) ──────────────────────────────────

function ItemCard({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col gap-0">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-serif text-[0.95rem] text-ink leading-snug">{title}</h3>
        {badge && <span className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-accent-new/70 border border-accent-new/30 px-2 py-0.5 rounded-full shrink-0">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── Simple field card (for flat sections) ────────────────────────────────────

function FieldCard({ label, value, isUrl, isLong }: { label: string; value: string; isUrl?: boolean; isLong?: boolean }) {
  if (!value?.trim()) return null;
  if (isLong) return (
    <div className="glass-card rounded-xl p-4 flex flex-col gap-2 md:col-span-2">
      <span className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted">{label}</span>
      <p className="text-[0.85rem] text-ink leading-relaxed whitespace-pre-wrap break-words">{value}</p>
      <div className="flex justify-end"><CopyBtn text={value} label={label} /></div>
    </div>
  );
  return (
    <div className="glass-card rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted">{label}</span>
        <span className="text-[0.85rem] text-ink truncate">{value}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {isUrl && (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[0.68rem] tracking-[0.08em] uppercase text-muted border border-border-new/40 px-2.5 py-1 rounded-full hover:border-accent-new/50 hover:text-accent-new transition-all">
            <ExternalLink size={10} /> Open
          </a>
        )}
        <CopyBtn text={value} label={label} />
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, num, children, cols = true }: { title: string; num: string; children: React.ReactNode; cols?: boolean }) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent-new/60 font-medium">{num}</span>
        <h2 className="font-serif text-[1.15rem] text-ink">{title}</h2>
        <div className="flex-1 h-px bg-border-new/40" />
      </div>
      {cols
        ? <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
        : <div className="flex flex-col gap-3">{children}</div>}
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FormsClient({ data }: { data: PortfolioData }) {
  const [query, setQuery] = useState('');
  const [allCopied, setAllCopied] = useState(false);

  const { personalInfo, education, skills, experience, contactInfo, certifications } = data;
  const research     = (data as any).research     ?? [];
  const projects     = (data as any).projects     ?? [];
  const achievements = (data as any).achievements ?? [];

  const p = personalInfo ?? ({} as any);
  const c = contactInfo  ?? ({} as any);
  const social = c.social ?? {};

  const q = query.toLowerCase().trim();
  const match = (s: string) => !q || s.toLowerCase().includes(q);
  const matchAny = (...ss: string[]) => !q || ss.some(s => s && s.toLowerCase().includes(q));

  const handleCopyAll = useCallback(async () => {
    const lines: string[] = [];
    const add = (label: string, value: string) => value?.trim() && lines.push(`${label}: ${value}`);

    lines.push('PERSONAL INFORMATION', '─'.repeat(40));
    add('Full Name', p.name); add('Email', p.email); add('Phone', p.phone);
    add('Location', p.location); add('Title', p.title); add('Bio', p.bio);
    lines.push('');

    lines.push('EDUCATION', '─'.repeat(40));
    (education ?? []).forEach((e: any) => {
      add('Degree', e.degree); add('Institution', e.school);
      add('Period', e.period); add('Location', e.location);
    });
    lines.push('');

    lines.push('CERTIFICATIONS', '─'.repeat(40));
    (certifications ?? []).forEach((cert: any) => {
      lines.push(`\n${cert.name}`);
      add('Issuer', cert.issuer); add('Date', cert.date);
      add('Credential ID', cert.credentialId); add('Link', cert.link);
    });
    lines.push('');

    lines.push('PROJECTS', '─'.repeat(40));
    projects.forEach((proj: any) => {
      lines.push(`\n${proj.title}`);
      add('Category', proj.category);
      if (proj.technologies?.length) add('Technologies', proj.technologies.join(', '));
      add('GitHub', proj.github); add('Live', proj.live);
      add('Description', proj.description);
    });
    lines.push('');

    lines.push('EXPERIENCE', '─'.repeat(40));
    (experience ?? []).forEach((exp: any) => {
      lines.push(`\n${exp.title} @ ${exp.company}`);
      add('Period', exp.period); add('Location', exp.location);
      if (exp.technologies?.length) add('Technologies', exp.technologies.join(', '));
      add('Description', exp.description);
    });
    lines.push('');

    const text = lines.join('\n').trim();
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement('textarea');
      el.value = text; el.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
    }
    setAllCopied(true); setTimeout(() => setAllCopied(false), 2000);
  }, [p, education, certifications, projects, experience]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <span className="hero-tag">Utility</span>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-[2.4rem] md:text-[3rem] text-ink leading-tight">Quick Copy</h1>
            <p className="text-muted text-[0.88rem] mt-1 font-mono">
              All your form-filling details in one place — click any field to copy instantly.
            </p>
          </div>
          <button onClick={handleCopyAll} aria-label="Copy all"
            className={`shrink-0 inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.1em] uppercase px-5 py-2.5 rounded-full border transition-all duration-300 ${
              allCopied ? 'bg-accent-new/10 border-accent-new text-accent-new'
                        : 'border-border-new text-ink hover:border-ink hover:bg-ink hover:text-paper'}`}>
            {allCopied ? <Check size={13} /> : <ClipboardList size={13} />}
            {allCopied ? 'All Copied!' : 'Copy All'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-10">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search… e.g. email, github, AWS, React, CGPA"
          className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-white/5 border border-border-new/40 rounded-xl font-mono text-[0.82rem] text-ink placeholder:text-muted focus:outline-none focus:border-accent-new/50 transition-colors" />
      </div>

      <div className="flex flex-col gap-14">

        {/* 01 Personal Information */}
        {matchAny(p.name, p.email, p.phone, p.location, p.title, p.bio) && (
          <Section title="Personal Information" num="01">
            <FieldCard label="Full Name"     value={p.name} />
            <FieldCard label="Email"         value={p.email} />
            <FieldCard label="Phone"         value={p.phone} />
            <FieldCard label="Location"      value={p.location} />
            <FieldCard label="Current Title" value={p.title} />
            <FieldCard label="Specialties"   value={(p.specialties as string[] | undefined)?.join(', ') ?? ''} />
            <FieldCard label="Bio"           value={p.bio}   isLong />
            <FieldCard label="About"         value={(p.about as string[] | undefined)?.join('\n\n') ?? ''} isLong />
          </Section>
        )}

        {/* 02 Education */}
        {(education ?? []).some((e: any) => matchAny(e.degree, e.school, e.period, e.location)) && (
          <Section title="Education" num="02">
            {(education ?? []).filter((e: any) => matchAny(e.degree, e.school, e.period, e.location)).map((edu: any) => (
              <div key={edu.id ?? edu.degree} className="glass-card rounded-xl p-4 flex flex-col gap-0 md:col-span-2">
                <h3 className="font-serif text-[0.95rem] text-ink mb-3">{edu.degree}</h3>
                <Row label="Institution" value={edu.school} />
                <Row label="Period"      value={edu.period} />
                <Row label="Location"    value={edu.location} />
                {(edu.achievements as string[] | undefined)?.filter(a => /cgpa|gpa|score|%/i.test(a)).map(a => (
                  <Row key={a} label="Score / CGPA" value={a} />
                ))}
              </div>
            ))}
          </Section>
        )}

        {/* 03 Technical Skills */}
        {(skills?.categories ?? []).some((cat: any) => matchAny(cat.name, cat.skills?.map((s: any) => s.name).join(' '))) && (
          <Section title="Technical Skills" num="03">
            {(skills?.categories ?? [])
              .filter((cat: any) => matchAny(cat.name, cat.skills?.map((s: any) => s.name).join(' ')))
              .map((cat: any) => (
                <FieldCard key={cat.name} label={cat.name} value={cat.skills.map((s: any) => s.name).join(', ')} />
              ))}
          </Section>
        )}

        {/* 04 Experience */}
        {(experience ?? []).some((e: any) => matchAny(e.title, e.company, e.period, e.description, e.technologies?.join(' '))) && (
          <Section title="Experience" num="04" cols={false}>
            {(experience ?? [])
              .filter((exp: any) => matchAny(exp.title, exp.company, exp.period, exp.description, exp.technologies?.join(' ')))
              .map((exp: any) => (
                <ItemCard key={exp.id ?? exp.title} title={exp.title} badge={exp.company}>
                  <Row label="Company"  value={exp.company} />
                  <Row label="Period"   value={exp.period} />
                  <Row label="Location" value={exp.location} />
                  {exp.technologies?.length && <Row label="Technologies" value={exp.technologies.join(', ')} />}
                  {exp.achievements?.length && <LongRow label="Achievements" value={exp.achievements.join('\n')} />}
                  {exp.description && <LongRow label="Description" value={exp.description} />}
                </ItemCard>
              ))}
          </Section>
        )}

        {/* 05 Projects */}
        {projects.some((p: any) => matchAny(p.title, p.category, p.description, p.technologies?.join(' '))) && (
          <Section title="Projects" num="05" cols={false}>
            {projects
              .filter((proj: any) => matchAny(proj.title, proj.category, proj.description, proj.technologies?.join(' ')))
              .map((proj: any) => (
                <ItemCard key={proj.id ?? proj.title} title={proj.title} badge={proj.category}>
                  {proj.technologies?.length && <Row label="Technologies" value={proj.technologies.join(', ')} />}
                  <Row label="GitHub"   value={proj.github} isUrl />
                  <Row label="Live URL" value={proj.live}   isUrl />
                  {proj.description && <LongRow label="Description" value={proj.description} />}
                </ItemCard>
              ))}
          </Section>
        )}

        {/* 06 Certifications */}
        {(certifications ?? []).some((c: any) => matchAny(c.name, c.issuer, c.date, c.credentialId)) && (
          <Section title="Certifications" num="06" cols={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(certifications ?? [])
                .filter((cert: any) => matchAny(cert.name, cert.issuer, cert.date, cert.credentialId))
                .map((cert: any) => (
                  <ItemCard key={cert.id ?? cert.name} title={cert.name} badge={cert.date || undefined}>
                    <Row label="Issuer"        value={cert.issuer} />
                    <Row label="Date"          value={cert.date} />
                    <Row label="Credential ID" value={cert.credentialId} />
                    <Row label="Verify Link"   value={cert.link} isUrl />
                  </ItemCard>
                ))}
            </div>
          </Section>
        )}

        {/* 07 Research */}
        {research.some((r: any) => matchAny(r.title, r.status, r.institution, r.keywords?.join(' '))) && (
          <Section title="Research" num="07" cols={false}>
            {research
              .filter((r: any) => matchAny(r.title, r.status, r.institution, r.keywords?.join(' ')))
              .map((r: any, i: number) => (
                <ItemCard key={i} title={r.title} badge={r.status}>
                  <Row label="Institution" value={r.institution} />
                  {r.keywords?.length && <Row label="Keywords" value={r.keywords.join(', ')} />}
                  {r.highlights?.length && <LongRow label="Highlights" value={r.highlights.join('\n')} />}
                  {r.description && <LongRow label="Abstract" value={r.description} />}
                </ItemCard>
              ))}
          </Section>
        )}

        {/* 08 Achievements */}
        {achievements.length > 0 && achievements.some((a: string) => match(a)) && (
          <Section title="Achievements" num="08" cols={false}>
            <div className="glass-card rounded-xl p-4 flex flex-col gap-0">
              {(achievements as string[]).filter(a => match(a)).map((a, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-border-new/20 last:border-0">
                  <div className="flex gap-3 min-w-0 flex-1">
                    <span className="font-mono text-[0.65rem] text-accent-new/60 mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[0.85rem] text-ink leading-snug">{a}</span>
                  </div>
                  <CopyBtn text={a} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 09 Professional Links */}
        {matchAny(p.github, p.linkedin, p.website, social.twitter, social.youtube) && (
          <Section title="Professional Links" num="09">
            <FieldCard label="GitHub"    value={p.github   || social.github}    isUrl />
            <FieldCard label="LinkedIn"  value={p.linkedin || social.linkedin}  isUrl />
            <FieldCard label="Portfolio" value={p.website}                      isUrl />
            <FieldCard label="LeetCode"  value={p.leetcode}                     isUrl />
            <FieldCard label="Twitter"   value={social.twitter}                 isUrl />
            <FieldCard label="YouTube"   value={social.youtube}                 isUrl />
            <FieldCard label="Instagram" value={social.instagram}               isUrl />
            <FieldCard label="Resume"    value={p.resumeLink}                   isUrl />
            {p.cvLink && p.cvLink !== p.resumeLink && <FieldCard label="CV" value={p.cvLink} isUrl />}
          </Section>
        )}

        {/* 10 Application Info */}
        {matchAny(c.availability, c.responseTime, c.location) && (
          <Section title="Application Info" num="10">
            <FieldCard label="Availability"    value={c.availability} />
            <FieldCard label="Response Time"   value={c.responseTime} />
            <FieldCard label="Contact Address" value={c.location} />
          </Section>
        )}

      </div>
    </div>
  );
}
