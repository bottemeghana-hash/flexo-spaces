
import { Link } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  return (
    <div className="user-dashboard">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-logo">
          FLEXO<span>SPACES.</span>
        </Link>

        <p className="sidebar-label">MENU</p>

        <nav className="dashboard-nav">
          <a href="#overview" className="active">▦ Overview</a>
          <a href="#bookings">▤ My Bookings</a>
          <a href="#saved">♡ Saved Workspaces</a>
          <a href="#profile">♙ My Profile</a>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/">← Back to Website</Link>
          <Link to="/login">Log Out</Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">YOUR PERSONAL SPACE</p>
            <h1>Welcome to your dashboard.</h1>
            <p>Manage your workspace journey from one place.</p>
          </div>

          <Link to="/" className="dashboard-explore">
            Explore Spaces ↗
          </Link>
        </header>

        {/* OVERVIEW */}
        <section id="overview" className="dashboard-section">
          <p className="dashboard-eyebrow">AT A GLANCE</p>
          <h2>Your Overview</h2>

          <div className="dashboard-stats">
            <article className="stat-card">
              <p>Total Bookings</p>
              <h3>0</h3>
              <span>No bookings yet</span>
            </article>

            <article className="stat-card">
              <p>Upcoming Bookings</p>
              <h3>0</h3>
              <span>Nothing scheduled</span>
            </article>

            <article className="stat-card">
              <p>Saved Workspaces</p>
              <h3>0</h3>
              <span>Your favourites</span>
            </article>
          </div>
        </section>

        {/* BOOKINGS */}
        <section id="bookings" className="dashboard-content-card">
          <p className="dashboard-eyebrow">RESERVATIONS</p>
          <h2>My Bookings</h2>

          <div className="dashboard-empty">
            <h3>No bookings yet</h3>
            <p>Your workspace reservations will appear here.</p>
            <Link to="/" className="dashboard-explore">
              Find a Workspace
            </Link>
          </div>
        </section>

        {/* SAVED WORKSPACES */}
        <section id="saved" className="dashboard-content-card">
          <p className="dashboard-eyebrow">YOUR COLLECTION</p>
          <h2>Saved Workspaces</h2>

          <div className="dashboard-empty">
            <h3>Your favourite spaces belong here</h3>
            <p>Save workspaces you like to find them later.</p>
            <Link to="/" className="dashboard-explore">
              Discover Spaces
            </Link>
          </div>
        </section>

        {/* PROFILE */}
        <section id="profile" className="dashboard-content-card">
          <p className="dashboard-eyebrow">ACCOUNT SETTINGS</p>
          <h2>My Profile</h2>

          <div className="profile-placeholder">
            <div className="profile-avatar">U</div>
            <div>
              <h3>Workspace Member</h3>
              <p>Your account information will appear here.</p>
            </div>
          </div>

          <p className="profile-note">
            Profile editing will be enabled after authentication is connected.
          </p>
        </section>

        <footer className="dashboard-footer">
          © 2026 Flexo Spaces. Find your space. Focus on your future.
        </footer>

      </main>
    </div>
  );
}

export default UserDashboard;
