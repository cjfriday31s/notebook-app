require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const requestLogger = require("./middleware/requestLogger");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const notebookRoutes = require("./routes/notebookRoutes");

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
aapp.use(cors({
  origin: [
    "http://localhost:5173",
    "https://notebook-app-nine-steel.vercel.app"
  ],
  credentials: true
}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/notebook", notebookRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "📓 Notebook API is running." });
});

// ─── 404 & Error Handlers ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
