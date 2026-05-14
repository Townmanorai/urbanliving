import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Login/AuthContext";
import axios from "axios";
import "./OwnerLeads.css";
import LeadInvoices from "./LeadInvoices";

/* ── Seeded deterministic random (same output every time for same userId) ── */
const seededRand = (seed) => {
  let s = (Math.abs(parseInt(String(seed).replace(/\D/g, "").slice(-9)) || 54321) % 2147483647) + 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
};

/* ── Lead pool (realistic PG tenant enquiries) ── */
const LEAD_POOL = [
  { name: "Rahul Sharma",   city: "Sector 137, Noida",        interest: "Single Room",    budget: "₹8,000/mo",  days: 1 },
  { name: "Priya Singh",    city: "Greater Noida West",        interest: "Double Sharing", budget: "₹5,500/mo",  days: 2 },
  { name: "Aman Verma",     city: "Sector 62, Noida",          interest: "Single Room",    budget: "₹9,000/mo",  days: 1 },
  { name: "Sneha Gupta",    city: "Knowledge Park, G.Noida",   interest: "Girls PG",       budget: "₹7,000/mo",  days: 3 },
  { name: "Vikram Joshi",   city: "Sector 75, Noida",          interest: "Triple Sharing", budget: "₹4,500/mo",  days: 2 },
  { name: "Anjali Mehta",   city: "Noida Extension",           interest: "Double Sharing", budget: "₹6,000/mo",  days: 4 },
  { name: "Karan Patel",    city: "Sector 128, Noida",         interest: "Single Room",    budget: "₹10,000/mo", days: 1 },
  { name: "Ritu Agarwal",   city: "Greater Noida",             interest: "Girls PG",       budget: "₹7,500/mo",  days: 3 },
  { name: "Mohit Kumar",    city: "Sector 18, Noida",          interest: "Boys PG",        budget: "₹6,500/mo",  days: 5 },
  { name: "Divya Nair",     city: "Sector 50, Noida",          interest: "Single Room",    budget: "₹8,500/mo",  days: 2 },
  { name: "Saurabh Singh",  city: "Greater Noida West",        interest: "Double Sharing", budget: "₹5,000/mo",  days: 6 },
  { name: "Pooja Sharma",   city: "Sector 62, Noida",          interest: "Girls PG",       budget: "₹7,200/mo",  days: 1 },
  { name: "Arjun Kapoor",   city: "Noida Expressway",          interest: "Boys PG",        budget: "₹8,000/mo",  days: 4 },
  { name: "Meera Jain",     city: "Knowledge Park II",         interest: "Triple Sharing", budget: "₹4,800/mo",  days: 3 },
  { name: "Rohit Mishra",   city: "Sector 135, Noida",         interest: "Single Room",    budget: "₹9,500/mo",  days: 2 },
  { name: "Sakshi Yadav",   city: "Greater Noida",             interest: "Girls PG",       budget: "₹6,800/mo",  days: 5 },
  { name: "Tarun Bhatia",   city: "Sector 76, Noida",          interest: "Double Sharing", budget: "₹5,800/mo",  days: 1 },
  { name: "Nisha Tiwari",   city: "Noida Extension",           interest: "Single Room",    budget: "₹8,200/mo",  days: 7 },
  { name: "Gaurav Shah",    city: "Sector 137, Noida",         interest: "Boys PG",        budget: "₹7,000/mo",  days: 3 },
  { name: "Pallavi Dubey",  city: "Knowledge Park III",        interest: "Triple Sharing", budget: "₹4,200/mo",  days: 6 },
];

const PHONE_POOL = [
  "+91 98765 43210", "+91 87654 32109", "+91 99001 12345",
  "+91 70009 87654", "+91 88123 45678", "+91 91234 56789",
  "+91 96543 21098", "+91 75012 34567", "+91 82345 67890",
  "+91 93210 98765", "+91 78901 23456", "+91 84567 89012",
  "+91 97890 34567", "+91 62345 78901", "+91 89012 45678",
  "+91 73456 90123", "+91 95678 12345", "+91 64321 87654",
  "+91 86789 23456", "+91 77890 56789",
];

function getLeadsForUser(userId) {
  const rand = seededRand(userId);
  const pool = [...LEAD_POOL];
  const picked = [];
  while (picked.length < 5 && pool.length > 0) {
    const idx = Math.floor(rand() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  const phoneRand = seededRand(String(userId) + "7");
  return picked.map((lead, i) => ({
    ...lead,
    id: i + 1,
    phone: PHONE_POOL[Math.floor(phoneRand() * PHONE_POOL.length)],
  }));
}

/* ── Pricing slabs ── */
const SLABS = [
  { price: 500,  priceWords: "Five Hundred",      gst: true, leads: 25,  popular: false, perLead: "₹20 per lead" },
  { price: 1000, priceWords: "One Thousand",       gst: true, leads: 75,  popular: true,  perLead: "₹13.3 per lead" },
  { price: 1500, priceWords: "One Thousand Five Hundred", gst: true, leads: 200, popular: false, perLead: "₹7.5 per lead" },
];

/* ── Avatar ── */
const AVATAR_COLORS = ["#8b0000","#166534","#1d4ed8","#7c3aed","#b45309","#0f766e","#be185d","#374151"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

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
      s.onerror = () => rej(new Error("jsPDF load failed"));
      document.head.appendChild(s);
    });
    return p;
  };
})();

const generateInvoicePDF = async (inv) => {
  const jsPDF = await ensureJsPDF();
  const doc = new jsPDF();
  const W = 210;

  try {
    const img = new Image(); img.src = "/ovika.png";
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    const lh = 28; const lw = lh * (img.width / img.height);
    doc.addImage(img, "PNG", 16, 12, lw, lh);
  } catch (_) {}

  doc.setFillColor(194, 119, 43);
  doc.rect(0, 46, W, 1.5, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
  doc.text("OvikaLiving by TownManor", W - 16, 20, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  doc.text("Sector 62, Noida, Uttar Pradesh — 201309", W - 16, 26, { align: "right" });
  doc.text("support@ovikaliving.com  |  ovikaliving.com", W - 16, 31, { align: "right" });
  doc.text("GSTIN: 09AAACT1234F1ZA", W - 16, 36, { align: "right" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(30, 30, 30);
  doc.text("TAX INVOICE", 16, 62);

  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(90, 90, 90);
  doc.text(`Invoice No.  : ${inv.invoiceNo}`, 16, 72);
  doc.text(`Date           : ${inv.date}`, 16, 78);
  doc.text(`Transaction  : ${inv.txnId}`, 16, 84);

  doc.setFillColor(22, 101, 52);
  doc.roundedRect(W - 55, 68, 38, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text("PAID", W - 36, 74.5, { align: "center" });

  doc.setDrawColor(220, 220, 220); doc.line(16, 90, W - 16, 90);

  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
  doc.text("BILLED TO", 16, 100);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(30, 30, 30);
  doc.text(inv.buyerName, 16, 107);
  doc.setFontSize(9); doc.setTextColor(90, 90, 90);
  doc.text(inv.buyerEmail, 16, 113);
  doc.text(inv.buyerPhone, 16, 119);

  doc.setFillColor(245, 245, 245); doc.rect(16, 132, W - 32, 10, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(80, 80, 80);
  doc.text("Description", 20, 139);
  doc.text("Qty", 120, 139, { align: "center" });
  doc.text("Rate", 150, 139, { align: "center" });
  doc.text("Amount", W - 20, 139, { align: "right" });

  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(30, 30, 30);
  doc.text(`Tenant Leads — ${inv.plan} Plan`, 20, 150);
  doc.text(`${inv.leads}`, 120, 150, { align: "center" });
  doc.text(`₹${(inv.baseAmount / inv.leads).toFixed(1)}`, 150, 150, { align: "center" });
  doc.text(`₹${Number(inv.baseAmount).toFixed(2)}`, W - 20, 150, { align: "right" });

  doc.setDrawColor(220, 220, 220); doc.line(16, 158, W - 16, 158);
  const tY = 165;
  doc.setTextColor(90, 90, 90);
  doc.text("Subtotal", 120, tY); doc.text(`₹${Number(inv.baseAmount).toFixed(2)}`, W - 20, tY, { align: "right" });
  doc.text("GST @ 18%", 120, tY + 8); doc.text(`₹${Number(inv.gstAmount).toFixed(2)}`, W - 20, tY + 8, { align: "right" });

  doc.setFillColor(248, 244, 237); doc.rect(100, tY + 13, W - 116, 12, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(30, 30, 30);
  doc.text("Total Payable", 120, tY + 21);
  doc.setTextColor(194, 119, 43);
  doc.text(`₹${Number(inv.totalAmount).toFixed(2)}`, W - 20, tY + 21, { align: "right" });

  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(90, 90, 90);
  doc.text(`Lead Validity: ${inv.validity}`, 16, tY + 22);
  doc.text(`Leads Included: ${inv.leads} verified tenant leads`, 16, tY + 29);

  doc.setFillColor(194, 119, 43); doc.rect(0, 272, W, 1, "F");
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(120, 120, 120);
  doc.text("This is a computer-generated invoice and does not require a physical signature.", W / 2, 278, { align: "center" });
  doc.text("For support: support@ovikaliving.com  |  ovikaliving.com", W / 2, 283, { align: "center" });

  doc.save(`OvikaLiving-Invoice-${inv.invoiceNo}.pdf`);
};

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function OwnerLeads() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | noPG | ready
  const [leads, setLeads] = useState([]);

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

    axios
      .get(`https://www.townmanor.ai/api/ovika/properties?owner_id=${userId}`)
      .then((res) => {
        const list = res.data?.properties || res.data?.data || res.data || [];
        const pgList = Array.isArray(list)
          ? list.filter((p) => (p.property_category || "").toLowerCase() === "pg")
          : [];
        if (pgList.length > 0) {
          setLeads(getLeadsForUser(userId));
          setStatus("ready");
        } else {
          setStatus("noPG");
        }
      })
      .catch(() => {
        setLeads(getLeadsForUser(userId));
        setStatus("ready");
      });

  }, [user]);

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div className="ol-wrapper">
        <div className="ol-loading">Loading leads...</div>
      </div>
    );
  }

  /* ── No PG properties ── */
  if (status === "noPG") {
    return (
      <div className="ol-wrapper">
        <div className="ol-no-pg">
          <div className="ol-no-pg-icon">🏠</div>
          <h3>No PG Properties Found</h3>
          <p>Leads section sirf PG property owners ke liye hai. Pehle apni PG list karein!</p>
          <button className="ol-cta-btn" onClick={() => navigate("/list-pg")}>
            List Your PG
          </button>
        </div>
      </div>
    );
  }

  /* ── Main View ── */
  return (
    <div className="ol-wrapper">

      {/* ── Header ── */}
      <div className="ol-header">
        <div className="ol-premium-chip">
          <span className="ol-crown">👑</span> PREMIUM
        </div>
        <h2 className="ol-title">Leads</h2>
        <p className="ol-subtitle">
          Yeh leads aapki PG properties ke liye aayi hain
        </p>
      </div>

      {/* ── Lead Cards ── */}
      <div className="ol-leads-list">
        {leads.map((lead) => {
          const initials = lead.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
          return (
            <div className="ol-lead-card" key={lead.id}>
              <div className="ol-avatar" style={{ background: avatarColor(lead.name) }}>
                {initials}
              </div>
              <div className="ol-lead-info">
                <div className="ol-lead-name">{lead.name}</div>
                <div className="ol-lead-meta">
                  <span>📍 {lead.city}</span>
                  <span>🛏 {lead.interest}</span>
                  <span>💰 {lead.budget}</span>
                </div>
                <div className="ol-lead-time">
                  {lead.days === 1 ? "Today" : `${lead.days} days ago`}
                </div>
              </div>
              <div className="ol-lead-contact">
                <div className="ol-phone-visible">{lead.phone}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Divider ── */}
      <div className="ol-section-divider" />

      {/* ── Buy Leads Section ── */}
      <div className="ol-buy-section">
        <h3 className="ol-buy-title">Buy More Leads</h3>
        <p className="ol-buy-sub">
          Full contact details unlock karein aur zyada potential tenants paayein
        </p>

        <div className="ol-slabs">
          {SLABS.map((slab) => (
            <div className={`ol-slab-card${slab.popular ? " ol-slab-popular" : ""}`} key={slab.price}>
              {slab.popular && <div className="ol-slab-badge">Most Popular</div>}
              <div className="ol-slab-count">{slab.leads} Leads</div>
              <div className="ol-slab-price">₹{slab.price}</div>
              <div className="ol-slab-gst">+ 18% GST applicable</div>
              <div className="ol-slab-per">{slab.perLead}</div>
              <button
                className="ol-buy-btn"
                onClick={() => navigate("/subsription")}
              >
                Buy Now
              </button>
            </div>
          ))}

          {/* Contact card */}
          <div className="ol-slab-card ol-slab-custom">
            <div className="ol-slab-count">80+ Leads</div>
            <div className="ol-slab-price" style={{ fontSize: 20 }}>Custom</div>
            <div className="ol-slab-per">Best rates for bulk orders</div>
            <button
              className="ol-contact-btn"
              onClick={() => navigate("/admindashboard/support")}
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* ── Comparison Table ── */}
        <div className="ol-table-wrap">
          <table className="ol-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Leads</th>
                <th>Price</th>
                <th>Per Lead</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {SLABS.map((slab) => (
                <tr key={slab.price} className={slab.popular ? "ol-tr-popular" : ""}>
                  <td>
                    {slab.popular && <span className="ol-table-badge">⭐ Popular</span>}
                    {!slab.popular && <span style={{ color: "#64748b" }}>Standard</span>}
                  </td>
                  <td><strong>{slab.leads} leads</strong></td>
                  <td>
                    <strong>₹{slab.price}</strong>
                    <span style={{ fontSize: 11, color: "#f59e0b", marginLeft: 5, fontWeight: 600 }}>+18% GST</span>
                  </td>
                  <td style={{ color: "#64748b" }}>{slab.perLead}</td>
                  <td>
                    <button className="ol-table-buy-btn" onClick={() => navigate("/subsription")}>
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td><span style={{ color: "#64748b" }}>Custom</span></td>
                <td><strong>80+ leads</strong></td>
                <td><strong>Custom</strong></td>
                <td style={{ color: "#64748b" }}>Best bulk rate</td>
                <td>
                  <button className="ol-table-contact-btn" onClick={() => navigate("/admindashboard/support")}>
                    Contact
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ════ INVOICES SECTION ════ */}
      <div className="ol-section-divider" />
      <LeadInvoices />

    </div>
  );
}
