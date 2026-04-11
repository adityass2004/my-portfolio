import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  Code,
  Eye,
  TrendingUp,
} from "lucide-react";
import { getPersonalInfo, PersonalInfo } from "../data/portfolioService";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  watchers_count: number;
  size: number;
}

interface Contribution {
  date: string;
  count: number;
  level: number;
}

const GithubRepos: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "created">(
    "updated"
  );
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  useEffect(() => {
    getPersonalInfo().then(setPersonalInfo).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!personalInfo?.github) return;
      
      try {
        setLoading(true);
        setError(null);

        // Extract username from GitHub URL
        const username = personalInfo.github.split("/").pop();

        // Fetch repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=${sortBy}&direction=desc`
        );
        if (!reposResponse.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const reposData = await reposResponse.json();
        setRepos(reposData);

        // Fetch contributions
        try {
          const contribResponse = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
          );
          if (contribResponse.ok) {
            const contribData = await contribResponse.json();
            setContributions(contribData.contributions || []);
          }
        } catch (contribError) {
          console.warn("Failed to fetch contributions:", contribError);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [personalInfo, sortBy]);

  const languages = Array.from(
    new Set(repos.map((repo) => repo.language).filter(Boolean))
  );

  const filteredRepos =
    filterLanguage === "all"
      ? repos
      : repos.filter((repo) => repo.language === filterLanguage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} KB`;
    return `${(size / 1024).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="font-serif text-[2rem] text-ink mb-2 animate-pulse">
            Fetching Repositories<span className="text-accent-new">...</span>
          </div>
          <div className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted">
            GitHub API
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-accent-new mb-4">
            Error Loading Repositories
          </h2>
          <p className="font-mono text-sm text-muted">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-ghost mt-6">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <section id="github-repos" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="section-header fade-in visible">
          <span className="section-num">09</span>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ink text-white rounded-xl flex items-center justify-center p-2.5 shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </div>
            <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] leading-[1.1] text-ink">Open Source Repos</h2>
          </div>
        </div>

        {/* Stats and Filters */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-12 fade-in visible">
          <div className="flex flex-wrap gap-4">
            <div className="stat-card min-w-[140px]">
              <div className="font-serif text-[2rem] text-ink leading-none mb-1">{repos.length}</div>
              <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Total Repos</div>
            </div>
            <div className="stat-card min-w-[140px]">
              <div className="font-serif text-[2rem] text-ink leading-none mb-1">
                {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
              </div>
              <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Total Stars</div>
            </div>
            <div className="stat-card min-w-[140px]">
              <div className="font-serif text-[2rem] text-ink leading-none mb-1">
                {repos.reduce((sum, repo) => sum + repo.forks_count, 0)}
              </div>
              <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Total Forks</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "updated" | "stars" | "created")}
              className="fi !w-auto min-w-[160px]"
            >
              <option value="updated">Sort by Updated</option>
              <option value="stars">Sort by Stars</option>
              <option value="created">Sort by Created</option>
            </select>

            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="fi !w-auto min-w-[160px]"
            >
              <option value="all">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Monthly Contributions Chart */}
        <div className="aside-item mb-12 fade-in visible">
          <div className="flex items-center gap-2 mb-6">
            <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted">Contribution Activity</div>
            <div className="h-[1px] flex-1 bg-border-new"></div>
          </div>
          {contributions && contributions.length > 0 ? (
            <ContributionChart contributions={contributions} />
          ) : (
            <div className="text-center py-8">
              <p className="font-mono text-sm text-muted">No contribution data available</p>
            </div>
          )}
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.4rem] fade-in visible">
          {filteredRepos.map((repo, index) => (
            <div key={repo.id} className="project-card h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="pcat font-mono text-[0.64rem] tracking-[0.12em] uppercase text-accent-new">
                  {repo.language || "Markdown"}
                </span>
                <span className="font-mono text-[0.6rem] text-muted">{formatSize(repo.size)}</span>
              </div>
              <h3 className="pname font-serif text-[1.2rem] text-ink leading-[1.3] mb-2">{repo.name}</h3>
              <p className="pdesc text-[0.87rem] text-muted leading-[1.7] flex-1 mb-4 line-clamp-3">
                {repo.description || "No description available"}
              </p>

              <div className="flex items-center justify-between text-[0.7rem] text-muted font-mono mb-4 pt-4 border-t border-border-new/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-accent-new" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={12} className="text-accent-new" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
                <span>{formatDate(repo.updated_at)}</span>
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className="pill !text-[0.6rem] !px-2 !py-0.5">{topic}</span>
                  ))}
                </div>
              )}

              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full justify-center text-[0.7rem]">
                View Repository ↗
              </a>
            </div>
          ))}
        </div>

        {filteredRepos.length === 0 && (
          <div className="text-center py-20 fade-in visible">
            <h3 className="font-serif text-xl text-ink mb-2">No repositories found</h3>
            <p className="font-mono text-sm text-muted">Try adjusting your filters or check back later.</p>
          </div>
        )}

        <div className="flex justify-center mt-16 fade-in visible">
          <button onClick={() => window.history.back()} className="btn-primary">
            ← Back to Portfolio
          </button>
        </div>
      </div>
    </section>
  );
};
// Updated Contribution Chart Component
function ContributionChart({
  contributions,
}: {
  contributions: Contribution[];
}) {
  const { gridItems, monthLabels } = processToLeetCodeGrid(contributions);

  return (
    <div className="overflow-x-auto py-4 scrollbar-hide">
      <div className="inline-flex flex-col min-w-max">
        {/* Month Labels Row */}
        <div className="flex text-[10px] text-gray-400 h-5 mb-1 ml-10 relative">
          {monthLabels.map((label, i) => (
            <div
              key={i}
              className="absolute whitespace-nowrap"
              style={{ left: `${label.index * 13}px` }}
            >
              {label.name}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Day Labels - Specifically positioned for a 7-day grid */}
          <div className="flex flex-col text-[10px] text-gray-400 h-[91px] justify-between text-right pr-2">
            <span className="h-[10px] flex items-center justify-end"></span>{" "}
            {/* Sun */}
            <span className="h-[10px] flex items-center justify-end">Mon</span>
            <span className="h-[10px] flex items-center justify-end"></span>{" "}
            {/* Tue */}
            <span className="h-[10px] flex items-center justify-end">Wed</span>
            <span className="h-[10px] flex items-center justify-end"></span>{" "}
            {/* Thu */}
            <span className="h-[10px] flex items-center justify-end">Fri</span>
            <span className="h-[10px] flex items-center justify-end"></span>{" "}
            {/* Sat */}
          </div>

          {/* The Actual Grid */}
          <div className="flex gap-[3px]">
            {gridItems.map((item, idx) =>
              item.isSpacer ? (
                <div key={idx} className="w-[5px]" />
              ) : (
                <div key={idx} className="flex flex-col gap-[3px]">
                  {item.days?.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      className="w-[10px] h-[10px] rounded-[2px]"
                      style={{
                        backgroundColor: day?.isPadding
                          ? "transparent"
                          : day?.count > 0
                          ? getContributionColor(day.level)
                          : "rgba(148,163,184,0.1)",
                      }}
                      title={
                        day?.date
                          ? `${day.date}: ${day.count} contributions`
                          : ""
                      }
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Logic to transform raw contributions into a 7-day-a-week grid flow
 */
function processToLeetCodeGrid(contributions: Contribution[]) {
  if (contributions.length === 0) return { gridItems: [], monthLabels: [] };

  const contribMap = new Map(contributions.map((c) => [c.date, c]));

  // Setup: Last 12 months starting from the Sunday of that week
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  while (startDate.getDay() !== 0) {
    // Roll back to the nearest Sunday
    startDate.setDate(startDate.getDate() - 1);
  }

  const gridItems: Array<{ days?: any[]; isSpacer?: boolean }> = [];
  const monthLabels: { name: string; index: number }[] = [];

  let currentColumn: any[] = [];
  let prevMonth = -1;
  let colIndex = 0;

  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().split("T")[0];
    const dayOfWeek = cursor.getDay(); // 0 (Sun) to 6 (Sat)
    const month = cursor.getMonth();

    // Month Label Logic: Record the label when the month first appears
    if (month !== prevMonth) {
      monthLabels.push({
        name: cursor.toLocaleDateString("en-US", { month: "short" }),
        index: colIndex,
      });

      // Add a spacer column at month boundaries (except first month)
      if (prevMonth !== -1 && dayOfWeek === 0) {
        gridItems.push({ isSpacer: true });
        colIndex++;
      }
      prevMonth = month;
    }

    const dayData = contribMap.get(dateStr) || {
      date: dateStr,
      count: 0,
      level: 0,
    };
    currentColumn.push(dayData);

    // If Saturday, push the column and reset
    if (dayOfWeek === 6) {
      gridItems.push({ days: currentColumn });
      currentColumn = [];
      colIndex++;
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  // Handle final partial week
  if (currentColumn.length > 0) {
    while (currentColumn.length < 7) currentColumn.push({ isPadding: true });
    gridItems.push({ days: currentColumn });
  }

  return { gridItems, monthLabels };
}

function getContributionColor(level: number): string {
  // GitHub-style dark mode colors
  const darkColors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
  return darkColors[level] || darkColors[0];
}

export default GithubRepos;
