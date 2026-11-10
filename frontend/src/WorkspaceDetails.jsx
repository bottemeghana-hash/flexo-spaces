
import { useState } from "react";
import { API_BASE_URL } from "./api";

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
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  if (!space) return null;

  // HANDLE FORM INPUTS
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SUBMIT BOOKING TO MONGODB
  const handleBooking = async (event) => {
    event.preventDefault();

    setBookingLoading(true);
    setBookingError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: formData.customerName.trim(),
            email: formData.email.trim(),
            phone: formData.phone,
            workspaceId: String(space.id),
            workspaceName: space.name,
            location: space.location,
            bookingDate: formData.bookingDate,
            bookingTime: formData.bookingTime,
            people: Number(formData.people),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Booking submission failed."
        );
      }

      if (!data.booking || !data.booking._id) {
        throw new Error(
          "Booking was received, but no reference ID was returned."
        );
      }

      setBookingReference(data.booking._id);
      setBookingSuccess(true);

    } catch (error) {
      console.error("Booking error:", error);

      setBookingError(
        error.message ||
        "Unable to submit your booking. Please try again."
      );

    } finally {
      setBookingLoading(false);
    }
  };

  // CREATE ANOTHER BOOKING REQUEST
  const handleAnotherRequest = () => {
    setBookingSuccess(false);
    setBookingReference("");
    setBookingError("");

    setFormData({
      customerName: "",
      email: "",
      phone: "",
      bookingDate: "",
      bookingTime: "",
      people: "1",
    });
  };

  return (
    <main className="workspace-details-page">

      {/* BACK BUTTON */}

      <button
        className="back-button"
        type="button"
        onClick={onBack}
      >
        ← Back to Workspaces
      </button>

      {/* WORKSPACE IMAGE */}

      <div className="details-image">

        <img
          src={space.image}
          alt={space.name}
        />

        <span className="details-type">
          {space.type}
        </span>

      </div>

      {/* WORKSPACE INFORMATION */}

      <div className="details-content">

        <div className="details-main">

          <p className="details-location">
            {space.location}
          </p>

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
              <span key={index}>
                ✓ {amenity}
              </span>
            ))}

          </div>

        </div>

        {/* BOOKING FORM */}

        <aside className="booking-card">

          {bookingSuccess ? (

            // BOOKING SUCCESS MESSAGE

            <div className="booking-success">

              <h2>Request Received!</h2>

              <p>
                Your booking request has been saved successfully.
              </p>

              <p>
                <strong>Booking Reference:</strong>
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
                <strong>Status:</strong>
                <br />
                Pending owner confirmation
              </p>

              <button
                className="booking-button"
                type="button"
                onClick={handleAnotherRequest}
              >
                Make Another Request
              </button>

            </div>

          ) : (

            // BOOKING FORM

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

                {/* ERROR MESSAGE */}

                {bookingError && (
                  <p
                    role="alert"
                    style={{
                      color: "red",
                      marginTop: "10px",
                    }}
                  >
                    {bookingError}
                  </p>
                )}

                {/* SUBMIT BUTTON */}

                <button
                  type="submit"
                  className="booking-button"
                  disabled={bookingLoading}
                >
                  {bookingLoading
                    ? "Submitting Request..."
                    : "Submit Booking Request"}
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
