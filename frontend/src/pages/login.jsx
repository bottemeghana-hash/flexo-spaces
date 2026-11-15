
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save user authentication details
      localStorage.setItem("flexoUserToken", data.token);
      localStorage.setItem(
        "flexoUser",
        JSON.stringify(data.user)
      );

      // Open the user dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="full-login-page">
      <div className="full-login-overlay"></div>

      <header className="full-login-header">
        <Link to="/" className="full-login-logo">
          FLEXO SPACES
        </Link>
        <span>PREMIUM WORKSPACE EXPERIENCE</span>
      </header>

      <section className="full-login-content">
        <div className="full-login-message">
          <p>FIND YOUR SPACE. CREATE YOUR FUTURE.</p>
          <h1>
            Work beyond
            <br />
            ordinary.
          </h1>
          <span>
            Exceptional spaces for ambitious people,
            growing teams and extraordinary ideas.
          </span>
        </div>

        <div className="full-login-card">
          <p className="full-login-eyebrow">WELCOME BACK</p>

          <h2>Sign in.</h2>

          <p className="full-login-subtitle">
            Access your Flexo Spaces account.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <div className="full-password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <p style={{ color: "#d93025", marginTop: "12px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="full-login-button"
              disabled={loading}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <p className="full-register-text">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>

          <Link to="/" className="full-back-home">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
