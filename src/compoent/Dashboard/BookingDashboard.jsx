import React, { useState, useEffect } from "react";
import { FaQuestionCircle, FaComments, FaPhone, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./BookingDashboard.css";
import { navClick, auxNavClick } from '../../utils/navClick';

const BookingDashboard = () => {
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    canceled: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) {
          setLoading(false);
          return;
        }
        const user = JSON.parse(raw);
        const userId = user.user_id || user.id;

        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await fetch("https://www.townmanor.ai/api/booking-request");
        const result = await res.json();
        
        let allData = [];
        if (Array.isArray(result)) allData = result;
        else if (Array.isArray(result?.data)) allData = result.data;

        const userBookings = allData.filter(b => b.username === user.username);
        const now = new Date();
        
        const upcoming = userBookings.filter(b => 
          (b.status === 'confirmed' || b.status === 'paid' || b.payment_status === 'paid') && 
          new Date(b.start_date) > now
        ).length;

        const completed = userBookings.filter(b => 
          (b.status === 'confirmed' || b.status === 'paid' || b.payment_status === 'paid') && 
          new Date(b.end_date) < now
        ).length;

        const canceled = userBookings.filter(b => 
          b.status === 'cancelled' || b.cancelled === 1
        ).length;

        setStats({ upcoming, completed, canceled });
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="booking-dashboard">
      <div className="dashboard-wrapper">
        
        {/* Header */}
        <div className="dash-header">
          <h1 className="dash-title">Your Bookings</h1>
          <p className="dash-desc">Track and manage all your stays in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-box upcoming-box">
            <div className="stat-icon-circle blue-circle">
              <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-title">Upcoming</p>
              <h3 className="stat-number">{loading ? "..." : stats.upcoming}</h3>
            </div>
          </div>

          <div className="stat-box completed-box">
            <div className="stat-icon-circle green-circle">
              <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-title">Completed</p>
              <h3 className="stat-number">{loading ? "..." : stats.completed}</h3>
            </div>
          </div>

          <div className="stat-box canceled-box">
            <div className="stat-icon-circle red-circle">
              <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-title">Canceled</p>
              <h3 className="stat-number">{loading ? "..." : stats.canceled}</h3>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="gallery-container">
          <div className="gallery-top">
            <h2 className="gallery-heading">Explore Your Next Stay</h2>
            <p className="gallery-text">Discover amazing properties waiting for you</p>
          </div>

          <div className="images-grid">
            <div className="image-card">
              <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400" alt="Luxury Villa" />
              <div className="image-label">
                <p>Luxury Villa</p>
              </div>
            </div>

            <div className="image-card">
              <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400" alt="Beach House" />
              <div className="image-label">
                <p>Beach House</p>
              </div>
            </div>

            <div className="image-card">
              <img src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400" alt="Mountain Cabin" />
              <div className="image-label">
                <p>Mountain Cabin</p>
              </div>
            </div>

            <div className="image-card">
              <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400" alt="City Apartment" />
              <div className="image-label">
                <p>City Apartment</p>
              </div>
            </div>

            <div className="image-card">
              <img src="https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400" alt="Countryside" />
              <div className="image-label">
                <p>Countryside</p>
              </div>
            </div>
          </div>

          <div className="action-box">
            <h3 className="action-heading">Ready for your next adventure?</h3>
            <p className="action-text">
              Browse through our curated collection of premium properties and find your perfect getaway
            </p>
            <button onClick={(e) => navClick(e, "/tmluxe", navigate)} onAuxClick={(e) => auxNavClick(e, "/tmluxe")} className="explore-btn">
              <span>Start Exploring</span>
              <FaArrowRight className="btn-arrow" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="help-container">
          <div className="help-top">
            <h2 className="help-heading">Need Help?</h2>
            <p className="help-text">We're here to assist you 24/7</p>
          </div>

          <div className="help-grid">
            <div className="help-card">
              <div className="help-icon-box">
                <FaQuestionCircle className="help-icon" />
              </div>
              <h4 className="help-name">FAQ</h4>
              <p className="help-desc">Quick answers to common questions</p>
            </div>

            <div className="help-card">
              <div className="help-icon-box">
                <FaComments className="help-icon" />
              </div>
              <h4 className="help-name">Live Chat</h4>
              <p className="help-desc">Chat with our support team</p>
            </div>

            <div className="help-card">
              <div className="help-icon-box">
                <FaPhone className="help-icon" />
              </div>
              <h4 className="help-name">Call Us</h4>
              <p className="help-desc">+91 99999 99999</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDashboard;