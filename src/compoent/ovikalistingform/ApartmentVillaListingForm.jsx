import React, { useContext, useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import "./tmx9pf-form.css";
import { AuthContext } from "../Login/AuthContext";
import CityDropdown from "./CityDropdown";
import { useStepBackNav } from "../../utils/useStepBackNav";
import { compressImage } from "../../utils/compressImage";

const API_BASE = "https://www.townmanor.ai/api";

/* ── Reference data ─────────────────────────────────────────────────────── */
const PROPERTY_TYPES = ["Flat/Apartment", "Independent House / Villa", "Builder Floor", "1 RK/ Studio Apartment", "Serviced Apartment", "Farmhouse", "Other"];
const FURNISHING_STATUS = ["Furnished", "Semi-furnished", "Un-furnished"];
const FURNISHING_ITEMS = ["AC", "TV", "Beds", "Wardrobe", "Geyser", "Light", "Fans", "Sofa", "Washing Machine", "Stove", "Fridge", "Water Purifier", "Microwave", "Modular Kitchen", "Chimney", "Dinning Table"];
const PROPERTY_AGE = ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
const RENT_TO = ["Family", "Single men", "Single women", "Company leasing", "Anyone"];
const OTHER_ROOMS = ["Pooja Room", "Study Room", "Servant Room", "Store Room"];
const PROPERTY_FEATURES = ["Recently Renovated", "Vaastu Compliant", "High Ceiling Height", "Pet Friendly", "Corner Property", "Gated Society", "Park Facing", "Newly Constructed", "Immediate Possession"];
const AMENITIES_LIST = ["Lift(s)", "Security Guard", "CCTV Surveillance", "Club house", "Swimming Pool", "Gymnasium", "Power Backup", "Intercom", "Fire Safety", "Rain Water Harvesting", "Visitor Parking", "Maintenance Staff"];
const FLOORING_TYPES = ["Italian Marble", "Marble", "Concrete", "Polished concrete", "Granite", "Vitrified Tiles", "Ceramic Tiles", "Wooden", "Mosaic"];
const FACING_OPTIONS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const AREA_UNITS = ["sq.ft.", "sq.m.", "sq.yd."];

const STEPS = [
  { id: 0, title: "Basic Details" },
  { id: 1, title: "Location" },
  { id: 2, title: "Property Profile" },
  { id: 3, title: "Photos & Video" },
  { id: 4, title: "Other Details" },
  { id: 5, title: "Amenities" },
];

function getInitialForm() {
  return {
    lookingTo: "Rent / Lease",
    category: "Residential",
    propertyType: "Flat/Apartment",

    city: "", locality: "", subLocality: "", society: "", houseNo: "",
    address: "", latitude: "", longitude: "", pincode: "", state: "", country: "India",

    carpetArea: "", carpetAreaUnit: "sq.ft.",
    showBuiltUp: false, builtUpArea: "", builtUpAreaUnit: "sq.ft.",
    showSuperBuiltUp: false, superBuiltUpArea: "", superBuiltUpAreaUnit: "sq.ft.",
    bedrooms: 1, bathrooms: 1, balconies: 0,
    furnishing: "", furnishingItems: {},
    totalFloors: "", propertyOnFloor: "", isDuplex: false,
    propertyAge: "",
    availableFrom: "",
    rentOutTo: [],
    expectedRent: "", priceInWords: "",
    electricityWaterExcluded: true, priceNegotiable: false,
    okBrokersContact: "Yes",

    youtubeLink: "",
    description: "", email: "",

    securityDepositType: "", securityDepositMonths: "", securityDepositAmount: "",
    otherRooms: [],
    coveredParking: 0, openParking: 0,

    propertyFeatures: [], amenities: [],
    openSides: "", powerBackup: "", facing: "",
    flooringType: "", facingRoadWidth: "", facingRoadUnit: "Feet",
  };
}

function useFilePreviews() {
  const [previews, setPreviews] = useState([]);
  const update = (files) => {
    const arr = Array.from(files || []);
    const readers = arr.map((file) => new Promise((res) => {
      const r = new FileReader();
      r.onload = (e) => res({ name: file.name, url: e.target.result, file, tag: "" });
      r.readAsDataURL(file);
    }));
    Promise.all(readers).then((newResults) => setPreviews((prev) => [...prev, ...newResults].slice(0, 50)));
  };
  const remove = (index) => setPreviews((prev) => prev.filter((_, i) => i !== index));
  const setTag = (index, tag) => setPreviews((prev) => { const n = [...prev]; n[index] = { ...n[index], tag }; return n; });
  const clear = () => setPreviews([]);
  return { previews, update, remove, setTag, clear };
}

const Chip = ({ label, selected, onClick, disabled }) => (
  <div className={`bnb-chip ${selected ? "selected" : ""}`} style={disabled ? { opacity: .45, cursor: "not-allowed" } : undefined} onClick={disabled ? undefined : onClick}>{label}</div>
);

const Stepper = ({ value, onChange, min = 0, max = 20 }) => (
  <div className="bnb-stepper-controls">
    <button type="button" className="bnb-stepper-btn" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
    <span className="bnb-stepper-val">{value}</span>
    <button type="button" className="bnb-stepper-btn" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
  </div>
);

const ApartmentVillaListingForm = ({ propId: passedId, onComplete } = {}) => {
  const { user } = useContext(AuthContext);
  const { id: paramId } = useParams();
  const editId = passedId || paramId;
  const isEditMode = !!editId;

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(isEditMode);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);

  const [form, setForm] = useState(getInitialForm());
  const photoPreviews = useFilePreviews();

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const toggleInArray = (name, value) => setForm((f) => ({
    ...f, [name]: f[name].includes(value) ? f[name].filter((x) => x !== value) : [...f[name], value],
  }));

  /* ── Address autocomplete (Nominatim) — same pattern used elsewhere in the app ── */
  const [addrSuggestions, setAddrSuggestions] = useState([]);
  const [showAddrDrop, setShowAddrDrop] = useState(false);
  const addrTimer = useRef(null);
  const addrWrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (addrWrapRef.current && !addrWrapRef.current.contains(e.target)) setShowAddrDrop(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLocalityInput = (e) => {
    const val = e.target.value;
    setField("locality", val);
    if (addrTimer.current) clearTimeout(addrTimer.current);
    if (val.trim().length < 3) { setAddrSuggestions([]); setShowAddrDrop(false); return; }
    addrTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&addressdetails=1&limit=6&countrycodes=in`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setAddrSuggestions(data);
        setShowAddrDrop(data.length > 0);
      } catch (_) { /* ignore address lookup failures */ }
    }, 280);
  };

  const selectAddrSuggestion = (item) => {
    const a = item.address || {};
    const city = a.city || a.town || a.village || a.county || "";
    setForm((f) => ({
      ...f,
      locality: a.suburb || a.neighbourhood || item.display_name.split(",")[0],
      city: city || f.city,
      state: a.state || f.state,
      pincode: a.postcode || f.pincode,
      latitude: item.lat || f.latitude,
      longitude: item.lon || f.longitude,
    }));
    setAddrSuggestions([]);
    setShowAddrDrop(false);
  };

  /* ── Edit mode: load existing property and prefill ── */
  useEffect(() => {
    if (!isEditMode) return;
    let cancelled = false;
    (async () => {
      setIsLoadingEdit(true);
      try {
        const res = await fetch(`${API_BASE}/ovika/apartments/${editId}`);
        const json = await res.json().catch(() => null);
        const data = json?.data || json;
        if (!data || cancelled) return;
        const parseJson = (val, fallback) => {
          if (val === null || val === undefined) return fallback;
          if (typeof val === "object") return val;
          try { return JSON.parse(val); } catch { return fallback; }
        };
        const meta = parseJson(data.meta, {});

        setForm((f) => ({
          ...f,
          ...meta,
          lookingTo: data.listing_type === "sell" ? "Sell" : "Rent / Lease",
          propertyType: data.property_type || meta.propertyType || f.propertyType,
          city: data.city || "",
          address: data.address || "",
          locality: data.locality || meta.locality || "",
          pincode: data.pincode || "",
          state: data.state || "",
          country: data.country || "India",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
          bedrooms: Number(data.bedrooms) || meta.bedrooms || 1,
          bathrooms: Number(data.bathrooms) || meta.bathrooms || 1,
          carpetArea: data.carpet_area ?? meta.carpetArea ?? "",
          carpetAreaUnit: data.carpet_area_unit || meta.carpetAreaUnit || "sq.ft.",
          totalFloors: data.total_floors ?? meta.totalFloors ?? "",
          propertyOnFloor: data.floor_number ?? meta.propertyOnFloor ?? "",
          facing: data.facing || meta.facing || "",
          flooringType: data.flooring_type || meta.flooringType || "",
          facingRoadWidth: data.facing_road_width ?? meta.facingRoadWidth ?? "",
          amenities: parseJson(data.amenities, meta.amenities || []),
          propertyFeatures: parseJson(data.property_features, meta.propertyFeatures || []),
          description: data.description || meta.description || "",
          expectedRent: data.price ?? meta.expectedRent ?? "",
          securityDepositAmount: data.security_deposit ?? meta.securityDepositAmount ?? "",
        }));
        const furnishingRaw = parseJson(data.furnishing_items, meta.furnishingItems || []);
        if (Array.isArray(furnishingRaw)) {
          setForm((f) => ({ ...f, furnishingItems: Object.fromEntries(furnishingRaw.map((k) => [k, true])) }));
        }
        setExistingPhotos(Array.isArray(data.photos) ? data.photos.filter(Boolean) : []);
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

  const goNext = () => {
    if (validateForStep(step)) { setStep((s) => Math.min(s + 1, STEPS.length - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const goPrev = () => { setStep((s) => Math.max(s - 1, 0)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  useStepBackNav(step, goPrev);

  const validateForStep = (s) => {
    const newErrors = {};
    if (s === 0) {
      if (!form.propertyType) newErrors.propertyType = "Select a property type";
    }
    if (s === 1) {
      if (!form.city?.trim()) newErrors.city = "City is required";
      if (!form.locality?.trim()) newErrors.locality = "Locality is required";
      if (!form.pincode?.trim()) newErrors.pincode = "Pincode is required";
      if (!form.state?.trim()) newErrors.state = "State is required";
    }
    if (s === 2) {
      if (!form.carpetArea?.toString().trim()) newErrors.carpetArea = "Carpet area is required";
      if ((form.furnishing === "Furnished") && Object.values(form.furnishingItems).filter(Boolean).length < 3) {
        newErrors.furnishingItems = "At least three furnishings are mandatory for furnished";
      }
      if (!form.expectedRent || Number(form.expectedRent) <= 0) newErrors.expectedRent = "Expected rent is required";
    }
    if (s === 3) {
      if (existingPhotos.length + photoPreviews.previews.length < 5) newErrors.photos = "At least 5 photos are required";
      if (!form.description?.trim() || form.description.trim().length < 30) newErrors.description = "Minimum 30 characters required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderError = (field) => (errors[field] ? <span className="tmx9pf-error">{errors[field]}</span> : null);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) photoPreviews.update(files);
  };

  /* ── owner id resolution — same pattern used across the app ── */
  function extractIdFromObj(obj) { return obj ? (obj.id || obj._id || obj.owner_id || obj.userId || obj.uid || null) : null; }
  const resolveOwnerId = () => extractIdFromObj(user) || (() => {
    try { const raw = localStorage.getItem("user"); if (raw) return extractIdFromObj(JSON.parse(raw)); } catch { /* ignore */ }
    return null;
  })();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const ownerId = resolveOwnerId();
    if (!ownerId) { alert("Owner not found. Please sign in again."); setIsSubmitting(false); return; }

    for (let i = 0; i < STEPS.length; i++) {
      if (!validateForStep(i)) { setIsSubmitting(false); setStep(i); return; }
    }

    try {
      const fullAddress = [form.houseNo, form.society, form.subLocality, form.locality].filter(Boolean).join(", ");
      const furnishingItemsArr = Object.keys(form.furnishingItems).filter((k) => form.furnishingItems[k]);
      const securityDeposit = form.securityDepositType === "Fixed" ? Number(form.securityDepositAmount) || 0 : 0;

      // Everything without a dedicated column on the backend goes into `meta`.
      const meta = { ...form, furnishingItems: furnishingItemsArr, photoTags: photoPreviews.previews.map((p) => p.tag || "") };

      if (isEditMode) {
        let uploadedUrls = [];
        const newPhotoEntries = photoPreviews.previews.filter((p) => p?.file);
        if (newPhotoEntries.length > 0) {
          const compressedPhotos = await Promise.all(newPhotoEntries.map((p) => compressImage(p.file)));
          const uploadFd = new FormData();
          compressedPhotos.forEach((f, i) => uploadFd.append("images", f, newPhotoEntries[i].name || `photo-${i}`));
          const uploadRes = await fetch(`${API_BASE}/image/aws-upload-owner-images`, { method: "POST", body: uploadFd });
          const uploadData = await uploadRes.json().catch(() => null);
          if (uploadRes.ok && Array.isArray(uploadData?.fileUrls)) uploadedUrls = uploadData.fileUrls;
        }
        const finalPhotos = [...existingPhotos, ...uploadedUrls];

        const putPayload = {
          listing_type: "rent_lease",
          property_type: form.propertyType,
          property_name: form.society || form.locality || "Property",
          description: form.description,
          address: fullAddress,
          locality: form.locality,
          pincode: form.pincode,
          country: form.country || "India",
          state: form.state,
          city: form.city,
          latitude: form.latitude || "",
          longitude: form.longitude || "",
          price: Number(form.expectedRent) || 0,
          security_deposit: securityDeposit,
          bedrooms: Number(form.bedrooms) || 1,
          bathrooms: Number(form.bathrooms) || 1,
          carpet_area: Number(form.carpetArea) || 0,
          carpet_area_unit: form.carpetAreaUnit || "sq.ft.",
          floor_number: form.propertyOnFloor || "",
          total_floors: Number(form.totalFloors) || 0,
          facing: form.facing || "",
          flooring_type: form.flooringType || "",
          facing_road_width: Number(form.facingRoadWidth) || 0,
          amenities: form.amenities,
          furnishing_items: furnishingItemsArr,
          property_features: form.propertyFeatures,
          photos: finalPhotos,
          cover_photo_index: coverIndex,
          meta,
        };

        const putRes = await fetch(`${API_BASE}/ovika/apartments/${editId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(putPayload),
        });
        const putData = await putRes.json().catch(() => ({}));
        if (!putRes.ok || putData.success === false) {
          const fieldErrors = putData.errors ? "\n\n" + Object.entries(putData.errors).map(([k, v]) => `• ${k}: ${v}`).join("\n") : "";
          alert(`Failed to update property (${putRes.status}): ${putData.message || "Unknown error"}${fieldErrors}`);
          setIsSubmitting(false);
          return;
        }
        alert("Property updated successfully!");
        if (onComplete) onComplete(); else { setStep(0); window.scrollTo({ top: 0, behavior: "smooth" }); }
        setIsSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append("owner_id", String(ownerId));
      fd.append("listing_type", "rent_lease");
      fd.append("property_type", form.propertyType);
      fd.append("property_name", form.society || form.locality || "Property");
      fd.append("description", form.description);
      fd.append("address", fullAddress);
      fd.append("locality", form.locality);
      fd.append("pincode", form.pincode);
      fd.append("country", form.country || "India");
      fd.append("state", form.state);
      fd.append("city", form.city);
      if (form.latitude !== "") fd.append("latitude", String(form.latitude));
      if (form.longitude !== "") fd.append("longitude", String(form.longitude));
      fd.append("price", String(Number(form.expectedRent) || 0));
      fd.append("security_deposit", String(securityDeposit));
      fd.append("bedrooms", String(Number(form.bedrooms) || 1));
      fd.append("bathrooms", String(Number(form.bathrooms) || 1));
      fd.append("carpet_area", String(Number(form.carpetArea) || 0));
      fd.append("carpet_area_unit", form.carpetAreaUnit || "sq.ft.");
      if (form.propertyOnFloor) fd.append("floor_number", String(form.propertyOnFloor));
      if (form.totalFloors) fd.append("total_floors", String(Number(form.totalFloors) || 0));
      if (form.facing) fd.append("facing", form.facing);
      if (form.flooringType) fd.append("flooring_type", form.flooringType);
      if (form.facingRoadWidth) fd.append("facing_road_width", String(Number(form.facingRoadWidth) || 0));
      fd.append("amenities", JSON.stringify(form.amenities));
      fd.append("furnishing_items", JSON.stringify(furnishingItemsArr));
      fd.append("property_features", JSON.stringify(form.propertyFeatures));
      fd.append("cover_photo_index", String(coverIndex));
      fd.append("meta", JSON.stringify(meta));

      const photoFiles = photoPreviews.previews.filter((p) => p?.file);
      const compressed = await Promise.all(photoFiles.map((p) => compressImage(p.file)));
      compressed.forEach((f, i) => fd.append("photos", f, photoFiles[i].name || `photo-${i}`));

      const res = await fetch(`${API_BASE}/ovika/apartments/upload`, { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({ success: false, message: "Invalid JSON response" }));
      if (!res.ok || (data.success === false)) {
        const fieldErrors = data.errors ? "\n\n" + Object.entries(data.errors).map(([k, v]) => `• ${k}: ${v}`).join("\n") : "";
        alert((data.message || "Failed to create listing") + fieldErrors);
        setIsSubmitting(false);
        return;
      }
      alert("Property listed successfully! ID: " + (data.data?.id ?? "unknown"));
      setForm(getInitialForm());
      photoPreviews.clear();
      setExistingPhotos([]);
      setCoverIndex(0);
      setErrors({});
      setStep(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Apartment/Villa submit error", err);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoadingEdit) {
    return (
      <div className="tmx9pf-root">
        <div className="tmx9pf-card" style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  /* ── "Sell" flow: no buy/sell backend exists on OvikaLiving (rental platform only) ── */
  if (form.lookingTo === "Sell") {
    return (
      <div className="tmx9pf-root">
        <Helmet><title>List Your Property | OvikaLiving</title></Helmet>
        <div className="tmx9pf-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2 className="tmx9pf-section-title">Selling properties isn't supported yet</h2>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>OvikaLiving currently only supports rental listings. Switch to "Rent / Lease" to continue.</p>
          <div className="bnb-chips-row" style={{ justifyContent: "center" }}>
            <Chip label="Switch to Rent / Lease" selected onClick={() => setField("lookingTo", "Rent / Lease")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tmx9pf-root">
      <Helmet><title>{isEditMode ? "Update" : "List"} Your Property | OvikaLiving</title></Helmet>
      <form className="tmx9pf-paginated" onSubmit={(e) => e.preventDefault()} noValidate>
        <header className="tmx9pf-header">
          <h1 className="tmx9pf-title">{isEditMode ? "Update" : "Create"} <span className="span-data-setup">Property</span> Listing</h1>
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

        <div className="tmx9pf-card" style={{ minHeight: 560, width: "100%", boxSizing: "border-box" }}>

          {/* STEP 0 — Basic Details */}
          {step === 0 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">You're looking to ...</h2>
              <div className="bnb-chips-row" style={{ marginBottom: 20 }}>
                <Chip label="Sell" selected={form.lookingTo === "Sell"} onClick={() => setField("lookingTo", "Sell")} />
                <Chip label="Rent / Lease" selected={form.lookingTo === "Rent / Lease"} onClick={() => setField("lookingTo", "Rent / Lease")} />
              </div>

              <h2 className="tmx9pf-section-title">And it's a ...</h2>
              <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: "#334155", cursor: "pointer" }}>
                  <input type="radio" checked={form.category === "Residential"} onChange={() => setField("category", "Residential")} /> Residential
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: "#334155", cursor: "pointer" }}>
                  <input type="radio" checked={form.category === "Commercial"} onChange={() => setField("category", "Commercial")} /> Commercial
                </label>
              </div>
              <div className="bnb-chips-row">
                {PROPERTY_TYPES.map((t) => (
                  <Chip key={t} label={t} selected={form.propertyType === t} onClick={() => setField("propertyType", t)} />
                ))}
              </div>
              {renderError("propertyType")}
            </section>
          )}

          {/* STEP 1 — Location */}
          {step === 1 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Where is your property located?</h2>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20, marginTop: -8 }}>An accurate location helps you connect with the right buyers</p>

              <div className="tmx9pf-grid">
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">City *</label>
                  <CityDropdown value={form.city} onChange={(e) => setField("city", e.target.value)} className="tmx9pf-input" hasError={!!errors.city} placeholder="Select City" />
                  {renderError("city")}
                </div>
                <div className="tmx9pf-field" ref={addrWrapRef} style={{ position: "relative" }}>
                  <label className="tmx9pf-label">Locality *</label>
                  <input value={form.locality} onChange={handleLocalityInput} onFocus={() => addrSuggestions.length > 0 && setShowAddrDrop(true)} className={`tmx9pf-input ${errors.locality ? "tmx9pf-input--error" : ""}`} placeholder="Search locality" autoComplete="off" />
                  {showAddrDrop && addrSuggestions.length > 0 && (
                    <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", margin: "4px 0 0", padding: 0, listStyle: "none" }}>
                      {addrSuggestions.map((item, idx) => (
                        <li key={idx} onMouseDown={() => selectAddrSuggestion(item)} style={{ padding: "9px 12px", cursor: "pointer", fontSize: 13, display: "flex", gap: 6, borderBottom: idx < addrSuggestions.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                          <MapPin size={13} style={{ color: "#c2772b", flexShrink: 0, marginTop: 2 }} /> {item.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {renderError("locality")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Sub Locality (Optional)</label>
                  <input value={form.subLocality} onChange={(e) => setField("subLocality", e.target.value)} className="tmx9pf-input" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Apartment / Society</label>
                  <input value={form.society} onChange={(e) => setField("society", e.target.value)} className="tmx9pf-input" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">House No. (Optional)</label>
                  <input value={form.houseNo} onChange={(e) => setField("houseNo", e.target.value)} className="tmx9pf-input" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Pincode *</label>
                  <input value={form.pincode} onChange={(e) => setField("pincode", e.target.value)} className={`tmx9pf-input ${errors.pincode ? "tmx9pf-input--error" : ""}`} />
                  {renderError("pincode")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">State *</label>
                  <input value={form.state} onChange={(e) => setField("state", e.target.value)} className={`tmx9pf-input ${errors.state ? "tmx9pf-input--error" : ""}`} />
                  {renderError("state")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Country</label>
                  <input value={form.country} onChange={(e) => setField("country", e.target.value)} className="tmx9pf-input" />
                </div>
              </div>
            </section>
          )}

          {/* STEP 2 — Property Profile */}
          {step === 2 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Tell us about your property</h2>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Carpet Area * <span style={{ fontWeight: 400, color: "#9ca3af" }}>(atleast one area type is mandatory)</span></label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" min="0" value={form.carpetArea} onChange={(e) => setField("carpetArea", e.target.value)} className={`tmx9pf-input ${errors.carpetArea ? "tmx9pf-input--error" : ""}`} style={{ flex: 2 }} />
                  <select className="tmx9pf-select" value={form.carpetAreaUnit} onChange={(e) => setField("carpetAreaUnit", e.target.value)} style={{ flex: 1 }}>
                    {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                {renderError("carpetArea")}
                <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                  {!form.showBuiltUp && <button type="button" className="tmx9pf-small-btn" onClick={() => setField("showBuiltUp", true)}>+ Built-up Area</button>}
                  {!form.showSuperBuiltUp && <button type="button" className="tmx9pf-small-btn" onClick={() => setField("showSuperBuiltUp", true)}>+ Super Built-up Area</button>}
                </div>
              </div>

              {form.showBuiltUp && (
                <div className="tmx9pf-field full">
                  <label className="tmx9pf-label">Built-up Area</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" min="0" value={form.builtUpArea} onChange={(e) => setField("builtUpArea", e.target.value)} className="tmx9pf-input" style={{ flex: 2 }} />
                    <select className="tmx9pf-select" value={form.builtUpAreaUnit} onChange={(e) => setField("builtUpAreaUnit", e.target.value)} style={{ flex: 1 }}>
                      {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
              )}
              {form.showSuperBuiltUp && (
                <div className="tmx9pf-field full">
                  <label className="tmx9pf-label">Super Built-up Area</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" min="0" value={form.superBuiltUpArea} onChange={(e) => setField("superBuiltUpArea", e.target.value)} className="tmx9pf-input" style={{ flex: 2 }} />
                    <select className="tmx9pf-select" value={form.superBuiltUpAreaUnit} onChange={(e) => setField("superBuiltUpAreaUnit", e.target.value)} style={{ flex: 1 }}>
                      {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">No. of Bedrooms</label>
                <div className="bnb-chips-row">
                  {[1, 2, 3, 4].map((n) => <Chip key={n} label={n} selected={form.bedrooms === n} onClick={() => setField("bedrooms", n)} />)}
                </div>
              </div>
              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">No. of Bathrooms</label>
                <div className="bnb-chips-row">
                  {[1, 2, 3, 4].map((n) => <Chip key={n} label={n} selected={form.bathrooms === n} onClick={() => setField("bathrooms", n)} />)}
                </div>
              </div>
              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Balconies</label>
                <div className="bnb-chips-row">
                  {[0, 1, 2, 3].map((n) => <Chip key={n} label={n} selected={form.balconies === n} onClick={() => setField("balconies", n)} />)}
                  <Chip label="More than 3" selected={form.balconies === 4} onClick={() => setField("balconies", 4)} />
                </div>
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Furnishing</label>
                <div className="bnb-chips-row">
                  {FURNISHING_STATUS.map((f) => <Chip key={f} label={f} selected={form.furnishing === f} onClick={() => setField("furnishing", f)} />)}
                </div>
              </div>
              {(form.furnishing === "Furnished" || form.furnishing === "Semi-furnished") && (
                <div className="tmx9pf-field full">
                  <div className="tmx9pf-amenity-group">
                    <div className="tmx9pf-amenity-group-title">{form.furnishing === "Furnished" ? "At least three furnishings are mandatory" : "Select the furnishings available"}</div>
                    <div className="tmx9pf-amenity-list">
                      {FURNISHING_ITEMS.map((item) => (
                        <label key={item} className="tmx9pf-amenity">
                          <input type="checkbox" checked={!!form.furnishingItems[item]} onChange={() => setField("furnishingItems", { ...form.furnishingItems, [item]: !form.furnishingItems[item] })} />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {renderError("furnishingItems")}
                </div>
              )}

              <div className="tmx9pf-grid">
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Total floors in building</label>
                  <input value={form.totalFloors} onChange={(e) => setField("totalFloors", e.target.value)} className="tmx9pf-input" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Property on floor</label>
                  <select className="tmx9pf-select" value={form.propertyOnFloor} onChange={(e) => setField("propertyOnFloor", e.target.value)}>
                    <option value="">Select</option>
                    {["Ground", ...Array.from({ length: 30 }, (_, i) => String(i + 1))].map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <label className="tmx9pf-amenity" style={{ maxWidth: 260 }}>
                <input type="checkbox" checked={form.isDuplex} onChange={(e) => setField("isDuplex", e.target.checked)} /> <span>This property is a Duplex</span>
              </label>

              <div className="tmx9pf-field full" style={{ marginTop: 16 }}>
                <label className="tmx9pf-label">Age of property</label>
                <div className="bnb-chips-row">
                  {PROPERTY_AGE.map((a) => <Chip key={a} label={a} selected={form.propertyAge === a} onClick={() => setField("propertyAge", a)} />)}
                </div>
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Available from</label>
                <input type="date" value={form.availableFrom} onChange={(e) => setField("availableFrom", e.target.value)} className="tmx9pf-input" />
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Willing to rent out to</label>
                <div className="bnb-chips-row">
                  {RENT_TO.map((r) => <Chip key={r} label={`+ ${r}`} selected={form.rentOutTo.includes(r)} onClick={() => toggleInArray("rentOutTo", r)} />)}
                </div>
              </div>

              <div className="tmx9pf-grid">
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Expected Rent (₹) *</label>
                  <input type="number" min="0" value={form.expectedRent} onChange={(e) => setField("expectedRent", e.target.value)} className={`tmx9pf-input ${errors.expectedRent ? "tmx9pf-input--error" : ""}`} />
                  {renderError("expectedRent")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Price in words</label>
                  <input value={form.priceInWords} onChange={(e) => setField("priceInWords", e.target.value)} className="tmx9pf-input" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
                <label className="tmx9pf-amenity"><input type="checkbox" checked={form.electricityWaterExcluded} onChange={(e) => setField("electricityWaterExcluded", e.target.checked)} /> <span>Electricity &amp; Water charges excluded</span></label>
                <label className="tmx9pf-amenity"><input type="checkbox" checked={form.priceNegotiable} onChange={(e) => setField("priceNegotiable", e.target.checked)} /> <span>Price Negotiable</span></label>
              </div>

              <div className="tmx9pf-field full" style={{ marginTop: 16 }}>
                <label className="tmx9pf-label">Are you ok with brokers contacting you?</label>
                <div className="bnb-chips-row">
                  <Chip label="Yes" selected={form.okBrokersContact === "Yes"} onClick={() => setField("okBrokersContact", "Yes")} />
                  <Chip label="No" selected={form.okBrokersContact === "No"} onClick={() => setField("okBrokersContact", "No")} />
                </div>
              </div>
            </section>
          )}

          {/* STEP 3 — Photos & Video */}
          {step === 3 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Add photos &amp; video of your property</h2>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16, marginTop: -8 }}>A video is worth a thousand pictures. Properties with videos get higher page views.</p>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">YouTube Link (optional)</label>
                <input value={form.youtubeLink} onChange={(e) => setField("youtubeLink", e.target.value)} className="tmx9pf-input" placeholder="Paste youtube link of your video" />
              </div>

              {existingPhotos.length > 0 && (
                <>
                  <label className="tmx9pf-label">Current Photos</label>
                  <div className="tmx9pf-photo-previews">
                    {existingPhotos.map((url, i) => (
                      <div key={`existing-${i}`} className="tmx9pf-photo-thumb">
                        <img src={url} alt={`Existing ${i + 1}`} />
                        <div className="tmx9pf-photo-actions">
                          <button type="button" onClick={() => setCoverIndex(i)} className={`tmx9pf-small-btn ${coverIndex === i ? "tmx9pf-small-btn--active" : ""}`}>Cover</button>
                          <button type="button" onClick={() => setExistingPhotos((prev) => prev.filter((_, idx) => idx !== i))} className="tmx9pf-small-btn">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <label className="tmx9pf-label">{existingPhotos.length > 0 ? "Add More Photos" : "Photos — minimum 5 *"}</label>
              <input type="file" accept="image/*" multiple onChange={handlePhotos} className={`tmx9pf-file ${errors.photos ? "tmx9pf-file--error" : ""}`} />
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
                        <button type="button" onClick={() => photoPreviews.remove(i)} className="tmx9pf-small-btn">Remove</button>
                      </div>
                      <select className="tmx9pf-select" style={{ marginTop: 4, fontSize: 12 }} value={p.tag} onChange={(e) => photoPreviews.setTag(i, e.target.value)}>
                        <option value="">Tag photo</option>
                        <option>Bedroom</option><option>Hall</option><option>Kitchen</option>
                        <option>Balcony</option><option>Bathroom</option><option>Floor Plan</option>
                      </select>
                    </div>
                  );
                })}
              </div>

              <div className="tmx9pf-field full" style={{ marginTop: 16 }}>
                <label className="tmx9pf-label">What makes your property unique *</label>
                <textarea rows={4} maxLength={5000} value={form.description} onChange={(e) => setField("description", e.target.value)} className={`tmx9pf-input ${errors.description ? "tmx9pf-input--error" : ""}`} placeholder="Share some details about your property like spacious rooms, well maintained facilities.." />
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3, textAlign: "right" }}>{form.description.length}/5000</div>
                {renderError("description")}
              </div>

              <div className="tmx9pf-field">
                <label className="tmx9pf-label">Add Email (Optional)</label>
                <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className="tmx9pf-input" />
              </div>
            </section>
          )}

          {/* STEP 4 — Other Details */}
          {step === 4 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Add Other Details</h2>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Security deposit (Optional)</label>
                <div className="bnb-chips-row">
                  {["Fixed", "Multiple of Rent", "None"].map((t) => <Chip key={t} label={t} selected={form.securityDepositType === t} onClick={() => setField("securityDepositType", t)} />)}
                </div>
                {form.securityDepositType === "Multiple of Rent" && (
                  <input type="number" min="1" max="30" value={form.securityDepositMonths} onChange={(e) => setField("securityDepositMonths", e.target.value)} className="tmx9pf-input" placeholder="No. of months (Max 30)" style={{ marginTop: 10, maxWidth: 260 }} />
                )}
                {form.securityDepositType === "Fixed" && (
                  <input type="number" min="0" value={form.securityDepositAmount} onChange={(e) => setField("securityDepositAmount", e.target.value)} className="tmx9pf-input" placeholder="₹ Security deposit amount" style={{ marginTop: 10, maxWidth: 260 }} />
                )}
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Other rooms (Optional)</label>
                <div className="bnb-chips-row">
                  {OTHER_ROOMS.map((r) => <Chip key={r} label={`+ ${r}`} selected={form.otherRooms.includes(r)} onClick={() => toggleInArray("otherRooms", r)} />)}
                </div>
              </div>

              <div className="bnb-stepper-list">
                <div className="bnb-stepper-row">
                  <span className="bnb-stepper-label">Covered Parking</span>
                  <Stepper value={form.coveredParking} onChange={(v) => setField("coveredParking", v)} />
                </div>
                <div className="bnb-stepper-row">
                  <span className="bnb-stepper-label">Open Parking</span>
                  <Stepper value={form.openParking} onChange={(v) => setField("openParking", v)} />
                </div>
              </div>
            </section>
          )}

          {/* STEP 5 — Amenities */}
          {step === 5 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Add amenities/unique features</h2>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16, marginTop: -8 }}>These fields are used to populate USP &amp; caption. All fields on this page are optional.</p>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Property Features</label>
                <div className="bnb-chips-row">
                  {PROPERTY_FEATURES.map((f) => <Chip key={f} label={`+ ${f}`} selected={form.propertyFeatures.includes(f)} onClick={() => toggleInArray("propertyFeatures", f)} />)}
                </div>
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Amenities</label>
                <div className="bnb-chips-row">
                  {AMENITIES_LIST.map((a) => <Chip key={a} label={`+ ${a}`} selected={form.amenities.includes(a)} onClick={() => toggleInArray("amenities", a)} />)}
                </div>
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">No. of open sides</label>
                <div className="bnb-chips-row">
                  {["1", "2", "3", "3+"].map((n) => <Chip key={n} label={n} selected={form.openSides === n} onClick={() => setField("openSides", n)} />)}
                </div>
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Power Back up</label>
                <div className="bnb-chips-row">
                  {["None", "Partial", "Full"].map((p) => <Chip key={p} label={p} selected={form.powerBackup === p} onClick={() => setField("powerBackup", p)} />)}
                </div>
              </div>

              <div className="tmx9pf-field full">
                <label className="tmx9pf-label">Property facing</label>
                <div className="bnb-chips-row">
                  {FACING_OPTIONS.map((f) => <Chip key={f} label={f} selected={form.facing === f} onClick={() => setField("facing", f)} />)}
                </div>
              </div>

              <div className="tmx9pf-grid">
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Type of flooring</label>
                  <select className="tmx9pf-select" value={form.flooringType} onChange={(e) => setField("flooringType", e.target.value)}>
                    <option value="">Select</option>
                    {FLOORING_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Width of facing road</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" min="0" value={form.facingRoadWidth} onChange={(e) => setField("facingRoadWidth", e.target.value)} className="tmx9pf-input" style={{ flex: 2 }} />
                    <select className="tmx9pf-select" value={form.facingRoadUnit} onChange={(e) => setField("facingRoadUnit", e.target.value)} style={{ flex: 1 }}>
                      <option>Feet</option><option>Meter</option>
                    </select>
                  </div>
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
            <button type="button" onClick={handleSubmit} className="tmx9pf-nav-btn tmx9pf-nav-next" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}>
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Save and Submit"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApartmentVillaListingForm;
