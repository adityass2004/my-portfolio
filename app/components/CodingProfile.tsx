'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Code, ExternalLink } from "lucide-react";
import { getPersonalInfo, PersonalInfo } from "../data/portfolioService";

interface GithubData {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  publicRepos: number;
  stars: number;
  profileUrl: string;
  createdAt: string;
  updatedAt: string;
  topLanguages: string[];
  contributions: Array<{ date: string; count: number; level: number }>;
  achievements?: Array<{ displayName: string; icon: string }>;
}

type SolvedStats = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
};

type MonthlySubmission = {
  month: string;
  submissions: number;
  monthName: string;
};
type ContestStats = {
  rating: number;
  globalRanking: number | null;
  contestsAttended: number;
  topPercentage: number | null;
};

type LeetCodeData = {
  name: string;
  avatar: string;
  country: string;
  ranking: number;
  star: number;
  solved: SolvedStats;
  submissions: number;
  profileUrl: string;
  monthlySubmissions: MonthlySubmission[];
  contest: ContestStats;
  activeBadge: {
    id: string;
    name: string;
    icon: string;
    displayName: string;
  } | null;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    displayName: string;
    hoverText: string;
  }>;
};

export default function CodingProfile() {
  const [data, setData] = useState<GithubData | null>(null);
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeData | null>(null);
  const [, setPersonalData] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchLeetCodeProfile(username: string): Promise<LeetCodeData> {
    try {
      const res = await fetch(`/api/leetcode?username=${encodeURIComponent(username)}`);
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API response was not JSON");
      }
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to fetch");
      }
      return await res.json();
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  }

  function extractLeetCodeUsername(input: string | null | undefined): string | null {
    if (!input) return null;
    try {
      if (!input.includes("leetcode.com")) {
        return input.replace(/^@/, "").trim();
      }
      const url = new URL(input.startsWith("http") ? input : `https://${input}`);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] === "u" && parts.length >= 2) return parts[1];
      return parts.length >= 1 ? parts[0] : null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const personalInfo = await getPersonalInfo();
        setPersonalData(personalInfo);
        const username = "adityass2004";
        const res = await fetch(`/api/github?username=${username}`);
        if (!res.ok) throw new Error("Failed to fetch GitHub data");
        const json = await res.json();
        setData(json);
        const leetcodeUsername = extractLeetCodeUsername(personalInfo.leetcode);
        if (leetcodeUsername) {
          try {
            const leetcodeJson = await fetchLeetCodeProfile(leetcodeUsername);
            setLeetcodeData(leetcodeJson);
          } catch (err) {
            console.error("Failed to fetch LeetCode data:", err);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/5 rounded-xl border border-red-500/20">
        Error: {error || "No data available"}
      </div>
    );
  }

  return (
    <section id="coding" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">03</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">Coding profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* GitHub Card */}
        <motion.div 
          whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
          className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-border-new/40 p-10 rounded-3xl transition-all duration-300 group"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-ink text-white rounded-xl flex items-center justify-center p-2.5 shadow-lg group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </div>
              <div>
                <div className="font-serif text-xl text-ink">GitHub</div>
                <div className="font-mono text-[0.7rem] text-muted">@adityass2004</div>
              </div>
            </div>
            <a href="https://github.com/adityass2004" target="_blank" rel="noopener" className="text-muted hover:text-accent-new transition-colors">
              <ExternalLink size={18} />
            </a>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { label: "Repos", value: data.publicRepos },
              { label: "Stars", value: data.stars },
              { label: "Followers", value: data.followers }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-paper-warm/50 border border-border-new/20">
                <div className="font-serif text-[24px] text-ink leading-none mb-1">{stat.value}</div>
                <div className="font-mono text-[12px] tracking-wider uppercase text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-[0.92rem] text-muted leading-[1.7] mb-8">{data.bio || "Full Stack Developer passionate about building scalable web applications."}</p>

          {/* GitHub Achievements Section */}
          {data.achievements && data.achievements.length > 0 && (
            <div className="mb-8">
              <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-3">Earned Achievements</div>
              <div className="flex flex-wrap gap-2.5">
                {data.achievements.map((achievement, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1.5 bg-paper-warm/50 border border-border-new/20 rounded-full pl-2 pr-3 py-1 text-xs text-ink hover:border-accent-new transition-all group/ach" 
                    title={achievement.displayName}
                  >
                    <img src={achievement.icon} alt={achievement.displayName} className="w-5 h-5 object-contain" />
                    <span className="font-mono text-[0.7rem] text-muted group-hover/ach:text-accent-new transition-colors">{achievement.displayName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a href="https://github.com/adityass2004" target="_blank" rel="noopener" className="btn-ghost w-full justify-center rounded-xl border-border-new/40 hover:border-accent-new hover:text-accent-new transition-all">View Profile ↗</a>
        </motion.div>

        {/* LeetCode Card */}
        <motion.div 
          whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
          className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-border-new/40 p-10 rounded-3xl transition-all duration-300 group"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center p-2.5 shadow-lg group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.359 1.359 0 0 0-.415.962c0 .356.141.695.392.945l1.627 1.627a1.356 1.356 0 0 0 .945.392c.358 0 .697-.141.946-.392l7.848-7.847a1.391 1.391 0 0 0 .5-1.059c0-.354-.14-.69-.391-.94l-1.637-1.637A1.357 1.357 0 0 0 13.483 0zm-5.17 5.03a1.377 1.377 0 0 0-.961.414l-7.415 7.416a1.386 1.386 0 0 0-.414.96c0 .356.141.694.392.944l1.627 1.627a1.356 1.356 0 0 0 .945.392c.358 0 .697-.141.946-.392l5.488-5.489a1.396 1.396 0 0 0 .501-1.06c0-.354-.14-.69-.391-.94l-1.638-1.638a1.358 1.358 0 0 0-.936-.416zm12.564 3.424c-.357 0-.696.141-.945.392l-5.488 5.49a1.391 1.391 0 0 0-.501 1.059c0 .354.14.69.391.94l1.637 1.638a1.357 1.357 0 0 0 .962.414c.357 0 .696-.141.945-.392l7.415-7.416a1.386 1.386 0 0 0 .414-.96c0-.356-.141-.694-.392-.944l-1.627-1.627a1.356 1.356 0 0 0-.945-.392zM4.568 13.313c-.356 0-.695.14-.945.391l-1.627 1.627a1.359 1.359 0 0 0-.415.962c0 .356.141.695.392.945l9.77 9.77A1.391 1.391 0 0 0 12.703 24c.354 0 .69-.14.94-.391l1.637-1.638a1.357 1.357 0 0 0 .414-.962c0-.357-.141-.696-.392-.945l-7.847-7.848a1.356 1.356 0 0 0-.945-.392z"/></svg>
              </div>
              <div>
                <div className="font-serif text-xl text-ink flex items-center gap-2">
                  LeetCode
                  {leetcodeData?.activeBadge && (
                    <img 
                      src={leetcodeData.activeBadge.icon} 
                      alt={leetcodeData.activeBadge.displayName} 
                      title={leetcodeData.activeBadge.displayName}
                      className="w-6 h-6 object-contain inline-block hover:scale-110 transition-transform"
                    />
                  )}
                </div>
                <div className="font-mono text-[0.7rem] text-muted">adityasagar9991 · {Math.round(leetcodeData?.contest.rating || 1633)} Rating</div>
              </div>
            </div>
            <a href="https://leetcode.com/u/adityasagar9991" target="_blank" rel="noopener" className="text-muted hover:text-accent-new transition-colors">
              <ExternalLink size={18} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { label: "Solved", value: leetcodeData?.solved.total || "120+" },
              { label: "Rating", value: Math.round(leetcodeData?.contest.rating || 1633) },
              { label: "Global", value: "Top 20%" },
              { label: "Easy", value: leetcodeData?.solved.easy || "—" },
              { label: "Medium", value: leetcodeData?.solved.medium || "—" },
              { label: "Hard", value: leetcodeData?.solved.hard || "—" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-paper-warm/50 border border-border-new/20">
                <div className="font-serif text-[24px] text-ink leading-none mb-1">{stat.value}</div>
                <div className="font-mono text-[12px] tracking-wider uppercase text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Badges Section */}
          {leetcodeData?.badges && leetcodeData.badges.length > 0 && (
            <div className="mb-8">
              <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted mb-3">Earned Badges</div>
              <div className="flex flex-wrap gap-2.5">
                {leetcodeData.badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className="flex items-center gap-1.5 bg-paper-warm/50 border border-border-new/20 rounded-full pl-2 pr-3 py-1 text-xs text-ink hover:border-accent-new transition-all group/badge" 
                    title={badge.hoverText}
                  >
                    <img src={badge.icon} alt={badge.displayName} className="w-5 h-5 object-contain" />
                    <span className="font-mono text-[0.7rem] text-muted group-hover/badge:text-accent-new transition-colors">{badge.displayName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a href="https://leetcode.com/u/adityasagar9991" target="_blank" rel="noopener" className="btn-ghost w-full justify-center rounded-xl border-border-new/40 hover:border-accent-new hover:text-accent-new transition-all">View Profile ↗</a>
        </motion.div>
      </div>
    </section>
  );
}

// export default CodingProfile;
