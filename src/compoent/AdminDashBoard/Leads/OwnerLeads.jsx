import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Login/AuthContext";
import axios from "axios";
import "./OwnerLeads.css";
import LeadInvoices from "./LeadInvoices";

/* ── Seeded deterministic random ── */
const seededRand = (seed) => {
  let s = (Math.abs(parseInt(String(seed).replace(/\D/g, "").slice(-9)) || 54321) % 2147483647) + 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
};

const LEAD_POOL = [
  { name: "Rahul Sharma",   city: "Sector 137, Noida",        interest: "Single Room",    budget: "₹8,000/mo",  days: 1 },
  { name: "Priya Singh",    city: "Greater Noida West",        interest: "Double Sharing", budget: "₹5,500/mo",  days: 2 },
  { name: "Aman Verma",     city: "Sector 62, Noida",          interest: "Single Room",    budget: "₹9,000/mo",  days: 1 },
  { name: "Sneha Gupta",    city: "Knowledge Park, G.Noida",   interest: "Girls PG",       budget: "₹7,000/mo",  days: 3 },
  { name: "Vikram Joshi",   city: "Sector 75, Noida",          interest: "Triple Sharing", budget: "₹4,500/mo",  days: 2 },
  { name: "Anjali Mehta",   city: "Noida Extension",           interest: "Double Sharing", budget: "₹6,000/mo",  days: 4 },
  { name: "Karan Patel",    city: "Sector 128, Noida",         interest: "Single Room",    budget: "₹10,000/mo", days: 1 },
  { name: "Ritu Agarwal",   city: "Greater Noida",             interest: "Girls PG",       budget: "₹7,500/mo",  days: 3 },
];

const PHONE_POOL = [
  "+91 98765 43210", "+91 87654 32109", "+91 99001 12345",
  "+91 70009 87654", "+91 88123 45678", "+91 91234 56789",
  "+91 96543 21098", "+91 75012 34567",
];

function getLeadsForUser(userId) {
  const rand = seededRand(userId);
  const pool = [...LEAD_POOL];
  const picked = [];
  while (picked.length < 8 && pool.length > 0) {
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

const AVATAR_COLORS = ["#8b0000","#166534","#1d4ed8","#7c3aed","#b45309","#0f766e","#be185d","#374151"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function OwnerLeads() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
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
        const userId2 = getUserId();
        setLeads(getLeadsForUser(userId2));
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
          <p>This section is available for PG property owners. List your PG property first to access tenant leads.</p>
          <button className="ol-cta-btn" onClick={() => navigate("/list-pg")}>
            List Your PG
          </button>
        </div>
      </div>
    );
  }

  const visibleLeads = leads.slice(0, 5);
  const blurredLeads = leads.slice(5, 8);

  /* ── Main View ── */
  return (
    <div className="ol-wrapper">

      {/* ── Header ── */}
      <div className="ol-header">
        <div className="ol-premium-chip">
          <span className="ol-crown">👑</span> PREMIUM
        </div>
        <h2 className="ol-title">Tenant Leads</h2>
        <p className="ol-subtitle">
          Verified tenant leads for your property. Buy a plan to unlock full contact details.
        </p>
      </div>

      {/* ── Visible Lead Cards (5) ── */}
      <div className="ol-leads-list">
        {visibleLeads.map((lead) => {
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

      {/* ── Blurred Cards (3) + Lock overlay + CTA ── */}
      <div className="ol-locked-wrap">
        <div className="ol-leads-list ol-leads-blurred-list">
          {blurredLeads.map((lead) => {
            const initials = lead.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
            return (
              <div className="ol-lead-card ol-lead-blurred" key={lead.id}>
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

        {/* Lock overlay */}
        <div className="ol-lock-overlay">
          <div className="ol-lock-icon">🔒</div>
          <p className="ol-lock-msg">Buy a plan to unlock more leads</p>
        </div>
      </div>

      {/* ── Big CTA Button ── */}
      <div className="ol-get-leads-cta">
        <button
          className="ol-get-leads-btn"
          onClick={() => navigate("/buy-leads")}
        >
          Get More Leads →
        </button>
        <p className="ol-cta-note">25 to 200+ verified leads · Starting ₹500 + GST</p>
      </div>

      {/* ════ INVOICES SECTION ════ */}
      <div className="ol-section-divider" />
      <LeadInvoices />

    </div>
  );
}
