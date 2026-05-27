import React, { useState, useEffect, useContext } from "react";
import "./pg-listing-form.css";
import { AuthContext } from "../Login/AuthContext";
import CityDropdown, { addressContainsCityOrState } from "./CityDropdown";
import { 
  Building, 
  Home, 
  Hotel, 
  Users, 
  MapPin, 
  Info, 
  FileText, 
  Camera, 
  CreditCard, 
  ShieldCheck,
  Zap,
  Wifi,
  Trash2,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Plus
} from "lucide-react";

const API_BASE = "https://www.townmanor.ai/api";

const TimePickerAMPM = ({ value, onChange }) => {
  const parse = (t) => {
    if (!t) return { h: 10, m: '00', period: 'PM' };
    const [hStr, mStr = '00'] = t.split(':');
    const h24 = parseInt(hStr, 10);
    return {
      h: h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24,
      m: mStr.padStart(2, '0'),
      period: h24 < 12 ? 'AM' : 'PM',
    };
  };
  const emit = (h, m, period) => {
    let hour = parseInt(h, 10);
    if (period === 'AM' && hour === 12) hour = 0;
    if (period === 'PM' && hour !== 12) hour += 12;
    onChange(`${String(hour).padStart(2, '0')}:${m}:00`);
  };
  const { h, m, period } = parse(value);
  const selStyle = { flex: 1, minWidth: 0, padding: '8px 6px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff', color: '#1e293b' };
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <select value={h} onChange={e => emit(e.target.value, m, period)} style={selStyle}>
        {[12,1,2,3,4,5,6,7,8,9,10,11].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <select value={m} onChange={e => emit(h, e.target.value, period)} style={selStyle}>
        {['00','15','30','45'].map(min => <option key={min} value={min}>{min}</option>)}
      </select>
      <select value={period} onChange={e => emit(h, m, e.target.value)} style={selStyle}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

const PROPERTY_CATEGORIES = [
  { id: "Flat", label: "Flat / Apartment", sub: "Apartments, Penthouses, Studio", icon: <Building size={20} /> },
  { id: "House", label: "House / Villa / Farmhouse", sub: "Independent Home, Bungalow, Luxury Villa & Farmhouse", icon: <Home size={20} /> },
  { id: "PG", label: "PG / Hostel", sub: "Shared accommodation", icon: <Users size={20} /> },
  { id: "Penthouse", label: "Penthouse", sub: "Top floor luxury", icon: <Building size={20} /> },
  { id: "Studio", label: "Studio Apartment", sub: "1Room Kitchen sets", icon: <Zap size={20} /> },
  { id: "Suite", label: "Suite", sub: "Luxury Suites & Living", icon: <Hotel size={20} /> },
];

const FLOOR_TYPES = ["Vitrifed Tiles", "Marble", "Wooden", "Granite", "Mosaic", "Normal", "Laminate", "Carpeted"];
const WATER_SUPPLIES = ["Corporation (MCG)", "Borewell", "Dual (Both)", "Tanker", "Rainwater Harvesting"];
const PROPERTY_AGE = ["New Construction", "0-1 Year", "1-5 Years", "5-10 Years", "10+ Years", "Under Construction"];
const HOUSE_RULES = ["Smoking Allowed", "Pets Allowed", "Events Allowed", "Drinking Allowed", "Late Entry Allowed", "Friends Allowed", "Veg Only", "Non-Veg Allowed", "Girlfriend/Boyfriend Entry Allowed", "Couple Friendly"];
const WINDOW_TYPES = ["Normal", "Large / Full Sized", "French Windows", "Bay Windows", "No Window", "Sky Light"];

const FURNISHING_STATUS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const SHARING_TYPES = ["Private Room", "Double Sharing", "Triple Sharing", "Four Sharing", "Five Sharing", "Dormitory"];
const TENANT_PREFERENCES = ["Bachelors (Any)", "Bachelors (Female Only)", "Bachelors (Male Only)", "Family", "Working Professionals", "Students Only", "No Preference"];
const CANCELLATION_POLICIES = ["Flexible: Full refund 1 day prior", "Moderate: Full refund 5 days prior", "Strict: 50% refund 7 days prior", "No Refund"];
const FACING_OPTIONS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];

const AMENITIES_MASTER = {
  "Safety & Security": ["CCTV", "Security Guard", "Fire Extinguisher", "Intercom", "Biometric Entry", "Gated Community", "Fire Alarm", "Sprinklers", "Smoke Detectors", "Emergency Exit", "Electronic Entry Lock", "Electronic Bedroom Lock", "Sprinkler"],
  "Modern Living": ["Lift", "Power Backup", "Wi-Fi", "Swimming Pool", "Gym", "Clubhouse", "Modular Kitchen", "Chimney", "Central AC", "Smart Home Tech", "EV Charging Point", "Vending Machine"],
  "Basic Utilities": ["Water Supply 24/7", "Borewell", "Corporation Water", "Gas Pipeline", "Solar Water", "Reserved Parking", "Visitor Parking", "STP Plant", "Waste Management"],
  "Indoor Features": ["Air Conditioner", "Geyser", "RO Water", "Washing Machine", "Refrigerator", "Inverter", "Wardrobe", "Study Table", "Smart TV", "Google TV", "Gas Stove", "Dishwasher", "Microwave", "Iron & Board"],
  "Bathroom": ["Bath Towels", "Soap & Shampoo"],
  "Kitchen Appliances": ["Electric Kettle", "Hob", "Toaster", "Rice Cooker", "Coffee Maker", "Induction Cooktop", "Dining Counter", "Cooking utensils"],
  "Outer Spaces": ["Balcony", "Private Terrace", "Garden", "Park Area", "Pet Area", "Kids Play Area", "Club House", "Jogging Track", "Library", "Indoor Games Area"]
};

const PROPERTY_TYPES = {
  "Flat": ["Standard Apartment", "Studio Apartment", "Penthouse", "Duplex", "Service Apartment"],
  "House": ["Independent House", "Bungalow", "Row House", "Luxury Villa", "Farmhouse", "Holiday Home"],
  "PG": ["Girls PG", "Boys PG", "Co-living Space", "Student Hostel"],
  "Penthouse": ["Luxury Penthouse", "Duplex Penthouse", "Studio Penthouse"],
  "Studio": ["1RK Studio", "1BHK Studio", "Luxury Studio"],
  "Suite": ["Standard Suite", "Executive Suite", "Presidential Suite", "Junior Suite"],
};

const FURNISHING_ITEMS = ["Fridge", "Sofa", "Study Table", "Geyser", "AC", "Washing Machine", "Microwave", "Cupboard", "Bed", "TV", "Mirror", "Curtains", "Shoe Rack", "Bookshelf", "Dishwasher", "Air Purifier", "Iron Table", "Chair", "Desk Lamp"];
const BED_TYPES = [
  "Single Bed", "Double Bed", "Queen Bed", "King Bed", 
  "Bunk Bed", "Twin Bed", "Sofa Bed", "Folding Bed", "Diwan", "Floor Mattress", "None"
];
const ROOM_CATEGORIES = ["Master Bedroom", "Regular Bedroom", "Guest Room", "Study Room", "Staff Room"];

const BOOKING_TYPES = [
  { id: 0, label: "Instant Booking", desc: "Guests can book instantly without waiting for approval." },
  { id: 1, label: "Request to Book", desc: "You review and accept or decline booking requests." }
];

const BATHROOM_TYPES = ["Attached", "Common", "En-suite", "Jack & Jill", "Separate", "Other"];
const defaultBathroomEntry = () => ({ type: "Attached", count: 1 });

// ─── isPG helper ─────────────────────────────────────────────────────────────
const isPGCategory = (cat) => cat === "PG";

// ─── Check if all rooms have same/no price (for non-PG) ──────────────────────
const allRoomsSamePrice = (rooms) => {
  const prices = rooms.map(r => String(r.price || "").trim()).filter(Boolean);
  if (prices.length === 0) return true;
  return prices.every(p => p === prices[0]);
};

function useFilePreviews() {
  const [previews, setPreviews] = useState([]);
  const update = (files) => {
    const arr = Array.from(files || []);
    const readers = arr.map((file) => {
      return new Promise((res) => {
        const r = new FileReader();
        r.onload = (e) => res({ name: file.name, url: e.target.result, file });
        r.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((newResults) => {
       setPreviews(prev => {
         const combined = [...prev, ...newResults];
         return combined.slice(0, 15);
       });
    });
  };
  const remove = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  return { previews, update, remove };
}

function isAcceptedFile(file) {
  if (!file) return false;
  const ext = (file.name || "").split(".").pop()?.toLowerCase() || "";
  return ["jpg", "jpeg", "png", "webp", "avif", "pdf"].includes(ext);
}

const PGListingForm = () => {
  const { user } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  // ── KEY NEW STATE: per-room pricing toggle (only for non-PG) ─────────────
  const [usePerRoomPricing, setUsePerRoomPricing] = useState(false);

  const [form, setForm] = useState({
    propertyCategory: "Flat",
    propertyType: "Apartment",
    title: "",
    mainDescription: "",
    address: "",
    country: "India",
    postalCode: "",
    city: "",
    latitude: "",
    longitude: "",
    
    bedrooms: 2,
    bathrooms: 2,
    bathroomDetails: [defaultBathroomEntry()],
    balconies: 1,
    floorNo: "",
    totalFloors: "",
    area: "",
    furnishing: FURNISHING_STATUS[1],
    facing: FACING_OPTIONS[0],
    
    bedroomDetails: [{ 
      id: 0, 
      type: "Regular Bedroom", 
      roomNumber: "",
      bedType: "Queen Bed",
      bedCount: 1,
      ac: true,
      furnished: true,
      furnishingDetails: [], 
      attachedBathroom: true,
      price: "",          // per-room price (only used when usePerRoomPricing=true for non-PG, or always for PG)
      securityDeposit: "",
      maintenanceCharge: "",
      maintenanceCycle: "Monthly",
      areaSqFt: "",
      availabilityDate: "",
      windowType: "Normal",
      roomFloorType: "Same as Property",
    }],
    
    waterSupply: WATER_SUPPLIES[0],
    electricityStatus: "24 Hours Power Cut Rare",
    floorType: FLOOR_TYPES[0],
    propertyAge: PROPERTY_AGE[0],
    carParking: "1 Open",
    preferredTenants: [TENANT_PREFERENCES[0]],
    houseRules: ["Couple Friendly"],
    
    foodAvailable: false,
    foodDetails: { breakfast: true, lunch: false, dinner: true, type: "Both" },
    noticePeriod: "",
    lockInPeriod: "",
    gateClosingTime: "22:00:00",
    
    baseRate: "",         // property-level price (used when usePerRoomPricing=false for non-PG)
    securityDeposit: "",
    maintenanceCharge: "",
    maintenanceCycle: "Monthly",
    availableFrom: "",
    
    amenities: {},
    smokingAllowed: false,
    petsAllowed: false,
    eventsAllowed: false,
    drinkingAllowed: false,
    
    bookingType: 1,
    registrationNumber: "",
    cancellationPolicy: CANCELLATION_POLICIES[0],
    
    youtubeLink: "",
    virtualTourLink: "",
    electricityCharges: "As per Meter / Unit",
    waterCharges: "Included in Rent",
    
    transportTips: { metro: "", bus: "", walk: "" },
    essentialsNearby: { grocery: "", medical: "", shopping: "" },
    cafesRestaurants: [{ name: "", distance: "" }],
    houseSpecificTips: [""],
    discount90Days: "",
    discount180Days: "",
    maxGuests: 1,
  });

  const photoPreviews = useFilePreviews();
  const [coverIndex, setCoverIndex] = useState(0);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpClientId, setOtpClientId] = useState(null);

  // ── isPG shorthand ────────────────────────────────────────────────────────
  const isPG = isPGCategory(form.propertyCategory);

  // ── When category switches to PG, force per-room pricing on (PG always has room-wise prices) ──
  useEffect(() => {
    if (isPG) setUsePerRoomPricing(true);
    else setUsePerRoomPricing(false);
  }, [form.propertyCategory]);

  const STEPS = [
    { id: 0, title: "Category", icon: <Zap size={18} /> },
    { id: 1, title: "Info", icon: <Info size={18} /> },
    { id: 2, title: "Details", icon: <FileText size={18} /> },
    { id: 3, title: "Amenities", icon: <Wifi size={18} /> },
    { id: 4, title: "Local Guide", icon: <MapPin size={18} /> },
    { id: 5, title: "Photos", icon: <Camera size={18} /> },
    { id: 6, title: "Pricing", icon: <CreditCard size={18} /> },
    { id: 7, title: "Verification", icon: <ShieldCheck size={18} /> },
  ];

  useEffect(() => {
    const all = {};
    Object.values(AMENITIES_MASTER).flat().forEach((a) => (all[a] = false));
    setForm((f) => ({ ...f, amenities: all }));
  }, []);

  const validateStep = (s) => {
    const err = {};
    if (s === 1) {
      if (!form.title.trim()) err.title = "Required";
      if (!form.city.trim()) err.city = "Required";
      if (!form.address.trim()) err.address = "Required";
      else { const hit = addressContainsCityOrState(form.address); if (hit) err.address = `City/state name "${hit}" not allowed in address. Use the City field below.`; }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAmenityToggle = (a) => {
    setForm(f => ({ ...f, amenities: { ...f.amenities, [a]: !f.amenities[a] } }));
  };

  const nextStep = () => { if(validateStep(step)) setStep(s => Math.min(s+1, STEPS.length-1)); window.scrollTo(0, 0); };
  const prevStep = () => { setStep(s => Math.max(s-1, 0)); window.scrollTo(0, 0); };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).filter(isAcceptedFile);
    photoPreviews.update(files);
  };

  // ── Room field updater ────────────────────────────────────────────────────
  const updateRoom = (idx, field, value) => {
    setForm(f => {
      const newList = [...f.bedroomDetails];
      newList[idx] = { ...newList[idx], [field]: value };
      return { ...f, bedroomDetails: newList };
    });
  };

  const handleAddBathroom = () => {
    setForm(f => ({ ...f, bathroomDetails: [...(f.bathroomDetails || []), defaultBathroomEntry()] }));
  };
  const handleRemoveBathroom = (idx) => {
    setForm(f => ({ ...f, bathroomDetails: (f.bathroomDetails || []).filter((_, i) => i !== idx) }));
  };
  const handleBathroomChange = (idx, key, val) => {
    setForm(f => {
      const list = [...(f.bathroomDetails || [])];
      list[idx] = { ...list[idx], [key]: val };
      return { ...f, bathroomDetails: list };
    });
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch("https://kyc-api.surepass.app/api/v1/telecom/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg"
        },
        body: JSON.stringify({ id_number: phoneNumber })
      });
      const data = await res.json();
      if (data.success || data.status_code === 200) {
        setOtpSent(true);
        setOtpClientId(data.data?.client_id || data.client_id);
        alert("OTP Sent Successfully!");
      } else {
        alert("Failed to send OTP: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Phone OTP error", err);
      alert("Error sending OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!phoneOtp) return;
    setIsVerifyingOtp(true);
    try {
      const res = await fetch("https://kyc-api.surepass.app/api/v1/telecom/submit-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg"
        },
        body: JSON.stringify({ client_id: otpClientId, otp: phoneOtp })
      });
      const data = await res.json();
      if (data.success || data.status_code === 200) {
        setIsPhoneVerified(true);
        setOtpSent(false);
        alert("Phone Verified Successfully!");
      } else {
        alert("Verification Failed: " + (data.message || "Invalid OTP"));
      }
    } catch (err) {
      console.error("Phone verification error", err);
      alert("Verification Error. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const verifyAadhaar = async () => {
    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
      alert("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setIsVerifyingAadhaar(true);
    try {
      const res = await fetch("https://kyc-api.surepass.app/api/v1/aadhaar-validation/aadhaar-validation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg"
        },
        body: JSON.stringify({ id_number: aadhaarNumber })
      });
      const data = await res.json();
      if (data.success || data.status_code === 200) {
        setAadhaarVerified(true);
        alert("Aadhaar Verified Successfully!");
      } else {
        setAadhaarVerified(false);
        alert("Verification Failed: " + (data.message || "Invalid Aadhaar"));
      }
    } catch (err) {
      console.error("Aadhaar verification error", err);
      alert("Verification Error. Please try again.");
    } finally {
      setIsVerifyingAadhaar(false);
    }
  };

  const handleSubmit = async (e) => {
    if (!aadhaarVerified || !isPhoneVerified) return alert("Please complete verification");
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      const totalBeds = form.bedroomDetails.reduce((sum, r) => sum + (Number(r.bedCount) || 1), 0);

      // ── Determine effective price ─────────────────────────────────────────
      // For PG or per-room pricing: price = min room price (for display), room-wise in meta
      // For flat with single price: price = baseRate
      let effectivePrice = form.baseRate;
      if (usePerRoomPricing && form.bedroomDetails.length > 0) {
        const roomPrices = form.bedroomDetails.map(r => Number(r.price) || 0).filter(p => p > 0);
        if (roomPrices.length > 0) effectivePrice = Math.min(...roomPrices);
      }

      fd.append("property_name", form.title);
      fd.append("description", form.mainDescription);
      fd.append("city", form.city);
      fd.append("address", form.address);
      fd.append("price", effectivePrice);
      fd.append("booking_type", String(form.bookingType));
      fd.append("owner_id", user?.id || "99");
      fd.append("rental_type", "long");
      fd.append("property_type", "long term");
      fd.append("property_category", form.propertyCategory || "Flat");
      fd.append("bedrooms", JSON.stringify(form.bedroomDetails));
      fd.append("bathrooms", JSON.stringify((form.bathroomDetails || []).length > 0 ? form.bathroomDetails : [{ type: "Attached", count: form.bathrooms }]));
      fd.append("amenities", JSON.stringify(Object.keys(form.amenities).filter(k => form.amenities[k])));
      fd.append("beds", String(totalBeds));
      fd.append("max_guests", String(Number(form.maxGuests) || totalBeds || 1));

      const guidebook = {
        transport_tips: form.transportTips,
        metro_station: form.transportTips.metro,
        hospital: form.essentialsNearby.medical,
        market: form.essentialsNearby.grocery,
        cafes_restaurants: form.cafesRestaurants.filter(c => c.name.trim()),
        essentials_nearby: form.essentialsNearby,
        house_specific_tips: form.houseSpecificTips.filter(t => t.trim())
      };

      const meta = {
        ...form,
        totalBeds,
        usePerRoomPricing,           // ← store this flag in meta
        amenities: Object.keys(form.amenities).filter(k => form.amenities[k]),
        guidebook,
        aadhaarVerified,
        isPhoneVerified,
      };
      
      fd.append("meta", JSON.stringify(meta));
      fd.append("guest_policy", JSON.stringify({
        family_allowed: form.preferredTenants.includes("Family"),
        unmarried_couple_allowed: form.houseRules.includes("Couple Friendly"),
        bachelors_allowed: form.preferredTenants.some(t => t.includes("Bachelors")),
        preferredTenants: form.preferredTenants || [],
      }));
      fd.append("cover_photo_index", String(coverIndex));

      photoPreviews.previews.forEach((p) => {
        if(p.file) fd.append("photos", p.file);
      });

      const res = await fetch(`${API_BASE}/ovika/properties/upload`, {
        method: "POST",
        body: fd,
        credentials: "include"
      });

      const result = await res.json();
      if(res.ok) {
        alert("Listing Published Successfully! ID: " + (result.data?.id || "New"));
        window.location.reload();
      } else {
        alert(result.message || "Failed to publish");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during submission. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tmx9pf-root">
      <div className="rental-form-container">
        <div className="form-header-premium">
          <div className="header-content">
             <h1>List Your <span className="highlight">Property</span></h1>
             <p>Market your property to thousands of high-quality tenants</p>
          </div>
          <div className="stepper-horizontal">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`step-item ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
                <div className="icon-box">{i < step ? <CheckCircle2 size={16} /> : s.icon}</div>
                <span>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-main-card">
          {/* ── STEP 0: Category ─────────────────────────────────────────────── */}
          {step === 0 && (
            <div className="step-fade">
              <h2 className="step-title">Select Property Category</h2>
              <div className="category-grid">
                 {PROPERTY_CATEGORIES.map(cat => (
                   <div 
                    key={cat.id} 
                    className={`category-card ${form.propertyCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, propertyCategory: cat.id }))}
                   >
                     <div className="cat-icon">{cat.icon}</div>
                     <div className="cat-info">
                        <h3>{cat.label}</h3>
                        <p>{cat.sub}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: Basic Info ───────────────────────────────────────────── */}
          {step === 1 && (
            <div className="step-fade">
              <h2 className="step-title">Basic Information</h2>
              <div className="form-grid">
                <div className="field-group full">
                  <label>Property Title / Building Name *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Spacious 3BHK in DLF Phase 5" />
                  {errors.title && <span className="error">{errors.title}</span>}
                </div>
                <div className="field-group">
                  <label>Specific Property Type</label>
                  <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                    {PROPERTY_TYPES[form.propertyCategory]?.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field-group full">
                  <label>Short Description *</label>
                  <textarea name="mainDescription" value={form.mainDescription} onChange={handleChange} rows="2" placeholder="Tell us about the highlights of your property..." />
                </div>
                <div className="field-group full">
                  <label>Full Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows="3" placeholder="Street, Sector, Locality..." style={errors.address ? { borderColor: '#ef4444' } : {}} />
                  {errors.address && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.address}</span>}
                </div>
                <div className="field-group">
                  <label>City *</label>
                  <CityDropdown
                    value={form.city}
                    onChange={handleChange}
                    className="pg-city-trigger"
                    hasError={!!errors.city}
                    placeholder="Select City"
                  />
                </div>
                <div className="field-group">
                  <label>Postal Code</label>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="6 Digits" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Layout & Room Config ─────────────────────────────────── */}
          {step === 2 && (
            <div className="step-fade">
              <h2 className="step-title">Property Layout & Room Configuration</h2>
              <div className="form-grid">

                {/* ── PRICING MODE TOGGLE (only for non-PG) ─────────────────── */}
                {!isPG && (
                  <div className="field-group full">
                    <div
                      className="pricing-toggle-banner"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: usePerRoomPricing ? '#fef2f2' : '#f0fdf4',
                        border: `1.5px solid ${usePerRoomPricing ? '#fca5a5' : '#86efac'}`,
                        borderRadius: '10px',
                        marginBottom: '4px',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      onClick={() => setUsePerRoomPricing(v => !v)}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
                          {usePerRoomPricing
                            ? '🏷️ Per-Room Pricing (different price for each room)'
                            : '🏠 Single Property Price (one price for whole property)'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          {usePerRoomPricing
                            ? 'Each room listed at a different rent — tenants pick a specific room'
                            : 'Entire flat/apartment rented at one price — click to switch to per-room'}
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, marginLeft: '12px' }}>
                        {usePerRoomPricing
                          ? <ToggleRight size={32} color="#ef4444" />
                          : <ToggleLeft size={32} color="#22c55e" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ROOM DETAILS ──────────────────────────────────────────── */}
                <div className="field-group full">
                  <div className="section-subtitle">Room Details Configuration</div>
                  <div className="room-config-list">
                    {form.bedroomDetails.map((room, idx) => (
                      <div key={idx} className="room-detail-card">
                        <div className="room-header">
                          <span className="room-idx">Room #{idx + 1}</span>
                          <button className="del-btn-icon" onClick={() => setForm(f => ({ ...f, bedroomDetails: f.bedroomDetails.filter((_, i) => i !== idx) }))}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="room-grid-mini">
                          <div className="field-group">
                            <label>Room Category / Type</label>
                            <select value={room.type} onChange={(e) => updateRoom(idx, 'type', e.target.value)}>
                              {isPG 
                                ? SHARING_TYPES.map(s => <option key={s} value={s}>{s}</option>)
                                : ROOM_CATEGORIES.map(r => <option key={r} value={r}>{r}</option>)
                              }
                            </select>
                          </div>
                          
                          <div className="field-group">
                            <label>Room No. (Optional)</label>
                            <input placeholder="e.g. 101" value={room.roomNumber} onChange={(e) => updateRoom(idx, 'roomNumber', e.target.value)} />
                          </div>

                          <div className="field-group">
                            <label>Bed Type</label>
                            <select value={room.bedType} onChange={(e) => updateRoom(idx, 'bedType', e.target.value)}>
                              {BED_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                            </select>
                          </div>

                          <div className="field-group">
                            <label>Bed Count</label>
                            <input type="number" value={room.bedCount} onChange={(e) => updateRoom(idx, 'bedCount', Number(e.target.value))} />
                          </div>

                          {/* ── Price fields: show for PG always; for non-PG only when usePerRoomPricing=true ── */}
                          {(isPG || usePerRoomPricing) && (
                            <>
                              <div className="field-group">
                                <label>Monthly Rent (₹) {isPG ? '' : '— for this room'}</label>
                                <input type="number" placeholder="per month" value={room.price} onChange={(e) => updateRoom(idx, 'price', e.target.value)} />
                              </div>
                              <div className="field-group">
                                <label>Security Deposit (₹)</label>
                                <input type="number" placeholder="Refundable amt" value={room.securityDeposit} onChange={(e) => updateRoom(idx, 'securityDeposit', e.target.value)} />
                              </div>
                              <div className="field-group">
                                <label>Maintenance Charge (₹)</label>
                                <input type="number" placeholder="per month/cycle" value={room.maintenanceCharge} onChange={(e) => updateRoom(idx, 'maintenanceCharge', e.target.value)} />
                              </div>
                              <div className="field-group">
                                <label>Maintenance Cycle</label>
                                <select value={room.maintenanceCycle} onChange={(e) => updateRoom(idx, 'maintenanceCycle', e.target.value)}>
                                  <option value="Monthly">Monthly</option>
                                  <option value="Quarterly">Quarterly</option>
                                  <option value="Half-Yearly">Half-Yearly</option>
                                  <option value="Yearly">Yearly</option>
                                  <option value="One-Time">One-Time</option>
                                </select>
                              </div>
                            </>
                          )}

                          <div className="field-group full">
                            <label>Furnishing Items Available in Room</label>
                            <div className="chips-grid-mini">
                              {FURNISHING_ITEMS.map(item => (
                                <div 
                                  key={item} 
                                  className={`mini-chip ${room.furnishingDetails?.includes(item) ? 'active' : ''}`}
                                  onClick={() => {
                                    const items = room.furnishingDetails || [];
                                    updateRoom(idx, 'furnishingDetails', items.includes(item) ? items.filter(i => i !== item) : [...items, item]);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="room-checkbox-grid">
                            <label className="checkbox-mini">
                              <input type="checkbox" checked={room.ac} onChange={(e) => updateRoom(idx, 'ac', e.target.checked)} />
                              <span>Air Conditioning (AC)</span>
                            </label>
                            <label className="checkbox-mini">
                              <input type="checkbox" checked={room.furnished} onChange={(e) => updateRoom(idx, 'furnished', e.target.checked)} />
                              <span>Furnished Room</span>
                            </label>
                            <label className="checkbox-mini">
                              <input type="checkbox" checked={room.attachedBathroom} onChange={(e) => updateRoom(idx, 'attachedBathroom', e.target.checked)} />
                              <span>Attached Bathroom</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className="add-btn-wide" onClick={() => {
                      const newId = Date.now();
                      setForm(f => ({ ...f, bedroomDetails: [...f.bedroomDetails, {
                        id: newId,
                        type: isPG ? SHARING_TYPES[0] : ROOM_CATEGORIES[0],
                        roomNumber: "",
                        bedType: BED_TYPES[1],
                        bedCount: 1,
                        ac: true,
                        furnished: true,
                        attachedBathroom: true,
                        furnishingDetails: [],
                        price: "",
                        securityDeposit: "",
                        maintenanceCharge: "",
                        maintenanceCycle: "Monthly",
                        areaSqFt: "",
                      }] }));
                    }}>
                      <Users size={18} /> Add Another Room Configuration
                    </button>
                  </div>
                </div>

                {/* ── BATHROOM CONFIGURATION ── */}
                <div className="field-group full">
                  <div className="section-subtitle" style={{ marginTop: '24px' }}>
                    Bathroom Configuration
                  </div>
                  <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '16px',
                    background: '#fafafa',
                    marginBottom: '12px',
                  }}>
                    {(form.bathroomDetails || []).map((bath, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                        marginBottom: '10px',
                        padding: '10px',
                        background: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                      }}>
                        {/* Badge */}
                        <div style={{
                          minWidth: '32px', height: '32px',
                          background: '#c98b3e', color: '#fff',
                          borderRadius: '50%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '13px', fontWeight: '700', flexShrink: 0,
                        }}>
                          {idx + 1}
                        </div>

                        {/* Type selector */}
                        <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                            Bathroom Type
                          </label>
                          <select
                            value={bath.type}
                            onChange={(e) => handleBathroomChange(idx, 'type', e.target.value)}
                            style={{
                              width: '100%', padding: '8px 10px',
                              borderRadius: '6px', border: '1px solid #d1d5db',
                              fontSize: '14px', background: '#fff',
                            }}
                          >
                            {BATHROOM_TYPES.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        {/* Count input */}
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                            Count
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={bath.count}
                            onChange={(e) => handleBathroomChange(idx, 'count', Number(e.target.value))}
                            style={{
                              width: '100%', padding: '8px 10px',
                              borderRadius: '6px', border: '1px solid #d1d5db',
                              fontSize: '14px',
                            }}
                          />
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveBathroom(idx)}
                          disabled={(form.bathroomDetails || []).length <= 1}
                          style={{
                            width: '36px', height: '36px', flexShrink: 0,
                            background: (form.bathroomDetails || []).length <= 1 ? '#f3f4f6' : '#fff5f5',
                            border: `1px solid ${(form.bathroomDetails || []).length <= 1 ? '#e5e7eb' : '#fca5a5'}`,
                            color: (form.bathroomDetails || []).length <= 1 ? '#d1d5db' : '#ef4444',
                            borderRadius: '6px',
                            cursor: (form.bathroomDetails || []).length <= 1 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                          title="Remove bathroom"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}

                    {/* Add bathroom button */}
                    <button
                      type="button"
                      onClick={handleAddBathroom}
                      style={{
                        width: '100%', padding: '10px',
                        border: '1.5px dashed #c98b3e',
                        borderRadius: '8px', background: '#fffbf5',
                        color: '#c98b3e', fontSize: '14px', fontWeight: '600',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '6px',
                      }}
                    >
                      <Plus size={16} /> Add Bathroom Type
                    </button>

                    {/* Summary */}
                    <div style={{
                      marginTop: '12px', padding: '10px 14px',
                      background: '#f0fdf4', borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      fontSize: '13px', color: '#16a34a', fontWeight: '500',
                    }}>
                      Total bathrooms: <strong>
                        {(form.bathroomDetails || []).reduce((sum, b) => sum + (Number(b.count) || 0), 0)}
                      </strong>
                      {' '}({(form.bathroomDetails || []).map(b => `${b.count} ${b.type}`).join(', ')})
                    </div>
                  </div>
                </div>
                {/* ── END BATHROOM SECTION ── */}

                {/* ── MAXIMUM GUESTS ── */}
                <div className="field-group full">
                  <div className="section-subtitle" style={{ marginTop: '24px' }}>
                    Maximum Guests Allowed
                  </div>
                  <div style={{
                    border: '1px solid #e5e7eb', borderRadius: '10px',
                    padding: '16px', background: '#fafafa',
                  }}>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                      How many guests can stay at this property at once?
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, maxGuests: Math.max(1, (Number(f.maxGuests) || 1) - 1) }))}
                        disabled={form.maxGuests <= 1}
                        style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          border: '1.5px solid #d1d5db', background: '#fff',
                          fontSize: '1.3rem', cursor: form.maxGuests <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', color: form.maxGuests <= 1 ? '#ccc' : '#374151',
                        }}
                      >−</button>
                      <span style={{ fontSize: '1.5rem', fontWeight: '700', minWidth: '2.5rem', textAlign: 'center', color: '#1e293b' }}>
                        {form.maxGuests || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, maxGuests: (Number(f.maxGuests) || 1) + 1 }))}
                        style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          border: '1.5px solid #c98b3e', background: '#c98b3e',
                          fontSize: '1.3rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', color: '#fff',
                        }}
                      >+</button>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>guests</span>
                    </div>
                  </div>
                </div>

                <div className="field-group">
                  <label>Total Built-up Area (Sq Ft) *</label>
                  <input type="number" name="area" value={form.area} onChange={handleChange} placeholder="Total house area" />
                </div>
                <div className="field-group">
                  <label>Overall Furnishing</label>
                  <select name="furnishing" value={form.furnishing} onChange={handleChange}>
                    {FURNISHING_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div className="field-group">
                  <label>Property Age</label>
                  <select name="propertyAge" value={form.propertyAge} onChange={handleChange}>
                    {PROPERTY_AGE.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Water Supply</label>
                  <select name="waterSupply" value={form.waterSupply} onChange={handleChange}>
                    {WATER_SUPPLIES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Amenities ────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="step-fade">
              <h2 className="step-title">Amenities & Features</h2>
              <div className="amenities-container">
                 {Object.entries(AMENITIES_MASTER).map(([group, list]) => (
                   <div key={group} className="amenity-group">
                      <h4>{group}</h4>
                      <div className="chips-grid">
                        {list.map(a => (
                          <div 
                           key={a} 
                           className={`amenity-chip ${form.amenities[a] ? 'selected' : ''}`}
                           onClick={() => handleAmenityToggle(a)}
                          >
                            {form.amenities[a] && <CheckCircle2 size={14} className="check-icon" />}
                            {a}
                          </div>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Local Guide ──────────────────────────────────────────── */}
          {step === 4 && (
            <div className="step-fade">
              <h2 className="step-title">Local Guide & Neighborhood</h2>
              <div className="form-grid">
                 <div className="field-group full">
                    <label>Nearest Metro Station</label>
                    <input value={form.transportTips.metro} onChange={(e) => setForm(f => ({ ...f, transportTips: { ...f.transportTips, metro: e.target.value }}))} placeholder="e.g. Huda City Centre" />
                 </div>
                 <div className="field-group">
                    <label>Nearest Hospital</label>
                    <input value={form.essentialsNearby.medical} onChange={(e) => setForm(f => ({ ...f, essentialsNearby: { ...f.essentialsNearby, medical: e.target.value }}))} placeholder="e.g. Artemis Hospital" />
                 </div>
                 <div className="field-group">
                    <label>Nearest Grocery / Market</label>
                    <input value={form.essentialsNearby.grocery} onChange={(e) => setForm(f => ({ ...f, essentialsNearby: { ...f.essentialsNearby, grocery: e.target.value }}))} placeholder="e.g. Reliance Fresh" />
                 </div>
                 <div className="field-group full">
                    <div className="section-subtitle">Recommended Cafes & Restaurants</div>
                    {form.cafesRestaurants.map((res, idx) => (
                      <div key={idx} className="v-input-row" style={{marginBottom: '10px'}}>
                        <input placeholder="Name" value={res.name} onChange={(e) => {
                           const n = [...form.cafesRestaurants]; n[idx].name = e.target.value; setForm(f => ({ ...f, cafesRestaurants: n }));
                        }} />
                        <input placeholder="Distance (m)" value={res.distance} onChange={(e) => {
                           const n = [...form.cafesRestaurants]; n[idx].distance = e.target.value; setForm(f => ({ ...f, cafesRestaurants: n }));
                        }} />
                      </div>
                    ))}
                    <button className="mini-chip" onClick={() => setForm(f => ({ ...f, cafesRestaurants: [...f.cafesRestaurants, {name: "", distance: ""}] }))}>+ Add More</button>
                 </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Photos ───────────────────────────────────────────────── */}
          {step === 5 && (
            <div className="step-fade">
              <h3 className="step-title">Upload Gallery</h3>
              <div className="upload-zone">
                 <input type="file" multiple accept="image/*" onChange={handlePhotos} id="photo-upload" hidden />
                 <label htmlFor="photo-upload" className="upload-trigger">
                    <Camera size={40} />
                    <p>Click to upload property photos</p>
                    <span>Up to 10 high-quality images</span>
                 </label>
              </div>
              <div className="preview-grid">
                 {photoPreviews.previews.map((p, i) => (
                   <div key={i} className={`preview-item ${coverIndex === i ? 'is-cover' : ''}`}>
                      <img src={p.url} alt="prop" />
                      <div className="preview-overlay-fixed">
                         <div className="top-actions">
                            <button 
                              type="button" 
                              className="remove-btn-premium" 
                              onClick={(e) => { e.stopPropagation(); photoPreviews.remove(i); }}
                              title="Delete Photo"
                            >
                               <Trash2 size={14} />
                               <span>Delete</span>
                            </button>
                         </div>
                         <div className="bottom-actions">
                            <div 
                              className={`badge-cover-premium ${coverIndex === i ? 'active' : ''}`} 
                              onClick={() => setCoverIndex(i)}
                            >
                              {coverIndex === i ? 'Main Cover' : 'Set as Cover'}
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* ── STEP 6: Pricing ──────────────────────────────────────────────── */}
          {step === 6 && (
            <div className="step-fade">
              <h2 className="step-title">Rent & Financials</h2>
              <div className="form-grid">

                {/* ── For non-PG single pricing: show base price fields ── */}
                {!isPG && !usePerRoomPricing && (
                  <>
                    <div className="field-group">
                      <label>Monthly Rent / Base Price (₹) *</label>
                      <input type="number" name="baseRate" value={form.baseRate} onChange={handleChange} placeholder="e.g. 25000" />
                    </div>
                    <div className="field-group">
                      <label>Security Deposit (₹)</label>
                      <input type="number" name="securityDeposit" value={form.securityDeposit} onChange={handleChange} placeholder="e.g. 50000" />
                    </div>
                    <div className="field-group">
                      <label>Maintenance Charge (₹/month)</label>
                      <input type="number" name="maintenanceCharge" value={form.maintenanceCharge} onChange={handleChange} placeholder="e.g. 2000" />
                    </div>
                    <div className="field-group">
                      <label>Available From</label>
                      <input type="date" name="availableFrom" value={form.availableFrom} onChange={handleChange} />
                    </div>
                  </>
                )}

                {/* ── For per-room pricing (non-PG): show summary / reminder ── */}
                {!isPG && usePerRoomPricing && (
                  <div className="field-group full">
                    <div style={{
                      padding: '14px 18px',
                      background: '#fffbeb',
                      border: '1.5px solid #fde68a',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#78350f'
                    }}>
                      <strong>Per-Room Pricing Active</strong> — You've set individual room prices in Step 3 (Room Configuration).
                      The lowest room price will be used as the listing's starting price.
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {form.bedroomDetails.map((room, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '4px 0', borderBottom: '1px dashed #fde68a' }}>
                            <span>Room #{i+1} — {room.type}</span>
                            <strong>₹{room.price ? Number(room.price).toLocaleString('en-IN') : '—'}/mo</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="field-group" style={{ marginTop: '14px' }}>
                      <label>Available From</label>
                      <input type="date" name="availableFrom" value={form.availableFrom} onChange={handleChange} />
                    </div>
                  </div>
                )}

                {/* ── PG: show summary of room prices ── */}
                {isPG && (
                  <div className="field-group full">
                    <div style={{
                      padding: '14px 18px',
                      background: '#f0fdf4',
                      border: '1.5px solid #86efac',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#14532d',
                      marginBottom: '8px'
                    }}>
                      <strong>PG Room Pricing Summary</strong> — Prices set in Room Configuration
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {form.bedroomDetails.map((room, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '4px 0', borderBottom: '1px dashed #86efac' }}>
                            <span>{room.type || `Room #${i+1}`}</span>
                            <strong>₹{room.price ? Number(room.price).toLocaleString('en-IN') : '—'}/mo</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="field-group">
                  <label>Gate Closing Time</label>
                  <TimePickerAMPM
                    value={form.gateClosingTime}
                    onChange={(val) => setForm(f => ({ ...f, gateClosingTime: val }))}
                  />
                </div>
                <div className="field-group">
                  <label>Notice Period (Days)</label>
                  <input type="number" name="noticePeriod" value={form.noticePeriod} onChange={handleChange} />
                </div>

                <div className="field-group full">
                   <label>Preferred Tenant (Select Multiple)</label>
                   <div className="chips-grid">
                      {TENANT_PREFERENCES.map(p => (
                        <div 
                          key={p} 
                          className={`amenity-chip ${form.preferredTenants.includes(p) ? 'selected' : ''}`}
                          onClick={() => {
                            const newTenants = form.preferredTenants.includes(p) 
                              ? form.preferredTenants.filter(t => t !== p) 
                              : [...form.preferredTenants, p];
                            setForm(f => ({ ...f, preferredTenants: newTenants }));
                          }}
                        >
                          {p}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="field-group full">
                  <div className="section-separator">Bill Payment Policy</div>
                </div>
                
                <div className="field-group">
                  <label>Electricity Charges</label>
                  <select name="electricityCharges" value={form.electricityCharges} onChange={handleChange}>
                    <option>Included in Rent</option>
                    <option>As per Meter / Unit</option>
                    <option>Fixed Monthly Charge</option>
                    <option>Shared among roommates</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Water Charges</label>
                  <select name="waterCharges" value={form.waterCharges} onChange={handleChange}>
                    <option>Included in Rent</option>
                    <option>Fixed Monthly Charge</option>
                    <option>Shared Bill</option>
                  </select>
                </div>

                <div className="field-group full">
                  <div className="section-separator">Long-term Stay Discounts</div>
                </div>

                <div className="field-group">
                  <label>90 Days Discount (%)</label>
                  <input type="number" name="discount90Days" value={form.discount90Days} onChange={handleChange} placeholder="e.g. 5" />
                </div>
                <div className="field-group">
                  <label>180 Days Discount (%)</label>
                  <input type="number" name="discount180Days" value={form.discount180Days} onChange={handleChange} placeholder="e.g. 10" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 7: Verification ─────────────────────────────────────────── */}
          {step === 7 && (
            <div className="step-fade">
              <h2 className="step-title">Final Verification</h2>
              <div className="verification-box">
                 <div className="v-item">
                    <div className="v-label">Aadhaar Number (Identity)</div>
                    <div className="v-input-row">
                       <input 
                        placeholder="12 digit number" 
                        value={aadhaarNumber} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                          setAadhaarNumber(val);
                          if (aadhaarVerified) setAadhaarVerified(false);
                        }} 
                        disabled={isVerifyingAadhaar}
                        style={{ borderColor: aadhaarVerified ? '#10b981' : '' }}
                       />
                       <button 
                        onClick={verifyAadhaar} 
                        disabled={aadhaarVerified || isVerifyingAadhaar || aadhaarNumber.length !== 12} 
                        className={aadhaarVerified ? 'verified' : ''}
                       >
                          {isVerifyingAadhaar ? 'Verifying...' : aadhaarVerified ? 'Verified ✓' : 'Verify Now'}
                       </button>
                    </div>
                    {aadhaarVerified && <p className="success-msg">✓ Aadhaar verification successful.</p>}
                 </div>

                 <div className="v-item">
                    <div className="v-label">Mobile Number Verification</div>
                    <div className="v-input-row">
                       <input 
                        placeholder="10 digit number" 
                        value={phoneNumber} 
                         onChange={(e) => {
                           const val = e.target.value.replace(/\D/g,'').slice(0,10);
                           setPhoneNumber(val);
                           if (isPhoneVerified) setIsPhoneVerified(false);
                           if (otpSent) setOtpSent(false);
                           setPhoneOtp('');
                         }} 
                        disabled={isPhoneVerified || isSendingOtp}
                        style={{ flex: 1, borderColor: isPhoneVerified ? '#10b981' : '' }}
                       />
                       
                       {!otpSent && !isPhoneVerified && (
                         <button onClick={handleSendOtp} disabled={isSendingOtp || phoneNumber.length !== 10}>
                            {isSendingOtp ? 'Sending...' : 'Send OTP'}
                         </button>
                       )}

                       {isPhoneVerified && (
                         <button className="verified" disabled><CheckCircle2 size={16} /> Verified ✓</button>
                       )}
                    </div>

                    {otpSent && !isPhoneVerified && (
                      <div className="otp-container" style={{ marginTop: '15px' }}>
                        <input 
                          placeholder="Enter OTP" 
                          className="otp-input"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                        />
                        <button 
                          onClick={handleVerifyOtp} 
                          className="verify-btn"
                          disabled={isVerifyingOtp || !phoneOtp}
                        >
                          {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>
                    )}
                    
                    {isPhoneVerified && <p className="success-msg">✓ Phone number verified successfully.</p>}
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-footer-nav">
           <button className="btn-back" onClick={prevStep} disabled={step === 0}>Back</button>
           {step < STEPS.length - 1 ? (
             <button className="btn-next" onClick={nextStep}>Continue</button>
           ) : (
             <button className="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
               {isSubmitting ? 'Publishing...' : 'Publish Listing'}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default PGListingForm;