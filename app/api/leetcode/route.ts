import { NextRequest, NextResponse } from 'next/server';

interface LeetCodeUser {
  username: string;
  profile: {
    realName: string;
    userAvatar: string;
    ranking: number;
    starRating: number;
    countryName: string;
  };
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
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

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
            ranking
            starRating
            countryName
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
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
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

    if (data.errors) {
      return NextResponse.json(
        { error: 'GraphQL errors', details: data.errors },
        { status: 502 }
      );
    }

    const user: LeetCodeUser = data?.data?.matchedUser;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Process submission stats
    const statsMap: { [key: string]: any } = {};
    user.submitStatsGlobal.acSubmissionNum.forEach((stat: any) => {
      statsMap[stat.difficulty.toLowerCase()] = stat;
    });

    const monthlyData = processSubmissionCalendar(user.submissionCalendar);

    return NextResponse.json({
      name: user.profile.realName,
      avatar: user.profile.userAvatar,
      country: user.profile.countryName,
      ranking: user.profile.ranking,
      star: user.profile.starRating,
      solved: {
        total: statsMap.all?.count ?? 0,
        easy: statsMap.easy?.count ?? 0,
        medium: statsMap.medium?.count ?? 0,
        hard: statsMap.hard?.count ?? 0,
      },
      submissions: statsMap.all?.submissions ?? 0,
      profileUrl: `https://leetcode.com/${user.username}`,
      monthlySubmissions: monthlyData,
    });
  } catch (error) {
    console.error('LeetCode API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LeetCode data' },
      { status: 500 }
    );
  }
}