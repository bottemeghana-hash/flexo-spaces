
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://127.0.0.1:5000/api/bookings";

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // GET ADMIN TOKEN
  const getToken = () => {
    return localStorage.getItem("flexoAdminToken");
  };

  // HANDLE EXPIRED OR INVALID LOGIN
  const handleUnauthorized = () => {
    localStorage.removeItem("flexoAdminToken");
    localStorage.removeItem("flexoAdminEmail");
    navigate("/admin-login", { replace: true });
  };

  // ADMIN LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("flexoAdminToken");
    localStorage.removeItem("flexoAdminEmail");
    navigate("/admin-login", { replace: true });
  };

  // LOAD BOOKINGS FROM MONGODB
  const loadBookings = async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load bookings.");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // UPDATE BOOKING STATUS
  const updateStatus = async (bookingId, status) => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setUpdatingId(bookingId);
      setError("");

      const response = await fetch(
        `${API_URL}/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update booking.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking
        )
      );
    } catch (err) {
      setError(err.message || "Status update failed.");
    } finally {
      setUpdatingId("");
    }
  };

  // BOOKING STATISTICS
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "Approved"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "Rejected"
  ).length;

  // FILTER BOOKINGS
  const filteredBookings = useMemo(() => {
    if (activeFilter === "All") {
      return bookings;
    }

    return bookings.filter(
      (booking) => booking.status === activeFilter
    );
  }, [bookings, activeFilter]);

  // FORMAT DATE
  const formatDate = (dateValue) => {
    if (!dateValue) return "Not specified";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // FORMAT TIME
  const formatTime = (time) => {
    if (!time) return "Not specified";

    if (/[AP]M/i.test(time)) {
      return time;
    }

    const [hours, minutes] = time.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return time;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <Link to="/" className="admin-logo">
          FLEXO<span>SPACES.</span>
        </Link>

        <p className="admin-sidebar-label">
          ADMINISTRATION
        </p>

        <nav className="admin-nav">
          <a href="#admin-overview" className="admin-nav-active">
            <span>▦</span> Overview
          </a>

          <a href="#admin-bookings">
            <span>▤</span> Manage Bookings
          </a>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/">← Back to Website</Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              color: "inherit",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Log Out
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <p className="admin-eyebrow">
              FLEXO SPACES MANAGEMENT
            </p>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor reservations and manage workspace bookings.
            </p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={loadBookings}
            disabled={loading}
          >
            ↻ Refresh Bookings
          </button>

        </header>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="admin-error">
            <p>{error}</p>

            <button onClick={loadBookings}>
              Try Again
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <section
          className="admin-overview"
          id="admin-overview"
        >

          <p className="admin-eyebrow">
            AT A GLANCE
          </p>

          <h2>Booking Overview</h2>

          <div className="admin-stats-grid">

            <article className="admin-stat-card">
              <span className="admin-stat-icon">▤</span>
              <p>Total Bookings</p>
              <h3>{loading ? "—" : totalBookings}</h3>
              <span>All reservations</span>
            </article>

            <article className="admin-stat-card">
              <span className="admin-stat-icon">◷</span>
              <p>Pending</p>
              <h3>{loading ? "—" : pendingBookings}</h3>
              <span>Awaiting a decision</span>
            </article>

            <article className="admin-stat-card">
              <span className="admin-stat-icon">✓</span>
              <p>Approved</p>
              <h3>{loading ? "—" : approvedBookings}</h3>
              <span>Confirmed reservations</span>
            </article>

            <article className="admin-stat-card">
              <span className="admin-stat-icon">×</span>
              <p>Rejected</p>
              <h3>{loading ? "—" : rejectedBookings}</h3>
              <span>Declined reservations</span>
            </article>

          </div>
        </section>

        {/* BOOKING MANAGEMENT */}
        <section
          className="admin-bookings-section"
          id="admin-bookings"
        >

          <div className="admin-bookings-heading">

            <div>
              <p className="admin-eyebrow">
                RESERVATION MANAGEMENT
              </p>

              <h2>All Bookings</h2>
            </div>

            <span className="admin-booking-count">
              {filteredBookings.length} booking(s)
            </span>

          </div>

          {/* FILTER BUTTONS */}
          <div className="admin-filters">

            {[
              "All",
              "Pending",
              "Approved",
              "Rejected",
              "Cancelled",
            ].map((filter) => (

              <button
                key={filter}
                className={
                  activeFilter === filter
                    ? "admin-filter active"
                    : "admin-filter"
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>

            ))}

          </div>

          {/* BOOKING LIST */}
          {loading ? (

            <div className="admin-empty-state">
              Loading bookings from MongoDB...
            </div>

          ) : filteredBookings.length === 0 ? (

            <div className="admin-empty-state">
              <h3>No bookings found</h3>
              <p>There are no bookings in this category yet.</p>
            </div>

          ) : (

            <div className="admin-booking-list">

              {filteredBookings.map((booking) => (

                <article
                  className="admin-booking-card"
                  key={booking._id}
                >

                  <div className="admin-booking-top">

                    <div>
                      <p className="admin-booking-label">
                        WORKSPACE
                      </p>

                      <h3>{booking.workspaceName}</h3>

                      <p className="admin-booking-location">
                        {booking.location}
                      </p>
                    </div>

                    <span
                      className={`admin-status ${(
                        booking.status || "Pending"
                      ).toLowerCase()}`}
                    >
                      {booking.status || "Pending"}
                    </span>

                  </div>

                  <div className="admin-booking-details">

                    <div>
                      <span>Customer</span>
                      <strong>{booking.customerName}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{booking.email}</strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>{booking.phone}</strong>
                    </div>

                    <div>
                      <span>Booking Date</span>
                      <strong>
                        {formatDate(booking.bookingDate)}
                      </strong>
                    </div>

                    <div>
                      <span>Booking Time</span>
                      <strong>
                        {formatTime(booking.bookingTime)}
                      </strong>
                    </div>

                    <div>
                      <span>People</span>
                      <strong>{booking.people}</strong>
                    </div>

                  </div>

                  <div className="admin-booking-footer">

                    <p>
                      Booking ID:{" "}
                      <strong>{booking._id}</strong>
                    </p>

                    {booking.status === "Pending" ? (

                      <div className="admin-booking-actions">

                        <button
                          className="admin-approve-btn"
                          onClick={() =>
                            updateStatus(booking._id, "Approved")
                          }
                          disabled={updatingId === booking._id}
                        >
                          {updatingId === booking._id
                            ? "Updating..."
                            : "✓ Approve"}
                        </button>

                        <button
                          className="admin-reject-btn"
                          onClick={() =>
                            updateStatus(booking._id, "Rejected")
                          }
                          disabled={updatingId === booking._id}
                        >
                          {updatingId === booking._id
                            ? "Updating..."
                            : "✕ Reject"}
                        </button>

                      </div>

                    ) : booking.status === "Approved" ? (

                      <div className="admin-booking-actions">

                        <button
                          className="admin-reject-btn"
                          onClick={() =>
                            updateStatus(booking._id, "Cancelled")
                          }
                          disabled={updatingId === booking._id}
                        >
                          {updatingId === booking._id
                            ? "Updating..."
                            : "Cancel Booking"}
                        </button>

                      </div>

                    ) : (

                      <span className="admin-no-action">
                        No action required
                      </span>

                    )}

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

        <footer className="admin-footer">
          © 2026 Flexo Spaces. Admin Management Panel.
        </footer>

      </main>
    </div>
  );
}

export default AdminDashboard;
