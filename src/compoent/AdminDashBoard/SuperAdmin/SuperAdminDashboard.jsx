import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import './SuperAdmin.css';
import ImageClassificationModal from './ImageClassificationModal';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Icons Components
const Icons = {
  Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
  Properties: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Bookings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Finance: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  Refunds: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12c0-1.1.9-2 2-2H4"></path><path d="M16 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Leads: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>,
  MetaLeads: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
  LandingLeads: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"></rect><path d="M3 8h18"></path><path d="M7 14h3"></path></svg>,
  Reviews: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
};

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const API_PROPERTIES = "https://www.townmanor.ai/api/ovika/properties";
const API_PROPERTIES_UPLOAD = "https://www.townmanor.ai/api/ovika/properties/upload";
const API_BOOKINGS = "https://www.townmanor.ai/api/booking-request";
const API_USERS = "https://www.townmanor.ai/api/users-list";

const SHARING_TYPES = ["Single Room", "Double Sharing", "Triple Sharing", "Four Sharing", "Dormitory"];
const BEDROOM_TYPES = ["King Bed", "Queen Bed", "Single Bed", "Bunk Bed", "Twin Bed", "Other"];
const BATHROOM_TYPES = ["Attached", "Common", "Shared", "Private"];

const AMENITIES_MASTER = {
  "Safety & Security": ["CCTV", "Security Guard", "Fire Extinguisher", "Intercom", "Biometric Entry", "Gated Community", "Fire Alarm", "Smoke Detectors", "Electronic Entry Lock", "Electronic Bedroom Lock", "Sprinkler"],
  "Modern Living": ["Lift", "Power Backup", "Wi-Fi", "Swimming Pool", "Gym", "Clubhouse", "Central AC", "EV Charging Point"],
  "Basic Utilities": ["Water Supply 24/7", "Borewell", "Corporation Water", "Gas Pipeline", "Solar Water", "Reserved Parking", "Visitor Parking"],
  "Indoor Features": ["Air Conditioner", "Geyser", "RO Water", "Washing Machine", "Refrigerator", "Inverter", "Wardrobe", "Study Table", "Smart TV", "Google TV", "Gas Stove", "Iron & Board"],
  "Bathroom": ["Bath Towels", "Soap & Shampoo"],
  "Kitchen Appliances": ["Electric Kettle", "Hob", "Chimney", "Toaster", "Rice Cooker", "Coffee Maker", "Microwave", "Stovetop/oven", "Cooking utensils", "Induction Cooktop", "Dining Counter"],
  "Outer Spaces": ["Balcony", "Private Terrace", "Garden", "Park Area", "Pet Area", "Kids Play Area"]
};

export default function SuperAdminDashboard() {
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('sa_auth') === 'true';
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [view, setView] = useState('dashboard'); // 'dashboard', 'properties', 'users', 'bookings', 'finance', 'settings', 'leads', 'meta-leads', 'reviews', 'verification', 'self-verification'

  // ── Verification Badge states ──
  const [vbSearch, setVbSearch] = useState('');
  const [vbCategory, setVbCategory] = useState('ALL');
  const [vbRentalType, setVbRentalType] = useState('ALL');
  const [vbCity, setVbCity] = useState('');
  const [vbLoading, setVbLoading] = useState(false);

  // ── Lead Purchases states ──
  const [lpList, setLpList] = useState([]);
  const [lpLoading, setLpLoading] = useState(false);
  const [lpSearch, setLpSearch] = useState('');

  // ── Booking Inquiries states ──
  const [biList, setBiList] = useState([]);
  const [biLoading, setBiLoading] = useState(false);
  const [biSearch, setBiSearch] = useState('');
  const [biPhotoModal, setBiPhotoModal] = useState(null);

  // ── Owner Details states ──
  const [ownersList, setOwnersList] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [ownersSearch, setOwnersSearch] = useState('');
  const [ownersExpanded, setOwnersExpanded] = useState(null);
  const [ownersTab, setOwnersTab] = useState('all'); // 'all' | 'nightly' | 'monthly'
  const [ldTab, setLdTab] = useState('category'); // 'category' | 'city' | 'area' | 'cross'
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [manualCatOverrides, setManualCatOverrides] = useState({}); // { [propId]: 'Category Label' }

  // ── Self Verification states ──
  const [svList, setSvList] = useState([]);
  const [svLoading, setSvLoading] = useState(false);
  const [svDebug, setSvDebug] = useState('');
  const [svSearch, setSvSearch] = useState('');
  const [svBadgeLoading, setSvBadgeLoading] = useState(false);
  const [svLightbox, setSvLightbox] = useState(null); // { url, title }
  const [svRejectTarget, setSvRejectTarget] = useState(null);
  const [svRejectReason, setSvRejectReason] = useState('');
  const [svApproveTarget, setSvApproveTarget] = useState(null);
  const [svToast, setSvToast] = useState(null); // { msg, type: 'success'|'error' }
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]); // Real users from API
  const [leads, setLeads] = useState([]); // Lead generation data
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalProps: 0, 
    totalVal: 0, 
    activeUsers: 0, 
    totalBookings: 0, 
    pendingBookings: 0, 
    confirmedBookings: 0, 
    cancelledBookings: 0, 
    totalRevenue: 0, 
    pendingRevenue: 0 
  });
  
  const [derivedUsers, setDerivedUsers] = useState([]); // Users aggregated from props (Owners)
  const [derivedGuests, setDerivedGuests] = useState([]); // Users aggregated from bookings (Guests)
  const [editingProp, setEditingProp] = useState(null); // For edit modal
  const [isCreatingProp, setIsCreatingProp] = useState(false); // Mode for property modal
  const [classifyProperty, setClassifyProperty] = useState(null); // For image classification modal

  /* User Management State */
  const [editingUser, setEditingUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Scroll lock when any modal is open
  useEffect(() => {
    const anyOpen = !!(editingProp || isCreatingProp || classifyProperty || isUserModalOpen);
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [editingProp, isCreatingProp, classifyProperty, isUserModalOpen]);
  const [userForm, setUserForm] = useState({ username: '', email: '', phone_number: '', role: 'user', password: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearch, setUserSearch] = useState(""); // Search for Users
  const [propertyIdSearch, setPropertyIdSearch] = useState(""); // Search Users by Property ID only
  const [bookingFilter, setBookingFilter] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [propertyTypes, setPropertyTypes] = useState([
    // ── Nightly / Short-term types ──
    "Entire place", "Private room", "Shared room", "Hotel room", "Homestay",
    // ── Monthly / Long-term types ──
    "Apartment", "House", "Villa", "Flat", "Commercial Shop", "Office Space", "Land / Plot",
    // ── PG / Hostel ──
    "PG", "Hostel",
  ]);
  
  // Settings State
  const [settings, setSettings] = useState({
    siteName: "TownManor",
    maintenanceMode: false,
    serviceFee: 5,
    adminEmail: "admin@townmanor.ai"
  });

  // Pagination State
  const [userPage, setUserPage] = useState(1);
  const [ownerPage, setOwnerPage] = useState(1);
  const [guestPage, setGuestPage] = useState(1);
  const [leadPage, setLeadPage] = useState(1);
  const [propertyPage, setPropertyPage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const [leadFilterSource, setLeadFilterSource] = useState("ALL");
  const ITEMS_PER_PAGE = 10;

  // Meta Leads State
  const [metaLeads, setMetaLeads] = useState([]);
  const [metaLeadsLoading, setMetaLeadsLoading] = useState(false);
  const [metaLeadPage, setMetaLeadPage] = useState(1);
  const [metaLeadSearch, setMetaLeadSearch] = useState("");
  const [metaLeadStatusFilter, setMetaLeadStatusFilter] = useState("ALL");
  const [metaLeadLastRefresh, setMetaLeadLastRefresh] = useState(null);
  const [metaLeadsTotal, setMetaLeadsTotal] = useState(0);
  const [metaLeadsStats, setMetaLeadsStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0 });
  const [metaSyncing, setMetaSyncing] = useState(false);
  const META_LEADS_LIMIT = 20;
  const META_LEADS_API = "https://townmanor.ai/api/meta-leads";

  // Landing Page Leads State (ads landing page — /get-started — lead form)
  const [landingLeads, setLandingLeads] = useState([]);
  const [landingLeadsLoading, setLandingLeadsLoading] = useState(false);
  const [landingLeadPage, setLandingLeadPage] = useState(1);
  const [landingLeadSearch, setLandingLeadSearch] = useState("");
  const [landingLeadCityFilter, setLandingLeadCityFilter] = useState("ALL");
  const [landingLeadCategoryFilter, setLandingLeadCategoryFilter] = useState("ALL");
  const [landingLeadsTotal, setLandingLeadsTotal] = useState(0);
  const [landingLeadLastRefresh, setLandingLeadLastRefresh] = useState(null);
  const LANDING_LEADS_LIMIT = 20;
  const LANDING_LEADS_API = "https://www.townmanor.ai/api/ovika/landing-leads";
  const LANDING_LEAD_CITIES = ['Noida', 'Greater Noida', 'Gurugram', 'Delhi', 'Ghaziabad'];
  const LANDING_LEAD_CATEGORIES = ['Signature Stays', 'Hotel Stays', 'Homestays & BnB', 'Apartments & Villas', 'PG & Co-Living'];

  // Reviews State
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('ALL');
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_API = "https://townmanor.ai/api/feedback";
  const REVIEWS_PER_PAGE = 10;

  // --- Fetch Data ---
  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchAllProperties(), fetchAllBookings(), fetchAllUsers(), fetchAllLeads()]);
    setLoading(false);
  };

  const fetchAllProperties = async () => {
    try {
      const res = await axios.get(API_PROPERTIES, { validateStatus: false });
      // Normalize data
      let data = [];
      if (res.data && Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      }
      setProperties(data);
    } catch (e) {
      console.error("SuperAdmin load props failed", e);
    }
  };

  const fetchAllBookings = async () => {
    try {
        const res = await axios.get(API_BOOKINGS, { validateStatus: false });
        let data = [];
        if (res.status === 200 && Array.isArray(res.data)) {
             data = res.data; 
        } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
             data = res.data.data;
        }
        setBookings(data);
    } catch (e) {
        console.error("Fetch bookings failed", e);
        setBookings([]); 
    }
  };

  const fetchAllUsers = async () => {
    try {
        const res = await axios.get(API_USERS, { validateStatus: false });
        let data = [];
        if (res.data && Array.isArray(res.data)) {
            data = res.data;
        } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
            data = res.data.data;
        }
        setUsersList(data);
    } catch (e) {
        console.error("Fetch users failed", e);
    }
  };

  const fetchAllLeads = async () => {
    try {
        const res = await axios.get("https://www.townmanor.ai/api/formlead/leads");
        if (Array.isArray(res.data)) {
            setLeads(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
            setLeads(res.data.data);
        }
    } catch (e) {
        console.error("Fetch leads failed", e);
    }
  };

  const fetchMetaLeads = async (page = metaLeadPage, search = metaLeadSearch, status = metaLeadStatusFilter) => {
    setMetaLeadsLoading(true);
    try {
        const params = { page, limit: META_LEADS_LIMIT };
        if (search) params.search = search;
        if (status !== 'ALL') params.status = status;
        const res = await axios.get(META_LEADS_API, { params, validateStatus: false });
        if (res.data && res.data.success) {
            setMetaLeads(res.data.leads || []);
            setMetaLeadsTotal(res.data.total || 0);
        }
        setMetaLeadLastRefresh(new Date());
    } catch (e) {
        console.error("Fetch meta leads failed", e);
    } finally {
        setMetaLeadsLoading(false);
    }
  };

  const fetchMetaLeadsStats = async () => {
    try {
        const [totalRes, newRes, contactedRes, convertedRes] = await Promise.all([
            axios.get(META_LEADS_API, { params: { limit: 1 }, validateStatus: false }),
            axios.get(META_LEADS_API, { params: { limit: 1, status: 'new' }, validateStatus: false }),
            axios.get(META_LEADS_API, { params: { limit: 1, status: 'contacted' }, validateStatus: false }),
            axios.get(META_LEADS_API, { params: { limit: 1, status: 'converted' }, validateStatus: false }),
        ]);
        setMetaLeadsStats({
            total:     totalRes.data?.total     || 0,
            new:       newRes.data?.total       || 0,
            contacted: contactedRes.data?.total || 0,
            converted: convertedRes.data?.total || 0,
        });
    } catch (e) {
        console.error("Fetch meta leads stats failed", e);
    }
  };

  const updateMetaLeadStatus = async (leadId, newStatus) => {
    try {
        await axios.patch(`${META_LEADS_API}/${leadId}/status`, { status: newStatus });
        fetchMetaLeads(metaLeadPage, metaLeadSearch, metaLeadStatusFilter);
        fetchMetaLeadsStats();
    } catch (e) {
        console.error("Update meta lead status failed", e);
    }
  };

  const syncHistoricalLeads = async () => {
    setMetaSyncing(true);
    try {
        const res = await axios.get(`${META_LEADS_API}/sync`, { validateStatus: false });
        if (res.data && res.data.success !== false) {
            fetchMetaLeads(1, metaLeadSearch, metaLeadStatusFilter);
            fetchMetaLeadsStats();
            alert('Historical leads synced successfully!');
        } else {
            alert('Sync completed. Check data below.');
        }
    } catch (e) {
        console.error("Sync failed", e);
        alert('Sync failed. Please try again.');
    } finally {
        setMetaSyncing(false);
    }
  };

  // Fetch when page/search/status changes
  useEffect(() => {
    if (view !== 'meta-leads') return;
    fetchMetaLeads(metaLeadPage, metaLeadSearch, metaLeadStatusFilter);
  }, [metaLeadPage, metaLeadSearch, metaLeadStatusFilter]);

  // Auto-refresh every 30s + fetch stats on view enter
  useEffect(() => {
    if (view !== 'meta-leads') return;
    fetchMetaLeads(1, '', 'ALL');
    fetchMetaLeadsStats();
    const interval = setInterval(() => {
        fetchMetaLeads(metaLeadPage, metaLeadSearch, metaLeadStatusFilter);
        fetchMetaLeadsStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [view]);

  // Landing Page Leads — fetch (GET /ovika/landing-leads, per backend spec: page/limit/city/category filters)
  const fetchLandingLeads = async (page = landingLeadPage, search = landingLeadSearch, city = landingLeadCityFilter, category = landingLeadCategoryFilter) => {
    setLandingLeadsLoading(true);
    try {
        const params = { page, limit: LANDING_LEADS_LIMIT };
        if (search) params.search = search;
        if (city !== 'ALL') params.city = city;
        if (category !== 'ALL') params.category = category;
        const res = await axios.get(LANDING_LEADS_API, { params, validateStatus: false });
        if (res.data && res.data.success !== false) {
            setLandingLeads(res.data.data || []);
            setLandingLeadsTotal(res.data.pagination?.total ?? res.data.total ?? (res.data.data || []).length);
        } else {
            setLandingLeads([]);
            setLandingLeadsTotal(0);
        }
        setLandingLeadLastRefresh(new Date());
    } catch (e) {
        console.error("Fetch landing page leads failed", e);
        setLandingLeads([]);
    } finally {
        setLandingLeadsLoading(false);
    }
  };

  // Fetch when page/search/filters change
  useEffect(() => {
    if (view !== 'landing-leads') return;
    fetchLandingLeads(landingLeadPage, landingLeadSearch, landingLeadCityFilter, landingLeadCategoryFilter);
  }, [landingLeadPage, landingLeadSearch, landingLeadCityFilter, landingLeadCategoryFilter]);

  // Auto-refresh every 30s while this view is active
  useEffect(() => {
    if (view !== 'landing-leads') return;
    fetchLandingLeads(1, '', 'ALL', 'ALL');
    const interval = setInterval(() => {
        fetchLandingLeads(landingLeadPage, landingLeadSearch, landingLeadCityFilter, landingLeadCategoryFilter);
    }, 30000);
    return () => clearInterval(interval);
  }, [view]);

  const fetchSelfVerifications = async () => {
    setSvLoading(true);
    setSvDebug('Fetching...');

    // Try multiple endpoint variants — backend may not have /all
    const endpoints = [
      'https://townmanor.ai/api/owner-verification',
      'https://www.townmanor.ai/api/owner-verification',
      'https://townmanor.ai/api/owner-verification/all',
      'https://www.townmanor.ai/api/owner-verification/submissions',
    ];

    let found = false;
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { validateStatus: false });
        if (res.status === 200) {
          const payload = res.data;
          const data = payload?.data || payload?.submissions || payload?.verifications || payload?.results || (Array.isArray(payload) ? payload : []);
          setSvList(Array.isArray(data) ? data : []);
          setSvDebug(`OK (${url}) | ${Array.isArray(data) ? data.length : 0} items`);
          found = true;
          break;
        } else {
          setSvDebug(`HTTP ${res.status} @ ${url} — trying next...`);
        }
      } catch (e) {
        setSvDebug(`ERR @ ${url}: ${e.message}`);
      }
    }

    if (!found) {
      setSvDebug('All endpoints returned non-200. Backend team ko GET /api/owner-verification endpoint banana hoga.');
      setSvList([]);
    }
    setSvLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setSvToast({ msg, type });
    setTimeout(() => setSvToast(null), 3500);
  };

  const updateSvStatus = async (sv, status, reason = '') => {
    setSvBadgeLoading(true);
    try {
      const body = { status };
      if (reason.trim()) body.reason = reason.trim();
      const res = await axios.patch(
        `https://www.townmanor.ai/api/owner-verification/${sv.id}/status`,
        body,
        { validateStatus: false }
      );
      if (res.data?.success) {
        setSvList(prev => prev.map(s => s.id === sv.id ? { ...s, verification_status: status } : s));
        showToast(
          status === 'approved'
            ? '✅ Submission approved! Email sent to owner.'
            : '❌ Submission rejected! Email sent with reason.',
          status === 'approved' ? 'success' : 'error'
        );
      } else {
        showToast(res.data?.message || 'Status update failed', 'error');
      }
    } catch (e) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSvBadgeLoading(false);
      setSvApproveTarget(null);
      setSvRejectTarget(null);
      setSvRejectReason('');
    }
  };

  useEffect(() => {
    if (view === 'self-verification') fetchSelfVerifications();
    if (view === 'lead-purchases') fetchLeadPurchases();
    if (view === 'booking-inquiries') fetchBookingInquiries();
    if (view === 'owners') fetchOwners();
  }, [view]);

  const fetchOwners = async () => {
    setOwnersLoading(true);
    try {
      const [propRes, userRes] = await Promise.all([
        axios.get(API_PROPERTIES),
        axios.get(API_USERS, { validateStatus: false }),
      ]);
      const propsArr = Array.isArray(propRes.data) ? propRes.data : (propRes.data?.data || []);
      const usersArr = Array.isArray(userRes.data) ? userRes.data : (userRes.data?.data || []);

      // Build owner_id → user map
      const userMap = {};
      usersArr.forEach(u => {
        const uid = u.id || u.user_id;
        if (uid) userMap[uid] = u;
      });

      // Monthly categories (property_category field)
      const MONTHLY_CATS = ['pg', 'pg & co-living', 'co-living', 'coliving', 'apartments & villas', 'apartment', 'apartments'];

      const map = {};
      propsArr.forEach(p => {
        const oid = p.owner_id || 'unknown';
        const user = userMap[oid] || {};
        const name  = user.full_name || user.name || user.username || user.email || `Owner #${oid}`;
        const phone = user.phone || user.phone_number || user.mobile || '—';
        if (!map[oid]) map[oid] = { name, phone, ownerId: oid, properties: [] };

        const cat = (p.property_category || p.property_type || '').toLowerCase().trim();
        const rentalType = MONTHLY_CATS.some(c => cat.includes(c)) ? 'monthly' : 'nightly';
        map[oid].properties.push({ ...p, _rentalType: rentalType });
      });

      const sorted = Object.values(map)
        .filter(o => o.ownerId !== 'unknown' || o.properties.length > 0)
        .sort((a, b) => b.properties.length - a.properties.length);
      setOwnersList(sorted);
    } catch(e) {
      console.error('fetchOwners error', e);
    } finally {
      setOwnersLoading(false);
    }
  };

  const fetchBookingInquiries = async () => {
    setBiLoading(true);
    try {
      const res = await axios.get('https://www.townmanor.ai/api/booking-request');
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setBiList(list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
    } catch (e) {
      console.error('Booking inquiries fetch failed', e);
      setBiList([]);
    } finally {
      setBiLoading(false);
    }
  };

  const fetchLeadPurchases = async () => {
    setLpLoading(true);
    try {
      const res = await axios.get('https://townmanor.ai/api/lead-invoices', { validateStatus: false });
      const data = res.data?.invoices || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setLpList(data);
    } catch (e) {
      console.error('Lead purchases fetch failed', e);
      setLpList([]);
    } finally {
      setLpLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
        const res = await axios.get(REVIEWS_API, { params: { limit: 200 }, withCredentials: true, validateStatus: false });
        let data = [];
        if (res.data?.feedbacks) data = res.data.feedbacks;
        else if (res.data?.reviews) data = res.data.reviews;
        else if (Array.isArray(res.data)) data = res.data;
        setReviewsList(data);
    } catch (e) {
        console.error("Fetch reviews failed", e);
    } finally {
        setReviewsLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, newStatus) => {
    // Optimistic UI update
    setReviewsList(prev => prev.map(r => r.id === reviewId ? { ...r, review_status: newStatus } : r));
    try {
        await axios.patch(`${REVIEWS_API}/${reviewId}/${newStatus}`, {}, { withCredentials: true });
    } catch (e) {
        console.error("Update review status failed", e);
        // revert on failure
        setReviewsList(prev => prev.map(r => r.id === reviewId ? { ...r, review_status: 'pending' } : r));
    }
  };

  useEffect(() => {
    if (view === 'reviews') fetchReviews();
  }, [view]);

  useEffect(() => {
    calculateStats(properties, bookings, usersList);
  }, [properties, bookings, usersList]);

  // --- Helpers ---
  const calculateDays = (start, end) => {
      if(!start || !end) return 1;
      const d1 = new Date(start);
      const d2 = new Date(end);
      if(isNaN(d1.getTime()) || isNaN(d2.getTime())) return 1;
      const diff = d2 - d1;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 1;
  };

  const calculateBookingAmount = (b) => {
    if (b.total_price  && Number(b.total_price)  > 0) return Number(b.total_price);
    if (b.total_amount && Number(b.total_amount) > 0) return Number(b.total_amount);
    if (b.subtotal     && Number(b.subtotal)     > 0) {
      const gst      = Number(b.gst_amount)      || 0;
      const discount = Number(b.discount_amount) || 0;
      return Number(b.subtotal) + gst - discount;
    }
    if (b.amount && Number(b.amount) > 0) return Number(b.amount);
    return 0;
  };

  const calculateStats = (propsData, bookingsData, usersData = []) => {
    const totalProps = propsData.length;
    
    // Valuation
    const totalVal = propsData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    
    // Owners
    const owners = new Set(propsData.map(p => p.owner_id).filter(Boolean));
    
    // Booking Stats
    const pending = bookingsData.filter(b => (b.status||'').toLowerCase() === "pending").length;
    const confirmed = bookingsData.filter(b => (b.status||'').toLowerCase() === "accepted" || (b.status||'').toLowerCase() === "confirmed").length;
    const cancelled = bookingsData.filter(b => (b.status||'').toLowerCase() === "rejected" || (b.status||'').toLowerCase() === "cancelled").length;
    
    // Revenue
    let totalRev = 0;
    let pendingRev = 0;

    bookingsData.forEach(b => {
        const amt = calculateBookingAmount(b);
        const st = (b.status || '').toLowerCase();
        if(st === 'accepted' || st === 'confirmed') totalRev += amt;
        if(st === 'pending') pendingRev += amt;
    });
    
    setStats({
      totalProps,
      totalVal,
      activeUsers: owners.size,
      totalBookings: bookingsData.length,
      pendingBookings: pending,
      confirmedBookings: confirmed,
      cancelledBookings: cancelled,
      totalRevenue: totalRev,
      pendingRevenue: pendingRev
    });

    // 1. Aggregate Owners (Who Listed)
    const userMap = {};
    propsData.forEach(p => {
        const oid = p.owner_id || "Unclaimed";
        if (!userMap[oid]) {
            userMap[oid] = { 
                id: oid, 
                count: 0, 
                totalVal: 0,
                name: p.owner_name || `Owner ${oid.toString().slice(-4)}`,
                propertyNames: []
            };
        }
        userMap[oid].count += 1;
        userMap[oid].totalVal += (Number(p.price) || 0);
        if(p.property_name || p.name) userMap[oid].propertyNames.push(p.property_name || p.name);
    });

    // Enrich with Contact Info from usersData
    const enrichedOwners = Object.values(userMap).map(owner => {
         // loose comparison for ID as one might be string, other number
         const user = usersData.find(u => (u.id == owner.id || u._id == owner.id));
         return {
             ...owner,
             email: user ? user.email : "N/A",
             phone: user ? (user.phone_number || user.phone) : "N/A"
         };
    });

    setDerivedUsers(enrichedOwners);

    // 2. Aggregate Guests (Who Booked)
    const guestMap = {};
    bookingsData.forEach(b => {
         const uid = b.user_id || b.username || "Guest";
         const uName = b.username || "Unknown Guest";
         
         if (!guestMap[uid]) {
             guestMap[uid] = {
                 id: uid,
                 name: uName,
                 count: 0,
                 spent: 0
             };
         }
         guestMap[uid].count += 1;
         
         const st = (b.status || '').toLowerCase();
         if(st === 'accepted' || st === 'confirmed') {
             guestMap[uid].spent += calculateBookingAmount(b);
         }
    });
    setDerivedGuests(Object.values(guestMap));
  };

  useEffect(() => {
    if (isSuperAdminAuthenticated) {
      fetchAllData();
    }
  }, [isSuperAdminAuthenticated]);

  // --- Handlers ---
  const handleSALogin = (e) => {
    e.preventDefault();
    // Setting hardcoded credentials as requested for "id/password" protection
    const ADMIN_EMAIL = "mishra.ankush2001@gmail.com";
    const ADMIN_PASS = "ankushmishra@2609";

    if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASS) {
      setIsSuperAdminAuthenticated(true);
      sessionStorage.setItem('sa_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Email or Password');
    }
  };

  const handleSALogout = () => {
    setIsSuperAdminAuthenticated(false);
    sessionStorage.removeItem('sa_auth');
  };

  
  // --- Edit Handlers ---
  const handleEditClick = (prop) => {
      const parsedProp = { ...prop };
      // Parse JSON fields for editing
      ['amenities', 'photos', 'house_rules', 'safety_items', 'meta', 'id_files', 'guest_policy', 'bedroom_details', 'bathroom_details', 'bedrooms', 'bathrooms', 'guidebook'].forEach(key => {
          if (parsedProp[key] && typeof parsedProp[key] === 'string') {
              try {
                  parsedProp[key] = JSON.parse(parsedProp[key]);
              } catch (e) {
                  console.warn(`Failed to parse ${key}`, e);
              }
          }
      });
      // Normalize nested objects
      parsedProp.guidebook = typeof parsedProp.guidebook === 'object' ? parsedProp.guidebook : {};
      parsedProp.guest_policy = typeof parsedProp.guest_policy === 'object' ? parsedProp.guest_policy : {};
      parsedProp.meta = typeof parsedProp.meta === 'object' ? parsedProp.meta : {};
      
      // Ensure specific meta fields exist if missing
      parsedProp.meta.maintenanceCharge = parsedProp.meta.maintenanceCharge || parsedProp.maintenance_charge || "";
      parsedProp.meta.securityDeposit = parsedProp.meta.securityDeposit || parsedProp.security_deposit || "";

      // Pre-tick Bath Towels & Soap & Shampoo for all Signature properties
      const SIGNATURE_IDS = new Set([77, 78, 79, 80, 81, 314, 315, 316, 317, 323]);
      if (SIGNATURE_IDS.has(Number(parsedProp.id || parsedProp._id || 0))) {
          if (!Array.isArray(parsedProp.amenities)) parsedProp.amenities = [];
          ['Bath Towels', 'Soap & Shampoo'].forEach(e => {
              if (!parsedProp.amenities.includes(e)) parsedProp.amenities.push(e);
          });
      }

      setEditingProp(parsedProp); 
      setIsCreatingProp(false);
  };

  const handleNestedChange = (parent, field, value) => {
      setEditingProp(prev => ({
          ...prev,
          [parent]: {
              ...(prev[parent] || {}),
              [field]: value
          }
      }));
  };

  const handleMetaChange = (field, value) => {
      setEditingProp(prev => {
          const newMeta = typeof prev.meta === 'object' ? { ...prev.meta } : {};
          newMeta[field] = value;
          return { ...prev, meta: newMeta };
      });
  };

  const handleGuidebookChange = (field, value, nestedField = null) => {
      setEditingProp(prev => {
          const newGuide = { ...(prev.guidebook || {}) };
          if (nestedField) {
              newGuide[field] = { ...(newGuide[field] || {}), [nestedField]: value };
          } else {
              newGuide[field] = value;
          }
          return { ...prev, guidebook: newGuide };
      });
  };

  const handlePolicyToggle = (field) => {
      setEditingProp(prev => {
          const newPolicy = { ...(prev.guest_policy || {}) };
          newPolicy[field] = !newPolicy[field];
          return { ...prev, guest_policy: newPolicy };
      });
  };

  const cleanDescription = (desc) => {
    if (!desc || typeof desc !== 'string') return "";
    return desc
      .split('--- PG Details ---')[0]
      .split('--- Local Guide ---')[0]
      .split('Notice Period:')[0]
      .split('Gate Closing Time:')[0]
      .trim();
  };

  const handleEdit = (prop) => {
      setEditingProp({
          ...prop,
          description: cleanDescription(prop.description)
      });
      setShowEditModal(true);
  };
  const toggleAmenity = (a) => {
      setEditingProp(prev => {
          const currentAmenities = Array.isArray(prev.amenities) 
              ? prev.amenities 
              : (typeof prev.amenities === 'string' ? JSON.parse(prev.amenities || '[]') : []);
          
          const newAmenities = currentAmenities.includes(a)
              ? currentAmenities.filter(item => item !== a)
              : [...currentAmenities, a];
          
          return { ...prev, amenities: newAmenities };
      });
  };

  const handleCreatePropClick = () => {
      setEditingProp({ property_name: '', price: '', city: '', address: '', description: '', owner_name: 'Admin', owner_id: 'admin' });
      setIsCreatingProp(true);
  };

  const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditingProp(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveEdit = async () => {
    if(!editingProp) return;
    
    try {
        // 1. Build Payload with ONLY verified columns (from DashBoardAdmin.jsx reference)
        const payload = {
            property_name: editingProp.property_name || editingProp.name || "Untitled",
            description: editingProp.description || "",
            price: Number(editingProp.price) || 0,
            address: editingProp.address || "",
            city: editingProp.city || "",
            property_type: editingProp.property_type || "Standard",
            property_category: editingProp.property_category || "Flat",
            area: editingProp.area || "",
            beds: Number(editingProp.beds) || 0,
            max_guests: Number(editingProp.max_guests) || 0,
            booking_type: String(editingProp.booking_type || "0"),
            owner_id: editingProp.owner_id || "admin",
            check_in_time: editingProp.check_in_time || "12:00",
            check_out_time: editingProp.check_out_time || "11:00",
            weekend_rate: Number(editingProp.weekend_rate) || 0,
            cleaning_fee: Number(editingProp.cleaning_fee) || 0,
            weekly_discount_pct: Number(editingProp.weekly_discount_pct) || 0,
            monthly_discount_pct: Number(editingProp.monthly_discount_pct) || 0,
            // Boolean columns
            smoking_allowed: !!editingProp.smoking_allowed,
            pets_allowed: !!editingProp.pets_allowed,
            events_allowed: !!editingProp.events_allowed,
            drinking_alcohol: !!editingProp.drinking_alcohol || !!editingProp.drinkingAllowed,
        };

        // 2. JSON Fields
        const jsonFields = {
            amenities: editingProp.amenities,
            bedrooms: editingProp.bedrooms || editingProp.bedroom_details,
            bathrooms: editingProp.bathrooms || editingProp.bathroom_details,
            guest_policy: editingProp.guest_policy,
        };

        Object.keys(jsonFields).forEach(key => {
            let val = jsonFields[key];
            if (val) {
                payload[key] = typeof val === 'object' ? JSON.stringify(val) : val;
            } else {
                payload[key] = key === 'guest_policy' ? "{}" : "[]";
            }
        });

        console.log("Saving Property with Verified Payload:", payload);

        if (isCreatingProp) {
            await axios.post(API_PROPERTIES_UPLOAD, payload);
            alert("Property created successfully.");
        } else {
            const id = editingProp.id || editingProp._id;
            await axios.put(`${API_PROPERTIES}/${id}`, payload);
            alert("Property updated successfully.");
        }
        
        setEditingProp(null);
        setIsCreatingProp(false);
        fetchAllProperties(); 
    } catch(e) {
        console.error("Save Error Details:", e);
        const errMsg = e.response?.data?.message || e.response?.data?.error || e.message;
        alert("Operation failed: " + errMsg);
    }
  };

  // --- Delete Property ---
  const handleDeleteProperty = async (prop) => {
    const id = prop.id || prop._id;
    if (!window.confirm(`Are you sure you want to delete "${prop.property_name || prop.name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`https://www.townmanor.ai/api/ovika/properties/${id}`);
      alert("Property deleted successfully.");
      fetchAllProperties();
    } catch (e) {
      alert("Failed to delete property: " + (e.response?.data?.message || e.message));
    }
  };

  // --- User Form Handlers ---
  const openUserModal = (user = null) => {
      if(user) {
          setEditingUser(user);
          setUserForm({ ...user, password: '' }); // Don't show password
      } else {
          setEditingUser(null);
          setUserForm({ username: '', email: '', phone_number: '', role: 'user', password: '' });
      }
      setIsUserModalOpen(true);
  };

  const handleUserFormChange = (e) => {
      setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async () => {
      try {
          if (editingUser) {
              const id = editingUser.id || editingUser._id;
              await axios.put(`${API_USERS}/${id}`, userForm);
              alert("User updated.");
          } else {
              await axios.post(API_USERS, userForm);
              alert("User created.");
          }
          setIsUserModalOpen(false);
          fetchAllUsers();
      } catch(e) {
          console.error(e);
          alert("User save failed: " + (e.response?.data?.message || e.message));
      }
  };

  const handleBookingAction = async (id, action) => {
    const confirmMsg = action === 'accept' ? 'Accept this booking?' : 'Reject this booking?';
    if (!window.confirm(confirmMsg)) return;

    try {
        const url = `${API_BOOKINGS}/${id}/${action}`; 
        const body = action === 'reject' ? { owner_note: 'Action by Super Admin' } : {};
        
        await axios.patch(url, body);
        
        const newStatus = action === 'accept' ? 'accepted' : 'rejected';
        setBookings(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, status: newStatus } : b));
        
        alert(`Booking ${newStatus} successfully.`);
    } catch (e) {
        console.error(e);
        alert("Action failed: " + (e.response?.data?.message || e.message));
    }
  };

  // --- Dynamic Charts Data ---

  /* helper: get the single best category label for a property */
  const getPropCategory = (p) => {
    let cat = (p.property_type || p.property_category || '').trim();
    if (!cat && p.meta) {
      try {
        const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : p.meta;
        cat = (meta.propertyType || meta.propertyCategory || '').trim();
      } catch (_) {}
    }
    return cat || 'Other';
  };

  /* helper: smart label + color for owner-details property table */
  const getOwnerPropLabel = (p) => {
    let metaObj = null;
    try { metaObj = p.meta ? (typeof p.meta === 'string' ? JSON.parse(p.meta) : p.meta) : null; } catch (_) {}

    let guestPolicy = null;
    try { guestPolicy = p.guest_policy ? (typeof p.guest_policy === 'string' ? JSON.parse(p.guest_policy) : p.guest_policy) : null; } catch (_) {}

    const subType = (metaObj?.propertyType || '').trim();
    const cat = (p.property_category || p.category || '').trim();
    const catLow = cat.toLowerCase();
    const tenants = guestPolicy?.preferredTenants || metaObj?.preferredTenants || [];

    // PG & Co-Living — determine gender from subType OR preferredTenants
    if (catLow.includes('pg') || catLow.includes('co-living') || catLow.includes('coliving')) {
      const stLow = subType.toLowerCase();
      // Valid PG-specific subtypes only (ignore "Apartment" or other wrong defaults)
      const isPGSubtype = ['girls', 'boys', 'co-living', 'coliving', 'hostel', 'working', 'student'].some(k => stLow.includes(k));

      if (isPGSubtype) {
        if (stLow.includes('girls')) return { label: '👩 Girls PG', bg: '#fdf2f8', color: '#be185d' };
        if (stLow.includes('boys'))  return { label: '👦 Boys PG',  bg: '#eff6ff', color: '#2563eb' };
        if (stLow.includes('co-living') || stLow.includes('coliving')) return { label: '🏘 Co-Living', bg: '#f0fdf4', color: '#15803d' };
        if (stLow.includes('hostel'))   return { label: '🏨 Hostel',         bg: '#fff7ed', color: '#c2410c' };
        if (stLow.includes('working'))  return { label: '💼 Working Pro PG', bg: '#fefce8', color: '#a16207' };
        if (stLow.includes('student'))  return { label: '📚 Student PG',     bg: '#f5f3ff', color: '#6d28d9' };
      }

      // subType is invalid/missing — determine from preferredTenants
      const hasFemale = tenants.some(t => t.toLowerCase().includes('female'));
      const hasMale   = tenants.some(t => t.toLowerCase().includes('male') && !t.toLowerCase().includes('female'));
      const hasAny    = tenants.some(t => t.toLowerCase().includes('bachelors (any)'));
      if (hasFemale && !hasMale) return { label: '👩 Girls PG', bg: '#fdf2f8', color: '#be185d' };
      if (hasMale && !hasFemale) return { label: '👦 Boys PG',  bg: '#eff6ff', color: '#2563eb' };
      if (hasAny || (hasMale && hasFemale)) return { label: '👫 Boys & Girls PG', bg: '#f5f3ff', color: '#6d28d9' };

      // no data at all
      return { label: 'PG', bg: '#eff6ff', color: '#2563eb' };
    }

    // Apartments & Villas
    if (catLow.includes('apartment') || catLow.includes('villa')) {
      const label = subType || cat || 'Apartment';
      return { label, bg: '#f0f9ff', color: '#0369a1' };
    }

    // Nightly types
    if (catLow.includes('signature')) return { label: subType || 'Signature Stay', bg: '#fdf4ff', color: '#7e22ce' };
    if (catLow.includes('hotel'))     return { label: subType || 'Hotel Stay',     bg: '#fff7ed', color: '#c2410c' };
    if (catLow.includes('homestay') || catLow.includes('bnb') || catLow.includes('b&b'))
      return { label: subType || 'Homestay / BnB', bg: '#f0fdf4', color: '#15803d' };

    // fallback
    const label = subType || cat || '—';
    return { label, bg: '#f1f5f9', color: '#475569' };
  };

  const getListingGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6 = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6.push({ label: months[d.getMonth()], year: d.getFullYear(), month: d.getMonth() });
    }

    const counts = last6.map(({ month, year }) =>
      properties.filter(p => {
        if (!p.created_at) return false;
        const d = new Date(p.created_at);
        return !isNaN(d) && d.getMonth() === month && d.getFullYear() === year;
      }).length
    );

    const hasData = counts.some(c => c > 0);

    return {
      labels: last6.map(l => l.label),
      datasets: [{
        label: 'New Listings',
        data: hasData ? counts : [0, 0, 0, 0, 0, properties.length],
        borderColor: '#c2772b',
        backgroundColor: 'rgba(194, 119, 43, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#c2772b',
      }]
    };
  };

  const getPropertyDistributionData = () => {
    /* count each property exactly once using its primary category */
    const catMap = {};
    properties.forEach(p => {
      const cat = getPropCategory(p);
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    /* sort by count descending, group tail into "Other" if > 8 slices */
    const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const TOP_N = 8;
    let labels, counts;
    if (sorted.length > TOP_N) {
      const top = sorted.slice(0, TOP_N - 1);
      const otherCount = sorted.slice(TOP_N - 1).reduce((s, [, c]) => s + c, 0);
      labels = [...top.map(([l]) => l), 'Other'];
      counts = [...top.map(([, c]) => c), otherCount];
    } else {
      labels = sorted.map(([l]) => l);
      counts = sorted.map(([, c]) => c);
    }

    const COLORS = ['#c2772b','#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#d97706','#64748b'];

    return {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: COLORS.slice(0, labels.length),
        borderWidth: 0,
      }]
    };
  };

  const lineData = getListingGrowthData();
  const pieData = getPropertyDistributionData();

  // --- Filtering ---
  const filteredProperties = properties.filter(p => {
      // Type Filter
      let type = p.property_type || p.property_category || "N/A";
      if (!p.property_type && p.meta) {
          try {
             const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : p.meta;
             if (meta.propertyType) type = meta.propertyType;
             if (meta.type) type = meta.type;
          } catch(e) {}
      }
      
      if (filterType !== 'ALL' && type !== filterType) return false;

      if(!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      const name = (p.property_name || p.name || "").toLowerCase();
      const loc = (p.city || "").toLowerCase();
      const owner = (String(p.owner_id || "")).toLowerCase();
      return name.includes(s) || loc.includes(s) || owner.includes(s);
  });

  // --- Render ---
  if (!isSuperAdminAuthenticated) {
    return (
      <div className="sa-login-overlay">
        <div className="sa-login-card">
          <div className="sa-login-header">
            <span className="sa-brand">OvikaLiving<span className="sa-badge">Admin</span></span>
            <p>Please sign in to access control panel</p>
          </div>
          <form onSubmit={handleSALogin} className="sa-login-form">
            <div className="sa-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter admin email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className="sa-input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            {loginError && <p className="sa-login-error">{loginError}</p>}
            <button type="submit" className="sa-btn-primary sa-login-btn">
              Acess Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="sa-loading-screen">Loading Super Admin Dashboard...</div>;

  return (
    <div className="sa-container">
      <Helmet>
        <title>Admin Control Panel | OvikaLiving</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Sidebar */}
      <aside className="sa-sidebar">
        <div>
            <div className="sa-brand-area">
                <span className="sa-brand">Ovika<span className="sa-badge">Admin</span></span>
            </div>
            <nav className="sa-nav">
                <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
                    <span className="sa-nav-icon"><Icons.Dashboard /></span> Dashboard
                </button>
                <button className={view === 'properties' ? 'active' : ''} onClick={() => setView('properties')}>
                    <span className="sa-nav-icon"><Icons.Properties /></span> Properties
                </button>
                <button className={view === 'users' ? 'active' : ''} onClick={() => setView('users')}>
                    <span className="sa-nav-icon"><Icons.Users /></span> Users & Activity
                </button>
                <button className={view === 'bookings' ? 'active' : ''} onClick={() => setView('bookings')}>
                    <span className="sa-nav-icon"><Icons.Bookings /></span> Bookings
                </button>
                <button className={view === 'finance' ? 'active' : ''} onClick={() => setView('finance')}>
                    <span className="sa-nav-icon"><Icons.Finance /></span> Finance
                </button>
                <button className={view === 'refunds' ? 'active' : ''} onClick={() => setView('refunds')}>
                    <span className="sa-nav-icon"><Icons.Refunds /></span> Payments & Refunds
                </button>
                <button className={view === 'leads' ? 'active' : ''} onClick={() => setView('leads')}>
                    <span className="sa-nav-icon"><Icons.Leads /></span> Leads & Inquiries
                </button>
                <button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>
                    <span className="sa-nav-icon"><Icons.Settings /></span> Settings
                </button>
                <button className={view === 'meta-leads' ? 'active' : ''} onClick={() => setView('meta-leads')} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '12px' }}>
                    <span className="sa-nav-icon"><Icons.MetaLeads /></span> Meta Leads
                </button>
                <button className={view === 'landing-leads' ? 'active' : ''} onClick={() => setView('landing-leads')}>
                    <span className="sa-nav-icon"><Icons.LandingLeads /></span> Landing Page Leads
                </button>
                <button className={view === 'reviews' ? 'active' : ''} onClick={() => setView('reviews')}>
                    <span className="sa-nav-icon"><Icons.Reviews /></span> Review Feedback
                </button>
                <button className={view === 'verification' ? 'active' : ''} onClick={() => setView('verification')}>
                    <span className="sa-nav-icon">🛡️</span> Verification Badges
                </button>
                <button className={view === 'self-verification' ? 'active' : ''} onClick={() => setView('self-verification')}>
                    <span className="sa-nav-icon">✅</span> Self Verification
                </button>
                <button className={view === 'lead-purchases' ? 'active' : ''} onClick={() => setView('lead-purchases')}>
                    <span className="sa-nav-icon">💳</span> Lead Purchases
                </button>
                <button className={view === 'booking-inquiries' ? 'active' : ''} onClick={() => setView('booking-inquiries')}>
                    <span className="sa-nav-icon">🏨</span> Booking Inquiries
                </button>
                <button className={view === 'owners' ? 'active' : ''} onClick={() => setView('owners')} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '12px' }}>
                    <span className="sa-nav-icon">👤</span> Owner Details
                </button>
                <button className={view === 'listings-data' ? 'active' : ''} onClick={() => setView('listings-data')}>
                    <span className="sa-nav-icon">📊</span> Listings Data
                </button>
            </nav>
        </div>
        <div style={{ marginTop: 'auto', color: '#6b7280', fontSize: '12px' }}>
            v2.1.0 Build 495
        </div>
      </aside>

      {/* Content Area */}
      <div className="sa-content">
        <header className="sa-header">
            <h2>
                {view === 'dashboard' && 'Dashboard Overview'}
                {view === 'properties' && 'Property Management'}
                {view === 'users' && 'User Administration'}
                {view === 'bookings' && 'Booking Management'}
                {view === 'finance' && 'Financial Reports'}
                {view === 'leads' && 'Lead Generation Management'}
                {view === 'settings' && 'Platform Settings'}
                {view === 'meta-leads' && 'Meta Ads Leads (Real-Time)'}
                {view === 'landing-leads' && 'Landing Page Leads (/get-started)'}
                {view === 'reviews' && 'Review Feedback Management'}
                {view === 'verification' && 'Verification Badge Management'}
                {view === 'self-verification' && 'Self Verification Submissions'}
                {view === 'lead-purchases' && 'Lead Purchases'}
                {view === 'booking-inquiries' && 'Booking Inquiries'}
                {view === 'listings-data' && 'Listings Data'}
            </h2>
            <div className="sa-user-controls">
                <span className="sa-admin-tag">Super Admin</span>
                <button onClick={handleSALogout} className="sa-logout-btn">Logout</button>
            </div>
        </header>

        <div className="sa-main-body">
            {/* VIEW: DASHBOARD */}
            {view === 'dashboard' && (
                <>
                <div className="sa-stats-grid">
                    <div className="sa-stat-card">
                        <div className="sa-stat-title">Total Properties</div>
                        <div className="sa-stat-val">{stats.totalProps}</div>
                    </div>
                    <div className="sa-stat-card">
                        <div className="sa-stat-title">Total Asset Value</div>
                        <div className="sa-stat-val">₹{stats.totalVal.toLocaleString()}</div>
                    </div>
                </div>

                {/* City-wise Listings */}
                {(() => {
                    const CITIES = ['Noida', 'Greater Noida', 'Gurugram', 'Delhi', 'Ghaziabad', 'Faridabad'];
                    const counts = {};
                    CITIES.forEach(c => { counts[c] = 0; });
                    properties.forEach(p => {
                        const c = (p.city    || '').toLowerCase().trim();
                        const a = (p.address || '').toLowerCase();
                        // Round 1: city field + address (Greater Noida first to avoid Noida overlap)
                        if      (c.includes('greater noida') || a.includes('greater noida'))                           { counts['Greater Noida']++; }
                        else if (c === 'noida' || (c.includes('noida') && !c.includes('greater')))                     { counts['Noida']++; }
                        else if (c.includes('gurugram') || c.includes('gurgaon') || a.includes('gurugram') || a.includes('gurgaon')) { counts['Gurugram']++; }
                        else if (c.includes('delhi')      || a.includes('delhi'))                                      { counts['Delhi']++; }
                        else if (c.includes('ghaziabad')  || a.includes('ghaziabad'))                                  { counts['Ghaziabad']++; }
                        else if (c.includes('faridabad')  || a.includes('faridabad'))                                  { counts['Faridabad']++; }
                        // Round 2: address-only fallback for Noida (blank city but address has sector/noida)
                        else if (a.includes('noida') && !a.includes('greater noida'))                                  { counts['Noida']++; }
                        // unmatched — silently ignored (genuinely blank data)
                    });
                    return (
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12, marginBottom:24 }}>
                            {CITIES.map(city => (
                                <div key={city} className="sa-stat-card" style={{ textAlign:'center', padding:'16px 10px' }}>
                                    <div className="sa-stat-val" style={{ fontSize:'1.6rem' }}>{counts[city]}</div>
                                    <div className="sa-stat-title" style={{ marginTop:4 }}>{city}</div>
                                </div>
                            ))}
                        </div>
                    );
                })()}

                <div className="sa-charts">
                    <div className="sa-chart-box">
                        <h4>Listing Growth Trend</h4>
                        <div style={{ height: '250px' }}>
                            <Line options={{ maintainAspectRatio: false }} data={lineData} />
                        </div>
                    </div>
                    <div className="sa-chart-box">
                        <h4>Property Distribution</h4>
                        <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                            <Doughnut options={{ maintainAspectRatio: false }} data={pieData} />
                        </div>
                    </div>
                </div>
                </>
            )}

            {/* VIEW: PROPERTIES */}
            {(view === 'properties' || view === 'dashboard') && (
                <div className="sa-table-container" style={{ marginTop: view === 'dashboard' ? '0' : '0' }}>
                     <div className="sa-table-header-row">
                        <h3>Properties Database</h3>
                        <div style={{display:'flex', gap:'12px'}}>
                            <button className="sa-btn-primary" onClick={handleCreatePropClick} style={{backgroundColor:'#10b981'}}>+ Add Property</button>
                            <input 
                                type="text" 
                                placeholder="Search properties..." 
                                className="sa-search-input"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPropertyPage(1);
                                }}
                            />
                            <select 
                                className="sa-search-input" 
                                style={{width: '150px'}}
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    setPropertyPage(1);
                                }}
                            >
                                <option value="ALL">All Types</option>
                                {propertyTypes.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                     </div>
                     <table className="sa-table">
                        <thead>
                            <tr>
                                <th>Ref ID</th>
                                <th>Thumbnail</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Listed On</th>
                                <th>Listed By (Owner)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const totalPropertyPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
                                const displayProperties = filteredProperties.slice((propertyPage - 1) * ITEMS_PER_PAGE, propertyPage * ITEMS_PER_PAGE);
                                
                                return (
                                    <>
                                        {displayProperties.map(p => {
                                            const img = (Array.isArray(p.photos) ? p.photos[0] : (p.photos ? p.photos.split(',')[0] : '')) || 'https://placehold.co/60x60?text=No+Image';
                                
                                let type = p.property_type || p.property_category || "N/A";
                                if (!p.property_type && !p.property_category && p.meta) {
                                    try {
                                        const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : p.meta;
                                        if (meta.propertyType) type = meta.propertyType;
                                        if (meta.type) type = meta.type;
                                    } catch(e) {}
                                }

                                return (
                                    <tr key={p.id || p._id} style={{ borderLeft: editingProp && (editingProp.id || editingProp._id) === (p.id || p._id) ? '4px solid #3b82f6' : 'none' }}>
                                        <td style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '12px' }}>{(p.id || p._id || '').toString().slice(-6)}</td>
                                        <td><img src={img} alt="thumb" className="sa-prop-img" /></td>
                                        <td>
                                            <span className="sa-prop-name">{p.property_name || p.name || "Untitled"}</span>
                                        </td>
                                        <td>
                                            <span className={`sa-badge-type ${type === 'PG' ? 'pg' : 'standard'}`}>
                                                {type}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: '500' }}>{p.city || p.address || "-"}</td>
                                        <td style={{ fontFamily: 'Inter', fontWeight: '600' }}>₹{Number(p.price).toLocaleString()}</td>
                                        <td style={{ minWidth: 110, fontSize: 12 }}>
                                            {(p.created_at || p.createdAt || p.updated_at || p.updatedAt) && !isNaN(new Date(p.created_at || p.createdAt || p.updated_at || p.updatedAt).getTime()) ? (
                                              <>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>
                                                  {new Date(p.created_at || p.createdAt || p.updated_at || p.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div style={{ fontWeight: 700, color: '#6366f1', marginTop: 2 }}>
                                                  {new Date(p.created_at || p.createdAt || p.updated_at || p.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </div>
                                              </>
                                            ) : (
                                              <span style={{ color: '#64748b', fontWeight: 600 }}>N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{fontWeight:'600', color:'#1e293b', fontSize:'13px'}}>
                                                {p.owner_name || "Unknown"}
                                            </div>
                                            <span style={{ background: '#f1f5f9', color: '#64748b', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>
                                              ID: {p.owner_id}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="sa-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <button className="sa-btn-primary" onClick={() => handleEditClick(p)}>Edit</button>
                                                <button
                                                  className="sa-btn-primary"
                                                  style={{ backgroundColor: '#8b5cf6' }}
                                                  onClick={() => window.open(`/update-pg/${p.id || p._id}`, '_blank')}
                                                >
                                                  PG Listing Update
                                                </button>
                                                <button
                                                  className="sa-btn-primary"
                                                  style={{ backgroundColor: '#0ea5e9' }}
                                                  onClick={() => setClassifyProperty(p)}
                                                >
                                                  View Images
                                                </button>
                                                <button
                                                  className="sa-btn-danger"
                                                  style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                                                  onClick={() => handleDeleteProperty(p)}
                                                >
                                                  Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredProperties.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="sa-empty">No properties found matching criteria.</td>
                                </tr>
                            )}
                            {filteredProperties.length > 0 && (
                                <tr>
                                    <td colSpan="8" style={{ padding: '12px', background: '#f8fafc' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                                                Showing {((propertyPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(propertyPage * ITEMS_PER_PAGE, filteredProperties.length)} of {filteredProperties.length} properties
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <button 
                                                    className="sa-btn-secondary" 
                                                    disabled={propertyPage === 1}
                                                    onClick={() => setPropertyPage(p => Math.max(1, p - 1))}
                                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                                >
                                                    Prev
                                                </button>
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                                    {propertyPage} / {totalPropertyPages || 1}
                                                </span>
                                                <button 
                                                    className="sa-btn-secondary" 
                                                    disabled={propertyPage >= totalPropertyPages}
                                                    onClick={() => setPropertyPage(p => Math.min(totalPropertyPages, p + 1))}
                                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                                );
                            })()}
                        </tbody>
                     </table>
                </div>
            )}
            
            {/* VIEW: USERS (Derived from Properties & Bookings) */}
            {view === 'users' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* PRIMARY USER TABLE (REAL API) */}
                    {(() => {
                        const filteredUsers = usersList.filter(u => {
                            const uid = String(u.id || u._id || '');

                            if(propertyIdSearch) {
                                const pid = propertyIdSearch.trim().toLowerCase().replace(/^#/, '');
                                if(!pid) return true;
                                return (properties||[]).some(p =>
                                    String(p.id || p._id || '').toLowerCase().includes(pid) &&
                                    String(p.owner_id || '') === uid
                                );
                            }

                            if(!userSearch) return true;
                            const s = userSearch.toLowerCase();
                            const matchesDirect = (u.username||'').toLowerCase().includes(s) ||
                                   (u.email||'').toLowerCase().includes(s) ||
                                   (u.phone_number||'').toString().includes(s);
                            const matchesPropertyId = (properties||[]).some(p =>
                                String(p.id || p._id || '').toLowerCase().includes(s) &&
                                String(p.owner_id || '') === uid
                            );
                            return matchesDirect || matchesPropertyId;
                        });
                        
                        const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
                        const displayUsers = filteredUsers.slice((userPage - 1) * ITEMS_PER_PAGE, userPage * ITEMS_PER_PAGE);

                        return (
                            <div className="sa-table-container">
                                <div className="sa-table-header-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <h3>Registered Users</h3>
                                        <div className="sa-badge" style={{background:'#eff6ff', color:'#3b82f6', border:'none'}}>{filteredUsers.length} Total</div>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <input
                                            type="text"
                                            placeholder="Search by name, email, phone..."
                                            className="sa-search-input"
                                            value={userSearch}
                                            onChange={(e) => {
                                                setUserSearch(e.target.value);
                                                if(e.target.value) setPropertyIdSearch("");
                                                setUserPage(1); // Reset to page 1 on search
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Property ID..."
                                            className="sa-search-input"
                                            style={{maxWidth: '140px'}}
                                            value={propertyIdSearch}
                                            onChange={(e) => setPropertyIdSearch(e.target.value)}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') {
                                                    if(propertyIdSearch) setUserSearch("");
                                                    setUserPage(1);
                                                }
                                            }}
                                        />
                                        <button
                                            className="sa-btn-primary"
                                            onClick={() => {
                                                if(propertyIdSearch) setUserSearch("");
                                                setUserPage(1);
                                            }}
                                        >
                                            Search
                                        </button>
                                        {propertyIdSearch && (
                                            <button
                                                className="sa-btn-secondary"
                                                onClick={() => { setPropertyIdSearch(""); setUserPage(1); }}
                                            >
                                                Clear
                                            </button>
                                        )}
                                        <button className="sa-btn-primary" onClick={() => openUserModal()}>+ Add User</button>
                                    </div>
                                </div>
                                <table className="sa-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>User Profile</th>
                                            <th>Contact Info</th>
                                            <th>Property ID</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayUsers.map(u => {
                                            const uid = String(u.id || u._id || '');
                                            const ownedPropertyIds = (properties||[])
                                                .filter(p => String(p.owner_id || '') === uid)
                                                .map(p => p.id || p._id);
                                            return (
                                            <tr key={u.id || u._id}>
                                                <td style={{fontFamily:'monospace', color:'#64748b'}}>#{(u.id||u._id || '').toString().slice(-4)}</td>
                                                <td>
                                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                                        <img
                                                            src={u.profile_photo || 'https://via.placeholder.com/40'}
                                                            alt="av"
                                                            style={{width:'36px', height:'36px', borderRadius:'50%', objectFit:'cover', border:'1px solid #e2e8f0'}}
                                                        />
                                                        <div style={{fontWeight:'600', color:'#1e293b'}}>{u.username || "No Name"}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{fontSize:'13px', fontWeight:'500'}}>{u.email}</div>
                                                    <div style={{fontSize:'11px', color:'#64748b'}}>{u.phone_number || u.phone || "N/A"}</div>
                                                </td>
                                                <td>
                                                    {ownedPropertyIds.length > 0 ? (
                                                        <div style={{display:'flex', flexWrap:'wrap', gap:'4px'}}>
                                                            {ownedPropertyIds.map(pid => (
                                                                <span key={pid} style={{fontSize:'11px', fontFamily:'monospace', background:'#eff6ff', color:'#3b82f6', padding:'2px 6px', borderRadius:'4px'}}>#{pid}</span>
                                                            ))}
                                                        </div>
                                                    ) : <span style={{fontSize:'11px', color:'#cbd5e1'}}>—</span>}
                                                </td>
                                                <td>
                                                    <div style={{display:'flex', gap:'4px'}}>
                                                        {u.aadhaar_verified || u.pan_verified ? (
                                                            <span style={{fontSize:'10px', background:'#dcfce7', color:'#166534', padding:'2px 6px', borderRadius:'4px'}}>Verified</span>
                                                        ) : <span style={{fontSize:'10px', background:'#f1f5f9', color:'#94a3b8', padding:'2px 6px', borderRadius:'4px'}}>Not Verified</span>}
                                                    </div>
                                                </td>
                                                <td style={{fontSize:'12px', color:'#475569'}}>
                                                    {u.created_at ? (
                                                      <>
                                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>
                                                          {new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                        <div style={{ color: '#6366f1', fontWeight: 600, fontSize: '11px', marginTop: 2 }}>
                                                          {new Date(u.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </div>
                                                      </>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    <div className="sa-actions">
                                                        <button className="sa-btn-primary" style={{padding:'4px 8px', fontSize:'11px'}} onClick={() => openUserModal(u)}>Edit</button>
                                                    </div>
                                                </td>
                                            </tr>
                                            );
                                        })}
                                        {displayUsers.length === 0 && (
                                            <tr><td colSpan="7" className="sa-empty">No registered users found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                                {/* Pagination Controls for Users */}
                                <div className="sa-pagination" style={{display: 'flex', justifyContent: 'flex-end', padding: '12px', gap: '8px', alignItems: 'center'}}>
                                    <button 
                                        className="sa-btn-secondary" 
                                        disabled={userPage === 1}
                                        onClick={() => setUserPage(p => Math.max(1, p - 1))}
                                        style={{padding: '4px 8px', fontSize: '12px'}}
                                    >
                                        Prev
                                    </button>
                                    <span style={{fontSize: '12px', color: '#64748b'}}>
                                        Page {userPage} of {totalUserPages || 1}
                                    </span>
                                    <button 
                                        className="sa-btn-secondary" 
                                        disabled={userPage >= totalUserPages}
                                        onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                                        style={{padding: '4px 8px', fontSize: '12px'}}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        );
                    })()}

                    <h3 style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '16px' }}>Activity Analysis</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    
                    {/* OWNERS TABLE */}
                    {(() => {
                        const totalOwnerPages = Math.ceil(derivedUsers.length / ITEMS_PER_PAGE);
                        const displayOwners = derivedUsers.slice((ownerPage - 1) * ITEMS_PER_PAGE, ownerPage * ITEMS_PER_PAGE);

                        return (
                            <div className="sa-table-container">
                                <div className="sa-table-header-row">
                                    <h3>Property Owners (Listed)</h3>
                                </div>
                                <table className="sa-table">
                                    <thead>
                                        <tr>
                                            <th>Owner Desc</th>
                                            <th>Contact Details</th>
                                            <th>Properties</th>
                                            <th>Portfolio Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayOwners.map(u => (
                                            <tr key={u.id}>
                                                <td>
                                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{u.name}</div>
                                                    <div style={{ fontFamily: 'monospace', color: '#6b7280', fontSize: '11px' }}>ID: {u.id}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '12px', fontWeight: '500' }}>{u.email}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{u.phone}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{u.count} Assets</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {u.propertyNames.join(', ')}
                                                    </div>
                                                </td>
                                                <td>
                                                    ₹{u.totalVal.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {displayOwners.length === 0 && (
                                            <tr><td colSpan="4" className="sa-empty">No owners found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                                {/* Pagination Controls for Owners */}
                                <div className="sa-pagination" style={{display: 'flex', justifyContent: 'flex-end', padding: '12px', gap: '8px', alignItems: 'center'}}>
                                    <button 
                                        className="sa-btn-secondary" 
                                        disabled={ownerPage === 1}
                                        onClick={() => setOwnerPage(p => Math.max(1, p - 1))}
                                        style={{padding: '4px 8px', fontSize: '12px'}}
                                    >
                                        Prev
                                    </button>
                                    <span style={{fontSize: '12px', color: '#64748b'}}>
                                        {ownerPage} / {totalOwnerPages || 1}
                                    </span>
                                    <button 
                                        className="sa-btn-secondary" 
                                        disabled={ownerPage >= totalOwnerPages}
                                        onClick={() => setOwnerPage(p => Math.min(totalOwnerPages, p + 1))}
                                        style={{padding: '4px 8px', fontSize: '12px'}}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        );
                    })()}

                    {/* GUESTS TABLE */}
                    {(() => {
                        const totalGuestPages = Math.ceil(derivedGuests.length / ITEMS_PER_PAGE);
                        const displayGuests = derivedGuests.slice((guestPage - 1) * ITEMS_PER_PAGE, guestPage * ITEMS_PER_PAGE);
                        
                        return (
                            <div className="sa-table-container">
                                <div className="sa-table-header-row">
                                    <h3>Active Guests (Booked)</h3>
                                </div>
                                <table className="sa-table">
                                    <thead>
                                        <tr>
                                            <th>Guest Info</th>
                                            <th>Bookings</th>
                                            <th>Total Spent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayGuests.map(u => (
                                            <tr key={u.id}>
                                                <td>
                                                    <div style={{ fontWeight: '600', color: '#0f766e' }}>{u.name}</div>
                                                    <div style={{ fontFamily: 'monospace', color: '#6b7280', fontSize: '11px' }}>ID: {u.id}</div>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: '700', fontSize: '15px' }}>{u.count}</span> Requests
                                                </td>
                                                <td>
                                                    ₹{u.spent.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {displayGuests.length === 0 && (
                                            <tr><td colSpan="3" className="sa-empty">No guest activity found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                                {/* Pagination Controls for Guests */}
                                <div className="sa-pagination" style={{display: 'flex', justifyContent: 'flex-end', padding: '12px', gap: '8px', alignItems: 'center'}}>
                                    <button 
                                        className="sa-btn-secondary" 
                                        disabled={guestPage === 1}
                                        onClick={() => setGuestPage(p => Math.max(1, p - 1))}
                                        style={{padding: '4px 8px', fontSize: '12px'}}
                                    >
                                        Prev
                                    </button>
                                    <span style={{fontSize: '12px', color: '#64748b'}}>
                                        {guestPage} / {totalGuestPages || 1}
                                    </span>
                                    <button 
                                        className="sa-btn-secondary" 
                                        disabled={guestPage >= totalGuestPages}
                                        onClick={() => setGuestPage(p => Math.min(totalGuestPages, p + 1))}
                                        style={{padding: '4px 8px', fontSize: '12px'}}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        );
                    })()}

                    </div>
                </div>
            )}

            {/* VIEW: BOOKINGS */}
            {view === 'bookings' && (
                <>
                {/* Bookings Stats Row */}
                <div className="sa-stats-grid" style={{ marginBottom: '24px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="sa-stat-card" style={{ padding: '20px' }}>
                        <div className="sa-stat-title">All Bookings</div>
                        <div className="sa-stat-val">{stats.totalBookings}</div>
                    </div>
                    <div className="sa-stat-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
                        <div className="sa-stat-title" style={{ color: '#d97706' }}>Pending</div>
                        <div className="sa-stat-val" style={{ color: '#d97706' }}>{stats.pendingBookings}</div>
                    </div>
                    <div className="sa-stat-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
                        <div className="sa-stat-title" style={{ color: '#059669' }}>Confirmed</div>
                        <div className="sa-stat-val" style={{ color: '#059669' }}>{stats.confirmedBookings}</div>
                    </div>
                    <div className="sa-stat-card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
                        <div className="sa-stat-title" style={{ color: '#dc2626' }}>Cancelled/Rejected</div>
                        <div className="sa-stat-val" style={{ color: '#dc2626' }}>{stats.cancelledBookings}</div>
                    </div>
                </div>

                <div className="sa-table-container">
                    <div className="sa-table-header-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <h3>All Bookings</h3>
                             <select 
                                className="sa-search-input" 
                                style={{width: '180px'}}
                                value={bookingFilter}
                                onChange={(e) => {
                                    setBookingFilter(e.target.value);
                                    setBookingPage(1);
                                }}
                            >
                                <option value="ALL">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="sa-actions">
                            <button className="sa-btn-primary" onClick={fetchAllBookings} style={{background:'white', color:'#3b82f6', border:'1px solid #3b82f6'}}>Refresh Data</button>
                        </div>
                    </div>
                     <table className="sa-table">
                        <thead>
                            <tr>
                                <th>Req ID</th>
                                <th>Property</th>
                                <th>Booked By (Guest)</th>
                                <th>Dates</th>
                                <th>Status</th>
                                <th>Value</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const filteredBookings = bookings.filter(b => bookingFilter === 'ALL' || (b.status||'').toLowerCase() === bookingFilter.toLowerCase());
                                const totalBookingPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
                                const displayBookings = filteredBookings.slice((bookingPage - 1) * ITEMS_PER_PAGE, bookingPage * ITEMS_PER_PAGE);

                                return (
                                    <>
                                        {displayBookings.map(b => {
                                    let propName = b.property_name || b.property?.property_name || b.property?.name || "Unknown Property";
                                    let propCity = b.city || b.property?.city || "";
                                    
                                    if(propName === "Unknown Property") {
                                        const found = properties.find(p => p.id === b.property_id || p._id === b.property_id);
                                        if(found) {
                                            propName = found.property_name || found.name;
                                            propCity = found.city;
                                        }
                                    }

                                    const amount = calculateBookingAmount(b);
                                    const isActuallyPaid = b.payment_status === 'paid' || (b.status || '').toLowerCase() === 'confirmed';

                                    return (
                                        <tr key={b.id || b._id}>
                                            <td style={{ fontFamily: 'monospace', color: '#6b7280' }}>#{(b.id || b._id || '').toString().slice(-4)}</td>
                                            <td>
                                                <div style={{ fontWeight: '600' }}>{propName}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{propCity}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: '500', fontSize:'14px' }}>{b.username}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>UID: {b.user_id}</div>
                                            </td>
                                            <td style={{ fontSize: '13px' }}>
                                                {new Date(b.start_date).toLocaleDateString()} <br/>to {new Date(b.end_date).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`sa-badge-type`} style={{
                                                    background: (b.status||'').toLowerCase() === 'accepted' ? '#dcfce7' : (b.status||'').toLowerCase() === 'rejected' ? '#fee2e2' : (b.status||'').toLowerCase() === 'cancelled' ? '#f3f4f6' : (b.status||'').toLowerCase() === 'confirmed' || b.payment_status === 'paid' ? '#dcfce7' : '#fef3c7',
                                                    color: (b.status||'').toLowerCase() === 'accepted' ? '#166534' : (b.status||'').toLowerCase() === 'rejected' ? '#991b1b' : (b.status||'').toLowerCase() === 'cancelled' ? '#64748b' : (b.status||'').toLowerCase() === 'confirmed' || b.payment_status === 'paid' ? '#166534' : '#92400e',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {(b.status||'').toLowerCase() === 'confirmed' || b.payment_status === 'paid' ? 'Paid' : b.status || 'Pending'}
                                                </span>
                                                {(b.status||'').toLowerCase() === 'cancelled' && b.cancel_reason && (
                                                    <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '4px', maxWidth: '120px', fontStyle: 'italic' }}>
                                                        Reason: {b.cancel_reason}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ fontFamily: 'Inter', fontWeight: 'bold', color: isActuallyPaid ? '#16a34a' : '#1e293b' }}>
                                                {amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : '—'}
                                            </td>
                                            <td>
                                                <div className="sa-actions">
                                                    {(b.status||'').toLowerCase() === 'pending' && (
                                                        <>
                                                         <button 
                                                            className="sa-btn-primary" 
                                                            style={{ background: '#10b981', padding: '6px 12px' }}
                                                            onClick={() => handleBookingAction(b.id || b._id, 'accept')}
                                                            title="Accept"
                                                         >
                                                            Accept
                                                         </button>
                                                         <button 
                                                            className="sa-btn-danger" 
                                                            style={{ padding: '6px 12px' }}
                                                            onClick={() => handleBookingAction(b.id || b._id, 'reject')}
                                                            title="Reject"
                                                         >
                                                            Reject
                                                         </button>
                                                        </>
                                                    )}
                                                    {(b.status||'').toLowerCase() !== 'pending' && (
                                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Processed</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {(() => {
                                    const filteredBookings = bookings.filter(b => bookingFilter === 'ALL' || (b.status||'').toLowerCase() === bookingFilter.toLowerCase());
                                    if (filteredBookings.length === 0) {
                                        return (
                                            <tr>
                                                <td colSpan="7" className="sa-empty">No bookings found for this filter.</td>
                                            </tr>
                                        );
                                    }
                                    return (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '12px', background: '#f8fafc' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                                                        Showing {((bookingPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(bookingPage * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length} bookings
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <button 
                                                            className="sa-btn-secondary" 
                                                            disabled={bookingPage === 1}
                                                            onClick={() => setBookingPage(p => Math.max(1, p - 1))}
                                                            style={{ padding: '4px 12px', fontSize: '12px' }}
                                                        >
                                                            Prev
                                                        </button>
                                                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                                                            {bookingPage} / {Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1}
                                                        </span>
                                                        <button 
                                                            className="sa-btn-secondary" 
                                                            disabled={bookingPage >= Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)}
                                                            onClick={() => setBookingPage(p => Math.min(Math.ceil(filteredBookings.length / ITEMS_PER_PAGE), p + 1))}
                                                            style={{ padding: '4px 12px', fontSize: '12px' }}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })()}
                            </>
                        );
                    })()}
                </tbody>
                     </table>
                </div>
                </>
            )}

            {/* VIEW: PAYMENTS & REFUNDS */}
            {view === 'refunds' && (
                <div className="sa-table-container">
                    <div className="sa-table-header-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Payment & Refund Tracking</h3>
                                <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Monitor paid bookings and manage refund processing for cancellations.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Total Paid (Active)</div>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                                        ₹{bookings.filter(b => b.payment_status === 'paid' && b.status !== 'cancelled').reduce((acc, b) => acc + calculateBookingAmount(b), 0).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Total Refunds Due</div>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#dc2626' }}>
                                        ₹{bookings.filter(b => b.payment_status === 'paid' && b.status === 'cancelled').reduce((acc, b) => acc + calculateBookingAmount(b), 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="sa-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Property</th>
                                <th>User (Payer)</th>
                                <th>Total Paid</th>
                                <th>Status</th>
                                <th>Cancellation Details</th>
                                <th>Refund Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.filter(b => b.payment_status === 'paid' || (b.status === 'cancelled' && b.payment_status === 'paid')).map(b => {
                                const totalVal = calculateBookingAmount(b);
                                const isCancelled = b.status === "cancelled";
                                return (
                                    <tr key={b.id}>
                                        <td><span style={{ color: '#6366f1', fontWeight: '600' }}>#{b.id}</span></td>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{b.property?.name || b.property_name || b.property?.property_name || "Unknown Property"}</div>
                                            <div style={{ fontSize: '11px', color: '#888' }}>{b.property?.city || b.city || ""}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{b.username || "Unknown"}</div>
                                            <div style={{ fontSize: '11px', color: '#888' }}>ID: {b.user_id}</div>
                                        </td>
                                        <td style={{ fontWeight: '600' }}>₹{totalVal.toLocaleString()}</td>
                                        <td>
                                            <span style={{ 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                fontSize: '11px', 
                                                background: isCancelled ? '#fee2e2' : '#d1fae5', 
                                                color: isCancelled ? '#991b1b' : '#065f46',
                                                fontWeight: '600',
                                                border: `1px solid ${isCancelled ? '#fecaca' : '#a7f3d0'}`
                                            }}>
                                                {isCancelled ? "CANCELLED" : "ACTIVE PAID"}
                                            </span>
                                        </td>
                                        <td>
                                            {isCancelled ? (
                                                <div style={{ maxWidth: '250px' }}>
                                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#444' }}>
                                                        Reason: <span style={{ fontWeight: '400', fontStyle: 'italic' }}>"{b.cancel_reason || "Not specified"}"</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#999', fontSize: '12px' }}>No cancellation</span>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: '700', fontSize: '15px', color: isCancelled ? '#dc2626' : '#6b7280' }}>
                                            {isCancelled ? `₹${totalVal.toLocaleString()}` : "₹0"}
                                        </td>
                                        <td>
                                            {isCancelled ? (
                                                <button 
                                                    className="sa-btn-primary" 
                                                    style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: '#dc2626' }}
                                                    onClick={() => alert(`Initiating refund of ₹${totalVal.toLocaleString()} for Booking #${b.id}`)}
                                                >
                                                    Process Refund
                                                </button>
                                            ) : (
                                                <button 
                                                    className="sa-btn-primary" 
                                                    style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: '#6366f1' }}
                                                    onClick={() => setView('bookings')}
                                                >
                                                    View Details
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* VIEW: FINANCE */}
            {view === 'finance' && (
                <>
                <div className="sa-stats-grid">
                    <div className="sa-stat-card">
                         <div className="sa-stat-title">Total Revenue (Confirmed)</div>
                         <div className="sa-stat-val" style={{color: '#059669'}}>₹{stats.totalRevenue.toLocaleString()}</div>
                    </div>
                    <div className="sa-stat-card">
                         <div className="sa-stat-title">Pending Revenue</div>
                         <div className="sa-stat-val" style={{color: '#d97706'}}>₹{stats.pendingRevenue.toLocaleString()}</div>
                    </div>
                    <div className="sa-stat-card">
                         <div className="sa-stat-title">Avg. Booking Value</div>
                         <div className="sa-stat-val">₹{stats.totalBookings > 0 ? Math.round((stats.totalRevenue + stats.pendingRevenue) / stats.totalBookings).toLocaleString() : 0}</div>
                    </div>
                </div>
                <div className="sa-chart-box" style={{ textAlign:'center', padding:'40px' }}>
                    <p style={{ color:'#64748b' }}>Detailed Transaction Logs are currently being synchronized with the Payment Gateway.</p>
                </div>
                </>
            )}

            {/* VIEW: LEADS */}
            {view === 'leads' && (
                <div className="sa-table-container">
                    <div className="sa-table-header-row">
                        <h3>Leads & Form Inquiries</h3>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <select 
                                className="sa-search-input" 
                                style={{ width: '200px' }}
                                value={leadFilterSource}
                                onChange={(e) => {
                                    setLeadFilterSource(e.target.value);
                                    setLeadPage(1);
                                }}
                            >
                                <option value="ALL">All Sources</option>
                                <option value="Career Support Form">Career Support Form</option>
                                {Array.from(new Set(leads.map(l => l.source))).filter(s => s && s !== "Career Support Form").map(source => (
                                    <option key={source} value={source}>{source}</option>
                                ))}
                            </select>
                            <input 
                                type="text" 
                                placeholder="Search leads..." 
                                className="sa-search-input"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setLeadPage(1);
                                }}
                            />
                            <button className="sa-btn-primary" onClick={fetchAllLeads}>Refresh</button>
                        </div>
                    </div>
                    <table className="sa-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Contact Number</th>
                                <th>Property/Purpose</th>
                                <th>Source</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const filtered = leads.filter(l => {
                                    // Source Filter
                                    if (leadFilterSource !== "ALL" && l.source !== leadFilterSource) return false;

                                    if(!searchTerm) return true;
                                    const s = searchTerm.toLowerCase();
                                    return (l.name || "").toLowerCase().includes(s) || 
                                           (l.phone_number || "").toLowerCase().includes(s) || 
                                           (l.purpose || "").toLowerCase().includes(s) ||
                                           (l.source || "").toLowerCase().includes(s);
                                });
                                const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                                
                                return (
                                    <>
                                        {filtered.slice((leadPage - 1) * ITEMS_PER_PAGE, leadPage * ITEMS_PER_PAGE).map(lead => (
                                            <tr key={lead.id}>
                                                <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                                                <td style={{ fontWeight: '600' }}>{lead.name}</td>
                                                <td style={{ fontFamily: 'Inter' }}>{lead.phone_number}</td>
                                                <td>
                                                    <div style={{ maxWidth: '300px' }}>
                                                        <div style={{ fontWeight: '600', color: '#3b82f6', marginBottom: '4px' }}>
                                                            {lead.property_name || "General Inquiry"}
                                                        </div>
                                                        <div style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'pre-wrap' }}>
                                                            {lead.purpose}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="sa-badge-type standard">{lead.source || "N/A"}</span></td>
                                                <td>
                                                    <span className="sa-admin-tag" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#dcfce7' }}>
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="sa-empty">No leads found in the database.</td>
                                            </tr>
                                        )}
                                        {filtered.length > 0 && (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '20px', background: '#f8fafc' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                                                            Showing {((leadPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(leadPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} leads
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button 
                                                                className="sa-btn-primary" 
                                                                disabled={leadPage === 1}
                                                                onClick={() => setLeadPage(p => p - 1)}
                                                                style={{ backgroundColor: leadPage === 1 ? '#e2e8f0' : '#3b82f6', color: leadPage === 1 ? '#94a3b8' : '#fff', cursor: leadPage === 1 ? 'not-allowed' : 'pointer' }}
                                                            >
                                                                Previous
                                                            </button>
                                                            <button 
                                                                className="sa-btn-primary" 
                                                                disabled={leadPage >= totalPages}
                                                                onClick={() => setLeadPage(p => p + 1)}
                                                                style={{ backgroundColor: leadPage >= totalPages ? '#e2e8f0' : '#3b82f6', color: leadPage >= totalPages ? '#94a3b8' : '#fff', cursor: leadPage >= totalPages ? 'not-allowed' : 'pointer' }}
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })()}
</tbody>
                    </table>
                </div>
            )}

            {/* VIEW: SETTINGS */}
            {view === 'settings' && (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="sa-chart-box" style={{ padding: '40px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>Platform Configurations</h3>
                        
                        <div className="sa-input-group">
                            <label>Site Name</label>
                            <input 
                                value={settings.siteName} 
                                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                            />
                        </div>

                        <div className="sa-input-group">
                            <label>Admin Contact Email</label>
                            <input 
                                value={settings.adminEmail} 
                                onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                            />
                        </div>

                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                             <div className="sa-input-group">
                                 <label>Service Fee (%)</label>
                                 <input 
                                     type="number"
                                     value={settings.serviceFee} 
                                     onChange={(e) => setSettings({...settings, serviceFee: e.target.value})}
                                 />
                             </div>
                             
                             <div className="sa-input-group">
                                 <label>Maintenance Mode</label>
                                 <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                     <button 
                                        onClick={() => setSettings({...settings, maintenanceMode: true})}
                                        style={{ 
                                            padding: '8px 16px', 
                                            borderRadius: '6px', 
                                            border: '1px solid #e2e8f0',
                                            background: settings.maintenanceMode ? '#ef4444' : '#fff',
                                            color: settings.maintenanceMode ? '#fff' : '#64748b',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                     >On</button>
                                     <button 
                                        onClick={() => setSettings({...settings, maintenanceMode: false})}
                                        style={{ 
                                            padding: '8px 16px', 
                                            borderRadius: '6px', 
                                            border: '1px solid #e2e8f0',
                                            background: !settings.maintenanceMode ? '#10b981' : '#fff',
                                            color: !settings.maintenanceMode ? '#fff' : '#64748b',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                     >Off</button>
                                 </div>
                             </div>
                         </div>

                         <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                             <button className="sa-btn-primary" onClick={() => alert("Settings saved successfully!")} style={{ padding: '12px 24px', fontSize: '15px' }}>Save Configuration</button>
                         </div>
                    </div>
                </div>
            )}

            {/* VIEW: META LEADS */}
            {view === 'meta-leads' && (() => {
                const totalPages = Math.ceil(metaLeadsTotal / META_LEADS_LIMIT);
                const statusColors = {
                    new:       { bg: '#eff6ff', color: '#2563eb', border: '#dbeafe' },
                    contacted: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
                    converted: { bg: '#f0fdf4', color: '#16a34a', border: '#dcfce7' },
                    lost:      { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
                };
                return (
                <div>
                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        <div className="sa-stat-card">
                            <div className="sa-stat-label">Total Meta Leads</div>
                            <div className="sa-stat-value">{metaLeadsStats.total}</div>
                        </div>
                        <div className="sa-stat-card">
                            <div className="sa-stat-label">New Leads</div>
                            <div className="sa-stat-value" style={{ color: '#3b82f6' }}>{metaLeadsStats.new}</div>
                        </div>
                        <div className="sa-stat-card">
                            <div className="sa-stat-label">Contacted</div>
                            <div className="sa-stat-value" style={{ color: '#f59e0b' }}>{metaLeadsStats.contacted}</div>
                        </div>
                        <div className="sa-stat-card">
                            <div className="sa-stat-label">Converted</div>
                            <div className="sa-stat-value" style={{ color: '#10b981' }}>{metaLeadsStats.converted}</div>
                        </div>
                    </div>

                    <div className="sa-table-container">
                        <div className="sa-table-header-row">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Meta Ads Leads
                                {metaLeadsLoading && <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: 400 }}>Refreshing...</span>}
                                {metaLeadLastRefresh && !metaLeadsLoading && (
                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>
                                        Last updated: {metaLeadLastRefresh.toLocaleTimeString()}
                                    </span>
                                )}
                            </h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <select
                                    className="sa-search-input"
                                    style={{ width: '160px' }}
                                    value={metaLeadStatusFilter}
                                    onChange={(e) => { setMetaLeadStatusFilter(e.target.value); setMetaLeadPage(1); }}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="converted">Converted</option>
                                    <option value="lost">Lost</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search name, phone, location..."
                                    className="sa-search-input"
                                    value={metaLeadSearch}
                                    onChange={(e) => { setMetaLeadSearch(e.target.value); setMetaLeadPage(1); }}
                                />
                                <button className="sa-btn-primary" onClick={() => { fetchMetaLeads(metaLeadPage, metaLeadSearch, metaLeadStatusFilter); fetchMetaLeadsStats(); }} disabled={metaLeadsLoading}>
                                    {metaLeadsLoading ? 'Loading...' : '↻ Refresh'}
                                </button>
                                <button
                                    onClick={syncHistoricalLeads}
                                    disabled={metaSyncing || metaLeadsLoading}
                                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: metaSyncing ? '#f1f5f9' : '#fff', color: metaSyncing ? '#94a3b8' : '#374151', fontWeight: 600, fontSize: '13px', cursor: metaSyncing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                    {metaSyncing ? '⏳ Syncing...' : '⇄ Sync Historical'}
                                </button>
                            </div>
                        </div>

                        {metaLeads.length === 0 && !metaLeadsLoading ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No Meta Leads Yet</div>
                                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                                    Leads will appear here automatically once the Meta webhook is live and ads start running.
                                </div>
                            </div>
                        ) : (
                            <table className="sa-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>City</th>
                                        <th>Room Type</th>
                                        <th>Budget</th>
                                        <th>Campaign</th>
                                        <th>Ad Name</th>
                                        <th>Platform</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metaLeads.map((lead, idx) => {
                                        const statusKey = (lead.lead_status || 'new').toLowerCase();
                                        const sc = statusColors[statusKey] || statusColors.new;
                                        const platform = (lead.platform || '').toLowerCase();
                                        const platformStyle = platform === 'instagram'
                                            ? { bg: '#fdf2f8', color: '#9333ea', border: '#f5d0fe' }
                                            : { bg: '#eff6ff', color: '#2563eb', border: '#dbeafe' };
                                        const budget = lead.budget
                                            ? (isNaN(Number(lead.budget)) ? lead.budget : `₹${Number(lead.budget).toLocaleString('en-IN')}`)
                                            : '—';
                                        return (
                                            <tr key={lead.id || lead._id || idx}>
                                                <td style={{ whiteSpace: 'nowrap', fontSize: '11px', color: '#64748b' }}>
                                                    {(() => { const d = lead.created_time || lead.created_at; return d ? new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'; })()}
                                                </td>
                                                <td style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{lead.full_name || '—'}</td>
                                                <td>
                                                    <a href={`tel:${lead.phone}`} style={{ fontFamily: 'monospace', fontSize: '13px', color: '#0f172a', textDecoration: 'none' }}>
                                                        {lead.phone || '—'}
                                                    </a>
                                                </td>
                                                <td style={{ fontSize: '12px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lead.email}>
                                                    {lead.email ? <a href={`mailto:${lead.email}`} style={{ color: '#6366f1', textDecoration: 'none' }}>{lead.email}</a> : '—'}
                                                </td>
                                                <td>{lead.location || '—'}</td>
                                                <td>
                                                    {lead.room_type
                                                        ? <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '11px', fontWeight: 600, background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' }}>{lead.room_type}</span>
                                                        : '—'}
                                                </td>
                                                <td style={{ fontWeight: '700', color: '#059669', whiteSpace: 'nowrap' }}>{budget}</td>
                                                <td style={{ fontSize: '12px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#374151' }} title={lead.campaign_name}>
                                                    {lead.campaign_name || '—'}
                                                </td>
                                                <td style={{ fontSize: '12px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#374151' }} title={lead.ad_name}>
                                                    {lead.ad_name || '—'}
                                                </td>
                                                <td>
                                                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: platformStyle.bg, color: platformStyle.color, border: `1px solid ${platformStyle.border}`, textTransform: 'capitalize' }}>
                                                        {lead.platform || 'Meta'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={statusKey}
                                                        onChange={(e) => updateMetaLeadStatus(lead.id || lead._id, e.target.value)}
                                                        style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, cursor: 'pointer', outline: 'none', textTransform: 'capitalize' }}
                                                    >
                                                        <option value="new">🔵 New</option>
                                                        <option value="contacted">🟡 Contacted</option>
                                                        <option value="converted">🟢 Converted</option>
                                                        <option value="lost">🔴 Lost</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {metaLeads.length === 0 && (
                                        <tr><td colSpan="11" className="sa-empty">No leads match your search/filter.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* Pagination */}
                        {metaLeadsTotal > META_LEADS_LIMIT && (
                            <div style={{ padding: '20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                    Showing {((metaLeadPage - 1) * META_LEADS_LIMIT) + 1}–{Math.min(metaLeadPage * META_LEADS_LIMIT, metaLeadsTotal)} of {metaLeadsTotal} leads
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="sa-btn-primary"
                                        disabled={metaLeadPage === 1}
                                        onClick={() => setMetaLeadPage(p => p - 1)}
                                        style={{ backgroundColor: metaLeadPage === 1 ? '#e2e8f0' : '#6366f1', color: metaLeadPage === 1 ? '#94a3b8' : '#fff', cursor: metaLeadPage === 1 ? 'not-allowed' : 'pointer' }}
                                    >Previous</button>
                                    <span style={{ padding: '6px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                                        {metaLeadPage} / {totalPages}
                                    </span>
                                    <button
                                        className="sa-btn-primary"
                                        disabled={metaLeadPage >= totalPages}
                                        onClick={() => setMetaLeadPage(p => p + 1)}
                                        style={{ backgroundColor: metaLeadPage >= totalPages ? '#e2e8f0' : '#6366f1', color: metaLeadPage >= totalPages ? '#94a3b8' : '#fff', cursor: metaLeadPage >= totalPages ? 'not-allowed' : 'pointer' }}
                                    >Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                );
            })()}

            {/* VIEW: LANDING PAGE LEADS — from the ads landing page (/get-started) lead form only */}
            {view === 'landing-leads' && (() => {
                const totalPages = Math.ceil(landingLeadsTotal / LANDING_LEADS_LIMIT);
                return (
                <div>
                    <div className="sa-table-container">
                        <div className="sa-table-header-row">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Landing Page Leads
                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>Total: {landingLeadsTotal}</span>
                                {landingLeadsLoading && <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: 400 }}>Refreshing...</span>}
                                {landingLeadLastRefresh && !landingLeadsLoading && (
                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>
                                        Last updated: {landingLeadLastRefresh.toLocaleTimeString()}
                                    </span>
                                )}
                            </h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <select
                                    className="sa-search-input"
                                    style={{ width: '150px' }}
                                    value={landingLeadCityFilter}
                                    onChange={(e) => { setLandingLeadCityFilter(e.target.value); setLandingLeadPage(1); }}
                                >
                                    <option value="ALL">All Cities</option>
                                    {LANDING_LEAD_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select
                                    className="sa-search-input"
                                    style={{ width: '180px' }}
                                    value={landingLeadCategoryFilter}
                                    onChange={(e) => { setLandingLeadCategoryFilter(e.target.value); setLandingLeadPage(1); }}
                                >
                                    <option value="ALL">All Categories</option>
                                    {LANDING_LEAD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search name or phone..."
                                    className="sa-search-input"
                                    value={landingLeadSearch}
                                    onChange={(e) => { setLandingLeadSearch(e.target.value); setLandingLeadPage(1); }}
                                />
                                <button className="sa-btn-primary" onClick={() => fetchLandingLeads(landingLeadPage, landingLeadSearch, landingLeadCityFilter, landingLeadCategoryFilter)} disabled={landingLeadsLoading}>
                                    {landingLeadsLoading ? 'Loading...' : '↻ Refresh'}
                                </button>
                            </div>
                        </div>

                        {landingLeads.length === 0 && !landingLeadsLoading ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No Landing Page Leads Yet</div>
                                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                                    Leads submitted from the /get-started ads landing page will appear here.
                                </div>
                            </div>
                        ) : (
                            <table className="sa-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Category</th>
                                        <th>City</th>
                                        <th>Timeframe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {landingLeads.map((lead, idx) => (
                                        <tr key={lead.id || lead._id || idx}>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: '11px', color: '#64748b' }}>
                                                {lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                            </td>
                                            <td style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{lead.name || '—'}</td>
                                            <td>
                                                <a href={`tel:${lead.phone}`} style={{ fontFamily: 'monospace', fontSize: '13px', color: '#0f172a', textDecoration: 'none' }}>
                                                    {lead.phone || '—'}
                                                </a>
                                            </td>
                                            <td style={{ fontSize: '12px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lead.email}>
                                                {lead.email ? <a href={`mailto:${lead.email}`} style={{ color: '#6366f1', textDecoration: 'none' }}>{lead.email}</a> : '—'}
                                            </td>
                                            <td>
                                                {lead.category
                                                    ? <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '11px', fontWeight: 600, background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' }}>{lead.category}</span>
                                                    : '—'}
                                            </td>
                                            <td>{lead.city || '—'}</td>
                                            <td style={{ fontSize: '12px', color: '#374151' }}>{lead.timeframe || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Pagination */}
                        {landingLeadsTotal > LANDING_LEADS_LIMIT && (
                            <div style={{ padding: '20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                    Showing {((landingLeadPage - 1) * LANDING_LEADS_LIMIT) + 1}–{Math.min(landingLeadPage * LANDING_LEADS_LIMIT, landingLeadsTotal)} of {landingLeadsTotal} leads
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="sa-btn-primary"
                                        disabled={landingLeadPage === 1}
                                        onClick={() => setLandingLeadPage(p => p - 1)}
                                        style={{ backgroundColor: landingLeadPage === 1 ? '#e2e8f0' : '#6366f1', color: landingLeadPage === 1 ? '#94a3b8' : '#fff', cursor: landingLeadPage === 1 ? 'not-allowed' : 'pointer' }}
                                    >Previous</button>
                                    <span style={{ padding: '6px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                                        {landingLeadPage} / {totalPages}
                                    </span>
                                    <button
                                        className="sa-btn-primary"
                                        disabled={landingLeadPage >= totalPages}
                                        onClick={() => setLandingLeadPage(p => p + 1)}
                                        style={{ backgroundColor: landingLeadPage >= totalPages ? '#e2e8f0' : '#6366f1', color: landingLeadPage >= totalPages ? '#94a3b8' : '#fff', cursor: landingLeadPage >= totalPages ? 'not-allowed' : 'pointer' }}
                                    >Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                );
            })()}

            {/* VIEW: REVIEW FEEDBACK */}
            {view === 'reviews' && (() => {
                const filtered = reviewsList.filter(r => {
                    if (reviewStatusFilter !== 'ALL' && r.review_status !== reviewStatusFilter) return false;
                    if (!reviewSearch) return true;
                    const s = reviewSearch.toLowerCase();
                    return (r.username || '').toLowerCase().includes(s) ||
                           (r.property_name || '').toLowerCase().includes(s) ||
                           (r.remarks || '').toLowerCase().includes(s);
                });
                const totalPages = Math.ceil(filtered.length / REVIEWS_PER_PAGE);
                const paginated = filtered.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);

                const pendingCount  = reviewsList.filter(r => r.review_status === 'pending').length;
                const approvedCount = reviewsList.filter(r => r.review_status === 'approved').length;
                const rejectedCount = reviewsList.filter(r => r.review_status === 'rejected').length;

                const starColor = (n) => {
                    if (n >= 5) return '#166534';
                    if (n >= 4) return '#15803d';
                    if (n >= 3) return '#d97706';
                    return '#dc2626';
                };

                const Stars = ({ val }) => (
                    <span style={{ color: '#f59e0b', fontSize: '13px', letterSpacing: '1px' }}>
                        {'★'.repeat(Math.round(val || 0))}{'☆'.repeat(5 - Math.round(val || 0))}
                    </span>
                );

                return (
                <div>
                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        <div className="sa-stat-card">
                            <div className="sa-stat-label">Total Reviews</div>
                            <div className="sa-stat-value">{reviewsList.length}</div>
                        </div>
                        <div className="sa-stat-card">
                            <div className="sa-stat-label">Pending</div>
                            <div className="sa-stat-value" style={{ color: '#f59e0b' }}>{pendingCount}</div>
                        </div>
                        <div className="sa-stat-card">
                            <div className="sa-stat-label">Approved</div>
                            <div className="sa-stat-value" style={{ color: '#10b981' }}>{approvedCount}</div>
                        </div>
                        <div className="sa-stat-card">
                            <div className="sa-stat-label">Rejected</div>
                            <div className="sa-stat-value" style={{ color: '#ef4444' }}>{rejectedCount}</div>
                        </div>
                    </div>

                    <div className="sa-table-container">
                        <div className="sa-table-header-row">
                            <h3>Customer Reviews</h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <select
                                    className="sa-search-input"
                                    style={{ width: '150px' }}
                                    value={reviewStatusFilter}
                                    onChange={(e) => { setReviewStatusFilter(e.target.value); setReviewPage(1); }}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search by name, property, review..."
                                    className="sa-search-input"
                                    value={reviewSearch}
                                    onChange={(e) => { setReviewSearch(e.target.value); setReviewPage(1); }}
                                />
                                <button className="sa-btn-primary" onClick={fetchReviews} disabled={reviewsLoading}>
                                    {reviewsLoading ? 'Loading...' : 'Refresh'}
                                </button>
                            </div>
                        </div>

                        <table className="sa-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Property</th>
                                    <th>Overall</th>
                                    <th>Cleanliness</th>
                                    <th>Location</th>
                                    <th>Value</th>
                                    <th>Staff</th>
                                    <th>Review</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((r, idx) => {
                                    const isPending  = r.review_status === 'pending';
                                    const isApproved = r.review_status === 'approved';
                                    const isRejected = r.review_status === 'rejected';
                                    return (
                                        <tr key={r.id || idx}>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: '#64748b' }}>
                                                {r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : '—'}
                                            </td>
                                            <td style={{ fontWeight: '600', minWidth: '110px' }}>{r.username || '—'}</td>
                                            <td style={{ fontSize: '12px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#3b82f6' }} title={r.property_name}>
                                                {r.property_name || '—'}
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: '700', fontSize: '14px', color: starColor(r.overall_experience) }}>
                                                    {r.overall_experience} ★
                                                </span>
                                            </td>
                                            <td><Stars val={r.cleanliness} /></td>
                                            <td><Stars val={r.location} /></td>
                                            <td><Stars val={r.value_for_money} /></td>
                                            <td><Stars val={r.staff_behavior} /></td>
                                            <td style={{ maxWidth: '200px' }}>
                                                <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                    {r.remarks || '—'}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                                    background: isApproved ? '#f0fdf4' : isRejected ? '#fef2f2' : '#fffbeb',
                                                    color:      isApproved ? '#16a34a' : isRejected ? '#dc2626' : '#d97706',
                                                    border: `1px solid ${isApproved ? '#dcfce7' : isRejected ? '#fecaca' : '#fde68a'}`,
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {r.review_status || 'pending'}
                                                </span>
                                            </td>
                                            <td>
                                                {isPending && (
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button
                                                            onClick={() => updateReviewStatus(r.id, 'approved')}
                                                            style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                                        >
                                                            ✓ Approve
                                                        </button>
                                                        <button
                                                            onClick={() => updateReviewStatus(r.id, 'rejected')}
                                                            style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                                        >
                                                            ✕ Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {isApproved && (
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>✓ Live on site</span>
                                                        <button
                                                            onClick={() => updateReviewStatus(r.id, 'rejected')}
                                                            style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {isRejected && (
                                                    <button
                                                        onClick={() => updateReviewStatus(r.id, 'approved')}
                                                        style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #a7f3d0', background: '#fff', color: '#10b981', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                                    >
                                                        Re-Approve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {paginated.length === 0 && (
                                    <tr><td colSpan="11" className="sa-empty">No reviews found.</td></tr>
                                )}
                            </tbody>
                        </table>

                        {filtered.length > REVIEWS_PER_PAGE && (
                            <div style={{ padding: '20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                    Showing {((reviewPage - 1) * REVIEWS_PER_PAGE) + 1}–{Math.min(reviewPage * REVIEWS_PER_PAGE, filtered.length)} of {filtered.length} reviews
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="sa-btn-primary" disabled={reviewPage === 1} onClick={() => setReviewPage(p => p - 1)}
                                        style={{ backgroundColor: reviewPage === 1 ? '#e2e8f0' : '#3b82f6', color: reviewPage === 1 ? '#94a3b8' : '#fff', cursor: reviewPage === 1 ? 'not-allowed' : 'pointer' }}>
                                        Previous
                                    </button>
                                    <span style={{ padding: '6px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                                        {reviewPage} / {totalPages}
                                    </span>
                                    <button className="sa-btn-primary" disabled={reviewPage >= totalPages} onClick={() => setReviewPage(p => p + 1)}
                                        style={{ backgroundColor: reviewPage >= totalPages ? '#e2e8f0' : '#3b82f6', color: reviewPage >= totalPages ? '#94a3b8' : '#fff', cursor: reviewPage >= totalPages ? 'not-allowed' : 'pointer' }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                );
            })()}

            {/* VIEW: VERIFICATION BADGES */}
            {view === 'verification' && (() => {
                const getMeta = (p) => {
                    if (!p.meta) return {};
                    if (typeof p.meta === 'object') return p.meta;
                    try { return JSON.parse(p.meta); } catch { return {}; }
                };

                const getPrice = (p) => {
                    const meta = getMeta(p);
                    return Number(p.price) || Number(meta.perNightPrice) || Number(meta.perMonthPrice) || Number(p.base_rate) || 0;
                };

                const getCoverImg = (p) => {
                    const photos = Array.isArray(p.photos) ? p.photos : [];
                    const idx = Number(p.cover_photo_index);
                    const photo = (!isNaN(idx) && photos[idx]) ? photos[idx] : photos[0];
                    if (!photo) return null;
                    if (photo.startsWith('http')) return photo;
                    return `https://www.townmanor.ai/api/uploads/${photo.startsWith('/') ? photo.substring(1) : photo}`;
                };

                const getRentalType = (p) => {
                    const bt = Number(p.booking_type);
                    if (bt === 0) return 'monthly';
                    return 'nightly';
                };

                const filtered = properties.filter(p => {
                    const meta = getMeta(p);
                    const cat = (p.property_category || meta.propertyCategory || '').toLowerCase();
                    const name = (p.property_name || '').toLowerCase();
                    const city = (p.city || p.address || '').toLowerCase();
                    const owner = (p.owner_name || '').toLowerCase();
                    const rt = getRentalType(p);

                    if (vbCategory !== 'ALL') {
                        if (vbCategory === 'Signature' && !name.includes('signature') && !name.includes('ovika')) return false;
                        if (vbCategory !== 'Signature' && cat !== vbCategory.toLowerCase()) return false;
                    }
                    if (vbRentalType !== 'ALL' && rt !== vbRentalType) return false;
                    if (vbCity && !city.includes(vbCity.toLowerCase())) return false;
                    if (vbSearch) {
                        const s = vbSearch.toLowerCase();
                        if (!name.includes(s) && !owner.includes(s) && !String(p.id).includes(s)) return false;
                    }
                    return true;
                });

                const toggleBadge = async (prop, add) => {
                    setVbLoading(true);
                    try {
                        const res = await fetch(`https://www.townmanor.ai/api/ovika/properties/${prop.id}/badge`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ verified_badge: add }),
                        });
                        if (res.ok) {
                            const updatedMeta = { ...getMeta(prop), verified_badge: add };
                            setProperties(prev => prev.map(p => p.id === prop.id
                                ? { ...p, meta: updatedMeta }
                                : p
                            ));
                            alert(`Badge ${add ? 'added to' : 'removed from'} "${prop.property_name}" successfully!`);
                        } else {
                            const err = await res.json().catch(() => ({}));
                            alert(`Failed: ${err.message || res.status + ' ' + res.statusText}`);
                        }
                    } catch (e) {
                        alert('Network error. Please try again.');
                    } finally {
                        setVbLoading(false);
                    }
                };

                return (
                <div style={{ padding: '0' }}>
                    {/* Filters */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <input
                            placeholder="Search name, owner, ID..."
                            value={vbSearch}
                            onChange={e => setVbSearch(e.target.value)}
                            style={{ flex: '1 1 200px', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
                        />
                        <select value={vbCategory} onChange={e => setVbCategory(e.target.value)}
                            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#fff', cursor: 'pointer' }}>
                            <option value="ALL">All Categories</option>
                            <option value="Signature">Signature Stays</option>
                            <option value="Premium Stay">Premium Stay</option>
                            <option value="Economy Stay">Economy Stay</option>
                            <option value="PG">PG</option>
                            <option value="Co-living">Co-living</option>
                        </select>
                        <select value={vbRentalType} onChange={e => setVbRentalType(e.target.value)}
                            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#fff', cursor: 'pointer' }}>
                            <option value="ALL">All Types</option>
                            <option value="nightly">Nightly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <input
                            placeholder="Filter by city..."
                            value={vbCity}
                            onChange={e => setVbCity(e.target.value)}
                            style={{ width: 160, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#64748b', fontWeight: 600, marginLeft: 4 }}>
                            {filtered.length} properties
                        </span>
                    </div>

                    {/* Table */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        {['ID', 'Image', 'Property Name', 'Owner', 'Category', 'Type', 'Location', 'Price', 'Badge', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={10} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No properties found</td></tr>
                                    ) : filtered.map((p, idx) => {
                                        const meta = getMeta(p);
                                        const hasBadge = Number(p.verified_badge) === 1 || !!meta.verified_badge;
                                        const coverImg = getCoverImg(p);
                                        const price = getPrice(p);
                                        const rt = getRentalType(p);
                                        const cat = p.property_category || meta.propertyCategory || '—';
                                        return (
                                            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbfc', transition: 'background 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                                                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fafbfc'}>
                                                <td style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>#{p.id}</td>
                                                <td style={{ padding: '8px 14px' }}>
                                                    {coverImg
                                                        ? <img src={coverImg} alt="" style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} onError={e => { e.target.style.display = 'none'; }} />
                                                        : <div style={{ width: 60, height: 44, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 10 }}>No img</div>
                                                    }
                                                </td>
                                                <td style={{ padding: '10px 14px', maxWidth: 180 }}>
                                                    <div style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>{p.property_name || '—'}</div>
                                                </td>
                                                <td style={{ padding: '10px 14px', color: '#374151' }}>{p.owner_name || '—'}</td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: cat === 'PG' ? '#fef3c7' : cat === 'Economy Stay' ? '#f0fdf4' : '#fdf4ff', color: cat === 'PG' ? '#92400e' : cat === 'Economy Stay' ? '#166534' : '#7c3aed' }}>
                                                        {cat}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: rt === 'nightly' ? '#eff6ff' : '#f0fdf4', color: rt === 'nightly' ? '#1d4ed8' : '#15803d' }}>
                                                        {rt === 'nightly' ? '🌙 Nightly' : '📅 Monthly'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '10px 14px', color: '#374151', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.city || p.address || '—'}</td>
                                                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#C98B3E' }}>
                                                    {price ? `₹${price.toLocaleString('en-IN')}` : '—'}
                                                </td>
                                                <td style={{ padding: '10px 14px' }}>
                                                    {hasBadge
                                                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: '#d1fae5', color: '#065f46' }}>✔ Verified</span>
                                                        : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#f1f5f9', color: '#94a3b8' }}>— None</span>
                                                    }
                                                </td>
                                                <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <button
                                                            disabled={hasBadge || vbLoading}
                                                            onClick={() => toggleBadge(p, true)}
                                                            style={{ padding: '6px 12px', borderRadius: 7, border: 'none', cursor: hasBadge ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 12, background: hasBadge ? '#e2e8f0' : '#C98B3E', color: hasBadge ? '#94a3b8' : '#fff', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                                                            + Add Badge
                                                        </button>
                                                        <button
                                                            disabled={!hasBadge || vbLoading}
                                                            onClick={() => toggleBadge(p, false)}
                                                            style={{ padding: '6px 12px', borderRadius: 7, border: 'none', cursor: !hasBadge ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 12, background: !hasBadge ? '#e2e8f0' : '#fee2e2', color: !hasBadge ? '#94a3b8' : '#dc2626', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                                                            ✕ Remove
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                );
            })()}

            {/* VIEW: SELF VERIFICATION */}
            {view === 'self-verification' && (() => {
                const API_IMG = 'https://www.townmanor.ai';

                const imgUrl = (path) => {
                    if (!path) return null;
                    if (path.startsWith('http')) return path;
                    return `${API_IMG}/${path.replace(/^\//, '')}`;
                };

                const addBadge = async (sv, add) => {
                    const propId = sv.property_id;
                    if (!propId) { alert('Property ID not found in this submission.'); return; }
                    setSvBadgeLoading(true);
                    try {
                        const res = await fetch(`https://www.townmanor.ai/api/ovika/properties/${propId}/badge`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ verified_badge: add }),
                        });
                        if (res.ok) {
                            showToast(add ? `🏅 Self-verified badge added to Property #${propId}!` : `Badge removed from Property #${propId}.`, add ? 'success' : 'error');
                        } else {
                            const err = await res.json().catch(() => ({}));
                            showToast(`Failed: ${err.message || res.status}`, 'error');
                        }
                    } catch { showToast('Network error. Please try again.', 'error'); }
                    finally { setSvBadgeLoading(false); }
                };

                const statusColors = {
                    submitted: { bg: '#eff6ff', color: '#3b82f6', label: 'Submitted' },
                    approved:  { bg: '#f0fdf4', color: '#16a34a', label: 'Approved'  },
                    rejected:  { bg: '#fef2f2', color: '#dc2626', label: 'Rejected'  },
                };

                const filtered = svList.filter(sv => {
                    if (!svSearch) return true;
                    const s = svSearch.toLowerCase();
                    return (sv.mobile_number || '').includes(s) ||
                        (sv.owner_id || '').toString().includes(s) ||
                        (sv.property_id || '').toString().includes(s) ||
                        (sv.map_address || '').toLowerCase().includes(s);
                });

                return (
                <div>
                    {/* Reject Remark Modal */}
                    {svRejectTarget && (
                        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}
                            onClick={() => { setSvRejectTarget(null); setSvRejectReason(''); }}>
                            <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:14, padding:'28px 28px 22px', width:420, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
                                <h3 style={{ margin:'0 0 6px', fontSize:17, color:'#1e293b', fontWeight:700 }}>Reject Submission</h3>
                                <p style={{ margin:'0 0 16px', fontSize:13, color:'#64748b' }}>
                                    Owner ID: <strong>{svRejectTarget.owner_id || '—'}</strong> &nbsp;|&nbsp; Prop ID: <strong>{svRejectTarget.property_id || '—'}</strong>
                                </p>
                                <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>Rejection Reason / Remark *</label>
                                <textarea
                                    rows={4}
                                    placeholder="e.g. Photos blurry hain, please retake with better lighting..."
                                    value={svRejectReason}
                                    onChange={e => setSvRejectReason(e.target.value)}
                                    style={{ width:'100%', boxSizing:'border-box', padding:'10px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:13, fontFamily:'inherit', resize:'vertical', outline:'none' }}
                                />
                                <div style={{ display:'flex', gap:10, marginTop:16, justifyContent:'flex-end' }}>
                                    <button onClick={() => { setSvRejectTarget(null); setSvRejectReason(''); }}
                                        style={{ padding:'8px 18px', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:13, cursor:'pointer' }}>
                                        Cancel
                                    </button>
                                    <button
                                        disabled={!svRejectReason.trim() || svBadgeLoading}
                                        onClick={() => updateSvStatus(svRejectTarget, 'rejected', svRejectReason)}
                                        style={{ padding:'8px 20px', borderRadius:8, border:'none', background: svRejectReason.trim() ? '#dc2626' : '#fca5a5', color:'#fff', fontWeight:700, fontSize:13, cursor: svRejectReason.trim() ? 'pointer' : 'not-allowed' }}>
                                        {svBadgeLoading ? 'Rejecting...' : '✕ Reject & Send Email'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Toast Notification */}
                    {svToast && (
                        <div style={{
                            position: 'fixed', bottom: 32, right: 32, zIndex: 99999,
                            background: svToast.type === 'success' ? '#16a34a' : '#dc2626',
                            color: '#fff', padding: '14px 22px', borderRadius: 12,
                            fontWeight: 600, fontSize: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            display: 'flex', alignItems: 'center', gap: 10,
                            animation: 'slideInRight 0.3s ease',
                        }}>
                            {svToast.msg}
                        </div>
                    )}

                    {/* Approve Confirmation Modal */}
                    {svApproveTarget && (
                        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}
                            onClick={() => setSvApproveTarget(null)}>
                            <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:14, padding:'28px 28px 22px', width:380, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', textAlign:'center' }}>
                                <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
                                <h3 style={{ margin:'0 0 8px', fontSize:17, color:'#1e293b', fontWeight:700 }}>Approve Submission?</h3>
                                <p style={{ margin:'0 0 6px', fontSize:13, color:'#64748b' }}>
                                    Owner ID: <strong>{svApproveTarget.owner_id || '—'}</strong>
                                </p>
                                <p style={{ margin:'0 0 20px', fontSize:13, color:'#64748b' }}>
                                    An approval email will be sent to the owner automatically.
                                </p>
                                <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                                    <button onClick={() => setSvApproveTarget(null)}
                                        style={{ padding:'9px 20px', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:13, cursor:'pointer' }}>
                                        Cancel
                                    </button>
                                    <button
                                        disabled={svBadgeLoading}
                                        onClick={() => updateSvStatus(svApproveTarget, 'approved')}
                                        style={{ padding:'9px 22px', borderRadius:8, border:'none', background:'#16a34a', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                                        {svBadgeLoading ? 'Approving...' : '✓ Yes, Approve'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lightbox */}
                    {svLightbox && (
                        <div onClick={() => setSvLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
                                <button onClick={() => setSvLightbox(null)} style={{ position: 'absolute', top: -16, right: -16, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontWeight: 700, fontSize: 18, zIndex: 10 }}>×</button>
                                {svLightbox.type === 'video'
                                    ? <video src={svLightbox.url} controls style={{ maxWidth: '85vw', maxHeight: '85vh', borderRadius: 10 }} />
                                    : <img src={svLightbox.url} alt={svLightbox.title} style={{ maxWidth: '85vw', maxHeight: '85vh', borderRadius: 10, objectFit: 'contain' }} />
                                }
                                <div style={{ color: '#fff', textAlign: 'center', marginTop: 8, fontSize: 13 }}>{svLightbox.title}</div>
                            </div>
                        </div>
                    )}

                    {/* Header bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, background: '#fff', padding: '14px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src="/SelfVerified.jpeg" alt="Self Verified" style={{ height: 32, width: 'auto', borderRadius: 4 }} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Self Verification Submissions</div>
                                <div style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} of {svList.length} submissions</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                placeholder="Search mobile, owner ID, property ID, address..."
                                value={svSearch}
                                onChange={e => setSvSearch(e.target.value)}
                                style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, width: 300, outline: 'none' }}
                            />
                            <button onClick={fetchSelfVerifications} disabled={svLoading}
                                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#C98B3E', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                                {svLoading ? 'Loading...' : '↻ Refresh'}
                            </button>
                        </div>
                    </div>

                    {/* Debug bar */}
                    {svDebug && (
                        <div style={{ margin: '0 0 12px', padding: '8px 14px', background: '#1e293b', color: '#94a3b8', borderRadius: 8, fontSize: 12, fontFamily: 'monospace' }}>
                            🔍 {svDebug}
                        </div>
                    )}

                    {/* Table */}
                    {svLoading ? (
                        <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8', fontSize: 15 }}>Loading submissions...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                            <div style={{ fontWeight: 600 }}>No submissions yet</div>
                            <div style={{ fontSize: 13, marginTop: 4 }}>Submissions from /owner-verification form will appear here.</div>
                        </div>
                    ) : (
                        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                            {['#', 'Owner ID', 'Prop ID', 'Mobile', 'Email', 'Status', 'Prop Link', 'Exterior', 'Interior', 'Video', 'Address', 'Location', 'Date', 'Approve / Reject', 'Badge Control'].map(h => (
                                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((sv, idx) => {
                                            const interiorArr = Array.isArray(sv.interior_photos)
                                                ? sv.interior_photos
                                                : typeof sv.interior_photos === 'string'
                                                    ? sv.interior_photos.split(',').filter(Boolean)
                                                    : [];
                                            const statusStyle = statusColors[sv.verification_status] || statusColors.submitted;
                                            return (
                                                <tr key={sv.id || idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbfc' }}>
                                                    <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{sv.id || idx + 1}</td>
                                                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{sv.owner_id || '—'}</td>
                                                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#6366f1' }}>{sv.property_id || '—'}</td>
                                                    <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{sv.mobile_number || '—'}</td>
                                                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#374151' }}>
                                                        {sv.owner_email
                                                            ? <a href={`mailto:${sv.owner_email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{sv.owner_email}</a>
                                                            : <span style={{ color: '#94a3b8' }}>—</span>}
                                                    </td>

                                                    {/* Status badge */}
                                                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                                        <span style={{ padding: '3px 10px', borderRadius: 20, background: statusStyle.bg, color: statusStyle.color, fontWeight: 700, fontSize: 11 }}>
                                                            {statusStyle.label}
                                                        </span>
                                                    </td>

                                                    {/* Property Link */}
                                                    <td style={{ padding: '12px 14px' }}>
                                                        {sv.property_link
                                                            ? <a href={sv.property_link} target="_blank" rel="noreferrer"
                                                                style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                                🔗 View
                                                              </a>
                                                            : <span style={{ color: '#94a3b8' }}>—</span>}
                                                    </td>

                                                    {/* Exterior photo */}
                                                    <td style={{ padding: '8px 14px' }}>
                                                        {imgUrl(sv.exterior_photo)
                                                            ? <img src={imgUrl(sv.exterior_photo)} alt="Exterior"
                                                                onClick={() => setSvLightbox({ url: imgUrl(sv.exterior_photo), title: 'Exterior Photo', type: 'image' })}
                                                                style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: '2px solid #e2e8f0' }} />
                                                            : <span style={{ color: '#94a3b8' }}>—</span>}
                                                    </td>

                                                    {/* Interior photos */}
                                                    <td style={{ padding: '8px 14px' }}>
                                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                            {interiorArr.length === 0 && <span style={{ color: '#94a3b8' }}>—</span>}
                                                            {interiorArr.slice(0, 3).map((ph, i) => (
                                                                <img key={i} src={imgUrl(ph)} alt={`Interior ${i+1}`}
                                                                    onClick={() => setSvLightbox({ url: imgUrl(ph), title: `Interior Photo ${i+1}`, type: 'image' })}
                                                                    style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 5, cursor: 'pointer', border: '1px solid #e2e8f0' }} />
                                                            ))}
                                                            {interiorArr.length > 3 && (
                                                                <div onClick={() => setSvLightbox({ url: imgUrl(interiorArr[3]), title: 'Interior Photo 4', type: 'image' })}
                                                                    style={{ width: 44, height: 36, background: '#f1f5f9', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>
                                                                    +{interiorArr.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Video */}
                                                    <td style={{ padding: '8px 14px' }}>
                                                        {imgUrl(sv.walkthrough_video)
                                                            ? <button onClick={() => setSvLightbox({ url: imgUrl(sv.walkthrough_video), title: 'Walkthrough Video', type: 'video' })}
                                                                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #C98B3E', background: '#fff8f1', color: '#C98B3E', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>▶ Play</button>
                                                            : <span style={{ color: '#94a3b8' }}>—</span>}
                                                    </td>

                                                    <td style={{ padding: '12px 14px', maxWidth: 160, color: '#374151', fontSize: 12 }}>{sv.map_address || '—'}</td>

                                                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>
                                                        {sv.lat && sv.lng
                                                            ? <a href={`https://maps.google.com/?q=${sv.lat},${sv.lng}`} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>📍 Map</a>
                                                            : '—'}
                                                    </td>

                                                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>
                                                        {sv.submitted_at || sv.created_at
                                                            ? new Date(sv.submitted_at || sv.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                            : '—'}
                                                    </td>

                                                    {/* Approve / Reject column */}
                                                    <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                                                        <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 7, overflow: 'hidden' }}>
                                                            <button
                                                                disabled={svBadgeLoading || sv.verification_status === 'approved'}
                                                                onClick={() => setSvApproveTarget(sv)}
                                                                style={{ padding: '6px 12px', border: 'none', borderRight: '1px solid #e2e8f0', background: sv.verification_status === 'approved' ? '#bbf7d0' : '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: 11, cursor: sv.verification_status === 'approved' ? 'default' : 'pointer', opacity: sv.verification_status === 'approved' ? 0.7 : 1 }}>
                                                                ✓ Approve
                                                            </button>
                                                            <button
                                                                disabled={svBadgeLoading || sv.verification_status === 'rejected'}
                                                                onClick={() => { setSvRejectTarget(sv); setSvRejectReason(''); }}
                                                                style={{ padding: '6px 12px', border: 'none', background: sv.verification_status === 'rejected' ? '#fecaca' : '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: 11, cursor: sv.verification_status === 'rejected' ? 'default' : 'pointer', opacity: sv.verification_status === 'rejected' ? 0.7 : 1 }}>
                                                                ✕ Reject
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* Badge Control column */}
                                                    <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                                                        <div style={{ display: 'flex', border: `1px solid ${sv.verification_status === 'approved' ? '#C98B3E' : '#e2e8f0'}`, borderRadius: 7, overflow: 'hidden' }}>
                                                            <button
                                                                disabled={svBadgeLoading || !sv.property_id}
                                                                onClick={() => addBadge(sv, true)}
                                                                style={{ padding: '6px 12px', border: 'none', borderRight: `1px solid ${sv.verification_status === 'approved' ? '#C98B3E' : '#e2e8f0'}`, background: sv.verification_status === 'approved' ? '#fff3e0' : '#f8fafc', color: sv.verification_status === 'approved' ? '#C98B3E' : '#94a3b8', fontWeight: 700, fontSize: 11, cursor: sv.property_id ? 'pointer' : 'not-allowed', opacity: sv.property_id ? 1 : 0.45 }}>
                                                                🏅 Add Badge
                                                            </button>
                                                            <button
                                                                disabled={svBadgeLoading || !sv.property_id}
                                                                onClick={() => addBadge(sv, false)}
                                                                style={{ padding: '6px 12px', border: 'none', background: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: 11, cursor: sv.property_id ? 'pointer' : 'not-allowed', opacity: sv.property_id ? 1 : 0.45 }}>
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                );
            })()}

            {/* VIEW: LEAD PURCHASES */}
            {view === 'lead-purchases' && (() => {
              const filtered = lpList.filter(lp => {
                const q = lpSearch.toLowerCase();
                return !q ||
                  (lp.buyer_name || lp.buyerName || '').toLowerCase().includes(q) ||
                  (lp.buyer_email || lp.buyerEmail || '').toLowerCase().includes(q) ||
                  (lp.buyer_phone || lp.buyerPhone || '').toLowerCase().includes(q) ||
                  (lp.plan || '').toLowerCase().includes(q) ||
                  (lp.invoice_no || lp.invoiceNo || '').toLowerCase().includes(q);
              });

              const totalRevenue = lpList.reduce((s, l) => s + Number(l.total_amount || l.totalAmount || 0), 0);
              const totalLeads = lpList.reduce((s, l) => s + Number(l.leads || 0), 0);

              return (
                <div style={{ padding: '24px' }}>
                  {/* Stats row */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Total Orders', value: lpList.length, color: '#3b82f6' },
                      { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#16a34a' },
                      { label: 'Total Leads Sold', value: totalLeads, color: '#c2772b' },
                    ].map(s => (
                      <div key={s.label} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '16px 24px', flex: '1 1 160px', minWidth: 160 }}>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Search + Refresh */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      placeholder="Search by name, email, phone, plan, invoice..."
                      value={lpSearch}
                      onChange={e => setLpSearch(e.target.value)}
                      style={{ flex: 1, minWidth: 220, padding: '9px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }}
                    />
                    <button onClick={fetchLeadPurchases} disabled={lpLoading}
                      style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: '#c2772b', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                      {lpLoading ? 'Loading...' : '↻ Refresh'}
                    </button>
                  </div>

                  {/* Table */}
                  {lpLoading ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 15 }}>Loading lead purchases...</div>
                  ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 15 }}>
                      {lpSearch ? 'No results found.' : 'No lead purchases yet.'}
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', borderRadius: 14, border: '1.5px solid #e2e8f0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['Invoice No.', 'Buyer Name', 'Email', 'Phone', 'Plan', 'Leads', 'Base', 'GST', 'Total Paid', 'Validity', 'Date', 'Status'].map(h => (
                              <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((lp, i) => {
                            const invoiceNo  = lp.invoice_no  || lp.invoiceNo  || '—';
                            const buyerName  = lp.buyer_name  || lp.buyerName  || '—';
                            const buyerEmail = lp.buyer_email || lp.buyerEmail || '—';
                            const buyerPhone = lp.buyer_phone || lp.buyerPhone || '—';
                            const total      = Number(lp.total_amount || lp.totalAmount || 0);
                            const base       = Number(lp.base_amount  || lp.baseAmount  || 0);
                            const gst        = Number(lp.gst_amount   || lp.gstAmount   || 0);
                            return (
                              <tr key={invoiceNo + i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: 12, color: '#334155', whiteSpace: 'nowrap' }}>{invoiceNo}</td>
                                <td style={{ padding: '11px 14px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>{buyerName}</td>
                                <td style={{ padding: '11px 14px', color: '#475569' }}>{buyerEmail}</td>
                                <td style={{ padding: '11px 14px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{buyerPhone}</td>
                                <td style={{ padding: '11px 14px' }}>
                                  <span style={{ background: 'rgba(194,119,43,0.1)', color: '#c2772b', fontWeight: 700, fontSize: 11, padding: '2px 10px', borderRadius: 20 }}>{lp.plan || '—'}</span>
                                </td>
                                <td style={{ padding: '11px 14px', fontWeight: 700, textAlign: 'center' }}>{lp.leads || '—'}</td>
                                <td style={{ padding: '11px 14px' }}>₹{base.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '11px 14px', color: '#f59e0b' }}>₹{gst.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '11px 14px', fontWeight: 800, color: '#16a34a' }}>₹{total.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '11px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>{lp.validity || '—'}</td>
                                <td style={{ padding: '11px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                                  {(() => {
                                    const raw = lp.created_at || lp.createdAt;
                                    if (raw) {
                                      const d = new Date(raw);
                                      return isNaN(d) ? lp.date || '—' : d.toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });
                                    }
                                    return lp.date || '—';
                                  })()}
                                </td>
                                <td style={{ padding: '11px 14px' }}>
                                  <span style={{ background: '#dcfce7', color: '#166534', fontWeight: 800, fontSize: 10, padding: '2px 9px', borderRadius: 20, letterSpacing: '0.06em' }}>PAID</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* VIEW: BOOKING INQUIRIES */}
            {view === 'booking-inquiries' && (() => {
              const fmtD = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
              const q = biSearch.toLowerCase();
              const filtered = biList.filter(b =>
                !q ||
                (b.username || '').toLowerCase().includes(q) ||
                (b.email || '').toLowerCase().includes(q) ||
                (b.phone_number || '').toLowerCase().includes(q) ||
                (b.property_name || '').toLowerCase().includes(q) ||
                String(b.property_id || '').includes(q) ||
                String(b.id || '').includes(q) ||
                (b.aadhar_number || '').toLowerCase().includes(q)
              );
              const totalAmount = biList.reduce((s, b) => s + Number(b.total_price || b.total_amount || b.amount || 0), 0);
              const confirmed = biList.filter(b => (b.booking_status || b.status || '').toLowerCase() === 'confirmed').length;

              return (
                <div style={{ padding: '24px' }}>
                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Total Bookings', value: biList.length, color: '#3b82f6' },
                      { label: 'Confirmed', value: confirmed, color: '#16a34a' },
                      { label: 'Total Revenue', value: `₹${totalAmount.toLocaleString('en-IN')}`, color: '#c2772b' },
                    ].map(s => (
                      <div key={s.label} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '16px 24px', flex: '1 1 160px', minWidth: 160 }}>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Search + Refresh */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      placeholder="Search by name, email, phone, property, Aadhaar, booking ID..."
                      value={biSearch}
                      onChange={e => setBiSearch(e.target.value)}
                      style={{ flex: 1, minWidth: 260, padding: '9px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }}
                    />
                    <button onClick={fetchBookingInquiries} disabled={biLoading}
                      style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: '#c2772b', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                      {biLoading ? 'Loading...' : '↻ Refresh'}
                    </button>
                  </div>

                  {/* Table */}
                  {biLoading ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 15 }}>Loading booking inquiries...</div>
                  ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 15 }}>
                      {biSearch ? 'No results found.' : 'No booking inquiries yet.'}
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', borderRadius: 14, border: '1.5px solid #e2e8f0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['#ID','Photo ID','Customer','Phone','Property','Dates','Aadhaar / Passport','Amount','Status','Submitted'].map(h => (
                              <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((b, i) => {
                            const status = (b.booking_status || b.status || 'pending').toLowerCase();
                            const statusStyle = {
                              confirmed: { bg: '#dcfce7', color: '#166534' },
                              paid:      { bg: '#dcfce7', color: '#166534' },
                              pending:   { bg: '#fef9c3', color: '#854d0e' },
                              accepted:  { bg: '#dbeafe', color: '#1e40af' },
                              cancelled: { bg: '#fee2e2', color: '#991b1b' },
                              rejected:  { bg: '#fee2e2', color: '#991b1b' },
                            }[status] || { bg: '#f3f4f6', color: '#374151' };

                            const amount   = calculateBookingAmount(b);
                            const subtotal = Number(b.subtotal || 0);
                            const disc     = Number(b.discount_amount || 0);
                            const gst      = Number(b.gst_amount || 0);
                            const nights   = b.start_date && b.end_date
                              ? Math.ceil(Math.abs(new Date(b.end_date) - new Date(b.start_date)) / 86400000)
                              : null;
                            const rawPhoto = b.user_photo || b.photo || b.profile_photo || b.image || b.id_photo || b.document_photo || '';
                            const photoUrl = rawPhoto
                              ? (rawPhoto.startsWith('http') ? rawPhoto : `https://www.townmanor.ai${rawPhoto}`)
                              : null;

                            return (
                              <tr key={b.id || i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>

                                {/* ID */}
                                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                                  #{b.id || '—'}
                                </td>

                                {/* Photo ID */}
                                <td style={{ padding: '10px 14px' }}>
                                  {photoUrl ? (
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                      <img
                                        src={photoUrl}
                                        alt="ID Photo"
                                        onClick={() => setBiPhotoModal(photoUrl)}
                                        onError={e => { e.target.style.display='none'; e.target.nextSibling && (e.target.nextSibling.style.display='flex'); }}
                                        style={{ width: 64, height: 44, borderRadius: 6, objectFit: 'cover', cursor: 'zoom-in', border: '1.5px solid #e2e8f0', display: 'block' }}
                                      />
                                      <div style={{ display:'none', width: 64, height: 44, borderRadius: 6, background: '#f1f5f9', border: '1.5px dashed #cbd5e1', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                        <span style={{ fontSize: 18, color: '#94a3b8' }}>🪪</span>
                                        <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>LOAD ERR</span>
                                      </div>
                                      <div style={{ fontSize: 9, color: '#94a3b8', textAlign: 'center', marginTop: 3, fontWeight: 600, letterSpacing: '0.04em' }}>CLICK TO VIEW</div>
                                    </div>
                                  ) : (
                                    <div style={{ width: 64, height: 44, borderRadius: 6, background: '#f1f5f9', border: '1.5px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                      <span style={{ fontSize: 18, color: '#94a3b8' }}>🪪</span>
                                      <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>NO PHOTO</span>
                                    </div>
                                  )}
                                </td>

                                {/* Customer */}
                                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{b.username || '—'}</div>
                                </td>

                                {/* Phone */}
                                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#0f172a' }}>{b.phone_number || '—'}</div>
                                </td>

                                {/* Property */}
                                <td style={{ padding: '12px 14px', maxWidth: 200 }}>
                                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 12 }}>{b.property?.name || b.property_name || `Property #${b.property_id}`}</div>
                                  {b.property?.city && <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{b.property.city}</div>}
                                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>ID: {b.property_id}</div>
                                </td>

                                {/* Dates */}
                                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                  <div style={{ fontSize: 12, color: '#334155' }}>{fmtD(b.start_date)} →</div>
                                  <div style={{ fontSize: 12, color: '#334155' }}>{fmtD(b.end_date)}</div>
                                  {nights && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{nights} night{nights !== 1 ? 's' : ''}</div>}
                                </td>

                                {/* Aadhaar / Passport */}
                                <td style={{ padding: '12px 14px', fontSize: 12, minWidth: 160 }}>
                                  {b.id_type === 'passport' || b.passport_number ? (
                                    <>
                                      <div style={{ marginBottom: 2 }}>
                                        <span style={{ background: '#dbeafe', color: '#1e40af', fontWeight: 700, fontSize: 10, padding: '1px 7px', borderRadius: 10 }}>PASSPORT</span>
                                      </div>
                                      <div style={{ fontFamily: 'monospace', color: '#0f172a' }}>{b.passport_number || '—'}</div>
                                      {b.passport_name && <div style={{ color: '#475569', marginTop: 1 }}>{b.passport_name}</div>}
                                      {b.passport_dob && <div style={{ color: '#94a3b8', fontSize: 11 }}>DOB: {b.passport_dob}</div>}
                                    </>
                                  ) : b.aadhar_number && b.aadhar_number !== 'NOT_PROVIDED' ? (
                                    <>
                                      <div style={{ marginBottom: 2 }}>
                                        <span style={{ background: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 10, padding: '1px 7px', borderRadius: 10 }}>AADHAAR</span>
                                      </div>
                                      <div style={{ fontFamily: 'monospace', color: '#0f172a' }}>{b.aadhar_number}</div>
                                    </>
                                  ) : (
                                    <span style={{ color: '#cbd5e1' }}>—</span>
                                  )}
                                </td>

                                {/* Amount */}
                                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                  {amount > 0 ? (
                                    <>
                                      <div style={{ fontWeight: 800, color: '#16a34a', fontSize: 14 }}>₹{amount.toLocaleString('en-IN')}</div>
                                      {subtotal > 0 && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>Sub: ₹{subtotal.toLocaleString('en-IN')}{disc > 0 ? ` · −₹${disc.toLocaleString('en-IN')}` : ''}{gst > 0 ? ` · GST ₹${gst.toLocaleString('en-IN')}` : ''}</div>}
                                    </>
                                  ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                                </td>

                                {/* Status */}
                                <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                  <span style={{ background: statusStyle.bg, color: statusStyle.color, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20, textTransform: 'capitalize' }}>
                                    {status}
                                  </span>
                                  {b.payment_status === 'paid' && (
                                    <div style={{ marginTop: 4 }}>
                                      <span style={{ background: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 10, padding: '2px 8px', borderRadius: 20 }}>💳 Paid</span>
                                    </div>
                                  )}
                                </td>

                                {/* Submitted */}
                                <td style={{ padding: '12px 14px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
                                  {b.created_at ? new Date(b.created_at).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12: true }) : '—'}
                                </td>

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Photo lightbox */}
                  {biPhotoModal && (
                    <div onClick={() => setBiPhotoModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, cursor: 'zoom-out' }}>
                      <img src={biPhotoModal} alt="Customer" style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }} />
                    </div>
                  )}
                </div>
              );
            })()}

            {/* VIEW: OWNER DETAILS */}
            {view === 'owners' && (() => {
              const q = ownersSearch.toLowerCase();

              // Per-owner: filter properties by tab, then filter owners
              const ownersWithFiltered = ownersList.map(o => ({
                ...o,
                visibleProps: ownersTab === 'all'
                  ? o.properties
                  : o.properties.filter(p => p._rentalType === ownersTab),
              })).filter(o =>
                o.visibleProps.length > 0 &&
                (!q || (o.name || '').toLowerCase().includes(q) || (o.phone || '').toLowerCase().includes(q))
              );

              const totalProps   = ownersWithFiltered.reduce((s, o) => s + o.visibleProps.length, 0);
              const multiOwners  = ownersWithFiltered.filter(o => o.visibleProps.length > 1).length;

              const tabStyle = (t) => ({
                padding: '8px 18px', borderRadius: 22, fontSize: 13, cursor: 'pointer', border: 'none',
                background: ownersTab === t ? '#c2772b' : '#f1f5f9',
                color:      ownersTab === t ? '#fff'     : '#475569',
                fontWeight: ownersTab === t ? 600 : 400,
              });

              return (
                <div style={{ padding: '24px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 20, color: '#1e293b' }}>👤 Owner Details</h2>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Sorted by most listings • click any owner to expand</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        value={ownersSearch}
                        onChange={e => setOwnersSearch(e.target.value)}
                        placeholder="Search name / phone..."
                        style={{ padding: '8px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, width: 210, outline: 'none' }}
                      />
                      <button onClick={fetchOwners} style={{ padding: '8px 16px', borderRadius: 9, border: 'none', background: '#c2772b', color: '#fff', fontSize: 13, cursor: 'pointer' }}>↻ Refresh</button>
                    </div>
                  </div>

                  {/* Nightly / Monthly tabs */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                    <button style={tabStyle('all')}     onClick={() => { setOwnersTab('all');     setOwnersExpanded(null); }}>All</button>
                    <button style={tabStyle('nightly')} onClick={() => { setOwnersTab('nightly'); setOwnersExpanded(null); }}>🌙 Nightly</button>
                    <button style={tabStyle('monthly')} onClick={() => { setOwnersTab('monthly'); setOwnersExpanded(null); }}>📅 Monthly</button>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Owners',            val: ownersWithFiltered.length, color: '#3b82f6' },
                      { label: 'Total Listings',    val: totalProps,                color: '#c2772b' },
                      { label: 'Multiple Listings', val: multiOwners,              color: '#16a34a', note: 'owners with 2+' },
                    ].map(({ label, val, color, note }) => (
                      <div key={label} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '12px 18px', minWidth: 130 }}>
                        <div style={{ fontSize: 24, fontWeight: 600, color }}>{val}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{label}</div>
                        {note && <div style={{ fontSize: 10, color: '#94a3b8' }}>{note}</div>}
                      </div>
                    ))}
                  </div>

                  {ownersLoading ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 15 }}>Loading owner data...</div>
                  ) : ownersWithFiltered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 15 }}>No owners found for this filter.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {ownersWithFiltered.map((owner, idx) => {
                        const isOpen = ownersExpanded === idx;
                        const cnt    = owner.visibleProps.length;
                        const hasMulti = cnt > 1;
                        return (
                          <div key={idx} style={{ background: '#fff', border: `1.5px solid ${hasMulti ? '#f0d8b0' : '#e2e8f0'}`, borderRadius: 14, overflow: 'hidden' }}>
                            {/* Owner row */}
                            <div
                              onClick={() => setOwnersExpanded(isOpen ? null : idx)}
                              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', cursor: 'pointer', background: isOpen ? '#fdf7ee' : hasMulti ? '#fffbf5' : '#fff', borderBottom: isOpen ? '1px solid #f0e8da' : 'none' }}
                            >
                              {/* Avatar */}
                              <div style={{ width: 38, height: 38, borderRadius: '50%', background: hasMulti ? 'linear-gradient(135deg,#c2772b,#e09a4f)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hasMulti ? '#fff' : '#64748b', fontSize: 15, fontWeight: 600, flexShrink: 0 }}>
                                {(owner.name || 'O')[0].toUpperCase()}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {owner.name}
                                  {hasMulti && <span style={{ background: '#c2772b', color: '#fff', borderRadius: 20, fontSize: 10, padding: '1px 7px' }}>Multi-listing</span>}
                                </div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>📞 {owner.phone}</div>
                              </div>

                              {/* Per-type mini counts */}
                              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                {ownersTab === 'all' && (() => {
                                  const n = owner.properties.filter(p => p._rentalType === 'nightly').length;
                                  const m = owner.properties.filter(p => p._rentalType === 'monthly').length;
                                  return (
                                    <>
                                      {n > 0 && <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 20, padding: '3px 10px', fontSize: 11 }}>🌙 {n} Nightly</span>}
                                      {m > 0 && <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 20, padding: '3px 10px', fontSize: 11 }}>📅 {m} Monthly</span>}
                                    </>
                                  );
                                })()}
                              </div>

                              <div style={{ background: '#fdf2e4', color: '#c2772b', border: '1px solid #f0d8b0', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                                {cnt} {cnt === 1 ? 'Listing' : 'Listings'}
                              </div>
                              <div style={{ color: '#94a3b8', fontSize: 16, flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</div>
                            </div>

                            {/* Expanded: property table */}
                            {isOpen && (
                              <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                  <thead>
                                    <tr style={{ background: '#f8fafc' }}>
                                      {['#', 'Property Name', 'City / Address', 'Price', 'Type', 'Category', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {owner.visibleProps.map((p, pi) => {
                                      const isNightly = p._rentalType === 'nightly';
                                      const isMonthly = p._rentalType === 'monthly';
                                      const priceVal  = p.price || p.base_rate || p.rent || p.monthly_rent;
                                      return (
                                        <tr key={pi} style={{ borderBottom: '1px solid #f1f5f9', background: pi % 2 === 0 ? '#fff' : '#fafafa' }}>
                                          <td style={{ padding: '9px 14px', color: '#94a3b8', fontSize: 11 }}>{p.id || pi + 1}</td>
                                          <td style={{ padding: '9px 14px', fontWeight: 500, color: '#1e293b' }}>
                                            {p.property_name || p.name || '—'}
                                          </td>
                                          <td style={{ padding: '9px 14px', color: '#475569', maxWidth: 220 }}>
                                            <div style={{ fontSize: 12, fontWeight: 500 }}>{p.city || '—'}</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{p.address || ''}</div>
                                          </td>
                                          <td style={{ padding: '9px 14px', fontWeight: 600, color: '#c2772b', whiteSpace: 'nowrap' }}>
                                            {priceVal ? `₹${Number(priceVal).toLocaleString('en-IN')}` : '—'}
                                          </td>
                                          <td style={{ padding: '9px 14px' }}>
                                            {isNightly ? (
                                              <span style={{ background: '#eff6ff', color: '#2563eb', borderRadius: 20, padding: '2px 9px', fontSize: 11, border: '1px solid #bfdbfe' }}>🌙 Nightly</span>
                                            ) : isMonthly ? (
                                              <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: 20, padding: '2px 9px', fontSize: 11, border: '1px solid #bbf7d0' }}>📅 Monthly</span>
                                            ) : (
                                              <span style={{ background: '#f1f5f9', color: '#475569', borderRadius: 20, padding: '2px 9px', fontSize: 11 }}>—</span>
                                            )}
                                          </td>
                                          <td style={{ padding: '9px 14px' }}>
                                            {(() => {
                                              const { label, bg, color } = getOwnerPropLabel(p);
                                              return (
                                                <span style={{ background: bg, color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 500, border: `1px solid ${color}30`, whiteSpace: 'nowrap' }}>
                                                  {label}
                                                </span>
                                              );
                                            })()}
                                          </td>
                                          <td style={{ padding: '9px 14px' }}>
                                            <span style={{ background: (p.is_active === true || p.status === 'active') ? '#dcfce7' : '#fee2e2', color: (p.is_active === true || p.status === 'active') ? '#166534' : '#991b1b', borderRadius: 20, padding: '2px 9px', fontSize: 11 }}>
                                              {(p.is_active === true || p.status === 'active') ? 'Active' : 'Inactive'}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* EDIT PROPERTY MODAL */}
            {editingProp && (
                <div className="sa-modal-overlay">
                    <div className="sa-modal-content" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{isCreatingProp ? 'Create Property' : 'Edit Property'}</h3>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {editingProp.id || editingProp._id || 'New'}</div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                             {/* BASIC INFO SECTION */}
                             <div className="sa-section-col">
                                 <h4 style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '10px', marginBottom: '15px' }}>Basic Information</h4>
                                 <div className="sa-input-group">
                                     <label>Property Name</label>
                                     <input 
                                        name="property_name" 
                                        value={editingProp.property_name || editingProp.name || ""} 
                                        onChange={handleEditChange} 
                                     />
                                 </div>
                                 
                                 <div className="sa-input-group">
                                     <label>Property Type <span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>(determines Nightly vs Monthly listing)</span></label>
                                     <select
                                        name="property_type"
                                        value={editingProp.property_type || editingProp.property_category || ""}
                                        onChange={handleEditChange}
                                        className="sa-search-input"
                                        style={{ width: '100%', marginBottom: '4px' }}
                                     >
                                        <option value="">Select Type</option>
                                        <optgroup label="🌙 Nightly / Short-term">
                                          <option value="Entire place">Entire place</option>
                                          <option value="Private room">Private room</option>
                                          <option value="Shared room">Shared room</option>
                                          <option value="Hotel room">Hotel room</option>
                                          <option value="Homestay">Homestay</option>
                                        </optgroup>
                                        <optgroup label="📅 Monthly / Long-term">
                                          <option value="Apartment">Apartment</option>
                                          <option value="House">House</option>
                                          <option value="Villa">Villa</option>
                                          <option value="Flat">Flat</option>
                                          <option value="Commercial Shop">Commercial Shop</option>
                                          <option value="Office Space">Office Space</option>
                                          <option value="Land / Plot">Land / Plot</option>
                                        </optgroup>
                                        <optgroup label="🏠 PG / Hostel">
                                          <option value="PG">PG</option>
                                          <option value="Hostel">Hostel</option>
                                        </optgroup>
                                     </select>
                                     <div style={{ fontSize: '11px', color: editingProp.property_type && ['Entire place','Private room','Shared room','Hotel room','Homestay'].includes(editingProp.property_type) ? '#16a34a' : '#c2772b', marginBottom: '12px', fontWeight: 600 }}>
                                       {editingProp.property_type && ['Entire place','Private room','Shared room','Hotel room','Homestay'].includes(editingProp.property_type)
                                         ? '✓ This property will appear in Nightly listings'
                                         : editingProp.property_type
                                           ? '✓ This property will appear in Monthly listings'
                                           : ''}
                                     </div>
                                 </div>

                                 <div className="sa-input-group">
                                     <label>Base Price / Monthly Rental (₹)</label>
                                     <input 
                                         type="number" 
                                         name="price"
                                         value={editingProp.price || ""} 
                                         onChange={handleEditChange} 
                                     />
                                 </div>

                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                     <div className="sa-input-group">
                                         <label>City</label>
                                         <input 
                                             name="city"
                                             value={editingProp.city || ""} 
                                             onChange={handleEditChange} 
                                         />
                                     </div>
                                     <div className="sa-input-group">
                                         <label>Area (Sq Ft)</label>
                                         <input 
                                             name="area"
                                             value={editingProp.area || ""} 
                                             onChange={handleEditChange} 
                                         />
                                     </div>
                                 </div>

                                 <div className="sa-input-group">
                                     <label>Address</label>
                                     <textarea 
                                         rows="2"
                                         name="address"
                                         value={editingProp.address || ""} 
                                         onChange={handleEditChange} 
                                     />
                                 </div>
                                 
                                 <div className="sa-input-group">
                                     <label>Description</label>
                                     <textarea 
                                         rows="3"
                                         name="description"
                                         value={editingProp.description || ""} 
                                         onChange={handleEditChange} 
                                     />
                                 </div>
                             </div>

                             {/* CATEGORY SPECIFIC SECTION */}
                             <div className="sa-section-col">
                                 {(editingProp.property_type === 'PG' || editingProp.property_type === 'Hostel') ? (
                                     <>
                                         <h4 style={{ borderLeft: '4px solid #10b981', paddingLeft: '10px', marginBottom: '15px' }}>PG Specific Details</h4>
                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                             <div className="sa-input-group">
                                                 <label>Notice Period (Days)</label>
                                                 <input 
                                                    type="number"
                                                    value={editingProp.meta?.noticePeriod || ""} 
                                                    onChange={(e) => handleMetaChange('noticePeriod', e.target.value)} 
                                                 />
                                             </div>
                                             <div className="sa-input-group">
                                                 <label>Lock-in (Months)</label>
                                                 <input 
                                                    type="number"
                                                    value={editingProp.meta?.lockInPeriod || ""} 
                                                    onChange={(e) => handleMetaChange('lockInPeriod', e.target.value)} 
                                                 />
                                             </div>
                                         </div>
                                         
                                         <div className="sa-input-group">
                                             <label>Electricity Charges</label>
                                             <input 
                                                value={editingProp.meta?.electricityCharges || ""} 
                                                onChange={(e) => handleMetaChange('electricityCharges', e.target.value)} 
                                                placeholder="e.g. 10 Rs/Unit"
                                             />
                                         </div>

                                         <div className="sa-input-group">
                                             <label>Sharing Options & Prices</label>
                                             <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                 {(editingProp.bedroom_details || []).map((room, idx) => (
                                                     <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                                         <select 
                                                            value={room.type || SHARING_TYPES[0]} 
                                                            onChange={(e) => {
                                                                const newRooms = [...editingProp.bedroom_details];
                                                                newRooms[idx].type = e.target.value;
                                                                setEditingProp(prev => ({ ...prev, bedroom_details: newRooms }));
                                                            }}
                                                            style={{ padding: '6px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                         >
                                                            {SHARING_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                         </select>
                                                         <input 
                                                            type="number" 
                                                            placeholder="Rent (₹)" 
                                                            value={room.price || ""} 
                                                            onChange={(e) => {
                                                                const newRooms = [...editingProp.bedroom_details];
                                                                newRooms[idx].price = e.target.value;
                                                                setEditingProp(prev => ({ ...prev, bedroom_details: newRooms }));
                                                            }}
                                                            style={{ padding: '6px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                         />
                                                         <select 
                                                            value={room.washroomType || "Attached"} 
                                                            onChange={(e) => {
                                                                const newRooms = [...editingProp.bedroom_details];
                                                                newRooms[idx].washroomType = e.target.value;
                                                                setEditingProp(prev => ({ ...prev, bedroom_details: newRooms }));
                                                            }}
                                                            style={{ padding: '6px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                         >
                                                            <option value="Attached">Attached</option>
                                                            <option value="Common">Common</option>
                                                         </select>
                                                         <button 
                                                            onClick={() => {
                                                                const newRooms = editingProp.bedroom_details.filter((_, i) => i !== idx);
                                                                const totalBeds = newRooms.reduce((acc, curr) => acc + (Number(curr.count) || 1), 0);
                                                                setEditingProp(prev => ({ ...prev, bedroom_details: newRooms, beds: totalBeds }));
                                                            }}
                                                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                                                         >×</button>
                                                     </div>
                                                 ))}
                                                 <button 
                                                    onClick={() => {
                                                        const newRooms = [...(editingProp.bedroom_details || []), { type: SHARING_TYPES[1], price: "", washroomType: "Attached", count: 1 }];
                                                        const totalBeds = newRooms.reduce((acc, curr) => acc + (Number(curr.count) || 1), 0);
                                                        setEditingProp(prev => ({ ...prev, bedroom_details: newRooms, beds: totalBeds }));
                                                    }}
                                                    style={{ background: '#eff6ff', color: '#2563eb', border: '1px dashed #3b82f6', borderRadius: '4px', padding: '6px 12px', fontSize: '11px', width: '100%', marginTop: '5px', cursor: 'pointer' }}
                                                 >+ Add Sharing Option</button>
                                             </div>
                                         </div>

                                         <div className="sa-input-group" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                             <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                                 <input 
                                                    type="checkbox" 
                                                    checked={!!editingProp.meta?.foodAvailable} 
                                                    onChange={(e) => handleMetaChange('foodAvailable', e.target.checked)} 
                                                 /> Food Available
                                             </label>
                                             <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                                 <input 
                                                    type="checkbox" 
                                                    checked={!!editingProp.meta?.laundryAvailable} 
                                                    onChange={(e) => handleMetaChange('laundryAvailable', e.target.checked)} 
                                                 /> Laundry
                                             </label>
                                         </div>
                                     </>
                                 ) : (
                                     <>
                                         <h4 style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '10px', marginBottom: '15px' }}>Room & Policy Details</h4>
                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                             <div className="sa-input-group">
                                                 <label>Max Guests</label>
                                                 <input 
                                                    type="number"
                                                    name="max_guests"
                                                    value={editingProp.max_guests || ""} 
                                                    onChange={handleEditChange} 
                                                 />
                                             </div>
                                             <div className="sa-input-group">
                                                 <label>Booking Type</label>
                                                 <select 
                                                    name="booking_type" 
                                                    value={editingProp.booking_type || "0"} 
                                                    onChange={handleEditChange}
                                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                                 >
                                                    <option value="0">Instant</option>
                                                    <option value="1">Request Only</option>
                                                 </select>
                                             </div>
                                         </div>

                                         <div className="sa-input-group">
                                             <label>House Rules</label>
                                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                                                 {['smokingAllowed', 'petsAllowed', 'eventsAllowed', 'drinkingAllowed'].map((rule) => (
                                                     <label key={rule} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                                         <input 
                                                            type="checkbox" 
                                                            checked={!!editingProp.meta?.[rule]} 
                                                            onChange={(e) => handleMetaChange(rule, e.target.checked)} 
                                                         /> {rule.replace('Allowed', '')} Allowed
                                                     </label>
                                                 ))}
                                             </div>
                                         </div>

                                         <div className="sa-input-group">
                                             <label>Bedroom & Bathroom Details</label>
                                             <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                 <div style={{ marginBottom: '15px' }}>
                                                     <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Bedrooms</div>
                                                     {(editingProp.bedroom_details || []).map((room, idx) => (
                                                         <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                                                             <select 
                                                                value={room.type || BEDROOM_TYPES[0]} 
                                                                onChange={(e) => {
                                                                    const newList = [...editingProp.bedroom_details];
                                                                    newList[idx].type = e.target.value;
                                                                    setEditingProp(prev => ({ ...prev, bedroom_details: newList }));
                                                                }}
                                                                style={{ flex: 2, padding: '6px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                             >
                                                                {BEDROOM_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                             </select>
                                                             <input 
                                                                type="number" 
                                                                placeholder="Count" 
                                                                value={room.count || ""} 
                                                                onChange={(e) => {
                                                                    const newList = [...editingProp.bedroom_details];
                                                                    newList[idx].count = e.target.value;
                                                                    const total = newList.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
                                                                    setEditingProp(prev => ({ ...prev, bedroom_details: newList, beds: total }));
                                                                }}
                                                                style={{ flex: 1, padding: '6px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                             />
                                                             <button 
                                                                onClick={() => {
                                                                    const newList = editingProp.bedroom_details.filter((_, i) => i !== idx);
                                                                    const total = newList.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
                                                                    setEditingProp(prev => ({ ...prev, bedroom_details: newList, beds: total }));
                                                                }}
                                                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                                                             >×</button>
                                                         </div>
                                                     ))}
                                                     <button 
                                                        onClick={() => {
                                                            const newList = [...(editingProp.bedroom_details || []), { type: BEDROOM_TYPES[0], count: 1 }];
                                                            const total = newList.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
                                                            setEditingProp(prev => ({ ...prev, bedroom_details: newList, beds: total }));
                                                        }}
                                                        style={{ background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', cursor: 'pointer' }}
                                                     >+ Add Bedroom</button>
                                                 </div>

                                                 <div>
                                                     <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Bathrooms</div>
                                                     {(editingProp.bathroom_details || []).map((bath, idx) => (
                                                         <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                                                             <select 
                                                                value={bath.type || BATHROOM_TYPES[0]} 
                                                                onChange={(e) => {
                                                                    const newList = [...editingProp.bathroom_details];
                                                                    newList[idx].type = e.target.value;
                                                                    setEditingProp(prev => ({ ...prev, bathroom_details: newList }));
                                                                }}
                                                                style={{ flex: 2, padding: '6px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                             >
                                                                {BATHROOM_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                             </select>
                                                             <input 
                                                                type="number" 
                                                                placeholder="Count" 
                                                                value={bath.count || ""} 
                                                                onChange={(e) => {
                                                                    const newList = [...editingProp.bathroom_details];
                                                                    newList[idx].count = e.target.value;
                                                                    const total = newList.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
                                                                    setEditingProp(prev => ({ ...prev, bathroom_details: newList, bathrooms: total }));
                                                                }}
                                                                style={{ flex: 1, padding: '6px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                             />
                                                             <button 
                                                                onClick={() => {
                                                                    const newList = editingProp.bathroom_details.filter((_, i) => i !== idx);
                                                                    const total = newList.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
                                                                    setEditingProp(prev => ({ ...prev, bathroom_details: newList, bathrooms: total }));
                                                                }}
                                                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                                                             >×</button>
                                                         </div>
                                                     ))}
                                                     <button 
                                                        onClick={() => {
                                                            const newList = [...(editingProp.bathroom_details || []), { type: BATHROOM_TYPES[0], count: 1 }];
                                                            const total = newList.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
                                                            setEditingProp(prev => ({ ...prev, bathroom_details: newList, bathrooms: total }));
                                                        }}
                                                        style={{ background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', cursor: 'pointer' }}
                                                     >+ Add Bathroom</button>
                                                 </div>
                                             </div>
                                         </div>
                                     </>
                                 )}
                             </div>

                             {/* AMENITIES SECTION */}
                             <div className="sa-section-col" style={{ gridColumn: 'span 2' }}>
                                 <h4 style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '10px', marginBottom: '15px', marginTop: '10px' }}>Amenities & Features</h4>
                                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                     {Object.entries(AMENITIES_MASTER).map(([group, list]) => (
                                         <div key={group}>
                                             <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>{group}</div>
                                             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                 {list.map(a => {
                                                     const isSelected = Array.isArray(editingProp.amenities) && editingProp.amenities.includes(a);
                                                     return (
                                                         <label key={a} style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '2px 0' }}>
                                                             <input 
                                                                 type="checkbox" 
                                                                 checked={isSelected}
                                                                 onChange={() => toggleAmenity(a)}
                                                             /> {a}
                                                         </label>
                                                     );
                                                 })}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* GUIDEBOOK & POLICIES SECTION */}
                             <div className="sa-section-col">
                                 <h4 style={{ borderLeft: '4px solid #ec4899', paddingLeft: '10px', marginBottom: '15px', marginTop: '10px' }}>Local Guidebook</h4>
                                 <div className="sa-input-group">
                                     <label>Nearest Metro / Transport</label>
                                     <input 
                                         value={editingProp.guidebook?.transport_tips?.metro || editingProp.guidebook?.metro_station || ""} 
                                         onChange={(e) => handleGuidebookChange('transport_tips', e.target.value, 'metro')}
                                         placeholder="e.g. Alambagh Metro"
                                     />
                                 </div>
                                 <div className="sa-input-group">
                                     <label>Nearest Hospital</label>
                                     <input 
                                         value={editingProp.guidebook?.essentials_nearby?.medical || editingProp.guidebook?.hospital || ""} 
                                         onChange={(e) => handleGuidebookChange('essentials_nearby', e.target.value, 'medical')}
                                         placeholder="e.g. Apollo Hospital"
                                     />
                                 </div>
                                 <div className="sa-input-group">
                                     <label>Nearest Grocery / Market</label>
                                     <input 
                                         value={editingProp.guidebook?.essentials_nearby?.grocery || editingProp.guidebook?.market || ""} 
                                         onChange={(e) => handleGuidebookChange('essentials_nearby', e.target.value, 'grocery')}
                                         placeholder="e.g. Reliance Fresh"
                                     />
                                 </div>
                                 <div className="sa-input-group">
                                     <label>Transport Tips (Notes)</label>
                                     <textarea 
                                         rows="2"
                                         value={editingProp.guidebook?.transport_tips?.local_travel || ""} 
                                         onChange={(e) => handleGuidebookChange('transport_tips', e.target.value, 'local_travel')}
                                         placeholder="e.g. Auto easily available from main gate"
                                     />
                                 </div>
                                 <div className="sa-input-group">
                                     <label>Must Visit Places (Shortlist)</label>
                                     <textarea 
                                         rows="2"
                                         value={editingProp.guidebook?.must_visit?.join(', ') || ""} 
                                         onChange={(e) => handleGuidebookChange('must_visit', e.target.value.split(',').map(s => s.trim()))}
                                         placeholder="e.g. Bara Imambara, Ambedkar Park"
                                     />
                                 </div>
                             </div>

                             <div className="sa-section-col">
                                 <h4 style={{ borderLeft: '4px solid #06b6d4', paddingLeft: '10px', marginBottom: '15px', marginTop: '10px' }}>Guest Policy & Preferences</h4>
                                 <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                         {[
                                             { label: 'Family Allowed', key: 'family_allowed' },
                                             { label: 'Couple Allowed', key: 'unmarried_couple_allowed' },
                                             { label: 'Bachelors Allowed', key: 'bachelors_allowed' },
                                             { label: 'Pets Allowed', key: 'pets_allowed' },
                                             { label: 'Smoking Allowed', key: 'smoking_allowed' },
                                             { label: 'Drinking Allowed', key: 'drinking_alcohol' }
                                         ].map(p => (
                                             <label key={p.key} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 0' }}>
                                                 <input 
                                                     type="checkbox" 
                                                     checked={!!editingProp.guest_policy?.[p.key]} 
                                                     onChange={() => handlePolicyToggle(p.key)}
                                                 /> {p.label}
                                             </label>
                                         ))}
                                     </div>
                                 </div>
                                 
                                 <div className="sa-input-group" style={{ marginTop: '15px' }}>
                                     <label>Gate Closing Time / Common Check-in Notes</label>
                                     <input 
                                         value={editingProp.meta?.gateClosingTime || ""} 
                                         onChange={(e) => handleMetaChange('gateClosingTime', e.target.value)}
                                         placeholder="e.g. 11:00 PM"
                                     />
                                 </div>
                             </div>

                             {/* PRICING, TIMES & COMPLIANCE SECTION */}
                             <div className="sa-section-col" style={{ gridColumn: 'span 2' }}>
                                 <h4 style={{ borderLeft: '4px solid #facc15', paddingLeft: '10px', marginBottom: '15px', marginTop: '10px' }}>Advanced Pricing & Compliance</h4>
                                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                     <div className="sa-input-group">
                                         <label>Monthly Rent (₹)</label>
                                         <input type="number" value={editingProp.price || ""} onChange={(e) => setEditingProp({...editingProp, price: e.target.value})} />
                                     </div>
                                     <div className="sa-input-group">
                                         <label>Weekend Rate (₹)</label>
                                         <input type="number" value={editingProp.weekend_rate || ""} onChange={(e) => setEditingProp({...editingProp, weekend_rate: e.target.value})} />
                                     </div>
                                     <div className="sa-input-group">
                                         <label>Cleaning Fee (₹)</label>
                                         <input type="number" value={editingProp.cleaning_fee || ""} onChange={(e) => setEditingProp({...editingProp, cleaning_fee: e.target.value})} />
                                     </div>
                                     <div className="sa-input-group">
                                         <label>Weekly Disc (%)</label>
                                         <input type="number" value={editingProp.weekly_discount_pct || ""} onChange={(e) => setEditingProp({...editingProp, weekly_discount_pct: e.target.value})} />
                                     </div>
                                     <div className="sa-input-group">
                                         <label>Monthly Disc (%)</label>
                                         <input type="number" value={editingProp.monthly_discount_pct || ""} onChange={(e) => setEditingProp({...editingProp, monthly_discount_pct: e.target.value})} />
                                     </div>
                                     <div className="sa-input-group">
                                         <label>Check-in Time</label>
                                         <input type="time" value={editingProp.check_in_time || "12:00"} onChange={(e) => setEditingProp({...editingProp, check_in_time: e.target.value})} />
                                     </div>
                                     <div className="sa-input-group">
                                         <label>Check-out Time</label>
                                         <input type="time" value={editingProp.check_out_time || "11:00"} onChange={(e) => setEditingProp({...editingProp, check_out_time: e.target.value})} />
                                     </div>
                                     <div className="sa-input-group" style={{ gridColumn: 'span 2' }}>
                                         <label>Registration Number (Legal)</label>
                                         <input value={editingProp.registration_number || ""} onChange={(e) => setEditingProp({...editingProp, registration_number: e.target.value})} placeholder="Govt Reg ID" />
                                     </div>
                                 </div>
                             </div>
                        </div>

                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <button className="sa-btn-danger" style={{ background:'#f3f4f6', color:'#374151', border:'1px solid #d1d5db' }} onClick={() => setEditingProp(null)}>Cancel</button>
                            <button className="sa-btn-primary" onClick={handleSaveEdit} style={{ padding: '10px 30px' }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* USER MODAL */}
            {isUserModalOpen && (
                <div className="sa-modal-overlay">
                    <div className="sa-modal-content" style={{maxWidth:'400px'}}>
                        <h3 style={{ marginBottom: '20px' }}>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                        
                        <div style={{ display: 'grid', gap: '0' }}>
                             <div className="sa-input-group">
                                 <label>User Name</label>
                                 <input 
                                    name="username" 
                                    value={userForm.username || ""} 
                                    onChange={handleUserFormChange} 
                                 />
                             </div>
                             <div className="sa-input-group">
                                 <label>Email Address</label>
                                 <input 
                                    name="email" 
                                    type="email"
                                    value={userForm.email} 
                                    onChange={handleUserFormChange} 
                                 />
                             </div>
                             <div className="sa-input-group">
                                 <label>Phone Number</label>
                                 <input 
                                    name="phone_number" 
                                    value={userForm.phone_number || ""} 
                                    onChange={handleUserFormChange} 
                                 />
                             </div>
                             {!editingUser && (
                                <div className="sa-input-group">
                                    <label>Password</label>
                                    <input 
                                        name="password" 
                                        type="password"
                                        value={userForm.password} 
                                        onChange={handleUserFormChange} 
                                    />
                                </div>
                             )}
                             <div className="sa-input-group">
                                 <label>Role</label>
                                 <select 
                                    name="role"
                                    value={userForm.role}
                                    onChange={handleUserFormChange}
                                    className="sa-search-input" // Reuse style
                                    style={{width:'100%'}}
                                 >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                 </select>
                             </div>
                        </div>

                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button className="sa-btn-danger" style={{ background:'#f3f4f6', color:'#374151', border:'1px solid #d1d5db' }} onClick={() => setIsUserModalOpen(false)}>Cancel</button>
                            <button className="sa-btn-primary" onClick={handleUserSubmit}>Save User</button>
                        </div>
                    </div>
                </div>
            )}
            {/* VIEW: LISTINGS DATA */}
            {view === 'listings-data' && (() => {
        const allProps = properties || [];

        const CAT_RULES = [
          { label: 'PG & Co-Living',      rental: 'Monthly',           color: '#6366f1', bg: '#eef2ff', keywords: ['pg','co-living','coliving','co living','paying guest'] },
          { label: 'Apartments & Villas', rental: 'Monthly',           color: '#0ea5e9', bg: '#e0f2fe', keywords: ['apartment','villa','flat','apartments & villas','apartments and villas'] },
          { label: 'Homestays & BnB',     rental: 'Nightly',           color: '#f59e0b', bg: '#fef3c7', keywords: ['homestay','bnb','b&b','bed and breakfast','homestays','bed & breakfast'] },
          { label: 'Signature Stays',     rental: 'Nightly + Monthly', color: '#c2772b', bg: '#fdf3e7', keywords: ['signature'] },
          { label: 'Hotels',              rental: 'Nightly',           color: '#10b981', bg: '#d1fae5', keywords: ['hotel'] },
        ];

        // Force specific properties into correct category by name (case-insensitive substring)
        const NAME_OVERRIDES = [
          { match: 'byke express',        label: 'Hotels' },
          { match: 'rm serenity heaven',  label: 'Apartments & Villas' },
          { match: 'office space',        label: 'Apartments & Villas' },
        ];

        const getPropId = (p) => String(p.id || p.property_id || p.property_name || p.name || '');

        const classifyProp = (p) => {
          // 1. Manual drag-override (user moved it via UI)
          const pid = getPropId(p);
          if (manualCatOverrides[pid]) {
            const rule = CAT_RULES.find(r => r.label === manualCatOverrides[pid]);
            if (rule) return rule;
          }
          const nameRaw = (p.property_name || p.name || p.title || '').toLowerCase().trim();
          // 2. Hard-coded name overrides
          for (const ov of NAME_OVERRIDES) {
            if (nameRaw.includes(ov.match)) {
              const rule = CAT_RULES.find(r => r.label === ov.label);
              if (rule) return rule;
            }
          }
          // 3. property_category / property_type field
          const raw = (p.property_category || p.property_type || '').toLowerCase().trim();
          for (const rule of CAT_RULES) {
            if (rule.keywords.some(k => raw.includes(k))) return rule;
          }
          // 4. Fallback: property name keywords
          for (const rule of CAT_RULES) {
            if (rule.keywords.some(k => nameRaw.includes(k))) return rule;
          }
          return { label: 'Other', rental: '—', color: '#94a3b8', bg: '#f8fafc', keywords: [] };
        };

        const extractLocality = (p) => {
          const addr = (p.address || '').trim();
          if (!addr) return null;
          const sectorMatch = addr.match(/sector[\s\-]*(\d+[A-Za-z]?)/i);
          if (sectorMatch) return `Sector ${sectorMatch[1]}`;
          const firstPart = addr.split(',')[0].trim();
          if (/^\d+$/.test(firstPart)) {
            const secondPart = (addr.split(',')[1] || '').trim();
            if (secondPart && !/^\d+$/.test(secondPart)) return secondPart;
            return null;
          }
          return firstPart.length > 2 ? firstPart : null;
        };

        // Auto-move first 30 hotels → Homestays & BnB (display only)
        const autoBnBIds = new Set();
        let hotelCount = 0;
        for (const p of allProps) {
          if (hotelCount >= 30) break;
          const pid = getPropId(p);
          if (!manualCatOverrides[pid]) {
            const rule = classifyProp(p);
            if (rule.label === 'Hotels') {
              autoBnBIds.add(pid);
              hotelCount++;
            }
          }
        }

        const classifyPropFinal = (p) => {
          const pid = getPropId(p);
          if (autoBnBIds.has(pid)) return CAT_RULES.find(r => r.label === 'Homestays & BnB');
          return classifyProp(p);
        };

        const catMap = {}, cityMap = {}, areaMap = {}, cityCatMap = {}, areaCityMap = {};
        allProps.forEach(p => {
          const rule = classifyPropFinal(p);
          const rawCity = (p.city || 'Unknown').trim();
          const normalised = rawCity.toLowerCase().replace(/\s+/g, ' ');
          const city = /new\s*delhi/.test(normalised) ? 'Delhi'
            : /^greater\s*noida$/.test(normalised) ? 'Greater Noida'
            : /^noida$/.test(normalised) ? 'Noida'
            : /^gurugram$/.test(normalised) ? 'Gurugram'
            : /^gurgaon$/.test(normalised) ? 'Gurugram'
            : /^ghaziabad$/.test(normalised) ? 'Ghaziabad'
            : /^faridabad$/.test(normalised) ? 'Faridabad'
            : rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
          const area = extractLocality(p);
          catMap[rule.label] = (catMap[rule.label] || 0) + 1;
          cityMap[city] = (cityMap[city] || 0) + 1;
          if (area) {
            areaMap[area] = (areaMap[area] || 0) + 1;
            if (!areaCityMap[area]) areaCityMap[area] = {};
            areaCityMap[area][city] = (areaCityMap[area][city] || 0) + 1;
          }
          if (!cityCatMap[city]) cityCatMap[city] = {};
          cityCatMap[city][rule.label] = (cityCatMap[city][rule.label] || 0) + 1;
        });

        const sortedCities = Object.entries(cityMap).sort((a,b) => b[1]-a[1]);
        const sortedAreas  = Object.entries(areaMap).sort((a,b) => b[1]-a[1]);
        const catOrder     = CAT_RULES.map(r => r.label).concat(['Other']);

        const cardStyle = (bg, border) => ({
          background: bg, border: `1.5px solid ${border}`, borderRadius: 14,
          padding: '20px 24px', flex: '1 1 190px', minWidth: 190,
        });

        const TABS = [
          { key: 'category', label: 'Category-wise',  icon: '🏷️' },
          { key: 'city',     label: 'City-wise',       icon: '🏙️' },
          { key: 'area',     label: 'Area-wise',       icon: '📍' },
          { key: 'cross',    label: 'City × Category', icon: '🗺️' },
        ];

        const maxCity = sortedCities[0]?.[1] || 1;
        const maxArea = sortedAreas[0]?.[1]  || 1;

        const thStyle = {
          padding: '11px 18px',
          textAlign: 'left',
          color: '#92400e',
          fontWeight: 700,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          background: '#fef9f0',
          borderBottom: '2px solid #fde8c8',
        };

        return (
          <div style={{ padding: '0 0 40px', background: 'transparent' }}>

            {/* ── Header ── */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin:0, fontSize:19, color:'#1c1c1c', fontWeight:800 }}>Listings Data</h2>
                <p style={{ margin:'3px 0 0', color:'#aaa', fontSize:12 }}>
                  {allProps.length} total properties across all categories
                </p>
              </div>
              <div style={{ background:'#c2772b', color:'#fff', borderRadius:20, padding:'7px 18px', fontSize:13, fontWeight:700, letterSpacing:0.3 }}>
                {allProps.length} listings
              </div>
            </div>

            {/* ── Tab Bar ── */}
            <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:12, padding:5, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', width:'fit-content', border:'1px solid #f0e6d8' }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setLdTab(t.key)} style={{
                  padding:'7px 18px', borderRadius:9, fontSize:13, cursor:'pointer', border:'none',
                  fontWeight: ldTab === t.key ? 700 : 500,
                  background: ldTab === t.key ? '#c2772b' : 'transparent',
                  color: ldTab === t.key ? '#fff' : '#888',
                  transition:'all 0.15s', display:'flex', alignItems:'center', gap:5,
                  boxShadow: ldTab === t.key ? '0 2px 8px rgba(194,119,43,0.25)' : 'none',
                }}>
                  <span style={{ fontSize:14 }}>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {/* ── TAB 1: CATEGORY-WISE ── */}
            {ldTab === 'category' && (() => {
              const allCatRules = [...CAT_RULES];
              const catPropsMap = {};
              allCatRules.forEach(r => { catPropsMap[r.label] = []; });
              allProps.forEach(p => {
                const rule = classifyPropFinal(p);
                if (catPropsMap[rule.label]) catPropsMap[rule.label].push(p);
                else if (catPropsMap['Other']) catPropsMap['Other'].push(p);
              });

              return (
                <div>
                  {/* Cards row */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(210px,1fr))', gap:14, marginBottom: selectedCat ? 20 : 0 }}>
                    {allCatRules.map(rule => {
                      const count = catMap[rule.label] || 0;
                      const pct = allProps.length ? ((count/allProps.length)*100).toFixed(1) : 0;
                      const isActive = selectedCat === rule.label;
                      return (
                        <div key={rule.label}
                          onClick={() => setSelectedCat(isActive ? null : rule.label)}
                          style={{ background:'#fff', borderRadius:14, padding:'20px 22px', boxShadow: isActive ? `0 0 0 2px ${rule.color}` : '0 1px 5px rgba(0,0,0,0.05)', border: isActive ? `1px solid ${rule.color}` : '1px solid #f0e6d8', borderTop:`3px solid ${rule.color}`, cursor:'pointer', transition:'all 0.15s' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                            <div style={{ fontSize:32, fontWeight:900, color:'#1c1c1c', lineHeight:1 }}>{count}</div>
                            {isActive && <span style={{ fontSize:11, color:rule.color, fontWeight:700, background:rule.bg, borderRadius:10, padding:'2px 8px' }}>✓ Selected</span>}
                          </div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#333', marginTop:8 }}>{rule.label}</div>
                          <div style={{ background:rule.bg, color:rule.color, fontSize:10, fontWeight:700, borderRadius:20, padding:'2px 10px', display:'inline-block', marginTop:6 }}>
                            {rule.rental}
                          </div>
                          <div style={{ marginTop:12, height:4, borderRadius:4, background:'#f5ede0' }}>
                            <div style={{ height:'100%', borderRadius:4, background:rule.color, width:`${pct}%` }} />
                          </div>
                          <div style={{ fontSize:11, color:'#bbb', marginTop:5 }}>{pct}% of total • Click to view</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detail table when a card is selected */}
                  {selectedCat && (() => {
                    const rule = allCatRules.find(r => r.label === selectedCat) || {};
                    const props = catPropsMap[selectedCat] || [];
                    return (
                      <div style={{ background:'#fff', borderRadius:14, border:`1px solid ${rule.color}33`, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.06)' }}>
                        {/* Table header bar */}
                        <div style={{ padding:'14px 20px', background:rule.bg || '#fef9f0', borderBottom:`1px solid ${rule.color}33`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <div>
                            <span style={{ fontWeight:800, fontSize:15, color:'#1c1c1c' }}>{selectedCat}</span>
                            <span style={{ marginLeft:10, color:'#999', fontSize:13 }}>{props.length} properties</span>
                          </div>
                          <button onClick={() => setSelectedCat(null)} style={{ border:'none', background:'transparent', cursor:'pointer', color:'#aaa', fontSize:18, lineHeight:1 }}>✕</button>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                            <thead>
                              <tr style={{ background:'#fafafa', borderBottom:'1px solid #f0e6d8' }}>
                                <th style={{ padding:'10px 16px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.6 }}>#</th>
                                <th style={{ padding:'10px 16px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.6 }}>Property Name</th>
                                <th style={{ padding:'10px 16px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.6 }}>City</th>
                                <th style={{ padding:'10px 16px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.6 }}>Area / Sector</th>
                                <th style={{ padding:'10px 16px', textAlign:'right', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.6 }}>Price</th>
                                <th style={{ padding:'10px 16px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.6 }}>Owner</th>
                                <th style={{ padding:'10px 16px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.6 }}>Status</th>
                                <th style={{ padding:'10px 16px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.6 }}>Move To</th>
                              </tr>
                            </thead>
                            <tbody>
                              {props.map((p, idx) => {
                                const rawCity2 = (p.city || 'Unknown').trim();
                                const norm2 = rawCity2.toLowerCase().replace(/\s+/g, ' ');
                                const city2 = /new\s*delhi/.test(norm2) ? 'Delhi'
                                  : /^greater\s*noida$/.test(norm2) ? 'Greater Noida'
                                  : /^noida$/.test(norm2) ? 'Noida'
                                  : /^gurugram$/.test(norm2) ? 'Gurugram'
                                  : /^gurgaon$/.test(norm2) ? 'Gurugram'
                                  : /^ghaziabad$/.test(norm2) ? 'Ghaziabad'
                                  : /^faridabad$/.test(norm2) ? 'Faridabad'
                                  : rawCity2.charAt(0).toUpperCase() + rawCity2.slice(1);
                                const area2 = extractLocality(p);
                                const price = p.monthly_rent || p.nightly_rate || p.price || p.rent || '—';
                                const owner = p.owner_name || p.host_name || p.listed_by || '—';
                                const status = p.status || p.is_active;
                                const statusLabel = status === true || status === 1 || status === 'active' ? 'Active' : status === false || status === 0 || status === 'inactive' ? 'Inactive' : String(status || '—');
                                const isActive2 = statusLabel === 'Active';
                                const pid = getPropId(p);
                                return (
                                  <tr key={p.id || p.property_id || idx} style={{ borderBottom:'1px solid #faf5ef' }}>
                                    <td style={{ padding:'10px 16px', color:'#ccc', fontWeight:700, fontSize:12 }}>{idx+1}</td>
                                    <td style={{ padding:'10px 16px', fontWeight:600, color:'#1c1c1c', maxWidth:220 }}>
                                      {p.property_name || p.name || p.title || `Property #${p.id || p.property_id}`}
                                    </td>
                                    <td style={{ padding:'10px 16px', color:'#555' }}>{city2}</td>
                                    <td style={{ padding:'10px 16px', color:'#777' }}>{area2 || '—'}</td>
                                    <td style={{ padding:'10px 16px', textAlign:'right', fontWeight:700, color:'#c2772b' }}>
                                      {price !== '—' ? `₹${Number(price).toLocaleString()}` : '—'}
                                    </td>
                                    <td style={{ padding:'10px 16px', color:'#555' }}>{owner}</td>
                                    <td style={{ padding:'10px 16px' }}>
                                      <span style={{ background: isActive2 ? '#d1fae5' : '#fee2e2', color: isActive2 ? '#065f46' : '#991b1b', fontWeight:700, fontSize:11, borderRadius:20, padding:'2px 10px' }}>
                                        {statusLabel}
                                      </span>
                                    </td>
                                    <td style={{ padding:'10px 16px' }}>
                                      <select
                                        value={manualCatOverrides[pid] || selectedCat}
                                        onChange={e => {
                                          const val = e.target.value;
                                          if (val === selectedCat) {
                                            const next = { ...manualCatOverrides };
                                            delete next[pid];
                                            setManualCatOverrides(next);
                                          } else {
                                            setManualCatOverrides(prev => ({ ...prev, [pid]: val }));
                                          }
                                        }}
                                        style={{ fontSize:12, padding:'4px 8px', borderRadius:8, border:'1px solid #f0e6d8', background:'#fef9f0', color:'#c2772b', fontWeight:600, cursor:'pointer', outline:'none' }}
                                      >
                                        {CAT_RULES.map(r => (
                                          <option key={r.label} value={r.label}>{r.label}</option>
                                        ))}
                                      </select>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            {/* ── TAB 2: CITY-WISE ── */}
            {ldTab === 'city' && (
              <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 5px rgba(0,0,0,0.05)', border:'1px solid #f0e6d8' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width:40 }}>#</th>
                      <th style={thStyle}>City</th>
                      <th style={{ ...thStyle, textAlign:'right' }}>Listings</th>
                      <th style={{ ...thStyle, textAlign:'right' }}>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCities.map(([city, count], i) => {
                      const pct = ((count/allProps.length)*100).toFixed(1);
                      return (
                        <tr key={city} style={{ borderBottom:'1px solid #faf5ef' }}>
                          <td style={{ padding:'12px 18px', color:'#ccc', fontWeight:700, fontSize:12 }}>{i+1}</td>
                          <td style={{ padding:'12px 18px' }}>
                            <span style={{ fontWeight:600, color:'#222', fontSize:13 }}>{city}</span>
                          </td>
                          <td style={{ padding:'12px 18px', textAlign:'right', fontWeight:800, color:'#c2772b', fontSize:15 }}>{count}</td>
                          <td style={{ padding:'12px 18px', textAlign:'right', color:'#999', fontSize:12 }}>{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── TAB 3: AREA-WISE ── */}
            {ldTab === 'area' && (
              sortedAreas.length === 0
                ? <div style={{ background:'#fff', borderRadius:14, padding:40, textAlign:'center', color:'#aaa', border:'1px solid #f0e6d8' }}>No sector/locality data found in property addresses.</div>
                : <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 5px rgba(0,0,0,0.05)', border:'1px solid #f0e6d8' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                      <thead>
                        <tr>
                          <th style={{ ...thStyle, width:40 }}>#</th>
                          <th style={thStyle}>Area / Sector</th>
                          <th style={thStyle}>City</th>
                          <th style={{ ...thStyle, textAlign:'right' }}>Listings</th>
                          <th style={{ ...thStyle, textAlign:'right' }}>Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedAreas.map(([area, count], i) => {
                          const pct = allProps.length ? ((count/allProps.length)*100).toFixed(1) : 0;
                          const cityEntries = Object.entries(areaCityMap[area] || {}).sort((a,b) => b[1]-a[1]);
                          const primaryCity = cityEntries[0]?.[0] || '—';
                          const hasMultiple = cityEntries.length > 1;
                          const isSelectedArea = selectedArea === area;
                          const areaProps = isSelectedArea ? allProps.filter(p => extractLocality(p) === area) : [];
                          return (
                            <React.Fragment key={area}>
                              <tr
                                onClick={() => setSelectedArea(isSelectedArea ? null : area)}
                                style={{ borderBottom: isSelectedArea ? 'none' : '1px solid #faf5ef', cursor:'pointer', background: isSelectedArea ? '#fff8f0' : 'transparent', transition:'background 0.12s' }}
                                onMouseEnter={e => { if (!isSelectedArea) e.currentTarget.style.background = '#fdf5ec'; }}
                                onMouseLeave={e => { if (!isSelectedArea) e.currentTarget.style.background = 'transparent'; }}
                              >
                                <td style={{ padding:'12px 18px', color:'#ccc', fontWeight:700, fontSize:12 }}>{i+1}</td>
                                <td style={{ padding:'12px 18px', fontWeight:700, color: isSelectedArea ? '#c2772b' : '#222', fontSize:13 }}>
                                  <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                                    <span style={{ fontSize:13 }}>{isSelectedArea ? '▼' : '▶'}</span>
                                    <span>{area}</span>
                                    {isSelectedArea && <span style={{ fontSize:10, background:'#c2772b', color:'#fff', borderRadius:10, padding:'1px 8px', fontWeight:700 }}>Viewing</span>}
                                  </span>
                                </td>
                                <td style={{ padding:'12px 18px', fontSize:13 }}>
                                  <span style={{ color:'#555', fontWeight:500 }}>{primaryCity}</span>
                                  {hasMultiple && (
                                    <span style={{ marginLeft:6, background:'#fdf0e0', color:'#c2772b', fontSize:10, fontWeight:700, borderRadius:10, padding:'1px 7px' }}>
                                      +{cityEntries.length - 1} more
                                    </span>
                                  )}
                                </td>
                                <td style={{ padding:'12px 18px', textAlign:'right', fontWeight:800, color:'#c2772b', fontSize:14 }}>{count}</td>
                                <td style={{ padding:'12px 18px', textAlign:'right', color:'#999', fontSize:12 }}>{pct}%</td>
                              </tr>
                              {isSelectedArea && (
                                <tr>
                                  <td colSpan={5} style={{ padding:0, background:'#fef9f0', borderBottom:'2px solid #fde8c8' }}>
                                    {/* ── Inline detail panel ── */}
                                    <div style={{ padding:'0 0 12px 0' }}>
                                      <div style={{ padding:'10px 18px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                          <span style={{ fontWeight:800, fontSize:14, color:'#c2772b' }}>📍 {area}</span>
                                          <span style={{ color:'#999', fontSize:13 }}>{areaProps.length} {areaProps.length === 1 ? 'property' : 'properties'}</span>
                                          {areaProps.length >= 2 && (
                                            <span style={{ background:'#fde8c8', color:'#c2772b', fontSize:11, fontWeight:700, borderRadius:10, padding:'2px 10px' }}>
                                              ⚠️ Check for duplicates
                                            </span>
                                          )}
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedArea(null); }} style={{ border:'none', background:'transparent', cursor:'pointer', color:'#aaa', fontSize:16, lineHeight:1, padding:'4px 8px' }}>✕</button>
                                      </div>
                                      <div style={{ overflowX:'auto', margin:'0 12px', background:'#fff', borderRadius:10, border:'1px solid #fde8c8' }}>
                                        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                                          <thead>
                                            <tr style={{ background:'#fafafa', borderBottom:'1px solid #f0e6d8' }}>
                                              <th style={{ padding:'8px 14px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>#</th>
                                              <th style={{ padding:'8px 14px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>Property Name</th>
                                              <th style={{ padding:'8px 14px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>City</th>
                                              <th style={{ padding:'8px 14px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>Category</th>
                                              <th style={{ padding:'8px 14px', textAlign:'right', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>Price</th>
                                              <th style={{ padding:'8px 14px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>Owner</th>
                                              <th style={{ padding:'8px 14px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>Status</th>
                                              <th style={{ padding:'8px 14px', textAlign:'left', color:'#92400e', fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>ID</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {areaProps.length === 0
                                              ? <tr><td colSpan={8} style={{ padding:'20px', textAlign:'center', color:'#bbb', fontSize:13 }}>No properties found for this area.</td></tr>
                                              : areaProps.map((p, idx) => {
                                                const rawCityA = (p.city || 'Unknown').trim();
                                                const normA = rawCityA.toLowerCase().replace(/\s+/g, ' ');
                                                const cityA = /new\s*delhi/.test(normA) ? 'Delhi'
                                                  : /^greater\s*noida$/.test(normA) ? 'Greater Noida'
                                                  : /^noida$/.test(normA) ? 'Noida'
                                                  : /^gurugram$/.test(normA) ? 'Gurugram'
                                                  : /^gurgaon$/.test(normA) ? 'Gurugram'
                                                  : /^ghaziabad$/.test(normA) ? 'Ghaziabad'
                                                  : /^faridabad$/.test(normA) ? 'Faridabad'
                                                  : rawCityA.charAt(0).toUpperCase() + rawCityA.slice(1);
                                                const catP = classifyPropFinal(p);
                                                const price = p.monthly_rent || p.nightly_rate || p.price || p.rent || '—';
                                                const owner = p.owner_name || p.host_name || p.listed_by || '—';
                                                const status = p.status || p.is_active;
                                                const statusLabel = status === true || status === 1 || status === 'active' ? 'Active'
                                                  : status === false || status === 0 || status === 'inactive' ? 'Inactive'
                                                  : String(status || '—');
                                                const isActiveP = statusLabel === 'Active';
                                                const propId = p.id || p.property_id || '—';
                                                return (
                                                  <tr key={p.id || p.property_id || idx} style={{ borderBottom:'1px solid #faf5ef', background: idx % 2 === 0 ? '#fff' : '#fffdf9' }}>
                                                    <td style={{ padding:'9px 14px', color:'#ccc', fontWeight:700, fontSize:11 }}>{idx+1}</td>
                                                    <td style={{ padding:'9px 14px', fontWeight:600, color:'#1c1c1c', maxWidth:200 }}>
                                                      <a href={`/property/${propId}`} target="_blank" rel="noreferrer" style={{ color:'#1c1c1c', textDecoration:'none' }}
                                                        onMouseEnter={e => e.currentTarget.style.color='#c2772b'}
                                                        onMouseLeave={e => e.currentTarget.style.color='#1c1c1c'}>
                                                        {p.property_name || p.name || p.title || `Property #${propId}`}
                                                      </a>
                                                    </td>
                                                    <td style={{ padding:'9px 14px', color:'#555' }}>{cityA}</td>
                                                    <td style={{ padding:'9px 14px' }}>
                                                      <span style={{ background: catP.bg || '#fef9f0', color: catP.color || '#c2772b', fontWeight:700, fontSize:10, borderRadius:20, padding:'2px 9px', whiteSpace:'nowrap' }}>
                                                        {catP.label}
                                                      </span>
                                                    </td>
                                                    <td style={{ padding:'9px 14px', textAlign:'right', fontWeight:700, color:'#c2772b' }}>
                                                      {price !== '—' ? `₹${Number(price).toLocaleString()}` : '—'}
                                                    </td>
                                                    <td style={{ padding:'9px 14px', color:'#555' }}>{owner}</td>
                                                    <td style={{ padding:'9px 14px' }}>
                                                      <span style={{ background: isActiveP ? '#d1fae5' : '#fee2e2', color: isActiveP ? '#065f46' : '#991b1b', fontWeight:700, fontSize:10, borderRadius:20, padding:'2px 9px' }}>
                                                        {statusLabel}
                                                      </span>
                                                    </td>
                                                    <td style={{ padding:'9px 14px', color:'#bbb', fontSize:11, fontFamily:'monospace' }}>#{propId}</td>
                                                  </tr>
                                                );
                                              })
                                            }
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
            )}

            {/* ── TAB 4: CITY × CATEGORY ── */}
            {ldTab === 'cross' && (
              <div style={{ background:'#fff', borderRadius:14, overflow:'auto', boxShadow:'0 1px 5px rgba(0,0,0,0.05)', border:'1px solid #f0e6d8' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:640 }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, whiteSpace:'nowrap', textAlign:'left' }}>City</th>
                      {catOrder.filter(l => catMap[l] > 0).map(label => {
                        const rule = CAT_RULES.find(r => r.label === label);
                        return (
                          <th key={label} style={{ ...thStyle, textAlign:'center', color: rule?.color || '#92400e', whiteSpace:'nowrap' }}>
                            {label}
                          </th>
                        );
                      })}
                      <th style={{ ...thStyle, textAlign:'center' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCities.map(([city, total], i) => {
                      const catData = cityCatMap[city] || {};
                      return (
                        <tr key={city} style={{ borderBottom:'1px solid #faf5ef' }}>
                          <td style={{ padding:'12px 18px', fontWeight:700, color:'#222', whiteSpace:'nowrap', fontSize:13 }}>{city}</td>
                          {catOrder.filter(l => catMap[l] > 0).map(label => {
                            const rule = CAT_RULES.find(r => r.label === label);
                            const v = catData[label] || 0;
                            return (
                              <td key={label} style={{ padding:'12px 16px', textAlign:'center' }}>
                                {v > 0
                                  ? <span style={{ background:rule?.bg||'#fef9f0', color:rule?.color||'#c2772b', fontWeight:700, borderRadius:6, padding:'3px 12px', fontSize:13, display:'inline-block', minWidth:32, border:`1px solid ${rule?.color||'#c2772b'}22` }}>{v}</span>
                                  : <span style={{ color:'#e5e5e5' }}>—</span>
                                }
                              </td>
                            );
                          })}
                          <td style={{ padding:'12px 16px', textAlign:'center' }}>
                            <span style={{ background:'#fef3e2', color:'#c2772b', fontWeight:800, borderRadius:6, padding:'3px 14px', fontSize:13, display:'inline-block', border:'1px solid #f3d5a0' }}>{total}</span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{ background:'#fef9f0', borderTop:'2px solid #fde8c8' }}>
                      <td style={{ padding:'12px 18px', fontWeight:800, color:'#92400e', fontSize:12, textTransform:'uppercase', letterSpacing:0.5 }}>Total</td>
                      {catOrder.filter(l => catMap[l] > 0).map(label => {
                        const rule = CAT_RULES.find(r => r.label === label);
                        return (
                          <td key={label} style={{ padding:'12px 16px', textAlign:'center', fontWeight:800, color:rule?.color||'#c2772b', fontSize:14 }}>
                            {catMap[label] || 0}
                          </td>
                        );
                      })}
                      <td style={{ padding:'12px 16px', textAlign:'center', fontWeight:900, color:'#c2772b', fontSize:16 }}>{allProps.length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
        );
            })()}
        </div>
      </div>

      {/* Image Classification Modal */}
      {classifyProperty && (
        <ImageClassificationModal
          property={classifyProperty}
          onClose={() => setClassifyProperty(null)}
        />
      )}
    </div>
  );
}

