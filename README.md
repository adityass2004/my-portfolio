# Aditya Sagar — Portfolio

> 🌐 Live: [adityass.vercel.app](https://adityass.vercel.app/)

A full-stack, data-driven developer portfolio built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. All content is fetched dynamically from a single JSON file hosted on GitHub — no rebuild needed to update content.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animations | Framer Motion |
| Fonts | DM Serif Display · DM Mono · Instrument Sans |
| Deployment | Vercel |
| Forms | Formspree |

---

## Features

### UI & Design
- **Dark / Light mode** — system-aware with manual toggle, persisted via React context
- **Custom animated cursor** — dot + ring with hover scale effect (desktop only, hidden on mobile)
- **Paper texture overlay** — subtle SVG fractal noise grain fixed over the entire page
- **Animated navbar** — active route underline with spring animation, mobile full-screen overlay menu with scroll lock
- **Framer Motion animations** — page-level fade-ins, card hover lifts (`y: -8`), staggered children, `AnimatePresence` transitions
- **Responsive layout** — mobile-first grid system, adapts across all screen sizes
- **Smooth scroll** — native CSS `scroll-behavior: smooth`
- **Custom scrollbar** — accent-colored thin scrollbar via `::-webkit-scrollbar`
- **Text selection styling** — accent color highlight on `::selection`

### Pages & Sections

| Route | Description |
|---|---|
| `/` | Main portfolio — all sections in a single page |
| `/all-projects` | Full projects list with category filters |
| `/all-experience` | Full career timeline |
| `/all-certificates` | All certifications with image lightbox |
| `/github-repos` | Live GitHub repos with sort/filter + contribution heatmap |
| `/leetcode-stats` | Full LeetCode stats with daily/weekly/monthly submission charts |
| `/admin` | Admin panel for editing portfolio data via UI |

### Main Page Sections (in order)
1. **Hero** — name, animated rotating role text (2s interval), profile image, stats grid, resume viewer (iframe popup modal), social links
2. **About** — bio paragraphs, specialties pills, research card, aside info panel (college, CGPA, graduating year, LeetCode highlight, availability)
3. **Skills** — categorised skill cards (Frontend / Backend / Tools / DBMS) + full tech stack pill cloud
4. **Coding Profile** — live GitHub stats (repos, stars, followers, top languages, earned achievements) + LeetCode stats (contest rating, solved breakdown by difficulty, earned badges) side by side
5. **Projects** — featured projects grid with category label, tech pills, GitHub & live demo links
6. **Experience** — featured vertical timeline with animated dot markers, achievement arrow lists, tech pills
7. **Certifications** — featured certificates with `16/9` image thumbnails, click-to-expand lightbox modal, credential verify links
8. **Education** — vertical timeline with degree, institution, location, achievement lists
9. **Contact** — contact detail cards (email/phone/location), social icon links, Formspree contact form + Gmail compose fallback, success/error popup modal

### GitHub Integration (`/api/github`)
- Fetches public profile via `https://api.github.com/users/:username` — no token required
- Returns: public repos count, total stars, followers, following, top 3 languages, contribution heatmap data
- Scrapes GitHub profile HTML for earned achievement badges (name + icon)
- Optional `GITHUB_TOKEN` in `.env.local` raises rate limit from 60 → 5000 req/h
- Username validated with regex `/^[a-zA-Z0-9-]{1,39}$/` to prevent injection

### LeetCode Integration (`/api/leetcode`)
- Fetches solved stats (easy / medium / hard totals), contest rating, global ranking, total submissions
- Returns earned badges with icons, active badge, submission calendar
- Submission calendar processed client-side into daily / weekly / monthly SVG bar chart views

### GitHub Repos Page (`/github-repos`)
- Fetches all public repos directly from GitHub API (browser-side)
- Sort by: last pushed / stars / created date
- Filter by programming language (dynamic list from repo data)
- Shows: repo name, description, language, stars, forks, size, topics, last updated date
- GitHub-style contribution heatmap (7-day grid, month labels, 5-level color scale) via `github-contributions-api.jogruber.de`
- Aggregate stats: total repos, total stars, total forks

### LeetCode Stats Page (`/leetcode-stats`)
- Overview stat cards: total solved, contest rating, contests attended, global rank, stars, submissions
- Difficulty breakdown: Easy / Medium / Hard with color-coded left borders
- Submission activity chart with toggle: Daily (last 30 days) / Weekly (last 12 weeks) / Monthly
- All charts built with raw SVG — no chart library dependency
- Earned badges grid with hover effects
- Profile info panel: display name, country, global ranking, star rating

### Admin Panel (`/admin`)
- Full CRUD UI for all portfolio sections
- Backed by `/api/portfolio` Next.js route handler
- Edit personal info, projects, experience, certifications, skills, education without touching code

### Data Architecture
- All content lives in `public/portfolioData.json`
- Fetched at runtime by `app/data/portfolioService.ts` with typed interfaces
- Raw GitHub URL for direct access:
  ```
  https://raw.githubusercontent.com/adityass2004/my-portfolio/main/public/portfolioData.json
  ```
- Update content without redeploying — push a JSON change and it reflects immediately
- `featured: true` flag controls what appears on the main page vs "See All" pages

---

## Project Structure

```
main/
├── app/
│   ├── api/
│   │   ├── github/             # GitHub profile + achievements API route
│   │   ├── leetcode/           # LeetCode stats API route
│   │   ├── portfolio/          # Portfolio data CRUD API route
│   │   └── health/             # Health check endpoint
│   ├── components/
│   │   ├── Hero.tsx            # Landing section
│   │   ├── About.tsx           # About + research card
│   │   ├── Skills.tsx          # Skills categories + tech stack
│   │   ├── CodingProfile.tsx   # GitHub + LeetCode side-by-side cards
│   │   ├── Projects.tsx        # Featured projects grid
│   │   ├── Experience.tsx      # Featured experience timeline
│   │   ├── Certificates.tsx    # Featured certificates + lightbox
│   │   ├── Education.tsx       # Education timeline
│   │   ├── Contact.tsx         # Contact form + social links
│   │   ├── GithubRepos.tsx     # All repos page with heatmap
│   │   ├── LeetCodeStats.tsx   # Full LeetCode stats + charts
│   │   ├── AllProjects.tsx     # All projects with filters
│   │   ├── AllExperience.tsx   # Full experience timeline
│   │   ├── AllCertificates.tsx # All certificates grid
│   │   ├── Navbar.tsx          # Fixed navbar + mobile overlay
│   │   ├── Footer.tsx          # Minimal footer with social links
│   │   ├── ThemeToggle.tsx     # Dark/light mode toggle button
│   │   ├── CustomCursor.tsx    # Custom cursor (desktop only)
│   │   ├── AdminPanel.tsx      # Admin UI shell
│   │   ├── Dashboard.tsx       # Admin dashboard
│   │   ├── PortfolioCRUD.tsx   # CRUD operations UI
│   │   └── PortfolioEditor.tsx # Data editor forms
│   ├── context/
│   │   └── ThemeContext.tsx    # Theme provider + toggle logic
│   ├── data/
│   │   └── portfolioService.ts # Typed data fetching service
│   ├── all-projects/page.tsx
│   ├── all-experience/page.tsx
│   ├── all-certificates/page.tsx
│   ├── github-repos/page.tsx
│   ├── leetcode-stats/page.tsx
│   ├── admin/page.tsx
│   ├── globals.css             # CSS variables, base styles, component classes
│   ├── layout.tsx              # Root layout with fonts + metadata
│   └── page.tsx                # Main page — all sections composed here
├── public/
│   ├── portfolioData.json      ← edit this to update all content
│   ├── data_images/            ← certificate & experience images
│   ├── data_files/             ← resume / CV PDFs
│   ├── profile-image.jpg
│   ├── hero-image.jpg
│   └── favicon.ico
├── .env.local                  ← GITHUB_TOKEN (optional)
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/adityass2004/my-portfolio.git main
cd main

# 2. Install dependencies
npm install

# 3. (Optional) Add GitHub token to raise API rate limit 60 → 5000 req/h
echo "GITHUB_TOKEN=ghp_your_token_here" >> .env.local

# 4. Start dev server
npm run dev

# 5. Production build
npm run build && npm start
```

---

## Customization

Edit `public/portfolioData.json` — no code changes needed:

| Key | What it controls |
|---|---|
| `personalInfo` | Name, title, bio, profile image, resume link, social URLs, LeetCode URL |
| `stats` | Hero section stat cards (value + label) |
| `skills.categories` | Skill groups and individual skill names |
| `projects` | Project cards — set `featured: true` to show on main page |
| `experience` | Work timeline — set `featured: true` to show on main page |
| `education` | Degree, school, period, achievements |
| `certifications` | Certificate cards — set `featured: true` to show on main page |
| `contactInfo` | Email, phone, location, social links, Formspree ID |

Place images in `public/data_images/` and reference as `/data_images/filename.jpg`.
Place resume/CV in `public/data_files/` and reference as `/data_files/resume.pdf`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | No | Personal access token — raises GitHub API rate limit from 60 to 5000 req/h |

---

## License

MIT
