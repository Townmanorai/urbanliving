import React, { useState } from "react";
import { FaHome, FaBookmark, FaGift, FaBuilding, FaCommentDots, FaBell } from "react-icons/fa";
import "./Dashboard.css";
import Navbar from "../Homepage/Navbar";

const Dashboard = () => {
     const [showMore, setShowMore] = useState(false);

  // Mock booking data
  const booking = {
    ID: 1,
    PROPERTY_ID: 2,
    USER_ID: 1,
    PRICE: "8997.00",
    START_DATE: "2025-09-09T18:30:00.000Z",
    END_DATE: "2025-09-12T18:30:00.000Z",
    USERNAME: "John Doe",
    PHONE_NUMBER: "+14155550123",
    PHONE_VERIFIED: 0,
    TERMS_VERIFIED: 1,
    AADHAR_NUMBER: "1234-5678-9012",
    AADHAR_VERIFIED: 0,
    USER_PHOTO: "https://example.com/user-photo.jpg",
    CANCELLED: 0,
    BOOKING_STATUS: "pending",
    CREATED_AT: "2025-08-28T12:00:35.000Z",
    UPDATED_AT: "2025-08-28T12:00:35.000Z",
    PROPERTY_NAME: "TM Luxe - 2",
    PROPERTY_ADDRESS: "Plot No, 7A, Sector 137 Rd, Sector 137, Noida, Uttar Pradesh 201305"
  };
  return (
    <>
    <Navbar/>
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
            <h3 className="sidebar-profile-name">Riya Tanwar</h3>
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
          <h1 className="dashboard-welcome">Welcome Back ! Riya</h1>
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
            <p className="dashboard-profile-name">Riya Tanwar</p>
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

          <div className="booking-card">
            <p><strong>Property:</strong> {booking.PROPERTY_NAME}</p>
            <p><strong>Address:</strong> {booking.PROPERTY_ADDRESS}</p>
            <p><strong>Price:</strong> ₹{booking.PRICE}</p>
            <p>
              <strong>Stay:</strong>{" "}
              {new Date(booking.START_DATE).toLocaleDateString()} -{" "}
              {new Date(booking.END_DATE).toLocaleDateString()}
            </p>
            <p><strong>Status:</strong> {booking.BOOKING_STATUS}</p>

            {showMore && (
              <div className="booking-more-details">
                <p><strong>Booked By:</strong> {booking.USERNAME}</p>
                <p><strong>Phone:</strong> {booking.PHONE_NUMBER}</p>
                <p><strong>Phone Verified:</strong> {booking.PHONE_VERIFIED ? "Yes" : "No"}</p>
                <p><strong>Aadhar:</strong> {booking.AADHAR_NUMBER}</p>
                <p><strong>Aadhar Verified:</strong> {booking.AADHAR_VERIFIED ? "Yes" : "No"}</p>
                <p><strong>Terms Accepted:</strong> {booking.TERMS_VERIFIED ? "Yes" : "No"}</p>
                <p><strong>Cancelled:</strong> {booking.CANCELLED ? "Yes" : "No"}</p>
                <p><strong>Created:</strong> {new Date(booking.CREATED_AT).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(booking.UPDATED_AT).toLocaleString()}</p>
              </div>
            )}

            <button
              className="booking-more-btn"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Hide Information" : "More Information"}
            </button>
          </div>
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
