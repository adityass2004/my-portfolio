import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface LeetCodeUser {
  username: string;
  profile: {
    realName: string;
    userAvatar: string;
    ranking: number;
    globalRanking: number;
    starRating: number;
    countryName: string;
  };
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
  submitStatsGlobal: {
    acSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
  };
  submissionCalendar: string;
}

function processSubmissionCalendar(calendarData: string) {
  try {
    const data = JSON.parse(calendarData);
    const monthlyStats: { [key: string]: number } = {};

    Object.entries(data).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = 0;
      }

      monthlyStats[monthKey] += count as number;
    });

    return Object.entries(monthlyStats)
      .map(([month, submissions]) => ({
        month,
        submissions,
        monthName: new Date(month + '-01').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        }),
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  } catch (error) {
    console.error('Error processing submission calendar:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            userAvatar
            globalRanking
            ranking
            starRating
            countryName
          }
          activeBadge {
            id
            name
            icon
            displayName
          }
          badges {
            id
            name
            icon
            displayName
            hoverText
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          submissionCalendar
        }

        userContestRanking(username: $username) {
          rating
          globalRanking
          totalParticipants
          attendedContestsCount
          topPercentage
        }

        userContestRankingHistory(username: $username) {
          attended
          rating
          ranking
          contest {
            title
            startTime
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://leetcode.com',
        Origin: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `LeetCode API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    const user: LeetCodeUser = data?.data?.matchedUser;
    const contest = data?.data?.userContestRanking;
    const contestHistory = data?.data?.userContestRankingHistory || [];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const statsMap: { [key: string]: any } = {};
    user.submitStatsGlobal.acSubmissionNum.forEach((stat: any) => {
      statsMap[stat.difficulty.toLowerCase()] = stat;
    });

    const monthlyData = processSubmissionCalendar(user.submissionCalendar);

    return NextResponse.json({
      name: user.profile.realName,
      avatar: user.profile.userAvatar,
      country: user.profile.countryName,
      globalranking: user.profile.globalRanking,
      ranking: user.profile.ranking,
      star: user.profile.starRating,
      activeBadge: user.activeBadge ? {
        id: user.activeBadge.id,
        name: user.activeBadge.name,
        icon: user.activeBadge.icon.startsWith('http') ? user.activeBadge.icon : `https://leetcode.com${user.activeBadge.icon}`,
        displayName: user.activeBadge.displayName
      } : null,
      badges: user.badges ? user.badges.map((b: any) => ({
        id: b.id,
        name: b.name,
        icon: b.icon.startsWith('http') ? b.icon : `https://leetcode.com${b.icon}`,
        displayName: b.displayName,
        hoverText: b.hoverText
      })) : [],

      solved: {
        total: statsMap.all?.count ?? 0,
        easy: statsMap.easy?.count ?? 0,
        medium: statsMap.medium?.count ?? 0,
        hard: statsMap.hard?.count ?? 0,
      },

      submissions: statsMap.all?.submissions ?? 0,
      profileUrl: `https://leetcode.com/${user.username}`,

      monthlySubmissions: monthlyData,

      contest: {
        rating: contest?.rating ?? 0,
        globalRanking: contest?.globalRanking ?? null,
        contestsAttended: contest?.attendedContestsCount ?? 0,
        topPercentage: contest?.topPercentage ?? null,
      },

      contestHistory: contestHistory
        .filter((c: any) => c.attended)
        .slice(-10)
        .map((c: any) => ({
          contest: c.contest.title,
          rating: c.rating,
          ranking: c.ranking,
          time: c.contest.startTime,
        })),
    });
  } catch (error) {
    console.error('LeetCode API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch LeetCode data' },
      { status: 500 }
    );
  }
}