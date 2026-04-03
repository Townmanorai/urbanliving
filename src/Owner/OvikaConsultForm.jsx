
import React, { useState } from 'react';
import { X } from 'lucide-react';
import './OvikaConsultForm.css';

export default function OvikaConsultForm() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    message: '',
  });

  const onChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
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
          source: "OvikaConsultForm"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Form submitted successfully:", data);
        
        // Show success popup
        setShowSuccessPopup(true);
        
        // Reset form data
        setFormData({ name: "", phone_number: "", message: "" });
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
    <section className="ovk-wrap">
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

      {/* Top header */}
      {/* <header className="ovk-top">
        <h2 className="ovk-top__title">
          Start sharing your property with <span className="ovk-orange">OvikaLiving</span> today !
        </h2>
        <p className="ovk-top__sub">
          Ready to unlock your property potential? Choose your preferred way to connect with us below
        </p>
      </header> */}

      {/* Hero with overlay */}
      <div className="ovk-hero">
        <img src="/Group191.png" alt="Property Consultation" className="ovk-hero__img" />

        <div className="ovk-hero__overlay">
          {/* Left text block */}
          <div className="ovk-left">
            <h3 className="ovk-left__title">Want to know more before you host?</h3>
            <p className="ovk-left__desc">
              Fill out the form and get a free, no-obligation consultation with our hosting experts.
            </p>
          </div>

          {/* Right glass card form (desktop) / centered card (mobile) */}
          <form className="ovk-card" onSubmit={onSubmit}>
            <h4 className="ovk-card__title">Contact us</h4>

            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={onChange}
              className="ovk-input"
              required
              disabled={isSubmitting}
            />
            <input
              type="tel"
              name="phone_number"
              placeholder="Mobile Number"
              value={formData.phone_number}
              onChange={onChange}
              className="ovk-input"
              required
              pattern="[0-9]{10}"
              maxLength="10"
              disabled={isSubmitting}
            />
            <textarea
              name="message"
              placeholder="Tell us about your property"
              value={formData.message}
              onChange={onChange}
              className="ovk-textarea"
              rows={3}
              disabled={isSubmitting}
            />

            <button 
              type="submit" 
              className="ovk-cta-varnet"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
            >
              <span>{isSubmitting ? "Submitting..." : "Host With OvikaLiving"}</span>
              {!isSubmitting && <span className="ovk-cta__arrow">→</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}