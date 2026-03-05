const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001;

// ─── Paths ────────────────────────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, 'public', 'portfolioData.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'data_images');
const RESUME_DIR = path.join(__dirname, 'public', 'data_files');

// ─── Ensure directories exist ─────────────────────────────────────────────────
[UPLOADS_DIR, RESUME_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Multer – image uploads ───────────────────────────────────────────────────
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ─── Multer – resume uploads ──────────────────────────────────────────────────
const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, RESUME_DIR),
  filename: (_req, _file, cb) => cb(null, 'resume.pdf'),
});
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readPortfolio() {
  if (!fs.existsSync(DATA_FILE)) {
    // Write default structure if file doesn't exist yet
    const defaults = {
      personalInfo: {},
      projects: [],
      experience: [],
      certifications: [],
      education: [],
      contactInfo: { social: {} },
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writePortfolio(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET entire portfolio
app.get('/api/portfolio', (_req, res) => {
  try {
    res.json(readPortfolio());
  } catch (err) {
    res.status(500).json({ error: 'Failed to read portfolio data' });
  }
});

// PUT (replace) entire portfolio
app.put('/api/portfolio', (req, res) => {
  try {
    writePortfolio(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save portfolio data' });
  }
});

// ─── Generic CRUD for array sections ─────────────────────────────────────────
const SECTIONS = ['projects', 'experience', 'certifications', 'education'];

SECTIONS.forEach((section) => {
  // POST  – create item
  app.post(`/api/${section}`, (req, res) => {
    try {
      const portfolio = readPortfolio();
      const newItem = { id: Date.now(), ...req.body };
      portfolio[section].push(newItem);
      writePortfolio(portfolio);
      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ error: `Failed to create ${section} item` });
    }
  });

  // PATCH – update item
  app.patch(`/api/${section}/:id`, (req, res) => {
    try {
      const portfolio = readPortfolio();
      const id = Number(req.params.id);
      const idx = portfolio[section].findIndex((i) => i.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Item not found' });
      portfolio[section][idx] = { ...portfolio[section][idx], ...req.body };
      writePortfolio(portfolio);
      res.json(portfolio[section][idx]);
    } catch (err) {
      res.status(500).json({ error: `Failed to update ${section} item` });
    }
  });

  // DELETE – remove item
  app.delete(`/api/${section}/:id`, (req, res) => {
    try {
      const portfolio = readPortfolio();
      const id = Number(req.params.id);
      const before = portfolio[section].length;
      portfolio[section] = portfolio[section].filter((i) => i.id !== id);
      if (portfolio[section].length === before)
        return res.status(404).json({ error: 'Item not found' });
      writePortfolio(portfolio);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: `Failed to delete ${section} item` });
    }
  });
});

// ─── Image upload ─────────────────────────────────────────────────────────────
app.post('/api/upload', uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Return a path relative to the public folder so Next.js can serve it
  const relativePath = `/data_images/${req.file.filename}`;
  res.json({ success: true, path: relativePath, filename: req.file.filename });
});

// ─── Resume upload ────────────────────────────────────────────────────────────
app.post('/api/upload-resume', uploadResume.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ success: true, path: '/data_files/resume.pdf', filename: req.file.filename });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(400).json({ error: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Portfolio API server running at http://localhost:${PORT}`);
  console.log(`   Data file : ${DATA_FILE}`);
  console.log(`   Images    : ${UPLOADS_DIR}`);
  console.log(`   Resume    : ${RESUME_DIR}\n`);
});