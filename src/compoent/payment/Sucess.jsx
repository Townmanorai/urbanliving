
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
      
      const propertyRes = await fetch(`https://www.townmanor.ai/api/ovika/properties/${propertyId}`);
      const propertyDataRaw = await propertyRes.json();
      const property = propertyDataRaw?.data || propertyDataRaw?.property || propertyDataRaw;
      
      const bookingRes = await fetch(`https://www.townmanor.ai/api/booking-request/${bookingId}`);
      const bookingData = await bookingRes.json();
      const booking = bookingData?.booking || bookingData?.data || bookingData;

      if (!booking || !booking.end_date) {
        alert("Booking data not found. Cannot generate invoice.");
        return;
      }

      const userLocal = JSON.parse(localStorage.getItem('user') || '{}');

      // Add Logo (Top Left and Bottom Right)
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
        
        // Top Left
        doc.addImage(img, 'PNG', 20, 10, logoWidth, logoHeight);
        
        // Bottom Right
        doc.addImage(img, 'PNG', 190 - logoWidth, 260, logoWidth, logoHeight);
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
      doc.line(20, 66, 190, 66);
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Receipt ID: OVIKA-${bookingId}-${Date.now().toString().slice(-4)}`, 20, 73);
      doc.text(`Date: ${new Date().toLocaleString()}`, 190, 73, { align: "right" });

      let y = 84;
      const x = 20;

      const sectionTitle = (title) => {
        doc.setFont(undefined, "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(title, x, y);
        y += 8;
        doc.line(x, y-5, x+40, y-5);
      };

      const row = (label, value) => {
        doc.setFont(undefined, "bold");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(label, x, y);
        doc.setFont(undefined, "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(String(value ?? "N/A"), x + 50, y);
        y += 7;
      };

      sectionTitle("Guest Details");
      row("Guest Name:", userLocal.username || booking.username || "Guest");
      row("Email:", userLocal.email || booking.email || "N/A");
      row("Phone:", booking.phone_number || "N/A");
      y += 5;

      sectionTitle("Property Details");
      row("Property:", property?.name || "N/A");
      row("Address:", property?.address || "N/A");
      y += 5;

      sectionTitle("Stay Overview");
      row("Check-in:", format(new Date(booking.start_date), 'dd MMM yyyy'));
      row("Check-out:", format(new Date(booking.end_date), 'dd MMM yyyy'));
      row("Nights:", differenceInDays(new Date(booking.end_date), new Date(booking.start_date)));
      y += 5;

      sectionTitle("Billing Information");
      const subtotal = Number(booking.total_price) || 0;
      const gst = subtotal * 0.05;
      const finalTotal = subtotal + gst;

      row("Subtotal:", `₹${subtotal.toFixed(2)}`);
      row("GST (5%):", `₹${gst.toFixed(2)}`);
      doc.setFont(undefined, "bold");
      row("Total Paid:", `₹${finalTotal.toFixed(2)}`);
      y += 10;

      doc.setFontSize(11);
      doc.setTextColor(22, 101, 52);
      doc.text("Booking Status: CONFIRMED", 105, y, { align: "center" });

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("This is an official payment confirmation for your booking with Ovika Living.", 105, 280, { align: "center" });
      doc.text("For support, please contact us at support@ovikaliving.com", 105, 285, { align: "center" });

      doc.save(`Invoice-Ovika-${bookingId}.pdf`);
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
      const propertyRes = await fetch(`https://www.townmanor.ai/api/ovika/properties/${propertyId}`)
      const propertyDataRaw = await propertyRes.json()
      const property = propertyDataRaw?.data || propertyDataRaw?.property || propertyDataRaw
      
      // Fetch booking details
      const bookingRes = await fetch(`https://www.townmanor.ai/api/booking-request/${bookingId}`)
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
        total_amount: (Number(booking.total_price || 0) * 1.05).toFixed(2),
        subtotal: Number(booking.total_price || 0).toFixed(2),
        gst: (Number(booking.total_price || 0) * 0.05).toFixed(2),
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
        const response = await fetch(`https://www.townmanor.ai/api/booking-request/${id}/status`, {
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