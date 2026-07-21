import React, { useState, useEffect, useContext, useRef } from "react";
import { Helmet } from 'react-helmet';
import { useSearchParams } from "react-router-dom";
import "./pg-listing-form.css";
import { AuthContext } from "../Login/AuthContext";
import { useStepBackNav } from "../../utils/useStepBackNav";
import { compressImage } from "../../utils/compressImage";
import CityDropdown, { addressContainsCityOrState } from "./CityDropdown";
import {
  Building, Home, Hotel, Users, MapPin, Info, FileText, Camera, CreditCard, ShieldCheck,
  Zap, Wifi, Trash2, CheckCircle2, ToggleLeft, ToggleRight, Plus,
  Eye, Shield, Flame, Phone, ArrowUpDown, Waves, Dumbbell, UtensilsCrossed,
  Wind, Tv, Shirt, Package, Leaf, TreePine,
  Car, Sun, Droplets, Lightbulb, Footprints, BookOpen, Gamepad2, BedDouble,
  Coffee, Microwave, CircleDot, ShowerHead, Bath,
  Lock, DoorOpen, AlertTriangle, Cpu, ShoppingBag, Drill, Recycle,
  Battery, Table2, PawPrint, Star, KeyRound, Thermometer, Utensils, CupSoda
} from "lucide-react";

const S = 18; // icon size
const AMENITY_ICONS = {
  // Safety & Security
  'CCTV':                  <Eye size={S} />,
  'Security Guard':        <Shield size={S} />,
  'Fire Extinguisher':     <Flame size={S} />,
  'Intercom':              <Phone size={S} />,
  'Biometric Entry':       <CircleDot size={S} />,
  'Gated Community':       <Lock size={S} />,
  'Fire Alarm':            <AlertTriangle size={S} />,
  'Sprinklers':            <Droplets size={S} />,
  'Sprinkler':             <Droplets size={S} />,
  'Smoke Detectors':       <AlertTriangle size={S} />,
  'Emergency Exit':        <DoorOpen size={S} />,
  'Electronic Entry Lock': <KeyRound size={S} />,
  'Electronic Bedroom Lock':<Lock size={S} />,
  // Modern Living
  'Lift':                  <ArrowUpDown size={S} />,
  'Power Backup':          <Lightbulb size={S} />,
  'Wi-Fi':                 <Wifi size={S} />,
  'Swimming Pool':         <Waves size={S} />,
  'Gym':                   <Dumbbell size={S} />,
  'Clubhouse':             <Building size={S} />,
  'Club House':            <Building size={S} />,
  'Modular Kitchen':       <UtensilsCrossed size={S} />,
  'Chimney':               <Thermometer size={S} />,
  'Central AC':            <Wind size={S} />,
  'Smart Home Tech':       <Cpu size={S} />,
  'EV Charging Point':     <Zap size={S} />,
  'Vending Machine':       <CupSoda size={S} />,
  // Basic Utilities
  'Water Supply 24/7':     <Droplets size={S} />,
  'Borewell':              <Drill size={S} />,
  'Corporation Water':     <Droplets size={S} />,
  'Gas Pipeline':          <Flame size={S} />,
  'Solar Water':           <Sun size={S} />,
  'Reserved Parking':      <Car size={S} />,
  'Visitor Parking':       <Car size={S} />,
  'STP Plant':             <Recycle size={S} />,
  'Waste Management':      <Recycle size={S} />,
  // Indoor Features
  'Air Conditioner':       <Wind size={S} />,
  'Geyser':                <ShowerHead size={S} />,
  'RO Water':              <Droplets size={S} />,
  'Washing Machine':       <Shirt size={S} />,
  'Refrigerator':          <Package size={S} />,
  'Inverter':              <Battery size={S} />,
  'Wardrobe':              <ShoppingBag size={S} />,
  'Study Table':           <Table2 size={S} />,
  'Smart TV':              <Tv size={S} />,
  'Google TV':             <Tv size={S} />,
  'Gas Stove':             <Flame size={S} />,
  'Dishwasher':            <Waves size={S} />,
  'Microwave':             <Microwave size={S} />,
  'Iron & Board':          <Shirt size={S} />,
  // Bathroom
  'Bath Towels':           <Bath size={S} />,
  'Soap & Shampoo':        <Droplets size={S} />,
  // Kitchen Appliances
  'Electric Kettle':       <Coffee size={S} />,
  'Hob':                   <Flame size={S} />,
  'Toaster':               <Zap size={S} />,
  'Rice Cooker':           <UtensilsCrossed size={S} />,
  'Coffee Maker':          <Coffee size={S} />,
  'Induction Cooktop':     <Flame size={S} />,
  'Dining Counter':        <Utensils size={S} />,
  'Cooking utensils':      <Utensils size={S} />,
  // Outer Spaces
  'Balcony':               <Home size={S} />,
  'Private Terrace':       <Sun size={S} />,
  'Garden':                <Leaf size={S} />,
  'Park Area':             <TreePine size={S} />,
  'Pet Area':              <PawPrint size={S} />,
  'Kids Play Area':        <Star size={S} />,
  'Jogging Track':         <Footprints size={S} />,
  'Library':               <BookOpen size={S} />,
  'Indoor Games Area':     <Gamepad2 size={S} />,
};

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
  { id: "Signature Stays",    label: "Signature Stays",    sub: "Luxury villas, premium suites & signature homes", icon: <Hotel size={20} /> },
  { id: "Hotel Stays",        label: "Hotel Stays",        sub: "Hotel rooms, boutique & business hotels",         icon: <Building size={20} /> },
  { id: "Homestays & BnB",   label: "Homestays & BnB",   sub: "Hosted homes, B&B, vacation rentals & farm stays",icon: <Home size={20} /> },
  { id: "Apartments & Villas",label: "Apartments & Villas",sub: "Apartments, villas, studio, penthouse & duplex",   icon: <Building size={20} /> },
  { id: "PG & Co-Living",     label: "PG & Co-Living",     sub: "PG, hostels & co-living spaces",                 icon: <Users size={20} /> },
];

const FLOOR_TYPES = ["Vitrifed Tiles", "Marble", "Wooden", "Granite", "Mosaic", "Normal", "Laminate", "Carpeted"];
const WATER_SUPPLIES = ["Corporation (MCG)", "Borewell", "Dual (Both)", "Tanker", "Rainwater Harvesting"];
const PROPERTY_AGE = ["New Construction", "0-1 Year", "1-5 Years", "5-10 Years", "10+ Years", "Under Construction"];
const HOUSE_RULES = ["Smoking Allowed", "Pets Allowed", "Events Allowed", "Drinking Allowed", "Late Entry Allowed", "Friends Allowed", "Veg Only", "Non-Veg Allowed", "Girlfriend/Boyfriend Entry Allowed", "Couple Friendly"];
const WINDOW_TYPES = ["Normal", "Large / Full Sized", "French Windows", "Bay Windows", "No Window", "Sky Light"];

const FURNISHING_STATUS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const SHARING_TYPES = ["Single Room", "Double Sharing", "Triple Sharing", "Four Sharing", "Five Sharing", "Dormitory"];
const TENANT_PREFERENCES = ["Bachelors (Any)", "Bachelors (Female Only)", "Bachelors (Male Only)", "Family", "Working Professionals", "Students Only", "No Preference"];
const CANCELLATION_POLICIES = ["Flexible: Full refund 1 day prior", "Moderate: Full refund 5 days prior", "Strict: 50% refund 7 days prior", "No Refund"];

// ── Apartments & Villas specific constants ────────────────────────────────────
const BHK_OPTIONS        = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
const APT_PROP_TYPES     = ["Apartment", "Independent House", "Duplex", "Independent Floor", "Villa", "Penthouse", "Studio", "Farm House"];
const SECURITY_DEP_OPTS  = ["None", "1 month", "2 month", "3 month", "Custom"];
const MAINTENANCE_OPTS   = ["Include in rent", "Separate"];
const LOCK_IN_OPTS       = ["None", "1 month", "6 month", "Custom"];
const PARKING_CHG_OPTS   = ["Include in rent", "Separate"];
const PAINTING_CHG_OPTS  = ["None", "As per cost", "1 month rent", "Custom"];
const TENANT_TYPE_SIMPLE = ["Family", "Bachelors", "Company", "Any"];
const FLAT_FURNISHINGS   = ["Dining Table","Washing Machine","Cupboard","Sofa","Microwave","Stove","Fridge","Water Purifier","Gas Pipeline","Chimney","Modular Kitchen","Fan","Light","AC","Wardrobe","TV","Bed","Geyser"];
const PARK_COUNT_OPTS    = [0, 1, 2, 3, "3+"];
const BATH_COUNT_OPTS    = [1, 2, 3, "4+"];
const BALCONY_OPTS       = [0, 1, 2, 3];
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
  "Signature Stays":    ["Luxury Villa", "Premium Suite", "Signature Home", "Serviced Apartment", "Luxury Penthouse"],
  "Hotel Stays":        ["Hotel Room", "Boutique Hotel", "Business Hotel", "Resort", "Service Apartment"],
  "Homestays & BnB":   ["Homestay", "Bed & Breakfast", "Vacation Rental", "Farm Stay", "Guesthouse", "Cottage"],
  "Apartments & Villas":["Standard Apartment", "Studio Apartment", "Villa", "Penthouse", "Duplex", "Builder Floor", "Independent House", "Farmhouse"],
  "PG & Co-Living":     ["Girls PG", "Boys PG", "Co-living Space", "Student Hostel", "Working Professionals PG"],
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

// ─── category helpers ────────────────────────────────────────────────────────
const isPGCategory       = (cat) => cat === "PG & Co-Living";
const isHomestayCategory = (cat) => cat === "Homestays & BnB";

const PLACE_TYPES_BNB = [
  { id: "Entire Place",  label: "An entire place",            desc: "Guests have the whole place to themselves.", icon: "🏠" },
  { id: "Private Room",  label: "A private room",             desc: "Guests have their own room, plus access to shared spaces.", icon: "🚪" },
  { id: "Shared Room",   label: "A shared room in a hostel",  desc: "Guests sleep in a shared room with other guests.", icon: "🛏️" },
];
const BNB_PROP_TYPES   = ["Homestay", "Bed & Breakfast", "Vacation Rental", "Farm Stay", "Guesthouse", "Cottage", "Villa", "Treehouse", "Tiny Home"];
const DESC_HIGHLIGHTS  = ["Peaceful", "Unique", "Family-friendly", "Stylish", "Central", "Spacious", "Scenic", "Cozy"];

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
         return combined.slice(0, 40);
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
  const [searchParams] = useSearchParams();

  const VALID_CATS = ["Apartments & Villas", "PG & Co-Living", "Signature Stays", "Hotel Stays", "Homestays & BnB"];
  const urlCategory = searchParams.get('category');
  const initCategory = VALID_CATS.includes(urlCategory) ? urlCategory : "Apartments & Villas";

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // ── KEY NEW STATE: per-room pricing toggle (only for non-PG) ─────────────
  const [usePerRoomPricing, setUsePerRoomPricing] = useState(false);

  const [form, setForm] = useState({
    propertyCategory: initCategory,
    propertyType: isPGCategory(initCategory) ? "Girls PG" : "Apartment",
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

    // ── Apartments & Villas extra fields ─────────────────────────────────────
    bhk: "2 BHK",
    coveredParking: 0,
    openParking: 0,
    servantRoom: "No",
    flatNo: "",
    carpetArea: "",
    areaUnit: "sq. ft.",
    securityDepositType: "1 month",
    customSecurityDeposit: "",
    maintenanceChargesType: "Include in rent",
    parkingChargesType: "Include in rent",
    paintingChargesType: "None",
    customPaintingCharges: "",
    customLockIn: "",
    tenantTypeSimple: [],
    petFriendly: "No",
    flatFurnishings: {},

    // ── Homestays & BnB extra fields ─────────────────────────────────────────
    placeType: "Entire Place",
    descriptionHighlights: [],
    weeklyDiscount: "",
    monthlyDiscount: "",
    newListingDiscount: false,
    lastMinuteDiscount: false,
    beds: 1,

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
  const [photoLabels, setPhotoLabels] = useState([]);
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

  // ── Address autocomplete (Nominatim / OpenStreetMap) ─────────────────────
  const [addrSuggestions, setAddrSuggestions] = useState([]);
  const [addrLoading, setAddrLoading]         = useState(false);
  const [showAddrDrop, setShowAddrDrop]       = useState(false);
  const [addrAutoFilled, setAddrAutoFilled]   = useState(false); // skip city/state validation when autocompleted
  const addrTimer   = useRef(null);
  const addrWrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (addrWrapRef.current && !addrWrapRef.current.contains(e.target)) setShowAddrDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAddressInput = (e) => {
    const val = e.target.value;
    setAddrAutoFilled(false); // user typing manually — re-enable validation
    setForm(f => ({ ...f, address: val }));
    if (addrTimer.current) clearTimeout(addrTimer.current);
    if (val.trim().length < 3) { setAddrSuggestions([]); setShowAddrDrop(false); setAddrLoading(false); return; }
    setAddrLoading(true);
    addrTimer.current = setTimeout(async () => {
      try {
        // Search all place types: shops, landmarks, roads, areas — everything
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&addressdetails=1&namedetails=1&limit=8&countrycodes=in&dedupe=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setAddrSuggestions(data);
        setShowAddrDrop(data.length > 0);
      } catch (_) {}
      setAddrLoading(false);
    }, 280);
  };

  const selectAddrSuggestion = (item) => {
    const a = item.address || {};

    // City: prefer city > town > village > county
    const city = a.city || a.town || a.village || a.county || a.state_district || '';
    const pincode = a.postcode || '';

    // Full local address: shop/POI name + house no + road + locality
    // item.name = actual place name (shop, landmark, building, etc.)
    const poiName = item.name && item.name !== a.road ? item.name : null;
    const localParts = [
      poiName,
      a.house_number,
      a.road || a.pedestrian || a.footway || a.path,
      a.suburb || a.neighbourhood || a.quarter || a.residential || a.hamlet || a.village,
    ].filter(Boolean);

    // If we got good local parts use them, else take first 3 comma parts of display_name
    const fullAddr = localParts.length >= 2
      ? localParts.join(', ')
      : item.display_name.split(',').slice(0, 3).join(',').trim();

    setAddrAutoFilled(true); // city/state are set in separate field — skip inline validation
    setForm(f => ({
      ...f,
      address:    fullAddr,
      city:       city || f.city,
      postalCode: pincode || f.postalCode,
      latitude:   item.lat  || f.latitude,
      longitude:  item.lon  || f.longitude,
    }));
    setAddrSuggestions([]);
    setShowAddrDrop(false);
  };

  // ── category shorthands ──────────────────────────────────────────────────
  const isPG       = isPGCategory(form.propertyCategory);
  const isHomestay = isHomestayCategory(form.propertyCategory);

  // ── When category switches to PG, force per-room pricing on (PG always has room-wise prices) ──
  useEffect(() => {
    if (isPG) setUsePerRoomPricing(true);
    else setUsePerRoomPricing(false);
  }, [form.propertyCategory]);

  // ── Room "type" dropdown swaps between SHARING_TYPES (PG) and ROOM_CATEGORIES (non-PG) —
  // fix up any room whose saved type no longer matches the active list (e.g. the default
  // "Regular Bedroom" left over from before PG was selected) so the displayed value and the
  // actual saved value never drift apart. ──
  useEffect(() => {
    const validTypes = isPG ? SHARING_TYPES : ROOM_CATEGORIES;
    setForm(f => {
      const needsFix = f.bedroomDetails.some(r => !validTypes.includes(r.type));
      if (!needsFix) return f;
      return {
        ...f,
        bedroomDetails: f.bedroomDetails.map(r => validTypes.includes(r.type) ? r : { ...r, type: validTypes[0] }),
      };
    });
  }, [isPG]);

  const STEPS = [
    { id: 1, title: "Info", icon: <Info size={18} /> },
    { id: 2, title: "Details", icon: <FileText size={18} /> },
    { id: 3, title: "Amenities", icon: <Wifi size={18} /> },
    { id: 4, title: "Local Guide", icon: <MapPin size={18} /> },
    { id: 5, title: "Photos", icon: <Camera size={18} /> },
    { id: 6, title: "Pricing", icon: <CreditCard size={18} /> },
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
      else if (!addrAutoFilled) { const hit = addressContainsCityOrState(form.address); if (hit) err.address = `City/state name "${hit}" not allowed in address. Use the City field below.`; }
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

  const nextStep = () => { if(validateStep(step)) setStep(s => Math.min(s+1, 7)); window.scrollTo(0, 0); };
  const prevStep = () => { setStep(s => Math.max(s-1, 1)); window.scrollTo(0, 0); };
  useStepBackNav(step, prevStep);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).filter(isAcceptedFile);
    photoPreviews.update(files);
    setPhotoLabels(prev => [...prev, ...files.map(() => '')]);
  };

  const handleRemovePhoto = (i) => {
    photoPreviews.remove(i);
    setPhotoLabels(prev => prev.filter((_, idx) => idx !== i));
    if (coverIndex >= i && coverIndex > 0) setCoverIndex(c => c - 1);
  };

  const handlePhotoLabel = (i, val) => {
    setPhotoLabels(prev => { const n = [...prev]; n[i] = val; return n; });
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
      fd.append("property_category", form.propertyCategory || "Apartments & Villas");
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
        furnishing: form.furnishing || "",
      }));
      fd.append("cover_photo_index", String(coverIndex));

      const photoFiles = photoPreviews.previews.filter(p => p?.file).map(p => p.file);
      const compressed = await Promise.all(photoFiles.map(f => compressImage(f)));
      compressed.forEach(f => fd.append("photos", f));
      // Photo room labels — same order as photos array
      fd.append("photo_labels", JSON.stringify(
        photoPreviews.previews.map((_, i) => photoLabels[i] || '')
      ));

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
      <Helmet>
        <title>List Your PG / Property | OvikaLiving</title>
        <meta name="description" content="Complete your property listing on OvikaLiving. Add details, photos, pricing and amenities to attract tenants in Noida & Greater Noida." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="rental-form-container">
        <div className="form-header-premium">
          <div className="header-content">
             <h1>List Your <span className="highlight">Property</span></h1>
             <p>Market your property to thousands of high-quality tenants</p>
          </div>
          <div className="stepper-horizontal">
            {STEPS.map((s) => (
              <div key={s.id} className={`step-item ${s.id === step ? 'active' : s.id < step ? 'completed' : ''}`}>
                <div className="icon-box">{s.id < step ? <CheckCircle2 size={16} /> : s.icon}</div>
                <span>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-main-card">
          {/* ── STEP 1: Basic Info ───────────────────────────────────────────── */}
          {step === 1 && (
            <div className="step-fade">
              <h2 className="step-title">{isHomestay ? "Tell us about your place" : "Basic Information"}</h2>
              <div className="form-grid">
                {/* ── Homestay & BnB: place type cards ── */}
                {isHomestay && (
                  <>
                    <div className="field-group full">
                      <label>Which best describes your place?</label>
                      <div className="bnb-place-types">
                        {PLACE_TYPES_BNB.map(pt => (
                          <div
                            key={pt.id}
                            className={`bnb-place-card ${form.placeType === pt.id ? 'selected' : ''}`}
                            onClick={() => setForm(f => ({ ...f, placeType: pt.id }))}
                          >
                            <span className="bnb-place-icon">{pt.icon}</span>
                            <div>
                              <div className="bnb-place-title">{pt.label}</div>
                              <div className="bnb-place-desc">{pt.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="field-group full">
                      <label>Property Type</label>
                      <div className="chips-grid">
                        {BNB_PROP_TYPES.map(t => (
                          <div key={t} className={`amenity-chip ${form.propertyType === t ? 'selected' : ''}`}
                            onClick={() => setForm(f => ({ ...f, propertyType: t }))}>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── Apartment & Villas: chip-based property type + BHK ── */}
                {!isPG && !isHomestay ? (
                  <>
                    <div className="field-group full">
                      <label>Property Type</label>
                      <div className="chips-grid">
                        {APT_PROP_TYPES.map(t => (
                          <div key={t} className={`amenity-chip ${form.propertyType === t ? 'selected' : ''}`}
                            onClick={() => setForm(f => ({ ...f, propertyType: t }))}>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="field-group full">
                      <label>BHK Configuration</label>
                      <div className="chips-grid">
                        {BHK_OPTIONS.map(b => (
                          <div key={b} className={`amenity-chip ${form.bhk === b ? 'selected' : ''}`}
                            onClick={() => setForm(f => ({ ...f, bhk: b }))}>
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : isPG ? (
                  <div className="field-group">
                    <label>Specific Property Type</label>
                    <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                      {PROPERTY_TYPES[form.propertyCategory]?.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ) : null}


                {/* ── Homestay: description highlights ── */}
                {isHomestay && (
                  <div className="field-group full">
                    <label>What makes your place special? <span style={{fontWeight:400,color:'#9ca3af',fontSize:12}}>(choose up to 2)</span></label>
                    <div className="chips-grid">
                      {DESC_HIGHLIGHTS.map(h => {
                        const selected = form.descriptionHighlights.includes(h);
                        return (
                          <div key={h}
                            className={`amenity-chip ${selected ? 'selected' : ''}`}
                            onClick={() => setForm(f => {
                              const arr = f.descriptionHighlights;
                              return { ...f, descriptionHighlights: selected ? arr.filter(x => x !== h) : arr.length < 2 ? [...arr, h] : arr };
                            })}>
                            {h}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="field-group full">
                  <label>{isHomestay ? 'Give your place a title *' : 'Property Title / Building Name *'}</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder={isHomestay ? 'e.g. Cozy hillside cottage with mountain view' : 'e.g. Spacious 3BHK in DLF Phase 5'} />
                  {isHomestay && <div style={{fontSize:11,color:'#9ca3af',marginTop:4}}>{form.title.length}/50 characters</div>}
                  {errors.title && <span className="error">{errors.title}</span>}
                </div>

                <div className="field-group full">
                  <label>Short Description *</label>
                  <textarea name="mainDescription" value={form.mainDescription} onChange={handleChange} rows={isHomestay ? 4 : 2} placeholder={isHomestay ? 'Share what makes your place special — views, vibes, what guests love most...' : 'Tell us about the highlights of your property...'} />
                  {isHomestay && <div style={{fontSize:11,color:'#9ca3af',marginTop:4}}>{form.mainDescription.length}/500 characters</div>}
                </div>
                <div className="field-group full" ref={addrWrapRef} style={{ position: 'relative' }}>
                  <label>Full Address *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleAddressInput}
                      onFocus={() => addrSuggestions.length > 0 && setShowAddrDrop(true)}
                      placeholder="Start typing street, locality, area..."
                      autoComplete="off"
                      style={errors.address ? { borderColor: '#ef4444', width: '100%', boxSizing: 'border-box' } : { width: '100%', boxSizing: 'border-box' }}
                    />
                    {addrLoading && (
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#94a3b8' }}>
                        Searching...
                      </span>
                    )}
                  </div>
                  {showAddrDrop && addrSuggestions.length > 0 && (
                    <ul style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
                      background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.10)', margin: '4px 0 0', padding: 0,
                      listStyle: 'none', overflow: 'hidden',
                    }}>
                      {addrSuggestions.map((item, idx) => (
                        <li
                          key={idx}
                          onMouseDown={() => selectAddrSuggestion(item)}
                          style={{
                            padding: '10px 14px', cursor: 'pointer', fontSize: 13,
                            color: '#334155', borderBottom: idx < addrSuggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fef4e6'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}
                        >
                          <MapPin size={14} style={{ color: '#c2772b', marginTop: 3, flexShrink: 0 }} />
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontWeight: 600, color: '#1e293b', display: 'block', lineHeight: 1.3 }}>
                              {item.name || item.display_name.split(',')[0]}
                            </span>
                            <span style={{ color: '#64748b', fontSize: 11.5, display: 'block', marginTop: 2, lineHeight: 1.4 }}>
                              {item.display_name.split(',').slice(1, 5).join(', ').trim()}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
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
                {!isPG && (
                  <>
                    <div className="field-group">
                      <label>Flat / Unit No.</label>
                      <input name="flatNo" value={form.flatNo} onChange={handleChange} placeholder="e.g. A-304" />
                    </div>
                    <div className="field-group">
                      <label>Carpet Area</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="number" name="carpetArea" value={form.carpetArea} onChange={handleChange} placeholder="e.g. 950" style={{ flex: 1 }} />
                        <select name="areaUnit" value={form.areaUnit} onChange={handleChange} style={{ width: 100 }}>
                          <option>sq. ft.</option>
                          <option>sq. m.</option>
                          <option>sq. yd.</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: Layout & Room Config ─────────────────────────────────── */}
          {step === 2 && (
            <div className="step-fade">
              <h2 className="step-title">{isHomestay ? "Share some basics about your place" : "Property Layout & Room Configuration"}</h2>
              {isHomestay && <p style={{color:'#6b7280',fontSize:14,marginBottom:20,marginTop:-8}}>You'll add more details later, such as bed types.</p>}
              <div className="form-grid">

                {/* ── HOMESTAY: Airbnb-style stepper counters ─────────────────── */}
                {isHomestay && (
                  <div className="field-group full">
                    <div className="bnb-stepper-list">
                      {[
                        { label: 'Guests',    key: 'maxGuests', min: 1, max: 30 },
                        { label: 'Bedrooms',  key: 'bedrooms',  min: 0, max: 20 },
                        { label: 'Beds',      key: 'beds',      min: 1, max: 30 },
                        { label: 'Bathrooms', key: 'bathrooms', min: 1, max: 20 },
                      ].map(({ label, key, min, max }) => (
                        <div key={key} className="bnb-stepper-row">
                          <span className="bnb-stepper-label">{label}</span>
                          <div className="bnb-stepper-controls">
                            <button type="button"
                              className="bnb-stepper-btn"
                              disabled={Number(form[key]) <= min}
                              onClick={() => setForm(f => ({ ...f, [key]: Math.max(min, Number(f[key]) - 1) }))}>
                              −
                            </button>
                            <span className="bnb-stepper-val">{form[key]}</span>
                            <button type="button"
                              className="bnb-stepper-btn"
                              disabled={Number(form[key]) >= max}
                              onClick={() => setForm(f => ({ ...f, [key]: Math.min(max, Number(f[key]) + 1) }))}>
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── PRICING MODE TOGGLE (only for non-PG, non-Homestay) ──────── */}
                {!isPG && !isHomestay && (
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

                {/* ── ROOM DETAILS (not for Homestay — they use steppers above) ── */}
                {!isHomestay && <div className="field-group full">
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

                          <div className="field-group">
                            <label>Room Area (sq.ft)</label>
                            <input type="number" placeholder="e.g. 120" value={room.areaSqFt || ''} onChange={(e) => updateRoom(idx, 'areaSqFt', e.target.value)} />
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
                </div>}

                {/* ── BATHROOM CONFIGURATION (PG only — Apartments use chips below) ── */}
                {isPG && <div className="field-group full">
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
                </div>}
                {/* ── END BATHROOM SECTION ── */}

                {/* ── Apartments: quick count chips for bath/balcony/parking ── */}
                {!isPG && (
                  <div className="field-group full">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
                      <div>
                        <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8, display: 'block' }}>Bathrooms</label>
                        <div className="chips-grid">
                          {BATH_COUNT_OPTS.map(n => (
                            <div key={n} className={`amenity-chip ${form.bathrooms === n ? 'selected' : ''}`}
                              onClick={() => setForm(f => ({ ...f, bathrooms: n }))}>
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8, display: 'block' }}>Balconies</label>
                        <div className="chips-grid">
                          {BALCONY_OPTS.map(n => (
                            <div key={n} className={`amenity-chip ${form.balconies === n ? 'selected' : ''}`}
                              onClick={() => setForm(f => ({ ...f, balconies: n }))}>
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8, display: 'block' }}>Covered Parking</label>
                        <div className="chips-grid">
                          {PARK_COUNT_OPTS.map(n => (
                            <div key={n} className={`amenity-chip ${form.coveredParking === n ? 'selected' : ''}`}
                              onClick={() => setForm(f => ({ ...f, coveredParking: n }))}>
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8, display: 'block' }}>Open Parking</label>
                        <div className="chips-grid">
                          {PARK_COUNT_OPTS.map(n => (
                            <div key={n} className={`amenity-chip ${form.openParking === n ? 'selected' : ''}`}
                              onClick={() => setForm(f => ({ ...f, openParking: n }))}>
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8, display: 'block' }}>Servant Room</label>
                      <div className="chips-grid">
                        {['No', 'Yes'].map(v => (
                          <div key={v} className={`amenity-chip ${form.servantRoom === v ? 'selected' : ''}`}
                            onClick={() => setForm(f => ({ ...f, servantRoom: v }))}>
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!isPG && (
                <div className="field-group full">
                  <div className="section-subtitle" style={{ marginTop: '24px' }}>Maximum Guests Allowed</div>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', background: '#fafafa' }}>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>How many guests can stay at this property at once?</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button type="button" onClick={() => setForm(f => ({ ...f, maxGuests: Math.max(1, (Number(f.maxGuests) || 1) - 1) }))} disabled={form.maxGuests <= 1} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid #d1d5db', background: '#fff', fontSize: '1.3rem', cursor: form.maxGuests <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: form.maxGuests <= 1 ? '#ccc' : '#374151' }}>−</button>
                      <span style={{ fontSize: '1.5rem', fontWeight: '700', minWidth: '2.5rem', textAlign: 'center', color: '#1e293b' }}>{form.maxGuests || 1}</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, maxGuests: (Number(f.maxGuests) || 1) + 1 }))} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid #c98b3e', background: '#c98b3e', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff' }}>+</button>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>guests</span>
                    </div>
                  </div>
                </div>
                )}

                {!isPG && (
                <div className="field-group">
                  <label>Total Built-up Area (Sq Ft) *</label>
                  <input type="number" name="area" value={form.area} onChange={handleChange} placeholder="Total house area" />
                </div>
                )}
                <div className="field-group">
                  <label>Overall Furnishing</label>
                  <select name="furnishing" value={form.furnishing} onChange={e => {
                    const val = e.target.value;
                    setForm(f => ({
                      ...f,
                      furnishing: val,
                      bedroomDetails: f.bedroomDetails.map(room => ({
                        ...room,
                        furnished: val === 'Fully Furnished' ? true : val === 'Unfurnished' ? false : room.furnished,
                      })),
                    }));
                  }}>
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

              {/* ── Flat Furnishings (only for Apartments & Villas) ── */}
              {!isPG && (
                <div className="amenity-group" style={{ marginBottom: 24 }}>
                  <h4>What's in the Flat? (Furnishings)</h4>
                  <div className="chips-grid">
                    {FLAT_FURNISHINGS.map(item => (
                      <div
                        key={item}
                        className={`amenity-chip ${form.flatFurnishings[item] ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({
                          ...f,
                          flatFurnishings: { ...f.flatFurnishings, [item]: !f.flatFurnishings[item] }
                        }))}
                      >
                        {form.flatFurnishings[item] && (
                          <span style={{ display:'flex', alignItems:'center', justifyContent:'center', width: 26, height: 26, borderRadius: 8, background: '#fff', color: '#c98b3e', flexShrink: 0 }}>
                            <CheckCircle2 size={16} />
                          </span>
                        )}
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                            {form.amenities[a] ? (
                              <span style={{ display:'flex', alignItems:'center', justifyContent:'center', width: 30, height: 30, borderRadius: 8, background: '#fff', color: '#c98b3e', flexShrink: 0 }}>
                                <CheckCircle2 size={18} />
                              </span>
                            ) : AMENITY_ICONS[a] ? (
                              <span style={{ display:'flex', alignItems:'center', justifyContent:'center', width: 30, height: 30, borderRadius: 8, background: 'rgba(201,139,62,0.15)', color: '#c98b3e', flexShrink: 0 }}>
                                {AMENITY_ICONS[a]}
                              </span>
                            ) : null}
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
                    <span>Up to 40 high-quality images</span>
                 </label>
              </div>
              <div className="preview-grid">
                 {photoPreviews.previews.map((p, i) => (
                   <div key={i} className={`preview-item ${coverIndex === i ? 'is-cover' : ''}`}>
                      <div className="preview-item-img-wrap">
                        <img src={p.url} alt="prop" />
                        <div className="preview-overlay-fixed">
                           <div className="top-actions">
                              <button
                                type="button"
                                className="remove-btn-premium"
                                onClick={(e) => { e.stopPropagation(); handleRemovePhoto(i); }}
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
                      {/* Room label dropdown */}
                      <select
                        value={photoLabels[i] || ''}
                        onChange={(e) => handlePhotoLabel(i, e.target.value)}
                        style={{
                          width: '100%',
                          border: '1.5px solid #e2e8f0',
                          borderTop: 'none',
                          borderRadius: '0 0 10px 10px',
                          padding: '8px 10px',
                          fontSize: 12,
                          color: photoLabels[i] ? '#1e293b' : '#9ca3af',
                          background: '#f9fafb',
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        <option value="">— Tag this photo —</option>
                        <option value="Living Room">🪑 Living Room</option>
                        <option value="Bedroom">🛏️ Bedroom</option>
                        <option value="Kitchen">🍳 Kitchen</option>
                        <option value="Dining Area">🍽️ Dining Area</option>
                        <option value="Bathroom">🚿 Bathroom</option>
                        <option value="Common Area">🛋️ Common Area</option>
                        <option value="Balcony">🌿 Balcony</option>
                        <option value="Terrace">☀️ Terrace</option>
                        <option value="Study Room">📚 Study Room</option>
                        <option value="Entrance / Main Door">🚪 Entrance / Main Door</option>
                        <option value="Staircase">🪜 Staircase</option>
                        <option value="Parking">🚗 Parking</option>
                        <option value="Garden / Outdoor">🌳 Garden / Outdoor</option>
                        <option value="Gym">💪 Gym</option>
                        <option value="Swimming Pool">🏊 Swimming Pool</option>
                        <option value="Exterior / Building">🏢 Exterior / Building</option>
                        <option value="Other">📷 Other</option>
                      </select>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* ── STEP 6: Pricing ──────────────────────────────────────────────── */}
          {step === 6 && (
            <div className="step-fade">
              <h2 className="step-title">{isHomestay ? "Now, set your price" : "Rent & Financials"}</h2>
              {isHomestay && <p style={{color:'#6b7280',fontSize:14,marginBottom:20,marginTop:-8}}>You can always change it later.</p>}
              <div className="form-grid">

                {/* ── HOMESTAY: nightly base price + discounts ── */}
                {isHomestay && (
                  <>
                    <div className="field-group full">
                      <label>Nightly Rate (₹)</label>
                      <div className="bnb-price-input-wrap">
                        <span className="bnb-price-symbol">₹</span>
                        <input type="number" name="baseRate" value={form.baseRate} onChange={handleChange}
                          className="bnb-price-input" placeholder="0" />
                      </div>
                    </div>

                    <div className="field-group full">
                      <label>Available From</label>
                      <input type="date" name="availableFrom" value={form.availableFrom} onChange={handleChange} />
                    </div>

                    {/* Discount cards */}
                    <div className="field-group full">
                      <div className="section-separator">Add discounts</div>
                      <p style={{fontSize:13,color:'#6b7280',marginBottom:12}}>Help your place stand out and get booked faster.</p>
                      <div className="bnb-discount-list">
                        {[
                          { key: 'newListingDiscount',  pct: '20%', title: 'New listing promotion',  desc: 'Offer 20% off your first 3 bookings' },
                          { key: 'lastMinuteDiscount',  pct: '5%',  title: 'Last-minute discount',   desc: 'For stays booked 14 days or less before arrival' },
                        ].map(d => (
                          <label key={d.key} className={`bnb-discount-card ${form[d.key] ? 'active' : ''}`}>
                            <div className="bnb-discount-pct">{d.pct}</div>
                            <div className="bnb-discount-info">
                              <div className="bnb-discount-title">{d.title}</div>
                              <div className="bnb-discount-desc">{d.desc}</div>
                            </div>
                            <input type="checkbox" checked={form[d.key]}
                              onChange={e => setForm(f => ({ ...f, [d.key]: e.target.checked }))}
                              style={{width:18,height:18,accentColor:'#c98b3e',cursor:'pointer',flexShrink:0}} />
                          </label>
                        ))}
                        <div className="bnb-discount-card" style={{cursor:'default'}}>
                          <div className="bnb-discount-pct">%</div>
                          <div className="bnb-discount-info">
                            <div className="bnb-discount-title">Weekly discount</div>
                            <div className="bnb-discount-desc">For stays of 7 nights or more</div>
                          </div>
                          <input type="number" value={form.weeklyDiscount} onChange={e => setForm(f => ({ ...f, weeklyDiscount: e.target.value }))}
                            placeholder="0%" style={{width:60,border:'1px solid #e5e7eb',borderRadius:8,padding:'6px 8px',fontSize:14,textAlign:'center'}} />
                        </div>
                        <div className="bnb-discount-card" style={{cursor:'default'}}>
                          <div className="bnb-discount-pct">%</div>
                          <div className="bnb-discount-info">
                            <div className="bnb-discount-title">Monthly discount</div>
                            <div className="bnb-discount-desc">For stays of 28 nights or more</div>
                          </div>
                          <input type="number" value={form.monthlyDiscount} onChange={e => setForm(f => ({ ...f, monthlyDiscount: e.target.value }))}
                            placeholder="0%" style={{width:60,border:'1px solid #e5e7eb',borderRadius:8,padding:'6px 8px',fontSize:14,textAlign:'center'}} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── For non-PG, non-Homestay single pricing: show base price fields ── */}
                {!isPG && !isHomestay && !usePerRoomPricing && (
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

                {/* ── For per-room pricing (non-PG, non-Homestay): show summary / reminder ── */}
                {!isPG && !isHomestay && usePerRoomPricing && (
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

                {!isHomestay && <>
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
                </>}

                {isPG && (
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
                )}

                {!isHomestay && <>
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
                </>}

                {!isPG && !isHomestay && (<>
                {/* ── Security Deposit chips ── */}
                <div className="field-group full">
                  <div className="section-separator">Security Deposit</div>
                </div>
                <div className="field-group full">
                  <div className="chips-grid">
                    {SECURITY_DEP_OPTS.map(v => (
                      <div key={v} className={`amenity-chip ${form.securityDepositType === v ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, securityDepositType: v }))}>
                        {v}
                      </div>
                    ))}
                  </div>
                  {form.securityDepositType === 'Custom' && (
                    <input type="number" style={{ marginTop: 10 }} placeholder="Enter security deposit amount (₹)"
                      name="customSecurityDeposit" value={form.customSecurityDeposit} onChange={handleChange} />
                  )}
                </div>

                {/* ── Maintenance Charges chips ── */}
                <div className="field-group full">
                  <div className="section-separator">Maintenance Charges</div>
                </div>
                <div className="field-group full">
                  <div className="chips-grid">
                    {MAINTENANCE_OPTS.map(v => (
                      <div key={v} className={`amenity-chip ${form.maintenanceChargesType === v ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, maintenanceChargesType: v }))}>
                        {v}
                      </div>
                    ))}
                  </div>
                  {form.maintenanceChargesType === 'Separate' && (
                    <input type="number" style={{ marginTop: 10 }} placeholder="Maintenance amount (₹/month)"
                      name="maintenanceCharge" value={form.maintenanceCharge} onChange={handleChange} />
                  )}
                </div>

                {/* ── Lock-in Period chips ── */}
                <div className="field-group full">
                  <div className="section-separator">Lock-in Period</div>
                </div>
                <div className="field-group full">
                  <div className="chips-grid">
                    {LOCK_IN_OPTS.map(v => (
                      <div key={v} className={`amenity-chip ${form.lockInPeriod === v ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, lockInPeriod: v }))}>
                        {v}
                      </div>
                    ))}
                  </div>
                  {form.lockInPeriod === 'Custom' && (
                    <input type="text" style={{ marginTop: 10 }} placeholder="e.g. 3 months"
                      name="customLockIn" value={form.customLockIn} onChange={handleChange} />
                  )}
                </div>

                {/* ── Parking Charges chips ── */}
                <div className="field-group full">
                  <div className="section-separator">Parking Charges</div>
                </div>
                <div className="field-group full">
                  <div className="chips-grid">
                    {PARKING_CHG_OPTS.map(v => (
                      <div key={v} className={`amenity-chip ${form.parkingChargesType === v ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, parkingChargesType: v }))}>
                        {v}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Painting Charges chips ── */}
                <div className="field-group full">
                  <div className="section-separator">Painting Charges (at move-out)</div>
                </div>
                <div className="field-group full">
                  <div className="chips-grid">
                    {PAINTING_CHG_OPTS.map(v => (
                      <div key={v} className={`amenity-chip ${form.paintingChargesType === v ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, paintingChargesType: v }))}>
                        {v}
                      </div>
                    ))}
                  </div>
                  {form.paintingChargesType === 'Custom' && (
                    <input type="text" style={{ marginTop: 10 }} placeholder="e.g. ₹5000 fixed"
                      name="customPaintingCharges" value={form.customPaintingCharges} onChange={handleChange} />
                  )}
                </div>

                {/* ── Tenant Type simplified chips ── */}
                <div className="field-group full">
                  <div className="section-separator">Preferred Tenants</div>
                </div>
                <div className="field-group full">
                  <div className="chips-grid">
                    {TENANT_TYPE_SIMPLE.map(v => (
                      <div key={v}
                        className={`amenity-chip ${form.tenantTypeSimple.includes(v) ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({
                          ...f,
                          tenantTypeSimple: f.tenantTypeSimple.includes(v)
                            ? f.tenantTypeSimple.filter(t => t !== v)
                            : [...f.tenantTypeSimple, v]
                        }))}>
                        {v}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Pet Friendly chips ── */}
                <div className="field-group">
                  <label>Pet Friendly</label>
                  <div className="chips-grid">
                    {['Yes', 'No', 'Negotiable'].map(v => (
                      <div key={v} className={`amenity-chip ${form.petFriendly === v ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, petFriendly: v }))}>
                        {v}
                      </div>
                    ))}
                  </div>
                </div>

                </>)}
              </div>
            </div>
          )}

        </div>

        <div className="form-footer-nav">
           <button className="btn-back" onClick={prevStep} disabled={step === 1}>Back</button>
           {step < 6 ? (
             <button className="btn-next" onClick={nextStep}>Continue</button>
           ) : (
             <button className="btn-submit" onClick={handleSubmit} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
               {isSubmitting ? (
                 <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="spin-icon"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                   Compressing &amp; Uploading...
                 </span>
               ) : 'Publish Listing'}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default PGListingForm;