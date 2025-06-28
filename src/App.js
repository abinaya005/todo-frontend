import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth, provider, signInWithPopup, signOut } from "./firebase";


function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setTasks([]);
  };

  const fetchTasks = async () => {
    if (!user) return;
    const res = await axios.get(`http://localhost:5000/api/tasks?user=${user.email}`);
    setTasks(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/tasks", {
      ...form,
      status: "pending",
      createdBy: user.email,
    });
    setForm({ title: "", description: "" });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  const updateTaskStatus = async (id, newStatus) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, {
      status: newStatus,
    });
    fetchTasks();
  };

 useEffect(() => {
  fetchTasks();
}, [fetchTasks]);  // ✅ Add fetchTasks here

  const getCardColor = (status) => {
    switch (status) {
      case "pending":
        return "#fff3cd";
      case "in progress":
        return "#d1ecf1";
      case "completed":
        return "#d4edda";
      default:
        return "#f8f9fa";
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", minHeight: "100vh", background: "#f2f3f8", padding: "1rem" }}>
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(to right, #8e24aa, #5e35b1)",
            color: "#fff",
            padding: "1rem",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h2>📝 Todo Tasks Manager</h2>
        </div>

        {!user ? (
          <button
            onClick={handleLogin}
            style={{
              padding: "0.7rem 1.2rem",
              background: "#42a5f5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              display: "block",
              margin: "0 auto",
            }}
          >
            🔐 Sign in with Google
          </button>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <p>
                👋 Welcome, <strong>{user.displayName}</strong>
              </p>
              <button
                onClick={handleLogout}
                style={{
                  background: "#ef5350",
                  color: "#fff",
                  border: "none",
                  padding: "0.4rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🔓 Logout
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
              <input
                placeholder="📝 Task Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                placeholder="🧾 Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  background: "#8e24aa",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ➕ Add Task
              </button>
            </form>

            {tasks.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999" }}>No tasks added yet.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    style={{
                      background: getCardColor(task.status),
                      padding: "1rem",
                      borderRadius: "10px",
                      marginBottom: "1rem",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <strong style={{ fontSize: "1.1rem" }}>{task.title}</strong>
                    <p style={{ margin: "0.5rem 0" }}>{task.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        style={{
                          padding: "0.4rem",
                          borderRadius: "6px",
                          border: "1px solid #999",
                        }}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="in progress">🚧 In Progress</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task._id)}
                        style={{
                          background: "#d32f2f",
                          color: "#fff",
                          border: "none",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
