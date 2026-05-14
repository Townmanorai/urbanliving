import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaClipboardList,
  FaRupeeSign,
  FaHome,
  FaEnvelope,
  FaFileAlt,
  FaHeadset,
  FaTimes,
  FaChartLine,
  FaCalendarAlt,
  FaUniversity,
  FaBolt,
  FaReceipt,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../Login/AuthContext";
import "./Sidebar.css";
import { FaUserCircle } from "react-icons/fa";

function Sidebar({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    profile_photo: "",
  });

  /* 🔥 Image Popup State */
  const [showImageModal, setShowImageModal] = useState(false);

  /* ================= GET USER ID ================= */
  const getUserId = () => {
    if (user?.id) return user.id;

    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.id || null;
    } catch {
      return null;
    }
  };

  /* ================= FETCH USER DETAILS ================= */
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const res = await axios.get(
          `https://www.townmanor.ai/api/user-details?user_id=${userId}`
        );

        if (res.data) {
          setProfile({
            username: res.data.username || "",
            email: res.data.email || "",
            profile_photo: res.data.profile_photo || "",
          });
        }
      } catch (err) {
        console.error("Failed to load user details", err);
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Mobile Close */}
        <div className="mobile-close" onClick={onClose}>
          <FaTimes />
        </div>

        {/* PROFILE SECTION */}
        <div className="sidebar-header">
          <div
            className="profile-icon-wrapper clickable"
            onClick={() => profile.profile_photo && setShowImageModal(true)}
          >
            {profile.profile_photo ? (
              <img
                src={profile.profile_photo}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <FaUserCircle size={64} color="#c98b3e" />
            )}
          </div>

          <h3 className="profile-name">
            {profile.username || "Loading..."}
          </h3>

          <p className="profile-role">
            {profile.email || ""}
          </p>
        </div>

        {/* MENU */}
        <ul className="menu" onClick={onClose}>
          <li>
            <NavLink to="/admindashboard" end>
              <FaHome /> Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/admindashboard/leads" style={({ isActive }) => isActive ? {} : {}}>
              {({ isActive }) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <FaBolt style={{ color: isActive ? 'inherit' : '#c98b3e' }} />
                  <span>Leads</span>
                  <span style={{
                    marginLeft: 'auto',
                    background: 'linear-gradient(135deg,#c98b3e,#e0a94e)',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    letterSpacing: '0.06em',
                  }}>PREMIUM</span>
                </span>
              )}
            </NavLink>
          </li>

          <li>
            <NavLink to="/admindashboard/invoices">
              <FaReceipt /> Invoices
            </NavLink>
          </li>

          <li>
            <NavLink to="/admindashboard/inquiriesbookings">
              <FaClipboardList /> Inquiries
            </NavLink>
          </li>

          <li>
            <NavLink to="/admindashboard/financials">
              <FaRupeeSign /> Financials
            </NavLink>
          </li>

          {/* <li>
            <NavLink to="/admindashboard/properties">
              <FaHome /> Properties
            </NavLink>
          </li> */}

          {/* <li>
            <NavLink to="/admindashboard/messages">
              <FaEnvelope /> Messages
            </NavLink>
          </li> */}

          <li>
            <NavLink to="/admindashboard/documents">
              <FaFileAlt /> Documents
            </NavLink>
          </li>

          <li>
            <NavLink to="/admindashboard/roi-calculator">
              <FaChartLine /> ROI Calculator
            </NavLink>
          </li>

          <li>
            <NavLink to="/admindashboard/bank-details">
              <FaUniversity /> Bank Details
            </NavLink>
          </li>

          <li>
            <NavLink to="/admindashboard/calendar">
              <FaCalendarAlt /> Calendar Blocking
            </NavLink>
          </li>

          <li>
            <NavLink to="/admindashboard/support">
              <FaHeadset /> Contactus / Support
            </NavLink>
          </li>
        </ul>
      </div>

      {/* 🔥 IMAGE POPUP MODAL */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <FaTimes
              className="image-modal-close"
              onClick={() => setShowImageModal(false)}
            />
            <img
              src={profile.profile_photo}
              alt="Full Profile"
              className="image-modal-img"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
