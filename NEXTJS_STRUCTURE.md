# Next.js Portfolio Project Structure

```
my-portfolio/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Serverless Functions)
│   │   ├── portfolio/
│   │   │   └── route.ts         # GET/PUT /api/portfolio
│   │   ├── github/
│   │   │   └── route.ts         # GET /api/github
│   │   ├── leetcode/
│   │   │   └── route.ts         # GET /api/leetcode
│   │   └── health/
│   │       └── route.ts         # GET /api/health
│   ├── components/              # React Components
│   │   ├── About.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── AllCertificates.tsx
│   │   ├── AllExperience.tsx
│   │   ├── AllProjects.tsx
│   │   ├── Certificates.tsx
│   │   ├── CodingProfile.tsx
│   │   ├── Contact.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Education.tsx
│   │   ├── Experience.tsx
│   │   ├── Footer.tsx
│   │   ├── GithubRepos.tsx
│   │   ├── Hero.tsx
│   │   ├── LeetCodeStats.tsx
│   │   ├── Navbar.tsx
│   │   ├── PortfolioCRUD.tsx
│   │   ├── PortfolioEditor.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/
│   │   └── ThemeContext.tsx     # Theme Provider
│   ├── data/
│   │   └── portfolioService.ts  # Data Service
│   ├── all-projects/
│   │   └── page.tsx            # /all-projects route
│   ├── all-certificates/
│   │   └── page.tsx            # /all-certificates route
│   ├── all-experience/
│   │   └── page.tsx            # /all-experience route
│   ├── github-repos/
│   │   └── page.tsx            # /github-repos route
│   ├── leetcode-stats/
│   │   └── page.tsx            # /leetcode-stats route
│   ├── admin/
│   │   └── page.tsx            # /admin route
│   ├── globals.css             # Global Styles
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Home Page
├── public/                     # Static Assets
│   ├── data_files/
│   ├── data_images/
│   ├── portfolioData.json
│   └── ...
├── next.config.js              # Next.js Configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind Configuration
├── postcss.config.js           # PostCSS Configuration
└── tsconfig.json               # TypeScript Configuration
```

## Key Changes Made:

1. **Framework Migration**: CRA → Next.js 14 with App Router
2. **Routing**: react-router-dom → Next.js file-based routing
3. **API Routes**: setupProxy.js → Next.js API routes in app/api/
4. **Components**: Added 'use client' directives where needed
5. **Navigation**: useNavigate → Next.js Link component
6. **Build System**: react-scripts → Next.js build system

## Deployment Ready:
- ✅ Vercel-compatible API routes
- ✅ Static asset optimization
- ✅ TypeScript support
- ✅ Tailwind CSS integration
- ✅ No custom configuration needed