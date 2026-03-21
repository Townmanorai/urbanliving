
// import React, { useState, useEffect } from 'react';
// import './WelcomePopUp.css';

// export default function WelcomePopup() {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const seen = sessionStorage.getItem('ovika_popup_seen');
//     if (!seen) {
//       setVisible(true);
//     }
//   }, []);

//   const handleSelect = (type) => {
//     sessionStorage.setItem('ovika_rental_type', type);
//     sessionStorage.setItem('ovika_popup_seen', 'true');
//     setVisible(false);
//   };

//   const handleClose = () => {
//     if (!sessionStorage.getItem('ovika_rental_type')) {
//       sessionStorage.setItem('ovika_rental_type', 'short');
//     }
//     sessionStorage.setItem('ovika_popup_seen', 'true');
//     setVisible(false);
//   };

//   if (!visible) return null;

//   return (
//     <div className="ovika-popup-overlay" onClick={handleClose}>
//       <div className="ovika-popup-card" onClick={(e) => e.stopPropagation()}>
//         {/* Close Button */}
//         <button className="ovika-popup-close" onClick={handleClose} aria-label="Close">
//           &#10005;
//         </button>

//         {/* Header */}
//         <div className="ovika-popup-header">
//           <span className="ovika-popup-logo">OvikaLiving.com</span>
//           <p className="ovika-popup-tagline">What are you looking for today?</p>
//         </div>

//         {/* Two Section Cards */}
//         <div className="ovika-popup-sections">
//           {/* Short Term */}
//           <div className="ovika-popup-section ovika-section-short" style={{ cursor: 'pointer' }} onClick={() => handleSelect('short')}>
//             <div className="ovika-section-icon">🏨</div>
//             <h3 className="ovika-section-title">Short Term Rental</h3>
//             <p className="ovika-section-desc">
//               Nightly stays in verified PGs, apartments, houses & farmhouses, Villas, Hotel Rooms, Studios, Banglow, HomeStays and Suites. Book for days or weeks.
//             </p>
//             <button className="ovika-section-btn ovika-btn-primary">Explore Now →</button>
//           </div>

//           {/* Divider */}
//           <div className="ovika-popup-divider">
//             <span>or</span>
//           </div>

//           {/* Long Term */}
//           <div className="ovika-popup-section ovika-section-long" style={{ cursor: 'pointer' }} onClick={() => handleSelect('long')}>
//             <div className="ovika-section-icon">🏠</div>
//             <h3 className="ovika-section-title">Long Term Rental</h3>
//             <p className="ovika-section-desc">
//               Find your next home — PG, apartments, houses, Banglow, Villas, Studios   & farmhouses. Comfortable stays for months & beyond.
//             </p>
//             <button className="ovika-section-btn ovika-btn-outline">Explore Now →</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// WelcomePopup.jsx
import React, { useState, useEffect } from 'react';
import './WelcomePopUp.css';

export default function WelcomePopup({
  heroBgImgUrl = '/modelbackground.png', // ← poore card ka background image
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('ovika_popup_seen');
    if (!seen) setVisible(true);
  }, []);

  const handleSelect = (type) => {
    sessionStorage.setItem('ovika_rental_type', type);
    sessionStorage.setItem('ovika_popup_seen', 'true');
    setVisible(false);
  };

  const handleClose = () => {
    if (!sessionStorage.getItem('ovika_rental_type')) {
      sessionStorage.setItem('ovika_rental_type', 'short');
    }
    sessionStorage.setItem('ovika_popup_seen', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  const badges = ['Verified Properties', 'Trusted Hosts', 'Flexible Stay Options', 'Secure Booking'];

  return (
    <div className="ovika-popup-overlay" onClick={handleClose}>
      {/* ✅ backgroundImage poore card pe */}
      <div
        className="ovika-popup-card"
        style={{ backgroundImage: `url(${heroBgImgUrl})` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left spacer — image left pe dikh sake */}
        <div className="ovika-popup-left" />

        {/* Close Button */}
        <button className="ovika-popup-close" onClick={handleClose} aria-label="Close">
          &#10005;
        </button>

        {/* Right: semi-transparent white panel */}
        <div className="ovika-popup-right">

          <div className="ovika-popup-header">
            <span className="ovika-popup-logo">OvikaLiving.com</span>
            <p className="ovika-popup-tagline">What are you looking for today?</p>
          </div>

          <div className="ovika-popup-sections">
            <div className="ovika-popup-section ovika-section-short" onClick={() => handleSelect('short')}>
              <div className="ovika-section-icon">🏨</div>
              <h3 className="ovika-section-title">Short Term Rental</h3>
              <p className="ovika-section-desc">
                Nightly stays in verified PGs, apartments, Villas, Hotel Rooms,
                Studios, Banglow, HomeStays and Suites....
              </p>
              <button className="ovika-section-btn ovika-btn-primary">Explore Now →</button>
            </div>

            <div className="ovika-cards-or">or</div>

            <div className="ovika-popup-section ovika-section-long" onClick={() => handleSelect('long')}>
              <div className="ovika-section-icon">🏠</div>
              <h3 className="ovika-section-title">Long Term Rental</h3>
              <p className="ovika-section-desc">
                Find your next home — PG, apartments, houses, Banglow,
                Villas, Studios &amp; farmhouses.
              </p>
              <button className="ovika-section-btn ovika-btn-outline">Explore Now →</button>
            </div>
          </div>

          <div className="ovika-or-row">
            <span className="ovika-or-line" />
            or
            <span className="ovika-or-line" />
          </div>

          <div className="ovika-trust-badges">
            {badges.map((b) => (
              <span className="ovika-badge" key={b}>
                <span className="ovika-badge-icon">✔</span>
                {b}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}