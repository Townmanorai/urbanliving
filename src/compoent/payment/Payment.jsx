import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, UploadCloud, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import './Payment.css';
import { MdCurrencyRupee } from 'react-icons/md';

// Calendar Component
const Calendar = ({ selectedDates, onDateSelect, minDate = new Date() }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'checkout'
  const [checkInDate, setCheckInDate] = useState(selectedDates.checkInDate ? new Date(selectedDates.checkInDate) : null);
  const [checkOutDate, setCheckOutDate] = useState(selectedDates.checkOutDate ? new Date(selectedDates.checkOutDate) : null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateDisabled = (date) => {
    return date < minDate;
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return (checkInDate && dateStr === checkInDate.toISOString().split('T')[0]) ||
           (checkOutDate && dateStr === checkOutDate.toISOString().split('T')[0]);
  };

  const isDateInRange = (date) => {
    if (!date || !checkInDate || !checkOutDate) return false;
    const dateStr = date.toISOString().split('T')[0];
    const checkInStr = checkInDate.toISOString().split('T')[0];
    const checkOutStr = checkOutDate.toISOString().split('T')[0];
    return dateStr > checkInStr && dateStr < checkOutStr;
  };

  const handleDateClick = (date) => {
    if (!date || isDateDisabled(date)) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Start new selection
      setCheckInDate(date);
      setCheckOutDate(null);
    } else {
      // Complete selection
      if (date > checkInDate) {
        setCheckOutDate(date);
        onDateSelect({
          checkInDate: checkInDate.toISOString().split('T')[0],
          checkOutDate: date.toISOString().split('T')[0]
        });
      } else {
        // If selected date is before check-in, swap them
        setCheckInDate(date);
        setCheckOutDate(checkInDate);
        onDateSelect({
          checkInDate: date.toISOString().split('T')[0],
          checkOutDate: checkInDate.toISOString().split('T')[0]
        });
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav-button">
          <ChevronLeft size={20} />
        </button>
        <h3 className="calendar-title">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="calendar-nav-button">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-grid">
        {/* Days of week header */}
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            disabled={!date || isDateDisabled(date)}
            className={`calendar-day ${
              !date ? 'calendar-day-empty' :
              isDateDisabled(date) ? 'calendar-day-disabled' :
              isDateSelected(date) ? 'calendar-day-selected' :
              isDateInRange(date) ? 'calendar-day-in-range' :
              'calendar-day-available'
            }`}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>

      {/* Selected dates display */}
      <div className="calendar-selection">
        <div className="calendar-selection-item">
          <span className="calendar-selection-label">Check-in:</span>
          <span className="calendar-selection-date">
            {checkInDate ? checkInDate.toLocaleDateString() : 'Not selected'}
          </span>
        </div>
        <div className="calendar-selection-item">
          <span className="calendar-selection-label">Check-out:</span>
          <span className="calendar-selection-date">
            {checkOutDate ? checkOutDate.toLocaleDateString() : 'Not selected'}
          </span>
        </div>
      </div>
    </div>
  );
};

function Payment() {
    const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    termsAgreed: false,
    checkInDate: '',
    checkOutDate: '',
    phoneOtpVerified: false,
    aadhaarVerified: false,
    uploadedPhoto: null,
  });

  // Phone & OTP state
  const [phoneDigits, setPhoneDigits] = useState(Array(10).fill(''));
  const [showOtpInputs, setShowOtpInputs] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(4).fill(''));
  const [otpError, setOtpError] = useState('');
  const phoneInputsRef = useRef([]);
  const otpInputsRef = useRef([]);

  // Aadhaar state
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isAadhaarLoading, setIsAadhaarLoading] = useState(false);

  // Calculate pricing dynamically based on dates
  const [pricing, setPricing] = useState({
    subtotal: 0,
    gst: 0,
    total: 0,
  });

  const [isPayNowEnabled, setIsPayNowEnabled] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // References for file upload
  const fileInputRef = useRef(null);

  // Progress bar steps
  const steps = [
    'Property',
    'Terms',
    'Dates & Pricing',
    'Verification',
    'Photo Upload',
    'Payment',
  ];

  // Logic to handle next step
  const handleNext = () => {
    // Validate each step before moving forward
    if (step === 2 && !formData.termsAgreed) return;
    if (step === 3 && (!formData.checkInDate || !formData.checkOutDate || pricing.total <= 0)) return;
    if (step === 4 && (!formData.phoneOtpVerified || !formData.aadhaarVerified)) return;
    if (step === 5 && !formData.uploadedPhoto) return;

    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  // Logic to handle previous step
  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Calculate price whenever dates change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const pricePerNight = 3400; // Sample price
      const subtotal = diffDays * pricePerNight;
      const gst = subtotal * 0.18; // 18% GST
      const total = subtotal + gst;

      setPricing({ subtotal, gst, total });
    } else {
      setPricing({ subtotal: 0, gst: 0, total: 0 });
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  // Enable Pay Now button only when all steps are valid
  useEffect(() => {
    const allStepsComplete =
      formData.termsAgreed &&
      (formData.checkInDate && formData.checkOutDate && pricing.total > 0) &&
      formData.phoneOtpVerified &&
      formData.aadhaarVerified &&
      formData.uploadedPhoto;
    setIsPayNowEnabled(allStepsComplete);
  }, [formData, pricing]);

  // Handle file drop for photo upload
  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Handle file selection from input
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Process the uploaded file
  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const photoUrl = URL.createObjectURL(file);
      setIsPhotoUploading(true);
      setTimeout(() => {
        setFormData({ ...formData, uploadedPhoto: photoUrl });
        setIsPhotoUploading(false);
      }, 1000); // Simulate upload time
    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Handle verification logic
  const handleSendOtp = () => {
    const phone = phoneDigits.join('');
    if (phone.length === 10) {
      setShowOtpInputs(true);
      setOtpDigits(Array(4).fill(''));
      setOtpError('');
      setTimeout(() => {
        if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
      }, 0);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const next = [...otpDigits];
      next[index] = value;
      setOtpDigits(next);
      setOtpError('');
      if (value && index < 3) {
        otpInputsRef.current[index + 1]?.focus();
      }
      if (next.join('').length === 4) {
        if (next.join('') === '4173') {
          setFormData(prev => ({ ...prev, phoneOtpVerified: true }));
        } else {
          setOtpError('Invalid OTP. Try 4173');
        }
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePhoneChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const next = [...phoneDigits];
      next[index] = value;
      setPhoneDigits(next);
      if (value && index < 9) {
        phoneInputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handlePhoneKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !phoneDigits[index] && index > 0) {
      phoneInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyAadhaar = () => {
    if (!aadhaarNumber || formData.aadhaarVerified) return;
    setIsAadhaarLoading(true);
    setTimeout(() => {
      setIsAadhaarLoading(false);
      setFormData(prev => ({ ...prev, aadhaarVerified: true }));
    }, 2000);
  };
  
  // Custom styled alert box to replace native alert()
  const CustomAlert = ({ message, onClose }) => {
    return (
      <div className="alert__overlay">
        <div className="alert__box">
          <p className="alert__message">{message}</p>
          <button onClick={onClose} className="alert__button">OK</button>
        </div>
      </div>
    );
  };
  
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (message) => {
    setAlertMessage(message);
  };

  const closeAlert = () => {
    setAlertMessage(null);
  };

  const handlePayNow = async () => {
    if (!isPayNowEnabled || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const storageRaw = localStorage.getItem('storage');
      let parsedStorage = null;
      try {
        parsedStorage = storageRaw ? JSON.parse(storageRaw) : null;
      } catch (e) {
        parsedStorage = storageRaw || null;
      }

      let email = '';
      let username = '';

      if (parsedStorage && typeof parsedStorage === 'object') {
        email = parsedStorage.email || (parsedStorage.user && parsedStorage.user.email) || '';
        username = parsedStorage.username || parsedStorage.name || (parsedStorage.user && parsedStorage.user.name) || '';
      } else if (typeof parsedStorage === 'string') {
        if (parsedStorage.includes('@')) {
          email = parsedStorage;
        } else {
          username = parsedStorage;
        }
      }

      const phoneRaw = phoneDigits.join('');
      const phone_number = phoneRaw ? (phoneRaw.startsWith('+') ? phoneRaw : `+${phoneRaw}`) : '';

      const formatAadhaar = (aadhaar) => {
        if (!aadhaar) return '';
        const digits = aadhaar.replace(/\D/g, '');
        if (digits.length === 12) {
          return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
        }
        return aadhaar;
      };

      const payload = {
        property_id: 2,
        email,
        start_date: formData.checkInDate,
        end_date: formData.checkOutDate,
        username,
        phone_number,
        aadhar_number: formatAadhaar(aadhaarNumber),
        user_photo: formData.uploadedPhoto,
        terms_verified: !!formData.termsAgreed,
      };

      const response = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data && data.success) {
        const b = data.booking || {};
        showAlert(`Booking created successfully. Total: ₹${b.total_price} for ${b.nights} nights (${b.start_date} to ${b.end_date}).`);
      } else {
        showAlert((data && data.message) || 'Booking failed. Please try again.');
      }
    } catch (error) {
      showAlert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <>
     <div className="booking-form-wrapper">
   
      <div className="booking-form-container">
        {/* Progress Bar */}
        <div className="progress-bar-container">
          {steps.map((stepName, index) => (
            <div key={index} className="progress-bar-step">
              <div
                className={`progress-bar-line ${
                  index < step ? 'is-active' : ''
                }`}
              ></div>
              <span
                className={`progress-bar-step-name ${
                  index + 1 === step ? 'is-active' : ''
                }`}
              >
                {stepName}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content based on current step */}
        <div>
          {/* Step 1: Property Details */}
          {step === 1 && (
            <div>
              <h2 className="form-step-title">Property Details</h2>
              <div className="form-step-card">
                <img
                  src="/image 71.png"
                  alt="Property"
                  className="form-step-card-image"
                />
                <div className="form-step-card-content">
                  <h3 className="form-step-card-title">The Tranquil Perch (Patio View)</h3>
                  <p className="form-step-card-location">Greater Noida, Uttar Pradesh</p>
                  <p className="form-step-card-description">
                    A serene escape with breathtaking ocean views. Perfect for couples or a small family.
                  </p>
                  <ul className="form-step-card-amenities">
                    <li>2 Beds, 1 Bath</li>
                    <li>Wi-Fi & Kitchen</li>
                    <li>Free Parking</li>
                    <li>Pet-friendly</li>
                  </ul>
                  <p className="form-step-card-price">
                    <MdCurrencyRupee />3400<span className="form-step-card-price-per-night">/night</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Terms & Conditions */}
          {step === 2 && (
            <div>
              <h2 className="form-step-title">Terms & Conditions</h2>
              <div className="terms-container">
                <p className="font-bold mb-2">1. Booking Agreement</p>
                <p className="mb-4">
                  By confirming this booking, you agree to abide by all house rules, including check-in/check-out times, noise restrictions, and guest limits. Violation of these terms may result in a fine or cancellation of your reservation without a refund.
                </p>
                <p className="font-bold mb-2">2. Cancellation Policy</p>
                <p className="mb-4">
                  A full refund will be provided for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away. 50% refund for cancellations made 7 days before check-in. No refund for cancellations within 7 days of check-in.
                </p>
                <p className="font-bold mb-2">3. Damage & Liability</p>
                <p className="mb-4">
                  Guests are responsible for any damage caused to the property and its contents during their stay. The host reserves the right to charge the guest for repair or replacement costs.
                </p>
                <p className="font-bold mb-2">4. Payment & Pricing</p>
                <p className="mb-4">
                  All prices are final and non-negotiable. Additional taxes and service fees are included in the final price. Payment must be completed in full before the reservation is confirmed.
                </p>
                <p className="font-bold mb-2">5. Privacy</p>
                <p className="mb-4">
                  Your personal information will be used solely for the purpose of this booking and will not be shared with third parties.
                </p>
              </div>
              <label className="terms-agreement-label">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.termsAgreed}
                  onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                />
                <span className={`custom-checkbox ${formData.termsAgreed ? 'is-checked' : ''}`}>
                  {formData.termsAgreed && <CheckCircle size={16} color="white" />}
                </span>
                <span className="custom-checkbox-text">I have read and agree to the Terms & Conditions.</span>
              </label>
            </div>
          )}

          {/* Step 3: Date Selection & Pricing */}
          {step === 3 && (
            <div>
              <h2 className="form-step-title">Dates & Pricing</h2>
              <div className="dates-pricing-container">
                <div className="calendar-section">
                  <Calendar
                    selectedDates={{
                      checkInDate: formData.checkInDate,
                      checkOutDate: formData.checkOutDate
                    }}
                    onDateSelect={(dates) => setFormData({ ...formData, ...dates })}
                    minDate={new Date()}
                  />
                </div>

                <div className="pricing-summary-card">
                  <h3 className="pricing-summary-title">Pricing Summary</h3>
                  <div className="pricing-item-list">
                    <div className="pricing-item">
                      <span>Subtotal</span>
                      <span><MdCurrencyRupee/>{pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="pricing-item">
                      <span>Taxes & GST (18%)</span>
                      <span><MdCurrencyRupee/>{pricing.gst.toFixed(2)}</span>
                    </div>
                    <div className="pricing-total">
                      <span>Total Price</span>
                      <span><MdCurrencyRupee/>{pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Verification */}
          {step === 4 && (
            <div>
              <h2 className="form-step-title">Verification</h2>
              <div className="verification-container">
                {/* Phone OTP Verification */}
                <div className="verification-card">
                  <h3 className="verification-title">Phone OTP</h3>
                  <div className="phone-inputs-container">
                    <label className="digit-inputs-label">Enter Mobile Number</label>
                    <div className="digit-inputs" role="group" aria-label="Mobile number">
                      {phoneDigits.map((d, i) => (
                        <input
                          key={i}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={d}
                          ref={el => phoneInputsRef.current[i] = el}
                          onChange={(e) => handlePhoneChange(i, e.target.value.replace(/\D/g, ''))}
                          onKeyDown={(e) => handlePhoneKeyDown(i, e)}
                          className={`digit-box ${d ? 'is-filled' : ''}`}
                          disabled={formData.phoneOtpVerified}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={formData.phoneOtpVerified || phoneDigits.join('').length !== 10}
                      className={`verification-button ${
                        formData.phoneOtpVerified
                          ? 'verification-button-verified'
                          : 'verification-button-default'
                      } send-otp-button`}
                    >
                      {formData.phoneOtpVerified ? 'Verified' : 'Send OTP'}
                    </button>
                  </div>

                  {showOtpInputs && !formData.phoneOtpVerified && (
                    <div className="otp-inputs-container">
                      <label className="digit-inputs-label">Enter 4-digit OTP (try 4173)</label>
                      <div className="digit-inputs" role="group" aria-label="OTP">
                        {otpDigits.map((d, i) => (
                          <input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={d}
                            ref={el => otpInputsRef.current[i] = el}
                            onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className={`digit-box ${d ? 'is-filled' : ''}`}
                          />
                        ))}
                      </div>
                      {otpError && <p className="otp-error-text">{otpError}</p>}
                    </div>
                  )}

                  <div className="verification-status-icon">
                    {formData.phoneOtpVerified ? (
                      <CheckCircle size={24} color="#8b0000" />
                    ) : (
                      <XCircle size={24} color="gray" />
                    )}
                  </div>
                </div>

                {/* Aadhaar Check */}
                <div className="verification-card">
                  <h3 className="verification-title">Aadhaar Check</h3>
                  <div className="aadhaar-inputs-container">
                    <label className="digit-inputs-label">Enter Aadhaar Number</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={12}
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                      className="aadhaar-input"
                      disabled={formData.aadhaarVerified}
                      placeholder="12-digit Aadhaar"
                    />
                    <button
                      onClick={handleVerifyAadhaar}
                      disabled={formData.aadhaarVerified || !aadhaarNumber || isAadhaarLoading}
                      className={`verification-button ${
                        formData.aadhaarVerified
                          ? 'verification-button-verified'
                          : 'verification-button-default'
                      }`}
                    >
                      {formData.aadhaarVerified ? 'Verified' : (isAadhaarLoading ? 'Verifying…' : 'Verify Aadhaar')}
                    </button>
                  </div>
                  <div className="verification-status-icon">
                    {formData.aadhaarVerified ? (
                      <CheckCircle size={24} color="#8b0000" />
                    ) : (
                      isAadhaarLoading ? (
                        <Loader size={24} className="animate-spin text-gray-400" />
                      ) : (
                        <XCircle size={24} color="gray" />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Photo Upload */}
          {step === 5 && (
            <div>
              <h2 className="form-step-title">Photo Upload</h2>
              <div
                className={`upload-container ${isPhotoUploading ? 'is-uploading' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current.click()}
              >
                {isPhotoUploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Loader size={48} className="animate-spin text-gray-400" />
                    <p className="upload-text">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={48} className="upload-icon" />
                    <p className="upload-text">
                      Drag and drop your photo here, or
                      <br />
                      <span>click to browse</span>
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />

              {/* Photo Preview */}
              {formData.uploadedPhoto && (
                <div className="photo-preview-container">
                  <h3 className="photo-preview-title">Preview</h3>
                  <img
                    src={formData.uploadedPhoto}
                    alt="Uploaded Preview"
                    className="photo-preview-image"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 6: Payment */}
          {step === 6 && (
            <div>
              <h2 className="form-step-title">Payment</h2>
              <div className="payment-container">
                <p className="payment-price-text">
                  Final Price: <span className="payment-price-amount">${pricing.total.toFixed(2)}</span>
                </p>
                <button
                  onClick={handlePayNow}
                  disabled={!isPayNowEnabled || isSubmitting}
                  className={`pay-now-button ${isPayNowEnabled && !isSubmitting ? 'is-enabled' : 'is-disabled'}`}
                >
                  {isSubmitting ? 'Processing…' : 'Pay Now'}
                </button>
                {!isPayNowEnabled && (
                  <p className="disabled-message">
                    Please complete all previous steps to enable payment.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-container">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="navigation-button prev-button"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={step === steps.length || (step === 2 && !formData.termsAgreed)}
            className="navigation-button next-button"
          >
            Next
          </button>
        </div>
      </div>
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
    </div>

   </>
  )
}

export default Payment