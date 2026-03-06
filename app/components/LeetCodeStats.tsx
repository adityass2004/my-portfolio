import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  // Calendar,
  Trophy,
  Star,
  Code,
  Zap,
  BarChart3,
} from "lucide-react";
import { getPersonalInfo, PersonalInfo } from "../data/portfolioService";

interface LeetCodeData {
  name: string;
  avatar: string;
  country: string;
  ranking: number;
  star: number;

  contest: {
    rating: number;
    globalRanking: number | null;
    contestsAttended: number;
    topPercentage: number | null;
  };

  solved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };

  submissions: number;
  profileUrl: string;

  monthlySubmissions: Array<{
    month: string;
    submissions: number;
    monthName: string;
  }>;

  submissionCalendar?: string;
}

interface DaySubmission {
  date: string;
  count: number;
  dayName: string;
}

interface WeekSubmission {
  week: string;
  count: number;
  weekLabel: string;
}

const LeetCodeStats: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [leetcodeData, setLeetCodeData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartView, setChartView] = useState<"monthly" | "weekly" | "daily">(
    "monthly"
  );
  const [dailyData, setDailyData] = useState<DaySubmission[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeekSubmission[]>([]);

  useEffect(() => {
    getPersonalInfo().then(setPersonalInfo).catch(console.error);
  }, []);

  const processSubmissionCalendar = (calendarData: string) => {
    try {
      const data = JSON.parse(calendarData);
      const daily: DaySubmission[] = [];
      const weeklyStats: Record<string, number> = {};

      // Process daily data (last 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      Object.entries(data).forEach(([timestamp, count]: [string, any]) => {
        const date = new Date(parseInt(timestamp) * 1000);

        if (date >= thirtyDaysAgo) {
          daily.push({
            date: date.toISOString().split("T")[0],
            count: count,
            dayName: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
          });
        }

        // Process weekly data (last 12 weeks)
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split("T")[0];

        if (!weeklyStats[weekKey]) {
          weeklyStats[weekKey] = 0;
        }
        weeklyStats[weekKey] += count;
      });

      // Convert weekly stats to array
      const weekly = Object.entries(weeklyStats)
        .map(([week, count]) => ({
          week,
          count,
          weekLabel: new Date(week).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }))
        .sort((a, b) => a.week.localeCompare(b.week))
        .slice(-12);

      setDailyData(daily.sort((a, b) => a.date.localeCompare(b.date)));
      setWeeklyData(weekly);
    } catch (error) {
      console.error("Error processing submission calendar:", error);
    }
  };

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      if (!personalInfo?.leetcode) return;

      try {
        // Extract username from LeetCode URL
        const username = personalInfo.leetcode.split("/").pop() || "adityass2004";

        const response = await fetch(
          `/api/leetcode?username=${encodeURIComponent(username)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch LeetCode data");
        }
        const data = await response.json();
        setLeetCodeData(data);

        // Process calendar data if available
        if (data.submissionCalendar) {
          processSubmissionCalendar(data.submissionCalendar);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeData();
  }, [personalInfo]);

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
            Loading LeetCode Statistics...<span className="loading-dots"></span>
          </h2>
        </motion.div>
      </div>
    );
  }

  if (error || !leetcodeData) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading LeetCode Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "No data available"}
          </p>
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
            LeetCode Statistics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track your problem-solving journey and algorithmic progress on
            LeetCode.
          </p>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target
                className="text-green-600 dark:text-green-400"
                size={24}
              />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {leetcodeData.solved.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Solved
            </div>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>

            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {Math.round(leetcodeData.contest.rating)}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Contest Rating
            </div>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-purple-600 dark:text-purple-400" size={24} />
            </div>

            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {leetcodeData.contest.contestsAttended}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Contests Attended
            </div>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {leetcodeData.ranking.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Global Ranking
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star
                className="text-yellow-600 dark:text-yellow-400"
                size={24}
              />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {leetcodeData.star}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Star Rating
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {leetcodeData.submissions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Submissions
            </div>
          </div>
        </motion.div>

        {/* Difficulty Breakdown */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              Easy Problems
            </h3>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {leetcodeData.solved.easy}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Solved
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              Medium Problems
            </h3>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {leetcodeData.solved.medium}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Solved
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              Hard Problems
            </h3>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {leetcodeData.solved.hard}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Solved
            </div>
          </div>
        </motion.div>

        {/* Submissions Chart with View Toggle */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={24} className="text-primary-500" />
              Submission Activity
            </h3>
            <div className="flex bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
              <button
                onClick={() => setChartView("daily")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${chartView === "daily"
                  ? "bg-white dark:bg-dark-600 text-primary-600 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
              >
                Daily (30d)
              </button>
              <button
                onClick={() => setChartView("weekly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${chartView === "weekly"
                  ? "bg-white dark:bg-dark-600 text-primary-600 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
              >
                Weekly (12w)
              </button>
              <button
                onClick={() => setChartView("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${chartView === "monthly"
                  ? "bg-white dark:bg-dark-600 text-primary-600 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
              >
                Monthly (12m)
              </button>
            </div>
          </div>

          {chartView === "monthly" &&
            leetcodeData.monthlySubmissions &&
            leetcodeData.monthlySubmissions.length > 0 && (
              <MonthlyChart data={leetcodeData.monthlySubmissions} />
            )}

          {chartView === "weekly" && weeklyData.length > 0 && (
            <WeeklyChart data={weeklyData} />
          )}

          {chartView === "daily" && dailyData.length > 0 && (
            <DailyChart data={dailyData} />
          )}

          {((chartView === "monthly" &&
            (!leetcodeData.monthlySubmissions ||
              leetcodeData.monthlySubmissions.length === 0)) ||
            (chartView === "weekly" && weeklyData.length === 0) ||
            (chartView === "daily" && dailyData.length === 0)) && (
              <div className="text-center py-8">
                <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No {chartView} submission data available
                </p>
              </div>
            )}
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Code size={24} className="text-primary-500" />
            Profile Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold">
                    👤
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {leetcodeData.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Name
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    🌍
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {leetcodeData.country}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Country
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    🏆
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    #{leetcodeData.ranking.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Global Ranking
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                    ⭐
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {leetcodeData.star} Stars
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
            <a
              href={leetcodeData.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              View LeetCode Profile
              <TrendingUp size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Chart Components
function MonthlyChart({
  data,
}: {
  data: Array<{ month: string; submissions: number; monthName: string }>;
}) {
  const maxSubmissions = Math.max(...data.map((d) => d.submissions));
  const chartHeight = 300;
  const chartWidth = Math.min(800, data.length * 60);
  const barWidth = chartWidth / data.length - 10;

  return (
    <div className="overflow-x-auto p-4">
      <svg width={chartWidth} height={chartHeight + 60} className="min-w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartHeight - ratio * chartHeight;
          const value = Math.round(maxSubmissions * ratio);
          return (
            <g key={i}>
              <line
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="rgba(148,163,184,0.2)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x={-10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#94a3b8"
              >
                {value}
              </text>
            </g>
          );
        })}
        {data.map((item, index) => {
          const barHeight = (item.submissions / maxSubmissions) * chartHeight;
          const x = index * (chartWidth / data.length) + 5;
          const y = chartHeight - barHeight;
          return (
            <g key={item.month}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#monthlyGradient)"
                rx="4"
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
              >
                {item.monthName}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#a855f7"
              >
                {item.submissions}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient
            id="monthlyGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function WeeklyChart({ data }: { data: WeekSubmission[] }) {
  const maxSubmissions = Math.max(...data.map((d) => d.count));
  const chartHeight = 300;
  const chartWidth = Math.min(800, data.length * 50);
  const barWidth = chartWidth / data.length - 8;

  return (
    <div className="overflow-x-auto p-4">
      <svg width={chartWidth} height={chartHeight + 60} className="min-w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartHeight - ratio * chartHeight;
          const value = Math.round(maxSubmissions * ratio);
          return (
            <g key={i}>
              <line
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="rgba(148,163,184,0.2)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x={-10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#94a3b8"
              >
                {value}
              </text>
            </g>
          );
        })}
        {data.map((item, index) => {
          const barHeight = (item.count / maxSubmissions) * chartHeight;
          const x = index * (chartWidth / data.length) + 4;
          const y = chartHeight - barHeight;
          return (
            <g key={item.week}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#weeklyGradient)"
                rx="3"
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#94a3b8"
                transform={`rotate(45, ${x + barWidth / 2}, ${chartHeight + 20
                  })`}
              >
                {item.weekLabel}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#3b82f6"
              >
                {item.count}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="weeklyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function DailyChart({ data }: { data: DaySubmission[] }) {
  const maxSubmissions = Math.max(...data.map((d) => d.count));
  const chartHeight = 300;
  const chartWidth = Math.min(1000, data.length * 25);
  const barWidth = chartWidth / data.length - 2;

  return (
    <div className="overflow-x-auto p-4">
      <svg width={chartWidth} height={chartHeight + 60} className="min-w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartHeight - ratio * chartHeight;
          const value = Math.round(maxSubmissions * ratio);
          return (
            <g key={i}>
              <line
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="rgba(148,163,184,0.2)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x={-10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#94a3b8"
              >
                {value}
              </text>
            </g>
          );
        })}
        {data.map((item, index) => {
          const barHeight = (item.count / maxSubmissions) * chartHeight;
          const x = index * (chartWidth / data.length) + 1;
          const y = chartHeight - barHeight;
          return (
            <g key={item.date}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#dailyGradient)"
                rx="2"
              />
              {index % 5 === 0 && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                  transform={`rotate(45, ${x + barWidth / 2}, ${chartHeight + 20
                    })`}
                >
                  {item.dayName}
                </text>
              )}
              {item.count > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#10b981"
                >
                  {item.count}
                </text>
              )}
            </g>
          );
        })}
        <defs>
          <linearGradient id="dailyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
export default LeetCodeStats;
