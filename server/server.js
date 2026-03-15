const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── DB Connect with retry ──────────────────────
const connectDB = async () => {
  let retries = 10;
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("✅ MongoDB connected successfully!");
      break;
    } catch (err) {
      retries--;
      console.log(
        `⏳ MongoDB not ready, retrying... (${retries} attempts left)`,
      );
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

connectDB();

// ── Schema ─────────────────────────────────────
const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("Todo", TodoSchema);

// ── Routes ─────────────────────────────────────

// Get all todos
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// Create a new todo
app.post("/api/todos", async (req, res) => {
  const todo = await Todo.create({ text: req.body.text });
  res.json(todo);
});

// Toggle todo completion status
app.patch("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Task Deleted ✅" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running smoothly 🚀" });
});

// ── Start Server ──────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
});
