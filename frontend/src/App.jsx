import { useState, useEffect } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // সব todos লোড করো
  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // নতুন todo add
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    setInput("");
    fetchTodos();
  };

  // complete toggle
  const toggleTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "PATCH" });
    fetchTodos();
  };

  // delete
  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Todo App</h1>
      <p style={styles.subtitle}>React + Node.js + MongoDB + Docker</p>

      {/* Add Form */}
      <form onSubmit={addTodo} style={styles.form}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="নতুন todo লিখো..."
          style={styles.input}
        />
        <button type="submit" style={styles.addBtn}>
          Add
        </button>
      </form>

      {/* Todo List */}
      {loading ? (
        <p style={styles.loading}>লোড হচ্ছে...</p>
      ) : todos.length === 0 ? (
        <p style={styles.empty}>কোনো todo নেই, উপরে লিখো!</p>
      ) : (
        todos.map((todo) => (
          <div key={todo._id} style={styles.todoItem}>
            <span
              onClick={() => toggleTodo(todo._id)}
              style={{
                ...styles.todoText,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#aaa" : "#222",
              }}
            >
              {todo.completed ? "✅" : "⬜"} {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              style={styles.deleteBtn}
            >
              🗑️
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "5px",
  },
  subtitle: {
    textAlign: "center",
    color: "#888",
    marginBottom: "30px",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "1rem",
    border: "2px solid #ddd",
    borderRadius: "8px",
  },
  addBtn: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  todoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    marginBottom: "8px",
    background: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #eee",
  },
  todoText: {
    cursor: "pointer",
    fontSize: "1rem",
    flex: 1,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
  },
  loading: { textAlign: "center", color: "#888" },
  empty: { textAlign: "center", color: "#aaa" },
};
