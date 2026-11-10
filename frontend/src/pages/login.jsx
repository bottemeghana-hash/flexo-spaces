
import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login interface is working! Authentication will be connected later.");
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
          <h1>Work beyond<br />ordinary.</h1>
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

            <button type="submit" className="full-login-button">
              SIGN IN
            </button>
          </form>

          <p className="full-register-text">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>

          <Link to="/" className="full-back-home">
            ← Back to homepage
          </Link>
        </div>
      </section>

      <footer className="full-login-footer">
        © 2026 FLEXO SPACES. DESIGNED FOR THE WAY YOU WORK.
      </footer>
    </main>
  );
}

export default Login;
