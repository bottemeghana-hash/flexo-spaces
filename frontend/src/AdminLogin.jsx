
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "./api";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("flexoAdminToken", data.token);
      localStorage.setItem(
        "flexoAdminEmail",
        data.admin?.email || email
      );

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          FLEXO <span>SPACES</span>
        </div>

        <p className="admin-login-label">ADMINISTRATION</p>

        <h1>Welcome back</h1>

        <p className="admin-login-description">
          Sign in to manage your workspaces and bookings.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to dashboard"}
          </button>
        </form>

        <Link to="/" className="admin-login-back">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

export default AdminLogin;
