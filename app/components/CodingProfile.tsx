import React, { useState, useEffect } from 'react';
import { getPersonalInfo, PersonalInfo } from '../data/portfolioService';

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
      const res = await fetch(
        `/api/leetcode?username=${encodeURIComponent(username)}`
      );

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", text.substring(0, 100));
        throw new Error(
          "API response was not JSON (likely 404 or HTML fallback)"
        );
      }

      if (!res.ok) {
        const errJson = await res.json();
        console.error("API Error Response:", errJson);
        throw new Error(errJson.error || "Failed to fetch");
      }

      const json = await res.json();
      return json as LeetCodeData;
    } catch (err) {
      console.error("Fetch error details:", err);
      throw err;
    }
  }
  
  function extractLeetCodeUsername(
    input: string | null | undefined
  ): string | null {
    if (!input) return null;

    try {
      if (!input.includes("leetcode.com")) {
        return input.replace(/^@/, "").trim();
      }

      const url = new URL(
        input.startsWith("http") ? input : `https://${input}`
      );

      const parts = url.pathname.split("/").filter(Boolean);

      if (parts[0] === "u" && parts.length >= 2) {
        return parts[1];
      }

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
        if (!res.ok) throw new Error('Failed to fetch GitHub data');
        const json = await res.json();
        setData(json);
        
        const leetcodeUsername = extractLeetCodeUsername(personalInfo.leetcode);
        if (leetcodeUsername) {
          try {
            const leetcodeJson = await fetchLeetCodeProfile(leetcodeUsername);
            setLeetcodeData(leetcodeJson);
          } catch (err) {
            console.error('Failed to fetch LeetCode data:', err);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 0',
        color: '#a78bfa'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(139, 92, 246, 0.3)',
          borderTopColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#f87171',
        background: 'rgba(255, 0, 0, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(248, 113, 113, 0.2)'
      }}>
        Error: {error || 'No data available'}
      </div>
    );
  }

  return (
    <section style={{
      width: '100%',
      padding: '4rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      {/* GitHub Section */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '24px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        padding: '2.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        color: '#f3f4f6',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '3px solid rgba(139, 92, 246, 0.5)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: '250px' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              margin: '0 0 0.5rem 0',
              background: 'linear-gradient(to right, #fff, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              GitHub - {data.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '1.1rem' }}>@{data.username}</span>
              {data.location && (
                <span style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.85rem',
                  color: '#d1d5db'
                }}>
                  📍 {data.location}
                </span>
              )}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', color: '#c4b5fd' }}>Open Source</span>
                <span style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', color: '#c4b5fd' }}>Full Stack</span>
                <span style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', color: '#c4b5fd' }}>React</span>
              </div>
            </div>
            
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '1rem', 
              lineHeight: '1.5', 
              maxWidth: '600px',
              margin: '0' 
            }}>
              {data.bio || 'Full Stack Developer passionate about building scalable web applications.'}
            </p>
          </div>

          <a 
            href={data.profileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              transition: 'transform 0.2s',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            View GitHub
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          position: 'relative',
          zIndex: 1
        }}>
          {[
            { label: 'Repositories', value: data.publicRepos, icon: '📚' },
            { label: 'Total Stars', value: data.stars, icon: '⭐' },
            { label: 'Followers', value: data.followers, icon: '👥' },
            { label: 'Following', value: data.following, icon: '👣' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            >
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f3f4f6' }}>{stat.value}</span>
              <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LeetCode Section */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '24px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        padding: '2.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        color: '#f3f4f6',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '3px solid rgba(139, 92, 246, 0.5)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: '250px' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              margin: '0 0 0.5rem 0',
              background: 'linear-gradient(to right, #fff, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              LeetCode - {leetcodeData ? leetcodeData.name : 'Problem Solving'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
                {leetcodeData ? `Rank: ${leetcodeData.ranking.toLocaleString()}` : 'Algorithmic Challenges'}
              </span>
              {leetcodeData && (
                <span style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.85rem',
                  color: '#d1d5db'
                }}>
                  ⭐ {leetcodeData.star}
                </span>
              )}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', color: '#c4b5fd' }}>Algorithms</span>
                <span style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', color: '#c4b5fd' }}>Data Structures</span>
                <span style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', color: '#c4b5fd' }}>Problem Solving</span>
              </div>
            </div>
            
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '1rem', 
              lineHeight: '1.5', 
              maxWidth: '600px',
              margin: '0' 
            }}>
              {leetcodeData ? 
                `Passionate about solving algorithmic challenges. Solved ${leetcodeData.solved.total} problems with ${leetcodeData.submissions.toLocaleString()} total submissions.` :
                'Passionate about solving algorithmic challenges and improving problem-solving skills through consistent practice.'
              }
            </p>
          </div>

          <a 
            href={leetcodeData ? leetcodeData.profileUrl : "https://leetcode.com/adityass2004"} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              transition: 'transform 0.2s',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            View LeetCode
          </a>
        </div>

        {leetcodeData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>{leetcodeData.solved.total}</span>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Solved</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{leetcodeData.solved.easy}</span>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Easy</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>{leetcodeData.solved.medium}</span>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Medium</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>{leetcodeData.solved.hard}</span>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Hard</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}