// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import './Sucess.css'

// function Sucess() {
//   const [bookingId, setBookingId] = useState(localStorage.getItem('bookingId') || 6)
//   const [confirmation, setConfirmation] = useState(null)
//   const [secondsLeft, setSecondsLeft] = useState(4)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const patchBookingStatus = async () => {
//       try {
//         const id = bookingId || 6
//         const response = await fetch(`https://townmanor.ai/api/booking/${id}/status`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ booking_status: 'confirmed' }),
//         })

//         if (!response.ok) {
//           throw new Error('Failed to update booking status')
//         }

//         // Show exactly the expected response shape
//         setConfirmation({ booking_status: 'confirmed' })
//       } catch (error) {
//         console.error('Update booking status error:', error)
//       }
//     }
//     patchBookingStatus()
//   }, [bookingId])

//   // Start countdown on mount and navigate after 4 seconds
//   useEffect(() => {
//     setSecondsLeft(4)
//     const intervalId = setInterval(() => {
//       setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
//     }, 1000)

//     const timeoutId = setTimeout(() => {
//       navigate('/dashboard')
//     }, 4000)

//     return () => {
//       clearInterval(intervalId)
//       clearTimeout(timeoutId)
//     }
//   }, [navigate])

//   return (
//     <>
//       <main className="success-page" role="main" aria-label="Success confirmation">
//         <section className="success-card" role="status" aria-live="polite">
//           {/* Gradient ring with white inner circle */}
//           <div className="icon-ring" aria-hidden="true">
//             <div className="icon-circle">
//               {/* Inline SVG used here for Playground preview. In your app, replace with FaCheckCircle from react-icons. */}
//               <svg
//                 className="success-icon"
//                 width="70"
//                 height="70"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1.003 14.2a1 1 0 0 1-1.414 0l-3.2-3.2a1 1 0 1 1 1.414-1.414l2.493 2.493 5.4-5.4a1 1 0 1 1 1.414 1.414l-6.1 6.107Z" />
//               </svg>
//             </div>
//           </div>

//           <h1 className="title">Success!</h1>
//           <p className="message">
//             Your Booking Successfully confirmed ... Redirecting to dashboard in {secondsLeft}s
//           </p>

//           {confirmation && (
//             <div className="confirmation">
//               <pre>{JSON.stringify(confirmation)}</pre>
//             </div>
//           )}

//           <div className="actions">
//             {/* <button className="btn btn-primary" aria-label="Continue">
//               Continue
//             </button> */}
//             <button className="btn btn-secondary" aria-label="Go back to home" onClick={()=>navigate('/')}>
//               Back to Home
//             </button>
//           </div>
//         </section>
//       </main>
//     </>
//   )
// }

// export default Sucess


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
      const booking = bookingData.booking;
      
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
    emailjs.init("Jv4HT7o1ji_gU5PJ0") // Replace with your actual EmailJS public key
  }, [])

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
      const booking = bookingData.booking
      
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
    const patchBookingStatus = async () => {
      const id = localStorage.getItem('bookingId') || bookingId;
      console.log('Patching status for booking ID:', id);
      
      if (!id || id === '6') {
        console.warn('Booking ID is missing or default (6). This might be incorrect.');
      }

      try {
        const response = await fetch(`https://www.townmanor.ai/api/booking-request/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            booking_status: 'confirmed',
            payment_status: 'paid'
          }),
        })

        if (!response.ok) {
          console.error('Failed to update booking status:', response.status);
          // throw new Error('Failed to update booking status')
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

  // Start countdown on mount and navigate after 4 seconds
  useEffect(() => {
    setSecondsLeft(4)
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    const timeoutId = setTimeout(() => {
      navigate('/dashboard')
    }, 4000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [navigate])

  return (
    <>
      <Helmet>
        <title>Booking Confirmed! | OvikaLiving – Your Stay is Booked</title>
        <meta name="description" content="Your booking with OvikaLiving is confirmed! Get ready for your stay in Noida or Greater Noida. Check your email for booking details." />
        <meta name="keywords" content="booking confirmed ovikaliving, ovika booking success, pg booking confirmed noida, stay booked noida, बुकिंग कन्फर्म नोएडा, ओविका बुकिंग सफल, पीजी बुकिंग कन्फर्म" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="success-page" role="main" aria-label="Success confirmation">
        <section className="success-card" role="status" aria-live="polite">
          {/* Gradient ring with white inner circle */}
          <div className="icon-ring" aria-hidden="true">
            <div className="icon-circle">
              <svg
                className="success-icon"
                width="70"
                height="70"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1.003 14.2a1 1 0 0 1-1.414 0l-3.2-3.2a1 1 0 1 1 1.414-1.414l2.493 2.493 5.4-5.4a1 1 0 1 1 1.414 1.414l-6.1 6.107Z" />
              </svg>
            </div>
          </div>

          <h1 className="title">Payment Completed!</h1>
          <p className="message">
            Your booking has been successfully confirmed. Thank you for choosing Ovika!
          </p>
          <div style={{ margin: '1rem 0', padding: '10px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', color: '#166534', fontWeight: 'bold' }}>
            ✅ Booking Confirmed & Payment Verified
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Redirecting to your dashboard in {secondsLeft} seconds...
          </p>
          
          {emailSent && (
            <p className="email-confirmation" style={{ color: '#0ea5e9', fontSize: '0.9rem', fontWeight: '500' }}>
              📧 A confirmation email has been sent to your registered email address.
            </p>
          )}

          <div className="actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button 
              className="btn btn-primary" 
              onClick={downloadInvoice}
              style={{ 
                background: 'linear-gradient(135deg, #b62305 0%, #8b0000 100%)', 
                color: '#fff', 
                border: 'none', 
                padding: '14px 28px', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(182, 35, 5, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(182, 35, 5, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(182, 35, 5, 0.3)';
              }}
            >
              📥 Download Invoice
            </button>
            <button 
                className="btn btn-secondary" 
                aria-label="Go back to home" 
                onClick={()=>navigate('/')}
                style={{
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #e5e7eb',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
            >
              Back to Home
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default Sucess