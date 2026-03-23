
// import React, { useState } from "react";
// import { ArrowRight, X } from "lucide-react"; // ✅ import arrow icon and X for popup
// import "./Home6.css";

// function Home6() {
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phone_number: "",
//     message: ""
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await fetch("https://www.townmanor.ai/api/formlead/leads", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           phone_number: formData.phone_number,
//           purpose: formData.message,
//           source: "Home6 Contact Form"
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Form submitted successfully:", data);
        
//         // Show success popup
//         setShowSuccessPopup(true);
        
//         // Reset form data
//         setFormData({ name: "", phone_number: "", message: "" });
//       } else {
//         throw new Error("Failed to submit form");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Failed to submit form. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const closeSuccessPopup = () => {
//     setShowSuccessPopup(false);
//   };

//   return (
//     <div className="ovika-connect-main">
//       {/* Success Popup Modal */}
//       {showSuccessPopup && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.7)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 10000,
//             padding: "20px"
//           }}
//           onClick={closeSuccessPopup}
//         >
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "15px",
//               padding: "40px",
//               width: "100%",
//               maxWidth: "400px",
//               textAlign: "center",
//               boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
//               position: "relative"
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closeSuccessPopup}
//               style={{
//                 position: "absolute",
//                 top: "15px",
//                 right: "15px",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 padding: "5px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#666",
//                 transition: "color 0.2s"
//               }}
//               onMouseOver={(e) => e.currentTarget.style.color = "#000"}
//               onMouseOut={(e) => e.currentTarget.style.color = "#666"}
//             >
//               <X size={24} />
//             </button>

//             <div
//               style={{
//                 width: "60px",
//                 height: "60px",
//                 borderRadius: "50%",
//                 backgroundColor: "#4CAF50",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 20px"
//               }}
//             >
//               <svg
//                 width="30"
//                 height="30"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#fff"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <polyline points="20 6 9 17 4 12"></polyline>
//               </svg>
//             </div>
//             <h2
//               style={{
//                 fontFamily: "Poppins, sans-serif",
//                 fontSize: "24px",
//                 fontWeight: "600",
//                 marginBottom: "10px",
//                 color: "#333"
//               }}
//             >
//               Message Submitted Successfully!
//             </h2>
//             <p
//               style={{
//                 fontFamily: "Poppins, sans-serif",
//                 fontSize: "14px",
//                 color: "#666",
//                 marginBottom: "25px"
//               }}
//             >
//               Thank you for reaching out. We'll get back to you soon.
//             </p>
//             <button
//               onClick={closeSuccessPopup}
//               style={{
//                 padding: "12px 40px",
//                 background: "linear-gradient(90deg, #b62305 0%, #000000 100%)",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontSize: "16px",
//                 fontWeight: "600",
//                 fontFamily: "Poppins, sans-serif",
//                 cursor: "pointer",
//                 transition: "transform 0.2s, box-shadow 0.2s"
//               }}
//               onMouseOver={(e) => {
//                 e.currentTarget.style.transform = "translateY(-2px)";
//                 e.currentTarget.style.boxShadow = "0 4px 12px rgba(182, 35, 5, 0.3)";
//               }}
//               onMouseOut={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)";
//                 e.currentTarget.style.boxShadow = "none";
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="ovika-connect-content">
//         <div className="ovika-connect-left">
//           <div className="ovika-property-graphic"></div>
//           <h1 className="ovika-property-heading">
//             Turn your property <br />
//             into a smart income <br />
//             source
//           </h1>
//           <p className="ovika-property-desc">
//             Join hundreds of property owners who are earning with us — we handle
//             everything from bookings to guest verification, onboarding, and payouts - we handle it all.
//           </p>

//           {/* ✅ Property Listing Button with Arrow */}
//           <a style={{textDecoration:"none"}} href="/list-property" target="_blank">
//             <button className="ovika-left-btn-property">
//               Host your property <ArrowRight className="ovika-left-btn-arrow" />
//             </button>
//           </a>
//         </div>

//         <div className="ovika-connect-form-wrapper">
//           <form className="ovika-connect-form" onSubmit={handleSubmit}>
//             <h2 className="form-heading-ovika-homepage">Contact Us</h2>
            
//             <input
//               type="text"
//               name="name"
//               className="ovika-input"
//               placeholder="Your Name"
//               value={formData.name}
//               onChange={handleInputChange}
//               required
//               disabled={isSubmitting}
//             />
            
//             <input
//               type="tel"
//               name="phone_number"
//               className="ovika-input"
//               placeholder="Mobile Number"
//               value={formData.phone_number}
//               onChange={handleInputChange}
//               required
//               pattern="[0-9]{10}"
//               maxLength="10"
//               disabled={isSubmitting}
//             />
            
//             <input
//               type="text"
//               name="message"
//               className="ovika-input"
//               placeholder="Your Message"
//               value={formData.message}
//               onChange={handleInputChange}
//               required
//               disabled={isSubmitting}
//             />
            
//             <button 
//               type="submit"
//               className="ovika-submit-btn-homepage"
//               disabled={isSubmitting}
//               style={{
//                 opacity: isSubmitting ? 0.7 : 1,
//                 cursor: isSubmitting ? "not-allowed" : "pointer"
//               }}
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home6;


import React, { useState } from "react";
import { X } from "lucide-react";
import "./Home6.css";

function Home6() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    message: "",
  });

  /** Mobile hero image — same asset as section background (`public/home6mobile.png`). */
  const MOBILE_MODEL_SRC = "/home6mobile.png";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://www.townmanor.ai/api/formlead/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          purpose: formData.message,
          source: "Home6 Contact Form"
        }),
      });
      if (response.ok) {
        setShowSuccessPopup(true);
        setFormData({ name: "", phone_number: "", email: "", message: "" });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessPopup = () => setShowSuccessPopup(false);

  return (
    <div className="ovika-connect-main">

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 10000, padding: "20px"
          }}
          onClick={closeSuccessPopup}
        >
          <div
            style={{
              backgroundColor: "#fff", borderRadius: "15px", padding: "40px",
              width: "100%", maxWidth: "400px", textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)", position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeSuccessPopup} style={{
              position: "absolute", top: "15px", right: "15px", background: "none",
              border: "none", cursor: "pointer", color: "#666"
            }}>
              <X size={24} />
            </button>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#4CAF50",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px"
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "22px", fontWeight: "600", marginBottom: "10px", color: "#333" }}>
              Message Submitted Successfully!
            </h2>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "#666", marginBottom: "25px" }}>
              Thank you for reaching out. We'll get back to you soon.
            </p>
            <button onClick={closeSuccessPopup} style={{
              padding: "12px 40px", background: "linear-gradient(90deg, #b62305 0%, #000 100%)",
              color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px",
              fontWeight: "600", fontFamily: "Poppins, sans-serif", cursor: "pointer"
            }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Section */}
      <div className="ovika-connect-content">

        {/* LEFT: Heading + Description + Form */}
        <div className="ovika-connect-left">
          <div className="ovika-connect-intro">
            <h1 className="ovika-property-heading">
              TURN YOUR PROPERTY<br />
              INTO A SMART<br />
              INCOME SOURCE
            </h1>
            <p className="ovika-property-desc">
              Join hundreds of property owners earning passive income with our all-inclusive management services.
            </p>
          </div>

          {/* Mobile: image + form stacked; form overlays on hand (CSS). Desktop: display:contents */}
          <div className="ovika-connect-mobile-stack">
            <div className="ovika-connect-mobile-hero" aria-hidden="true">
              <img
                src={MOBILE_MODEL_SRC}
                alt=""
                className="ovika-mobile-model-img"
              />
            </div>

            <div className="ovika-connect-form-wrapper">
            <form className="ovika-connect-form" onSubmit={handleSubmit}>
              <h2 className="form-heading-ovika-homepage">Contact Us</h2>

              <input
                type="text"
                name="name"
                className="ovika-input"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />

              <input
                type="tel"
                name="phone_number"
                className="ovika-input"
                placeholder="Mobile Number"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                maxLength="10"
                disabled={isSubmitting}
              />

              <input
                type="email"
                name="email"
                className="ovika-input"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />

              <input
                type="text"
                name="message"
                className="ovika-input"
                placeholder="Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />

              <button
                type="submit"
                className="ovika-submit-btn-homepage"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>

              <a href="/list-property" target="_blank" style={{ textDecoration: "none" }}>
                <button type="button" className="ovika-host-btn">
                  HOST YOUR PROPERTY <span className="ovika-host-btn-arrow">→</span>
                </button>
              </a>
            </form>
            </div>
          </div>
        </div>

        {/* RIGHT: Desktop — model image */}
      

      </div>
    </div>
  );
}

export default Home6;