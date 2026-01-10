'use client';

import React, { useState, useEffect } from "react";
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
    <section className="w-full py-16 px-4 flex flex-col gap-12">
      {/* GitHub Section */}
      <div className="w-full max-w-4xl mx-auto bg-card border-card rounded-3xl p-10 shadow-xl relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap gap-8 items-center relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-[#171515] shadow-lg flex items-center justify-center bg-[#171515]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>

          <div className="flex-1 min-w-[250px]">
            <h2 className="text-3xl font-bold mb-2 gradient-text">GitHub</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-secondary text-lg">@{data.username}</span>
              {data.location && (
                <span className="bg-card-hover px-2 py-1 rounded-xl text-sm text-secondary">
                  📍 {data.location}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary-500/20 px-3 py-1 rounded-full text-xs text-primary-500">Open Source</span>
              <span className="bg-primary-500/20 px-3 py-1 rounded-full text-xs text-primary-500">Full Stack</span>
              <span className="bg-primary-500/20 px-3 py-1 rounded-full text-xs text-primary-500">React</span>
            </div>
            <p className="text-secondary leading-relaxed max-w-xl">
              {data.bio || "Full Stack Developer passionate about building scalable web applications."}
            </p>
          </div>

          <a href="/github-repos" className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            View GitHub
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10">
          {[
            { label: "Repositories", value: data.publicRepos, icon: "📚" },
            { label: "Total Stars", value: data.stars, icon: "⭐" },
            { label: "Followers", value: data.followers, icon: "👥" },
            { label: "Following", value: data.following, icon: "👣" },
          ].map((stat, index) => (
            <div key={index} className="bg-card-hover border-card rounded-2xl p-5 flex flex-col items-center hover:bg-primary-500/10 transition-colors">
              <span className="text-2xl mb-2">{stat.icon}</span>
              <span className="text-2xl font-bold text-primary">{stat.value}</span>
              <span className="text-sm text-secondary">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LeetCode Section */}
      <div className="w-full max-w-4xl mx-auto bg-card border-card rounded-3xl p-10 shadow-xl relative overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap gap-8 items-center relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-[#FFA116] shadow-lg flex items-center justify-center bg-[#FFA116]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#000000">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
            </svg>
          </div>

          <div className="flex-1 min-w-[250px]">
            <h2 className="text-3xl font-bold mb-2 gradient-text">LeetCode</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-secondary text-lg">
                {leetcodeData ? `Rank: ${leetcodeData.ranking.toLocaleString()}` : "Algorithmic Challenges"}
              </span>
              {leetcodeData && (
                <span className="bg-card-hover px-2 py-1 rounded-xl text-sm text-secondary">
                  ⭐ {leetcodeData.star}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary-500/20 px-3 py-1 rounded-full text-xs text-primary-500">Algorithms</span>
              <span className="bg-primary-500/20 px-3 py-1 rounded-full text-xs text-primary-500">Data Structures</span>
              <span className="bg-primary-500/20 px-3 py-1 rounded-full text-xs text-primary-500">Problem Solving</span>
            </div>
            <p className="text-secondary leading-relaxed max-w-xl">
              {leetcodeData
                ? `Passionate about solving algorithmic challenges. Solved ${leetcodeData.solved.total} problems with ${leetcodeData.submissions.toLocaleString()} total submissions.`
                : "Passionate about solving algorithmic challenges and improving problem-solving skills through consistent practice."}
            </p>
          </div>

          <a href="/leetcode-stats" className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            View LeetCode
          </a>
        </div>

        {leetcodeData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10">
            <div className="bg-card-hover border-card rounded-2xl p-5 text-center">
              <span className="text-2xl font-bold text-primary-500">{leetcodeData.solved.total}</span>
              <div className="text-sm text-secondary mt-1">Solved</div>
            </div>
            <div className="bg-card-hover border-card rounded-2xl p-5 text-center">
              <span className="text-2xl font-bold text-green-500">{leetcodeData.solved.easy}</span>
              <div className="text-sm text-secondary mt-1">Easy</div>
            </div>
            <div className="bg-card-hover border-card rounded-2xl p-5 text-center">
              <span className="text-2xl font-bold text-yellow-500">{leetcodeData.solved.medium}</span>
              <div className="text-sm text-secondary mt-1">Medium</div>
            </div>
            <div className="bg-card-hover border-card rounded-2xl p-5 text-center">
              <span className="text-2xl font-bold text-red-500">{leetcodeData.solved.hard}</span>
              <div className="text-sm text-secondary mt-1">Hard</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
