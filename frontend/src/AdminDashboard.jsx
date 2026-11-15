
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./api";
import "./AdminDashboard.css";

const API_URL = `${API_BASE_URL}/api/bookings`;
const WORKSPACE_API_URL = `${API_BASE_URL}/api/workspaces`;

const EMPTY_WORKSPACE = {
  name: "",
  location: "",
  type: "PRIVATE OFFICE",
  price: "",
  amount: "",
  period: "/ month",
  capacity: "",
  area: "",
  image: "",
  amenities: "",
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  const [loading, setLoading] = useState(true);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);

  const [error, setError] = useState("");
  const [workspaceError, setWorkspaceError] = useState("");
  const [workspaceSuccess, setWorkspaceSuccess] = useState("");

  const [updatingId, setUpdatingId] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
  const [savingWorkspace, setSavingWorkspace] = useState(false);
  const [workspaceForm, setWorkspaceForm] = useState(EMPTY_WORKSPACE);

  // ADMIN LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem("flexoAdminToken");
    localStorage.removeItem("flexoAdminEmail");
    navigate("/admin-login", { replace: true });
  }, [navigate]);

  // LOAD BOOKINGS
  const loadBookings = useCallback(async () => {
    const token = localStorage.getItem("flexoAdminToken");

    if (!token) {
      logout();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load bookings.");
      }

      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // LOAD WORKSPACES
  const loadWorkspaces = useCallback(async () => {
    setWorkspaceLoading(true);
    setWorkspaceError("");

    try {
      const response = await fetch(WORKSPACE_API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load workspaces.");
      }

      setWorkspaces(
        Array.isArray(data.workspaces) ? data.workspaces : []
      );
    } catch (err) {
      setWorkspaceError(
        err.message || "Unable to load workspaces."
      );
    } finally {
      setWorkspaceLoading(false);
    }
  }, []);

  // LOAD DATA WHEN DASHBOARD OPENS
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings();
      loadWorkspaces();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadBookings, loadWorkspaces]);

  // UPDATE BOOKING STATUS
  const updateStatus = async (bookingId, status) => {
    const token = localStorage.getItem("flexoAdminToken");

    if (!token) {
      logout();
      return;
    }

    setUpdatingId(bookingId);
    setError("");

    try {
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
        logout();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Booking update failed.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId ? data.booking : booking
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update booking.");
    } finally {
      setUpdatingId("");
    }
  };

  // HANDLE WORKSPACE FORM INPUTS
  const handleWorkspaceChange = (event) => {
    const { name, value } = event.target;

    setWorkspaceForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ADD WORKSPACE TO MONGODB
  const addWorkspace = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("flexoAdminToken");

    if (!token) {
      logout();
      return;
    }

    setSavingWorkspace(true);
    setWorkspaceError("");
    setWorkspaceSuccess("");

    try {
      const payload = {
        ...workspaceForm,
        amount: Number(workspaceForm.amount),
        amenities: workspaceForm.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await fetch(WORKSPACE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to add workspace.");
      }

      setWorkspaces((previous) => [
        ...previous,
        data.workspace,
      ]);

      setWorkspaceForm(EMPTY_WORKSPACE);
      setShowWorkspaceForm(false);
      setWorkspaceSuccess("Workspace added successfully!");

    } catch (err) {
      setWorkspaceError(
        err.message || "Unable to add workspace."
      );
    } finally {
      setSavingWorkspace(false);
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

        <p className="admin-sidebar-label">ADMINISTRATION</p>

        <nav className="admin-nav">
          <a href="#admin-overview" className="admin-nav-active">
            <span>▦</span>
            Overview
          </a>

          <a href="#admin-workspaces">
            <span>⌂</span>
            Manage Workspaces
          </a>

          <a href="#admin-bookings">
            <span>▤</span>
            Manage Bookings
          </a>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/">← Back to Website</Link>

          <button
            type="button"
            onClick={logout}
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

      {/* MAIN DASHBOARD */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">
              FLEXO SPACES MANAGEMENT
            </p>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor reservations and manage your premium workspaces.
            </p>
          </div>

          <button
            className="admin-refresh-btn"
            type="button"
            onClick={() => {
              loadBookings();
              loadWorkspaces();
            }}
            disabled={loading || workspaceLoading}
          >
            ↻ Refresh Dashboard
          </button>
        </header>

        {/* BOOKING ERROR */}
        {error && (
          <div className="admin-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadBookings}>
              Try Again
            </button>
          </div>
        )}

        {/* OVERVIEW */}
        <section className="admin-overview" id="admin-overview">
          <p className="admin-eyebrow">AT A GLANCE</p>
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

        {/* WORKSPACE MANAGEMENT */}
        <section
          className="admin-workspaces-section"
          id="admin-workspaces"
        >
          <div className="admin-workspaces-heading">
            <div>
              <p className="admin-eyebrow">PROPERTY MANAGEMENT</p>
              <h2>Manage Workspaces</h2>
              <p>
                Add premium offices, shared spaces and meeting rooms.
              </p>
            </div>

            <button
              type="button"
              className="admin-add-workspace-btn"
              onClick={() => {
                setShowWorkspaceForm((previous) => !previous);
                setWorkspaceError("");
                setWorkspaceSuccess("");
              }}
            >
              {showWorkspaceForm ? "Close Form" : "+ Add New Workspace"}
            </button>
          </div>

          {workspaceSuccess && (
            <div className="admin-workspace-success" role="status">
              {workspaceSuccess}
            </div>
          )}

          {workspaceError && (
            <div className="admin-error" role="alert">
              {workspaceError}
            </div>
          )}

          {/* ADD WORKSPACE FORM */}
          {showWorkspaceForm && (
            <form
              className="admin-workspace-form"
              onSubmit={addWorkspace}
            >
              <div className="admin-workspace-form-heading">
                <h3>Add a New Workspace</h3>
                <p>
                  Complete the details below to publish a workspace.
                </p>
              </div>

              <div className="admin-workspace-form-grid">
                <label>
                  Workspace Name *
                  <input
                    type="text"
                    name="name"
                    value={workspaceForm.name}
                    onChange={handleWorkspaceChange}
                    placeholder="e.g. The Luxury Executive Suite"
                    required
                  />
                </label>

                <label>
                  Location *
                  <input
                    type="text"
                    name="location"
                    value={workspaceForm.location}
                    onChange={handleWorkspaceChange}
                    placeholder="e.g. Hitech City, Hyderabad"
                    required
                  />
                </label>

                <label>
                  Workspace Type *
                  <select
                    name="type"
                    value={workspaceForm.type}
                    onChange={handleWorkspaceChange}
                    required
                  >
                    <option value="PRIVATE OFFICE">Private Office</option>
                    <option value="SHARED WORKSPACE">Shared Workspace</option>
                    <option value="MEETING ROOM">Meeting Room</option>
                  </select>
                </label>

                <label>
                  Display Price *
                  <input
                    type="text"
                    name="price"
                    value={workspaceForm.price}
                    onChange={handleWorkspaceChange}
                    placeholder="e.g. ₹85,000"
                    required
                  />
                </label>

                <label>
                  Numeric Price *
                  <input
                    type="number"
                    name="amount"
                    value={workspaceForm.amount}
                    onChange={handleWorkspaceChange}
                    placeholder="e.g. 85000"
                    min="0"
                    required
                  />
                </label>

                <label>
                  Price Period
                  <select
                    name="period"
                    value={workspaceForm.period}
                    onChange={handleWorkspaceChange}
                  >
                    <option value="/ month">Per Month</option>
                    <option value="/ day">Per Day</option>
                    <option value="/ hour">Per Hour</option>
                  </select>
                </label>

                <label>
                  Capacity *
                  <input
                    type="text"
                    name="capacity"
                    value={workspaceForm.capacity}
                    onChange={handleWorkspaceChange}
                    placeholder="e.g. 10–15 people"
                    required
                  />
                </label>

                <label>
                  Area *
                  <input
                    type="text"
                    name="area"
                    value={workspaceForm.area}
                    onChange={handleWorkspaceChange}
                    placeholder="e.g. 1,200 sq.ft."
                    required
                  />
                </label>

                <label className="admin-workspace-full-width">
                  Workspace Image URL *
                  <input
                    type="url"
                    name="image"
                    value={workspaceForm.image}
                    onChange={handleWorkspaceChange}
                    placeholder="https://example.com/workspace-image.jpg"
                    required
                  />
                </label>

                <label className="admin-workspace-full-width">
                  Amenities
                  <textarea
                    name="amenities"
                    value={workspaceForm.amenities}
                    onChange={handleWorkspaceChange}
                    placeholder="Premium Wi-Fi, Reception, Parking, Cafeteria"
                    rows="3"
                  />
                  <small>Separate each amenity with a comma.</small>
                </label>
              </div>

              <div className="admin-workspace-form-actions">
                <button
                  type="button"
                  className="admin-workspace-cancel-btn"
                  onClick={() => {
                    setShowWorkspaceForm(false);
                    setWorkspaceForm(EMPTY_WORKSPACE);
                    setWorkspaceError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-add-workspace-btn"
                  disabled={savingWorkspace}
                >
                  {savingWorkspace ? "Saving Workspace..." : "Save Workspace"}
                </button>
              </div>
            </form>
          )}

          {/* EXISTING WORKSPACES */}
          <div className="admin-workspace-list-heading">
            <h3>Published Workspaces</h3>
            <span>{workspaces.length} workspace(s)</span>
          </div>

          {workspaceLoading ? (
            <div className="admin-empty-state">
              Loading workspaces from MongoDB...
            </div>
          ) : workspaceError && workspaces.length === 0 ? (
            <div className="admin-empty-state">
              Unable to display workspaces.
            </div>
          ) : workspaces.length === 0 ? (
            <div className="admin-empty-state">
              No workspaces found.
            </div>
          ) : (
            <div className="admin-workspace-list">
              {workspaces.map((workspace) => (
                <article
                  className="admin-workspace-card"
                  key={workspace._id || workspace.workspaceId}
                >
                  <img
                    src={workspace.image}
                    alt={workspace.name}
                  />

                  <div className="admin-workspace-card-content">
                    <span className="admin-workspace-type">
                      {workspace.type}
                    </span>

                    <h4>{workspace.name}</h4>

                    <p>{workspace.location}</p>

                    <strong>
                      {workspace.price}{" "}
                      <small>{workspace.period}</small>
                    </strong>

                    <div className="admin-workspace-meta">
                      <span>{workspace.capacity}</span>
                      <span>{workspace.area}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* BOOKING MANAGEMENT */}
        <section
          className="admin-bookings-section"
          id="admin-bookings"
        >
          <div className="admin-bookings-heading">
            <div>
              <p className="admin-eyebrow">RESERVATION MANAGEMENT</p>
              <h2>All Bookings</h2>
            </div>

            <span className="admin-booking-count">
              {filteredBookings.length} booking(s)
            </span>
          </div>

          {/* FILTERS */}
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
                type="button"
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

          {/* BOOKINGS */}
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
                      <p className="admin-booking-label">WORKSPACE</p>

                      <h3>
                        {booking.workspaceName || "Workspace"}
                      </h3>

                      <p className="admin-booking-location">
                        {booking.location || "Location not specified"}
                      </p>
                    </div>

                    <span
                      className={`admin-status ${(booking.status || "Pending").toLowerCase()}`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  <div className="admin-booking-details">
                    <div>
                      <span>Customer</span>
                      <strong>{booking.customerName || "Not available"}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{booking.email || "Not available"}</strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>{booking.phone || "Not available"}</strong>
                    </div>

                    <div>
                      <span>Booking Date</span>
                      <strong>{formatDate(booking.bookingDate)}</strong>
                    </div>

                    <div>
                      <span>Booking Time</span>
                      <strong>{formatTime(booking.bookingTime)}</strong>
                    </div>

                    <div>
                      <span>People</span>
                      <strong>{booking.people ?? "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="admin-booking-footer">
                    <p>
                      Booking ID: <strong>{booking._id}</strong>
                    </p>

                    {booking.status === "Pending" ? (
                      <div className="admin-booking-actions">
                        <button
                          type="button"
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
                          type="button"
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
                          type="button"
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
