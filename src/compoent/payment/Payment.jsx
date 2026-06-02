
import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, UploadCloud, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import './Payment.css';
import { MdCurrencyRupee, MdOutlineCurrencyRupee } from 'react-icons/md';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { format } from 'date-fns';

// ========== OVIKA IDs ==========
const OVIKA_IDS = [287, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 77, 78, 79];
const isOvikaProperty = (id) => {
  const nid = Number(id);
  return nid >= 200 || OVIKA_IDS.includes(nid);
};
const OVIKA_PRICE_OVERRIDE = {
  287: 4000,  // ← yahan Ovika Signature 3 ka sahi ID daalo
};

// ========== CALENDAR API HELPERS ==========
const CALENDAR_API_BASE = 'https://www.townmanor.ai/api/booking/calendar';

async function getCalendar(propertyKey) {
  // Calendar fetch disabled per user request
  return { blocked: [] };
}

// ========== DISABLED DATE BUILDER ==========
const toYMD = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
};

function buildDisabledDates(blockedRanges = []) {
  const set = new Set();
  blockedRanges.forEach((r) => {
    const start = new Date(r.start);
    const end = new Date(r.end);
    for (let d = new Date(start); toYMD(d) < toYMD(end); d = addDays(d, 1)) {
      set.add(toYMD(d));
    }
  });
  return set;
}

// ========== CALENDAR COMPONENT ==========
const Calendar = ({ selectedDates, onDateSelect, minDate = new Date(), disabledDateSet = new Set(), onInvalidRange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const startOfToday = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateStr = date.toISOString().split('T')[0];
    return startOfDate < startOfToday || disabledDateSet.has(dateStr);
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

    const hasBlockedDateInRange = (start, end) => {
      if (!start || !end) return false;
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const dStr = d.toISOString().split('T')[0];
        if (disabledDateSet.has(dStr)) return true;
      }
      return false;
    };

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else {
      if (date > checkInDate) {
        if (hasBlockedDateInRange(checkInDate, date)) {
          onInvalidRange && onInvalidRange('Selected range includes unavailable dates. Please choose different dates.');
          return;
        }
        setCheckOutDate(date);
        onDateSelect({
          checkInDate: checkInDate.toISOString().split('T')[0],
          checkOutDate: date.toISOString().split('T')[0]
        });
      } else {
        if (hasBlockedDateInRange(date, checkInDate)) {
          onInvalidRange && onInvalidRange('Selected range includes unavailable dates. Please choose different dates.');
          return;
        }
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
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        
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

// ========== MAIN PAYMENT COMPONENT ==========
function Payment() {
  const [step, setStep] = useState(1);
  const [property, setProperty] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState('');
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    aadhaarVerified: false,
    passportVerified: false,
    mobileVerified: false,
    uploadedPhoto: null,
    termsAgreed: false,
  });

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isAadhaarLoading, setIsAadhaarLoading] = useState(false);

  const [mobileNumber, setMobileNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isMobileVerifying, setIsMobileVerifying] = useState(false);

  const [verificationMethod, setVerificationMethod] = useState('aadhaar');

  const [pricing, setPricing] = useState({
    subtotal: 0,
    discount: 0,
    gst: 0,
    securityDeposit: 0,
    total: 0,
  });

  const [isPayNowEnabled, setIsPayNowEnabled] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const [bookingId, setBookingId] = useState(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [disabledDateSet, setDisabledDateSet] = useState(new Set());
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const STORAGE_KEYS = {
    step: 'payment_step',
    formData: 'payment_formData',
    aadhaar: 'payment_aadhaarNumber',
  };
  const hasLoadedFromStorageRef = useRef(false);

  useEffect(() => {
    try {
      const savedStepRaw = localStorage.getItem(STORAGE_KEYS.step);
      const savedStep = savedStepRaw ? parseInt(savedStepRaw, 10) : null;
      const savedFormData = JSON.parse(localStorage.getItem(STORAGE_KEYS.formData) || '{}');
      const savedAadhaar = localStorage.getItem(STORAGE_KEYS.aadhaar) || '';

      if (!Number.isNaN(savedStep) && savedStep && savedStep >= 1 && savedStep <= 6) {
        setStep(savedStep);
      }
      if (savedFormData && typeof savedFormData === 'object') {
        setFormData(prev => ({ ...prev, ...savedFormData }));
      }
      if (savedAadhaar) {
        setAadhaarNumber(savedAadhaar);
      }
    } catch (error) {
      console.warn('Failed to restore payment progress from storage', error);
    } finally {
      hasLoadedFromStorageRef.current = true;
    }
  }, []);

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
    localStorage.setItem(STORAGE_KEYS.aadhaar, aadhaarNumber);
  }, [aadhaarNumber]);

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

  const steps = [
    'Property',
    'Terms',
    'Dates & Pricing',
    'Verification',
    'Photo Upload',
    'Payment',
  ];

  const handleNext = () => {
    if (step === 3 && (!formData.checkInDate || !formData.checkOutDate || pricing.total <= 0)) return;
    if (step === 4 && (!(formData.aadhaarVerified || formData.passportVerified) || !formData.mobileVerified)) return;
    if (step === 5 && !formData.uploadedPhoto) return;

    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const pricePerNight = property?.per_night_price ? Number(property.per_night_price) : 0;
      const subtotal = diffDays * pricePerNight;
      const totalCouponDiscount = couponDiscount * diffDays;
      const discountedSubtotal = Math.max(0, subtotal - totalCouponDiscount);
      const gst = discountedSubtotal * 0.05;
      const securityDeposit = pricePerNight; // 1 night's rent — refundable
      const total = discountedSubtotal + gst + securityDeposit;

      setPricing({ subtotal, discount: totalCouponDiscount, gst, securityDeposit, total });
    } else {
      setPricing({ subtotal: 0, discount: 0, gst: 0, securityDeposit: 0, total: 0 });
    }
  }, [formData.checkInDate, formData.checkOutDate, property, couponDiscount]);

  useEffect(() => {
    const allStepsComplete =
      (formData.checkInDate && formData.checkOutDate && pricing.total > 0) &&
      (formData.aadhaarVerified || formData.passportVerified) &&
      formData.mobileVerified &&
      formData.uploadedPhoto;
    setIsPayNowEnabled(allStepsComplete);
  }, [formData, pricing]);

  // ✅ FIXED: TM Luxe 3 (id=287) ke liye Ovika API se fetch, baaki ke liye purani API
  useEffect(() => {
    const id = propertyId || '2';
    const numId = Number(id);

    const fetchProperty = async () => {
      setPropertyLoading(true);
      setPropertyError('');
      try {
        if (OVIKA_IDS.includes(numId)) {
          // ── Ovika API (TM Luxe 3) ──
          const res = await fetch(`https://www.townmanor.ai/api/ovika/properties/${numId}`);
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          const json = await res.json();
          const raw = json?.data ?? json;
          setProperty({
            id: raw.id,
            name: raw.property_name,
            description: raw.description,
            address: raw.address,
            images: Array.isArray(raw.photos) ? raw.photos : [],
            amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
            // per_night_price: Number(raw.price) || 4000,   // ✅ Use actual price or fallback
            per_night_price: OVIKA_PRICE_OVERRIDE[numId] ?? Number(raw.price) ?? 4000,
            latitude: raw.latitude,
            longitude: raw.longitude,
            calendar_key: raw.calendar_key || `prop-${raw.id}`
          });
        } else {
          // ── Purani API (TM Luxe 1 & 2) ──
          const res = await fetch(`https://www.townmanor.ai/api/properties/${id}`);
          const json = await res.json();
          if (json && json.success && json.property) {
            setProperty(json.property);
          } else {
            setPropertyError('Failed to load property');
          }
        }
      } catch (e) {
        setPropertyError('Failed to load property: ' + e.message);
      } finally {
        setPropertyLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // ✅ FIXED: propertyKeyMap mein TM Luxe 3 (id=287) add kiya
  useEffect(() => {
    const fetchCalendarBlockedDates = async () => {
      try {
        setBookingsLoading(true);
        const pid = Number(propertyId || '2');
        const propertyKeyMap = {
          2: 'tm-luxe-1',
          1: 'tm-luxe-2',
          287: 'tm-luxe-3',
        };
        const propertyKey = property?.calendar_key || propertyKeyMap[pid] || `prop-${pid}`;

        const { blocked } = await getCalendar(propertyKey);
        const disabledSet = buildDisabledDates(blocked || []);
        setDisabledDateSet(disabledSet);
      } catch (e) {
        console.error('Failed to load calendar blocked dates', e);
        try {
          const res = await fetch('https://www.townmanor.ai/api/booking/dates');
          const json = await res.json();
          const pid = Number(propertyId || '2');
          const bookings = Array.isArray(json?.bookings) ? json.bookings : [];
          const filtered = bookings.filter(b => Number(b.property_id) === pid && Number(b.cancelled) === 0);
          const dates = new Set();
          filtered.forEach(b => {
            const start = new Date(b.start_date);
            const end = new Date(b.end_date);
            for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
              const dStr = d.toISOString().split('T')[0];
              dates.add(dStr);
            }
          });
          setDisabledDateSet(dates);
        } catch (fallbackErr) {
          console.error('Fallback booking dates fetch also failed', fallbackErr);
        }
      } finally {
        setBookingsLoading(false);
      }
    };

    if (step === 3) {
      fetchCalendarBlockedDates();
    }
  }, [step, propertyId]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.type.startsWith('image/')) {
      setIsPhotoUploading(true);
      setUploading(true);
      
      const formDataLocal = new FormData();
      formDataLocal.append('images', file);
      
      try {
        const response = await fetch('https://www.townmanor.ai/api/image/aws-upload-owner-images', {
          method: 'POST',
          body: formDataLocal,
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

  const handleVerifyAadhaar = async () => {
    setFormData(prev => ({ ...prev, aadhaarVerified: false }));
    
    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
      showAlert('Please enter a valid 12-digit Aadhaar number (digits only, no spaces or dashes).');
      return;
    }
  
    if (/^[0-1]{12}$/.test(aadhaarNumber) || /^(\d)\1{11}$/.test(aadhaarNumber)) {
      showAlert('The Aadhaar number appears to be invalid. Please check and try again.');
      return;
    }
  
    setIsAadhaarLoading(true);
    showAlert('Verifying Aadhaar number. This may take a moment...');
  
    try {
      const response = await axios.post(
        'https://kyc-api.surepass.app/api/v1/aadhaar-validation/aadhaar-validation',
        { id_number: aadhaarNumber },
        {
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg',
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data && response.data.success) {
        setFormData(prev => ({ ...prev, aadhaarVerified: true }));
        showAlert('Aadhaar verified successfully!');
      } else {
        const errorMessage = response.data?.message || 'Verification failed';
        showAlert(`Aadhaar verification failed: ${errorMessage}. Please ensure the number is correct and try again.`);
      }
    } catch (error) {
      console.error('Aadhaar verification error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed';
      showAlert(`Aadhaar verification failed: ${errorMessage}. Please try again later.`);
    } finally {
      setIsAadhaarLoading(false);
    }
  };

  const handleGenerateOTP = async () => {
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      showAlert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsOtpLoading(true);
    showAlert('Sending OTP to your mobile...');

    try {
      const response = await axios.post(
        'https://kyc-api.surepass.app/api/v1/telecom/generate-otp',
        { id_number: mobileNumber },
        {
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success && response.data.data?.client_id) {
        setClientId(response.data.data.client_id);
        setOtpSent(true);
        showAlert('OTP sent successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP generation error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || "Wrong phone number or API error";
      showAlert(`Error: ${errorMessage}`);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpInput || otpInput.length < 4) {
      showAlert('Please enter a valid OTP.');
      return;
    }

    if (!clientId) {
      showAlert('Client ID missing. Please request OTP again.');
      return;
    }

    setIsMobileVerifying(true);
    showAlert('Verifying OTP...');

    try {
      const response = await axios.post(
        'https://kyc-api.surepass.app/api/v1/telecom/submit-otp',
        {
          client_id: clientId,
          otp: otpInput
        },
        {
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        setFormData(prev => ({ ...prev, mobileVerified: true }));
        showAlert('Mobile number verified successfully!');
      } else {
        throw new Error(response.data?.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed';
      showAlert(`Error: ${errorMessage}`);
    } finally {
      setIsMobileVerifying(false);
    }
  };

  const PASSPORT_VERIFY_URL = 'https://kyc-api.surepass.app/api/v1/passport/passport/passport-details';
  const SUREPASS_HEADERS = {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const [passportInput, setPassportInput] = useState('');
  const [passportDob, setPassportDob] = useState('');
  const [isPassportLoading, setIsPassportLoading] = useState(false);
  const [passportError, setPassportError] = useState('');

  const handleVerifyPassport = async () => {
    setFormData(prev => ({ ...prev, passportVerified: false }));
    setPassportError('');
    
    const fileNumber = passportInput?.trim();
    if (!fileNumber || fileNumber.length < 5) {
      showAlert('Please enter a valid passport file number (at least 5 characters).');
      return;
    }
    
    if (!passportDob) {
      showAlert('Please enter your date of birth for verification.');
      return;
    }

    let formattedDob;
    try {
      formattedDob = new Date(passportDob).toISOString().split('T')[0];
    } catch (e) {
      showAlert('Please enter a valid date of birth.');
      return;
    }

    setIsPassportLoading(true);
    showAlert('Verifying passport details. Please wait...');

    try {
      const response = await axios.post(
        PASSPORT_VERIFY_URL,
        {
          id_number: fileNumber,
          dob: formattedDob
        },
        {
          headers: SUREPASS_HEADERS,
          timeout: 30000,
          withCredentials: true
        }
      );

      if (response.data.success && response.data.data) {
        const passportData = response.data.data;
        setFormData(prev => ({
          ...prev,
          passportVerified: true,
          fullName: passportData.full_name || prev.fullName,
          dob: formattedDob,
          passportNumber: passportData.passport_number || fileNumber,
          verificationData: response.data.data,
          fileNumber: fileNumber
        }));
        showAlert('Passport verified successfully!');
      } else {
        throw new Error(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Passport verification error:', error);
      let errorMessage = 'Failed to verify passport. Please check the number and try again.';
      
      if (error.response) {
        const responseData = error.response.data || {};
        errorMessage = responseData.message || 
                      responseData.error || 
                      error.response.statusText || 
                      `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = 'No response from verification service. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setPassportError(errorMessage);
      showAlert(`Verification failed: ${errorMessage}`);
    } finally {
      setIsPassportLoading(false);
    }
  };

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

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const numId = Number(propertyId);
    if (code === 'OVIKA500' && numId === 77) {
      setCouponDiscount(500);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponDiscount(0);
      setCouponApplied(false);
      setCouponError('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError('');
  };

  const handlePayNow = async () => {
    if (!isPayNowEnabled || isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      if (!(formData.aadhaarVerified || formData.passportVerified)) {
        showAlert('Please verify your Aadhaar or Passport before proceeding.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.mobileVerified) {
        showAlert('Please verify your mobile number before proceeding.');
        setIsSubmitting(false);
        return;
      }

      // ✅ Ovika Properties (New Flow) — skip internal booking API, directly use PayU
      if (isOvikaProperty(propertyId)) {
        const tm3BookingRef = 'TM3-' + Date.now();
        localStorage.setItem('bookingId', tm3BookingRef);
        await handleProceedToPayment(tm3BookingRef);
        return;
      }

      // ── TM Luxe 1 & 2 — purana booking flow ──
      const userLocal = (() => {
        try {
          return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
          return {};
        }
      })();

      let userEmail = userLocal.email || '';
      let userPhone = mobileNumber || '9999999999';
      
      if (username) {
        try {
          const userResponse = await fetch(`https://www.townmanor.ai/api/user/${username}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            userEmail = userData.email || userEmail;
            userPhone = userData.phone || userPhone;
          }
        } catch (err) {
          console.warn('Could not fetch user data:', err);
        }
      }

      const bookingDetails = {
        property_id: propertyId || '2',
        start_date: format(new Date(formData.checkInDate), 'yyyy-MM-dd'),
        end_date: format(new Date(formData.checkOutDate), 'yyyy-MM-dd'),
        username: userLocal.username || username || 'guest',
        phone_number: userPhone,
        id_type: verificationMethod || 'aadhaar',
        aadhar_number: verificationMethod === 'aadhaar' ? (aadhaarNumber || '') : '',
        passport_number: verificationMethod === 'passport' ? (passportInput || '') : '',
        passport_dob: verificationMethod === 'passport' ? (passportDob || '') : '',
        passport_name: verificationMethod === 'passport' ? (formData.fullName || '') : '',
        user_photo: formData.uploadedPhoto || '',
        terms_verified: true,
        email: userEmail || 'guest@townmanor.ai',
        subtotal: pricing.subtotal || 0,
        discount_amount: pricing.discount || 0,
        gst_amount: pricing.gst || 0,
        security_deposit: pricing.securityDeposit || 0,
        total_price: pricing.total || 0,
      };
      
      console.log('Booking details being sent:', bookingDetails);
      
      const { data } = await axios.post('https://www.townmanor.ai/api/booking-request', bookingDetails, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Booking API response:', data);
      
      const newBookingId = data?.booking?.id || data?.booking_id || data?.id || data?.bookingId || data?.request_id || data?.requestId || null;

      if (data?.success && data?.booking) {
        const b = data.booking;
        showAlert(`Booking created successfully! Total: ₹${b.total_price}, Nights: ${b.nights}`);
      } else if (!newBookingId) {
        throw new Error('Booking created but no booking ID received');
      }
  
      if (newBookingId) {
        setBookingId(newBookingId);
        try {
          localStorage.setItem('bookingId', String(newBookingId));
        } catch {}
        
        await handleProceedToPayment(newBookingId);
      } else {
        throw new Error('Failed to create booking - no booking ID');
      }
  
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create booking';
      showAlert(`Booking failed: ${errorMsg}. Please try again.`);
      setIsSubmitting(false);
    }
  };
  
  const handleProceedToPayment = async (bookingIdParam) => {
    console.log('Proceeding to payment for booking ID:', bookingIdParam);
    
    if (!bookingIdParam) {
      showAlert('Booking ID missing. Cannot proceed to payment.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      localStorage.setItem('paymentType', 'coliving');
      localStorage.setItem('bookingId', String(bookingIdParam));
      localStorage.setItem('paymentAmount',   String(pricing.total));
      localStorage.setItem('paymentSubtotal', String(pricing.subtotal));
      localStorage.setItem('paymentGst',      String(pricing.gst));
      localStorage.setItem('paymentDiscount', String(pricing.discount));
      
      const userResponse = await fetch(`https://www.townmanor.ai/api/user/${username}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();

      const txnid = 'OID' + Date.now();

      const paymentData = {
        key: 'UvTrjC',
        txnid: txnid,
        amount: pricing.total.toFixed(2),
        productinfo: 'Room Booking',
        firstname: userData.name || username || 'Guest',
        email: userData.email || 'guest@townmanor.ai',
        phone: userData.phone || mobileNumber || '',
        surl: `https://www.townmanor.ai/api/boster/payu/success?redirectUrl=https://ovikaliving.com/success`,
        furl: `https://www.townmanor.ai/api/boster/payu/failure?redirectUrl=https://ovikaliving.com/failure`,
        udf1: String(bookingIdParam),
        service_provider: 'payu_paisa'
      };

      console.log('Payment data being sent:', paymentData);

      const response = await axios.post('https://www.townmanor.ai/api/payu/payment', paymentData);

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
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="booking-form-wrapper">
        <div className="booking-form-container">
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

          <div>
            {step === 1 && (
              <div>
                <h2 className="form-step-title">Property Details</h2>
                {propertyLoading ? (
                  <div style={{ padding: '24px' }}>Loading property...</div>
                ) : propertyError ? (
                  <div style={{ padding: '24px', color: 'red' }}>{propertyError}</div>
                ) : (
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
                      <p className="form-step-card-price">
                        <MdCurrencyRupee />{property?.per_night_price || 0}<span className="form-step-card-price-per-night">/night</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                      disabledDateSet={disabledDateSet}
                      onInvalidRange={showAlert}
                    />
                    {bookingsLoading && (
                      <p style={{ marginTop: '8px', color: '#666' }}>Loading availability…</p>
                    )}
                  </div>

                  <div className="pricing-summary-card">
                    <h3 className="pricing-summary-title">Pricing Summary</h3>
                    <div className="pricing-item-list">
                      <div className="pricing-item">
                        <span>Subtotal</span>
                        <span><MdCurrencyRupee/>{pricing.subtotal.toFixed(2)}</span>
                      </div>
                      {couponApplied && pricing.discount > 0 && (
                        <div className="pricing-item" style={{ color: '#16a34a' }}>
                          <span>Coupon Discount (OVIKA500 · ₹500/night)</span>
                          <span>- <MdCurrencyRupee/>{pricing.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pricing-item">
                        <span>Taxes & GST (5%)</span>
                        <span><MdCurrencyRupee/>{pricing.gst.toFixed(2)}</span>
                      </div>
                      {pricing.securityDeposit > 0 && (
                        <div className="pricing-item" style={{ color: '#0369a1' }}>
                          <span>Security Deposit <span style={{ fontSize: '0.75rem' }}>(1 night · Refundable)</span></span>
                          <span><MdCurrencyRupee/>{pricing.securityDeposit.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pricing-total">
                        <span>Total Price</span>
                        <span><MdCurrencyRupee/>{pricing.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '14px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Have a coupon code?</p>
                      {!couponApplied ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                            placeholder="Enter coupon code"
                            style={{ flex: 1, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem' }}
                          />
                          <button
                            onClick={handleApplyCoupon}
                            style={{ padding: '8px 14px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Apply
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', padding: '8px 12px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: '600' }}>✓ OVIKA500 applied — ₹500/night off!</span>
                          <button
                            onClick={handleRemoveCoupon}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      {couponError && (
                        <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '6px' }}>{couponError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="form-step-title">Verification</h2>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ marginRight: '12px' }}>
                    <input 
                      type="radio" 
                      name="verif-method" 
                      value="aadhaar" 
                      checked={verificationMethod === 'aadhaar'} 
                      onChange={() => setVerificationMethod('aadhaar')} 
                    /> Aadhaar
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="verif-method" 
                      value="passport" 
                      checked={verificationMethod === 'passport'} 
                      onChange={() => setVerificationMethod('passport')} 
                    /> Passport
                  </label>
                </div>

                <div className="veri-container-1">
                  {verificationMethod === 'aadhaar' ? (
                    <div className="veri-card-1">
                      <h3 className="veri-title-1">Aadhaar Check</h3>
                      <label className="veri-label-1">Enter Aadhaar Number</label>
                      <div className="veri-aadhaar-wrap-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={12}
                          value={aadhaarNumber}
                          onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                          className="veri-input-1"
                          disabled={formData.aadhaarVerified}
                          placeholder="12-digit Aadhaar"
                        />
                        <button
                          onClick={handleVerifyAadhaar}
                          disabled={formData.aadhaarVerified || !aadhaarNumber || isAadhaarLoading}
                          className={`veri-btn-1 ${
                            formData.aadhaarVerified
                              ? "veri-btn-verified-1"
                              : "veri-btn-default-1"
                          }`}
                        >
                          {formData.aadhaarVerified
                            ? "Verified"
                            : isAadhaarLoading
                            ? "Verifying…"
                            : "Verify Aadhaar"}
                        </button>
                      </div>
                      <div className="veri-icon-1">
                        {formData.aadhaarVerified ? (
                          <CheckCircle size={24} color="#8b0000" />
                        ) : isAadhaarLoading ? (
                          <Loader size={24} className="animate-spin text-gray-400" />
                        ) : (
                          <XCircle size={24} color="gray" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="veri-card-1">
                      <h3 className="veri-title-1">Passport Verification</h3>
                      
                      <div className="mb-4">
                        <label className="veri-label-1 block mb-1">Passport File Number</label>
                        <input
                          type="text"
                          value={passportInput}
                          onChange={(e) => setPassportInput(e.target.value)}
                          className="veri-input-1 w-full"
                          disabled={formData.passportVerified || isPassportLoading}
                          placeholder="Enter passport file number"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="veri-label-1 block mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={passportDob}
                          onChange={(e) => setPassportDob(e.target.value)}
                          className="veri-input-1 w-full"
                          disabled={formData.passportVerified || isPassportLoading}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={handleVerifyPassport}
                          disabled={formData.passportVerified || !passportInput || !passportDob || isPassportLoading}
                          className={`veri-btn-1 ${
                            formData.passportVerified ? "veri-btn-verified-1" : "veri-btn-default-1"
                          }`}
                        >
                          {formData.passportVerified ? "Verified" : isPassportLoading ? "Verifying…" : "Verify Passport"}
                        </button>
                      </div>
                      {passportError && <p style={{ color: 'red', marginTop: 6 }}>{passportError}</p>}
                      <div className="veri-icon-1">
                        {formData.passportVerified ? (
                          <CheckCircle size={24} color="#8b0000" />
                        ) : isPassportLoading ? (
                          <Loader size={24} className="animate-spin text-gray-400" />
                        ) : (
                          <XCircle size={24} color="gray" />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="veri-card-1" style={{ marginTop: '20px' }}>
                    <h3 className="veri-title-1">Mobile OTP Verification (Mandatory)</h3>
                    
                    <div className="mb-4">
                      <label className="veri-label-1 block mb-1">Mobile Number</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        className="veri-input-1 w-full"
                        disabled={formData.mobileVerified || otpSent}
                        placeholder="10-digit mobile number"
                      />
                    </div>

                    {!otpSent ? (
                      <button
                        onClick={handleGenerateOTP}
                        disabled={!mobileNumber || mobileNumber.length !== 10 || isOtpLoading}
                        className="veri-btn-1 veri-btn-default-1 w-full"
                      >
                        {isOtpLoading ? 'Sending OTP...' : 'Send OTP'}
                      </button>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="veri-label-1 block mb-1">Enter OTP</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            className="veri-input-1 w-full"
                            disabled={formData.mobileVerified}
                            placeholder="6-digit OTP"
                          />
                        </div>

                        <button
                          onClick={handleVerifyOTP}
                          disabled={!otpInput || formData.mobileVerified || isMobileVerifying}
                          className={`veri-btn-1 ${formData.mobileVerified ? 'veri-btn-verified-1' : 'veri-btn-default-1'} w-full`}
                        >
                          {formData.mobileVerified ? 'Verified' : isMobileVerifying ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </>
                    )}

                    <div className="veri-icon-1">
                      {formData.mobileVerified ? (
                        <CheckCircle size={24} color="#8b0000" />
                      ) : isMobileVerifying ? (
                        <Loader size={24} className="animate-spin text-gray-400" />
                      ) : (
                        <XCircle size={24} color="gray" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            {step === 6 && (
              <div>
                <h2 className="form-step-title">Payment</h2>
                <div className="payment-container">
                  <p className="payment-price-text">
                    Final Price: <span className="payment-price-amount"><MdOutlineCurrencyRupee size={20} />{pricing.total.toFixed(2)}</span>
                  </p>
                  {pricing.securityDeposit > 0 && (
                    <p style={{ fontSize: '0.82rem', color: '#0369a1', marginBottom: '12px', background: '#eff6ff', padding: '6px 10px', borderRadius: '6px' }}>
                      🔒 Includes Security Deposit of ₹{pricing.securityDeposit.toFixed(2)} (1 night · Refundable after check-out)
                    </p>
                  )}
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
              disabled={step === steps.length}
              className="navigation-button next-button"
            >
              Next
            </button>
          </div>
        </div>
        {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      </div>
    </>
  );
}

export default Payment;

