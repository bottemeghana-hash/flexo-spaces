
import { useState } from "react";

function WorkspaceDetails({ space, onBack }) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    bookingDate: "",
    bookingTime: "",
    people: "1",
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  if (!space) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleBooking = (event) => {
    event.preventDefault();

    const reference =
      "FLX" + Date.now().toString().slice(-8);

    setBookingReference(reference);
    setBookingSuccess(true);
  };

  return (
    <main className="workspace-details-page">
      <button className="back-button" onClick={onBack}>
        ← Back to Workspaces
      </button>

      <div className="details-image">
        <img src={space.image} alt={space.name} />
        <span className="details-type">{space.type}</span>
      </div>

      <div className="details-content">
        <div className="details-main">
          <p className="details-location">{space.location}</p>

          <h1>{space.name}</h1>

          <p className="details-description">
            Discover a thoughtfully designed workspace
            created for productivity, comfort and exceptional
            working experiences.
          </p>

          <h2>Workspace Overview</h2>

          <div className="details-specifications">
            <div>
              <span>Capacity</span>
              <strong>{space.capacity}</strong>
            </div>

            <div>
              <span>Workspace Area</span>
              <strong>{space.area}</strong>
            </div>

            <div>
              <span>Workspace Type</span>
              <strong>{space.type}</strong>
            </div>
          </div>

          <h2>Amenities & Facilities</h2>

          <div className="details-amenities">
            {space.amenities.map((amenity, index) => (
              <span key={index}>✓ {amenity}</span>
            ))}
          </div>
        </div>

        <aside className="booking-card">
          {bookingSuccess ? (
            <div className="booking-success">
              <h2>Request Received!</h2>

              <p>
                Your booking request has been submitted
                successfully.
              </p>

              <p>
                <strong>Reference:</strong>
                <br />
                {bookingReference}
              </p>

              <p>
                <strong>Workspace:</strong>
                <br />
                {space.name}
              </p>

              <p>
                <strong>Date:</strong>
                <br />
                {formData.bookingDate}
              </p>

              <p>
                This is a demo confirmation. Your booking
                is not yet saved or confirmed.
              </p>

              <button
                className="booking-button"
                onClick={() => setBookingSuccess(false)}
              >
                Make Another Request
              </button>
            </div>
          ) : (
            <>
              <p>Workspace Starting From</p>
              <h2>{space.price}</h2>
              <span>{space.period}</span>

              <h3 className="booking-form-title">
                Request a Booking
              </h3>

              <form onSubmit={handleBooking}>
                <label>Your Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Enter your name"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />

                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <label>Booking Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                />

                <label>Preferred Time</label>
                <input
                  type="time"
                  name="bookingTime"
                  value={formData.bookingTime}
                  onChange={handleChange}
                  required
                />

                <label>Number of People</label>
                <input
                  type="number"
                  name="people"
                  min="1"
                  max="20"
                  value={formData.people}
                  onChange={handleChange}
                  required
                />

                <button
                  type="submit"
                  className="booking-button"
                >
                  Submit Booking Request
                </button>
              </form>

              <p className="booking-note">
                Your request will be subject to workspace
                availability and owner confirmation.
              </p>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}

export default WorkspaceDetails;
