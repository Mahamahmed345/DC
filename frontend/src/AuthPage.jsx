import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import API from "./api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async () => {
    try {
      setError("");

      const url = isLogin ? "/login" : "/signup";

      const res = await API.post("http://localhost:5000" + url, form);

      login(res.data);

      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        <p style={styles.subtext}>
          {isLogin
            ? "Login to continue shopping"
            : "Signup to get started"}
        </p>

        {!isLogin && (
          <input
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            style={styles.input}
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={submit} style={styles.button}>
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          style={styles.link}
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: 20
  },

  card: {
    width: 360,
    padding: 35,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    textAlign: "center"
  },

  heading: {
    marginBottom: 5,
    color: "#111827",
    fontSize: 28
  },

  subtext: {
    color: "#6b7280",
    marginBottom: 25,
    fontSize: 14
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: 15,
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: 14,
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: 10,
    marginTop: 10,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "600",
    transition: "0.3s"
  },

  error: {
    color: "#dc2626",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left"
  },

  link: {
    marginTop: 18,
    color: "#2563eb",
    cursor: "pointer",
    fontSize: 14
  }
};