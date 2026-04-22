import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListYourPropertyTM.css";
import { IoArrowForward } from "react-icons/io5";
import { navClick, auxNavClick } from '../../utils/navClick';

const ListYourPropertyTM = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // 'success', 'error', or ''

  // Replace with your WhatsApp number (with country code, no + sign)
  const whatsappNumber = "919319392227"; // Fixed: Added country code 91 and removed space

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear status when user starts typing
    if (submitStatus) setSubmitStatus('');
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.fullName.trim() || !formData.phone.trim() || 
        !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      return false;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      setSubmitStatus('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Create WhatsApp message
      const whatsappMessage = `🏠 *New Property Listing Inquiry - Ovika Living*

👤 *Name:* ${formData.fullName}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}

💬 *Message:*
${formData.message}

---
*Sent from Ovika Living Contact Form*`;

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Create WhatsApp URL
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');
      
      // Set success status
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          message: ''
        });
      }, 2000);

    } catch (error) {
      console.error('WhatsApp message failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleListPropertyClick = (e) => {
    navClick(e, '/list-property', navigate);
  };

  return (
    <div className="tm-list-container">
      {/* Header Section */}
      <div className="tm-list-header">
        <h1 className="tm-list-main-title">
        Elevate Your Property into a Premium Rental with Ovika Living
        </h1>
        <p className="tm-list-subtitle">
        Partner with us to design smart, stylish living spaces. From transformation to tenant experience, we handle everything-seamlessly, together.


        </p>
      </div>

      {/* Hero Section */}
      <div className="tm-list-hero">
        <div className="tm-list-hero-content">
          {/* Left */}
          <div className="tm-list-hero-left">
            <h2 className="tm-list-hero-title">
              List with Ovika,<br />
              Earn with Ease –
              Begin Your Journey<br />
              Today
            </h2>
            <p className="tm-list-hero-description">
              Join Ovika and turn your property into a steady source of income. Whether it's an apartment, PG, or luxury villa, we make renting simple, safe, and rewarding.
            </p>
            <button className="tm-list-hero-button" onClick={handleListPropertyClick} onAuxClick={(e) => auxNavClick(e, '/list-property')}>
              List Your Property <IoArrowForward className="arrow-icon" />
            </button>
          </div>

          {/* Right */}
          <div className="tm-list-hero-right">
            <div className="tm-contact-form">
              <h3 style={{fontWeight:"480"}} className="tm-contact-title">Contact us</h3>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="tm-form-message tm-form-success">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="tm-form-message tm-form-error">
                  ❌ Please check all fields and try again.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  name="fullName" 
                  placeholder="Full name" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  className="tm-form-input" 
                  required 
                  disabled={isSubmitting}
                />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className="tm-form-input" 
                  required 
                  disabled={isSubmitting}
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="tm-form-input" 
                  required 
                  disabled={isSubmitting}
                />
                <textarea 
                  name="message" 
                  placeholder="Message..." 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  className="tm-form-textarea" 
                  rows="4" 
                  required
                  disabled={isSubmitting}
                ></textarea>


                <button 
                  type="submit" 
                  className={`tm-form-submit ${isSubmitting ? 'tm-form-submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} 
                  <IoArrowForward className="arrow-icon" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListYourPropertyTM;