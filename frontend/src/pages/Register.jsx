
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "User",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Registration interface is working! Backend registration will be connected later.");
  };

  return (
    <main className="register-page">
      <div className="register-overlay"></div>

      <header className="register-header">
        <Link to="/" className="register-logo">
          FLEXO SPACES
        </Link>
        <span>YOUR SPACE. YOUR AMBITION.</span>
      </header>

      <section className="register-content">
        <div className="register-message">
          <p>BEGIN SOMETHING EXTRAORDINARY</p>
          <h1>Your next chapter<br />starts here.</h1>
          <span>
            Join a community of professionals, creators,
            entrepreneurs and ambitious teams.
          </span>
        </div>

        <div className="register-card">
          <p className="register-eyebrow">JOIN FLEXO SPACES</p>
          <h2>Create account.</h2>
          <p className="register-subtitle">
            Fill in your details to get started.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="User">Workspace Seeker</option>
              <option value="Owner">Space Owner</option>
            </select>

            <label>Password</label>
            <div className="register-password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                minLength="8"
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

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              minLength="8"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit" className="register-submit">
              CREATE ACCOUNT
            </button>
          </form>

          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>

          <Link to="/" className="register-home-link">
            ← Back to homepage
          </Link>
        </div>
      </section>

      <footer className="register-footer">
        © 2026 FLEXO SPACES. ALL RIGHTS RESERVED.
      </footer>
    </main>
  );
}

export default Register;
