
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import { API_BASE_URL } from "./api";

import Login from "./pages/login";
import Register from "./pages/Register";
import WorkspaceDetails from "./WorkspaceDetails";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

// ==========================================
// HOME PAGE
// ==========================================

function Home() {
  const navigate = useNavigate();

  // Search filters
  const [location, setLocation] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [budget, setBudget] = useState("");
  const [searchApplied, setSearchApplied] = useState(false);

  // Workspaces from MongoDB
  const [spaces, setSpaces] = useState([]);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [spacesError, setSpacesError] = useState("");

  // Selected workspace
  const [selectedSpace, setSelectedSpace] = useState(null);

  // Favourites
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [favouriteLoading, setFavouriteLoading] = useState(true);

  // ==========================================
  // FETCH WORKSPACES FROM MONGODB
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspaces = async () => {
      try {
        setSpacesLoading(true);
        setSpacesError("");

        const response = await fetch(
          `${API_BASE_URL}/api/workspaces`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load workspaces."
          );
        }

        const formattedWorkspaces = data.workspaces.map(
          (workspace) => ({
            ...workspace,
            id: String(workspace.workspaceId),
            amenities: Array.isArray(workspace.amenities)
              ? workspace.amenities
              : [],
          })
        );

        if (isMounted) {
          setSpaces(formattedWorkspaces);
        }
      } catch (error) {
        console.error("Workspace loading error:", error);

        if (isMounted) {
          setSpacesError(error.message);
        }
      } finally {
        if (isMounted) {
          setSpacesLoading(false);
        }
      }
    };

    fetchWorkspaces();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // FETCH USER FAVOURITES
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchFavourites = async () => {
      const token = localStorage.getItem("flexoUserToken");

      if (!token) {
        if (isMounted) {
          setFavouriteLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/favourites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success && isMounted) {
          setFavouriteIds(
            data.favourites.map((item) =>
              String(item.workspaceId)
            )
          );
        }
      } catch (error) {
        console.error(
          "Unable to load favourites:",
          error
        );
      } finally {
        if (isMounted) {
          setFavouriteLoading(false);
        }
      }
    };

    fetchFavourites();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // ADD OR REMOVE FAVOURITES
  // ==========================================

  const handleFavourite = async (space) => {
    const token = localStorage.getItem("flexoUserToken");

    if (!token) {
      alert("Please log in to save your favourite workspaces.");
      navigate("/login");
      return;
    }

    const workspaceId = String(space.id);
    const isFavourite = favouriteIds.includes(workspaceId);

    try {
      const response = await fetch(
        isFavourite
          ? `${API_BASE_URL}/api/favourites/${workspaceId}`
          : `${API_BASE_URL}/api/favourites`,
        {
          method: isFavourite ? "DELETE" : "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          ...(isFavourite
            ? {}
            : {
                body: JSON.stringify({
                  workspaceId,
                  name: space.name,
                  location: space.location,
                  type: space.type,
                  price: space.price,
                  period: space.period,
                  image: space.image,
                  capacity: space.capacity,
                  area: space.area,
                  amenities: space.amenities,
                }),
              }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update favourites."
        );
      }

      setFavouriteIds((previous) =>
        isFavourite
          ? previous.filter((id) => id !== workspaceId)
          : [...previous, workspaceId]
      );

      alert(
        isFavourite
          ? "Workspace removed from favourites."
          : "Workspace added to favourites!"
      );
    } catch (error) {
      console.error("Favourite error:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // FILTER WORKSPACES
  // ==========================================

  const filteredSpaces = spaces.filter((space) => {
    const matchesLocation =
      !location ||
      space.location
        .toLowerCase()
        .includes(location.toLowerCase());

    const matchesType =
      !workspaceType || space.type === workspaceType;

    const matchesBudget =
      !budget || Number(space.amount) <= Number(budget);

    return (
      matchesLocation &&
      matchesType &&
      matchesBudget
    );
  });

  // ==========================================
  // SEARCH FUNCTIONS
  // ==========================================

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchApplied(true);
  };

  const clearFilters = () => {
    setLocation("");
    setWorkspaceType("");
    setBudget("");
    setSearchApplied(false);
  };

  // ==========================================
  // WORKSPACE DETAILS
  // ==========================================

  if (selectedSpace) {
    return (
      <WorkspaceDetails
        space={selectedSpace}
        onBack={() => setSelectedSpace(null)}
      />
    );
  }

  // ==========================================
  // HOMEPAGE UI
  // ==========================================

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">
        <Link to="/" className="logo">
          FLEXO<span>SPACES</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#workspaces">Workspaces</a>
          <Link to="/register">List Your Space</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/admin">Admin Dashboard</Link>

          <Link to="/login" className="login-button">
            Log In
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}

      <section className="hero">
        <div className="hero-content">

          <p className="hero-label">
            WORKSPACE, REIMAGINED
          </p>

          <h1>
            Find a Space
            <br />
            That Inspires <span>Greatness.</span>
          </h1>

          <p className="hero-description">
            Discover premium workspaces designed for ambitious
            professionals, growing teams and modern businesses.
          </p>

          <a href="#workspaces" className="hero-button">
            Explore Workspaces
          </a>

        </div>
      </section>

      {/* SEARCH SECTION */}

      <section className="search-section">
        <form
          className="search-form"
          onSubmit={handleSearch}
        >

          <div className="search-field">
            <label htmlFor="location">Location</label>

            <select
              id="location"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
            >
              <option value="">All Locations</option>
              <option value="Hitech City">Hitech City</option>
              <option value="Jubilee Hills">Jubilee Hills</option>
              <option value="Gachibowli">Gachibowli</option>
              <option value="Financial District">
                Financial District
              </option>
              <option value="Banjara Hills">Banjara Hills</option>
              <option value="Madhapur">Madhapur</option>
              <option value="Kondapur">Kondapur</option>
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="workspaceType">
              Workspace Type
            </label>

            <select
              id="workspaceType"
              value={workspaceType}
              onChange={(event) =>
                setWorkspaceType(event.target.value)
              }
            >
              <option value="">All Types</option>
              <option value="PRIVATE OFFICE">
                Private Office
              </option>
              <option value="SHARED WORKSPACE">
                Shared Workspace
              </option>
              <option value="MEETING ROOM">
                Meeting Room
              </option>
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="budget">Maximum Budget</label>

            <select
              id="budget"
              value={budget}
              onChange={(event) =>
                setBudget(event.target.value)
              }
            >
              <option value="">Any Budget</option>
              <option value="10000">Up to ₹10,000</option>
              <option value="20000">Up to ₹20,000</option>
              <option value="30000">Up to ₹30,000</option>
              <option value="50000">Up to ₹50,000</option>
              <option value="75000">Up to ₹75,000</option>
              <option value="100000">Up to ₹1,00,000</option>
            </select>
          </div>

          <button
            type="submit"
            className="search-button"
          >
            Search Spaces
          </button>

        </form>
      </section>

      {/* WORKSPACES SECTION */}

      <section
        className="workspaces-section"
        id="workspaces"
      >

        <div className="section-heading">
          <div>
            <p className="section-label">
              OUR COLLECTION
            </p>

            <h2>Explore Premium Workspaces</h2>

            <p>
              Thoughtfully designed spaces for your next big idea.
            </p>
          </div>
        </div>

        {/* SEARCH RESULTS */}

        {searchApplied && !spacesLoading && !spacesError && (
          <div className="search-results">
            <p>
              Showing{" "}
              <strong>{filteredSpaces.length}</strong>{" "}
              workspace(s) matching your search.
            </p>

            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear filters ✕
            </button>
          </div>
        )}

        {/* LOADING */}

        {spacesLoading ? (
          <div className="no-results">
            <h3>Loading Workspaces...</h3>
            <p>Please wait while we fetch workspaces.</p>
          </div>

        ) : spacesError ? (
          <div className="no-results">
            <h3>Unable to Load Workspaces</h3>
            <p>{spacesError}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>

        ) : filteredSpaces.length === 0 ? (
          <div className="no-results">
            <h3>No workspaces found</h3>
            <p>
              Try changing your location, type or budget.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

        ) : (

          /* WORKSPACE CARDS */

          <div className="spaces-grid">

            {filteredSpaces.map((space) => {
              const isFavourite = favouriteIds.includes(
                String(space.id)
              );

              return (
                <article
                  className="space-card"
                  key={space.id}
                >

                  <div
                    className="space-image"
                    style={{ position: "relative" }}
                  >

                    <img
                      src={space.image}
                      alt={space.name}
                    />

                    <span className="space-type">
                      {space.type}
                    </span>

                    {/* FAVOURITE BUTTON */}

                    <button
                      type="button"
                      onClick={() => handleFavourite(space)}
                      disabled={favouriteLoading}
                      aria-label={
                        isFavourite
                          ? "Remove from favourites"
                          : "Add to favourites"
                      }
                      title={
                        isFavourite
                          ? "Remove from favourites"
                          : "Save to favourites"
                      }
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#ffffff",
                        color: isFavourite
                          ? "#e63946"
                          : "#333333",
                        fontSize: "23px",
                        cursor: favouriteLoading
                          ? "wait"
                          : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow:
                          "0 2px 10px rgba(0,0,0,0.15)",
                      }}
                    >
                      {isFavourite ? "♥" : "♡"}
                    </button>

                  </div>

                  {/* WORKSPACE INFORMATION */}

                  <div className="space-details">

                    <p className="space-location">
                      ⌖ {space.location}
                    </p>

                    <h3>{space.name}</h3>

                    <div className="space-info">
                      <span>
                        ♙ {space.capacity}
                      </span>

                      <span>
                        ▧ {space.area}
                      </span>
                    </div>

                    {/* AMENITIES */}

                    <div className="amenities">
                      {space.amenities.map((item) => (
                        <span key={item}>
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* PRICE AND DETAILS */}

                    <div className="space-footer">
                      <p>
                        <strong>{space.price}</strong>
                        <span> {space.period}</span>
                      </p>

                      <button
                        type="button"
                        aria-label={`View ${space.name}`}
                        title="View workspace details"
                        onClick={() =>
                          setSelectedSpace(space)
                        }
                      >
                        →
                      </button>
                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

      {/* WHY FLEXO SECTION */}

      <section className="why-flexo">

        <div className="section-heading">
          <p className="section-label">
            THE FLEXO ADVANTAGE
          </p>

          <h2>A Better Way to Work</h2>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <h3>Premium Spaces</h3>

            <p>
              Discover carefully selected workspaces with
              professional interiors and modern facilities.
            </p>
          </div>

          <div className="feature-card">
            <h3>Flexible Choices</h3>

            <p>
              Find private offices, shared workspaces and
              meeting rooms that suit your needs.
            </p>
          </div>

          <div className="feature-card">
            <h3>Simple Booking</h3>

            <p>
              Explore workspace details and manage your bookings
              from your personal dashboard.
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-content">

          <Link to="/" className="logo">
            FLEXO<span>SPACES</span>
          </Link>

          <p>
            Premium workspaces. Better ideas. Bigger possibilities.
          </p>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/login">Log In</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

        </div>

        <p className="copyright">
          © {new Date().getFullYear()} Flexo Spaces. All rights
          reserved.
        </p>

      </footer>

    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================

function App() {
  const adminToken = localStorage.getItem("flexoAdminToken");

  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<UserDashboard />}
      />

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={
          adminToken
            ? <AdminDashboard />
            : <Navigate to="/admin-login" replace />
        }
      />

      <Route
        path="/admin-dashboard"
        element={<Navigate to="/admin" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;
