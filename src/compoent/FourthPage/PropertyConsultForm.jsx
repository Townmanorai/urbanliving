

import React, { useState } from 'react';
import { X } from 'lucide-react';
import './PropertyConsultForm.css';
import heroPropertyImg from '/image 297.png'; // Apna image path yaha update karna

const PropertyConsultForm = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formInputs, setFormInputs] = useState({
    fullName: '',
    contactNumber: '',
    propertyDetails: ''
  });

  const handleInputChange = (e) => {
    setFormInputs({
      ...formInputs,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://www.townmanor.ai/api/formlead/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formInputs.fullName,
          phone_number: formInputs.contactNumber,
          purpose: formInputs.propertyDetails,
          source: "PropertyConsultForm"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Form submitted successfully:", data);
        
        // Show success popup
        setShowSuccessPopup(true);
        
        // Reset form data
        setFormInputs({ fullName: "", contactNumber: "", propertyDetails: "" });
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

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="property-consult-wrapper">
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
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeSuccessPopup}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                transition: "color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "#000"}
              onMouseOut={(e) => e.currentTarget.style.color = "#666"}
            >
              <X size={24} />
            </button>

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
                fontSize: "24px",
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
                fontSize: "14px",
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
                background: "linear-gradient(90deg, #b62305 0%, #000000 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                fontFamily: "Poppins, sans-serif",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(182, 35, 5, 0.3)";
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

      {/* Top Heading Section */}
      {/* <h1 className="main-page-title">
        Start sharing your property with <span className="brand-highlight">Ovika</span> today!
      </h1>
      <p className="main-page-subtitle">
        Ready to unlock your property potential? Choose your preferred way to connect with us below
      </p> */}

      {/* Hero Section with Form */}
      <div className="hero-form-container">
        {/* Left Side Text */}
        <div className="hero-text-content">
          <h2 className="hero-main-heading"> Want to Consult before initiating listing process?</h2>
          <p className="hero-description">
            Fill out the form to schedule a free non obligation consultation with one of our property experts.
          </p>
        </div>

        {/* Right Side Form Card */}
        <div className="consultation-form-card">
          <form onSubmit={handleFormSubmit} className="consult-form">
            <input
              type="text"
              name="fullName"
              className="form-input-field"
              placeholder="Your Name"
              value={formInputs.fullName}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
            <input
              type="tel"
              name="contactNumber"
              className="form-input-field"
              placeholder="Mobile Number"
              value={formInputs.contactNumber}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              maxLength="10"
              disabled={isSubmitting}
            />
            <textarea
              name="propertyDetails"
              className="form-textarea-field"
              placeholder="Tell us about your Property ( Optional )"
              value={formInputs.propertyDetails}
              onChange={handleInputChange}
              rows="4"
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="form-submit-btn"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
            >
              {isSubmitting ? "Submitting..." : "Request Free Consultation"}
            </button>
          </form>
        </div>

        {/* Background Property Image */}
        <img src={heroPropertyImg} alt="Modern Property" className="hero-background-img" />
      </div>
    </div>
  );
};

export default PropertyConsultForm;