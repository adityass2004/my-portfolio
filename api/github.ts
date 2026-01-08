// GitHub API utility for Create React App
// Note: This file is for reference only - actual API is in setupProxy.js

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

// Interface matching CodingProfile component expectations
export interface GithubData {
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

export async function fetchGitHubData(username: string): Promise<GithubData> {
  if (!username) {
    throw new Error('Username is required');
  }

  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'portfolio-app',
      },
    });

    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`);
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

    // Try to fetch contributions (optional, may fail due to CORS)
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

    // Return data matching CodingProfile interface
    return {
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
    };
  } catch (error) {
    console.error('GitHub API error:', error);
    throw error;
  }
}