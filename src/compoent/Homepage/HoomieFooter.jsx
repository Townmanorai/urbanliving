
import React, { useState } from "react";
import { X, Linkedin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const LinkList = ({ items }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "2px",
    }}
  >
    {items.map((item, index) => (
      <div
        key={index}
        style={{
          fontSize: "13px",
          color: "#fff",
          textDecoration: "none",
          opacity: 1,
          transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.7")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        {typeof item === 'string' ? <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>{item}</a> : item}
      </div>
    ))}
  </div>
);

const mobileCSS = `
/* ── Desktop logo layout ── */
.footer-logo-img {
  width: 160px;
  display: block;
  margin-bottom: -70px;
}
.footer-logo-desc {
  font-size: 11.5px;
  line-height: 1.6;
  opacity: 0.9;
}
.footer-col.logo-col {
  margin-top: -20px;
}

@media (max-width: 786px) {
  .footer-container {
    padding: 16px 16px 8px !important;
    margin: 8px !important;
    text-align: center !important;
    border-radius: 18px !important;
  }

  .footer-grid {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 6px !important;
    margin-bottom: 10px !important;
  }

  .footer-col.logo-col {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    width: 100% !important;
    text-align: center !important;
  }

  .footer-logo-img {
    width: 90px !important;
    display: block !important;
    margin: 0 auto -30px auto !important;
  }

  .footer-logo-desc {
    font-size: 9px !important;
    line-height: 1.4 !important;
    margin: 0 !important;
    padding: 0 8px !important;
    text-align: center !important;
    opacity: 0.9 !important;
  }

  .desktop-links-grid {
    display: none !important;
  }

  .footer-verified-badges {
    justify-content: center !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 8px !important;
  }

  .footer-verified-badges a {
    width: 100% !important;
    max-width: 220px !important;
    justify-content: center !important;
  }

  .footer-link-columns {
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    width: 100% !important;
    gap: 10px !important;
  }

  .footer-link-columns .footer-col {
    flex: 1 !important;
    text-align: left !important;
    min-width: 0 !important;
  }

  .footer-link-columns h3 {
    text-align: left !important;
    font-size: 14px !important;
    margin-bottom: 8px !important;
  }

  .quicklinks-col, .contactus-col, .legal-col {
    margin: 0 !important;
  }
  
  .contactus-col {
    margin-right: 0 !important;
  }
  
  .newsletter-row {
    padding: 20px 0 !important;
  }
  
  .newsletter-wrapper {
    flex-direction: column !important;
    gap: 15px !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .newsletter-wrapper p {
    white-space: normal !important;
    font-size: 10px !important;
    padding: 0 10px !important;
    margin: 0 !important;
    text-align: center !important;
  }
  
  .newsletter-inputrow {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    flex: none !important;
  }
  
  .newsletter-inputrow > div {
    width: 90% !important;
    max-width: 350px !important;
  }
  
  .bottom-row {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 16px !important;
    text-align: center !important;
  }
  
  .bottom-row > div {
    justify-content: center !important;
    font-size:10px !important;
  }
  
  .new-link-format {
    font-size: 10px !important;
  }
  
  .footer-link-columns a,
  .footer-col.quicklinks-col a,
  .footer-col.contactus-col span,
  .footer-col.contactus-col a,
  .footer-col.legal-col span {
    font-size: 9.5px !important;
  }

  .footer-link-columns > .footer-col > div {
    gap: 7px !important;
  }

  .newsletter-row {
    padding: 10px 0 !important;
  }
  
  .query-popup-overlay {
    padding: 10px !important;
  }
  
  .query-popup-content {
    width: 95% !important;
    max-width: 400px !important;
    padding: 25px 20px !important;
    max-height: 90vh !important;
    overflow-y: auto !important;
  }
  
  .query-popup-content h2 {
    font-size: 20px !important;
  }
  
  .query-popup-content input,
  .query-popup-content textarea {
    font-size: 14px !important;
  }
}
`;

const HoomieFooter = () => {
  const [query, setQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      message: query
    }));
    setShowPopup(true);
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://www.townmanor.ai/api/formlead/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number,
          purpose: formData.message,
          source: "Footer Query Form"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Query submitted successfully:", data);
        
        // Close the form popup
        setShowPopup(false);
        
        // Show success popup
        setShowSuccessPopup(true);
        
        // Reset form data
        setFormData({ name: "", phone_number: "", message: "" });
        setQuery("");
      } else {
        throw new Error("Failed to submit query");
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("Failed to submit query. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <>
      <style>{mobileCSS}</style>
      
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
            padding: "20px"
          }}
          onClick={closeSuccessPopup}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "15px",
              padding: "40px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px"
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "10px",
                color: "#333"
              }}
            >
              Message Submitted Successfully!
            </h2>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.875rem",
                color: "#666",
                marginBottom: "25px"
              }}
            >
              Thank you for reaching out. We'll get back to you soon.
            </p>
            <button
              onClick={closeSuccessPopup}
              style={{
                padding: "12px 40px",
                background: "linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                fontFamily: "Poppins, sans-serif",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(194, 119, 43, 0.35)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Form Popup Modal */}
      {showPopup && (
        <div
          className="query-popup-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
          onClick={closePopup}
        >
          <div
            className="query-popup-content"
            style={{
              backgroundColor: "#fff",
              borderRadius: "15px",
              padding: "35px 40px",
              width: "100%",
              maxWidth: "500px",
              position: "relative",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              disabled={isSubmitting}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                transition: "color 0.2s"
              }}
              onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.color = "#000")}
              onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.color = "#666")}
            >
              <X size={24} />
            </button>

            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "10px",
                color: "#333",
                textAlign: "center"
              }}
            >
              Submit Your Query
            </h2>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.875rem",
                color: "#666",
                marginBottom: "25px",
                textAlign: "center"
              }}
            >
              We'll get back to you as soon as possible
            </p>

            <form onSubmit={handlePopupSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#333"
                  }}
                >
                  Name <span style={{ color: "#b62305" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your name"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.94rem",
                    fontFamily: "Poppins, sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                  onFocus={(e) => !isSubmitting && (e.target.style.borderColor = "#c98b3e")}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#333"
                  }}
                >
                  Mobile Number <span style={{ color: "#b62305" }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your mobile number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.94rem",
                    fontFamily: "Poppins, sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                  onFocus={(e) => !isSubmitting && (e.target.style.borderColor = "#c98b3e")}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#333"
                  }}
                >
                  Message <span style={{ color: "#b62305" }}>*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your message"
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "0.94rem",
                    fontFamily: "Poppins, sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s",
                    resize: "vertical",
                    boxSizing: "border-box",
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                  onFocus={(e) => !isSubmitting && (e.target.style.borderColor = "#c98b3e")}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: isSubmitting 
                    ? "#ccc" 
                    : "linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  fontFamily: "Poppins, sans-serif",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(194, 119, 43, 0.35)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer
        className="footer-container"
        style={{
          background: "linear-gradient(180deg, #c98b3e 0%, #7c4e13 100%)",
          color: "#fff",
          padding: "28px 40px 14px",
          borderRadius: "20px 20px 0 0",
          fontFamily: "Poppins, sans-serif",
          marginLeft: "20px",
          marginRight: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Top Section */}
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
              gap: "28px",
              marginBottom: "20px",
            }}
          >
            {/* Company Info */}
            <div className="footer-col logo-col">
              <img
                src="/ovikalogo11.png"
                alt="Urban Living Logo"
                className="footer-logo-img"
              />
              <p className="footer-logo-desc">
                <span>OvikaLiving</span> is the flagship short-term rental brand of{" "}
                <span>Townmanor Technologies Pvt. Ltd.</span> — built to redefine modern city living through technology, design, and convenience.
              </p>
            </div>

            {/* Column 1 — Desktop */}
            <div className="footer-col desktop-links-grid">
              <LinkList
                items={[
                  <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</Link>,
                  <Link to="/faq" style={{ color: '#fff', textDecoration: 'none' }}>FAQ's</Link>,
                  <Link to="/terms-and-conditions" style={{ color: '#fff', textDecoration: 'none' }}>Terms and Conditions</Link>,
                  <Link to="/privacy-policy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</Link>,
                  <Link to="/refund-cancellation-policy" style={{ color: '#fff', textDecoration: 'none' }}>Refund & Cancellation</Link>,
                  <Link to="/subsription" style={{ color: '#fff', textDecoration: 'none' }}>Subscription Plan</Link>,
                ]}
              />
            </div>

            {/* Column 2 — Desktop */}
            <div className="footer-col desktop-links-grid">
              <LinkList
                items={[
                  <Link to="/career-support" style={{ color: '#fff', textDecoration: 'none' }}>Career Support</Link>,
                  <Link to="/ovika-verified" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    OvikaLiving Verified
                    <img src="/ovikaver.png" alt="Verified" style={{ height: '18px', width: 'auto' }} />
                  </Link>,
                  <Link to="/ovika-self-verified" style={{ color: '#fff', textDecoration: 'none' }}>Self Verification</Link>,
                  <Link to="/nightly-stays" style={{ color: '#fff', textDecoration: 'none' }}>Nightly Stays</Link>,
                  <Link to="/monthly-rentals" style={{ color: '#fff', textDecoration: 'none' }}>Monthly Rental</Link>,
                  <Link to="/properties?category=Signature+Stays" style={{ color: '#fff', textDecoration: 'none' }}>Signature Stays</Link>,
                ]}
              />
            </div>

            {/* Column 3 — Desktop */}
            <div className="footer-col desktop-links-grid">
              <LinkList
                items={[
                  <Link to="/listed1" style={{ color: '#fff', textDecoration: 'none' }}>List Property</Link>,
                  <a href="https://www.townmanor.ai/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Explore Townmanor</a>,
                  <Link to="/contactus" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</Link>,
                  <Link to="/legal-information" style={{ color: '#fff', textDecoration: 'none' }}>Legal Information</Link>,
                ]}
              />
            </div>

          </div>

          {/* Mobile Links — 3 columns */}
          <div className="footer-link-columns" style={{ display: "none" }}>
            <div className="footer-col">
              <LinkList
                items={[
                  <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</Link>,
                  <Link to="/faq" style={{ color: '#fff', textDecoration: 'none' }}>FAQ's</Link>,
                  <Link to="/terms-and-conditions" style={{ color: '#fff', textDecoration: 'none' }}>Terms</Link>,
                  <Link to="/privacy-policy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy</Link>,
                  <Link to="/refund-cancellation-policy" style={{ color: '#fff', textDecoration: 'none' }}>Refund</Link>,
                  <Link to="/subsription" style={{ color: '#fff', textDecoration: 'none' }}>Subscription</Link>,
                ]}
              />
            </div>

            <div className="footer-col">
              <LinkList
                items={[
                  <Link to="/career-support" style={{ color: '#fff', textDecoration: 'none' }}>Career Support</Link>,
                  <Link to="/ovika-verified" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Verified <img src="/ovikaver.png" alt="Verified" style={{ height: '12px', width: 'auto' }} />
                  </Link>,
                  <Link to="/ovika-self-verified" style={{ color: '#fff', textDecoration: 'none' }}>Self Verify</Link>,
                  <Link to="/nightly-stays" style={{ color: '#fff', textDecoration: 'none' }}>Nightly Stays</Link>,
                  <Link to="/monthly-rentals" style={{ color: '#fff', textDecoration: 'none' }}>Monthly Rental</Link>,
                  <Link to="/properties?category=Signature+Stays" style={{ color: '#fff', textDecoration: 'none' }}>Signature Stays</Link>,
                ]}
              />
            </div>

            <div className="footer-col">
              <LinkList
                items={[
                  <Link to="/listed1" style={{ color: '#fff', textDecoration: 'none' }}>List Property</Link>,
                  <a href="https://www.townmanor.ai/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Townmanor</a>,
                  <Link to="/contactus" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</Link>,
                  <Link to="/legal-information" style={{ color: '#fff', textDecoration: 'none' }}>Legal Info</Link>,
                ]}
              />
            </div>

          </div>

          {/* Newsletter Section */}
          <div
            className="newsletter-row"
            style={{
              padding: "14px 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="newsletter-wrapper"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "16px",
                width: "100%",
                maxWidth: "600px",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 400,
                  fontFamily: "Poppins, sans-serif",
                  whiteSpace: "nowrap",
                  margin: 0,
                }}
              >
                Get the latest updates about Townmanor and OvikaLiving
              </p>
              <div className="newsletter-inputrow" style={{ margin: 0, padding: 0, flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "46px",
                    borderRadius: "50px",
                    backgroundColor: "#fff",
                    position: "relative",
                    width: "300px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Submit your Query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                      flex: 1,
                      height: "100%",
                      padding: "0px 20px",
                      border: "none",
                      outline: "none",
                      fontSize: "0.94rem",
                      borderRadius: "50px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    style={{
                      position: "absolute",
                      right: "0",
                      height: "100%",
                      width: "130px",
                      background:
                        "linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50px",
                      marginRight: "-14px",
                      transition: "0.3s ease",
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div
            className="bottom-row"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              fontSize: "13px",
              paddingTop: "15px",
              paddingBottom: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "18px",
              }}
            >
              <span>Follow Us</span>
              <a
                href="https://www.linkedin.com/company/townmanor/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  backgroundColor: "#0077B5",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,119,181,0.3)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,119,181,0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,119,181,0.3)";
                }}
              >
                <Linkedin size={22} fill="#fff" strokeWidth={0} />
              </a>
              <a
                href="https://www.instagram.com/ovikaliving/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(188,24,136,0.3)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(188,24,136,0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(188,24,136,0.3)";
                }}
              >
                <Instagram size={22} strokeWidth={2} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61580058103004"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  backgroundColor: "#1877F2",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(24,119,242,0.3)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(24,119,242,0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(24,119,242,0.3)";
                }}
              >
                <Facebook size={22} fill="#fff" strokeWidth={0} />
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a
                href="#terms"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                © 2025 OvikaLiving
              </a>
              <span>|</span>
              <a
                href="#terms"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                TERMS
              </a>
              <span>|</span>
              <a
                href="#privacy"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                PRIVACY
              </a>
              <span>|</span>
              <Link
                to="/contactus"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                CONTACT US
              </Link>
              <span>|</span>
              <Link
                to="/legal-information"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                LEGAL INFO
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HoomieFooter;