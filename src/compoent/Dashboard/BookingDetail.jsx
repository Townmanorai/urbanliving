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
        const bookingsRes = await fetch("https://www.domiva.in/api/booking-request");
        if (!bookingsRes.ok) throw new Error(`Bookings HTTP ${bookingsRes.status}`);
        const bookingsResult = await bookingsRes.json();

        let bookingsList = [];
        if (Array.isArray(bookingsResult)) bookingsList = bookingsResult;
        else if (Array.isArray(bookingsResult?.data)) bookingsList = bookingsResult.data;

        const propsRes = await fetch("https://www.domiva.in/api/ovika/properties");
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
      const url = `https://www.domiva.in/api/booking-request/${bookingId}/cancel`;

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

      // ── Brand palette (matches the site's gold theme) ──
      const GOLD = [194, 119, 43];        // #c2772b
      const GOLD_LIGHT = [253, 247, 238]; // #fdf7ee
      const INK = [26, 18, 9];            // #1a1209
      const GRAY = [107, 85, 64];         // #6b5540
      const GREEN = [22, 101, 52];        // #166534
      const GREEN_BG = [240, 253, 244];   // #f0fdf4
      const BOX_BG = [250, 248, 244];
      const BOX_LINE = [240, 232, 218];
      const pageW = 210;
      const marginX = 18;
      const contentW = pageW - marginX * 2;

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
      const statusLabel = isPaid ? 'CONFIRMED' : displayStatus;

      // ── Header band with logo + brand ──
      doc.setFillColor(...GOLD_LIGHT);
      doc.rect(0, 0, pageW, 34, 'F');

      try {
        const logoUrl = '/ovikaliving_logo_clean.png';
        const img = new Image();
        img.src = logoUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        const logoHeight = 14;
        const logoWidth = logoHeight * (img.width / img.height);
        doc.addImage(img, 'PNG', marginX, 10, logoWidth, logoHeight);
      } catch (e) {
        console.error("Logo load failed", e);
        doc.setFontSize(16);
        doc.setTextColor(...GOLD);
        doc.setFont(undefined, "bold");
        doc.text("OvikaLiving", marginX, 20);
      }

      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.setFont(undefined, "normal");
      doc.text("A brand of Townmanor Technologies Private Limited", pageW - marginX, 15, { align: "right" });
      doc.setFontSize(8.5);
      doc.text("www.ovikaliving.com", pageW - marginX, 20, { align: "right" });

      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.6);
      doc.line(0, 34, pageW, 34);

      // ── Title row ──
      let y = 46;
      doc.setFontSize(18);
      doc.setTextColor(...INK);
      doc.setFont(undefined, "bold");
      doc.text("Booking Payment Receipt", marginX, y);

      doc.setFillColor(...GREEN_BG);
      doc.roundedRect(pageW - marginX - 36, y - 6, 36, 8, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...GREEN);
      doc.setFont(undefined, "bold");
      doc.text(statusLabel, pageW - marginX - 18, y - 0.5, { align: "center" });

      y += 8;
      doc.setFontSize(9.5);
      doc.setTextColor(...GRAY);
      doc.setFont(undefined, "normal");
      doc.text(`Receipt No: RCPT-${b.id}`, marginX, y);
      doc.text(`Issued: ${new Date().toLocaleString('en-IN')}`, pageW - marginX, y, { align: "right" });

      y += 12;

      // ── Section helpers (single column, stacked) ──
      const sectionTitle = (title) => {
        doc.setFillColor(...GOLD);
        doc.rect(marginX, y - 4, 3, 3.5, 'F');
        doc.setFont(undefined, "bold");
        doc.setFontSize(11);
        doc.setTextColor(...INK);
        doc.text(title.toUpperCase(), marginX + 6, y);
        y += 7;
      };

      const row = (label, value) => {
        doc.setFont(undefined, "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...GRAY);
        doc.text(label, marginX + 4, y);
        doc.setFont(undefined, "bold");
        doc.setTextColor(...INK);
        doc.text(String(value ?? "N/A"), marginX + 50, y);
        y += 6.5;
      };

      const sectionBox = (innerHeight, renderInner) => {
        const boxTop = y;
        doc.setFillColor(...BOX_BG);
        doc.setDrawColor(...BOX_LINE);
        doc.roundedRect(marginX, boxTop - 2, contentW, innerHeight, 2, 2, 'FD');
        y += 6;
        renderInner();
        y = boxTop + innerHeight + 6;
      };

      // Guest Details
      sectionBox(25, () => {
        sectionTitle("Guest Details");
        row("Name", b.username || "Guest");
        row("Phone", b.phone_number || "N/A");
      });

      // Property Details
      sectionBox(25, () => {
        sectionTitle("Property Details");
        row("Property", b.property_name || "N/A");
        row("Address", b.property_address || "N/A");
      });

      // Stay Overview
      const nights = b.nights || 0;
      sectionBox(nights > 0 ? 38 : 32, () => {
        sectionTitle("Stay Overview");
        row("Booking ID", b.id);
        row("Check-in", formatDate(b.start_date));
        row("Check-out", formatDate(b.end_date));
        if (nights > 0) row("Nights", nights);
      });

      // Billing Information
      // b.display_price (= total_price) is already GST-inclusive — use the stored
      // subtotal/gst_amount directly instead of re-deriving from it, otherwise GST
      // gets applied twice (once at booking creation, once again here).
      const finalTotal = Number(b.display_price) || 0;
      const subtotal = b.subtotal != null ? Number(b.subtotal) : (finalTotal > 0 ? finalTotal / 1.05 : 0);
      const gst = b.gst_amount != null ? Number(b.gst_amount) : (finalTotal - subtotal);

      sectionBox(40, () => {
        sectionTitle("Billing Information");
        row("Base fare", `Rs. ${subtotal.toFixed(2)}`);
        row("Taxes & fees (5% GST)", `Rs. ${gst.toFixed(2)}`);

        doc.setDrawColor(...GOLD);
        doc.setLineWidth(0.3);
        doc.line(marginX + 4, y - 2, marginX + contentW - 4, y - 2);
        y += 4;

        doc.setFont(undefined, "bold");
        doc.setFontSize(12.5);
        doc.setTextColor(...GOLD);
        doc.text("Total Paid", marginX + 4, y);
        doc.text(`Rs. ${finalTotal.toFixed(2)}`, marginX + contentW - 4, y, { align: "right" });
      });

      // ── Footer ──
      doc.setDrawColor(230, 220, 205);
      doc.setLineWidth(0.3);
      doc.line(marginX, 262, pageW - marginX, 262);

      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.setFont(undefined, "bold");
      doc.text("Townmanor Technologies Private Limited", pageW / 2, 269, { align: "center" });

      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.setFont(undefined, "normal");
      doc.text("Brand: OvikaLiving  |  CIN: U68200UP2023PTC193656  |  GSTIN: 09AAKCT6155G1ZZ", pageW / 2, 274, { align: "center" });
      doc.text("Registered Office: ST-304, Eldeco Studio, Sector-93A, Noida, Uttar Pradesh - 201304, India", pageW / 2, 279, { align: "center" });
      doc.text("Support: enquiry@ovikaliving.com  |  +91 93193 92227  |  www.ovikaliving.com", pageW / 2, 284, { align: "center" });

      doc.setFontSize(7.5);
      doc.setTextColor(170, 160, 145);
      doc.text("This is a system-generated receipt and does not require a physical signature.", pageW / 2, 291, { align: "center" });

      doc.save(`OvikaLiving-Receipt-${b.id}.pdf`);
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
