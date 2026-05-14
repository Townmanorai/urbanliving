import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Login/AuthContext";
import "./Subs2.css";

const SLABS = [
  {
    id: "starter",
    label: "Starter",
    leads: 25,
    price: 3,
    gstPrice: 3,
    gstAmount: 0,
    perLead: "₹20",
    validity: "30 Days",
    popular: false,
    features: [
      "25 verified tenant leads",
      "Full contact details (name + phone)",
      "Location & budget preference",
      "Valid for 30 days",
      "Email support",
    ],
  },
  {
    id: "growth",
    label: "Growth",
    leads: 75,
    price: 1000,
    gstPrice: 1180,
    gstAmount: 180,
    perLead: "₹13.3",
    validity: "60 Days",
    popular: true,
    features: [
      "75 verified tenant leads",
      "Full contact details (name + phone)",
      "Location, budget & room preference",
      "Valid for 60 days",
      "Priority support",
      "Save ₹500 vs Starter plan",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    leads: 200,
    price: 1500,
    gstPrice: 1770,
    gstAmount: 270,
    perLead: "₹7.5",
    validity: "90 Days",
    popular: false,
    features: [
      "200 verified tenant leads",
      "Full contact details (name + phone)",
      "Location, budget & room preference",
      "Valid for 90 days",
      "Dedicated account manager",
      "Best value — save ₹2,500 vs Starter",
    ],
  },
];

const VALIDITY_MAP = { starter: "30 Days", growth: "60 Days", pro: "90 Days" };

export default function Subs2() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [modal, setModal] = useState(null);        // selected plan or null
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState("");

  /* ── Get user info from context / localStorage ── */
  const prefill = () => {
    try {
      const raw = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        name:  user?.username  || raw?.username  || raw?.name  || "",
        email: user?.email     || raw?.email     || "",
        phone: user?.phone     || raw?.phone     || raw?.phone_number || "",
      };
    } catch { return { name: "", email: "", phone: "" }; }
  };

  const openModal = (plan) => {
    if (!user) {
      navigate("/login", { state: { from: "/buy-leads" } });
      return;
    }
    const p = prefill();
    setForm(p);
    setErr("");
    setModal(plan);
  };

  const closeModal = () => { setModal(null); setErr(""); setPaying(false); };

  const handleCustom = () => {
    const msg = encodeURIComponent(
      "Hi OvikaLiving Team,\n\nI'm interested in a custom leads plan for my property. Please share details and pricing."
    );
    window.open(`https://wa.me/919999999999?text=${msg}`, "_blank");
  };

  /* ── Initiate PayU Payment ── */
  const handlePay = async () => {
    if (!form.name.trim())  return setErr("Please enter your name.");
    if (!form.email.trim()) return setErr("Please enter your email address.");
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      return setErr("Please enter a valid 10-digit phone number.");

    setPaying(true);
    setErr("");

    const txnId = `LEADS-${modal.id.toUpperCase()}-${Date.now()}`;

    /* save pending purchase — read by LeadsSuccess after redirect */
    localStorage.setItem("pending_leads_purchase", JSON.stringify({
      txnId,
      plan:        modal.label,
      leads:       modal.leads,
      baseAmount:  modal.price,
      gstAmount:   modal.gstAmount,
      totalAmount: modal.gstPrice,
      validity:    VALIDITY_MAP[modal.id],
      buyerName:   form.name.trim(),
      buyerEmail:  form.email.trim(),
      buyerPhone:  form.phone.trim(),
    }));

    try {
      const origin = window.location.origin; // http://localhost:5173 locally, https://ovikaliving.com in prod
      const res = await axios.post("https://www.townmanor.ai/api/payu/payment", {
        amount:      modal.gstPrice,
        productinfo: `Lead Purchase - ${modal.label} Plan (${modal.leads} Leads)`,
        firstname:   form.name.trim(),
        email:       form.email.trim(),
        phone:       form.phone.trim().replace(/\s/g, ""),
        bookingId:   txnId,
        surl: `https://www.townmanor.ai/api/boster/payu/success?redirectUrl=${origin}/leads-success`,
        furl: `https://www.townmanor.ai/api/boster/payu/failure?redirectUrl=${origin}/failure`,
      });

      const { paymentUrl, params } = res.data;
      if (!paymentUrl) throw new Error("Invalid response from payment server.");

      /* create hidden form and submit — same pattern as existing booking payment */
      const formEl = document.createElement("form");
      formEl.method = "POST";
      formEl.action = paymentUrl;
      Object.entries(params || {}).forEach(([k, v]) => {
        const inp = document.createElement("input");
        inp.type = "hidden";
        inp.name = k;
        inp.value = v;
        formEl.appendChild(inp);
      });
      document.body.appendChild(formEl);
      formEl.submit();
    } catch (e) {
      console.error(e);
      setPaying(false);
      setErr("Payment initiation failed. Please try again or contact support.");
    }
  };

  return (
    <section className="sl2-wrapper">
      <div className="sl2-inner">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="sl2-tag">Choose Your Plan</div>
          <h2 className="sl2-title">Simple, Transparent Pricing</h2>
        </div>

        {/* ── Plan Cards ── */}
        <div className="sl2-cards">
          {SLABS.map((plan) => (
            <div
              className={`sl2-card ${plan.popular ? "sl2-card-popular" : ""}`}
              key={plan.id}
            >
              {plan.popular && <div className="sl2-popular-badge">⭐ Most Popular</div>}

              <div className="sl2-card-header">
                <h3 className="sl2-plan-name">{plan.label}</h3>
                <div className="sl2-leads-count">{plan.leads} Leads</div>
              </div>

              <div className="sl2-price-block">
                <div className="sl2-price">₹{plan.price}</div>
                <div className="sl2-gst-line">+ 18% GST = <strong>₹{plan.gstPrice}</strong> total</div>
                <div className="sl2-per-lead">{plan.perLead} per lead</div>
              </div>

              <ul className="sl2-features">
                {plan.features.map((f, i) => (
                  <li key={i}><span className="sl2-check">✓</span> {f}</li>
                ))}
              </ul>

              <button
                className={`sl2-buy-btn ${plan.popular ? "sl2-buy-popular" : "sl2-buy-default"}`}
                onClick={() => openModal(plan)}
              >
                Buy Now — ₹{plan.gstPrice}
              </button>
            </div>
          ))}

          {/* ── Custom Card ── */}
          <div className="sl2-card sl2-card-custom">
            <div className="sl2-card-header">
              <h3 className="sl2-plan-name">Custom</h3>
              <div className="sl2-leads-count">200+ Leads</div>
            </div>
            <div className="sl2-price-block">
              <div className="sl2-price" style={{ fontSize: 26 }}>Talk to Us</div>
              <div className="sl2-gst-line" style={{ visibility: "hidden" }}>—</div>
              <div className="sl2-per-lead">Best bulk rates</div>
            </div>
            <ul className="sl2-features">
              <li><span className="sl2-check">✓</span> 200+ leads as per requirement</li>
              <li><span className="sl2-check">✓</span> Custom validity period</li>
              <li><span className="sl2-check">✓</span> Dedicated account manager</li>
              <li><span className="sl2-check">✓</span> Special bulk pricing</li>
              <li><span className="sl2-check">✓</span> Priority lead delivery</li>
            </ul>
            <button className="sl2-buy-btn sl2-buy-outline" onClick={handleCustom}>
              Contact Us on WhatsApp
            </button>
          </div>
        </div>

        {/* ── GST Note ── */}
        <p className="sl2-gst-note">
          * All prices are exclusive of 18% GST. GST amount will be added at checkout.
          For GSTIN-based billing or invoice queries, contact our support team.
        </p>

        {/* ── Comparison Table ── */}
        <div style={{ marginTop: 52 }}>
          <h3 className="sl2-table-heading">Plan Comparison</h3>
          <div className="sl2-table-wrap">
            <table className="sl2-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Leads</th>
                  <th>Price (excl. GST)</th>
                  <th>Price (incl. 18% GST)</th>
                  <th>Per Lead</th>
                  <th>Validity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {SLABS.map((plan) => (
                  <tr key={plan.id} className={plan.popular ? "sl2-tr-popular" : ""}>
                    <td>
                      <strong>{plan.label}</strong>
                      {plan.popular && <span className="sl2-table-badge">Popular</span>}
                    </td>
                    <td><strong>{plan.leads}</strong></td>
                    <td>₹{plan.price}</td>
                    <td><strong>₹{plan.gstPrice}</strong></td>
                    <td style={{ color: "#6b5540" }}>{plan.perLead}</td>
                    <td style={{ color: "#6b5540" }}>{plan.validity}</td>
                    <td>
                      <button className="sl2-table-btn" onClick={() => openModal(plan)}>
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Custom</strong></td>
                  <td>200+</td>
                  <td colSpan={2} style={{ color: "#6b5540" }}>Custom pricing</td>
                  <td>Best rate</td>
                  <td>Custom</td>
                  <td>
                    <button className="sl2-table-btn sl2-table-btn-outline" onClick={handleCustom}>
                      Contact
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ════════ PAYMENT MODAL ════════ */}
      {modal && (
        <div className="sl2-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sl2-modal">
            <button className="sl2-modal-close" onClick={closeModal}>✕</button>

            <div className="sl2-modal-header">
              <div className="sl2-modal-plan-badge">{modal.label} Plan</div>
              <h3 className="sl2-modal-title">Complete Your Purchase</h3>
              <p className="sl2-modal-sub">{modal.leads} Leads · Valid for {VALIDITY_MAP[modal.id]}</p>
            </div>

            {/* ── Amount summary ── */}
            <div className="sl2-modal-amount">
              <div className="sl2-modal-amt-row">
                <span>Base Price</span>
                <span>₹{modal.price}</span>
              </div>
              <div className="sl2-modal-amt-row">
                <span>GST (18%)</span>
                <span>₹{modal.gstAmount}</span>
              </div>
              <div className="sl2-modal-amt-row sl2-modal-amt-total">
                <span>Total Payable</span>
                <strong>₹{modal.gstPrice}</strong>
              </div>
            </div>

            {/* ── Form ── */}
            <div className="sl2-modal-form">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                maxLength={10}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              />
            </div>

            {err && <p className="sl2-modal-err">{err}</p>}

            <button
              className="sl2-modal-pay-btn"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? "Redirecting to Payment…" : `Pay ₹${modal.gstPrice} via PayU`}
            </button>

            <p className="sl2-modal-secure">
              🔒 Secured by PayU · 256-bit SSL Encryption
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
