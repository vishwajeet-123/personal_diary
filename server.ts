import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGODB_URI not found in environment variables. Database features will not work.");
}

// Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityQuestion: { type: String, required: true },
  securityAnswer: { type: String, required: true },
});

const diaryEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  content: { type: String, required: true },
  tag: { type: String, enum: ['Special Moment', 'Important Information', 'Bad News'], required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema);

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// API Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, securityQuestion, securityAnswer });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.securityAnswer !== securityAnswer) {
      return res.status(400).json({ message: "Invalid security answer or email" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/diary", authenticateToken, async (req: any, res) => {
  try {
    const { date, content, tag } = req.body;
    const existing = await DiaryEntry.findOne({ userId: req.user.id, date });
    if (existing) {
      return res.status(400).json({ message: "Entry already exists for this date. Use edit instead." });
    }
    const entry = new DiaryEntry({ userId: req.user.id, date, content, tag });
    await entry.save();
    res.status(201).json(entry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/diary/:id", authenticateToken, async (req: any, res) => {
  try {
    const { content, tag } = req.body;
    const entry = await DiaryEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content, tag },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/diary/date/:date", authenticateToken, async (req: any, res) => {
  try {
    const entry = await DiaryEntry.findOne({ userId: req.user.id, date: req.params.date });
    res.json(entry || null);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/diary/month/:month/:year", authenticateToken, async (req: any, res) => {
  try {
    const { month, year } = req.params;
    const regex = new RegExp(`^${year}-${month.padStart(2, '0')}-`);
    const entries = await DiaryEntry.find({ userId: req.user.id, date: { $regex: regex } }).sort({ date: 1 });
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/diary/tag/:tag", authenticateToken, async (req: any, res) => {
  try {
    const entries = await DiaryEntry.find({ userId: req.user.id, tag: req.params.tag }).sort({ date: -1 });
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
