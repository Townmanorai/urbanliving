import React, { useState, useEffect } from "react";
import { FaHistory, FaCalendarAlt, FaBuilding, FaWallet, FaInfoCircle } from "react-icons/fa";
import "./CancellationHistory.css";

const CancellationHistory = () => {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error("User parse error", e);
    }
  }, []);

  useEffect(() => {
    const fetchCancellations = async () => {
      if (!user?.username) return;
      setLoading(true);
      try {
        const res = await fetch(`https://www.domiva.in/api/booking-request`);
        const result = await res.json();
        
        let allData = [];
        if (Array.isArray(result)) allData = result;
        else if (Array.isArray(result?.data)) allData = result.data;

        // Filter by user's username and cancelled status
        const cancelled = allData.filter(b => 
          b.username === user.username && 
          (b.status === 'cancelled' || b.cancelled === 1)
        ).sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
        
        setCancellations(cancelled);
      } catch (err) {
        console.error("Error fetching cancellations", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCancellations();
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="cancellation-loading">
        <div className="spinner"></div>
        <p>Loading your cancellation history...</p>
      </div>
    );
  }

  return (
    <div className="cancellation-history-container">
      <div className="cancellation-header">
        <div className="header-icon-box">
          <FaHistory className="header-icon" />
        </div>
        <div className="header-text">
          <h2 className="header-title">Cancellation Records</h2>
          <p className="header-subtitle">Detailed history of your cancelled bookings and payments</p>
        </div>
      </div>

      {cancellations.length === 0 ? (
        <div className="empty-cancellations">
          <FaInfoCircle size={48} color="#cbd5e1" />
          <h3>No Cancellation Records</h3>
          <p>You don't have any cancelled bookings yet.</p>
        </div>
      ) : (
        <div className="records-grid">
          {cancellations.map((item) => (
            <div key={item.id} className="record-card">
              <div className="record-status-strip">CANCELLED</div>
              
              <div className="record-content">
                <div className="record-property">
                  <FaBuilding className="record-icon" />
                  <div>
                    <h4 className="property-name">{item.property_name || `Property #${item.property_id}`}</h4>
                    <p className="property-address">{item.property_address || "Address not available"}</p>
                  </div>
                </div>

                <div className="record-info-grid">
                  <div className="info-item">
                    <FaWallet className="info-icon income" />
                    <div>
                      <span className="info-label">Original Payment</span>
                      <span className="info-value price">{formatCurrency(item.total_price || item.price || 0)}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaCalendarAlt className="info-icon" />
                    <div>
                      <span className="info-label">Cancellation Date</span>
                      <span className="info-value">{formatDate(item.updated_at || item.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="stay-dates">
                  <span className="date-tag">
                    {formatDate(item.start_date)} — {formatDate(item.end_date)}
                  </span>
                </div>

                <div className="record-footer">
                  <span className="booking-id">ID: BK-{item.id}</span>
                  <span className="nights-count">{item.nights || 0} Nights</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CancellationHistory;
