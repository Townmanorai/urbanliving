import React, { useState, useContext, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MapPin } from "lucide-react";
import "./tmx9pf-form.css";
import "./hotel-listing-form.css";
import { AuthContext } from "../Login/AuthContext";
import CityDropdown from "./CityDropdown";
import { useStepBackNav } from "../../utils/useStepBackNav";
import { compressImage } from "../../utils/compressImage";

const API_BASE = "https://www.townmanor.ai/api";
const STORAGE_KEY = "user";

/* ── Reference data (per product spec) ─────────────────────────────────── */

const HOTEL_TYPES = [
  { id: "Hotel", desc: "A hotel is a commercial establishment providing lodging with various amenities like dining, room service, and sometimes conference facilities." },
  { id: "Resort", desc: "A resort is a self-contained property offering luxurious lodging and extensive amenities, such as pools, spas, dining, and recreation." },
  { id: "Lodge", desc: "A lodge is a type of accommodation typically located in natural or remote settings, offering rustic or comfortable lodging." },
  { id: "Guest House", desc: "A guest house is a small, often privately-owned accommodation offering cozy, home-like lodging with personalized service." },
  { id: "Palace", desc: "A palace, when used as accommodation, is a luxurious property, often a converted royal residence, offering opulent rooms and grand architecture." },
  { id: "Houseboat", desc: "Accommodation on a floating structure that has bedrooms, a living room, a kitchen, and often a terrace or deck." },
  { id: "Motel", desc: "A motel is a budget-friendly accommodation typically located along highways, offering easy access and parking near guest rooms." },
];

const ROOM_TYPES = ["Apartment", "Bungalow", "Chalet", "Common", "Cottage", "Deluxe", "Dorm room", "Family", "For Honeymooners", "Luxury", "Master", "Other", "Standard", "Studio", "Suite", "Tent", "Villa"];

const ROOM_VIEWS = ["No View", "Airport View", "Backwater View", "Bay View", "Beach View", "City View", "Countryside View", "Courtyard View", "Desert View", "Forest View", "Garden View", "Golf Course View", "Harbor View", "Hill View", "Inter-coastal View", "Jungle View", "Lagoon View", "Lake View", "Landmark View", "Marina View", "Monument View", "Mountain View", "Ocean View", "Palace View", "Park View", "Pool View", "Resort View", "River View", "Sea View", "Temple View", "Terrace View", "Valley View"];

const BED_TYPES = [
  { id: "King Bed", size: ">6 feet by 6 feet" },
  { id: "Queen Bed", size: "6 feet by 6 feet" },
  { id: "Double Bed", size: "5 feet by 6 feet" },
  { id: "Single Bed", size: "3 feet by 6 feet" },
  { id: "Bunk Bed", size: "Variable Size" },
];

const MEAL_PLANS = [
  { value: "room_only", label: "Room Only" },
  { value: "breakfast_included", label: "Breakfast Only" },
  { value: "breakfast_dinner_included", label: "Breakfast & Dinner" },
  { value: "all_meals_included", label: "All Meals Included" },
];

const CANCELLATION_POLICIES = [
  { value: "free_till_checkin", label: "Free Cancellation till check-in", tag: "Recommended" },
  { value: "free_24h", label: "Free Cancellation till 24 hours before check-in" },
  { value: "free_48h", label: "Free Cancellation till 48 hours before check-in" },
  { value: "free_72h", label: "Free Cancellation till 72 hours before check-in" },
  { value: "non_refundable", label: "Non-Refundable" },
];

const ID_PROOFS = ["Aadhaar", "Passport", "Voter ID", "Driving License", "PAN Card"];

// NOTE: "Outdoor Sports & Activities" (backend total: 28) and "Kitchen and Appliances"
// (backend total: 15) are missing a few item names — the reference screenshots had
// overlapping/cut-off text for those two categories. List is easily extendable here
// once the full names are confirmed — flagged to the team, does not block anything else.
const PROPERTY_AMENITIES = {
  "Mandatory": ["Air Conditioning", "Parking", "Room service", "Swimming Pool", "Wifi", "Reception", "Bar", "Restaurant", "Luggage assistance", "Wheelchair", "Gym/Fitness centre", "CCTV", "Airport Transfers", "Elevator/Lift", "Housekeeping", "Kitchen/Kitchenette", "Power backup", "Caretaker", "Spa", "Kids' Play Area"],
  "General Services": ["Laundry", "Newspaper", "Smoking rooms", "Lounge", "First-aid services", "Concierge", "Multilingual Staff", "Cloak Room", "Specially abled assistance", "Butler Services", "Doctor on call", "Medical centre (Within Premise)", "Pool/Beach towels"],
  "Security": ["Smoke detector", "Fire extinguishers", "Security alarms", "Security Guard", "Carbon Monoxide Detector", "Door-Eye", "Door Chain"],
  "Basic Facilities": ["LAN", "Refrigerator", "Umbrellas", "Washing Machine", "Laundromat", "EV Charging Station (Within Premise)", "Driver's Accommodation", "Grocery Purchase", "Utensil Cleaning"],
  "Outdoor Sports & Activities": ["Beach", "Golf Course/Mini Golf", "Outdoor sports", "Skiing", "Cycling", "Rock Climbing", "Zip lining", "Archery", "Tennis", "Basketball court", "Cricket", "Badminton", "Volley Ball", "High rope course", "Paintball", "Paragliding", "Camping", "Hot Air Balloon Ride", "Air Rifle Shooting"],
  "Common Area": ["Balcony/Terrace", "Garden", "Sun Deck", "Prayer Room", "Living Room", "Outdoor Furniture"],
  "Food and Drink": ["Barbeque", "Dining Area", "Kid's Menu", "Breakfast", "Food Options Available", "Indian Chef", "Cook Service"],
  "Business Center and Conferences": ["Banquet", "Business Center", "Conference room", "Photocopying", "Fax service", "Printer"],
  "Transfers": ["Pickup/Drop", "Shuttle Service", "Railway Station Transfers", "Bus Station transfers"],
  "Entertainment": ["Events", "Professional Photography", "Night Club", "Beach club", "Movie Room", "Music System"],
  "Shopping": ["Grocery/Supermarket (Within Premise)", "Souvenir shop", "Jewellery Shop"],
  "Media and technology": ["TV"],
  "Payment Services": ["ATM", "Currency Exchange"],
  "Family and kids": ["Kids' Club", "Babysitting", "Crib"],
  "Pet essentials": ["Pet bowls", "Pet baskets"],
  "Spa & Wellness": ["Massage", "Salon", "Steam and Sauna", "Jacuzzi", "Activity Centre", "Yoga", "Meditation Room", "Solarium", "Hot Spring bath (Within Premise)", "Hammam", "Ayurvedic Treatment (Within Premise)"],
  "Accessibility": ["Auditory Guidance", "Visual aids (Braille)", "Visual aids (tactile signs)", "Ramp", "Step free entrance", "Designated Accessible Parking", "Wide Pathways", "Toilet with grabrails", "Raised toilet", "Lowered sink", "Bathroom emergency cord"],
  "Water Sports & Activities": ["Kayaking", "Snorkelling", "Water sports", "Canoeing", "Water Park (Within Premise)", "Scuba Diving", "Jet skiing", "Paddle Boarding", "Pedal Boats", "Banana Boat Ride", "Fishing", "Windsurfing", "Beach Volleyball", "Laser Boat", "Glass Bottom Boat", "Parasailing", "Beach football", "Surfing", "River Rafting", "Dolphin Boat Ride", "Water Skiing", "Diving", "Motor Boat ride", "Boat Ride", "Beach Sports"],
  "Indoor Sports & Activities": ["Library", "Indoor games", "Indoor games room", "Table Tennis", "Billiards/pool table", "Board Games", "Foosball table", "Air hockey table", "Game Zone/Arcade", "Virtual Gaming/VR Zone", "Dart Board", "Bowling", "Squash"],
  "Live Shows, Music & Entertainment Activities": ["Casino", "Bonfire", "Live Music", "Cultural Programme", "Movie Screenings", "Karaoke", "Magic Shows", "Puppet Shows", "Live Art Performance", "Stand-up Comedy", "Light & Sound Show", "Rain Dance", "DJ Party", "Firework Show", "Dance Performance", "Disco Club", "Aarti Ceremony", "Drone Show"],
  "Wildlife Safari and Wildlife Exploration": ["Jungle Safari", "Wildlife Photography", "Wildlife Documentary", "Night Safari", "Forest Camping", "Dolphin Watching", "Tiger Safari", "Leopard Safari", "Lion Safari", "Elephant Safari", "Whale Watching", "Turtle Watching", "Sea Life Exploration"],
  "Rides, Safari, Excursions & Tour": ["Bicycle Ride", "Jeep Safari", "Camel Ride", "Horse Ride", "Tractor Ride", "Carriage or Cart Ride", "Cable Car Ride", "Shikara Ride", "Gondola Ride", "Desert Safari", "Walking Tours", "Boat Ride or Tour", "Pub Crawls", "Plantation Tour", "Horticulture Tour", "Cycling Trail", "Vintage Car ride", "Hill Trek"],
  "Nature Activities, Walks & Treks": ["Forest Hiking", "Riverside Trek", "Nature Walk/Hike", "Bird Watching", "Guided Night Walk", "Tea Factory Visit", "Tea Plantation Walk", "Village Walk", "Star Gazing", "Trekking"],
  "Hands-on Workshops & Interactive activities": ["Pottery Making", "Drawing & Painting Activities", "Craft Activities", "Bangle Making", "Block Painting", "Photography Class", "Heena Art", "Cocktail Making Workshop", "Environment Activities", "Astrologer Session", "Caricature Drawings"],
};

const ROOM_AMENITIES = {
  "Mandatory": ["Bathtub", "Hairdryer", "Hot & Cold Water", "Toiletries", "Towels", "TV", "Balcony", "Private Pool", "Air Conditioning", "Iron/Ironing Board", "Mineral Water", "Kettle", "Wifi", "Safe", "Bathroom", "Peep Hole"],
  "Popular with Guests": ["Interconnected Room", "Heater", "Housekeeping", "In Room dining", "Laundry Service", "Room service", "Smoking Room", "Study Room", "Air Purifier"],
  "Bathroom": ["Bathroom Phone", "Bubble Bath", "Dental Kit", "Geyser/Water heater", "Slippers", "Shower Cap", "Hammam", "Bathrobes", "Western Toilet Seat", "Shower cubicle", "Weighing Scale", "Shaving Mirror", "Sewing kit", "Bidet", "Toilet with grab rails", "Ensuite Bathroom/Common Bay", "Jetspray", "Open Air Shower"],
  "Room Features": ["Closet", "Blackout curtains", "Center Table", "Charging points", "Couch", "Dining Table", "Fireplace", "Mini Fridge", "Sofa", "Telephone", "Work Desk", "Pillow menu", "Hypoallergenic Bedding", "Living Area", "Dining Area", "Seating Area", "Chair", "Fireplace Guards", "Open air bath", "Jaccuzi", "Hot Water Bag", "Full-length Mirror", "Private Garden", "Private Beach"],
  "Media and Entertainment": ["Smart Controls", "Sound Speakers", "Smartphone"],
  "Food and Drinks": ["Cake", "Fruit Basket", "Mini Bar", "BBQ Grill", "Cook Service", "Champagne", "Sparkling Wine"],
  "Kitchen and Appliances": ["Dishwasher", "Induction", "Kitchenette", "Refrigerator", "Washing machine", "Cook/Chef", "Cooking Basics", "Coffee Machine", "Stove/Induction", "Dishes and Silverware", "Toaster", "Microwave"],
  "Beds and Blanket": ["Blanket"],
  "Safety and Security": ["Cupboards with locks"],
  "Childcare": ["Child safety socket covers"],
  "Other Facilities": ["Mosquito Net", "Newspaper", "Jacuzzi", "Terrace", "Fan", "Butler Service"],
};

const ROOM_AMENITY_SUBOPTIONS = {
  "Air Conditioning": { type: "select", options: ["Centralized", "Room controlled", "Temperature will be fixed as per Govt. Norms", "Window AC", "Split AC"] },
  "Mineral Water": { type: "select", options: ["Free", "Paid"] },
  "Wifi": { type: "select", options: ["Free", "Paid"] },
  "Safe": { type: "select", options: ["Electronic", "Manual"] },
  "Bathroom": { type: "multiselect", options: ["Shared", "Attached"] },
};

const STEPS = [
  { id: 0, title: "Basic Info" },
  { id: 1, title: "Location" },
  { id: 2, title: "Amenities" },
  { id: 3, title: "Rooms" },
  { id: 4, title: "Photos" },
  { id: 5, title: "Policies" },
];

function newRoomDraft() {
  return {
    roomType: "", roomView: "No View", areaValue: "", areaUnit: "sqft", roomName: "", numberOfRooms: 1, description: "",
    bedArrangement: [{ id: 0, bedType: "King Bed", count: 1 }],
    extraBedAllowed: false,
    hasAlternateArrangement: false,
    alternateBedArrangement: [],
    occupancy: { baseAdults: 2, maxAdults: 2, baseChildren: 0, maxChildren: 0, maxOccupancy: 2 },
    bathroomCount: 1,
    mealPlan: MEAL_PLANS[0].value,
    baseRate4Adults: "", extraAdultCharge: "", paidChildCharge: "",
    inventory: { start: "", end: "" },
    amenities: {},
  };
}

/* ── Small reusable pieces ──────────────────────────────────────────────── */

const Stepper = ({ value, onChange, min = 0, max = 50 }) => (
  <div className="bnb-stepper-controls">
    <button type="button" className="bnb-stepper-btn" disabled={Number(value) <= min}
      onClick={() => onChange(Math.max(min, Number(value) - 1))}>−</button>
    <span className="bnb-stepper-val">{value}</span>
    <button type="button" className="bnb-stepper-btn" disabled={Number(value) >= max}
      onClick={() => onChange(Math.min(max, Number(value) + 1))}>+</button>
  </div>
);

const YesNo = ({ label, value, onChange, children }) => (
  <div>
    <div className="hlf-yesno-row">
      <span className="hlf-yesno-label">{label}</span>
      <span className="hlf-yesno-options">
        <label><input type="radio" checked={value === false || value === undefined} onChange={() => onChange(false)} /> No</label>
        <label><input type="radio" checked={value === true} onChange={() => onChange(true)} /> Yes</label>
      </span>
    </div>
    {value === true && children && <div className="hlf-yesno-suboption">{children}</div>}
  </div>
);

const Accordion = ({ title, count, total, open, onToggle, children }) => (
  <div className="hlf-accordion">
    <div className="hlf-accordion-head" onClick={onToggle}>
      <span>{title}{total != null && <span className="hlf-accordion-count">({count} of {total})</span>}</span>
      <span>{open ? "−" : "+"}</span>
    </div>
    {open && <div className="hlf-accordion-body">{children}</div>}
  </div>
);

function useFilePreviews() {
  const [previews, setPreviews] = useState([]);
  const update = (files) => {
    const arr = Array.from(files || []);
    const readers = arr.map((file) => new Promise((res) => {
      const r = new FileReader();
      r.onload = (e) => res({ name: file.name, url: e.target.result, file });
      r.readAsDataURL(file);
    }));
    Promise.all(readers).then((newResults) => {
      setPreviews((prev) => [...prev, ...newResults].slice(0, 40));
    });
  };
  const remove = (index) => setPreviews((prev) => prev.filter((_, i) => i !== index));
  const clear = () => setPreviews([]);
  return { previews, update, remove, clear };
}

/* ── Main component ─────────────────────────────────────────────────────── */

const HotelListingForm = ({ propId: passedId, onComplete } = {}) => {
  const { user } = useContext(AuthContext);
  const { id: paramId } = useParams();
  const editId = passedId || paramId;
  const isEditMode = !!editId;

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(isEditMode);
  const [existingPhotos, setExistingPhotos] = useState([]); // URLs already saved on the hotel

  const [form, setForm] = useState(getInitialForm());
  function getInitialForm() {
    return {
    hotel_type: "",
    property_name: "",
    description: "",

    address: "", building_no: "", locality: "", pincode: "", country: "India", state: "", city: "",
    latitude: "", longitude: "", addressConfirmed: false,

    amenities: {},

    rooms: [],

    check_in_time: "14:00",
    check_out_time: "11:00",
    cancellation_policy: "free_till_checkin",

    guest_profile: { unmarried_couples: false, guests_below_18: false, male_only_groups: false },
    acceptable_id_proofs: [],
    ids_same_city_allowed: false,
    restrictions: { smoking_allowed: false, private_parties_allowed: false, wheelchair_accessible: false, outside_visitors_allowed: false },
    pet_policy: { pets_on_property: false, pets_allowed_for_guests: false },
    checkin_policy: { is_24_hour: false },
    infant_policy: { excluded_from_occupancy: false, complimentary_food: false },
    extra_bed_inclusion: false,
    extra_bed_policy: { for_adults: "no", for_kids: "no" },
    custom_policy: "",
    meal_rack_prices: { breakfast: "", lunch: "", dinner: "" },
    };
  }

  const [roomDraft, setRoomDraft] = useState(null); // null = editor closed
  const [openPropCats, setOpenPropCats] = useState(new Set());
  const [openRoomCats, setOpenRoomCats] = useState(new Set());

  const photoPreviews = useFilePreviews();
  const [coverIndex, setCoverIndex] = useState(0);

  /* ── Edit mode: load existing hotel and prefill the form ── */
  useEffect(() => {
    if (!isEditMode) return;
    let cancelled = false;
    (async () => {
      setIsLoadingEdit(true);
      try {
        const res = await fetch(`${API_BASE}/ovika/hotels/${editId}`);
        const json = await res.json().catch(() => null);
        const data = json?.data || json;
        if (!data || cancelled) return;

        setForm((f) => ({
          ...f,
          hotel_type: data.hotel_type || "",
          property_name: data.property_name || "",
          description: data.description || "",
          address: data.address || "",
          building_no: data.building_no || "",
          locality: data.locality || "",
          pincode: data.pincode || "",
          country: data.country || "India",
          state: data.state || "",
          city: data.city || "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
          addressConfirmed: true, // already confirmed when originally created
          amenities: Object.fromEntries((data.amenities || []).map((a) => [a, true])),
          rooms: Array.isArray(data.rooms) ? data.rooms.map((r) => ({
            roomType: r.roomType || "",
            roomView: r.roomView || "No View",
            areaValue: r.areaValue ?? "",
            areaUnit: r.areaUnit || "sqft",
            roomName: r.roomName || "",
            numberOfRooms: r.numberOfRooms ?? 1,
            description: r.description || "",
            bedArrangement: Array.isArray(r.bedArrangement) && r.bedArrangement.length
              ? r.bedArrangement.map((b, i) => ({ id: i, bedType: b.bedType, count: b.count }))
              : [{ id: 0, bedType: "King Bed", count: 1 }],
            extraBedAllowed: !!r.extraBedAllowed,
            hasAlternateArrangement: !!r.hasAlternateArrangement,
            alternateBedArrangement: r.alternateBedArrangement || [],
            occupancy: {
              baseAdults: r.occupancy?.baseAdults ?? 2,
              maxAdults: r.occupancy?.maxAdults ?? 2,
              baseChildren: r.occupancy?.baseChildren ?? 0,
              maxChildren: r.occupancy?.maxChildren ?? 0,
              maxOccupancy: r.occupancy?.maxOccupancy ?? 2,
            },
            bathroomCount: r.bathroomCount ?? 1,
            mealPlan: r.mealPlan || MEAL_PLANS[0].value,
            baseRate4Adults: r.baseRate4Adults ?? "",
            extraAdultCharge: r.extraAdultCharge ?? "",
            paidChildCharge: r.paidChildCharge ?? "",
            inventory: { start: r.inventory?.start || "", end: r.inventory?.end || "" },
            amenities: r.amenities || {},
          })) : [],
          check_in_time: data.check_in_time || f.check_in_time,
          check_out_time: data.check_out_time || f.check_out_time,
          cancellation_policy: data.cancellation_policy || f.cancellation_policy,
          guest_profile: { ...f.guest_profile, ...(data.guest_profile || {}) },
          acceptable_id_proofs: data.acceptable_id_proofs || [],
          ids_same_city_allowed: !!data.ids_same_city_allowed,
          restrictions: { ...f.restrictions, ...(data.restrictions || {}) },
          pet_policy: { ...f.pet_policy, ...(data.pet_policy || {}) },
          checkin_policy: { ...f.checkin_policy, ...(data.checkin_policy || {}) },
          infant_policy: { ...f.infant_policy, ...(data.infant_policy || {}) },
          extra_bed_inclusion: !!data.extra_bed_inclusion,
          extra_bed_policy: { ...f.extra_bed_policy, ...(data.extra_bed_policy || {}) },
          custom_policy: data.custom_policy || "",
          meal_rack_prices: { ...f.meal_rack_prices, ...(data.meal_rack_prices || {}) },
        }));

        setExistingPhotos(Array.isArray(data.photos) ? data.photos.filter(Boolean) : []);
        setCoverIndex(Number(data.cover_photo_index) || 0);
      } catch (err) {
        console.error("Failed to load hotel for edit:", err);
        alert("Failed to load hotel data for editing.");
      } finally {
        if (!cancelled) setIsLoadingEdit(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editId, isEditMode]);

  /* ── Address autocomplete (Nominatim) — same pattern as PGListingForm ── */
  const [addrSuggestions, setAddrSuggestions] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [showAddrDrop, setShowAddrDrop] = useState(false);
  const addrTimer = useRef(null);
  const addrWrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (addrWrapRef.current && !addrWrapRef.current.contains(e.target)) setShowAddrDrop(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAddressInput = (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, address: val }));
    if (addrTimer.current) clearTimeout(addrTimer.current);
    if (val.trim().length < 3) { setAddrSuggestions([]); setShowAddrDrop(false); return; }
    setAddrLoading(true);
    addrTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&addressdetails=1&namedetails=1&limit=8&countrycodes=in&dedupe=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setAddrSuggestions(data);
        setShowAddrDrop(data.length > 0);
      } catch (_) { /* ignore address lookup failures */ }
      setAddrLoading(false);
    }, 280);
  };

  const selectAddrSuggestion = (item) => {
    const a = item.address || {};
    const city = a.city || a.town || a.village || a.county || a.state_district || "";
    const localParts = [a.house_number, a.road || a.pedestrian || a.footway, a.suburb || a.neighbourhood || a.quarter].filter(Boolean);
    const fullAddr = localParts.length >= 1 ? localParts.join(", ") : item.display_name.split(",").slice(0, 3).join(",").trim();
    setForm((f) => ({
      ...f,
      address: fullAddr,
      locality: a.suburb || a.neighbourhood || f.locality,
      city: city || f.city,
      state: a.state || f.state,
      pincode: a.postcode || f.pincode,
      latitude: item.lat || f.latitude,
      longitude: item.lon || f.longitude,
    }));
    setAddrSuggestions([]);
    setShowAddrDrop(false);
  };

  /* ── generic setters ── */
  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const setNested = (group, key, value) => setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }));
  const toggleAmenity = (name, value) => setForm((f) => ({ ...f, amenities: { ...f.amenities, [name]: value } }));
  const togglePropCat = (cat) => setOpenPropCats((prev) => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n; });
  const toggleRoomCat = (cat) => setOpenRoomCats((prev) => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n; });

  /* ── room draft handlers ── */
  const openNewRoom = () => { setRoomDraft(newRoomDraft()); setOpenRoomCats(new Set()); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); };
  const editRoom = (idx) => { setRoomDraft({ ...form.rooms[idx], _editIndex: idx }); setOpenRoomCats(new Set()); };
  const cancelRoomEdit = () => setRoomDraft(null);
  const removeRoom = (idx) => setForm((f) => ({ ...f, rooms: f.rooms.filter((_, i) => i !== idx) }));

  const setRoomField = (name, value) => setRoomDraft((d) => ({ ...d, [name]: value }));
  const setRoomNested = (group, key, value) => setRoomDraft((d) => ({ ...d, [group]: { ...d[group], [key]: value } }));
  const setRoomAmenity = (name, enabled, subOption) => setRoomDraft((d) => ({
    ...d,
    amenities: { ...d.amenities, [name]: { enabled, subOption: subOption !== undefined ? subOption : d.amenities[name]?.subOption } },
  }));

  const addBedRow = () => setRoomDraft((d) => ({ ...d, bedArrangement: [...d.bedArrangement, { id: Date.now(), bedType: "King Bed", count: 1 }] }));
  const updateBedRow = (i, key, val) => setRoomDraft((d) => { const rows = [...d.bedArrangement]; rows[i] = { ...rows[i], [key]: val }; return { ...d, bedArrangement: rows }; });
  const removeBedRow = (i) => setRoomDraft((d) => ({ ...d, bedArrangement: d.bedArrangement.filter((_, idx) => idx !== i) }));

  const saveRoom = () => {
    const newErrors = {};
    if (!roomDraft.roomType) newErrors.roomType = "Room type is required";
    if (!roomDraft.numberOfRooms || Number(roomDraft.numberOfRooms) < 1) newErrors.numberOfRooms = "At least 1 room is required";
    if (!roomDraft.baseRate4Adults || Number(roomDraft.baseRate4Adults) <= 0) newErrors.baseRate4Adults = "Base rate must be positive";
    if (!roomDraft.bedArrangement.length || roomDraft.bedArrangement.some((b) => !b.bedType)) newErrors.bedArrangement = "Select at least one bed type";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setForm((f) => {
      const rooms = [...f.rooms];
      const { _editIndex, ...clean } = roomDraft;
      if (_editIndex !== undefined) rooms[_editIndex] = clean;
      else rooms.push(clean);
      return { ...f, rooms };
    });
    setRoomDraft(null);
    setErrors({});
  };

  /* ── photos ── */
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) { photoPreviews.update(files); setErrors((p) => ({ ...p, photos: undefined })); }
  };

  /* ── step validation ── */
  const validateForStep = (s) => {
    const newErrors = {};
    if (s === 0) {
      if (!form.hotel_type) newErrors.hotel_type = "Select a hotel type";
      if (!form.property_name?.trim()) newErrors.property_name = "Hotel name is required";
      if (!form.description?.trim()) newErrors.description = "Description is required";
    }
    if (s === 1) {
      if (!form.address?.trim()) newErrors.address = "Address is required";
      if (!form.locality?.trim()) newErrors.locality = "Locality is required";
      if (!form.pincode?.trim()) newErrors.pincode = "Pincode is required";
      if (!form.state?.trim()) newErrors.state = "State is required";
      if (!form.city?.trim()) newErrors.city = "City is required";
      if (!form.addressConfirmed) newErrors.addressConfirmed = "Please confirm the address matches your registration/lease document";
      if (form.latitude === "" || form.latitude === null || form.latitude === undefined) newErrors.latitude = "Please pick an address from the search suggestions so we can capture the map location";
      if (form.longitude === "" || form.longitude === null || form.longitude === undefined) newErrors.longitude = "Please pick an address from the search suggestions so we can capture the map location";
    }
    if (s === 3) {
      if (form.rooms.length === 0) newErrors.rooms = "Add at least one room type";
    }
    if (s === 4) {
      if (existingPhotos.length + photoPreviews.previews.length < 5) newErrors.photos = "At least 5 photos are required";
    }
    if (s === 5) {
      if (!form.check_in_time) newErrors.check_in_time = "Check-in time is required";
      if (!form.check_out_time) newErrors.check_out_time = "Check-out time is required";
      if (!form.cancellation_policy) newErrors.cancellation_policy = "Select a cancellation policy";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderError = (field) => (errors[field] ? <span className="tmx9pf-error">{errors[field]}</span> : null);

  const goNext = () => {
    if (validateForStep(step)) { setStep((s) => Math.min(s + 1, STEPS.length - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const goPrev = () => { setStep((s) => Math.max(s - 1, 0)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  useStepBackNav(step, goPrev);

  /* ── owner id resolution (same pattern as Tmx9PropertyForm) ── */
  function extractIdFromObj(obj) { return obj ? (obj.id || obj._id || obj.owner_id || obj.userId || obj.uid || null) : null; }
  async function fetchServerUser() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { method: "GET", credentials: "include" });
      const d = await res.json().catch(() => ({}));
      return d?.user || d?.data || d;
    } catch { return null; }
  }
  const resolveOwnerId = async () => {
    const fromContext = extractIdFromObj(user);
    if (fromContext) return fromContext;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { const fromLocal = extractIdFromObj(JSON.parse(raw)); if (fromLocal) return fromLocal; }
    } catch { /* ignore malformed localStorage user */ }
    return extractIdFromObj(await fetchServerUser());
  };

  /* ── submit ── */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const ownerId = await resolveOwnerId();
    if (!ownerId) { alert("Owner not found. Please sign in again."); setIsSubmitting(false); return; }

    for (let i = 0; i < STEPS.length; i++) {
      if (!validateForStep(i)) { setIsSubmitting(false); setStep(i); return; }
    }

    try {
      const roomsPayload = form.rooms.map((r) => ({
        roomType: r.roomType,
        roomView: r.roomView,
        areaValue: Number(r.areaValue) || 0,
        areaUnit: r.areaUnit,
        roomName: r.roomName,
        numberOfRooms: Number(r.numberOfRooms) || 0,
        description: r.description || "",
        bedArrangement: r.bedArrangement.map((b) => ({ bedType: b.bedType, count: Number(b.count) || 0 })),
        extraBedAllowed: !!r.extraBedAllowed,
        hasAlternateArrangement: !!r.hasAlternateArrangement,
        alternateBedArrangement: (r.alternateBedArrangement || []).map((b) => ({ bedType: b.bedType, count: Number(b.count) || 0 })),
        occupancy: {
          baseAdults: Number(r.occupancy.baseAdults) || 0,
          maxAdults: Number(r.occupancy.maxAdults) || 0,
          baseChildren: Number(r.occupancy.baseChildren) || 0,
          maxChildren: Number(r.occupancy.maxChildren) || 0,
          maxOccupancy: Number(r.occupancy.maxOccupancy) || 0,
        },
        bathroomCount: Number(r.bathroomCount) || 0,
        mealPlan: r.mealPlan,
        baseRate4Adults: Number(r.baseRate4Adults) || 0,
        extraAdultCharge: Number(r.extraAdultCharge) || 0,
        paidChildCharge: Number(r.paidChildCharge) || 0,
        inventory: { start: r.inventory.start, end: r.inventory.end },
        amenities: Object.fromEntries(
          Object.entries(r.amenities).filter(([, v]) => v?.enabled).map(([k, v]) => [k, { enabled: true, subOption: v.subOption }])
        ),
      }));
      const enabledAmenities = Object.keys(form.amenities).filter((k) => form.amenities[k]);
      const mealRackPrices = {
        breakfast: Number(form.meal_rack_prices.breakfast) || 0,
        lunch: Number(form.meal_rack_prices.lunch) || 0,
        dinner: Number(form.meal_rack_prices.dinner) || 0,
      };

      if (isEditMode) {
        // ── EDIT MODE: upload any new photos separately, then PUT full JSON payload ──
        let uploadedUrls = [];
        const newPhotoEntries = photoPreviews.previews.filter((p) => p?.file);
        if (newPhotoEntries.length > 0) {
          try {
            const compressedPhotos = await Promise.all(newPhotoEntries.map((p) => compressImage(p.file)));
            const uploadFd = new FormData();
            compressedPhotos.forEach((f, i) => uploadFd.append("images", f, newPhotoEntries[i].name || `photo-${i}`));
            const uploadRes = await fetch(`${API_BASE}/image/aws-upload-owner-images`, { method: "POST", body: uploadFd });
            const uploadData = await uploadRes.json().catch(() => null);
            if (uploadRes.ok && Array.isArray(uploadData?.fileUrls)) uploadedUrls = uploadData.fileUrls;
          } catch (err) {
            console.warn("New photo upload failed, continuing without them:", err);
            alert("Could not upload the new photos. The update will proceed without them.");
          }
        }
        const finalPhotos = [...existingPhotos, ...uploadedUrls];

        const putPayload = {
          hotel_type: form.hotel_type,
          property_name: form.property_name,
          description: form.description,
          address: form.address,
          building_no: form.building_no || "",
          locality: form.locality,
          pincode: form.pincode,
          country: form.country || "India",
          state: form.state,
          city: form.city,
          latitude: form.latitude || "",
          longitude: form.longitude || "",
          amenities: enabledAmenities,
          rooms: roomsPayload,
          photos: finalPhotos,
          cover_photo_index: coverIndex,
          check_in_time: form.check_in_time,
          check_out_time: form.check_out_time,
          cancellation_policy: form.cancellation_policy,
          guest_profile: form.guest_profile,
          acceptable_id_proofs: form.acceptable_id_proofs,
          ids_same_city_allowed: !!form.ids_same_city_allowed,
          restrictions: form.restrictions,
          pet_policy: form.pet_policy,
          checkin_policy: form.checkin_policy,
          infant_policy: form.infant_policy,
          extra_bed_inclusion: !!form.extra_bed_inclusion,
          extra_bed_policy: form.extra_bed_policy,
          custom_policy: form.custom_policy || "",
          meal_rack_prices: mealRackPrices,
        };

        const putRes = await fetch(`${API_BASE}/ovika/hotels/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(putPayload),
        });
        const putData = await putRes.json().catch(() => ({ success: false, message: "Invalid JSON response" }));
        if (!putRes.ok || !putData.success) {
          console.error("Hotel update API error", putRes.status, putData);
          const fieldErrors = putData.errors ? "\n\n" + Object.entries(putData.errors).map(([k, v]) => `• ${k}: ${v}`).join("\n") : "";
          alert(`Failed to update hotel listing (${putRes.status}): ${putData.message || "Unknown error"}${fieldErrors}`);
          setIsSubmitting(false);
          return;
        }
        alert("Hotel listing updated successfully!");
        if (onComplete) {
          onComplete();
        } else {
          setStep(0);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        setIsSubmitting(false);
        return;
      }

      // ── CREATE MODE ──
      const fd = new FormData();
      fd.append("owner_id", String(ownerId));
      fd.append("hotel_type", form.hotel_type);
      fd.append("property_name", form.property_name);
      fd.append("description", form.description);
      fd.append("address", form.address);
      fd.append("building_no", form.building_no || "");
      fd.append("locality", form.locality);
      fd.append("pincode", form.pincode);
      fd.append("country", form.country || "India");
      fd.append("state", form.state);
      fd.append("city", form.city);
      fd.append("latitude", String(form.latitude || ""));
      fd.append("longitude", String(form.longitude || ""));
      fd.append("amenities", JSON.stringify(enabledAmenities));
      fd.append("rooms", JSON.stringify(roomsPayload));

      const photoFiles = photoPreviews.previews.filter((p) => p?.file);
      const compressed = await Promise.all(photoFiles.map((p) => compressImage(p.file)));
      compressed.forEach((f, i) => fd.append("photos", f, photoFiles[i].name || `photo-${i}`));
      fd.append("cover_photo_index", String(coverIndex));

      fd.append("check_in_time", form.check_in_time);
      fd.append("check_out_time", form.check_out_time);
      fd.append("cancellation_policy", form.cancellation_policy);
      fd.append("guest_profile", JSON.stringify(form.guest_profile));
      fd.append("acceptable_id_proofs", JSON.stringify(form.acceptable_id_proofs));
      fd.append("ids_same_city_allowed", String(!!form.ids_same_city_allowed));
      fd.append("restrictions", JSON.stringify(form.restrictions));
      fd.append("pet_policy", JSON.stringify(form.pet_policy));
      fd.append("checkin_policy", JSON.stringify(form.checkin_policy));
      fd.append("infant_policy", JSON.stringify(form.infant_policy));
      fd.append("extra_bed_inclusion", String(!!form.extra_bed_inclusion));
      fd.append("extra_bed_policy", JSON.stringify(form.extra_bed_policy));
      fd.append("custom_policy", form.custom_policy || "");
      fd.append("meal_rack_prices", JSON.stringify(mealRackPrices));
      fd.append("meta", JSON.stringify({ ...form, rooms: roomsPayload }));

      const response = await fetch(`${API_BASE}/ovika/hotels/upload`, { method: "POST", body: fd, credentials: "include" });
      const data = await response.json().catch(() => ({ success: false, message: "Invalid JSON response" }));
      if (!response.ok || !data.success) {
        console.error("Hotel create API error", data);
        const fieldErrors = data.errors ? "\n\n" + Object.entries(data.errors).map(([k, v]) => `• ${k}: ${v}`).join("\n") : "";
        alert((data.message || "Failed to create hotel listing") + fieldErrors);
        setIsSubmitting(false);
        return;
      }
      alert("Hotel listing created successfully! ID: " + (data.data?.id ?? "unknown"));
      setForm(getInitialForm());
      setExistingPhotos([]);
      setCoverIndex(0);
      photoPreviews.clear();
      setErrors({});
      setStep(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Hotel submit error", err);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAmenitySubOption = (name, current) => {
    const cfg = ROOM_AMENITY_SUBOPTIONS[name];
    if (!cfg) return null;
    if (cfg.type === "select") {
      return (
        <select className="tmx9pf-select" value={current?.subOption || ""} onChange={(e) => setRoomAmenity(name, true, e.target.value)}>
          <option value="">Select an option</option>
          {cfg.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (cfg.type === "multiselect") {
      const selected = Array.isArray(current?.subOption) ? current.subOption : [];
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cfg.options.map((o) => {
            const on = selected.includes(o);
            return (
              <button type="button" key={o}
                className={`tmx9pf-small-btn ${on ? "tmx9pf-small-btn--active" : ""}`}
                onClick={() => setRoomAmenity(name, true, on ? selected.filter((x) => x !== o) : [...selected, o])}
              >{o}</button>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (isEditMode && isLoadingEdit) {
    return (
      <div className="tmx9pf-root">
        <div className="tmx9pf-card" style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Loading hotel details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tmx9pf-root">
      <Helmet>
        <title>{isEditMode ? "Update Hotel Listing" : "List Your Hotel"} | OvikaLiving</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form className="tmx9pf-paginated" onSubmit={(e) => e.preventDefault()} noValidate>
        <header className="tmx9pf-header">
          <h1 className="tmx9pf-title">{isEditMode ? "Update" : "Create"} <span className="span-data-setup">Hotel</span> Listing</h1>
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

        <div className="tmx9pf-card" style={{ minHeight: 620, width: "100%", boxSizing: "border-box" }}>

          {/* STEP 0 — Basic Info */}
          {step === 0 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Which property type would you like to list?</h2>
              <div className="hlf-type-grid">
                {HOTEL_TYPES.map((t) => (
                  <div key={t.id} className={`hlf-type-card ${form.hotel_type === t.id ? "selected" : ""}`} onClick={() => setField("hotel_type", t.id)}>
                    <div className="hlf-type-card-title">{t.id}</div>
                    <div className="hlf-type-card-desc">{t.desc}</div>
                  </div>
                ))}
              </div>
              {renderError("hotel_type")}

              <div className="tmx9pf-grid" style={{ marginTop: 24 }}>
                <div className="tmx9pf-field full">
                  <label className="tmx9pf-label">Hotel / Property Name *</label>
                  <input value={form.property_name} onChange={(e) => setField("property_name", e.target.value)} className={`tmx9pf-input ${errors.property_name ? "tmx9pf-input--error" : ""}`} placeholder="e.g. Sunrise Resort" />
                  {renderError("property_name")}
                </div>
                <div className="tmx9pf-field full">
                  <label className="tmx9pf-label">Short Description *</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} className={`tmx9pf-input ${errors.description ? "tmx9pf-input--error" : ""}`} placeholder="Describe your hotel..." />
                  {renderError("description")}
                </div>
              </div>
            </section>
          )}

          {/* STEP 1 — Location */}
          {step === 1 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Property Location Details</h2>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20, marginTop: -8 }}>Please enter the same address as on your address proof document, to avoid rejections due to mismatch.</p>

              <div className="tmx9pf-grid">
                <div className="tmx9pf-field full" ref={addrWrapRef} style={{ position: "relative" }}>
                  <label className="tmx9pf-label">Search Address *</label>
                  <input value={form.address} onChange={handleAddressInput} onFocus={() => addrSuggestions.length > 0 && setShowAddrDrop(true)} placeholder="Search here..." autoComplete="off" className={`tmx9pf-input ${errors.address ? "tmx9pf-input--error" : ""}`} />
                  {addrLoading && <span style={{ position: "absolute", right: 12, top: 42, fontSize: 12, color: "#94a3b8" }}>Searching...</span>}
                  {showAddrDrop && addrSuggestions.length > 0 && (
                    <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", margin: "4px 0 0", padding: 0, listStyle: "none", overflow: "hidden" }}>
                      {addrSuggestions.map((item, idx) => (
                        <li key={idx} onMouseDown={() => selectAddrSuggestion(item)} style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, color: "#334155", borderBottom: idx < addrSuggestions.length - 1 ? "1px solid #f1f5f9" : "none", display: "flex", gap: 8 }}>
                          <MapPin size={14} style={{ color: "#c2772b", marginTop: 3, flexShrink: 0 }} />
                          <span>{item.display_name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {renderError("address")}
                </div>

                <div className="tmx9pf-field full">
                  <label className="tmx9pf-label">House/Building/Apartment No.</label>
                  <input value={form.building_no} onChange={(e) => setField("building_no", e.target.value)} className="tmx9pf-input" placeholder="Please add details" />
                </div>
                <div className="tmx9pf-field full">
                  <label className="tmx9pf-label">Locality/Area/Street/Sector *</label>
                  <input value={form.locality} onChange={(e) => setField("locality", e.target.value)} className={`tmx9pf-input ${errors.locality ? "tmx9pf-input--error" : ""}`} />
                  {renderError("locality")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Pincode *</label>
                  <input value={form.pincode} onChange={(e) => setField("pincode", e.target.value)} className={`tmx9pf-input ${errors.pincode ? "tmx9pf-input--error" : ""}`} placeholder="Enter Pincode" />
                  {renderError("pincode")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Country</label>
                  <input value={form.country} onChange={(e) => setField("country", e.target.value)} className="tmx9pf-input" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">State *</label>
                  <input value={form.state} onChange={(e) => setField("state", e.target.value)} className={`tmx9pf-input ${errors.state ? "tmx9pf-input--error" : ""}`} />
                  {renderError("state")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">City *</label>
                  <CityDropdown value={form.city} onChange={(e) => setField("city", e.target.value)} className="tmx9pf-input" hasError={!!errors.city} placeholder="Select City" />
                  {renderError("city")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Latitude *</label>
                  <input value={form.latitude} onChange={(e) => setField("latitude", e.target.value)} className={`tmx9pf-input ${errors.latitude ? "tmx9pf-input--error" : ""}`} placeholder="auto-filled from address search" />
                  {renderError("latitude")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Longitude *</label>
                  <input value={form.longitude} onChange={(e) => setField("longitude", e.target.value)} className={`tmx9pf-input ${errors.longitude ? "tmx9pf-input--error" : ""}`} placeholder="auto-filled from address search" />
                  {renderError("longitude")}
                </div>

                <div className="tmx9pf-field full">
                  <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#475569" }}>
                    <input type="checkbox" checked={form.addressConfirmed} onChange={(e) => setField("addressConfirmed", e.target.checked)} style={{ marginTop: 2 }} />
                    I agree to the terms and conditions and confirm the address provided here is as per the registration or lease document.
                  </label>
                  {renderError("addressConfirmed")}
                </div>
              </div>
            </section>
          )}

          {/* STEP 2 — Amenities (property level) */}
          {step === 2 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Property Amenities</h2>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16, marginTop: -8 }}>Answering the amenities available at your property can significantly influence guests to book.</p>
              {Object.entries(PROPERTY_AMENITIES).map(([cat, items]) => {
                const count = items.filter((i) => form.amenities[i]).length;
                return (
                  <Accordion key={cat} title={cat} count={count} total={items.length} open={openPropCats.has(cat)} onToggle={() => togglePropCat(cat)}>
                    {items.map((item) => (
                      <YesNo key={item} label={item} value={!!form.amenities[item]} onChange={(v) => toggleAmenity(item, v)} />
                    ))}
                  </Accordion>
                );
              })}
            </section>
          )}

          {/* STEP 3 — Rooms */}
          {step === 3 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Room Types</h2>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16, marginTop: -8 }}>Add every room category your hotel offers.</p>
              {renderError("rooms")}

              {form.rooms.map((r, idx) => (
                <div key={idx} className="hlf-room-card">
                  <div>
                    <div className="hlf-room-card-title">{r.roomName || r.roomType} × {r.numberOfRooms}</div>
                    <div className="hlf-room-card-meta">{r.roomType} · {r.roomView} · {r.areaValue} {r.areaUnit} · ₹{r.baseRate4Adults}/night (4 adults)</div>
                  </div>
                  <div className="hlf-room-card-actions">
                    <button type="button" className="tmx9pf-small-btn" onClick={() => editRoom(idx)}>Edit</button>
                    <button type="button" className="tmx9pf-small-btn danger" onClick={() => removeRoom(idx)}>Remove</button>
                  </div>
                </div>
              ))}

              {!roomDraft && (
                <button type="button" className="tmx9pf-small-btn" onClick={openNewRoom} style={{ marginTop: 8 }}>+ Add Room Type</button>
              )}

              {roomDraft && (
                <div className="hlf-room-editor">
                  <h3 className="hlf-room-editor-title">{roomDraft._editIndex !== undefined ? "Edit Room" : "Create Room"}</h3>

                  <div className="hlf-room-section">
                    <div className="hlf-room-section-title">1 · Room Details</div>
                    <div className="tmx9pf-grid">
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Room type</label>
                        <select className={`tmx9pf-select ${errors.roomType ? "tmx9pf-input--error" : ""}`} value={roomDraft.roomType} onChange={(e) => setRoomField("roomType", e.target.value)}>
                          <option value="">Select room type</option>
                          {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {renderError("roomType")}
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Room view</label>
                        <select className="tmx9pf-select" value={roomDraft.roomView} onChange={(e) => setRoomField("roomView", e.target.value)}>
                          {ROOM_VIEWS.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Room Size (Area)</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <select className="tmx9pf-select" value={roomDraft.areaUnit} onChange={(e) => setRoomField("areaUnit", e.target.value)} style={{ flex: 1 }}>
                            <option value="sqft">Square Feet</option>
                            <option value="sqm">Square Meter</option>
                          </select>
                          <input type="number" min="0" value={roomDraft.areaValue} onChange={(e) => setRoomField("areaValue", e.target.value)} className="tmx9pf-input" placeholder="Enter size" style={{ flex: 1 }} />
                        </div>
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Room Name (as displayed to guests)</label>
                        <input value={roomDraft.roomName} onChange={(e) => setRoomField("roomName", e.target.value)} className="tmx9pf-input" placeholder="e.g. Luxury room with private pool" />
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Number of rooms (of this type)</label>
                        <input type="number" min="1" value={roomDraft.numberOfRooms} onChange={(e) => setRoomField("numberOfRooms", e.target.value)} className={`tmx9pf-input ${errors.numberOfRooms ? "tmx9pf-input--error" : ""}`} />
                        {renderError("numberOfRooms")}
                      </div>
                      <div className="tmx9pf-field full">
                        <label className="tmx9pf-label">Description (optional)</label>
                        <textarea rows={3} value={roomDraft.description} onChange={(e) => setRoomField("description", e.target.value)} className="tmx9pf-input" placeholder="Highlight features, sleeping arrangement, view..." />
                      </div>
                    </div>
                  </div>

                  <div className="hlf-room-section">
                    <div className="hlf-room-section-title">2 · Sleeping Arrangement & Occupancy</div>
                    <label className="tmx9pf-label">Standard Arrangement — Bed Type(s)</label>
                    <div className="tmx9pf-dynamic-list">
                      {roomDraft.bedArrangement.map((b, i) => (
                        <div key={b.id} className="tmx9pf-dynamic-row">
                          <select value={b.bedType} onChange={(e) => updateBedRow(i, "bedType", e.target.value)} className="tmx9pf-select" style={{ flex: 2 }}>
                            {BED_TYPES.map((bt) => <option key={bt.id} value={bt.id}>{bt.id} ({bt.size})</option>)}
                          </select>
                          <input type="number" min="1" value={b.count} onChange={(e) => updateBedRow(i, "count", e.target.value)} className="tmx9pf-input" style={{ flex: 1 }} placeholder="Number of beds" />
                          {roomDraft.bedArrangement.length > 1 && (
                            <button type="button" className="tmx9pf-small-btn danger" onClick={() => removeBedRow(i)}>×</button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="tmx9pf-small-btn" onClick={addBedRow} style={{ marginTop: 8 }}>+ Add Another Bed Type</button>
                    </div>
                    {renderError("bedArrangement")}

                    <div style={{ marginTop: 16 }}>
                      <YesNo label="Can this room/unit accommodate extra bed(s)?" value={roomDraft.extraBedAllowed} onChange={(v) => setRoomField("extraBedAllowed", v)} />
                      <YesNo label="Does this room offer an alternate sleeping arrangement?" value={roomDraft.hasAlternateArrangement} onChange={(v) => setRoomField("hasAlternateArrangement", v)} />
                    </div>

                    <div className="bnb-stepper-list" style={{ marginTop: 16 }}>
                      {[
                        { label: "Base adults", key: "baseAdults" },
                        { label: "Maximum adults", key: "maxAdults" },
                        { label: "Base children", key: "baseChildren" },
                        { label: "Maximum children", key: "maxChildren" },
                        { label: "Maximum occupancy", key: "maxOccupancy" },
                      ].map(({ label, key }) => (
                        <div key={key} className="bnb-stepper-row">
                          <span className="bnb-stepper-label">{label}</span>
                          <Stepper value={roomDraft.occupancy[key]} onChange={(v) => setRoomNested("occupancy", key, v)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hlf-room-section">
                    <div className="hlf-room-section-title">3 · Bathroom Details</div>
                    <div className="bnb-stepper-list">
                      <div className="bnb-stepper-row">
                        <span className="bnb-stepper-label">Number of bathroom(s)</span>
                        <Stepper value={roomDraft.bathroomCount} onChange={(v) => setRoomField("bathroomCount", v)} min={1} />
                      </div>
                    </div>
                  </div>

                  <div className="hlf-room-section">
                    <div className="hlf-room-section-title">4 · Meal Plan, Rates & Inventory</div>
                    <div className="tmx9pf-grid">
                      <div className="tmx9pf-field full">
                        <label className="tmx9pf-label">Meal Plan</label>
                        <select className="tmx9pf-select" value={roomDraft.mealPlan} onChange={(e) => setRoomField("mealPlan", e.target.value)}>
                          {MEAL_PLANS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Base Rate for 4 adults (₹)</label>
                        <input type="number" min="0" value={roomDraft.baseRate4Adults} onChange={(e) => setRoomField("baseRate4Adults", e.target.value)} className={`tmx9pf-input ${errors.baseRate4Adults ? "tmx9pf-input--error" : ""}`} />
                        {renderError("baseRate4Adults")}
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Extra Adult Charge (₹)</label>
                        <input type="number" min="0" value={roomDraft.extraAdultCharge} onChange={(e) => setRoomField("extraAdultCharge", e.target.value)} className="tmx9pf-input" />
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Paid Child Charge (₹, age 7–17)</label>
                        <input type="number" min="0" value={roomDraft.paidChildCharge} onChange={(e) => setRoomField("paidChildCharge", e.target.value)} className="tmx9pf-input" />
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Inventory Start Date</label>
                        <input type="date" value={roomDraft.inventory.start} onChange={(e) => setRoomNested("inventory", "start", e.target.value)} className="tmx9pf-input" />
                      </div>
                      <div className="tmx9pf-field">
                        <label className="tmx9pf-label">Inventory End Date</label>
                        <input type="date" value={roomDraft.inventory.end} onChange={(e) => setRoomNested("inventory", "end", e.target.value)} className="tmx9pf-input" />
                      </div>
                    </div>
                  </div>

                  <div className="hlf-room-section">
                    <div className="hlf-room-section-title">5 · Amenity Details</div>
                    {Object.entries(ROOM_AMENITIES).map(([cat, items]) => {
                      const count = items.filter((i) => roomDraft.amenities[i]?.enabled).length;
                      return (
                        <Accordion key={cat} title={cat} count={count} total={items.length} open={openRoomCats.has(cat)} onToggle={() => toggleRoomCat(cat)}>
                          {items.map((item) => (
                            <YesNo key={item} label={item} value={!!roomDraft.amenities[item]?.enabled} onChange={(v) => setRoomAmenity(item, v)}>
                              {renderAmenitySubOption(item, roomDraft.amenities[item])}
                            </YesNo>
                          ))}
                        </Accordion>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button type="button" className="tmx9pf-nav-btn tmx9pf-nav-prev" onClick={cancelRoomEdit}>Cancel</button>
                    <button type="button" className="tmx9pf-nav-btn tmx9pf-nav-next" onClick={saveRoom}>Save Room</button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* STEP 4 — Photos */}
          {step === 4 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Upload Photos & Videos</h2>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16, marginTop: -8 }}>Upload minimum 5 photos (JPEG/PNG, up to 30MB each), including at least 1 landscape photo.</p>

              {isEditMode && existingPhotos.length > 0 && (
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

              <label className="tmx9pf-label">{isEditMode ? "Add More Photos" : "Photos"}</label>
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
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 5 — Policies */}
          {step === 5 && (
            <section className="tmx9pf-section">
              <h2 className="tmx9pf-section-title">Policies</h2>

              <div className="tmx9pf-grid" style={{ marginBottom: 24 }}>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Check-in Time *</label>
                  <input type="time" value={form.check_in_time} onChange={(e) => setField("check_in_time", e.target.value)} className={`tmx9pf-input ${errors.check_in_time ? "tmx9pf-input--error" : ""}`} />
                  {renderError("check_in_time")}
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Check-out Time *</label>
                  <input type="time" value={form.check_out_time} onChange={(e) => setField("check_out_time", e.target.value)} className={`tmx9pf-input ${errors.check_out_time ? "tmx9pf-input--error" : ""}`} />
                  {renderError("check_out_time")}
                </div>
              </div>

              <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b", marginBottom: 12 }}>Cancellation Policy</div>
              <div className="tmx9pf-dynamic-list" style={{ marginBottom: 24 }}>
                {CANCELLATION_POLICIES.map((p) => (
                  <label key={p.value} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#334155" }}>
                    <input type="radio" name="cancellation_policy" checked={form.cancellation_policy === p.value} onChange={() => setField("cancellation_policy", p.value)} />
                    {p.label} {p.tag && <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>{p.tag}</span>}
                  </label>
                ))}
              </div>
              {renderError("cancellation_policy")}

              <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b", marginBottom: 12, marginTop: 24 }}>Property Rules (optional)</div>

              <Accordion title="Guest Profile" open onToggle={() => {}}>
                <YesNo label="Do you allow unmarried couples?" value={form.guest_profile.unmarried_couples} onChange={(v) => setNested("guest_profile", "unmarried_couples", v)} />
                <YesNo label="Do you allow guests below 18 years of age?" value={form.guest_profile.guests_below_18} onChange={(v) => setNested("guest_profile", "guests_below_18", v)} />
                <YesNo label="Are groups with only male guests allowed?" value={form.guest_profile.male_only_groups} onChange={(v) => setNested("guest_profile", "male_only_groups", v)} />
              </Accordion>

              <Accordion title="Acceptable Identity Proofs" open onToggle={() => {}}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                  {ID_PROOFS.map((p) => {
                    const on = form.acceptable_id_proofs.includes(p);
                    return (
                      <button type="button" key={p} className={`tmx9pf-small-btn ${on ? "tmx9pf-small-btn--active" : ""}`}
                        onClick={() => setField("acceptable_id_proofs", on ? form.acceptable_id_proofs.filter((x) => x !== p) : [...form.acceptable_id_proofs, p])}>{p}</button>
                    );
                  })}
                </div>
                <YesNo label="Are IDs of the same city as the property allowed?" value={form.ids_same_city_allowed} onChange={(v) => setField("ids_same_city_allowed", v)} />
              </Accordion>

              <Accordion title="Property Restrictions" open onToggle={() => {}}>
                <YesNo label="Is smoking allowed anywhere within the premises?" value={form.restrictions.smoking_allowed} onChange={(v) => setNested("restrictions", "smoking_allowed", v)} />
                <YesNo label="Are private parties or events allowed?" value={form.restrictions.private_parties_allowed} onChange={(v) => setNested("restrictions", "private_parties_allowed", v)} />
                <YesNo label="Is your property accessible for guests who use a wheelchair?" value={form.restrictions.wheelchair_accessible} onChange={(v) => setNested("restrictions", "wheelchair_accessible", v)} />
                <YesNo label="Can guests invite outside visitors to the room?" value={form.restrictions.outside_visitors_allowed} onChange={(v) => setNested("restrictions", "outside_visitors_allowed", v)} />
              </Accordion>

              <Accordion title="Pet Policy" open onToggle={() => {}}>
                <YesNo label="Any pet(s) living on the property?" value={form.pet_policy.pets_on_property} onChange={(v) => setNested("pet_policy", "pets_on_property", v)} />
                <YesNo label="Are pets allowed for guests?" value={form.pet_policy.pets_allowed_for_guests} onChange={(v) => setNested("pet_policy", "pets_allowed_for_guests", v)} />
              </Accordion>

              <Accordion title="Check-in and Checkout Policies" open onToggle={() => {}}>
                <YesNo label="Do you have a 24-hour check-in?" value={form.checkin_policy.is_24_hour} onChange={(v) => setNested("checkin_policy", "is_24_hour", v)} />
              </Accordion>

              <Accordion title="Infant Policy" open onToggle={() => {}}>
                <YesNo label="Include 1 infant (0-2 yrs)/room without counting in total occupancy?" value={form.infant_policy.excluded_from_occupancy} onChange={(v) => setNested("infant_policy", "excluded_from_occupancy", v)} />
                <YesNo label="Do you provide complimentary food for infants (0-2 yrs) on request?" value={form.infant_policy.complimentary_food} onChange={(v) => setNested("infant_policy", "complimentary_food", v)} />
              </Accordion>

              <Accordion title="Extra Bed Policies" open onToggle={() => {}}>
                <YesNo label="Is extra bed/mattress included in extra adult/paid child rates?" value={form.extra_bed_inclusion} onChange={(v) => setField("extra_bed_inclusion", v)} />
                <div className="hlf-yesno-row">
                  <span className="hlf-yesno-label">Do you provide bed to extra adults?</span>
                  <select className="tmx9pf-select" value={form.extra_bed_policy.for_adults} onChange={(e) => setNested("extra_bed_policy", "for_adults", e.target.value)} style={{ maxWidth: 200 }}>
                    <option value="no">No</option><option value="yes">Yes</option><option value="subject_to_availability">Subject to availability</option>
                  </select>
                </div>
                <div className="hlf-yesno-row">
                  <span className="hlf-yesno-label">Do you provide bed to extra kids?</span>
                  <select className="tmx9pf-select" value={form.extra_bed_policy.for_kids} onChange={(e) => setNested("extra_bed_policy", "for_kids", e.target.value)} style={{ maxWidth: 200 }}>
                    <option value="no">No</option><option value="yes">Yes</option><option value="subject_to_availability">Subject to availability</option>
                  </select>
                </div>
              </Accordion>

              <div className="tmx9pf-field full" style={{ marginTop: 16 }}>
                <label className="tmx9pf-label">Custom Policy</label>
                <textarea rows={3} maxLength={300} value={form.custom_policy} onChange={(e) => setField("custom_policy", e.target.value)} className="tmx9pf-input" placeholder="Please add details" />
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{form.custom_policy.length}/300</div>
              </div>

              <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b", marginBottom: 12, marginTop: 24 }}>Meal Rack Prices (₹)</div>
              <div className="tmx9pf-grid">
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Breakfast</label>
                  <input type="number" min="0" value={form.meal_rack_prices.breakfast} onChange={(e) => setNested("meal_rack_prices", "breakfast", e.target.value)} className="tmx9pf-input" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Lunch</label>
                  <input type="number" min="0" value={form.meal_rack_prices.lunch} onChange={(e) => setNested("meal_rack_prices", "lunch", e.target.value)} className="tmx9pf-input" />
                </div>
                <div className="tmx9pf-field">
                  <label className="tmx9pf-label">Dinner</label>
                  <input type="number" min="0" value={form.meal_rack_prices.dinner} onChange={(e) => setNested("meal_rack_prices", "dinner", e.target.value)} className="tmx9pf-input" />
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
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Publish Hotel Listing"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HotelListingForm;
