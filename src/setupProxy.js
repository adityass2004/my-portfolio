const https = require('https');
const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  // Add body parser middleware for JSON
  app.use(require('express').json());

  // Portfolio Admin API - MUST BE FIRST
  const DATA_FILE = path.join(__dirname, '..', '..', 'public', 'portfolioData.json');
  
  const createBackup = () => {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const backupFile = path.join(__dirname, '..', '..', 'public', `portfolioData.backup.${Date.now()}.json`);
      fs.writeFileSync(backupFile, data);
      console.log('✅ Backup created successfully');
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
    }
  };

  app.get('/api/portfolio', (req, res) => {
    // Localhost only security check
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (!clientIP.includes('127.0.0.1') && !clientIP.includes('::1') && !clientIP.includes('localhost')) {
      return res.status(403).json({ error: 'Access denied - localhost only' });
    }
    
    console.log('📖 GET /api/portfolio called from:', clientIP);
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.json(JSON.parse(data));
    } catch (error) {
      console.error('❌ Error reading portfolio data:', error);
      res.status(500).json({ error: 'Failed to read portfolio data' });
    }
  });

  app.put('/api/portfolio', (req, res) => {
    // Localhost only security check
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (!clientIP.includes('127.0.0.1') && !clientIP.includes('::1') && !clientIP.includes('localhost')) {
      return res.status(403).json({ error: 'Access denied - localhost only' });
    }
    
    console.log('💾 PUT /api/portfolio called from:', clientIP);
    try {
      createBackup();
      fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
      console.log('✅ Portfolio data updated successfully');
      res.json({ message: 'Portfolio data updated successfully' });
    } catch (error) {
      console.error('❌ Error updating portfolio data:', error);
      res.status(500).json({ error: 'Failed to update portfolio data' });
    }
  });

  // LeetCode and GitHub APIs
  function processSubmissionCalendar(calendarData) {
    try {
      const data = JSON.parse(calendarData);
      const monthlyStats = {};

      Object.entries(data).forEach(([timestamp, count]) => {
        const date = new Date(parseInt(timestamp) * 1000);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = 0;
        }
        monthlyStats[monthKey] += count;
      });

      const result = Object.entries(monthlyStats)
        .map(([month, submissions]) => ({
          month,
          submissions,
          monthName: new Date(month + '-01').toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
          })
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12);

      return result;
    } catch (error) {
      console.error('Error processing submission calendar:', error);
      return [];
    }
  }

  app.get('/api/leetcode', (req, res) => {
    console.log('[Proxy] Received request for /api/leetcode');
    const username = req.query.username;

    if (!username) {
      console.error('[Proxy] Missing username parameter');
      return res.status(400).json({ error: 'Missing required parameter: username' });
    }

    console.log(`[Proxy] Fetching LeetCode data for: ${username}`);

    const gqlQuery = `
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
    
    const postData = JSON.stringify({
      query: gqlQuery,
      variables: { username }
    });

    const options = {
      hostname: 'leetcode.com',
      port: 443,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com'
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      console.log(`[Proxy] Upstream response status: ${apiRes.statusCode}`);
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        if (apiRes.statusCode !== 200) {
          console.error(`[Proxy] Upstream failed with ${apiRes.statusCode}: ${data}`);
          return res.status(502).json({ error: 'Upstream request failed', status: apiRes.statusCode, details: data });
        }

        try {
          const json = JSON.parse(data);

          if (json.errors) {
            console.error('[Proxy] Upstream returned GraphQL errors:', JSON.stringify(json.errors));
            return res.status(502).json({ error: 'Upstream returned errors', details: json.errors });
          }

          const user = json?.data?.matchedUser;
          if (!user) {
            console.warn('[Proxy] User not found in LeetCode response');
            return res.status(404).json({ error: 'User not found' });
          }

          const map = {};
          user.submitStatsGlobal.acSubmissionNum.forEach(s => {
            map[s.difficulty.toLowerCase()] = s;
          });

          const monthlyData = processSubmissionCalendar(user.submissionCalendar);

          const normalized = {
            name: user.profile.realName,
            avatar: user.profile.userAvatar,
            country: user.profile.countryName,
            ranking: user.profile.ranking,
            star: user.profile.starRating,
            solved: {
              total: map.all?.count ?? 0,
              easy: map.easy?.count ?? 0,
              medium: map.medium?.count ?? 0,
              hard: map.hard?.count ?? 0
            },
            submissions: map.all?.submissions ?? 0,
            profileUrl: `https://leetcode.com/${user.username}`,
            monthlySubmissions: monthlyData
          };

          console.log('[Proxy] Successfully processed data');
          res.json(normalized);
        } catch (err) {
          console.error('[Proxy] JSON parse error:', err.message);
          res.status(500).json({ error: 'Failed to parse upstream response', details: err.message });
        }
      });
    });

    apiReq.on('error', (e) => {
      console.error('[Proxy] Request error:', e.message);
      res.status(500).json({ error: 'Internal Server Error', message: e.message });
    });

    apiReq.write(postData);
    apiReq.end();
  });

  app.get('/api/github', async (req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ error: 'Username required' });

    const fetchJson = (url) => {
      return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'portfolio' } }, (resp) => {
          let data = '';
          resp.on('data', (chunk) => data += chunk);
          resp.on('end', () => {
            if (resp.statusCode >= 400) reject(new Error(`Status ${resp.statusCode}`));
            else {
              try { resolve(JSON.parse(data)); }
              catch (e) { reject(e); }
            }
          });
        }).on('error', reject);
      });
    };

    try {
      const user = await fetchJson(`https://api.github.com/users/${username}`);
      const repos = await fetchJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      
      let contributions = [];
      try {
        const contribData = await fetchJson(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        contributions = contribData.contributions || [];
      } catch (e) {
        console.warn('Contrib fetch failed', e.message);
      }

      const stars = Array.isArray(repos) ? repos.reduce((sum, r) => sum + r.stargazers_count, 0) : 0;
      
      const languagesMap = {};
      if (Array.isArray(repos)) {
        repos.forEach(r => {
          if (r.language) languagesMap[r.language] = (languagesMap[r.language] || 0) + 1;
        });
      }
      const topLanguages = Object.entries(languagesMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([k]) => k);

      res.json({
        name: user.name,
        username: user.login,
        avatar: user.avatar_url,
        bio: user.bio,
        location: user.location,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        stars,
        profileUrl: user.html_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        topLanguages,
        contributions
      });
    } catch (e) {
      console.error('GitHub Proxy Error:', e);
      res.status(500).json({ error: 'GitHub fetch failed' });
    }
  });
};