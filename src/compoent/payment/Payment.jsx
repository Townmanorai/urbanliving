import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, UploadCloud, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import './Payment.css';
import { MdCurrencyRupee } from 'react-icons/md';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { format, differenceInDays } from 'date-fns';

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
  const [property, setProperty] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState('');
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
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
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

  // Additional state for API integration
  const [clientId, setClientId] = useState('');
  const [phoneVerificationData, setPhoneVerificationData] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Persist step-wise progress in localStorage
  const STORAGE_KEYS = {
    step: 'payment_step',
    formData: 'payment_formData',
    phoneDigits: 'payment_phoneDigits',
    otpDigits: 'payment_otpDigits',
    aadhaar: 'payment_aadhaarNumber',
  };
  const hasLoadedFromStorageRef = useRef(false);

  // Load saved progress on mount
  useEffect(() => {
    try {
      const savedStepRaw = localStorage.getItem(STORAGE_KEYS.step);
      const savedStep = savedStepRaw ? parseInt(savedStepRaw, 10) : null;
      const savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEYS.formData) || '{}');
      const savedPhoneDigits = JSON.parse(localStorage.getItem(STORAGE_KEYS.phoneDigits) || '[]');
      const savedOtpDigits = JSON.parse(localStorage.getItem(STORAGE_KEYS.otpDigits) || '[]');
      const savedAadhaar = localStorage.getItem(STORAGE_KEYS.aadhaar) || '';

      if (!Number.isNaN(savedStep) && savedStep && savedStep >= 1 && savedStep <= 6) {
        setStep(savedStep);
      }
      if (savedFormData && typeof savedFormData === 'object') {
        setFormData(prev => ({ ...prev, ...savedFormData }));
      }
      if (Array.isArray(savedPhoneDigits) && savedPhoneDigits.length === 10) {
        setPhoneDigits(savedPhoneDigits);
      }
      if (Array.isArray(savedOtpDigits) && savedOtpDigits.length === 6) {
        setOtpDigits(savedOtpDigits);
      }
      if (savedAadhaar) {
        setAadhaarNumber(savedAadhaar);
      }
    } catch (e) {
      console.warn('Failed to restore payment progress from storage', e);
    } finally {
      hasLoadedFromStorageRef.current = true;
    }
  }, []);

  // Persist progress whenever it changes
  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) return;
    localStorage.setItem(STORAGE_KEYS.step, String(step));
  }, [step]);

  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.formData, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.phoneDigits, JSON.stringify(phoneDigits));
    } catch {}
  }, [phoneDigits]);

  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEYS.otpDigits, JSON.stringify(otpDigits));
    } catch {}
  }, [otpDigits]);

  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) return;
    localStorage.setItem(STORAGE_KEYS.aadhaar, aadhaarNumber);
  }, [aadhaarNumber]);

  // Get user data from localStorage and cookies
  const roomId = localStorage.getItem('roomId');
  const userId = localStorage.getItem('propertyid');
  const propertyId = localStorage.getItem('property_id');
  const token = Cookies.get('jwttoken');
  let username = '';
  
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.username;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

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
      
      const pricePerNight = property?.per_night_price ? Number(property.per_night_price) : 0;
      const subtotal = diffDays * pricePerNight;
      const gst = subtotal * 0.05; // 18% GST
      const total = subtotal + gst;

      setPricing({ subtotal, gst, total });
    } else {
      setPricing({ subtotal: 0, gst: 0, total: 0 });
    }
  }, [formData.checkInDate, formData.checkOutDate, property]);

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

  // Fetch property details from API using property_id in localStorage
  useEffect(() => {
    const id = propertyId || '2';
    const fetchProperty = async () => {
      setPropertyLoading(true);
      setPropertyError('');
      try {
        const res = await fetch(`https://townmanor.ai/api/properties/${id}`);
        const json = await res.json();
        if (json && json.success && json.property) {
          setProperty(json.property);
        } else {
          setPropertyError('Failed to load property');
        }
      } catch (e) {
        setPropertyError('Failed to load property');
      } finally {
        setPropertyLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

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
  const handleFile = async (file) => {
    if (file.type.startsWith('image/')) {
      setIsPhotoUploading(true);
      setUploading(true);
      
      const formData = new FormData();
      formData.append('images', file);
      
      try {
        const response = await fetch('https://www.townmanor.ai/api/image/aws-upload-owner-images', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        console.log(data);
        
        if (!data || !data.fileUrls || data.fileUrls.length === 0) {
          throw new Error('Image URL not found in upload response.');
        }

        const imageUrl = data.fileUrls[0];
        const photoUrl = imageUrl;
        
        setFormData(prev => ({ ...prev, uploadedPhoto: photoUrl }));
        setPhotoUploaded(true);
        showAlert('Photo uploaded successfully!');

      } catch (error) {
        console.error('Error uploading photo:', error);
        showAlert('Failed to upload photo. ' + (error.message || 'An unknown error occurred.'));
      } finally {
        setIsPhotoUploading(false);
        setUploading(false);
      }
    } else {
      showAlert('Please upload a valid image file.');
    }
  };

  // Handle verification logic
  const handleSendOtp = async () => {
    const phone = phoneDigits.join('');
    if (!phone || !/^\d{10}$/.test(phone)) {
      showAlert('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://kyc-api.surepass.io/api/v1/telecom/generate-otp', {
        id_number: phone
      }, {
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg'
        }
      });

             if (response.data.success) {
         setClientId(response.data.data.client_id);
         setShowOtpInputs(true);
         setOtpDigits(Array(6).fill(''));
         setOtpError('');
         showAlert('OTP sent successfully!');
         setTimeout(() => {
           if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
         }, 0);
       } else {
        showAlert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      showAlert('An error occurred while sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const next = [...otpDigits];
      next[index] = value;
      setOtpDigits(next);
      setOtpError('');
      if (value && index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }
      if (next.join('').length === 6) {
        handleSubmitOtp(next.join(''));
      }
    }
  };

  const handleSubmitOtp = async (otpValue) => {
    if (!otpValue || otpValue.length !== 6) {
      showAlert('Please enter the OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://kyc-api.surepass.io/api/v1/telecom/submit-otp', {
        client_id: clientId,
        otp: otpValue
      }, {
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg'
        }
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, phoneOtpVerified: true }));
        setShowOtpInputs(false);
        setPhoneVerificationData(response.data);
        showAlert('Phone number verified successfully!');
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting OTP:', error);
      setOtpError('An error occurred while verifying OTP. Please try again.');
    } finally {
      setLoading(false);
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

  const handleVerifyAadhaar = async () => {
    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
      showAlert('Please enter a valid 12-digit Aadhar number.');
      return;
    }

    setIsAadhaarLoading(true);

    const pollAadhaarStatus = async (clientId, retries = 5) => {
      if (retries === 0) {
        showAlert('Aadhaar verification is taking longer than usual. Please try again later.');
        setIsAadhaarLoading(false);
        return;
      }

      try {
        const statusResponse = await axios.get(
          `https://kyc-api.surepass.io/api/v1/async/status/${clientId}`,
          {
            headers: {
              'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg',
            },
          }
        );

        const statusData = statusResponse.data;
        if (statusData && statusData.data.status === 'success') {
          if (statusData.data.api_resp.success) {
            setFormData(prev => ({ ...prev, aadhaarVerified: true }));
            showAlert('Aadhar verified successfully!');
          } else {
            showAlert(`Aadhar verification failed: ${statusData.data.api_resp.message} please check addhar number once again`);
          }
          setIsAadhaarLoading(false);
        } else if (statusData && statusData.data.status === 'pending') {
          setTimeout(() => pollAadhaarStatus(clientId, retries - 1), 3000);
        } else {
          showAlert('Aadhar verification failed. Please check the number and try again.');
          setIsAadhaarLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Aadhar status:', error);
        showAlert('An error occurred while checking Aadhar verification status.');
        setIsAadhaarLoading(false);
      }
    };

    try {
      const submitResponse = await axios.post(
        'https://kyc-api.surepass.io/api/v1/async/submit',
        {
          type: 'aadhaar_validation',
          body: {
            id_number: aadhaarNumber,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg',
          },
        }
      );

      if (submitResponse.data && submitResponse.data.success) {
        const clientId = submitResponse.data.data.client_id;
        pollAadhaarStatus(clientId);
      } else {
        showAlert('Failed to submit Aadhar for verification.');
        setIsAadhaarLoading(false);
      }
    } catch (error) {
      console.error('Error submitting Aadhar:', error);
      showAlert('An error occurred during Aadhar verification.');
      setIsAadhaarLoading(false);
    }
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
      // Verify Aadhaar & Phone first
      if (!formData.phoneOtpVerified || !formData.aadhaarVerified) {
        showAlert('Please verify your Aadhar and Phone number.');
        return;
      }
  
      // Collect required details
      const userLocal = (() => {
        try {
          return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
          return {};
        }
      })();

      const bookingDetails = {
        property_id: String(propertyId || '2'),
        start_date: format(new Date(formData.checkInDate), 'yyyy-MM-dd'),
        end_date: format(new Date(formData.checkOutDate), 'yyyy-MM-dd'),
        username: userLocal.username || username || '',
        phone_number: phoneDigits.join(''),
        aadhar_number: aadhaarNumber || '',
        user_photo: formData.uploadedPhoto || '',
        terms_verified: !!formData.termsAgreed,
        email: userLocal.email || '',
      };
      console.log('Booking details:', bookingDetails);
      // Create booking
      const { data } = await axios.post('https://townmanor.ai/api/booking', bookingDetails);
      const newBookingId =
        data?.booking?.id || data?.booking_id || data?.id || data?.bookingId || null;

      // Handle the expected response showing pricing summary
      if (data?.success && data?.booking) {
        const b = data.booking;
        showAlert(`Booking created successfully. Total: ${b.total_price}, Nights: ${b.nights}, From ${b.start_date} to ${b.end_date}`);
      }
  
      if (newBookingId) {
        setBookingId(newBookingId);
      }
  
      // Always proceed to payment
      await handleProceedToPayment(newBookingId);
  
    } catch (error) {
      console.error('Error creating booking:', error);
      showAlert('Failed to create booking. ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleProceedToPayment = async (bookingIdParam) => {
    console.log('Proceeding to payment for booking ID:', bookingIdParam);
    try {
      localStorage.setItem('paymentType', 'coliving');
      if (bookingIdParam) localStorage.setItem('bookingId', bookingIdParam);
      
      const userResponse = await fetch(`https://www.townmanor.ai/api/user/${username}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();

      const txnid = 'OID' + Date.now();

      const paymentData = {
        key: 'UvTrjC',
        txnid: txnid,
        amount: 1.00,
        productinfo: 'Room Booking',
        firstname: userData.name || username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        surl: `https://www.ovika.co.in/success`,
        furl: `https://www.ovika.co.in/failure`,
        udf1: bookingIdParam || '',
        service_provider: 'payu_paisa'
      };

      const response = await axios.post('https://townmanor.ai/api/payu/payment', paymentData);

      if (!response.data || !response.data.paymentUrl || !response.data.params) {
        throw new Error('Invalid payment response received');
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = response.data.paymentUrl;

      Object.entries(response.data.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

    } catch (error) {
      console.error('Payment initiation failed:', error);
      showAlert(error.response?.data?.message || error.message || 'Failed to initiate payment. Please try again.');
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
                  src={(property && property.images && property.images[0]) ? property.images[0] : '/image 71.png'}
                  alt="Property"
                  className="form-step-card-image"
                />
                <div className="form-step-card-content">
                  <h3 className="form-step-card-title">{property?.name || '—'}</h3>
                  <p className="form-step-card-location">{property?.address || ''}</p>
                  <p className="form-step-card-description">
                    {property?.description || ''}
                  </p>
                  {/* <ul className="form-step-card-amenities">
                    {(property?.amenities || []).map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul> */}
                  <p className="form-step-card-price">
                    <MdCurrencyRupee />{property?.per_night_price || 0}<span className="form-step-card-price-per-night">/night</span>
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
                      <span>Taxes & GST (5%)</span>
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
                       <label className="digit-inputs-label">Enter 6-digit OTP</label>
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