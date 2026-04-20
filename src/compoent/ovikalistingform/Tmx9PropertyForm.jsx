import React, { useState, useEffect, useContext } from "react";
import "./tmx9pf-form.css";
import { AuthContext } from "../Login/AuthContext";
import CityDropdown, { addressContainsCityOrState } from "./CityDropdown";

const API_BASE = "https://www.townmanor.ai/api";
const STORAGE_KEY = "user";

const AMENITIES = {
  Basic: ["Wi-Fi", "Heating", "Air conditioning", "Hot water"],
  Kitchen: ["Refrigerator", "Stovetop/oven", "Microwave", "Cooking utensils", "Electric Kettle", "Hob", "Chimney", "RO", "Toaster", "Rice Cooker", "Coffee Maker", "Induction Cooktop", "Dining Counter"],
  Bathroom: ["Bath Towels", "Soap & Shampoo"],
  Appliances: ["Washing Machine", "Iron & Board"],
  Entertainment: ["TV", "Google TV", "Streaming services"],
  Safety: ["Smoke detector", "Carbon monoxide detector", "Fire extinguisher", "First aid kit", "Electronic Entry Lock", "Electronic Bedroom Lock", "Sprinkler"],
  Outdoor: ["Balcony/terrace", "Garden", "Parking space", "BBQ grill", "Tennis Court", "Golf Course"],
  Wellness: ["Pool", "Hot tub", "Sauna", "Gym"],
  Accessibility: ["Wheelchair accessible", "Elevator", "Ramp access"],
  Services: ["Breakfast Included", "Lunch Included", "Dinner Included", "All Meals Included", "Airport pick-up", "Luggage storage", "Cleaning on request"],
};

const DEFAULT_CANCELLATION_POLICIES = ["Flexible", "Moderate", "Strict"];
// const DEFAULT_PROPERTY_CATEGORIES = ["Apartment", "House", "Villa", "Cabin", "Bungalow", "Studio", "Suite", "Other"];
const DEFAULT_PROPERTY_CATEGORIES = [
  "Apartment",
  "House",
   "Villa",
     "Bungalow",
  "Cabin",
  "Studio",
  "Suite",
  "PG",
  "Other",
   "Hotel"
];

const PROPERTY_TYPES = ["Entire place", "Private room"];

function useFilePreviews() {
  const [previews, setPreviews] = useState([]);
  const update = (files) => {
    const arr = Array.from(files || []).slice(0, 12);
    const readers = arr.map((file) => {
      return new Promise((res) => {
        const r = new FileReader();
        r.onload = (e) => res({ name: file.name, url: e.target.result, file });
        r.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(setPreviews);
  };
  const clear = () => setPreviews([]);
  return { previews, update, clear };
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

const Tmx9PropertyForm = () => {
  const { user } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    propertyType: PROPERTY_TYPES[0],
    propertyCategory: DEFAULT_PROPERTY_CATEGORIES[0],
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
    { id: 1, title: "Basic & Description" },
    { id: 2, title: "Details & Amenities" },
    { id: 3, title: "House Rules" },
    { id: 4, title: "Photos & Media" },
    { id: 5, title: "Pricing & Check-in" },
    { id: 6, title: "IDs & Legal" },
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const all = {};
    Object.values(AMENITIES).flat().forEach((a) => (all[a] = false));
    setForm((f) => ({ ...f, amenities: all }));
  }, []);

  const validateForStep = (s) => {
    const newErrors = {};
    if (s === 0) {
      if (!form.address?.trim()) newErrors.address = "Address is required";
      else { const hit = addressContainsCityOrState(form.address); if (hit) newErrors.address = `City/state name "${hit}" not allowed in address. Use the City field below.`; }
      if (!form.city?.trim()) newErrors.city = "City is required";
      if (!form.postalCode?.trim()) newErrors.postalCode = "Postal code is required";
      if (!form.country?.trim()) newErrors.country = "Country is required";
      if (!form.title?.trim()) newErrors.title = "Title is required";
      if (!form.mainDescription?.trim()) newErrors.mainDescription = "Description is required";
      else if (form.mainDescription.length < 30) newErrors.mainDescription = "Description should be at least 30 characters";
      if (form.latitude !== "" && form.latitude !== undefined) {
        const lat = Number(form.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) newErrors.latitude = "Latitude must be between -90 and 90";
      }
      if (form.longitude !== "" && form.longitude !== undefined) {
        const lng = Number(form.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) newErrors.longitude = "Longitude must be between -180 and 180";
      }
    }

    if (s === 1) {
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

    if (s === 2) {
      if (!form.checkInTime) newErrors.checkInTime = "Check-in time required";
      if (!form.checkOutTime) newErrors.checkOutTime = "Check-out time required";
      if (form.maxGuests === "" || form.maxGuests < 1) newErrors.maxGuests = "Max guests must be at least 1";
    }

    if (s === 3) {
      if (photoPreviews.previews.length === 0) newErrors.photos = "At least one photo is required";
    }

    if (s === 4) {
      if (!form.baseRate && form.baseRate !== 0) newErrors.baseRate = "Base rate is required";
      if (form.baseRate && Number(form.baseRate) <= 0) newErrors.baseRate = "Rate must be positive";
      if (form.weeklyDiscountPct && (form.weeklyDiscountPct < 0 || form.weeklyDiscountPct > 100)) newErrors.weeklyDiscountPct = "Discount must be between 0 and 100";
      if (!form.selfCheckIn?.trim()) newErrors.selfCheckIn = "Please select self-check-in availability";
      if (form.bookingType !== 0 && form.bookingType !== 1) newErrors.bookingType = "Please select booking type";
    }

    if (s === 5) {
      if (!aadhaarVerified) newErrors.idFiles = "Please verify your Aadhaar number";
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
    const updated = photoPreviews.previews.filter((_, i) => i !== index);
    photoPreviews.update([]);
    setTimeout(() => photoPreviews.update(updated.map((p) => p.file)), 0);
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

  function extractIdFromObj(obj) {
    if (!obj) return null;
    return obj.id || obj._id || obj.owner_id || obj.userId || obj.uid || null;
  }

  async function fetchServerUser() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { method: "GET", credentials: "include" });
      const d = await res.json().catch(() => ({}));
      console.log("Tmx9PropertyForm: /auth/me response:", res.status, d);
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
      console.log("resolveOwnerId: using context id", idFromContext);
      return idFromContext;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const idFromLocal = extractIdFromObj(parsed);
        if (idFromLocal) {
          console.log("resolveOwnerId: using localStorage id", idFromLocal);
          return idFromLocal;
        }
      }
    } catch (e) {
      console.warn("resolveOwnerId local parse error", e);
    }

    const serverUser = await fetchServerUser();
    const idFromServer = extractIdFromObj(serverUser);
    if (idFromServer) {
      console.log("resolveOwnerId: using server id", idFromServer);
      return idFromServer;
    }

    console.log("resolveOwnerId: NO owner id found");
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const fd = new FormData();
      fd.append("property_name", form.title || "");
      fd.append("description", form.mainDescription || "");
      fd.append("city", form.city || "");
      fd.append("address", form.address || "");
      if (form.baseRate !== "" && form.baseRate !== null) fd.append("price", Number(form.baseRate).toFixed(2));
      fd.append("booking_type", String(form.bookingType));
      fd.append("owner_id", String(ownerId));
      console.log("=== NIGHTLY FORM SUBMIT DATA ===");
console.log("meta object:", JSON.parse(fd.get("meta") || "{}"));
console.log("property_name:", fd.get("property_name"));
console.log("price:", fd.get("price"));
console.log("booking_type:", fd.get("booking_type"));

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
        bedrooms: form.bedroomDetails.map(d => ({ type: d.type, count: d.count })),
        beds: form.beds,
        bathrooms: form.bathroomDetails.map(d => ({ type: d.type, count: d.count })),
        area: form.area,
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
      fd.append(
  "guest_policy",
  JSON.stringify({
    family_allowed: form.familyAllowed,
    unmarried_couple_allowed: form.unmarriedCoupleAllowed,
     bachelors_allowed:form.bachelorAllowed,
  })
);


      photoPreviews.previews.forEach((p, i) => {
        if (p && p.file) fd.append("photos", p.file, p.name || `photo-${i}`);
      });

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
console.log("=== API RESPONSE (NIGHTLY) ===");
console.log("Full response data:", data);
console.log("Property saved as:", data?.data);
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

  return (
    <form className="tmx9pf-root tmx9pf-paginated" onSubmit={handleSubmit} noValidate>
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

      <div className="tmx9pf-card">
        {/* STEP 0 */}
        {step === 0 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">Basic Property Information &amp; Description</h2>
            <div className="tmx9pf-grid">
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Property Type</label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className="tmx9pf-select">
                  {PROPERTY_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Category</label>
                <select name="propertyCategory" value={form.propertyCategory} onChange={handleChange} className="tmx9pf-select">
                  {DEFAULT_PROPERTY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Listing Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className={`tmx9pf-input ${errors.title ? "tmx9pf-input--error" : ""}`} placeholder="Cozy 2-Bedroom Apartment Near City Center" />
                {renderError("title")}
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Property Description *</label>
                <textarea name="mainDescription" value={form.mainDescription} onChange={handleChange} rows="4" className={`tmx9pf-textarea ${errors.mainDescription ? "tmx9pf-input--error" : ""}`} />
                {renderError("mainDescription")}
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Address *</label>
                <input placeholder="Street" name="address" value={form.address} onChange={handleChange} className={`tmx9pf-input ${errors.address ? "tmx9pf-input--error" : ""}`} />
                {renderError("address")}
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Country *</label>
                <input name="country" value={form.country} onChange={handleChange} className={`tmx9pf-input ${errors.country ? "tmx9pf-input--error" : ""}`} />
                {renderError("country")}
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">ZIP / Postal Code *</label>
                <input name="postalCode" value={form.postalCode} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setForm((s) => ({ ...s, postalCode: v })); }} maxLength={10} className={`tmx9pf-input ${errors.postalCode ? "tmx9pf-input--error" : ""}`} />
                {renderError("postalCode")}
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">City *</label>
                <CityDropdown
                  value={form.city}
                  onChange={handleChange}
                  className="tmx9pf-input"
                  hasError={!!errors.city}
                  placeholder="Select City"
                />
                {renderError("city")}
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Latitude</label>
                <input type="number" step="0.000001" name="latitude" value={form.latitude} onChange={handleNumChange} className={`tmx9pf-input ${errors.latitude ? "tmx9pf-input--error" : ""}`} placeholder="e.g., 19.0760" />
                {renderError("latitude")}
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Longitude</label>
                <input type="number" step="0.000001" name="longitude" value={form.longitude} onChange={handleNumChange} className={`tmx9pf-input ${errors.longitude ? "tmx9pf-input--error" : ""}`} placeholder="e.g., 72.8777" />
                {renderError("longitude")}
              </div>
            </div>

            {/* GUIDEBOOK SECTION 1: Transport Tips */}
            <div className="tmx9pf-guidebook-section">
              <h3 className="tmx9pf-guidebook-title">🚗 Transport & Travel Tips</h3>
              <div className="tmx9pf-grid">
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Taxi Services</label>
                  <input value={form.transportTips.taxi} onChange={(e) => setForm(f => ({ ...f, transportTips: { ...f.transportTips, taxi: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Uber/Ola available" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Parking Info</label>
                  <input value={form.transportTips.parking} onChange={(e) => setForm(f => ({ ...f, transportTips: { ...f.transportTips, parking: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Free street parking" />
                </div>
                <div className="tmx9pf-field full">
                  <label className="tmx9pf-label">Local Travel Tips</label>
                  <input value={form.transportTips.localTravel} onChange={(e) => setForm(f => ({ ...f, transportTips: { ...f.transportTips, localTravel: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Auto easily available" />
                </div>
              </div>
            </div>

            {/* GUIDEBOOK SECTION 2: Cafes & Restaurants */}
            <div className="tmx9pf-guidebook-section">
              <h3 className="tmx9pf-guidebook-title">🍽️ Nearby Cafes & Restaurants</h3>
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
                <button type="button" onClick={() => setForm(f => ({ ...f, cafesRestaurants: [...f.cafesRestaurants, { id: Date.now(), name: "", distanceM: "" }] }))} className="tmx9pf-small-btn" style={{ marginTop: "8px" }}>+ Add Restaurant</button>
              </div>
            </div>

            {/* GUIDEBOOK SECTION 3: Essentials Nearby */}
            <div className="tmx9pf-guidebook-section">
              <h3 className="tmx9pf-guidebook-title">🏪 Essentials Nearby</h3>
              <div className="tmx9pf-grid">
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">ATM</label>
                  <input value={form.essentialsNearby.atm} onChange={(e) => setForm(f => ({ ...f, essentialsNearby: { ...f.essentialsNearby, atm: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., HDFC ATM" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Grocery Store</label>
                  <input value={form.essentialsNearby.grocery} onChange={(e) => setForm(f => ({ ...f, essentialsNearby: { ...f.essentialsNearby, grocery: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Reliance Fresh (200m)" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Medical/Pharmacy</label>
                  <input value={form.essentialsNearby.medical} onChange={(e) => setForm(f => ({ ...f, essentialsNearby: { ...f.essentialsNearby, medical: e.target.value } }))} className="tmx9pf-input" placeholder="e.g., Apollo Pharmacy (300m)" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">Property Details &amp; Features</h2>
            <div className="tmx9pf-grid">
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

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Amenities (select all that apply)</label>
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
              </div>
            </div>
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">House Rules</h2>
            <div className="tmx9pf-grid">
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Check-in Time *</label>
                <input name="checkInTime" type="time" value={form.checkInTime} onChange={handleChange} className={`tmx9pf-input ${errors.checkInTime ? "tmx9pf-input--error" : ""}`} />
                {renderError("checkInTime")}
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Check-out Time *</label>
                <input name="checkOutTime" type="time" value={form.checkOutTime} onChange={handleChange} className={`tmx9pf-input ${errors.checkOutTime ? "tmx9pf-input--error" : ""}`} />
                {renderError("checkOutTime")}
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Smoking Allowed</label>
                <Toggle name="smokingAllowed" value={form.smokingAllowed} onChange={(v) => setForm((s) => ({ ...s, smokingAllowed: v }))} />
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Pets Allowed</label>
                <Toggle name="petsAllowed" value={form.petsAllowed} onChange={(v) => setForm((s) => ({ ...s, petsAllowed: v }))} />
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Events / Parties Allowed</label>
                <Toggle name="eventsAllowed" value={form.eventsAllowed} onChange={(v) => setForm((s) => ({ ...s, eventsAllowed: v }))} />
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Drinking Alcohol Allowed</label>
                <Toggle name="drinkingAllowed" value={form.drinkingAllowed} onChange={(v) => setForm((s) => ({ ...s, drinkingAllowed: v }))} />
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Outside Guests Allowed</label>
                <Toggle name="outsideGuestsAllowed" value={form.outsideGuestsAllowed} onChange={(v) => setForm((s) => ({ ...s, outsideGuestsAllowed: v }))} />
              </div>
<div className="tmx9pf-field">
  <label className="tmx9pf-label">Only Family Allowed</label>
  <Toggle
    name="familyAllowed" 
    value={form.familyAllowed}
    onChange={(v) =>
      setForm((s) => ({ ...s, familyAllowed: v }))
    }
  />
</div>

<div className="tmx9pf-field">
  <label className="tmx9pf-label">Unmarried Couple Allowed</label>
  <Toggle
    name="unmarriedCoupleAllowed"
    value={form.unmarriedCoupleAllowed}
    onChange={(v) =>
      setForm((s) => ({ ...s, unmarriedCoupleAllowed: v }))
    }
  />
</div>
<div className="tmx9pf-field">
  <label className="tmx9pf-label">Bachelor Allowed</label>
  <Toggle
    name="bachelorAllowed"
    value={form.bachelorAllowed}
    onChange={(v) =>
      setForm((s) => ({ ...s, bachelorAllowed: v }))
    }
  />
</div>


              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Quiet Hours</label>
                <input name="quietHours" value={form.quietHours} onChange={handleChange} className="tmx9pf-input" />
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Maximum Guests *</label>
                <input name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={handleNumChange} className={`tmx9pf-input ${errors.maxGuests ? "tmx9pf-input--error" : ""}`} />
                {renderError("maxGuests")}
              </div>
            </div>

            {/* GUIDEBOOK SECTION 4: Must Visit Places */}
            <div className="tmx9pf-guidebook-section">
              <h3 className="tmx9pf-guidebook-title">📍 Must Visit Places</h3>
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
                <button type="button" onClick={() => setForm(f => ({ ...f, mustVisitPlaces: [...f.mustVisitPlaces, { id: Date.now(), place: "", bestTime: "" }] }))} className="tmx9pf-small-btn" style={{ marginTop: "8px" }}>+ Add Place</button>
              </div>
            </div>

            {/* GUIDEBOOK SECTION 5: House Specific Tips */}
            <div className="tmx9pf-guidebook-section">
              <h3 className="tmx9pf-guidebook-title">💡 House-Specific Tips</h3>
              <div className="tmx9pf-dynamic-list">
                {form.houseSpecificTips.map((tip, index) => (
                  <div key={index} className="tmx9pf-dynamic-row">
                    <input placeholder="Add a helpful tip for guests" value={tip} onChange={(e) => { const newTips = [...form.houseSpecificTips]; newTips[index] = e.target.value; setForm(f => ({ ...f, houseSpecificTips: newTips })); }} className="tmx9pf-input" style={{ flex: 1 }} />
                    {form.houseSpecificTips.length > 1 && (
                      <button type="button" onClick={() => { const newTips = form.houseSpecificTips.filter((_, i) => i !== index); setForm(f => ({ ...f, houseSpecificTips: newTips })); }} className="tmx9pf-small-btn danger">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setForm(f => ({ ...f, houseSpecificTips: [...f.houseSpecificTips, ""] }))} className="tmx9pf-small-btn" style={{ marginTop: "8px" }}>+ Add Tip</button>
              </div>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">Photos &amp; Media</h2>
            <div className="tmx9pf-grid">
              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Photos (drag &amp; select) — up to 12 *</label>
                <input type="file" accept="image/*,application/pdf" multiple onChange={handlePhotos} className={`tmx9pf-file ${errors.photos ? "tmx9pf-file--error" : ""}`} />
                {renderError("photos")}
                <div className="tmx9pf-photo-previews">
                  {photoPreviews.previews.length === 0 && <div className="tmx9pf-muted">No photos selected</div>}
                  {photoPreviews.previews.map((p, i) => (
                    <div key={i} className="tmx9pf-photo-thumb">
                      <img src={p.url} alt={p.name} />
                      <div className="tmx9pf-photo-actions">
                        <button type="button" onClick={() => setCoverIndex(i)} className={`tmx9pf-small-btn ${coverIndex === i ? "tmx9pf-small-btn--active" : ""}`}>Cover</button>
                        <button type="button" onClick={() => removePhoto(i)} className="tmx9pf-small-btn">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">Pricing &amp; Availability</h2>
            <div className="tmx9pf-grid">
              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Base nightly rate (Rs) *</label>
                <input name="baseRate" type="number" min="0" value={form.baseRate} onChange={handleNumChange} className={`tmx9pf-input ${errors.baseRate ? "tmx9pf-input--error" : ""}`} />
                {renderError("baseRate")}
              </div>

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
                  {form.bookingType === 1 
                    ? "Approval Required: You must approve each booking request." 
                    : "Instant Booking: Guests can book instantly without your approval."}
                </div>
                <select value={form.bookingType} onChange={(e) => setForm((s) => ({ ...s, bookingType: e.target.value === "1" ? 1 : 0 }))} className={`tmx9pf-select ${errors.bookingType ? "tmx9pf-input--error" : ""}`}>
                  <option value="1">Approval Required</option>
                  <option value="0">Instant Booking</option>
                </select>
                {renderError("bookingType")}
              </div>
            </div>
          </section>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <section className="tmx9pf-section">
            <h2 className="tmx9pf-section-title">Identity &amp; Legal</h2>
            <div className="tmx9pf-grid">
              
              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Identity Verification *</label>
              </div>

              <div className="tmx9pf-field full" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label className="tmx9pf-label">Enter Aadhaar Number *</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      maxLength="12"
                      placeholder="12-digit Aadhaar Number" 
                      value={aadhaarNumber} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setAadhaarNumber(val);
                        if (aadhaarVerified) setAadhaarVerified(false); // Reset verification on change
                      }}
                      className={`tmx9pf-input ${errors.idFiles ? "tmx9pf-input--error" : ""}`}
                      disabled={aadhaarVerified}
                      style={{ borderColor: aadhaarVerified ? '#22c55e' : '' }}
                    />
                    {renderError("idFiles")}
                  </div>
                  <button 
                    type="button" 
                    onClick={verifyAadhaar} 
                    disabled={aadhaarVerified || isVerifyingAadhaar || aadhaarNumber.length !== 12}
                    className="tmx9pf-small-btn"
                    style={{ 
                      height: '42px', 
                      padding: '0 20px', 
                      background: aadhaarVerified ? '#22c55e' : '#3b82f6', 
                      color: 'white', 
                      border: 'none',
                      cursor: (aadhaarVerified || isVerifyingAadhaar) ? 'default' : 'pointer'
                    }}
                  >
                    {isVerifyingAadhaar ? "Verifying..." : aadhaarVerified ? "Verified ✓" : "Verify Now"}
                  </button>
                </div>
                {aadhaarVerified && <p style={{ color: '#166534', fontSize: '13px', marginTop: '8px' }}>✓ Aadhaar verification successful. You can proceed.</p>}
              </div>



              {/* Phone Verification Section */}
              <div className="tmx9pf-field full" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                <label className="tmx9pf-label">Phone Verification *</label>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  
                  {/* Phone Input Row */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                    <input 
                      type="text" 
                      maxLength="10"
                      placeholder="10-digit Phone Number" 
                      value={phoneNumber} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhoneNumber(val);
                        if (isPhoneVerified) setIsPhoneVerified(false);
                        if (otpSent) setOtpSent(false); // Reset OTP flow if number changes
                      }}
                      className={`tmx9pf-input`}
                      disabled={isPhoneVerified || otpSent}
                      style={{ flex: 1, borderColor: isPhoneVerified ? '#22c55e' : '' }}
                    />
                    
                    {!otpSent && !isPhoneVerified && (
                      <button 
                        type="button" 
                        onClick={sendPhoneOtp}
                        disabled={isSendingOtp || phoneNumber.length !== 10}
                        className="tmx9pf-small-btn"
                        style={{ 
                          height: '42px', 
                          padding: '0 20px', 
                          whiteSpace: 'nowrap',
                          background: '#3b82f6', 
                          color: 'white', 
                          border: 'none',
                          cursor: (isSendingOtp || phoneNumber.length !== 10) ? 'default' : 'pointer',
                          opacity: (isSendingOtp || phoneNumber.length !== 10) ? 0.7 : 1
                        }}
                      >
                        {isSendingOtp ? "Sending..." : "Send OTP"}
                      </button>
                    )}

                    {isPhoneVerified && (
                      <span style={{ color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* OTP Input Row */}
                  {otpSent && !isPhoneVerified && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                      <input 
                        type="text" 
                        maxLength="6"
                        placeholder="Enter OTP" 
                        value={phoneOtp} 
                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                        className="tmx9pf-input"
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button" 
                        onClick={verifyPhoneOtp}
                        disabled={isVerifyingOtp || phoneOtp.length < 4}
                        className="tmx9pf-small-btn"
                        style={{ 
                          height: '42px', 
                          padding: '0 20px', 
                          whiteSpace: 'nowrap',
                          background: '#10b981', 
                          color: 'white', 
                          border: 'none',
                          cursor: (isVerifyingOtp || phoneOtp.length < 4) ? 'default' : 'pointer',
                          opacity: (isVerifyingOtp || phoneOtp.length < 4) ? 0.7 : 1
                        }}
                      >
                        {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  )}
                  
                  {isPhoneVerified && <p style={{ color: '#166534', fontSize: '13px', margin: 0 }}>✓ Phone number verified successfully.</p>}
                  
                </div>
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Selfie verification (optional)</label>
                <input type="file" accept="image/*" onChange={handleSelfie} className="tmx9pf-file" />
                <div className="tmx9pf-muted">{selfieFile ? selfieFile.name : "No selfie selected"}</div>
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Cancellation policy</label>
                <select value={policy} onChange={(e) => setPolicy(e.target.value)} className="tmx9pf-select">
                  {DEFAULT_CANCELLATION_POLICIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="tmx9pf-muted">
                  See our <a href="/refund-cancellation-policy" target="_blank" rel="noopener noreferrer">Refund &amp; Cancellation Policy</a> for details on Flexible, Moderate, and Strict tiers.
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
            </div>
          </section>
        )}
      </div>

      <div className="tmx9pf-nav">
        <button type="button" onClick={goPrev} disabled={step === 0} className="tmx9pf-nav-btn tmx9pf-nav-prev">Previous</button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={goNext} className="tmx9pf-nav-btn tmx9pf-nav-next">Next</button>
        ) : (
          <button type="submit" className="tmx9pf-nav-btn tmx9pf-nav-next" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Publish"}</button>
        )}
      </div>
    </form>
  );
};

export default Tmx9PropertyForm;