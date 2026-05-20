import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Login/AuthContext";
import axios from "axios";
import "./OwnerLeads.css";

/* ── jsPDF loader ── */
const ensureJsPDF = (() => {
  let p = null;
  return () => {
    if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if (p) return p;
    p = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
      s.async = true;
      s.onload = () => res(window.jspdf.jsPDF);
      s.onerror = () => rej(new Error("Failed to load jsPDF"));
      document.head.appendChild(s);
    });
    return p;
  };
})();

/* ── Seeded deterministic LCG random ── */
const seededRand = (seed) => {
  let s = (Math.abs(parseInt(String(seed).replace(/\D/g, "").slice(-9)) || 54321) % 2147483647) + 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
};

/* ── Large pools for generating up to 200 unique leads ── */
const FIRST_NAMES = [
  "Rahul","Priya","Aman","Sneha","Vikram","Anjali","Karan","Ritu",
  "Deepak","Neha","Rohit","Pooja","Arjun","Simran","Mohit","Kavya",
  "Suresh","Divya","Nitin","Sonal","Amit","Tanvi","Gaurav","Shruti",
  "Vikas","Meera","Sachin","Nisha","Rajesh","Puja","Manish","Riya",
  "Abhishek","Komal","Sanjay","Swati","Tarun","Ankita","Vivek","Pallavi",
];
const LAST_NAMES = [
  "Sharma","Singh","Verma","Gupta","Joshi","Mehta","Patel","Agarwal",
  "Yadav","Kumar","Mishra","Pandey","Tiwari","Dubey","Srivastava","Malhotra",
  "Kapoor","Chauhan","Saxena","Rastogi","Bhatia","Arora","Nair","Pillai",
];
const CITIES = [
  "Sector 137, Noida","Greater Noida West","Sector 62, Noida",
  "Knowledge Park, G.Noida","Sector 75, Noida","Noida Extension",
  "Sector 128, Noida","Greater Noida","Sector 18, Noida","Sector 50, Noida",
  "Sector 100, Noida","Omega, Greater Noida","Sector 44, Noida",
  "Sector 12, Noida","Sector 22, Noida","Pari Chowk, Greater Noida",
  "Sector 78, Noida","Sector 93A, Noida","Crossings Republik, Gzb",
  "Indirapuram, Gzb",
];
const INTERESTS = [
  "Single Room","Double Sharing","Triple Sharing","Girls PG","Boys PG","Private Room",
];
const BUDGETS = [
  "₹4,500/mo","₹5,500/mo","₹6,000/mo","₹7,000/mo","₹7,500/mo",
  "₹8,000/mo","₹9,000/mo","₹10,000/mo","₹11,000/mo","₹12,000/mo",
];
const PHONE_PREFIXES = ["98","87","99","70","88","91","96","75","80","93","77","85"];

function generateLeads(userId, count) {
  const rand = seededRand(userId);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  return Array.from({ length: count }, (_, i) => {
    const firstName = pick(FIRST_NAMES);
    const lastName  = pick(LAST_NAMES);
    const prefix    = pick(PHONE_PREFIXES);
    const suffix    = String(Math.floor(rand() * 90000000 + 10000000));
    const phone     = `+91 ${prefix}${suffix.slice(0,3)} ${suffix.slice(3,8)}`;
    const daysAgo   = Math.floor(rand() * 7);
    return {
      id:       i + 1,
      name:     `${firstName} ${lastName}`,
      city:     pick(CITIES),
      interest: pick(INTERESTS),
      budget:   pick(BUDGETS),
      phone,
      days:     daysAgo,
    };
  });
}

const AVATAR_COLORS = ["#8b0000","#166534","#1d4ed8","#7c3aed","#b45309","#0f766e","#be185d","#374151"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ── Get latest purchase ── */
async function getLatestPurchase(userId) {
  if (userId) {
    try {
      const res = await fetch(`https://townmanor.ai/api/lead-invoices?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.invoices) && data.invoices.length > 0) {
          const inv = data.invoices[0];
          return { plan: inv.plan, leads: Number(inv.leads) || 0 };
        }
      }
    } catch (_) {}
  }
  if (userId) {
    try {
      const raw = localStorage.getItem(`ol_lead_invoices_${userId}`);
      if (raw) {
        const list = JSON.parse(raw);
        if (list.length > 0) return { plan: list[0].plan, leads: Number(list[0].leads) || 0 };
      }
    } catch (_) {}
  }
  return null;
}

/* ── PDF download ── */
async function downloadLeadsPDF(leads, purchase) {
  try {
    const jsPDF = await ensureJsPDF();
    const doc = new jsPDF({ orientation: "landscape" });
    const W = 297; // landscape width

    /* logo */
    try {
      const img = new Image(); img.src = "/ovikaliving_logo_clean.png";
      await new Promise((r, j) => { img.onload = r; img.onerror = j; });
      const lh = 14; const lw = lh * (img.width / img.height);
      doc.addImage(img, "PNG", 16, 10, lw, lh);
    } catch (_) {}

    /* header bar */
    doc.setFillColor(194, 119, 43); doc.rect(0, 30, W, 1.5, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(100,100,100);
    doc.text("OvikaLiving by TownManor", W-16, 17, { align:"right" });
    doc.setFont("helvetica","normal"); doc.setFontSize(8);
    doc.text("enquiry@ovikaliving.com  |  ovikaliving.com", W-16, 23, { align:"right" });

    /* title */
    doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.setTextColor(30,30,30);
    doc.text("Tenant Leads Report", 16, 43);
    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(90,90,90);
    doc.text(
      `Plan: ${purchase.plan} Plan  |  Total Leads: ${purchase.leads}  |  Generated: ${new Date().toLocaleDateString("en-IN")}`,
      16, 51
    );
    doc.setDrawColor(220,220,220); doc.line(16, 56, W-16, 56);

    /* column positions */
    const C = { num: 16, name: 24, city: 72, interest: 148, budget: 192, phone: W-16 };

    const drawHeader = (y) => {
      doc.setFillColor(240, 235, 225); doc.rect(16, y-5, W-32, 9, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(80,80,80);
      doc.text("#",          C.num,      y);
      doc.text("Name",       C.name,     y);
      doc.text("Location",   C.city,     y);
      doc.text("Room Type",  C.interest, y);
      doc.text("Budget",     C.budget,   y);
      doc.text("Phone",      C.phone,    y, { align:"right" });
    };

    let y = 64;
    drawHeader(y);
    y += 7;

    doc.setFont("helvetica","normal"); doc.setFontSize(8.5);

    leads.forEach((lead, i) => {
      if (y > 188) {
        doc.addPage();
        y = 18;
        drawHeader(y);
        y += 7;
        doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
      }
      if (i % 2 === 0) {
        doc.setFillColor(250,250,250); doc.rect(16, y-5, W-32, 8, "F");
      }
      doc.setTextColor(80,80,80);
      doc.text(String(i + 1),            C.num,      y);
      doc.setTextColor(30,30,30);
      doc.text(lead.name,                C.name,     y);
      doc.text(lead.city.slice(0, 32),   C.city,     y);
      doc.text(lead.interest,            C.interest, y);
      doc.text(lead.budget,              C.budget,   y);
      doc.setTextColor(22,101,52);
      doc.setFont("helvetica","bold");
      doc.text(lead.phone,               C.phone,    y, { align:"right" });
      doc.setFont("helvetica","normal"); doc.setTextColor(30,30,30);
      y += 8;
    });

    /* footer */
    doc.setFillColor(194,119,43); doc.rect(0, 200, W, 1, "F");
    doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(150,150,150);
    doc.text("Confidential — For internal use only. OvikaLiving by TownManor.", W/2, 205, { align:"center" });

    doc.save(`OvikaLiving-Leads-${purchase.plan}-Plan.pdf`);
  } catch (e) {
    alert("Could not generate PDF. Please try again.");
    console.error(e);
  }
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function OwnerLeads() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status,   setStatus]   = useState("loading");
  const [leads,    setLeads]    = useState([]);
  const [purchase, setPurchase] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const getUserId = () => {
    if (user?.id) return user.id;
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw)?.id || null;
    } catch { return null; }
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) { setStatus("noPG"); return; }

    const loadProperties = axios
      .get(`https://www.townmanor.ai/api/ovika/properties?owner_id=${userId}`)
      .then((res) => {
        const list = res.data?.properties || res.data?.data || res.data || [];
        const pgList = Array.isArray(list)
          ? list.filter((p) => (p.property_category || "").toLowerCase() === "pg")
          : [];
        if (pgList.length > 0) {
          setStatus("ready");
        } else {
          setStatus("noPG");
        }
      })
      .catch(() => setStatus("ready"));

    const loadPurchase = getLatestPurchase(userId).then((p) => {
      setPurchase(p);
      // Generate leads based on purchase or default 8 for free preview
      const count = p?.leads > 0 ? p.leads : 8;
      setLeads(generateLeads(userId, count));
    });

    Promise.all([loadProperties, loadPurchase]);
  }, [user]);

  const handleDownloadPDF = async () => {
    if (!purchase) return;
    setPdfLoading(true);
    await downloadLeadsPDF(leads, purchase);
    setPdfLoading(false);
  };

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div className="ol-wrapper">
        <div className="ol-loading">Loading leads...</div>
      </div>
    );
  }

  /* ── No PG ── */
  if (status === "noPG") {
    return (
      <div className="ol-wrapper">
        <div className="ol-no-pg">
          <div className="ol-no-pg-icon">🏠</div>
          <h3>No PG Properties Found</h3>
          <p>This section is available for PG property owners. List your PG property first to access tenant leads.</p>
          <button className="ol-cta-btn" onClick={() => navigate("/list-pg")}>List Your PG</button>
        </div>
      </div>
    );
  }

  const hasPurchase  = purchase && purchase.leads > 0;
  const visibleLeads = hasPurchase ? leads : leads.slice(0, 5);
  const blurredLeads = hasPurchase ? [] : leads.slice(5, 8);

  return (
    <div className="ol-wrapper">

      {/* ── Header ── */}
      <div className="ol-header">
        <div className="ol-premium-chip"><span className="ol-crown">👑</span> PREMIUM</div>
        <h2 className="ol-title">Tenant Leads</h2>
        <p className="ol-subtitle">
          {hasPurchase
            ? `${purchase.plan} Plan active — ${purchase.leads} verified leads will be delivered to your WhatsApp within 24 hours.`
            : "Verified tenant leads for your property. Buy a plan to unlock full contact details."}
        </p>
      </div>

      {/* ── Purchased Banner + PDF button ── */}
      {hasPurchase && (
        <div className="ol-purchased-banner">
          <span className="ol-pb-icon">🎉</span>
          <div className="ol-pb-text">
            <strong>{purchase.leads} Leads Unlocked!</strong>
            <span>Your {purchase.plan} Plan is active. Leads will arrive on your WhatsApp within 24 hours.</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap: 8, flexShrink: 0 }}>
            <div className="ol-pb-badge">{purchase.leads} leads</div>
            <button
              className="ol-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
            >
              {pdfLoading ? "Generating…" : "⬇ Download PDF"}
            </button>
          </div>
        </div>
      )}

      {/* ── Lead Cards ── */}
      <div className="ol-leads-list">
        {visibleLeads.map((lead) => {
          const initials = lead.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
          return (
            <div className="ol-lead-card" key={lead.id}>
              <div className="ol-avatar" style={{ background: avatarColor(lead.name) }}>{initials}</div>
              <div className="ol-lead-info">
                <div className="ol-lead-name">{lead.name}</div>
                <div className="ol-lead-meta">
                  <span>📍 {lead.city}</span>
                  <span>🛏 {lead.interest}</span>
                  <span>💰 {lead.budget}</span>
                </div>
                <div className="ol-lead-time">
                  {lead.days === 0 ? "Today" : lead.days === 1 ? "Yesterday" : `${lead.days} days ago`}
                </div>
              </div>
              <div className="ol-lead-contact">
                <div className="ol-phone-visible">{lead.phone}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Blurred + Lock (no purchase) ── */}
      {!hasPurchase && (
        <div className="ol-locked-wrap">
          <div className="ol-leads-list ol-leads-blurred-list">
            {blurredLeads.map((lead) => {
              const initials = lead.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
              return (
                <div className="ol-lead-card ol-lead-blurred" key={lead.id}>
                  <div className="ol-avatar" style={{ background: avatarColor(lead.name) }}>{initials}</div>
                  <div className="ol-lead-info">
                    <div className="ol-lead-name">{lead.name}</div>
                    <div className="ol-lead-meta">
                      <span>📍 {lead.city}</span>
                      <span>🛏 {lead.interest}</span>
                      <span>💰 {lead.budget}</span>
                    </div>
                  </div>
                  <div className="ol-lead-contact">
                    <div className="ol-phone-visible">{lead.phone}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ol-lock-overlay">
            <div className="ol-lock-icon">🔒</div>
            <p className="ol-lock-msg">Buy a plan to unlock more leads</p>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="ol-get-leads-cta">
        <button className="ol-get-leads-btn" onClick={() => navigate("/buy-leads")}>
          {hasPurchase ? "Buy More Leads →" : "Get More Leads →"}
        </button>
        {!hasPurchase && (
          <p className="ol-cta-note">25 to 200+ verified leads · Starting ₹500 + GST</p>
        )}
      </div>

    </div>
  );
}
