import React, { useState, useEffect } from "react";
import { FaHome, FaBookmark, FaGift, FaBuilding, FaCommentDots, FaBell } from "react-icons/fa";
import "./Dashboard.css";
import Navbar from "../Homepage/Navbar";

const Dashboard = () => {
  const [showMore, setShowMore] = useState(false);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load user from localStorage
    try {
      const raw = localStorage.getItem("user");
      console.log(raw)
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, []);

  useEffect(() => {
    // Fetch bookings when user is available
    const fetchBookings = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://townmanor.ai/api/booking/user/${user.id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Error fetching bookings", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`https://townmanor.ai/api/booking/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, user_id: user?.id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data?.success) {
        throw new Error(data?.message || "Cancel failed");
      }
      // Update local state on success
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, cancelled: 1, booking_status: "cancelled" } : b))
      );
      alert(data.message || "Booking cancelled successfully.");
    } catch (e) {
      console.error("Failed to cancel booking", e);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  return (
    <>
      {/* <Navbar/> */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            <img
              src="image 129.png"
              alt="user avatar"
              className="sidebar-profile-image"
            />
            <div>
              <h3 className="sidebar-profile-name">{user?.username || "Guest"}</h3>
              <p className="sidebar-profile-role">TM Member</p>
            </div>
          </div>

          <ul className="sidebar-menu">
            <li className="sidebar-menu-item active">
              <FaHome className="sidebar-menu-icon" /> Dashboard
            </li>
            <li className="sidebar-menu-item">
              <FaBookmark className="sidebar-menu-icon" /> Bookings
            </li>
            <li className="sidebar-menu-item">
              <FaGift className="sidebar-menu-icon" /> Rewards
            </li>
            <li className="sidebar-menu-item">
              <FaBuilding className="sidebar-menu-icon" /> Properties
            </li>
            <li className="sidebar-menu-item">
              <FaCommentDots className="sidebar-menu-icon" /> Edit
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Top Bar */}
          <div className="dashboard-topbar">
            <h1 className="dashboard-welcome">Welcome Back ! {user?.username || "Guest"}</h1>
            <div className="dashboard-bell">
              <FaBell />
            </div>
          </div>

          {/* Profile Section */}
          <div className="dashboard-profile-section">
            <img
              src="/130.png"
              alt="profile avatar"
              className="dashboard-profile-image"
            />
            <div className="dashboard-profile-details">
              <h2 className="dashboard-profile-heading">Profile</h2>
              <p className="dashboard-profile-name">{user?.username || "Guest"}</p>
              <p className="dashboard-profile-role">TM Member</p>
              <p className="dashboard-profile-actions">
                Quick Actions : Edit Profile | Setting
              </p>
            </div>
          </div>
        </main>
      </div>
      {/* Booking Section */}
      <div className="dashboard-booking-section">
        <h2 className="dashboard-booking-heading">Booking Details</h2>

        {loading && <p>Loading bookings...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p>No bookings found.</p>
        )}

        {!loading && !error && bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <p><strong>Property:</strong> {b.property_name}</p>
            <p><strong>Address:</strong> {b.property_address}</p>
            <p><strong>Price:</strong> ₹{Number(b.price).toFixed(2)}</p>
            <p>
              <strong>Stay:</strong>{" "}
              {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
            </p>
            <p><strong>Status:</strong> {b.booking_status}</p>

            {showMore && (
              <div className="booking-more-details">
                <p><strong>Booked By:</strong> {b.username}</p>
                <p><strong>Phone:</strong> {b.phone_number}</p>
                <p><strong>Phone Verified:</strong> {b.phone_verified ? "Yes" : "No"}</p>
                <p><strong>Aadhar:</strong> {b.aadhar_number}</p>
                <p><strong>Aadhar Verified:</strong> {b.aadhar_verified ? "Yes" : "No"}</p>
                <p><strong>Terms Accepted:</strong> {b.terms_verified ? "Yes" : "No"}</p>
                <p><strong>Cancelled:</strong> {b.cancelled ? "Yes" : "No"}</p>
                <p><strong>Created:</strong> {new Date(b.created_at).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(b.updated_at).toLocaleString()}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button
                className="booking-more-btn"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Hide Information" : "More Information"}
              </button>
              {!(b.cancelled || b.booking_status === "cancelled") && (
                <button
                  className="booking-more-btn"
                  style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                  onClick={() => cancelBooking(b.id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Notification Section */}
      <div className="dashboard-notification-section">
        <h2 className="dashboard-notification-heading">Notification</h2>

        <div className="notification-card">
          <FaBell className="notification-icon" />
          <div>
            <p className="notification-title">Exclusive offer: 20% off on your next Stay.</p>
            <p className="notification-desc">Expires in 7 Days.</p>
          </div>
        </div>

        <div className="notification-card">
          <FaBell className="notification-icon" />
          <div>
            <p className="notification-title">Upcoming Stays: Cozy Cabins.</p>
            <p className="notification-desc">Reminder check-in is Tomorrow.</p>
          </div>
        </div>

        <div className="notification-card">
          <FaBell className="notification-icon" />
          <div>
            <p className="notification-title">TM updates</p>
            <p className="notification-desc">Check what is new.</p>
          </div>
        </div>
      </div>
      {/* Support & Help Section */}
      <div className="dashboard-support-section">
        <h2 className="dashboard-support-heading">Support & Help</h2>

        <div className="support-options">
          <div className="support-card">
            <span className="support-icon">❓</span>
            <p className="support-text">FAQ</p>
          </div>

          <div className="support-card">
            <span className="support-icon">💬</span>
            <p className="support-text">Chat with support</p>
          </div>

          <div className="support-card">
            <span className="support-icon">📞</span>
            <p className="support-text">Call Us</p>
          </div>
        </div>
      </div>

    </>
  );
};

export default Dashboard;
