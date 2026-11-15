
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { API_BASE_URL } from "./api";

function UserDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  // SAVED WORKSPACES
  const [favourites, setFavourites] = useState([]);
  const [favouritesLoading, setFavouritesLoading] = useState(true);
  const [favouritesError, setFavouritesError] = useState("");
  const [removingId, setRemovingId] = useState("");

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("flexoUser")) || {};
    } catch {
      return {};
    }
  });

  // LOAD USER BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("flexoUserToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/bookings/my`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("flexoUserToken");
          localStorage.removeItem("flexoUser");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load bookings.");
        }

        setBookings(data.bookings || []);
        setError("");
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  // LOAD SAVED WORKSPACES
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const token = localStorage.getItem("flexoUserToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/favourites`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("flexoUserToken");
          localStorage.removeItem("flexoUser");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load saved workspaces."
          );
        }

        setFavourites(data.favourites || []);
        setFavouritesError("");
      } catch (err) {
        console.error("Favourites error:", err);
        setFavouritesError(
          err.message || "Unable to load saved workspaces."
        );
      } finally {
        setFavouritesLoading(false);
      }
    };

    fetchFavourites();
  }, [navigate]);

  // CANCEL USER BOOKING
  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);
      setCancelError("");

      const token = localStorage.getItem("flexoUserToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("flexoUserToken");
        localStorage.removeItem("flexoUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to cancel booking.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: data.booking.status }
            : booking
        )
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      setCancelError(
        err.message || "Unable to cancel booking."
      );
    } finally {
      setCancellingId("");
    }
  };

  // REMOVE SAVED WORKSPACE
  const handleRemoveFavourite = async (workspaceId) => {
    const confirmed = window.confirm(
      "Remove this workspace from your saved list?"
    );

    if (!confirmed) return;

    try {
      setRemovingId(workspaceId);
      setFavouritesError("");

      const token = localStorage.getItem("flexoUserToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/favourites/${workspaceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("flexoUserToken");
        localStorage.removeItem("flexoUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to remove saved workspace."
        );
      }

      setFavourites((previous) =>
        previous.filter(
          (item) => String(item.workspaceId) !== String(workspaceId)
        )
      );
    } catch (err) {
      console.error("Remove favourite error:", err);
      setFavouritesError(
        err.message || "Unable to remove saved workspace."
      );
    } finally {
      setRemovingId("");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("flexoUserToken");
    localStorage.removeItem("flexoUser");
    navigate("/login");
  };

  // UPCOMING BOOKINGS
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingDate);

    return (
      bookingDate >= today &&
      booking.status !== "Rejected" &&
      booking.status !== "Cancelled"
    );
  });

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // FORMAT TIME
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

  // BOOKING STATUS
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
          <a href="#overview" className="active">
            ▦ Overview
          </a>

          <a href="#bookings">▤ My Bookings</a>

          <a href="#saved">♡ Saved Workspaces</a>

          <a href="#profile">♙ My Profile</a>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/">← Back to Website</Link>

          <button
            type="button"
            onClick={handleLogout}
            className="dashboard-logout"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              YOUR PERSONAL SPACE
            </p>

            <h1>
              Welcome
              {user.fullName
                ? `, ${user.fullName}`
                : " to your dashboard"}.
            </h1>

            <p>
              Manage your workspace journey from one place.
            </p>
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
              <h3>{favourites.length}</h3>
              <span>Your favourites</span>
            </article>
          </div>
        </section>

        {/* MY BOOKINGS */}
        <section id="bookings" className="dashboard-content-card">
          <p className="dashboard-eyebrow">RESERVATIONS</p>

          <h2>My Bookings</h2>

          {cancelError && (
            <p role="alert" style={{ color: "#dc2626" }}>
              {cancelError}
            </p>
          )}

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
                type="button"
                className="dashboard-explore"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No bookings yet</h3>

              <p>
                Your workspace reservations will appear here.
              </p>

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

                    <span
                      className={`booking-status ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  <div className="booking-item-details">
                    <p>
                      <strong>Reference:</strong> {booking._id}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(booking.bookingDate)}
                    </p>

                    <p>
                      <strong>Time:</strong>{" "}
                      {formatTime(booking.bookingTime)}
                    </p>

                    <p>
                      <strong>People:</strong> {booking.people}
                    </p>
                  </div>

                  {booking.status === "Pending" && (
                    <button
                      type="button"
                      className="dashboard-logout"
                      disabled={cancellingId === booking._id}
                      onClick={() =>
                        handleCancelBooking(booking._id)
                      }
                    >
                      {cancellingId === booking._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* SAVED WORKSPACES */}
        <section id="saved" className="dashboard-content-card">
          <p className="dashboard-eyebrow">YOUR COLLECTION</p>

          <h2>Saved Workspaces</h2>

          {favouritesError && (
            <p role="alert" style={{ color: "#dc2626" }}>
              {favouritesError}
            </p>
          )}

          {favouritesLoading ? (
            <div className="dashboard-empty">
              <h3>Loading saved workspaces...</h3>
              <p>Please wait.</p>
            </div>
          ) : favourites.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No saved workspaces yet</h3>

              <p>
                Save workspaces you like to find them here later.
              </p>

              <Link to="/" className="dashboard-explore">
                Discover Spaces
              </Link>
            </div>
          ) : (
            <div className="dashboard-bookings-list">
              {favourites.map((favourite) => (
                <article
                  className="dashboard-booking-item"
                  key={favourite._id}
                >
                  {favourite.image && (
                    <img
                      src={favourite.image}
                      alt={favourite.name}
                      style={{
                        width: "100%",
                        maxWidth: "260px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "15px",
                      }}
                    />
                  )}

                  <div className="booking-item-header">
                    <div>
                      <h3>{favourite.name}</h3>
                      <p>{favourite.location}</p>
                    </div>

                    <span className="booking-status">
                      {favourite.type}
                    </span>
                  </div>

                  <div className="booking-item-details">
                    <p>
                      <strong>Price:</strong> {favourite.price}{" "}
                      {favourite.period}
                    </p>

                    <p>
                      <strong>Capacity:</strong>{" "}
                      {favourite.capacity || "Not specified"}
                    </p>

                    <p>
                      <strong>Area:</strong>{" "}
                      {favourite.area || "Not specified"}
                    </p>

                    {favourite.amenities?.length > 0 && (
                      <p>
                        <strong>Amenities:</strong>{" "}
                        {favourite.amenities.join(", ")}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="dashboard-logout"
                    disabled={removingId === favourite.workspaceId}
                    onClick={() =>
                      handleRemoveFavourite(favourite.workspaceId)
                    }
                  >
                    {removingId === favourite.workspaceId
                      ? "Removing..."
                      : "Remove from Saved"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* PROFILE */}
        <section id="profile" className="dashboard-content-card">
          <p className="dashboard-eyebrow">ACCOUNT SETTINGS</p>

          <h2>My Profile</h2>

          <div className="profile-placeholder">
            <div className="profile-avatar">
              {user.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h3>{user.fullName || "Workspace Member"}</h3>

              <p>{user.email || "Your email address"}</p>

              {user.phone && <p>{user.phone}</p>}

              {user.role && <p>Account Type: {user.role}</p>}
            </div>
          </div>

          <p className="profile-note">
            Your registered account information is displayed here.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          © 2026 Flexo Spaces. Find your space. Focus on your future.
        </footer>
      </main>
    </div>
  );
}

export default UserDashboard;
