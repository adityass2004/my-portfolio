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
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="font-serif text-[2rem] text-ink mb-2 animate-pulse">
            Fetching LeetCode Stats<span className="text-accent-new">...</span>
          </div>
          <div className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted">
            LeetCode API
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !leetcodeData) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-accent-new mb-4">
            Error Loading LeetCode Data
          </h2>
          <p className="font-mono text-sm text-muted">{error || "No data available"}</p>
          <button onClick={() => window.location.reload()} className="btn-ghost mt-6">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <section id="leetcode-stats" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">10</span>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center p-2.5 shadow-lg">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.359 1.359 0 0 0-.415.962c0 .356.141.695.392.945l1.627 1.627a1.356 1.356 0 0 0 .945.392c.358 0 .697-.141.946-.392l7.848-7.847a1.391 1.391 0 0 0 .5-1.059c0-.354-.14-.69-.391-.94l-1.637-1.637A1.357 1.357 0 0 0 13.483 0zm-5.17 5.03a1.377 1.377 0 0 0-.961.414l-7.415 7.416a1.386 1.386 0 0 0-.414.96c0 .356.141.694.392.944l1.627 1.627a1.356 1.356 0 0 0 .945.392c.358 0 .697-.141.946-.392l5.488-5.489a1.396 1.396 0 0 0 .501-1.06c0-.354-.14-.69-.391-.94l-1.638-1.638a1.358 1.358 0 0 0-.936-.416zm12.564 3.424c-.357 0-.696.141-.945.392l-5.488 5.49a1.391 1.391 0 0 0-.501 1.059c0 .354.14.69.391.94l1.637 1.638a1.357 1.357 0 0 0 .962.414c.357 0 .696-.141.945-.392l7.415-7.416a1.386 1.386 0 0 0 .414-.96c0-.356-.141-.694-.392-.944l-1.627-1.627a1.356 1.356 0 0 0-.945-.392zM4.568 13.313c-.356 0-.695.14-.945.391l-1.627 1.627a1.359 1.359 0 0 0-.415.962c0 .356.141.695.392.945l9.77 9.77A1.391 1.391 0 0 0 12.703 24c.354 0 .69-.14.94-.391l1.637-1.638a1.357 1.357 0 0 0 .414-.962c0-.357-.141-.696-.392-.945l-7.847-7.848a1.356 1.356 0 0 0-.945-.392z"/></svg>
          </div>
          <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">LeetCode Stats</h2>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[1.2rem] mb-12 fade-in visible">
        <div className="stat-card">
          <div className="font-serif text-[2rem] text-ink leading-none mb-1">{leetcodeData.solved.total}</div>
          <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Total Solved</div>
        </div>
        <div className="stat-card">
          <div className="font-serif text-[2rem] text-ink leading-none mb-1">{Math.round(leetcodeData.contest.rating)}</div>
          <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Contest Rating</div>
        </div>
        <div className="stat-card">
          <div className="font-serif text-[2rem] text-ink leading-none mb-1">{leetcodeData.contest.contestsAttended}</div>
          <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Contests</div>
        </div>
        <div className="stat-card">
          <div className="font-serif text-[2rem] text-ink leading-none mb-1">{leetcodeData.ranking.toLocaleString()}</div>
          <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Global Rank</div>
        </div>
        <div className="stat-card">
          <div className="font-serif text-[2rem] text-ink leading-none mb-1">{leetcodeData.star}</div>
          <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Stars</div>
        </div>
        <div className="stat-card">
          <div className="font-serif text-[2rem] text-ink leading-none mb-1">{leetcodeData.submissions}</div>
          <div className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted">Submissions</div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.4rem] mb-12 fade-in visible">
        <div className="aside-item border-l-4 border-l-[#22a44b]">
          <div className="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-muted mb-1">Easy</div>
          <div className="font-serif text-[1.8rem] text-ink leading-none">{leetcodeData.solved.easy}</div>
        </div>
        <div className="aside-item border-l-4 border-l-[#febc11]">
          <div className="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-muted mb-1">Medium</div>
          <div className="font-serif text-[1.8rem] text-ink leading-none">{leetcodeData.solved.medium}</div>
        </div>
        <div className="aside-item border-l-4 border-l-[#f63737]">
          <div className="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-muted mb-1">Hard</div>
          <div className="font-serif text-[1.8rem] text-ink leading-none">{leetcodeData.solved.hard}</div>
        </div>
      </div>

      {/* Submissions Chart with View Toggle */}
      <div className="coding-card mb-12 fade-in visible">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted">Submission Activity</div>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly"].map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view as any)}
                className={`skill-tab !text-[0.6rem] !px-3 !py-1 ${chartView === view ? 'active' : ''}`}
              >
                {view.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-paper p-6 border border-border-new overflow-hidden">
          {chartView === "monthly" && leetcodeData.monthlySubmissions?.length > 0 && (
            <MonthlyChart data={leetcodeData.monthlySubmissions} />
          )}
          {chartView === "weekly" && weeklyData.length > 0 && (
            <WeeklyChart data={weeklyData} />
          )}
          {chartView === "daily" && dailyData.length > 0 && (
            <DailyChart data={dailyData} />
          )}

          {((chartView === "monthly" && (!leetcodeData.monthlySubmissions || leetcodeData.monthlySubmissions.length === 0)) ||
            (chartView === "weekly" && weeklyData.length === 0) ||
            (chartView === "daily" && dailyData.length === 0)) && (
              <div className="text-center py-12">
                <p className="font-mono text-sm text-muted">No {chartView} submission data available</p>
              </div>
            )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid md:grid-cols-2 gap-[1.4rem] fade-in visible">
        <div className="aside-item">
          <div className="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-muted mb-2">Platform Name</div>
          <div className="font-serif text-[1.4rem] text-ink">{leetcodeData.name}</div>
        </div>
        <div className="aside-item">
          <div className="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-muted mb-2">Location</div>
          <div className="font-serif text-[1.4rem] text-ink">{leetcodeData.country || "Not specified"}</div>
        </div>
        <div className="aside-item">
          <div className="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-muted mb-2">Global Ranking</div>
          <div className="font-serif text-[1.4rem] text-ink">#{leetcodeData.ranking.toLocaleString()}</div>
        </div>
        <div className="aside-item">
          <div className="font-mono text-[0.64rem] tracking-[0.12em] uppercase text-muted mb-2">Platform Rating</div>
          <div className="font-serif text-[1.4rem] text-ink">{leetcodeData.star} Stars</div>
        </div>
      </div>

      {/* Badges Section */}
      {leetcodeData.badges && leetcodeData.badges.length > 0 && (
        <div className="coding-card mt-12 mb-12 fade-in visible">
          <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted mb-6">Earned Badges</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {leetcodeData.badges.map((badge) => (
              <div 
                key={badge.id} 
                className="flex items-center gap-4 p-5 rounded-2xl bg-paper-warm/50 border border-border-new/20 hover:border-accent-new hover:shadow-lg transition-all group"
                title={badge.hoverText}
              >
                <img src={badge.icon} alt={badge.displayName} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-serif text-[1rem] text-ink leading-tight">{badge.displayName}</div>
                  <div className="font-mono text-[0.65rem] text-muted uppercase mt-1">{badge.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-16 fade-in visible">
        <a href={leetcodeData.profileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
          View LeetCode Profile ↗
        </a>
        <button onClick={() => window.history.back()} className="btn-ghost">
          ← Back to Portfolio
        </button>
      </div>
    </section>
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
