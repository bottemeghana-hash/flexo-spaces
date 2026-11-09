
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load bookings.");
        }

        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingDate);
    return bookingDate >= today &&
      booking.status !== "Rejected" &&
      booking.status !== "Cancelled";
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Not specified";

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusClass = (status) => {
    return (status || "Pending").toLowerCase();
  };

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
              <h3>{bookings.length}</h3>
              <span>All booking requests</span>
            </article>

            <article className="stat-card">
              <p>Upcoming Bookings</p>
              <h3>{upcomingBookings.length}</h3>
              <span>Future reservations</span>
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

          {loading ? (
            <div className="dashboard-empty">
              <h3>Loading bookings...</h3>
              <p>Please wait while we retrieve your reservations.</p>
            </div>
          ) : error ? (
            <div className="dashboard-empty">
              <h3>Unable to load bookings</h3>
              <p>{error}</p>
              <button
                className="dashboard-explore"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No bookings yet</h3>
              <p>Your workspace reservations will appear here.</p>
              <Link to="/" className="dashboard-explore">
                Find a Workspace
              </Link>
            </div>
          ) : (
            <div className="dashboard-bookings-list">
              {bookings.map((booking) => (
                <article
                  className="dashboard-booking-item"
                  key={booking._id}
                >
                  <div className="booking-item-header">
                    <div>
                      <h3>{booking.workspaceName}</h3>
                      <p>{booking.location}</p>
                    </div>

                    <span className={`booking-status ${getStatusClass(booking.status)}`}>
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  <div className="booking-item-details">
                    <p>
                      <strong>Reference:</strong> {booking._id}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(booking.bookingDate)}
                    </p>
                    <p>
                      <strong>Time:</strong> {formatTime(booking.bookingTime)}
                    </p>
                    <p>
                      <strong>People:</strong> {booking.people}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
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
