import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./tmx9pf-form.css";
import { AuthContext } from "../Login/AuthContext";
import CityDropdown, { addressContainsCityOrState } from "./CityDropdown";
import { useStepBackNav } from "../../utils/useStepBackNav";
import { compressImage } from "../../utils/compressImage";

const API_BASE = "https://www.townmanor.ai/api";
const STORAGE_KEY = "user";

const TimePickerAMPM = ({ value, onChange, className }) => {
  const parse = (t) => {
    if (!t) return { h: 12, m: '00', period: 'AM' };
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
  const selStyle = { flex: 1, minWidth: 0 };
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <select value={h} onChange={e => emit(e.target.value, m, period)} className={className} style={selStyle}>
        {[12,1,2,3,4,5,6,7,8,9,10,11].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <select value={m} onChange={e => emit(h, e.target.value, period)} className={className} style={selStyle}>
        {['00','15','30','45'].map(min => <option key={min} value={min}>{min}</option>)}
      </select>
      <select value={period} onChange={e => emit(h, m, e.target.value)} className={className} style={selStyle}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

const AMENITIES = {
  Basic: ["Wi-Fi", "Heating", "Air conditioning", "Hot water"],
  Kitchen: ["Refrigerator", "Stovetop/oven", "Microwave", "Cooking utensils", "Electric Kettle", "Hob", "Chimney", "RO", "Toaster", "Rice Cooker", "Coffee Maker", "Induction Cooktop", "Dining Counter"],
  Bathroom: ["Bath Towels", "Soap & Shampoo"],
  Appliances: ["Washing Machine", "Iron & Board"],
  Entertainment: ["TV", "Google TV", "Streaming services"],
  Safety: ["Smoke detector", "Carbon monoxide detector", "Fire extinguisher", "First aid kit", "Electronic Entry Lock", "Electronic Bedroom Lock", "Sprinkler"],
  Outdoor: ["Balcony/terrace", "Garden", "Parking space", "Basement Free Parking", "BBQ grill", "Tennis Court", "Golf Course"],
  Wellness: ["Swimming Pool", "Hot tub", "Sauna", "Gym"],
  Accessibility: ["Wheelchair accessible", "Elevator", "Ramp access"],
  Services: ["Breakfast Included", "Lunch Included", "Dinner Included", "All Meals Included", "Airport pick-up", "Luggage storage", "Cleaning on request"],
};

const DEFAULT_CANCELLATION_POLICIES = ["Flexible", "Moderate", "Strict"];
const DEFAULT_PROPERTY_CATEGORIES = [
  "Signature Stays",
  "Hotel Stays",
  "Homestays & BnB",
  "Apartments & Villas",
  "PG & Co-Living",
];

const PROPERTY_TYPES = ["Entire place", "Private room"];

// ── Homestay & BnB specific ───────────────────────────────────────────────
const BNB_PLACE_TYPES = [
  { id: "Entire Place",  label: "An entire place",           desc: "Guests have the whole place to themselves.", icon: "🏠" },
  { id: "Private Room",  label: "A private room",            desc: "Guests have their own room, plus access to shared spaces.", icon: "🚪" },
  { id: "Shared Room",   label: "A shared room in a hostel", desc: "Guests sleep in a shared room with other guests.", icon: "🛏️" },
];
const BNB_PROP_TYPES   = ["Homestay", "Bed & Breakfast", "Vacation Rental", "Farm Stay", "Guesthouse", "Cottage", "Villa", "Treehouse", "Tiny Home"];
const BNB_HIGHLIGHTS   = ["Peaceful", "Unique", "Family-friendly", "Stylish", "Central", "Spacious", "Scenic", "Cozy"];

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
  const clear = () => setPreviews([]);
  const remove = (index) => setPreviews(prev => prev.filter((_, i) => i !== index));
  return { previews, update, clear, remove };
}

const ACCEPTED_MIME = ["application/pdf", "image/avif"];
function isImageMime(mime) {
  return typeof mime === "string" && mime.startsWith("image/");
}
function isAcceptedFile(file) {
  if (!file) return false;
  const { type, name } = file;
  if (isImageMime(type)) return true;
  if (ACCEPTED_MIME.includes(type)) return true;
  const ext = (name || "").split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "avif", "pdf"].includes(ext)) return true;
  return false;
}

const Tmx9PropertyForm = ({ propId: passedId, onComplete } = {}) => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const editId = passedId || paramId;
  const isEditMode = !!editId;

  const urlCategory = searchParams.get('category');
  const hasValidUrlCategory = DEFAULT_PROPERTY_CATEGORIES.includes(urlCategory);
  const initCategory = hasValidUrlCategory ? urlCategory : DEFAULT_PROPERTY_CATEGORIES[0];

  // If the host landed here without a valid ?category= in the URL (e.g. via a nav
  // link that doesn't specify one), don't silently default to "Signature Stays" —
  // make them explicitly pick a category first.
  const [needsCategoryPicker, setNeedsCategoryPicker] = useState(!hasValidUrlCategory && !passedId && !paramId);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(isEditMode);
  const [existingPhotos, setExistingPhotos] = useState([]);

  const [form, setForm] = useState({
    propertyType: PROPERTY_TYPES[0],
    propertyCategory: initCategory,
    bnbPlaceType: "Entire Place",
    bnbPropType: "Homestay",
    bnbHighlights: [],
    newListingDiscount: false,
    lastMinuteDiscount: false,
    title: "",
    mainDescription: "",
    address: "",
    country: "India",
    postalCode: "",
    city: "",
    latitude: "",
    longitude: "",
    bedroomDetails: [{ id: 0, type: "King Bed", count: 1 }],
    bathroomDetails: [{ id: 0, type: "Attached", count: 1 }],
    hotelRoomTypes: [{ id: 0, roomType: "Standard Room", numberOfRooms: 1, bedType: "King Bed", maxOccupancy: 2, areaSqFt: "", pricePerNight: "" }],
    beds: 1,
    area: "",
    amenities: {},
    checkInTime: "15:00:00",
    checkOutTime: "11:00:00",
    smokingAllowed: false,
    petsAllowed: false,
    eventsAllowed: false,
    drinkingAllowed: false,
    outsideGuestsAllowed: false,
    quietHours: "22:00-07:00",
    maxGuests: 2,
    baseRate: "",
    bookingType: 0,
    weekendRate: "",
    weeklyDiscountPct: "",
    monthlyDiscountPct: "",
    cleaningFee: "",
    selfCheckIn: "",
    registrationNumber: "",
    localCompliance: "",
    // Guidebook fields
    transportTips: {
      taxi: "",
      parking: "",
      localTravel: ""
    },
    cafesRestaurants: [{ id: 0, name: "", distanceM: "" }],
    essentialsNearby: {
      atm: "",
      grocery: "",
      medical: ""
    },
    mustVisitPlaces: [{ id: 0, place: "", bestTime: "" }],
    houseSpecificTips: [""],
    familyAllowed: false,
  unmarriedCoupleAllowed: false,
   bachelorAllowed: false,

  });

  // Derived from form state (not the URL-only initial category) so that, in edit mode,
  // these correctly flip once the fetched property's real category is loaded into form.
  const isHomestay = form.propertyCategory === "Homestays & BnB";
  const isHotel = form.propertyCategory === "Hotel Stays";

  const photoPreviews = useFilePreviews();
  const [coverIndex, setCoverIndex] = useState(null);
  const [idFiles, setIdFiles] = useState([]);
  const [selfieFile, setSelfieFile] = useState(null);
  const [policy, setPolicy] = useState(DEFAULT_CANCELLATION_POLICIES[0]);
  const [insurance, setInsurance] = useState(false);
  const [damageProtection, setDamageProtection] = useState(false);

  const [idMethod, setIdMethod] = useState("aadhaar");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);

  // Phone Verification State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpClientId, setOtpClientId] = useState(null);

  const STEPS = [
    { id: 1, title: "Your Space" },
    { id: 2, title: "About" },
    { id: 3, title: "Location" },
    { id: 4, title: "Rooms" },
    { id: 5, title: "Amenities" },
    { id: 6, title: "Rules" },
    { id: 7, title: "Nearby" },
    { id: 8, title: "Photos" },
    { id: 9, title: "Pricing" },
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const all = {};
    Object.values(AMENITIES).flat().forEach((a) => (all[a] = false));
    setForm((f) => ({ ...f, amenities: all }));
  }, []);

  // ── EDIT MODE: fetch the existing property and prefill the whole form ──────
  useEffect(() => {
    if (!isEditMode) return;
    let cancelled = false;
    (async () => {
      setIsLoadingEdit(true);
      try {
        const res = await fetch(`${API_BASE}/ovika/properties/${editId}`);
        const json = await res.json().catch(() => null);
        const data = json?.data || json;
        if (!data) throw new Error("No property data returned");
        if (cancelled) return;

        const parseJson = (val, fallback) => {
          if (val === null || val === undefined) return fallback;
          if (typeof val === "object") return val;
          try { return JSON.parse(val); } catch { return fallback; }
        };
        const guidebook = parseJson(data.guidebook, {});
        const guestPolicy = parseJson(data.guest_policy, {});
        const bedroomsRaw = parseJson(data.bedrooms, []);
        const bathroomsRaw = parseJson(data.bathrooms, []);
        const amenitiesRaw = parseJson(data.amenities, []);
        const category = DEFAULT_PROPERTY_CATEGORIES.includes(data.property_category) ? data.property_category : DEFAULT_PROPERTY_CATEGORIES[0];
        const hotel = category === "Hotel Stays";

        setForm(f => ({
          ...f,
          propertyType: data.property_type || f.propertyType,
          propertyCategory: category,
          title: data.property_name || "",
          mainDescription: data.description || "",
          address: data.address || "",
          country: data.country || "India",
          postalCode: data.postal_code || "",
          city: data.city || "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
          bedroomDetails: (!hotel && Array.isArray(bedroomsRaw) && bedroomsRaw.length)
            ? bedroomsRaw.map((b, i) => ({ id: i, type: b.type || "King Bed", count: Number(b.count) || 1 }))
            : f.bedroomDetails,
          bathroomDetails: (Array.isArray(bathroomsRaw) && bathroomsRaw.length)
            ? bathroomsRaw.map((b, i) => ({ id: i, type: b.type || "Attached", count: Number(b.count) || 1 }))
            : f.bathroomDetails,
          hotelRoomTypes: (hotel && Array.isArray(bedroomsRaw) && bedroomsRaw.length)
            ? bedroomsRaw.map((b, i) => ({ id: i, roomType: b.type || "Standard Room", numberOfRooms: Number(b.count) || 1, bedType: b.bedType || "King Bed", maxOccupancy: 2, areaSqFt: b.areaSqFt || "", pricePerNight: b.price || "" }))
            : f.hotelRoomTypes,
          beds: data.beds ?? f.beds,
          area: data.area || "",
          amenities: (() => { const all = {}; Object.values(AMENITIES).flat().forEach(a => { all[a] = Array.isArray(amenitiesRaw) && amenitiesRaw.includes(a); }); return all; })(),
          checkInTime: data.check_in_time || f.checkInTime,
          checkOutTime: data.check_out_time || f.checkOutTime,
          smokingAllowed: !!data.smoking_allowed,
          petsAllowed: !!data.pets_allowed,
          eventsAllowed: !!data.events_allowed,
          drinkingAllowed: !!data.drinking_alcohol,
          outsideGuestsAllowed: !!data.outside_guests_allowed,
          quietHours: data.quiet_hours || f.quietHours,
          maxGuests: data.max_guests ?? f.maxGuests,
          baseRate: data.price ?? "",
          bookingType: data.booking_type !== undefined && data.booking_type !== null ? Number(data.booking_type) : f.bookingType,
          weekendRate: data.weekend_rate ?? "",
          weeklyDiscountPct: data.weekly_discount_pct ?? "",
          monthlyDiscountPct: data.monthly_discount_pct ?? "",
          cleaningFee: data.cleaning_fee ?? "",
          selfCheckIn: data.self_check_in !== undefined && data.self_check_in !== null
            ? (Number(data.self_check_in) === 1 ? "Available" : "Not Available")
            : f.selfCheckIn,
          registrationNumber: data.registration_number || "",
          localCompliance: data.local_compliance || "",
          transportTips: {
            taxi: guidebook.transport_tips?.taxi || "",
            parking: guidebook.transport_tips?.parking || "",
            localTravel: guidebook.transport_tips?.local_travel || guidebook.transport_tips?.localTravel || "",
          },
          cafesRestaurants: (Array.isArray(guidebook.cafes_restaurants) && guidebook.cafes_restaurants.length)
            ? guidebook.cafes_restaurants.map((c, i) => ({ id: i, name: c.name || "", distanceM: c.distance_m ?? "" }))
            : f.cafesRestaurants,
          essentialsNearby: {
            atm: guidebook.essentials_nearby?.atm || "",
            grocery: guidebook.essentials_nearby?.grocery || "",
            medical: guidebook.essentials_nearby?.medical || "",
          },
          mustVisitPlaces: (Array.isArray(guidebook.must_visit_places) && guidebook.must_visit_places.length)
            ? guidebook.must_visit_places.map((p, i) => ({ id: i, place: p.place || "", bestTime: p.best_time || "" }))
            : f.mustVisitPlaces,
          houseSpecificTips: (Array.isArray(guidebook.house_specific_tips) && guidebook.house_specific_tips.length) ? guidebook.house_specific_tips : f.houseSpecificTips,
          familyAllowed: !!guestPolicy.family_allowed,
          unmarriedCoupleAllowed: !!guestPolicy.unmarried_couple_allowed,
          bachelorAllowed: !!guestPolicy.bachelors_allowed,
        }));

        setPolicy(data.cancellation_policy || DEFAULT_CANCELLATION_POLICIES[0]);
        setInsurance(data.insurance === "1" || data.insurance === 1 || data.insurance === true);
        setDamageProtection(data.damage_protection === "1" || data.damage_protection === 1 || data.damage_protection === true);

        let photos = [];
        if (Array.isArray(data.photos)) photos = data.photos;
        else if (typeof data.photos === "string") { try { photos = JSON.parse(data.photos); } catch { photos = data.photos.split(",").filter(Boolean); } }
        setExistingPhotos(photos.filter(Boolean));
        setCoverIndex(Number(data.cover_photo_index) || 0);
      } catch (err) {
        console.error("Failed to load property for edit:", err);
        alert("Failed to load property data for editing.");
      } finally {
        if (!cancelled) setIsLoadingEdit(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editId, isEditMode]);

  const validateForStep = (s) => {
    const newErrors = {};

    // s=0: Your Space — no required fields (place type has default)

    if (s === 1) {
      if (!form.title?.trim()) newErrors.title = "Title is required";
      if (!form.mainDescription?.trim()) newErrors.mainDescription = "Description is required";
      else if (form.mainDescription.length < 30) newErrors.mainDescription = "Description should be at least 30 characters";
    }

    if (s === 2) {
      if (!form.address?.trim()) newErrors.address = "Address is required";
      else { const hit = addressContainsCityOrState(form.address); if (hit) newErrors.address = `City/state name "${hit}" not allowed in address. Use the City field below.`; }
      if (!form.city?.trim()) newErrors.city = "City is required";
      if (!form.postalCode?.trim()) newErrors.postalCode = "Postal code is required";
      if (!form.country?.trim()) newErrors.country = "Country is required";
      if (form.latitude !== "" && form.latitude !== undefined) {
        const lat = Number(form.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) newErrors.latitude = "Latitude must be between -90 and 90";
      }
      if (form.longitude !== "" && form.longitude !== undefined) {
        const lng = Number(form.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) newErrors.longitude = "Longitude must be between -180 and 180";
      }
    }

    if (s === 3 && isHotel) {
      const totalRooms = form.hotelRoomTypes.reduce((sum, item) => sum + (Number(item.numberOfRooms) || 0), 0);
      if (totalRooms <= 0) newErrors.hotelRoomTypes = "At least one room type with a room count is required";
      if (form.hotelRoomTypes.some(r => !r.roomType)) newErrors.hotelRoomTypes = "Please select a room category for all room types";
      if (form.hotelRoomTypes.some(r => !r.pricePerNight || Number(r.pricePerNight) <= 0)) newErrors.hotelRoomTypes = "Please enter a valid price per night for all room types";
      if (form.hotelRoomTypes.some(r => !r.areaSqFt || !String(r.areaSqFt).trim())) newErrors.hotelRoomTypes = "Please enter the area (sq ft) for all room types";
    }

    if (s === 3 && !isHomestay && !isHotel) {
      const totalBedrooms = form.bedroomDetails.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
      const totalBathrooms = form.bathroomDetails.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
      if (totalBedrooms <= 0) newErrors.bedrooms = "At least one bedroom is required";
      if (form.bedroomDetails.some(d => !d.type)) newErrors.bedrooms = "Please select a type for all bedrooms";
      if (form.beds === "" || form.beds <= 0) newErrors.beds = "At least one bed required";
      if (totalBathrooms <= 0) newErrors.bathrooms = "At least one bathroom is required";
      if (form.bathroomDetails.some(d => !d.type)) newErrors.bathrooms = "Please select a type for all bathrooms";
      if (!form.area?.trim()) newErrors.area = "Area is required";
      else if (form.area.length > 20) newErrors.area = "Area should not exceed 20 characters";
    }

    // s=4: Amenities — optional
    // s=6: Nearby & Tips — optional

    if (s === 5) {
      if (!form.checkInTime) newErrors.checkInTime = "Check-in time required";
      if (!form.checkOutTime) newErrors.checkOutTime = "Check-out time required";
      if (form.maxGuests === "" || form.maxGuests < 1) newErrors.maxGuests = "Max guests must be at least 1";
    }

    if (s === 7) {
      if (photoPreviews.previews.length === 0 && existingPhotos.length === 0) newErrors.photos = "At least one photo is required";
    }

    if (s === 8) {
      if (!isHotel) {
        if (!form.baseRate && form.baseRate !== 0) newErrors.baseRate = "Base rate is required";
        if (form.baseRate && Number(form.baseRate) <= 0) newErrors.baseRate = "Rate must be positive";
      }
      if (form.weeklyDiscountPct && (form.weeklyDiscountPct < 0 || form.weeklyDiscountPct > 100)) newErrors.weeklyDiscountPct = "Discount must be between 0 and 100";
      if (!form.selfCheckIn?.trim()) newErrors.selfCheckIn = "Please select self-check-in availability";
      if (form.bookingType !== 0 && form.bookingType !== 1) newErrors.bookingType = "Please select booking type";
      // Aadhaar verification requirement disabled for now — see commented-out UI further below.
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderError = (field) => (errors[field] ? <span className="tmx9pf-error">{errors[field]}</span> : null);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const handleNumChange = (e) => {
    const { name, value } = e.target;
    if (name === "latitude" || name === "longitude") {
      if (value === "") setForm((s) => ({ ...s, [name]: "" }));
      else {
        const num = Number(value);
        if (!isNaN(num)) setForm((s) => ({ ...s, [name]: num }));
      }
    } else {
      const num = value === "" ? "" : Number(value);
      setForm((s) => ({ ...s, [name]: num }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setForm((s) => ({ ...s, amenities: { ...s.amenities, [amenity]: !s.amenities[amenity] } }));
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      photoPreviews.update([]);
      setErrors((prev) => ({ ...prev, photos: undefined }));
      return;
    }

    const valid = [];
    const invalidNames = [];

    files.forEach((f) => {
      if (isAcceptedFile(f)) valid.push(f);
      else invalidNames.push(f.name);
    });

    if (invalidNames.length > 0) {
      setErrors((prev) => ({
        ...prev,
        photos: `Invalid file type: ${invalidNames.join(", ")}. Allowed: JPG, JPEG, PNG, WEBP, AVIF, GIF, PDF.`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, photos: undefined }));
    }

    if (valid.length > 0) {
      photoPreviews.update(valid);
      setCoverIndex(null);
    } else {
      photoPreviews.update([]);
    }
  };

  const removePhoto = (index) => {
    photoPreviews.remove(index);
    if (coverIndex === index) setCoverIndex(null);
    else if (coverIndex > index) setCoverIndex((c) => c - 1);
  };

  const handleIdFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setIdFiles([]);
      if (!aadhaarVerified) setErrors((prev) => ({ ...prev, idFiles: undefined }));
      return;
    }

    const accepted = [];
    const rejected = [];

    files.forEach((f) => {
      if (isAcceptedFile(f)) accepted.push(f);
      else rejected.push(f.name);
    });

    if (rejected.length > 0) {
      setErrors((prev) => ({
        ...prev,
        idFiles: `Invalid file(s): ${rejected.join(", ")}. Allowed types: JPG, JPEG, PNG, WEBP, AVIF, GIF, PDF.`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, idFiles: undefined }));
    }

    setIdFiles(accepted);
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
        setErrors(prev => ({ ...prev, idFiles: undefined }));
        alert("Aadhaar Verified Successfully!");
      } else {
        setAadhaarVerified(false);
        alert("Verification Failed: " + (data.message || "Invalid Aadhaar"));
      }
    } catch (err) {
      console.error("Aadhaar verification error", err);
      alert("Verification Error. Please try again or use file upload.");
    } finally {
      setIsVerifyingAadhaar(false);
    }
  };

  const sendPhoneOtp = async () => {
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
      } else if (res.status === 429) {
          alert("Verification API is Busy (429). Bypassing for testing experience.");
          setIsPhoneVerified(true); // Dev bypass
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

  const verifyPhoneOtp = async () => {
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
        setErrors(prev => ({ ...prev, phone: undefined }));
        alert("Phone Verified Successfully!");
      } else {
        setIsPhoneVerified(false);
        alert("Verification Failed: " + (data.message || "Invalid OTP"));
      }
    } catch (err) {
      console.error("Phone verification error", err);
      alert("Verification Error. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSelfie = (e) => setSelfieFile(e.target.files?.[0] || null);

  const goNext = () => {
    if (validateForStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const firstError = Object.keys(errors)[0];
      setTimeout(() => {
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useStepBackNav(step, goPrev);

  function extractIdFromObj(obj) {
    if (!obj) return null;
    return obj.id || obj._id || obj.owner_id || obj.userId || obj.uid || null;
  }

  async function fetchServerUser() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { method: "GET", credentials: "include" });
      const d = await res.json().catch(() => ({}));
      const maybe = d?.user || d?.data || d;
      if (extractIdFromObj(maybe)) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(maybe)); } catch (e) {}
        return maybe;
      }
    } catch (err) {
      console.warn("fetchServerUser error:", err);
    }
    return null;
  }

  const resolveOwnerId = async () => {
    const idFromContext = extractIdFromObj(user);
    if (idFromContext) {
      return idFromContext;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const idFromLocal = extractIdFromObj(parsed);
        if (idFromLocal) {
          return idFromLocal;
        }
      }
    } catch (e) {
      console.warn("resolveOwnerId local parse error", e);
    }

    const serverUser = await fetchServerUser();
    const idFromServer = extractIdFromObj(serverUser);
    if (idFromServer) {
      return idFromServer;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const ownerId = await resolveOwnerId();
    if (!ownerId) {
      alert("Owner not found. Please sign in again.");
      setIsSubmitting(false);
      return;
    }

    for (let i = 0; i < STEPS.length; i++) {
      const ok = validateForStep(i);
      if (!ok) {
        setIsSubmitting(false);
        setStep(i);
        return;
      }
    }

    try {
      if (isEditMode) {
        // ── EDIT MODE: upload any new photos separately, then PUT a JSON payload ──
        let uploadedUrls = [];
        const photoEntries = photoPreviews.previews.filter(p => p?.file);
        if (photoEntries.length > 0) {
          try {
            const compressedPhotos = await Promise.all(photoEntries.map(p => compressImage(p.file)));
            const uploadFd = new FormData();
            compressedPhotos.forEach((f, i) => uploadFd.append("images", f, photoEntries[i].name || `photo-${i}`));
            const uploadRes = await fetch("https://www.townmanor.ai/api/image/aws-upload-owner-images", {
              method: "POST",
              body: uploadFd,
            });
            const uploadData = await uploadRes.json().catch(() => null);
            if (uploadRes.ok && Array.isArray(uploadData?.fileUrls)) uploadedUrls = uploadData.fileUrls;
          } catch (err) {
            console.warn("New photo upload failed, continuing without them:", err);
            alert("Could not upload the new photos. The update will proceed without them.");
          }
        }
        const updatedPhotos = [...existingPhotos, ...uploadedUrls];

        const guidebook = {
          transport_tips: {
            taxi: form.transportTips.taxi,
            parking: form.transportTips.parking,
            local_travel: form.transportTips.localTravel
          },
          cafes_restaurants: form.cafesRestaurants
            .filter(c => c.name.trim())
            .map(c => ({ name: c.name, distance_m: Number(c.distanceM) || 0 })),
          essentials_nearby: {
            atm: form.essentialsNearby.atm,
            grocery: form.essentialsNearby.grocery,
            medical: form.essentialsNearby.medical
          },
          must_visit_places: form.mustVisitPlaces
            .filter(p => p.place.trim())
            .map(p => ({ place: p.place, best_time: p.bestTime })),
          house_specific_tips: form.houseSpecificTips.filter(t => t.trim())
        };

        const bedroomsPayload = isHotel
          ? form.hotelRoomTypes.map(r => ({
              type: r.roomType,
              count: Number(r.numberOfRooms) || 0,
              bedType: r.bedType,
              areaSqFt: r.areaSqFt,
              price: Number(r.pricePerNight) || 0,
              attachedBathroom: true,
            }))
          : form.bedroomDetails.map(d => ({ type: d.type, count: d.count }));
        const bathroomsPayload = form.bathroomDetails.map(d => ({ type: d.type, count: d.count }));
        const areaPayload = isHotel
          ? ((form.hotelRoomTypes || []).map(r => r.areaSqFt).find(a => a && String(a).trim()) || "")
          : (form.area || "");
        const pricePayload = isHotel
          ? (() => {
              const roomPrices = (form.hotelRoomTypes || []).map(r => Number(r.pricePerNight)).filter(n => !isNaN(n) && n > 0);
              return roomPrices.length ? Math.min(...roomPrices) : (Number(form.baseRate) || 0);
            })()
          : (Number(form.baseRate) || 0);

        const putPayload = {
          property_name: form.title || "",
          description: form.mainDescription || "",
          price: pricePayload,
          city: form.city || "",
          address: form.address || "",
          postal_code: form.postalCode || "",
          country: form.country || "India",
          property_type: (form.propertyType || "entire place").toLowerCase(),
          property_category: form.propertyCategory || "Apartments & Villas",
          booking_type: String(form.bookingType),
          area: areaPayload,
          beds: form.beds,
          max_guests: form.maxGuests,
          owner_id: String(ownerId),
          check_in_time: form.checkInTime,
          check_out_time: form.checkOutTime,
          self_check_in: form.selfCheckIn === "Available" ? 1 : 0,
          smoking_allowed: !!form.smokingAllowed,
          pets_allowed: !!form.petsAllowed,
          events_allowed: !!form.eventsAllowed,
          drinking_alcohol: !!form.drinkingAllowed,
          outside_guests_allowed: !!form.outsideGuestsAllowed,
          weekend_rate: form.weekendRate,
          weekly_discount_pct: form.weeklyDiscountPct,
          monthly_discount_pct: form.monthlyDiscountPct,
          cleaning_fee: form.cleaningFee,
          registration_number: form.registrationNumber,
          local_compliance: form.localCompliance,
          cancellation_policy: policy,
          insurance: insurance ? "1" : "0",
          damage_protection: damageProtection ? "1" : "0",
          latitude: form.latitude !== "" ? Number(form.latitude) : null,
          longitude: form.longitude !== "" ? Number(form.longitude) : null,
          amenities: JSON.stringify(Object.keys(form.amenities || {}).filter((k) => form.amenities[k])),
          bedrooms: JSON.stringify(bedroomsPayload),
          bathrooms: JSON.stringify(bathroomsPayload),
          photos: JSON.stringify(updatedPhotos),
          cover_photo_index: coverIndex ?? 0,
          guidebook: JSON.stringify(guidebook),
          guest_policy: JSON.stringify({
            family_allowed: Boolean(form.familyAllowed),
            unmarried_couple_allowed: Boolean(form.unmarriedCoupleAllowed),
            bachelors_allowed: Boolean(form.bachelorAllowed),
          }),
        };

        const putRes = await fetch(`${API_BASE}/ovika/properties/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(putPayload),
        });
        const putData = await putRes.json().catch(() => ({}));
        if (!putRes.ok) {
          console.error("Update API error", putRes.status, putData);
          alert(`Failed to update property (${putRes.status}): ${putData.message || putData.error || "Unknown error"}`);
          setIsSubmitting(false);
          return;
        }
        alert("Property updated successfully!");
        if (onComplete) onComplete();
        else navigate("/admin-control-panel");
        setIsSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append("property_name", form.title || "");
      fd.append("description", form.mainDescription || "");
      fd.append("city", form.city || "");
      fd.append("address", form.address || "");
      if (isHotel) {
        const roomPrices = (form.hotelRoomTypes || [])
          .map(r => Number(r.pricePerNight))
          .filter(n => !isNaN(n) && n > 0);
        const lowestRoomPrice = roomPrices.length ? Math.min(...roomPrices) : null;
        if (lowestRoomPrice !== null) fd.append("price", lowestRoomPrice.toFixed(2));
      } else if (form.baseRate !== "" && form.baseRate !== null) {
        fd.append("price", Number(form.baseRate).toFixed(2));
      }
      fd.append("booking_type", String(form.bookingType));
      fd.append("owner_id", String(ownerId));
      fd.append("rental_type", "short");
      fd.append("property_type", (form.propertyType || "entire place").toLowerCase());
      fd.append("property_category", form.propertyCategory || "Apartments & Villas");

      const guidebook = {
        transport_tips: {
          taxi: form.transportTips.taxi,
          parking: form.transportTips.parking,
          local_travel: form.transportTips.localTravel
        },
        cafes_restaurants: form.cafesRestaurants
          .filter(c => c.name.trim())
          .map(c => ({ name: c.name, distance_m: Number(c.distanceM) || 0 })),
        essentials_nearby: {
          atm: form.essentialsNearby.atm,
          grocery: form.essentialsNearby.grocery,
          medical: form.essentialsNearby.medical
        },
        must_visit_places: form.mustVisitPlaces
          .filter(p => p.place.trim())
          .map(p => ({ place: p.place, best_time: p.bestTime })),
        house_specific_tips: form.houseSpecificTips.filter(t => t.trim())
      };

      const meta = {
        propertyType: form.propertyType,
        propertyCategory: form.propertyCategory,
        bedrooms: isHotel
          ? form.hotelRoomTypes.map(r => ({
              type: r.roomType,
              count: Number(r.numberOfRooms) || 0,
              bedType: r.bedType,
              areaSqFt: r.areaSqFt,
              price: Number(r.pricePerNight) || 0,
              attachedBathroom: true,
            }))
          : form.bedroomDetails.map(d => ({ type: d.type, count: d.count })),
        beds: form.beds,
        bathrooms: form.bathroomDetails.map(d => ({ type: d.type, count: d.count })),
        area: form.area,
        hotelRoomTypes: isHotel ? form.hotelRoomTypes.map(r => ({
          roomType: r.roomType,
          numberOfRooms: Number(r.numberOfRooms) || 0,
          bedType: r.bedType,
          maxOccupancy: Number(r.maxOccupancy) || 0,
          areaSqFt: r.areaSqFt,
          pricePerNight: Number(r.pricePerNight) || 0,
        })) : undefined,
        amenities: Object.keys(form.amenities || {}).filter((k) => form.amenities[k]),
        checkInTime: form.checkInTime,
        checkOutTime: form.checkOutTime,
        smokingAllowed: form.smokingAllowed,
        petsAllowed: form.petsAllowed,
        eventsAllowed: form.eventsAllowed,
        drinkingAllowed: form.drinkingAllowed,
        outsideGuestsAllowed: form.outsideGuestsAllowed,
        maxGuests: form.maxGuests,
        weekendRate: form.weekendRate,
        weeklyDiscountPct: form.weeklyDiscountPct,
        monthlyDiscountPct: form.monthlyDiscountPct,
        cleaningFee: form.cleaningFee,
        selfCheckIn: form.selfCheckIn,
        bookingType: form.bookingType,
        cancellationPolicy: policy,
        insurance,
        damageProtection,
        postalCode: form.postalCode,
        country: form.country,
        ...(form.latitude !== "" && form.latitude !== undefined && { latitude: Number(form.latitude) }),
        ...(form.longitude !== "" && form.longitude !== undefined && { longitude: Number(form.longitude) }),
        registrationNumber: form.registrationNumber,
        localCompliance: form.localCompliance,
        ownerId: ownerId,
        identityVerification: aadhaarVerified ? { type: "aadhaar", number: aadhaarNumber } : { type: "file" },
        phoneVerification: isPhoneVerified ? { number: phoneNumber } : null,
        guidebook: guidebook,
         guest_policy: {
   family_allowed: Boolean(form.familyAllowed),
    unmarried_couple_allowed: Boolean(form.unmarriedCoupleAllowed),
    bachelors_allowed: Boolean(form.bachelorAllowed),
  },
      };
      fd.append("meta", JSON.stringify(meta));
      // top-level fields so PropertyDetailPage can read them without meta fallback
      fd.append("amenities", JSON.stringify(meta.amenities));
      fd.append("bedrooms", JSON.stringify(meta.bedrooms));
      fd.append("bathrooms", JSON.stringify(meta.bathrooms));
      if (isHotel) {
        const firstRoomArea = (form.hotelRoomTypes || []).map(r => r.areaSqFt).find(a => a && String(a).trim());
        fd.append("area", firstRoomArea || "");
      } else {
        fd.append("area", form.area || "");
      }
      fd.append(
  "guest_policy",
  JSON.stringify({
    family_allowed: form.familyAllowed,
    unmarried_couple_allowed: form.unmarriedCoupleAllowed,
     bachelors_allowed:form.bachelorAllowed,
  })
);


      const photoEntries = photoPreviews.previews.filter(p => p?.file);
      const compressedPhotos = await Promise.all(photoEntries.map(p => compressImage(p.file)));
      compressedPhotos.forEach((f, i) => fd.append("photos", f, photoEntries[i].name || `photo-${i}`));

      idFiles.forEach((f, i) => {
        fd.append("idFiles", f, f.name || `id-${i}`);
      });

      if (selfieFile) fd.append("selfie", selfieFile, selfieFile.name);
      if (coverIndex !== null && coverIndex !== undefined) fd.append("cover_photo_index", String(coverIndex));

      const response = await fetch(`${API_BASE}/ovika/properties/upload`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await response.json().catch(() => ({ success: false, message: "Invalid JSON response" }));
      if (!response.ok) {
        console.error("API error", data);
        alert(data.message || "Failed to create property");
        setIsSubmitting(false);
        return;
      }

      alert("Property created successfully! ID: " + (data.data?.id ?? "unknown"));

      setForm((prev) => ({ 
        ...prev, 
        title: "", 
        mainDescription: "", 
        address: "", 
        city: "", 
        postalCode: "", 
        baseRate: "",
        transportTips: { taxi: "", parking: "", localTravel: "" },
        cafesRestaurants: [{ id: 0, name: "", distanceM: "" }],
        essentialsNearby: { atm: "", grocery: "", medical: "" },
        mustVisitPlaces: [{ id: 0, place: "", bestTime: "" }],
        houseSpecificTips: [""]
      }));
      photoPreviews.clear();
      setIdFiles([]);
      setSelfieFile(null);
      setCoverIndex(null);
      setStep(0);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit form. Please check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Toggle = ({ name, value, onChange }) => (
    <div className="tmx9pf-toggle" role="group" aria-label={name}>
      <button type="button" className={`option ${value === false ? "active" : ""}`} onClick={() => onChange(false)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /></svg>
        <small>No</small>
      </button>
      <button type="button" className={`option ${value === true ? "active" : ""}`} onClick={() => onChange(true)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <small>Yes</small>
      </button>
    </div>
  );

  if (isEditMode && isLoadingEdit) {
    return (
      <div className="tmx9pf-root">
        <div style={{ padding: "80px 20px", textAlign: "center", fontSize: "1rem", color: "#6b7280" }}>Loading property…</div>
      </div>
    );
  }

  if (needsCategoryPicker) {
    return (
      <div className="tmx9pf-root">
        <Helmet>
          <title>List Your Property | OvikaLiving</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 20px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}>What type of place are you listing?</h2>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 24 }}>Pick a category to continue — this decides which listing form fields you'll see.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DEFAULT_PROPERTY_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => { setForm(f => ({ ...f, propertyCategory: cat })); setNeedsCategoryPicker(false); }}
                style={{
                  textAlign: "left", padding: "16px 18px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", background: "#fff",
                  fontSize: "1rem", fontWeight: 600, color: "#1a1209",
                  cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c98b3e"; e.currentTarget.style.background = "#fff8f0"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tmx9pf-root">
      <Helmet>
        <title>{isEditMode ? "Update Property | OvikaLiving" : "List Your Property | OvikaLiving"}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    <form
      className="tmx9pf-paginated"
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        // Native form submission is fully disabled below — this just stops Enter
        // from doing anything unexpected (like clicking a focused button) too.
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }}
      noValidate
    >
      <style>{`
        .tmx9pf-dynamic-row {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
          align-items: center;
        }
        .tmx9pf-small-btn.danger {
          background: #ffe5e5;
          color: #d32f2f;
          border: 1px solid #ffbcbc;
        }
        .tmx9pf-small-btn.danger:hover {
          background: #ffbcbc;
        }
        .tmx9pf-guidebook-section {
          margin-top: 32px;
          padding-top: 32px;
          border-top: 2px solid #f1f5f9;
        }
        .tmx9pf-guidebook-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }
      `}</style>
      
      <header className="tmx9pf-header">
        <h1 className="tmx9pf-title">Create <span className="span-data-setup">Property</span> Listing</h1>
        <p className="tmx9pf-sub">Fill the sections below carefully. Use Next / Previous to navigate steps.</p>

        <div className="tmx9pf-stepper">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`tmx9pf-step ${i === step ? "active" : i < step ? "done" : ""}`}>
              <div className="tmx9pf-step-bullet">{i + 1}</div>
              <div className="tmx9pf-step-title">{s.title}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="tmx9pf-card" style={{minHeight: 620, width: '100%', boxSizing: 'border-box', flexShrink: 0}}>

        {/* ── STEP 0: Your Space ── */}
        {step === 0 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">{isHomestay ? "Which best describes your place?" : "Property Type"}</h2>
            {isHomestay ? (
              <>
                <div className="bnb-place-types" style={{marginBottom:24}}>
                  {BNB_PLACE_TYPES.map(pt => (
                    <div key={pt.id}
                      className={`bnb-place-card ${form.bnbPlaceType === pt.id ? 'selected' : ''}`}
                      onClick={() => setForm(f => ({ ...f, bnbPlaceType: pt.id }))}>
                      <span className="bnb-place-icon">{pt.icon}</span>
                      <div>
                        <div className="bnb-place-title">{pt.label}</div>
                        <div className="bnb-place-desc">{pt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:20}}>
                  <div className="tmx9pf-label" style={{marginBottom:8}}>Property Type</div>
                  <div className="bnb-chips-row">
                    {BNB_PROP_TYPES.map(t => (
                      <div key={t} className={`bnb-chip ${form.bnbPropType === t ? 'selected' : ''}`}
                        onClick={() => setForm(f => ({ ...f, bnbPropType: t }))}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="tmx9pf-label" style={{marginBottom:8}}>What makes your place special? <span style={{fontWeight:400,fontSize:12,color:'#9ca3af'}}>(pick up to 2)</span></div>
                  <div className="bnb-chips-row">
                    {BNB_HIGHLIGHTS.map(h => {
                      const sel = form.bnbHighlights.includes(h);
                      return (
                        <div key={h} className={`bnb-chip ${sel ? 'selected' : ''}`}
                          onClick={() => setForm(f => {
                            const arr = f.bnbHighlights;
                            return { ...f, bnbHighlights: sel ? arr.filter(x=>x!==h) : arr.length < 2 ? [...arr,h] : arr };
                          })}>
                          {h}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:16}}>
                {[
                  { id: 'Entire place', icon: '🏨', label: 'Entire place', desc: 'Guests have the whole property to themselves — ideal for hotels, villas, and resorts.' },
                  { id: 'Private room', icon: '🚪', label: 'Private room', desc: 'Guests have their own room with access to shared common areas and facilities.' },
                ].map(pt => (
                  <div
                    key={pt.id}
                    onClick={() => setForm(f => ({ ...f, propertyType: pt.id }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      padding: '22px 24px',
                      border: `2px solid ${form.propertyType === pt.id ? '#c98429' : '#e5e7eb'}`,
                      borderRadius: 16,
                      cursor: 'pointer',
                      background: form.propertyType === pt.id ? '#fffbf5' : '#fff',
                      boxShadow: form.propertyType === pt.id ? '0 0 0 3px rgba(201,132,41,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div style={{
                      width: 60, height: 60, borderRadius: 14, flexShrink: 0,
                      background: form.propertyType === pt.id ? '#fef4e6' : '#f3f4f6',
                      border: `1.5px solid ${form.propertyType === pt.id ? '#f0d8b0' : '#e5e7eb'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, transition: 'all 0.18s ease',
                    }}>
                      {pt.icon}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 600, fontSize: 16, color: '#1e293b', marginBottom: 4}}>{pt.label}</div>
                      <div style={{fontSize: 13, color: '#6b7280', lineHeight: 1.5}}>{pt.desc}</div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${form.propertyType === pt.id ? '#c98429' : '#d1d5db'}`,
                      background: form.propertyType === pt.id ? '#c98429' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.18s ease',
                    }}>
                      {form.propertyType === pt.id && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── STEP 1: Name & Description ── */}
        {step === 1 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">{isHomestay ? "Give your place a title" : "Listing Title & Description"}</h2>
            {isHomestay && <p style={{color:'#6b7280',fontSize:14,marginBottom:20,marginTop:-8}}>A catchy title helps guests find you faster.</p>}
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">{isHomestay ? "Title *" : "Listing Title *"}</label>
                <input name="title" value={form.title} onChange={handleChange}
                  className={`tmx9pf-input ${errors.title ? "tmx9pf-input--error" : ""}`}
                  placeholder={isHomestay ? "e.g. Cozy hillside cottage with mountain view" : "Cozy 2-Bedroom Apartment Near City Center"}
                  maxLength={50} />
                {isHomestay && <div style={{fontSize:11,color:'#9ca3af',marginTop:3}}>{form.title.length}/50</div>}
                {renderError("title")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">{isHomestay ? "Describe your place *" : "Property Description *"}</label>
                <textarea name="mainDescription" value={form.mainDescription} onChange={handleChange}
                  rows={isHomestay ? 6 : 5}
                  className={`tmx9pf-textarea ${errors.mainDescription ? "tmx9pf-input--error" : ""}`}
                  placeholder={isHomestay ? "Share what makes your place special — views, vibes, what guests love most..." : "Describe your property in detail..."}
                  maxLength={500} />
                {isHomestay && <div style={{fontSize:11,color:'#9ca3af',marginTop:3}}>{form.mainDescription.length}/500</div>}
                {renderError("mainDescription")}
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 2: Location ── */}
        {step === 2 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">Where is your place located?</h2>
            <div className="tmx9pf-grid">
              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Street Address *</label>
                <input placeholder="Street / Building name" name="address" value={form.address} onChange={handleChange} className={`tmx9pf-input ${errors.address ? "tmx9pf-input--error" : ""}`} />
                {renderError("address")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">City *</label>
                <CityDropdown value={form.city} onChange={handleChange} className="tmx9pf-input" hasError={!!errors.city} placeholder="Select City" />
                {renderError("city")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">ZIP / Postal Code *</label>
                <input name="postalCode" value={form.postalCode} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setForm((s) => ({ ...s, postalCode: v })); }} maxLength={10} className={`tmx9pf-input ${errors.postalCode ? "tmx9pf-input--error" : ""}`} />
                {renderError("postalCode")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Country *</label>
                <input name="country" value={form.country} onChange={handleChange} className={`tmx9pf-input ${errors.country ? "tmx9pf-input--error" : ""}`} />
                {renderError("country")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Latitude <span style={{color:'#9ca3af',fontWeight:400}}>(optional)</span></label>
                <input type="number" step="0.000001" name="latitude" value={form.latitude} onChange={handleNumChange} className={`tmx9pf-input ${errors.latitude ? "tmx9pf-input--error" : ""}`} placeholder="e.g., 19.0760" />
                {renderError("latitude")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Longitude <span style={{color:'#9ca3af',fontWeight:400}}>(optional)</span></label>
                <input type="number" step="0.000001" name="longitude" value={form.longitude} onChange={handleNumChange} className={`tmx9pf-input ${errors.longitude ? "tmx9pf-input--error" : ""}`} placeholder="e.g., 72.8777" />
                {renderError("longitude")}
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 3: Rooms / Basics ── */}
        {step === 3 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">{isHomestay ? "Share some basics" : isHotel ? "Room Arrangement" : "Room Details"}</h2>
            {isHomestay && <p style={{color:'#6b7280',fontSize:14,marginBottom:20,marginTop:-8}}>You can always update these later.</p>}
            {isHotel && <p style={{color:'#6b7280',fontSize:14,marginBottom:20,marginTop:-8}}>Add every room category your hotel offers, with how many rooms of each type and their nightly price.</p>}
            <div className="tmx9pf-grid">
              {isHotel ? (
                <div className="tmx9pf-field full">
                  <label className="tmx9pf-label">Room Categories *</label>
                  <div className="tmx9pf-dynamic-list">
                    {form.hotelRoomTypes.map((item, index) => (
                      <div key={item.id} className="tmx9pf-dynamic-row" style={{ flexWrap: 'wrap' }}>
                        <select
                          value={item.roomType}
                          onChange={(e) => { const list = [...form.hotelRoomTypes]; list[index].roomType = e.target.value; setForm(f => ({ ...f, hotelRoomTypes: list })); }}
                          className="tmx9pf-select" style={{ flex: 2, minWidth: 150 }}
                        >
                          <option value="">Select Room Category</option>
                          {["Standard Room", "Deluxe Room", "Suite", "Executive Room", "Family Room", "Presidential Suite"].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <input
                          type="number" min="1" placeholder="No. of Rooms"
                          value={item.numberOfRooms}
                          onChange={(e) => { const list = [...form.hotelRoomTypes]; list[index].numberOfRooms = Number(e.target.value); setForm(f => ({ ...f, hotelRoomTypes: list })); }}
                          className="tmx9pf-input" style={{ flex: 1, minWidth: 110 }}
                        />
                        <select
                          value={item.bedType}
                          onChange={(e) => { const list = [...form.hotelRoomTypes]; list[index].bedType = e.target.value; setForm(f => ({ ...f, hotelRoomTypes: list })); }}
                          className="tmx9pf-select" style={{ flex: 1, minWidth: 130 }}
                        >
                          {["King Bed", "Queen Bed", "Twin Beds", "Double Bed", "Single Bed"].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <input
                          type="number" min="1" placeholder="Max Occupancy"
                          value={item.maxOccupancy}
                          onChange={(e) => { const list = [...form.hotelRoomTypes]; list[index].maxOccupancy = Number(e.target.value); setForm(f => ({ ...f, hotelRoomTypes: list })); }}
                          className="tmx9pf-input" style={{ flex: 1, minWidth: 110 }}
                        />
                        <input
                          placeholder="Area (sq ft)"
                          value={item.areaSqFt}
                          onChange={(e) => { const list = [...form.hotelRoomTypes]; list[index].areaSqFt = e.target.value; setForm(f => ({ ...f, hotelRoomTypes: list })); }}
                          className="tmx9pf-input" style={{ flex: 1, minWidth: 110 }}
                        />
                        <input
                          type="number" min="0" placeholder="Price / Night (₹)"
                          value={item.pricePerNight}
                          onChange={(e) => { const list = [...form.hotelRoomTypes]; list[index].pricePerNight = e.target.value; setForm(f => ({ ...f, hotelRoomTypes: list })); }}
                          className="tmx9pf-input" style={{ flex: 1, minWidth: 130 }}
                        />
                        {form.hotelRoomTypes.length > 1 && (
                          <button type="button" onClick={() => { const list = form.hotelRoomTypes.filter((_, i) => i !== index); setForm(f => ({ ...f, hotelRoomTypes: list })); }} className="tmx9pf-small-btn danger">×</button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, hotelRoomTypes: [...f.hotelRoomTypes, { id: Date.now(), roomType: "Standard Room", numberOfRooms: 1, bedType: "King Bed", maxOccupancy: 2, areaSqFt: "", pricePerNight: "" }] }))}
                      className="tmx9pf-small-btn" style={{ marginTop: "8px" }}
                    >+ Add Room Category</button>
                  </div>
                  {renderError("hotelRoomTypes")}
                </div>
              ) : isHomestay ? (
                <div className="tmx9pf-field full">
                  <div className="bnb-stepper-list">
                    {[
                      { label: 'Guests',    key: 'maxGuests',  min: 1, max: 30 },
                      { label: 'Bedrooms',  key: 'beds',       min: 0, max: 20 },
                      { label: 'Beds',      key: 'beds',       min: 1, max: 30 },
                      { label: 'Bathrooms', key: 'bathCount',  min: 1, max: 20 },
                    ].map(({ label, key, min, max }) => (
                      <div key={label} className="bnb-stepper-row">
                        <span className="bnb-stepper-label">{label}</span>
                        <div className="bnb-stepper-controls">
                          <button type="button" className="bnb-stepper-btn"
                            disabled={Number(form[key]||1) <= min}
                            onClick={() => setForm(f => ({ ...f, [key]: Math.max(min, Number(f[key]||1) - 1) }))}>−</button>
                          <span className="bnb-stepper-val">{form[key] || 1}</span>
                          <button type="button" className="bnb-stepper-btn"
                            disabled={Number(form[key]||1) >= max}
                            onClick={() => setForm(f => ({ ...f, [key]: Math.min(max, Number(f[key]||1) + 1) }))}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {renderError("bedrooms")}
                  {renderError("beds")}
                  {renderError("bathrooms")}
                </div>
              ) : (
                <>
                  <div className="tmx9pf-field full">
                    <label className="tmx9pf-label">Bedroom Configuration *</label>
                    <div className="tmx9pf-dynamic-list">
                      {form.bedroomDetails.map((item, index) => (
                        <div key={item.id} className="tmx9pf-dynamic-row">
                          <select value={item.type} onChange={(e) => { const newDetails = [...form.bedroomDetails]; newDetails[index].type = e.target.value; setForm(f => ({ ...f, bedroomDetails: newDetails })); }} className="tmx9pf-select" style={{ flex: 2 }}>
                            <option value="">Select Room Type</option>
                            {["King Bed", "Queen Bed", "Double Bed", "Single Bed", "Bunk Bed", "Sofa Bed"].map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <input type="number" min="1" placeholder="Count" value={item.count} onChange={(e) => { const newDetails = [...form.bedroomDetails]; newDetails[index].count = Number(e.target.value); setForm(f => ({ ...f, bedroomDetails: newDetails })); }} className="tmx9pf-input" style={{ flex: 1 }} />
                          {form.bedroomDetails.length > 1 && (
                            <button type="button" onClick={() => { const newDetails = form.bedroomDetails.filter((_, i) => i !== index); setForm(f => ({ ...f, bedroomDetails: newDetails })); }} className="tmx9pf-small-btn danger">×</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setForm(f => ({ ...f, bedroomDetails: [...f.bedroomDetails, { id: Date.now(), type: "King Bed", count: 1 }] }))} className="tmx9pf-small-btn" style={{ marginTop: "8px" }}>+ Add Bedroom Type</button>
                    </div>
                    {renderError("bedrooms")}
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Total Beds *</label>
                    <input name="beds" type="number" min="1" value={form.beds} onChange={handleNumChange} className={`tmx9pf-input ${errors.beds ? "tmx9pf-input--error" : ""}`} />
                    {renderError("beds")}
                  </div>
                  <div className="tmx9pf-field full">
                    <label className="tmx9pf-label">Bathroom Configuration *</label>
                    <div className="tmx9pf-dynamic-list">
                      {form.bathroomDetails.map((item, index) => (
                        <div key={item.id} className="tmx9pf-dynamic-row">
                          <select value={item.type} onChange={(e) => { const newDetails = [...form.bathroomDetails]; newDetails[index].type = e.target.value; setForm(f => ({ ...f, bathroomDetails: newDetails })); }} className="tmx9pf-select" style={{ flex: 2 }}>
                            <option value="">Select Bathroom Type</option>
                            {["Attached", "Common", "En-suite", "Jack & Jill", "Separate", "Other"].map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <input type="number" min="1" placeholder="Count" value={item.count} onChange={(e) => { const newDetails = [...form.bathroomDetails]; newDetails[index].count = Number(e.target.value); setForm(f => ({ ...f, bathroomDetails: newDetails })); }} className="tmx9pf-input" style={{ flex: 1 }} />
                          {form.bathroomDetails.length > 1 && (
                            <button type="button" onClick={() => { const newDetails = form.bathroomDetails.filter((_, i) => i !== index); setForm(f => ({ ...f, bathroomDetails: newDetails })); }} className="tmx9pf-small-btn danger">×</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setForm(f => ({ ...f, bathroomDetails: [...f.bathroomDetails, { id: Date.now(), type: "Attached", count: 1 }] }))} className="tmx9pf-small-btn" style={{ marginTop: "8px" }}>+ Add Bathroom Type</button>
                    </div>
                    {renderError("bathrooms")}
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Area (sq ft) *</label>
                    <input name="area" value={form.area} onChange={handleChange} maxLength={20} className={`tmx9pf-input ${errors.area ? "tmx9pf-input--error" : ""}`} placeholder="e.g., 1500 sqft" />
                    {renderError("area")}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* ── STEP 4: Amenities ── */}
        {step === 4 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">What does your place offer?</h2>
            <p style={{color:'#6b7280',fontSize:14,marginBottom:20,marginTop:-8}}>Select all amenities available for guests.</p>
            <div className="tmx9pf-amenities">
              {Object.entries(AMENITIES).map(([group, list]) => (
                <div key={group} className="tmx9pf-amenity-group">
                  <div className="tmx9pf-amenity-group-title">{group}</div>
                  <div className="tmx9pf-amenity-list">
                    {list.map((a) => (
                      <label key={a} className="tmx9pf-amenity">
                        <input type="checkbox" checked={!!form.amenities[a]} onChange={() => handleAmenityToggle(a)} />
                        <span>{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STEP 5: House Rules ── */}
        {step === 5 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">House Rules</h2>

            {/* Check-in / Check-out / Guests / Quiet Hours — 2-col grid */}
            <div className="tmx9pf-grid" style={{marginBottom: 24}}>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Check-in Time *</label>
                <TimePickerAMPM value={form.checkInTime} onChange={(val) => setForm(f => ({ ...f, checkInTime: val }))} className={`tmx9pf-input ${errors.checkInTime ? "tmx9pf-input--error" : ""}`} />
                {renderError("checkInTime")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Check-out Time *</label>
                <TimePickerAMPM value={form.checkOutTime} onChange={(val) => setForm(f => ({ ...f, checkOutTime: val }))} className={`tmx9pf-input ${errors.checkOutTime ? "tmx9pf-input--error" : ""}`} />
                {renderError("checkOutTime")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Maximum Guests *</label>
                <input name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={handleNumChange} className={`tmx9pf-input ${errors.maxGuests ? "tmx9pf-input--error" : ""}`} />
                {renderError("maxGuests")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Quiet Hours</label>
                <input name="quietHours" value={form.quietHours} onChange={handleChange} className="tmx9pf-input" />
              </div>
            </div>

            {/* Rules — 3-col card grid */}
            <div style={{fontSize:'0.78rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#64748b',marginBottom:12}}>Guest Policies</div>
            <div className="tmx9pf-rules-grid">
              {[
                { icon: '🚬', label: 'Smoking Allowed',         key: 'smokingAllowed',         cb: (v) => setForm(s => ({...s, smokingAllowed: v})) },
                { icon: '🐾', label: 'Pets Allowed',            key: 'petsAllowed',            cb: (v) => setForm(s => ({...s, petsAllowed: v})) },
                { icon: '🎉', label: 'Events / Parties',        key: 'eventsAllowed',          cb: (v) => setForm(s => ({...s, eventsAllowed: v})) },
                { icon: '🍺', label: 'Drinking Allowed',        key: 'drinkingAllowed',        cb: (v) => setForm(s => ({...s, drinkingAllowed: v})) },
                { icon: '👥', label: 'Outside Guests',          key: 'outsideGuestsAllowed',   cb: (v) => setForm(s => ({...s, outsideGuestsAllowed: v})) },
                { icon: '👨‍👩‍👧', label: 'Family Only',           key: 'familyAllowed',          cb: (v) => setForm(s => ({...s, familyAllowed: v})) },
                { icon: '💑', label: 'Unmarried Couple',        key: 'unmarriedCoupleAllowed', cb: (v) => setForm(s => ({...s, unmarriedCoupleAllowed: v})) },
                { icon: '🎓', label: 'Bachelors Allowed',       key: 'bachelorAllowed',        cb: (v) => setForm(s => ({...s, bachelorAllowed: v})) },
              ].map(({ icon, label, key, cb }) => (
                <div key={key} className="tmx9pf-rule-card">
                  <div className="tmx9pf-rule-label">
                    <span className="tmx9pf-rule-icon">{icon}</span>
                    {label}
                  </div>
                  <Toggle name={key} value={form[key]} onChange={cb} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STEP 6: Nearby & Tips (Guidebook) ── */}
        {step === 6 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">Nearby & Guest Tips</h2>
            <p style={{color:'#6b7280',fontSize:14,marginBottom:24,marginTop:-10}}>Optional — help guests explore the neighbourhood.</p>

            {/* Row 1: Transport + Essentials side by side */}
            <div className="tmx9pf-guidebook-row">
              <div>
                <div className="tmx9pf-guidebook-title">🚗 Transport & Travel</div>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Taxi / Cab Services</label>
                    <input value={form.transportTips.taxi} onChange={(e) => setForm(f => ({ ...f, transportTips: { ...f.transportTips, taxi: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Uber/Ola available" />
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Parking Info</label>
                    <input value={form.transportTips.parking} onChange={(e) => setForm(f => ({ ...f, transportTips: { ...f.transportTips, parking: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Free street parking" />
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Local Travel Tips</label>
                    <input value={form.transportTips.localTravel} onChange={(e) => setForm(f => ({ ...f, transportTips: { ...f.transportTips, localTravel: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Auto easily available" />
                  </div>
                </div>
              </div>
              <div>
                <div className="tmx9pf-guidebook-title">🏪 Essentials Nearby</div>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">ATM</label>
                    <input value={form.essentialsNearby.atm} onChange={(e) => setForm(f => ({ ...f, essentialsNearby: { ...f.essentialsNearby, atm: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., HDFC ATM (100m)" />
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Grocery Store</label>
                    <input value={form.essentialsNearby.grocery} onChange={(e) => setForm(f => ({ ...f, essentialsNearby: { ...f.essentialsNearby, grocery: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Reliance Fresh (200m)" />
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Medical / Pharmacy</label>
                    <input value={form.essentialsNearby.medical} onChange={(e) => setForm(f => ({ ...f, essentialsNearby: { ...f.essentialsNearby, medical: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Apollo Pharmacy (300m)" />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Cafes */}
            <div className="tmx9pf-guidebook-section">
              <div className="tmx9pf-guidebook-title">🍽️ Nearby Cafes & Restaurants</div>
              <div className="tmx9pf-dynamic-list">
                {form.cafesRestaurants.map((cafe, index) => (
                  <div key={cafe.id} className="tmx9pf-dynamic-row">
                    <input placeholder="Restaurant Name" value={cafe.name} onChange={(e) => { const newCafes = [...form.cafesRestaurants]; newCafes[index].name = e.target.value; setForm(f => ({ ...f, cafesRestaurants: newCafes })); }} className="tmx9pf-input" style={{ flex: 2 }} />
                    <input type="number" placeholder="Distance (m)" value={cafe.distanceM} onChange={(e) => { const newCafes = [...form.cafesRestaurants]; newCafes[index].distanceM = e.target.value; setForm(f => ({ ...f, cafesRestaurants: newCafes })); }} className="tmx9pf-input" style={{ flex: 1 }} />
                    {form.cafesRestaurants.length > 1 && (
                      <button type="button" onClick={() => { const newCafes = form.cafesRestaurants.filter((_, i) => i !== index); setForm(f => ({ ...f, cafesRestaurants: newCafes })); }} className="tmx9pf-small-btn danger">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setForm(f => ({ ...f, cafesRestaurants: [...f.cafesRestaurants, { id: Date.now(), name: "", distanceM: "" }] }))} className="tmx9pf-small-btn" style={{ marginTop: "6px" }}>+ Add Restaurant</button>
              </div>
            </div>

            {/* Row 3: Must Visit + House Tips side by side */}
            <div className="tmx9pf-guidebook-row" style={{marginTop:24, paddingTop:22, borderTop:'2px solid #f1f5f9'}}>
              <div>
                <div className="tmx9pf-guidebook-title">📍 Must Visit Places</div>
                <div className="tmx9pf-dynamic-list">
                  {form.mustVisitPlaces.map((place, index) => (
                    <div key={place.id} className="tmx9pf-dynamic-row">
                      <input placeholder="Place Name" value={place.place} onChange={(e) => { const newPlaces = [...form.mustVisitPlaces]; newPlaces[index].place = e.target.value; setForm(f => ({ ...f, mustVisitPlaces: newPlaces })); }} className="tmx9pf-input" style={{ flex: 2 }} />
                      <input placeholder="Best Time" value={place.bestTime} onChange={(e) => { const newPlaces = [...form.mustVisitPlaces]; newPlaces[index].bestTime = e.target.value; setForm(f => ({ ...f, mustVisitPlaces: newPlaces })); }} className="tmx9pf-input" style={{ flex: 1 }} />
                      {form.mustVisitPlaces.length > 1 && (
                        <button type="button" onClick={() => { const newPlaces = form.mustVisitPlaces.filter((_, i) => i !== index); setForm(f => ({ ...f, mustVisitPlaces: newPlaces })); }} className="tmx9pf-small-btn danger">×</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm(f => ({ ...f, mustVisitPlaces: [...f.mustVisitPlaces, { id: Date.now(), place: "", bestTime: "" }] }))} className="tmx9pf-small-btn" style={{ marginTop: "6px" }}>+ Add Place</button>
                </div>
              </div>
              <div>
                <div className="tmx9pf-guidebook-title">💡 House-Specific Tips</div>
                <div className="tmx9pf-dynamic-list">
                  {form.houseSpecificTips.map((tip, index) => (
                    <div key={index} className="tmx9pf-dynamic-row">
                      <input placeholder="Add a helpful tip for guests" value={tip} onChange={(e) => { const newTips = [...form.houseSpecificTips]; newTips[index] = e.target.value; setForm(f => ({ ...f, houseSpecificTips: newTips })); }} className="tmx9pf-input" style={{ flex: 1 }} />
                      {form.houseSpecificTips.length > 1 && (
                        <button type="button" onClick={() => { const newTips = form.houseSpecificTips.filter((_, i) => i !== index); setForm(f => ({ ...f, houseSpecificTips: newTips })); }} className="tmx9pf-small-btn danger">×</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm(f => ({ ...f, houseSpecificTips: [...f.houseSpecificTips, ""] }))} className="tmx9pf-small-btn" style={{ marginTop: "6px" }}>+ Add Tip</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 7: Photos ── */}
        {step === 7 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">Photos &amp; Media</h2>
            <div className="tmx9pf-grid">
              <div className="tmx9pf-field full">
                {isEditMode && existingPhotos.length > 0 && (
                  <>
                    <label className="tmx9pf-label">Current Photos</label>
                    <div className="tmx9pf-photo-previews">
                      {existingPhotos.map((url, i) => (
                        <div key={`existing-${i}`} className="tmx9pf-photo-thumb">
                          <img src={url} alt={`Existing ${i + 1}`} />
                          <div className="tmx9pf-photo-actions">
                            <button
                              type="button"
                              onClick={() => setCoverIndex(i)}
                              className={`tmx9pf-small-btn ${coverIndex === i ? "tmx9pf-small-btn--active" : ""}`}
                            >Cover</button>
                            <button type="button" onClick={() => setExistingPhotos(prev => prev.filter((_, idx) => idx !== i))} className="tmx9pf-small-btn">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <label className="tmx9pf-label">{isEditMode ? "Add More Photos" : "Photos — up to 12 *"}</label>
                <input type="file" accept="image/*,application/pdf" multiple onChange={handlePhotos} className={`tmx9pf-file ${errors.photos ? "tmx9pf-file--error" : ""}`} />
                {renderError("photos")}
                <div className="tmx9pf-photo-previews">
                  {photoPreviews.previews.length === 0 && <div className="tmx9pf-muted">No new photos selected</div>}
                  {photoPreviews.previews.map((p, i) => {
                    const combinedIndex = existingPhotos.length + i;
                    return (
                      <div key={i} className="tmx9pf-photo-thumb">
                        <img src={p.url} alt={p.name} />
                        <div className="tmx9pf-photo-actions">
                          <button type="button" onClick={() => setCoverIndex(combinedIndex)} className={`tmx9pf-small-btn ${coverIndex === combinedIndex ? "tmx9pf-small-btn--active" : ""}`}>Cover</button>
                          <button type="button" onClick={() => removePhoto(i)} className="tmx9pf-small-btn">Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 8: Pricing & Legal ── */}
        {step === 8 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">{isHomestay ? "Now, set your price" : "Pricing & Availability"}</h2>
            {isHomestay && <p style={{color:'#6b7280',fontSize:14,marginBottom:20,marginTop:-8}}>You can always change it later.</p>}
            <div className="tmx9pf-grid">
              {isHomestay ? (
                <>
                  <div className="tmx9pf-field full">
                    <label className="tmx9pf-label">Nightly Rate (₹) *</label>
                    <div className="bnb-price-input-wrap">
                      <span className="bnb-price-symbol">₹</span>
                      <input name="baseRate" type="number" min="0" value={form.baseRate} onChange={handleNumChange}
                        className={`bnb-price-input ${errors.baseRate ? "tmx9pf-input--error" : ""}`} placeholder="0" />
                    </div>
                    {renderError("baseRate")}
                  </div>
                  <div className="tmx9pf-field full">
                    <label className="tmx9pf-label" style={{marginBottom:6}}>Add discounts</label>
                    <p style={{fontSize:13,color:'#6b7280',marginBottom:12,marginTop:0}}>Help your place stand out and get booked faster.</p>
                    <div className="bnb-discount-list">
                      {[
                        { key: 'newListingDiscount', pct: '20%', title: 'New listing promotion', desc: 'Offer 20% off your first 3 bookings' },
                        { key: 'lastMinuteDiscount', pct: '5%',  title: 'Last-minute discount',  desc: 'For stays booked 14 days or less before arrival' },
                      ].map(d => (
                        <label key={d.key} className={`bnb-discount-card ${form[d.key] ? 'active' : ''}`}>
                          <div className="bnb-discount-pct">{d.pct}</div>
                          <div className="bnb-discount-info">
                            <div className="bnb-discount-title">{d.title}</div>
                            <div className="bnb-discount-desc">{d.desc}</div>
                          </div>
                          <input type="checkbox" checked={!!form[d.key]}
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
                        <input type="number" name="weeklyDiscountPct" value={form.weeklyDiscountPct} onChange={handleChange}
                          placeholder="0%" style={{width:60,border:'1px solid #e5e7eb',borderRadius:8,padding:'6px 8px',fontSize:14,textAlign:'center'}} />
                      </div>
                      <div className="bnb-discount-card" style={{cursor:'default'}}>
                        <div className="bnb-discount-pct">%</div>
                        <div className="bnb-discount-info">
                          <div className="bnb-discount-title">Monthly discount</div>
                          <div className="bnb-discount-desc">For stays of 28 nights or more</div>
                        </div>
                        <input type="number" name="monthlyDiscountPct" value={form.monthlyDiscountPct} onChange={handleChange}
                          placeholder="0%" style={{width:60,border:'1px solid #e5e7eb',borderRadius:8,padding:'6px 8px',fontSize:14,textAlign:'center'}} />
                      </div>
                    </div>
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Cleaning fee (₹)</label>
                    <input name="cleaningFee" value={form.cleaningFee} onChange={handleChange} className="tmx9pf-input" placeholder="e.g. 500" />
                  </div>
                </>
              ) : (
                <>
                  {!isHotel && (
                    <div className="tmx9pf-field">
                      <label className="tmx9pf-label">Base nightly rate (₹) *</label>
                      <input name="baseRate" type="number" min="0" value={form.baseRate} onChange={handleNumChange} className={`tmx9pf-input ${errors.baseRate ? "tmx9pf-input--error" : ""}`} />
                      {renderError("baseRate")}
                    </div>
                  )}
                  {isHotel && (
                    <div className="tmx9pf-field full" style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, padding:'12px 14px', color:'#475569', fontSize:13}}>
                      Your nightly rate is set per room type in the <strong>Room Arrangement</strong> step. The lowest room price will be shown as the starting price on your listing.
                    </div>
                  )}
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Weekend rate</label>
                    <input type="number" name="weekendRate" value={form.weekendRate} onChange={handleChange} className="tmx9pf-input" />
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Weekly Discount %</label>
                    <input step="0.01" name="weeklyDiscountPct" type="number" min="0" max="100" value={form.weeklyDiscountPct} onChange={handleNumChange} className={`tmx9pf-input ${errors.weeklyDiscountPct ? "tmx9pf-input--error" : ""}`} />
                    {renderError("weeklyDiscountPct")}
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Monthly discount (%)</label>
                    <input step="0.01" name="monthlyDiscountPct" type="number" min="0" max="100" value={form.monthlyDiscountPct} onChange={handleNumChange} className="tmx9pf-input" />
                  </div>
                  <div className="tmx9pf-field">
                    <label className="tmx9pf-label">Cleaning fee</label>
                    <input name="cleaningFee" value={form.cleaningFee} onChange={handleChange} className="tmx9pf-input" />
                  </div>
                </>
              )}

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Self-check-in *</label>
                <select name="selfCheckIn" value={form.selfCheckIn} onChange={handleChange} className={`tmx9pf-select ${errors.selfCheckIn ? "tmx9pf-input--error" : ""}`}>
                  <option value="">Select option</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
                {renderError("selfCheckIn")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Booking Type *</label>
                <div style={{ marginBottom: "8px", fontSize: "0.85rem", color: "#64748b" }}>
                  {form.bookingType === 1 ? "Approval Required: You must approve each booking request." : "Instant Booking: Guests can book instantly without your approval."}
                </div>
                <select value={form.bookingType} onChange={(e) => setForm((s) => ({ ...s, bookingType: e.target.value === "1" ? 1 : 0 }))} className={`tmx9pf-select ${errors.bookingType ? "tmx9pf-input--error" : ""}`}>
                  <option value="1">Approval Required</option>
                  <option value="0">Instant Booking</option>
                </select>
                {renderError("bookingType")}
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Cancellation policy</label>
                <select value={policy} onChange={(e) => setPolicy(e.target.value)} className="tmx9pf-select">
                  {DEFAULT_CANCELLATION_POLICIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="tmx9pf-muted">
                  See our <a href="/refund-cancellation-policy" target="_blank" rel="noopener noreferrer">Refund &amp; Cancellation Policy</a> for details.
                </div>
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Insurance option</label>
                <select value={insurance ? "yes" : "no"} onChange={(e) => setInsurance(e.target.value === "yes")} className="tmx9pf-select">
                  <option value="no">No</option>
                  <option value="yes">Yes - include</option>
                </select>
              </div>
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Damage protection</label>
                <select value={damageProtection ? "yes" : "no"} onChange={(e) => setDamageProtection(e.target.value === "yes")} className="tmx9pf-select">
                  <option value="no">No</option>
                  <option value="yes">Yes - require</option>
                </select>
              </div>

              {/* Aadhaar Verification + Mobile OTP Verification — commented out for now (not required at listing time).
              {!isHomestay && (
                <>
                  <div className="tmx9pf-field full">
                    <label className="tmx9pf-label">Identity Verification *</label>
                  </div>
                  <div className="tmx9pf-field full" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label className="tmx9pf-label">Enter Aadhaar Number *</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <input type="text" maxLength="12" placeholder="12-digit Aadhaar Number" value={aadhaarNumber}
                          onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 12); setAadhaarNumber(val); if (aadhaarVerified) setAadhaarVerified(false); }}
                          className={`tmx9pf-input ${errors.idFiles ? "tmx9pf-input--error" : ""}`}
                          disabled={aadhaarVerified} style={{ borderColor: aadhaarVerified ? '#22c55e' : '' }} />
                        {renderError("idFiles")}
                      </div>
                      <button type="button" onClick={verifyAadhaar} disabled={aadhaarVerified || isVerifyingAadhaar || aadhaarNumber.length !== 12}
                        className="tmx9pf-small-btn"
                        style={{ height: '42px', padding: '0 20px', background: aadhaarVerified ? '#22c55e' : '#3b82f6', color: 'white', border: 'none', cursor: (aadhaarVerified || isVerifyingAadhaar) ? 'default' : 'pointer' }}>
                        {isVerifyingAadhaar ? "Verifying..." : aadhaarVerified ? "Verified ✓" : "Verify Now"}
                      </button>
                    </div>
                    {aadhaarVerified && <p style={{ color: '#166534', fontSize: '13px', marginTop: '8px' }}>✓ Aadhaar verification successful.</p>}
                  </div>
                  <div className="tmx9pf-field full" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label className="tmx9pf-label">Phone Verification</label>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                        <input type="text" maxLength="10" placeholder="10-digit Phone Number" value={phoneNumber}
                          onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setPhoneNumber(val); if (isPhoneVerified) setIsPhoneVerified(false); if (otpSent) setOtpSent(false); }}
                          className="tmx9pf-input" disabled={isPhoneVerified || otpSent} style={{ flex: 1, borderColor: isPhoneVerified ? '#22c55e' : '' }} />
                        {!otpSent && !isPhoneVerified && (
                          <button type="button" onClick={sendPhoneOtp} disabled={isSendingOtp || phoneNumber.length !== 10}
                            className="tmx9pf-small-btn"
                            style={{ height: '42px', padding: '0 20px', whiteSpace: 'nowrap', background: '#3b82f6', color: 'white', border: 'none', cursor: (isSendingOtp || phoneNumber.length !== 10) ? 'default' : 'pointer', opacity: (isSendingOtp || phoneNumber.length !== 10) ? 0.7 : 1 }}>
                            {isSendingOtp ? "Sending..." : "Send OTP"}
                          </button>
                        )}
                        {isPhoneVerified && <span style={{ color: '#166534', fontWeight: 'bold' }}>✓ Verified</span>}
                      </div>
                      {otpSent && !isPhoneVerified && (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                          <input type="text" maxLength="6" placeholder="Enter OTP" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))} className="tmx9pf-input" style={{ flex: 1 }} />
                          <button type="button" onClick={verifyPhoneOtp} disabled={isVerifyingOtp || phoneOtp.length < 4}
                            className="tmx9pf-small-btn"
                            style={{ height: '42px', padding: '0 20px', whiteSpace: 'nowrap', background: '#10b981', color: 'white', border: 'none', cursor: (isVerifyingOtp || phoneOtp.length < 4) ? 'default' : 'pointer', opacity: (isVerifyingOtp || phoneOtp.length < 4) ? 0.7 : 1 }}>
                            {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                          </button>
                        </div>
                      )}
                      {isPhoneVerified && <p style={{ color: '#166534', fontSize: '13px', margin: 0 }}>✓ Phone number verified successfully.</p>}
                    </div>
                  </div>
                </>
              )}
              */}
              {!isHomestay && (
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Selfie verification (optional)</label>
                  <input type="file" accept="image/*" onChange={handleSelfie} className="tmx9pf-file" />
                  <div className="tmx9pf-muted">{selfieFile ? selfieFile.name : "No selfie selected"}</div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <div className="tmx9pf-nav">
        <button type="button" onClick={goPrev} disabled={step === 0} className="tmx9pf-nav-btn tmx9pf-nav-prev">Previous</button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={goNext} className="tmx9pf-nav-btn tmx9pf-nav-next">Next</button>
        ) : (
          <button type="button" onClick={handleSubmit} className="tmx9pf-nav-btn tmx9pf-nav-next" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="spin-icon"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                {isEditMode ? "Saving..." : "Uploading..."}
              </span>
            ) : (isEditMode ? "Save Changes" : "Publish")}
          </button>
        )}
      </div>
    </form>
    </div>
  );
};

export default Tmx9PropertyForm;