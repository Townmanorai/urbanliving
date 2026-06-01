import React, { useState, useEffect } from "react";
import FeedbackDrawer from "./Feedback/FeedbackDrawer";
import "./BookingDetail.css";

function BookingDetail() {
  const [showMoreId, setShowMoreId] = useState(null);
  const [feedbackBooking, setFeedbackBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD USER ================= */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch (e) {
      console.error("Failed to parse user", e);
    }
  }, []);

  /* ================= FETCH BOOKINGS ================= */
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.username) return;
      setLoading(true);
      setError("");

      try {
        const bookingsRes = await fetch("https://www.townmanor.ai/api/booking-request");
        if (!bookingsRes.ok) throw new Error(`Bookings HTTP ${bookingsRes.status}`);
        const bookingsResult = await bookingsRes.json();

        let bookingsList = [];
        if (Array.isArray(bookingsResult)) bookingsList = bookingsResult;
        else if (Array.isArray(bookingsResult?.data)) bookingsList = bookingsResult.data;

        const propsRes = await fetch("https://www.townmanor.ai/api/ovika/properties");
        if (!propsRes.ok) throw new Error(`Properties HTTP ${propsRes.status}`);
        const propsResult = await propsRes.json();
        const allProperties = Array.isArray(propsResult) ? propsResult : (propsResult?.data || []);

        const getCoverImage = (prop) => {
          if (!prop) return null;
          const idx = Number(prop.cover_photo_index) || 0;
          let photos = prop.photos;
          if (typeof photos === 'string') {
            try { photos = JSON.parse(photos); } catch { photos = photos.split(',').map(s => s.trim()); }
          }
          if (Array.isArray(photos) && photos.length > 0) {
            return photos[idx] || photos[0] || null;
          }
          return null;
        };

        const enrichedBookings = bookingsList
          .filter((b) => b.username === user.username)
          .map((b) => {
            const matchedProp = allProperties.find(p => String(p.id || p._id) === String(b.property_id));
            return {
              ...b,
              booking_status: b.status || "completed",
              property_name: matchedProp?.name || b.property_name || b.property?.name || "Unknown Property",
              property_address: matchedProp?.address || b.property_address || b.property?.address || "Address not available",
              display_price: Number(b.total_price) || Number(b.total_amount) || Number(b.amount) || 0,
              cover_image: getCoverImage(matchedProp),
            };
          })
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setBookings(enrichedBookings);
      } catch (err) {
        console.error("Error fetching or enriching bookings", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  /* ================= CANCEL BOOKING ================= */
  const cancelBooking = async (booking) => {
    const bookingId = booking.id;
    const isPaid = booking.status === 'confirmed' || booking.status === 'paid' || booking.payment_status === 'paid' || booking.booking_status === 'confirmed' || booking.booking_status === 'paid';

    const confirmMsg = isPaid
      ? "This booking is PAID. If you cancel, a refund will be processed according to our policy. Do you want to proceed with the cancellation request?"
      : "Are you sure you want to cancel this booking request?";

    const confirmCancel = window.confirm(confirmMsg);
    if (!confirmCancel) return;

    try {
      const isActuallyPaid = isPaid || booking.status === 'confirmed' || booking.status === 'paid' || booking.payment_status === 'paid';
      const url = `https://www.townmanor.ai/api/booking-request/${bookingId}/cancel`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cancel_reason: isActuallyPaid ? "Cancellation of paid booking" : "Plan changed",
        }),
      });

      const data = await res.json();

      if (res.ok || data?.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId
              ? { ...b, cancelled: 1, status: "cancelled", booking_status: "cancelled" }
              : b
          )
        );
        alert(data.message || "Booking request cancelled successfully.");
      } else {
        throw new Error(data.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      console.error("Cancel failed", e);
      alert(`Error: ${e.message || "Failed to cancel booking."}`);
    }
  };

  /* ================= jsPDF LOADER ================= */
  const ensureJsPDF = (() => {
    let loaderPromise = null;
    return () => {
      if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
      if (loaderPromise) return loaderPromise;
      loaderPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
        script.async = true;
        script.onload = () => resolve(window.jspdf.jsPDF);
        script.onerror = () => reject(new Error("Failed to load jsPDF"));
        document.head.appendChild(script);
      });
      return loaderPromise;
    };
  })();

  const formatDate = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const formatDateTime = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  /* ================= DOWNLOAD RECEIPT ================= */
  const downloadReceipt = async (b) => {
    try {
      const jsPDF = await ensureJsPDF();
      const doc = new jsPDF();

      try {
        const logoUrl = '/ovika.png';
        const img = new Image();
        img.src = logoUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        const logoRatio = img.width / img.height;
        const logoHeight = 32;
        const logoWidth = logoHeight * logoRatio;
        doc.addImage(img, 'PNG', 20, 10, logoWidth, logoHeight);
        doc.addImage(img, 'PNG', 190 - logoWidth, 255, logoWidth, logoHeight);
      } catch (e) {
        console.error("Logo load failed", e);
      }

      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text("Townmanor Technologies Pvt Ltd.", 105, 50, { align: "center" });

      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, "normal");
      doc.text("Payment Receipt", 105, 58, { align: "center" });

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 66, 195, 66);

      let y = 74;
      const x = 20;

      const row = (label, value) => {
        doc.setFont(undefined, "bold");
        doc.text(label, x, y);
        doc.setFont(undefined, "normal");
        doc.text(String(value ?? "N/A"), x + 60, y);
        y += 7;
      };

      row("Receipt ID:", `RCPT-${b.id}`);
      row("Booking ID:", b.id);
      row("Generated:", new Date().toLocaleString());
      y += 5;

      doc.setFont(undefined, "bold");
      doc.text("Customer Details", x, y);
      y += 7;
      row("Name:", b.username);
      row("Phone:", b.phone_number);
      y += 5;

      doc.setFont(undefined, "bold");
      doc.text("Property Details", x, y);
      y += 7;
      row("Property:", b.property_name);
      row("Address:", b.property_address);
      y += 5;

      doc.setFont(undefined, "bold");
      doc.text("Stay Details", x, y);
      y += 7;
      row("Check-in:", formatDate(b.start_date));
      row("Check-out:", formatDate(b.end_date));
      const nights = b.nights || 0;
      if (nights > 0) row("Nights:", nights);
      y += 5;

      doc.setFont(undefined, "bold");
      doc.text("Payment Details", x, y);
      y += 7;
      const subtotal = Number(b.display_price) || 0;
      const gst = subtotal > 0 ? (subtotal * 0.05) : 0;
      const finalTotal = subtotal + gst;

      row("Subtotal:", `Rs. ${subtotal.toFixed(2)}`);
      row("GST (5%):", `Rs. ${gst.toFixed(2)}`);
      row("Total Amount:", `Rs. ${finalTotal.toFixed(2)}`);

      const bStatus = (b.booking_status || "").toLowerCase();
      const st = (b.status || "").toLowerCase();
      const pStatus = (b.payment_status || "").toLowerCase();

      const isPaid = (
        bStatus === 'confirmed' || bStatus === 'paid' || bStatus === 'success' || bStatus === 'completed' ||
        st === 'confirmed' || st === 'paid' || st === 'success' || st === 'completed' ||
        pStatus === 'paid' || pStatus === 'success' || pStatus === 'completed' ||
        b.payment_id || b.txnid
      );

      let displayStatus = (b.booking_status || b.status || "").toUpperCase();
      if (displayStatus === "PENDING" || !displayStatus) displayStatus = "SUCCESS";
      row("Booking Status:", isPaid ? 'CONFIRMED' : displayStatus);
      row("Created:", formatDateTime(b.created_at));

      doc.setFontSize(10);
      doc.text(
        "This is a system-generated receipt by OvikaLiving.com and does not require a manual signature",
        x, 250
      );

      doc.save(`receipt-${b.id}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Failed to generate receipt");
    }
  };

  /* ================= HELPERS ================= */
  const getStatusClass = (status) => {
    if (status === "cancelled" || status === "rejected") return "cancelled";
    if (status === "pending") return "pending";
    if (status === "confirmed" || status === "paid") return "confirmed";
    return "default";
  };

  const getStatusLabel = (status) => {
    if (status === "cancelled" || status === "rejected") return "Cancelled";
    if (status === "confirmed" || status === "paid") return "Confirmed";
    if (status === "pending") return "Pending";
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
  };

  /* ================= RENDER ================= */
  return (
    <>
      <div className="bd-container">
        <h2 className="bd-heading">My Bookings</h2>

        {loading && <p className="bd-loading">Loading bookings...</p>}
        {error   && <p className="bd-error">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p className="bd-empty">No bookings found.</p>
        )}

        {!loading && !error && bookings.map((b) => (
          <div key={b.id} className="bd-card">

            {/* ── Cover Image Banner ── */}
            <div className="bd-cover" style={{ backgroundImage: b.cover_image ? `url(${b.cover_image})` : 'none' }}>
              {!b.cover_image && (
                <div className="bd-cover-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b60000" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
              )}
              <div className="bd-cover-overlay">
                <div>
                  <div className="bd-prop-name">{b.property_name}</div>
                  <div className="bd-prop-address">{b.property_address}</div>
                </div>
                <span className={`bd-status ${getStatusClass(b.booking_status)}`}>
                  {getStatusLabel(b.booking_status)}
                </span>
              </div>
            </div>

            {/* ── Info Grid ── */}
            <div className="bd-info-grid">
              <div className="bd-info-cell">
                <div className="bd-info-label">Price</div>
                <div className="bd-info-value price">
                  ₹{Number(b.display_price || 0).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="bd-info-cell">
                <div className="bd-info-label">Booking Date</div>
                <div className="bd-info-value">{formatDateTime(b.created_at)}</div>
              </div>
              <div className="bd-info-cell">
                <div className="bd-info-label">Check-in</div>
                <div className="bd-info-value">{formatDate(b.start_date)}</div>
              </div>
              <div className="bd-info-cell">
                <div className="bd-info-label">Check-out</div>
                <div className="bd-info-value">{formatDate(b.end_date)}</div>
              </div>
            </div>

            {/* ── More Info Expanded ── */}
            {showMoreId === b.id && (
              <div className="bd-more-info">
                <div className="bd-more-row">
                  <span className="bd-more-label">Username</span>
                  <span className="bd-more-value">{b.username || "—"}</span>
                </div>
                <div className="bd-more-row">
                  <span className="bd-more-label">Phone</span>
                  <span className="bd-more-value">{b.phone_number || "—"}</span>
                </div>
                <div className="bd-more-row">
                  <span className="bd-more-label">Created</span>
                  <span className="bd-more-value">{formatDateTime(b.created_at)}</span>
                </div>
                <div className="bd-more-row">
                  <span className="bd-more-label">Last Updated</span>
                  <span className="bd-more-value">{formatDateTime(b.updated_at)}</span>
                </div>
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="bd-actions">
              <button
                className="bd-btn bd-btn-info"
                onClick={() => setShowMoreId(showMoreId === b.id ? null : b.id)}
              >
                {showMoreId === b.id ? "Hide Info" : "More Info"}
              </button>

              <button
                className="bd-btn bd-btn-download"
                onClick={() => downloadReceipt(b)}
              >
                Download Receipt
              </button>

              {b.booking_status !== "cancelled" && b.booking_status !== "rejected" && (
                <button
                  className="bd-btn bd-btn-cancel"
                  onClick={() => cancelBooking(b)}
                >
                  Cancel Booking
                </button>
              )}

              <button
                className="bd-btn bd-btn-feedback"
                onClick={() => setFeedbackBooking(b)}
              >
                ★ Feedback
              </button>
            </div>
          </div>
        ))}
      </div>

      {feedbackBooking && (
        <FeedbackDrawer
          booking={feedbackBooking}
          user={user}
          onClose={() => setFeedbackBooking(null)}
        />
      )}
    </>
  );
}

export default BookingDetail;
