// Portfolio Data Configuration
// Add, edit, or remove items as needed

export const personalInfo = {
  name: "Aditya Sagar Sharma",
  title: "B.Tech CSE Student & Full Stack Developer",
  subtitle:
    "Building scalable web applications with React, Node.js & Databases",
  email: "adityasagar9991@gmail.com",
  phone: "+91 9709303105",
  location: "Muzaffarpur, Bihar, India",
  github: "https://github.com/adityass2004",
  linkedin: "https://www.linkedin.com/in/aditya-sagar-sharma-1955a7288/",
  twitter: "",
  website: "https://adityass-portfolio.netlify.app",
  avatar: "AS", // Initials for avatar
  profileImage: "/profile-image.jpg",
  heroImage: "/hero-image.jpg", // Your hero image - add to public folder
  favicon: "/favicon.ico", // Your favicon - add to public folder
  bio: "I'm a B.Tech Computer Science student at SRM Institute of Science and Technology, focused on full-stack web development, data structures, and software engineering. I enjoy building scalable web applications using React, Node.js, MongoDB, and REST APIs that solve practical, real-world problems.",
  about: [
    "I specialize in building full-stack web applications with React.js, Node.js, Express.js, and databases like MongoDB and MySQL.",
    "My approach focuses on clean architecture, responsive UI, and writing maintainable code while continuously improving my problem-solving skills through DSA and real-world projects.",
  ],
  specialties: [
    "Full-Stack Web Development",
    "React.js & Modern Frontend",
    "Node.js & REST APIs",
    "Database Design (MongoDB & MySQL)",
    "Problem Solving & DSA",
  ],
  resumeLink: "/data_files/resume.pdf",
  cvLink: "/data_files/resume.pdf",
};

export const stats = [
  // Example if you want:
  // { icon: "Code", value: "20+", label: "DSA Problems Solved" },
  // { icon: "FolderGit2", value: "10+", label: "Projects Built" },
];

export const skills = {
  categories: [
    {
      name: "Programming Languages",
      skills: [
        { name: "C++", level: 85, color: "from-blue-500 to-indigo-500" },
        { name: "JavaScript", level: 90, color: "from-yellow-400 to-orange-500" },
        { name: "Python", level: 80, color: "from-green-500 to-emerald-500" },
        { name: "HTML", level: 95, color: "from-orange-500 to-red-500" },
        { name: "CSS", level: 90, color: "from-sky-500 to-blue-500" },
      ],
    },
    {
      name: "Frontend Development",
      skills: [
        { name: "React.js", level: 90, color: "from-blue-500 to-cyan-500" },
        { name: "Tailwind CSS", level: 85, color: "from-cyan-400 to-blue-500" },
        { name: "Responsive UI/UX", level: 88, color: "from-emerald-500 to-teal-500" },
      ],
    },
    {
      name: "Backend & Databases",
      skills: [
        { name: "Node.js", level: 85, color: "from-green-600 to-green-700" },
        { name: "Express.js", level: 80, color: "from-gray-600 to-gray-700" },
        { name: "REST APIs", level: 90, color: "from-slate-500 to-slate-700" },
        { name: "MongoDB", level: 80, color: "from-green-500 to-green-600" },
        { name: "MySQL", level: 85, color: "from-blue-600 to-indigo-700" },
      ],
    },
    {
      name: "Tools & Platforms",
      skills: [
        { name: "Git & GitHub", level: 90, color: "from-orange-500 to-red-500" },
        { name: "Firebase", level: 80, color: "from-amber-500 to-yellow-500" },
        { name: "Netlify", level: 75, color: "from-emerald-400 to-teal-500" },
        { name: "AWS (Basic)", level: 60, color: "from-orange-500 to-yellow-500" },
        { name: "Jupyter Notebook", level: 75, color: "from-indigo-500 to-purple-500" },
      ],
    },
    {
      name: "Computer Science Fundamentals",
      skills: [
        { name: "Data Structures & Algorithms", level: 80, color: "from-purple-500 to-pink-500" },
        { name: "DBMS", level: 85, color: "from-green-400 to-green-600" },
        { name: "Operating Systems", level: 70, color: "from-blue-400 to-indigo-500" },
      ],
    },
  ],
};

export const projects = [
  {
    id: 1,
    title: "TrackIt – Academic Tracker",
    description:
      "TrackIt is a smart academic tracking platform that helps students stay on top of their studies. From timetables and attendance to marks, courses, and academic calendars — TrackIt brings everything together in one place. With real-time updates and an easy-to-use interface, students can focus more on learning and less on managing.",
    image: "/projects/trackit.jpg", // add a real screenshot
    technologies: ["Next.js", "MongoDB", "Tailwind CSS", "Node.js"],
    github: "https://github.com/adityass2004/track-it-nextjs", // update if needed
    live: "https://trackitsrm.vercel.app", // add hosted URL when deployed
    category: "Full Stack",
    featured: true,
  },

  {
    id: 2,
    title: "📄 PDF Chat Assistant",
    description:
      "An AI-powered PDF analysis assistant built with Streamlit and Ollama. Supports document chat, smart chunking, FAISS search, auto formatting, and optional image understanding for scanned PDFs — enabling fast extraction of insights from research papers, notes, and study materials.",
    image: "/projects/pdf-chat.jpg", // add real UI screenshot
    technologies: ["Python", "Streamlit", "FAISS", "Ollama", "LangChain"],
    github: "https://github.com/adityass2004/pdf-chat", // ensure this matches repo
    live: "", // Hosted link if deployed later
    category: "AI / Productivity",
    featured: true,
  },

  

  {
    id: 4,
    title: "StareWare – Focus-Enhancing Quiz App",
    description:
      "A React-based quiz application that tracks eye and face movements via webcam to improve user focus. Designed and developed the entire front-end with a clean, responsive UI and smooth transitions.",
    image: "/projects/stareware-quiz-app.jpg",
    technologies: ["React.js", "JavaScript", "Webcam API", "CSS"],
    github: "https://github.com/adityass2004",
    live: "",
    category: "Frontend",
    featured: false,
  },

  {
    id: 5,
    title: "Symptom Analyzer using Machine Learning and Ollama AI",
    description:
      "An intelligent health assistant built with Streamlit that combines machine learning and the Mistral model from Ollama AI to analyze symptoms, predict diseases, and provide informational precautionary suggestions. Includes interactive chat, session history, and real-time insights.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/symptom-analyzer-ml-ai/refs/heads/main/screenshots/Screenshot_1.png",
    technologies: [
      "Python",
      "Streamlit",
      "Scikit-learn",
      "Ollama",
      "Pandas",
      "NumPy",
    ],
    github: "https://github.com/as6769-2004/symptom-analyzer-ml-ai",
    live: "",
    category: "AI/ML",
    featured: false,
  },

  {
    id: 6,
    title: "AgriEasy 🌿",
    description:
      "A farmer-centric mobile app offering real-time weather alerts, pest management guidance, and expert help through a chatbot and multimedia help desk. Provides multi-language support and AI-powered features to assist farmers in decision-making and crop care.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/Agri-Easy/refs/heads/main/Screenshots/Homepage.jpg",
    technologies: ["Flutter", "Python", "SQLite"],
    github: "https://github.com/as6769-2004/CropCare",
    live: "",
    category: "AgriTech / AI",
    featured: false,
  },

  {
    id: 7,
    title: "Soil Moisture & Pump Control System",
    description:
      "An IoT-based automated plant watering system using Arduino that monitors soil moisture and controls a water pump automatically or manually via a mobile/web interface. Useful for smart farming and home gardening.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/Smart-Plant-Watering/refs/heads/main/screenshots/components.png",
    technologies: ["Arduino", "C++", "Flutter", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/as6769-2004/Smart-Plant-Watering",
    live: "",
    category: "IoT / Embedded",
    featured: false,
  },

  {
    id: 8,
    title: "Portfolio Website",
    description:
      "A responsive personal portfolio built with React and Tailwind CSS, featuring smooth animations, project showcases, and a clean layout.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/my-portfolio/refs/heads/main/src/screenshots/front.png?token=GHSAT0AAAAAADGJJN344EHK5BA546RBGRF22DTWHJQ",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/as6769-2004/my-portfolio",
    live: "https://adityass-portfolio.netlify.app/",
    category: "Frontend",
    featured: false,
  },

  {
    id: 9,
    title: "📸 SnapTask",
    description:
      "A privacy-first task manager that lets users capture tasks using camera or voice. Offers offline support, local storage, and smart categorization for productivity on mobile and web.",
    image:
      "https://raw.githubusercontent.com/as6769-2004/snap-task/refs/heads/main/screenshorts/Home.png",
    technologies: ["Flutter", "Dart", "Hive", "camera", "flutter_sound"],
    github: "https://github.com/as6769-2004/snap-task",
    live: "https://as6769-2004.github.io/snap-task/",
    category: "Productivity / Offline Tools",
    featured: false,
  },
];

export const experience = [
  {
    id: 1,
    title: "Web Development Intern",
    company: "Cognifyz Technologies",
    period: "Jul 2025 - Aug 2025",
    location: "Remote",
    description:
      "Worked as a web development intern focusing on building responsive interfaces and integrating front-end components with backend APIs in an Agile environment.",
    achievements: [
      "Created and integrated React UI with a Node.js backend, reducing task completion time by ~30%.",
      "Delivered 5+ fully functional features in Agile sprint cycles, closing backlog items with a ~95% code quality score.",
      "Collaborated with other developers to maintain clean, modular, and reusable front-end components.",
    ],
    technologies: ["React.js", "Node.js", "JavaScript", "Git", "REST APIs"],
    image: "/data_images/cognifyz.jpeg",
    featured: true,
  },
  {
    id: 2,
    title: "Community Connect Volunteer",
    company: "Sandeshkhali Maa Saroda Women & Rural Welfare Society",
    period: "Jun 2025 - Jul 2025",
    location: "West Bengal, India",
    description:
      "Volunteered to conduct digital literacy workshops for rural women, enabling them to confidently use digital tools for daily tasks and government services.",
    achievements: [
      "Conducted 40+ hours of digital literacy workshops covering MS Word, Excel, Gmail, and safe internet usage.",
      "Designed bilingual digital guides, flowcharts, and tutorials to improve accessibility and confidence.",
      "Enabled 50+ participants to independently access government portals, draft resumes, and manage daily digital tasks.",
      "Strengthened facilitation, documentation, and teamwork skills through grassroots technology-driven education.",
    ],
    technologies: [
      "MS Word",
      "MS Excel",
      "Google Workspace",
      "Digital Literacy",
    ],
    image: "/data_images/community_connect.jpeg",
    featured: true,
  },
];

export const education = [
  {
    id: 1,
    degree: "B.Tech in Computer Science and Engineering",
    school: "SRM Institute of Science and Technology",
    period: "Aug 2023 - May 2027",
    location: "Chennai, Tamil Nadu, India",
    description:
      "Pursuing Bachelor of Technology in Computer Science and Engineering with a focus on software engineering, data structures, algorithms, and web development.",
    achievements: [
      "GPA: 8.87 (Till 4th semester).",
      "Completed coursework in Data Structures & Algorithms, Web Development, DBMS, and Operating Systems.",
    ],
  },
  {
    id: 2,
    degree: "Class 12th (Senior Secondary)",
    school: "Global International School",
    period: "2022",
    location: "Muzaffarpur, Bihar, India",
    description:
      "Completed senior secondary education with specialization in Science (PCM).",
    achievements: ["Scored 66% overall."],
  },
  {
    id: 3,
    degree: "Class 10th (Matriculation)",
    school: "Paramount Academy",
    period: "2020",
    location: "Muzaffarpur, Bihar, India",
    description:
      "Completed secondary education with a strong foundation in Science, Mathematics, and Computer Applications.",
    achievements: ["Scored 78% overall."],
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
    credentialId: "Cosmic_1080",
    link: "https://www.aaruush.org/verify/Cosmic_1080",
    image: "/data_images/cosmic_workshop.jpg",
    featured: false,
  },
  {
    id: 3,
    name: "Introducing Generative AI with AWS",
    issuer: "Udacity",
    date: "Jun-2025",
    credentialId: "92a79e88-3d06-11f0-8be0-3b9f67dda36d",
    link: "https://www.udacity.com/certificate/e/92a79e88-3d06-11f0-8be0-3b9f67dda36d",
    image: "/data_images/udacity_gen_ai.png",
    featured: true,
  },
  {
    id: 4,
    name: "Workshop on Data Visualization with Python (3 Hours)",
    issuer: "LetsUpgrade",
    date: "Feb-2024",
    credentialId: "LUEWDVFEB1241000",
    link: "https://verify.letsupgrade.in/certificate/LUEWDVFEB1241000",
    image: "/data_images/python_workshop.jpg",
    featured: false,
  },
  {
    id: 5,
    name: "Problem Solving in Artificial Intelligence",
    issuer: "Udemy",
    date: "May-2025",
    credentialId: "UC-3982a06a-1178-43ae-a4d0-716671ccf929",
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
    github: "https://github.com/adityass2004",
    linkedin: "https://www.linkedin.com/in/aditya-sagar-sharma-1955a7288/",
    twitter: "",
    instagram: "https://instagram.com/adityass0401",
    youtube: "",
  },
  availability: "Available for internship opportunities.",
  responseTime: "Usually responds within a few hours.",
};

export const siteConfig = {
  title: "Aditya Sagar Sharma - Full Stack Developer",
  description:
    "B.Tech Computer Science student specializing in full-stack web development, scalable applications, and practical software solutions.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Node.js",
    "MongoDB",
    "MySQL",
    "SRMIST",
    "Web Development",
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
