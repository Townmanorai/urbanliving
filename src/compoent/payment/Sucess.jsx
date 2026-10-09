
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { format, differenceInDays } from 'date-fns'
import './Sucess.css'

function Sucess() {
  const [bookingId, setBookingId] = useState(localStorage.getItem('bookingId'))
  const [confirmation, setConfirmation] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(10)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()

  // jsPDF LOADER
  const ensureJsPDF = (() => {
    let loaderPromise = null;
    return () => {
      if (window.jspdf?.jsPDF)
        return Promise.resolve(window.jspdf.jsPDF);

      if (loaderPromise) return loaderPromise;

      loaderPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
        script.async = true;
        script.onload = () => resolve(window.jspdf.jsPDF);
        script.onerror = () =>
          reject(new Error("Failed to load jsPDF"));
        document.head.appendChild(script);
      });

      return loaderPromise;
    };
  })();

  const downloadInvoice = async () => {
    try {
      const jsPDF = await ensureJsPDF();
      const doc = new jsPDF();
      
      const bookingId = localStorage.getItem('bookingId');
      const propertyId = localStorage.getItem('property_id');
      
      const propertyRes = await fetch(`https://www.domiva.in/api/ovika/properties/${propertyId}`);
      const propertyDataRaw = await propertyRes.json();
      const property = propertyDataRaw?.data || propertyDataRaw?.property || propertyDataRaw;
      
      const bookingRes = await fetch(`https://www.domiva.in/api/booking-request/${bookingId}`);
      const bookingData = await bookingRes.json();
      const booking = bookingData?.booking || bookingData?.data || bookingData;

      if (!booking || !booking.end_date) {
        alert("Booking data not found. Cannot generate invoice.");
        return;
      }

      const userLocal = JSON.parse(localStorage.getItem('user') || '{}');

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

      // Status pill
      doc.setFillColor(...GREEN_BG);
      doc.roundedRect(pageW - marginX - 34, y - 6, 34, 8, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...GREEN);
      doc.setFont(undefined, "bold");
      doc.text("CONFIRMED", pageW - marginX - 17, y - 0.5, { align: "center" });

      y += 8;
      const receiptId = `OVIKA-${bookingId}-${Date.now().toString().slice(-4)}`;
      doc.setFontSize(9.5);
      doc.setTextColor(...GRAY);
      doc.setFont(undefined, "normal");
      doc.text(`Receipt No: ${receiptId}`, marginX, y);
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
      sectionBox(32, () => {
        sectionTitle("Guest Details");
        row("Name", userLocal.username || booking.username || "Guest");
        row("Email", userLocal.email || booking.email || "N/A");
        row("Phone", booking.phone_number || "N/A");
      });

      // Property Details
      sectionBox(32, () => {
        sectionTitle("Property Details");
        row("Property", property?.property_name || property?.name || "N/A");
        row("Category", property?.property_category || "N/A");
        row("City", property?.city || property?.address || "N/A");
      });

      // Stay Overview
      const nights = differenceInDays(new Date(booking.end_date), new Date(booking.start_date));
      sectionBox(38, () => {
        sectionTitle("Stay Overview");
        row("Booking ID", bookingId || "N/A");
        row("Check-in", format(new Date(booking.start_date), 'dd MMM yyyy'));
        row("Check-out", format(new Date(booking.end_date), 'dd MMM yyyy'));
        row("Nights", String(nights));
      });

      // Billing Information
      // booking.total_price is already GST-inclusive (saved that way at booking creation) —
      // use the stored subtotal/gst_amount directly instead of re-deriving from total_price,
      // otherwise GST gets applied twice.
      const finalTotal = Number(booking.total_price) || 0;
      const subtotal = booking.subtotal != null ? Number(booking.subtotal) : finalTotal / 1.05;
      const gst = booking.gst_amount != null ? Number(booking.gst_amount) : finalTotal - subtotal;

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

      doc.save(`OvikaLiving-Receipt-${bookingId}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice");
    }
  };

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("Jv4HT7o1ji_gU5PJ0")
  }, [])

  // ── LEADS PURCHASE INTERCEPT ──
  // PayU backend always redirects to /success, so we catch leads payments here
  // and forward to /leads-success where the invoice is generated.
  useEffect(() => {
    if (localStorage.getItem("pending_leads_purchase")) {
      navigate("/leads-success");
    }
  }, [navigate]);

  // Send booking confirmation email
  const sendBookingConfirmationEmail = async () => {
    try {
      // Get booking data
      const bookingId = localStorage.getItem('bookingId')
      const propertyId = localStorage.getItem('property_id')
      
      // Fetch property details (use Ovika API)
      const propertyRes = await fetch(`https://www.domiva.in/api/ovika/properties/${propertyId}`)
      const propertyDataRaw = await propertyRes.json()
      const property = propertyDataRaw?.data || propertyDataRaw?.property || propertyDataRaw
      
      // Fetch booking details
      const bookingRes = await fetch(`https://www.domiva.in/api/booking-request/${bookingId}`)
      const bookingData = await bookingRes.json()
      const booking = bookingData?.booking || bookingData?.data || bookingData

      if (!booking || !booking.end_date) {
        console.error('Booking data unavailable or missing end_date')
        return false
      }

      // Get user data from localStorage
      const userLocal = JSON.parse(localStorage.getItem('user') || '{}')

      // Calculate nights
      const nights = differenceInDays(
        new Date(booking.end_date),
        new Date(booking.start_date)
      )
      
      // Prepare email parameters
      const emailParams = {
        to_email: userLocal.email || booking.email || '',
        to_name: userLocal.username || booking.username || 'Guest',
        property_name: property?.property_name || property?.name || 'Property',
        check_in_date: format(new Date(booking.start_date), 'dd MMM yyyy'),
        check_out_date: format(new Date(booking.end_date), 'dd MMM yyyy'),
        // booking.total_price is already GST-inclusive — don't re-apply 5% on top of it.
        total_amount: Number(booking.total_price || 0).toFixed(2),
        subtotal: (booking.subtotal != null ? Number(booking.subtotal) : Number(booking.total_price || 0) / 1.05).toFixed(2),
        gst: (booking.gst_amount != null ? Number(booking.gst_amount) : Number(booking.total_price || 0) - Number(booking.total_price || 0) / 1.05).toFixed(2),
        booking_id: bookingId || 'N/A',
        phone_number: booking.phone_number || '',
        property_address: property?.address || '',
        nights: nights,
      }

      // Send email using EmailJS
      const response = await emailjs.send(
        'service_ggypt4s',      // Replace with your Service ID
        'template_irruvtk',     // Replace with your Template ID
        emailParams
      )

      console.log('Email sent successfully:', response)
      setEmailSent(true)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  useEffect(() => {
    if (localStorage.getItem("pending_leads_purchase")) return;
    const patchBookingStatus = async () => {
      const id = localStorage.getItem('bookingId') || bookingId;
      console.log('Patching status for booking ID:', id);

      if (!id || id === '6') {
        console.warn('Booking ID is missing or default (6). This might be incorrect.');
      }

      const savedAmount   = localStorage.getItem('paymentAmount');
      const savedSubtotal = localStorage.getItem('paymentSubtotal');
      const savedGst      = localStorage.getItem('paymentGst');
      const savedDiscount = localStorage.getItem('paymentDiscount');

      const patchBody = {
        booking_status: 'confirmed',
        payment_status: 'paid',
        ...(savedAmount   && Number(savedAmount)   > 0 ? { total_price:      Number(savedAmount)   } : {}),
        ...(savedSubtotal && Number(savedSubtotal) > 0 ? { subtotal:         Number(savedSubtotal) } : {}),
        ...(savedGst      && Number(savedGst)      > 0 ? { gst_amount:       Number(savedGst)      } : {}),
        ...(savedDiscount && Number(savedDiscount) > 0 ? { discount_amount:  Number(savedDiscount) } : {}),
      };

      try {
        const response = await fetch(`https://www.domiva.in/api/booking-request/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patchBody),
        })

        localStorage.removeItem('paymentAmount');
        localStorage.removeItem('paymentSubtotal');
        localStorage.removeItem('paymentGst');
        localStorage.removeItem('paymentDiscount');
        sessionStorage.removeItem('ovika_pending_booking');

        if (!response.ok) {
          console.error('Failed to update booking status:', response.status);
        } else {
          console.log('Booking status updated successfully to confirmed');
          setConfirmation({ booking_status: 'confirmed' });
        }

        // Send confirmation email after booking is confirmed
        await sendBookingConfirmationEmail();
      } catch (error) {
        console.error('Update booking status error:', error);
      }
    }
    
    if (bookingId) {
      patchBookingStatus();
    }
  }, [bookingId]);

  // Auto-redirect removed — user chooses via popup buttons

  return (
    <>
      <Helmet>
        <title>Booking Confirmed! | OvikaLiving</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Full-screen overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}>
        {/* Popup card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px 36px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          animation: 'fadeInUp 0.35s ease'
        }}>
          {/* Success icon */}
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1.003 14.2a1 1 0 0 1-1.414 0l-3.2-3.2a1 1 0 1 1 1.414-1.414l2.493 2.493 5.4-5.4a1 1 0 1 1 1.414 1.414l-6.1 6.107Z"/>
            </svg>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
            Payment Successful!
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '8px' }}>
            Your booking is confirmed. Thank you for choosing Ovika Living!
          </p>

          {emailSent && (
            <p style={{ fontSize: '0.82rem', color: '#0ea5e9', marginBottom: '16px' }}>
              📧 Confirmation email sent to your registered address.
            </p>
          )}

          <div style={{ height: '1px', background: '#f0f0f0', margin: '20px 0' }} />

          {/* Two action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={downloadInvoice}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #b62305, #8b0000)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(139,0,0,0.3)'
              }}
            >
              📥 Download Receipt
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                padding: '14px',
                background: '#f8fafc',
                color: '#333',
                border: '1.5px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🏠 Go to Home
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

export default Sucess