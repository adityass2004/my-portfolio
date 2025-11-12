// Portfolio Data Configuration
// Add, edit, or remove items as needed

export const personalInfo = {
  name: "Aditya Sagar Sharma",
  title: "Full Stack Developer",
  subtitle: "AI-Integrated Applications & Practical Solutions",
  email: "adityasagar9991@gmail.com",
  phone: "+91 9709303105",
  location: "Muzaffarpur, Bihar",
  github: "https://github.com/as6769-2004",
  linkedin: "https://www.linkedin.com/in/aditya-sagar-sharma-1955a7288/",
  twitter: "",
  website: "https://adityass-portfolio.netlify.app",
  avatar: "AS", // Initials for avatar
  profileImage: "/profile-image.jpg",
  heroImage: "/hero-image.jpg", // Your hero image - add to public folder
  favicon: "/favicon.ico", // Your favicon - add to public folder
  bio: "I'm a passionate Full Stack Developer specializing in AI-integrated applications and practical solutions. My journey in technology has evolved from basic programming to building complex systems that solve real-world problems through innovative AI integration.",
  about: [
    "I specialize in Flutter development, Python AI integration, and full-stack systems.",
    "My approach combines cutting-edge AI technologies with robust backend solutions, creating applications that are both intelligent and user-friendly.",
  ],
  specialties: [
    "Full Stack Development",
    "Flutter App Development",
    "AI Integration & ML",
    "Backend & Database Engineering",
    "IoT & Hardware Integration",
  ],
  resumeLink: "/data_files/resume.pdf",
  cvLink: "/data_fles/resume.pdf",
};

export const stats = [
  // { icon: "Award", value: "5+", label: "Years Experience" },
];

export const skills = {
  categories: [
    {
      name: "Frontend Development",
      skills: [
        { name: "React", level: 90, color: "from-blue-500 to-cyan-500" },
        { name: "Flutter", level: 95, color: "from-blue-600 to-indigo-600" },
        {
          name: "JavaScript",
          level: 85,
          color: "from-yellow-400 to-orange-500",
        },
        { name: "TypeScript", level: 80, color: "from-blue-500 to-purple-600" },
        { name: "HTML/CSS", level: 90, color: "from-orange-500 to-red-500" },
        { name: "Tailwind CSS", level: 85, color: "from-cyan-400 to-blue-500" },
      ],
    },
    {
      name: "Backend Development",
      skills: [
        { name: "Python", level: 90, color: "from-green-500 to-emerald-500" },
        { name: "Node.js", level: 85, color: "from-green-600 to-green-700" },
        { name: "Express.js", level: 80, color: "from-gray-600 to-gray-700" },
        { name: "Django", level: 75, color: "from-green-700 to-green-800" },
        { name: "PostgreSQL", level: 85, color: "from-blue-600 to-indigo-700" },
        { name: "MongoDB", level: 80, color: "from-green-500 to-green-600" },
      ],
    },
    {
      name: "AI & Machine Learning",
      skills: [
        { name: "TensorFlow", level: 85, color: "from-orange-500 to-red-600" },
        { name: "PyTorch", level: 80, color: "from-red-500 to-red-600" },
        {
          name: "OpenAI API",
          level: 90,
          color: "from-green-500 to-emerald-600",
        },
        {
          name: "Computer Vision",
          level: 75,
          color: "from-purple-500 to-pink-500",
        },
        { name: "NLP", level: 80, color: "from-blue-500 to-purple-600" },
        {
          name: "Data Analysis",
          level: 85,
          color: "from-indigo-500 to-purple-500",
        },
      ],
    },
    {
      name: "Tools & Technologies",
      skills: [
        { name: "Git", level: 90, color: "from-orange-500 to-red-500" },
        { name: "Docker", level: 80, color: "from-blue-500 to-cyan-500" },
        { name: "AWS", level: 75, color: "from-orange-500 to-yellow-500" },
        { name: "Firebase", level: 85, color: "from-orange-500 to-yellow-500" },
        { name: "Figma", level: 70, color: "from-purple-500 to-pink-500" },
        { name: "Postman", level: 85, color: "from-orange-500 to-red-500" },
      ],
    },
  ],
};

export const projects = [
  {
    id: 1,
    title: "Symptom Analyzer using Machine Learning and Ollama AI",
    description:
      "An intelligent health assistant built with Streamlit that combines machine learning and the Mistral model from Ollama AI to analyze symptoms, predict diseases, and provide precautionary and medicinal suggestions. Includes interactive chat, session history, and real-time medical insights (informational only).",
    image:
      "https://raw.githubusercontent.com/as6769-2004/symptom-analyzer-ml-ai/refs/heads/main/screenshots/Screenshot_1.png", // Make sure to place this image in your project directory
    technologies: [
      "Python",
      "Streamlit",
      "Scikit-learn",
      "Ollama (Mistral)",
      "Pandas",
      "NumPy",
    ],
    github: "https://github.com/as6769-2004/symptom-analyzer-ml-ai",
    live: "http://localhost:8501", // Replace with deployed link if hosted
    category: "AI/ML",
    featured: true,
  },
  {
    id: 2,
    title: "AgriEasy 🌿",
    description:
      "AgriEasy is a farmer-centric mobile app that offers real-time weather alerts, pest management guidance, and expert help through a chatbot and multimedia help desk. With multi-language support and AI-powered features, it enhances decision-making and crop care for farmers.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/Agri-Easy/refs/heads/main/Screenshots/Homepage.jpg", // Replace with your actual image path
    technologies: ["Flutter", "Python", "SQLite", "GPT-3.5"],
    github: "https://github.com/as6769-2004/CropCare",
    live: "Download via APK link", // Replace with APK hosting URL if available
    category: "AgriTech / AI",
    featured: false,
  },
  {
    id: 3,
    title: "Soil Moisture & Pump Control System",
    description:
      "An IoT-based automated plant watering system using Arduino and Flutter. It monitors soil moisture and controls a water pump automatically or manually via a mobile/web interface. Ideal for smart farming and home gardening.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/Smart-Plant-Watering/refs/heads/main/screenshots/components.png", // Replace with your actual image path
    technologies: ["Arduino", "C++", "Flutter", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/as6769-2004/Smart-Plant-Watering", // Replace with actual if exists
    live: "Download APK", // Replace with actual APK link or hosting path
    category: "IoT / Embedded",
    featured: false,
  },
  {
    id: 4,
    title: "Portfolio Website",
    description:
      "A responsive portfolio website built with React and Tailwind CSS, featuring dark/light mode and smooth animations.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/my-portfolio/refs/heads/main/src/screenshots/front.png?token=GHSAT0AAAAAADGJJN344EHK5BA546RBGRF22DTWHJQ",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/yourusername/portfolio",
    live: "https://adityass-portfolio.netlify.app/",
    category: "Frontend",
    featured: false,
  },
  {
    id: 5,
    title: "Crime Record Management System",
    description:
      "A scalable and secure system designed for law enforcement agencies to manage crime data, officer records, cases, evidence, and suspects efficiently. Built with a robust MySQL backend, it offers detailed crime tracking, officer authentication, case logging, and witness management.",
    image: "/projects/crime-record-system.jpg", // Replace with your actual project image
    technologies: [
      "Java (Swing)",
      "MySQL",
      "JDBC",
      "HTML/CSS (for report interfaces)",
    ],
    github: "https://github.com/as6769-2004/crime-record-management-system", // Replace with actual repo link if available
    live: "Desktop Application", // Or hosted docs/download if available
    category: "DBMS",
    featured: false,
  },
  {
    id: 6,
    title: "📸 SnapTask",
    description:
      "SnapTask is a privacy-first task manager that lets you capture tasks using your camera or voice. With offline support, local storage, and smart categorization, it streamlines productivity through visual and audio task input on mobile and web.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/snap-task/refs/heads/main/screenshorts/Home.png", // Replace with your actual image path
    technologies: ["Flutter", "Dart", "Hive", "camera", "flutter_sound"],
    github: "https://github.com/as6769-2004/snap-task", // Replace with your actual repo URL
    live: "https://as6769-2004.github.io/snap-task/", // Or APK / Web URL if hosted; update if available
    category: "Productivity / Offline Tools",
    featured: true,
  },
  {
    id: 7,
    title: "Road Safety System",
    description:
      "A web-based application aimed at improving road safety through accident logging, record viewing, emergency service access, and analytical insights. Built with Node.js and MongoDB, it allows centralized accident tracking and trend analysis.",
    image: "/projects/road-safety.jpg", // Replace with your actual image path
    technologies: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "HTML/CSS",
    ],
    github: "https://github.com/as6769-2004/Road-Accident-Safety-System", // Replace with actual repo URL
    live: "http://localhost:3000", // Replace with deployed link if available
    category: "Frontend",
    featured: false,
  },
  {
    id: 8,
    title: "✈️ Airline Management System",
    description:
      "A desktop-based airline reservation system built using Java Swing and MySQL. It offers features like flight booking, passenger management, boarding pass generation, admin login, and secure database operations through JDBC integration.",
    image: "/projects/airline-management.jpg", // Replace with actual screenshot path
    technologies: ["Java", "Java Swing", "MySQL", "JDBC"],
    github: "https://github.com/as6769-2004/Airline-Reservation-System",
    live: "Desktop Application", // Not hosted online; desktop-based
    category: "DBMS",
    featured: false,
  },
  {
    id: 9,
    title: "🐾 Pet Adoption Management System",
    description:
      "A responsive web-based DBMS application that streamlines pet adoption processes. It includes features like pet listings, user profiles, adoption requests, donation tracking, rehoming, and center-wise pet availability using a structured MySQL schema.",
    image: "/projects/pet-adoption.jpg", // Replace with your actual image path
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    github: "https://github.com/as6769-2004/pet-adoption-system", // Replace with your actual repo URL
    live: "", // Replace with hosted link if any
    category: "DBMS",
    featured: false,
  },
];

export const experience = [
  {
    id: 1,
    title: "Web Developer Intern",
    company: "Cognifyz Technologies",
    period: "July 2025 - August 2025",
    location: "Remote",
    description:
      "Contributing to responsive web application development and enhancing user interfaces as part of an internship project. Worked on modern UI features and performance improvements.",
    achievements: [
      "Developed a responsive card grid layout using HTML, CSS, and JavaScript",
      "Integrated interactive image enlargement on click for project showcase",
      "Collaborated with a team of developers to deliver clean and accessible UI components",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "GitHub", "VS Code"],
    image: "/data_images/cognifyz.jpeg",
    featured: true,
  },

  {
    id: 2,
    title: "Community Connect Volunteer",
    company: "Sandeshkhali Maa Saroda Women & Rural Welfare Society",
    period: "June 2025 - July 2025",
    location: "West Bengal",
    description:
      "Facilitated digital literacy workshop for rural women, empowering participants with essential computer and online skills through hands-on sessions and bilingual learning materials.",
    achievements: [
      "Conducted 40+ hours of digital literacy workshops covering MS Word, Excel, Gmail, and safe internet usage",
      "Designed bilingual digital guides, flowcharts, and tutorials to improve accessibility and confidence",
      "Enabled 50+ participants to independently use government portals, draft resumes, and manage daily tasks digitally",
      "Enhanced facilitation, documentation, and teamwork skills through community-driven education initiatives",
    ],
    technologies: [
      "MS Word",
      "MS Excel",
      "Google Workspace",
      "Digital Literacy",
      "Bilingual Documentation",
    ],
    image: "/data_images/community_connect.jpeg",
    featured: true,
  },
];

export const education = [
  {
    id: 1,
    degree: "B.Tech (Bacholer of Technology)",
    school: "SRM Institute of Science and Technology",
    period: "2023-27",
    location: "Chennai , Tamil nadu , India",
    description:
      "Pusured with specilization CSE Core Focused on software engineering , algorithms, and data structures.",

    achievements: [
      "Scored 8.89 GPA (Till 2nd Year)",
      // "Final Year Project: AI-Powered Learning gement System",
      // "Member of Computer Science Society"
    ],
  },
  {
    id: 2,
    degree: "Class 12th (Senior Secondary )",
    school: "Global International School",
    period: "2022",
    location: "Muzaffarpur , Bihar , India",
    description:
      "Completed senior secondary education with specialization in Science PCM stream.",
    achievements: ["Scored 66% overall"],
  },
  {
    id: 3,
    degree: "Class 10th (Matriculation)",
    school: "Paramount Academy",
    period: "2020",
    location: "Muzaffarpur , Bihar ,  India",
    description:
      "Completed secondary education with a focus on Science, Mathematics, and Computer Applications under CBSE/State Board.",
    achievements: ["Scored 78% overall"],
  },
];

export const certifications = [
  {
    id: 1,
    name: "Flipkart Workshop",
    issuer: "AARUSH",
    date: "Sep-2023",
    credentialId: "Flip_3002",
    link: "https://www.aaruush.org/verify/Flip_3002",
    image: "/data_images/flipkart_workshop.jpg",
    featured: true,
  },
  {
    id: 2,
    name: "Cosmic Web Workshop",
    issuer: "AARUSH",
    date: "Sep-2023",
    credentialId: "AWS-123456",
    link: "https://www.aaruush.org/verify/Cosmic_1080",
    image: "/data_images/cosmic_workshop.jpg",
    featured: false,
  },
  {
    id: 3,
    name: "Introducing Generative Al with AWS",
    issuer: "UDACITY",
    date: "June-2025",
    credentialId: "92a79e88-3d06-11f0-8be0-3b9f67dda36d",
    link: "https://www.udacity.com/certificate/e/92a79e88-3d06-11f0-8be0-3b9f67dda36d",
    image: "/data_images/udacity_gen_ai.png",
    featured: true,
  },
  {
    id: 1,
    name: "Workshop on Data Visualizationwith Python of 3 Hours",
    issuer: "Lets Upgrade",
    date: "Feb-2024",
    credentialId: "LUEWDVFEB1241000",
    link: "https://verify.letsupgrade.in/certificate/LUEWDVFEB1241000",
    image: "/data_images/python_workshop.jpg",
    featured: false,
  },
  {
    id: 1,
    name: "PROBLEM SOLVING IN ARTIFICIAL INTELLIGENCE",
    issuer: "Udemy",
    date: "May-2025",
    credentialId: "AWS-123456",
    link: "https://www.udemy.com/certificate/UC-3982a06a-1178-43ae-a4d0-716671ccf929/",
    image: "/data_images/udemy_problem_solving_ai.jpg",
    featured: false,
  },
];

export const contactInfo = {
  email: "adityasagar9991@gmail.com",
  phone: "+91 9709303105",
  location: "Muzaffarpur, Bihar, India 844120",
  social: {
    github: "https://github.com/as6769-2004",
    linkedin: "https://www.linkedin.com/in/aditya-sagar-sharma-1955a7288/",
    twitter: "",
    instagram: "https://instagram.com/adityass0401",
    youtube: "",
  },
  availability: "Available for internships opportunities.",
  responseTime: "Usually responds within 30 min.",
};

export const siteConfig = {
  title: "Aditya Sagar Sharma - Full Stack Developer",
  description:
    "Passionate Full Stack Developer specializing in AI-integrated applications and practical solutions",
  keywords: [
    "Full Stack Developer",
    "AI",
    "Flutter",
    "React",
    "Python",
    "Machine Learning",
  ],
  author: "Aditya Sagar Sharma",
  url: "https://adityass-portfolio.netlify.app",
  favicon: "/favicon.ico",
  profileImage: "/profile-image.jpg",
  heroImage: "/hero-image.jpg",
};

// Helper function to get projects by category
export const getProjectsByCategory = (category) => {
  return projects.filter((project) => project.category === category);
};

// Helper function to get featured projects
export const getFeaturedProjects = () => {
  return projects.filter((project) => project.featured);
};

// Helper function to get skills by category
export const getSkillsByCategory = (categoryName) => {
  const category = skills.categories.find((cat) => cat.name === categoryName);
  return category ? category.skills : [];
};
