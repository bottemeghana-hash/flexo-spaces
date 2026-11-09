
import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import WorkspaceDetails from "./WorkspaceDetails";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

import "./App.css";

// ======================================
// WORKSPACE DATA
// ======================================

const spaces = [
  {
    id: 1,
    name: "The Executive Suite",
    location: "Hitech City, Hyderabad",
    type: "PRIVATE OFFICE",
    price: "₹85,000",
    period: "/ month",
    amount: 85000,
    capacity: "10–15 People",
    area: "1,200 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900",
    amenities: ["Private Office", "Premium Wi-Fi", "Valet Parking"],
  },
  {
    id: 2,
    name: "The Creative Hub",
    location: "Jubilee Hills, Hyderabad",
    type: "SHARED WORKSPACE",
    price: "₹18,000",
    period: "/ month",
    amount: 18000,
    capacity: "1–4 People",
    area: "Shared Desk",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900",
    amenities: ["Designer Interiors", "Cafeteria", "Power Backup"],
  },
  {
    id: 3,
    name: "The Grand Boardroom",
    location: "Gachibowli, Hyderabad",
    type: "MEETING ROOM",
    price: "₹3,500",
    period: "/ hour",
    amount: 3500,
    capacity: "12–20 People",
    area: "650 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900",
    amenities: ["Executive Seating", "Projector", "Video Conferencing"],
  },
  {
    id: 4,
    name: "The Platinum Offices",
    location: "Financial District, Hyderabad",
    type: "PRIVATE OFFICE",
    price: "₹75,000",
    period: "/ month",
    amount: 75000,
    capacity: "8–12 People",
    area: "1,000 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900",
    amenities: ["Dedicated Team Space", "Reception", "24/7 Security"],
  },
  {
    id: 5,
    name: "The Imperial Workspace",
    location: "Banjara Hills, Hyderabad",
    type: "PRIVATE OFFICE",
    price: "₹65,000",
    period: "/ month",
    amount: 65000,
    capacity: "6–10 People",
    area: "900 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900",
    amenities: ["Luxury Interiors", "Private Cabins", "Executive Lounge"],
  },
  {
    id: 6,
    name: "The Urban Collective",
    location: "Madhapur, Hyderabad",
    type: "SHARED WORKSPACE",
    price: "₹15,000",
    period: "/ month",
    amount: 15000,
    capacity: "1–3 People",
    area: "Shared Desk",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900",
    amenities: ["Flexible Seating", "High-speed Wi-Fi", "Cafeteria"],
  },
  {
    id: 7,
    name: "The CEO's Private Cabin",
    location: "Kondapur, Hyderabad",
    type: "PRIVATE OFFICE",
    price: "₹45,000",
    period: "/ month",
    amount: 45000,
    capacity: "3–6 People",
    area: "550 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900",
    amenities: ["Executive Cabin", "Premium Furniture", "Parking"],
  },
  {
    id: 8,
    name: "The Signature Meeting Lounge",
    location: "Hitech City, Hyderabad",
    type: "MEETING ROOM",
    price: "₹2,500",
    period: "/ hour",
    amount: 2500,
    capacity: "8–12 People",
    area: "450 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900",
    amenities: ["Smart Display", "Conference Table", "Air Conditioning"],
  },
  {
    id: 9,
    name: "The Elite Business Club",
    location: "Jubilee Hills, Hyderabad",
    type: "SHARED WORKSPACE",
    price: "₹25,000",
    period: "/ month",
    amount: 25000,
    capacity: "1–5 People",
    area: "Premium Shared Desk",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900",
    amenities: ["Premium Lounge", "Networking Area", "Cafeteria"],
  },
];

// ======================================
// HOMEPAGE COMPONENT
// ======================================

function Home() {
  const [location, setLocation] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [budget, setBudget] = useState("");
  const [searchApplied, setSearchApplied] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);

  // FILTER WORKSPACES

  const filteredSpaces = spaces.filter((space) => {
    const matchesLocation =
      !location.trim() ||
      space.location.toLowerCase().includes(location.trim().toLowerCase());

    const matchesType =
      !workspaceType || space.type === workspaceType;

    const matchesBudget =
      !budget ||
      (budget === "15000" && space.amount <= 15000) ||
      (budget === "40000" &&
        space.amount > 15000 &&
        space.amount <= 40000) ||
      (budget === "above40000" && space.amount > 40000);

    return matchesLocation && matchesType && matchesBudget;
  });

  // SEARCH WORKSPACES

  const handleSearch = () => {
    setSearchApplied(true);

    document.getElementById("spaces")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // CLEAR FILTERS

  const clearFilters = () => {
    setLocation("");
    setWorkspaceType("");
    setBudget("");
    setSearchApplied(false);
  };

  // WORKSPACE DETAILS

  if (selectedSpace) {
    return (
      <WorkspaceDetails
        space={selectedSpace}
        onBack={() => setSelectedSpace(null)}
      />
    );
  }

  return (
    <div className="website">

      {/* NAVIGATION */}

      <nav className="navbar">

        <a className="logo" href="#home">
          FLEXO<span>SPACES.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#spaces">Explore Spaces</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>

        <div
          className="nav-actions"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >

          <Link to="/login" className="login-btn">
            Log In
          </Link>

          <Link to="/dashboard" className="login-btn">
            Dashboard
          </Link>

          <Link to="/register" className="nav-cta">
            List Your Space ↗
          </Link>

          {/* ADMIN DASHBOARD BUTTON */}

          <Link
            to="/admin-login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "11px 17px",
              backgroundColor: "#C5A15A",
              color: "#191918",
              border: "1px solid #C5A15A",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "13px",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Admin Dashboard ↗
          </Link>

        </div>

      </nav>

      <main>

        {/* HERO SECTION */}

        <section className="hero" id="home">

          <div className="hero-content">

            <p className="eyebrow">
              WORK BETTER. LIVE INSPIRED.
            </p>

            <h1>
              A space to
              <br />
              <span>do great things.</span>
            </h1>

            <p className="hero-description">
              Discover exceptional workspaces designed for ambitious
              people, growing teams and brilliant ideas.
            </p>

            <div className="hero-buttons">

              <a href="#spaces" className="gold-btn">
                Explore Workspaces ↗
              </a>

              <a href="#about" className="text-btn">
                Discover Flexo
              </a>

            </div>

            <div className="hero-stats">

              <div>
                <strong>01</strong>
                <span>Find your space</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Book with ease</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Get to work</span>
              </div>

            </div>

          </div>

          <div className="hero-image">

            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400"
              alt="Premium modern coworking office"
            />

            <div className="image-label">
              <span>YOUR NEXT CHAPTER</span>
              <strong>Starts here.</strong>
            </div>

          </div>

        </section>

        {/* SEARCH SECTION */}

        <section className="search-section">

          <div className="search-heading">
            <span>FIND YOUR PERFECT SPACE</span>
            <h2>Where will you work today?</h2>
          </div>

          <div className="search-box">

            <label>
              LOCATION

              <input
                type="text"
                placeholder="e.g. Hitech City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>

            <label>
              WORKSPACE TYPE

              <select
                value={workspaceType}
                onChange={(e) => setWorkspaceType(e.target.value)}
              >
                <option value="">All workspace types</option>
                <option value="PRIVATE OFFICE">Private Office</option>
                <option value="SHARED WORKSPACE">Shared Workspace</option>
                <option value="MEETING ROOM">Meeting Room</option>
              </select>
            </label>

            <label>
              YOUR BUDGET

              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">Any budget</option>
                <option value="15000">Up to ₹15,000</option>
                <option value="40000">₹15,001 – ₹40,000</option>
                <option value="above40000">Above ₹40,000</option>
              </select>
            </label>

            <button className="search-btn" onClick={handleSearch}>
              Search Spaces ↗
            </button>

          </div>

        </section>

        {/* WORKSPACE LISTINGS */}

        <section className="spaces-section" id="spaces">

          <div className="section-heading">

            <div>
              <p className="eyebrow">CURATED FOR YOUR AMBITION</p>
              <h2>Exceptional spaces.</h2>
            </div>

            <a href="#spaces" className="view-all">
              Explore all spaces ↗
            </a>

          </div>

          {searchApplied && (
            <div className="search-results">

              <p>
                <strong>{filteredSpaces.length}</strong> workspace(s) found
              </p>

              <button className="clear-filters" onClick={clearFilters}>
                Clear filters ✕
              </button>

            </div>
          )}

          <div className="space-grid">

            {filteredSpaces.length > 0 ? (

              filteredSpaces.map((space) => (

                <article className="space-card" key={space.id}>

                  <div className="space-image">

                    <img src={space.image} alt={space.name} />

                    <span className="space-type">
                      {space.type}
                    </span>

                  </div>

                  <div className="space-details">

                    <p className="space-location">
                      ⌖ {space.location}
                    </p>

                    <h3>{space.name}</h3>

                    <div className="space-info">
                      <span>♙ {space.capacity}</span>
                      <span>▧ {space.area}</span>
                    </div>

                    <div className="amenities">
                      {space.amenities.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>

                    <div className="space-footer">

                      <p>
                        <strong>{space.price}</strong>
                        <span> {space.period}</span>
                      </p>

                      <button
                        aria-label={`View ${space.name}`}
                        title="View workspace details"
                        onClick={() => setSelectedSpace(space)}
                      >
                        ↗
                      </button>

                    </div>

                  </div>

                </article>

              ))

            ) : (

              <div className="no-results">

                <h3>No workspaces found</h3>

                <p>
                  Try another location, workspace type or budget.
                </p>

                <button className="gold-btn" onClick={clearFilters}>
                  Show all workspaces
                </button>

              </div>

            )}

          </div>

        </section>

        {/* ABOUT SECTION */}

        <section className="about-section" id="about">

          <p className="eyebrow">MORE THAN JUST A DESK</p>

          <h2>
            Great work begins
            <br />
            with the <span>right space.</span>
          </h2>

          <p>
            From focused individual work to ambitious team meetings,
            discover an environment that helps you do your best work.
          </p>

          <a href="#spaces" className="gold-btn">
            Find your workspace ↗
          </a>

        </section>

        {/* FOOTER */}

        <footer id="contact">

          <a className="logo footer-logo" href="#home">
            FLEXO<span>SPACES.</span>
          </a>

          <p>Find your space. Focus on your future.</p>

          <span>© 2026 Flexo Spaces. All rights reserved.</span>

        </footer>

      </main>

    </div>
  );
}

// ======================================
// APPLICATION ROUTES
// ======================================

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<UserDashboard />} />

      <Route path="/admin-login" element={<AdminLogin />} />

      {/* PROTECTED ADMIN ROUTE */}

      <Route
        path="/admin"
        element={
          localStorage.getItem("flexoAdminToken") ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />

      {/* REDIRECT UNKNOWN ROUTES TO HOMEPAGE */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
