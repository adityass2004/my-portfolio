// LeetCode API utility for Create React App
// Note: This file is for reference only - actual API is in setupProxy.js

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

export async function fetchLeetCodeData(username: string) {
  if (!username) {
    throw new Error('Username is required');
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
      throw new Error(`LeetCode API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const user: LeetCodeUser = data?.data?.matchedUser;
    if (!user) {
      throw new Error('User not found');
    }

    // Process submission stats
    const statsMap: { [key: string]: any } = {};
    user.submitStatsGlobal.acSubmissionNum.forEach((stat: any) => {
      statsMap[stat.difficulty.toLowerCase()] = stat;
    });

    // Process submission calendar for monthly data
    const processSubmissionCalendar = (calendarData: string) => {
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
    };

    const monthlyData = processSubmissionCalendar(user.submissionCalendar);

    return {
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
    };
  } catch (error) {
    console.error('LeetCode API error:', error);
    throw error;
  }
}