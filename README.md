# Modern Portfolio Website

[Click To View](https://adityass-portfolio.netlify.app/)

A beautiful, responsive portfolio website built with React, Tailwind CSS, and Framer Motion. Features dark/light mode toggle, smooth animations, and a comprehensive data-driven structure.

## 🚀 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Smooth theme switching with persistent state
- **Custom Cursor**: Interactive cursor with hover effects (desktop only)
- **Smooth Animations**: Powered by Framer Motion
- **Data-Driven**: Easy to customize content through a single data file
- **Modern UI**: Clean, professional design with gradient accents
- **Mobile-First**: Touch-friendly interface with optimized mobile experience
- **Featured Sections**: Show only your best work/experience/certificates on the main page, with 'See All' pages for full lists

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── About.js        # About section
│   ├── Certificates.js # Featured certificates (main page)
│   ├── AllCertificates.js # All certificates page
│   ├── Contact.js      # Contact form and info
│   ├── Education.js    # Education section
│   ├── Experience.js   # Featured work experience (main page)
│   ├── AllExperience.js # All experience page
│   ├── Footer.js       # Footer component
│   ├── Hero.js         # Hero/landing section
│   ├── Navbar.js       # Navigation bar
│   ├── Projects.js     # Featured projects (main page)
│   ├── AllProjects.js  # All projects page
│   ├── Skills.js       # Skills and technologies
│   └── ThemeToggle.js  # Theme toggle component
├── context/
│   └── ThemeContext.js # Theme context provider
├── data/
│   └── portfolioData.js # All portfolio data (edit this file!)
├── App.js              # Main app component
├── index.css           # Global styles
└── index.js            # App entry point
```

## 🎨 Customization: Edit Your Data in `src/data/portfolioData.js`

### Getting data from github in raw

```
https://raw.githubusercontent.com/adityass2004/my-portfolio/main/public/portfolioData.json
```

### 1. Personal Information

```js
export const personalInfo = {
  name: "Your Name",
  title: "Full Stack Developer",
  subtitle: "AI-Integrated Applications & Practical Solutions",
  email: "your.email@example.com",
  phone: "+1 (555) 123-4567",
  location: "Your City, Country",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  twitter: "https://twitter.com/yourusername",
  website: "https://yourwebsite.com",
  avatar: "AS", // Your initials for avatar
  profileImage: "/profile-image.jpg", // Place in public/
  heroImage: "/hero-image.jpg", // Place in public/
  favicon: "/favicon.ico", // Place in public/
  bio: "Your bio description...",
  about: ["First paragraph about you...", "Second paragraph about you..."],
  specialties: ["Your specialty 1", "Your specialty 2", "Your specialty 3"],
  resumeLink: "/resume.pdf", // Place your resume in public/
  cvLink: "/cv.pdf", // Place your CV in public/
};
```

### 2. Statistics

```js
export const stats = [
  { icon: "Award", value: "5+", label: "Years Experience" },
  { icon: "Users", value: "50+", label: "Happy Clients" },
  { icon: "Code", value: "100+", label: "Projects Completed" },
  { icon: "Coffee", value: "1000+", label: "Cups of Coffee" },
];
```

### 3. Skills

```js
export const skills = {
  categories: [
    {
      name: "Frontend Development",
      skills: [
        { name: "React", level: 90, color: "from-blue-500 to-cyan-500" },
        { name: "Flutter", level: 95, color: "from-blue-600 to-indigo-600" },
        // Add more skills...
      ],
    },
    // Add more categories...
  ],
};
```

### 4. Projects

```js
export const projects = [
  {
    id: 1,
    title: "Project Name",
    description: "Project description...",
    image: "/project1.jpg", // Place images in public/ or use a full URL
    technologies: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/yourusername/project",
    live: "https://project-demo.vercel.app",
    category: "Full Stack",
    featured: true, // Only featured projects show on main page
  },
  // Add more projects...
];
```

### 5. Experience

```js
export const experience = [
  {
    id: 1,
    title: "Senior Developer",
    company: "Company Name",
    period: "2022 - Present",
    location: "Remote",
    description: "Job description...",
    achievements: ["Achievement 1", "Achievement 2", "Achievement 3"],
    technologies: ["React", "Python", "AWS"],
    image: "/data_images/experience1.jpg", // Place images in public/data_images/
    featured: true, // Only featured experiences show on main page
  },
  // Add more experience...
];
```

### 6. Education

```js
export const education = [
  {
    id: 1,
    degree: "Bachelor of Computer Science",
    school: "University Name",
    period: "2015 - 2019",
    location: "City, Country",
    description: "Degree description...",
    achievements: [
      "Graduated with honors",
      "Final year project award",
      "Other achievements...",
    ],
  },
];
```

### 7. Certifications

```js
export const certifications = [
  {
    id: 1,
    name: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialId: "AWS-123456",
    link: "https://aws.amazon.com/verification",
    image: "/data_images/certificate1.jpg", // Place images in public/data_images/
    featured: true, // Only featured certificates show on main page
  },
  // Add more certifications...
];
```

### 8. Contact Information

```js
export const contactInfo = {
  email: "your.email@example.com",
  phone: "+1 (555) 123-4567",
  location: "Your City, Country",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    instagram: "https://instagram.com/yourusername",
    youtube: "https://youtube.com/@yourusername",
  },
  availability: "Available for freelance opportunities and full-time positions",
  responseTime: "Usually responds within 24 hours",
};
```

## ⭐️ Featured Items & 'See All' Pages

- Only items with `featured: true` are shown on the main page for Projects, Experience, and Certificates.
- Use the 'See All' buttons to view all entries for each section (e.g., all projects, all experience, all certificates).

## 🖼️ Image Paths

- Place all images in the `public/` or `public/data_images/` folder.
- Use paths like `/data_images/your-image.jpg` in your data file.
- For best results, use rectangular images for certificates.

## 📄 Resume & CV

- Place your resume and CV files in the `public/` folder as `resume.pdf` and `cv.pdf`.
- Update the `resumeLink` and `cvLink` in `personalInfo` if you use different filenames.

## 📱 Mobile Compatibility

- The site is fully responsive and mobile-friendly.
- All grids, images, and layouts adapt to mobile screens.

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Customize your data**
   - Edit `src/data/portfolioData.js` with your information
   - Add images and files to the `public/` folder
   - Update social media links

4. **Start development server**

   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

**Enjoy your modern, data-driven portfolio!**
