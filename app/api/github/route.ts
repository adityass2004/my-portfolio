import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface GitHubUser {
  name: string;
  login: string;
  avatar_url: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  language: string | null;
  stargazers_count: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'portfolio-app',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${userResponse.status}` },
        { status: userResponse.status }
      );
    }

    const userData: GitHubUser = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        'User-Agent': 'portfolio-app',
      },
    });

    const reposData: GitHubRepo[] = reposResponse.ok ? await reposResponse.json() : [];

    // Calculate total stars
    const totalStars = Array.isArray(reposData) 
      ? reposData.reduce((sum: number, repo: GitHubRepo) => sum + repo.stargazers_count, 0)
      : 0;

    // Get top languages
    const languagesMap: { [key: string]: number } = {};
    if (Array.isArray(reposData)) {
      reposData.forEach((repo: GitHubRepo) => {
        if (repo.language) {
          languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
        }
      });
    }

    const topLanguages = Object.entries(languagesMap)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([language]) => language);

    // Try to fetch contributions
    let contributions: Array<{ date: string; count: number; level: number }> = [];
    try {
      const contribResponse = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
      if (contribResponse.ok) {
        const contribData = await contribResponse.json();
        contributions = contribData.contributions || [];
      }
    } catch (error) {
      console.warn('Failed to fetch contributions:', error);
    }

    // Try to fetch achievements/badges from public GitHub profile
    let achievements: Array<{ displayName: string; icon: string }> = [];
    try {
      const profileResponse = await fetch(`https://github.com/${username}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        },
      });
      if (profileResponse.ok) {
        const html = await profileResponse.text();
        const regex = /<img[^>]+class="achievement-badge-sidebar"[^>]*>/g;
        let match;
        const uniqueNames = new Set<string>();
        while ((match = regex.exec(html)) !== null) {
          const imgTag = match[0];
          const srcMatch = imgTag.match(/src="([^"]+)"/);
          const altMatch = imgTag.match(/alt="Achievement:\s*([^"]+)"/);
          if (srcMatch && altMatch) {
            const displayName = altMatch[1];
            const icon = srcMatch[1];
            if (!uniqueNames.has(displayName)) {
              uniqueNames.add(displayName);
              achievements.push({ displayName, icon });
            }
          }
        }
      }
    } catch (achError) {
      console.warn('Failed to fetch GitHub achievements:', achError);
    }

    return NextResponse.json({
      name: userData.name,
      username: userData.login,
      avatar: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
      followers: userData.followers,
      following: userData.following,
      publicRepos: userData.public_repos,
      stars: totalStars,
      profileUrl: userData.html_url,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
      topLanguages,
      contributions,
      achievements,
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}