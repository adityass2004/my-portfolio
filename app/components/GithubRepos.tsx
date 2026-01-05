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
      <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold gradient-text">
            Loading GitHub Repositories...<span className="loading-dots"></span>
          </h2>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Repositories
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-dark-900 py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            My GitHub Repositories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore all my public repositories on GitHub. Each project
            represents a step in my journey as a developer.
          </p>
        </motion.div>

        {/* Stats and Filters */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {repos.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Repos
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Stars
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {repos.reduce((sum, repo) => sum + repo.forks_count, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Forks
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "updated" | "stars" | "created")
                }
                className="px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="updated">Sort by Updated</option>
                <option value="stars">Sort by Stars</option>
                <option value="created">Sort by Created</option>
              </select>

              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
        </motion.div>

        {/* Monthly Contributions Chart */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-primary-500" />
            Monthly Contributions
          </h3>
          {contributions && contributions.length > 0 ? (
            <ContributionChart contributions={contributions} />
          ) : (
            <div className="text-center py-8">
              <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No contribution data available
              </p>
            </div>
          )}
        </motion.div>

        {/* Repositories Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {repo.name}
                  </h3>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {repo.description || "No description available"}
                </p>

                {repo.language && (
                  <div className="flex items-center gap-2 mb-4">
                    <Code size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {repo.language}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork size={14} />
                      <span>{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{repo.watchers_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(repo.updated_at)}</span>
                  </div>
                </div>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Size: {formatSize(repo.size)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredRepos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Github size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No repositories found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your filters or check back later.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
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
