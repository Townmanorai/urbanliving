import React from "react";
import "./Subs1.css";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "🎯",
    title: "Choose a Plan",
    desc: "Select a lead package that suits your budget — 25, 75, or 200 leads based on your requirement."
  },
  {
    step: "02",
    icon: "💳",
    title: "Complete Payment",
    desc: "Make a secure online payment. 18% GST is applicable on all plans. No hidden charges."
  },
  {
    step: "03",
    icon: "📋",
    title: "Receive Your Leads",
    desc: "Leads are delivered directly to your Owner Dashboard — complete with tenant name, phone number, budget, and property preference."
  },
  {
    step: "04",
    icon: "📞",
    title: "Connect Directly",
    desc: "Call the tenant, schedule a visit, and close the deal — no middlemen, no commission."
  },
];

const BENEFITS = [
  { icon: "📍", text: "Active tenants from Noida & Greater Noida" },
  { icon: "✅", text: "Covers PG, flat, villa, and co-living properties" },
  { icon: "🛏", text: "Each lead includes budget, room type & location preference" },
  { icon: "📞", text: "Full contact details — verified name and phone number" },
  { icon: "🔄", text: "Fresh leads — recently registered, never recycled" },
  { icon: "🔒", text: "100% exclusive delivery — leads shared only with you" },
];

const Subs1 = () => {
  return (
    <div className="sl1-wrapper">

      {/* ── How it Works ── */}
      <section className="sl1-section">
        <div className="sl1-section-tag">How It Works</div>
        <h2 className="sl1-section-title">4 Simple Steps to Connect with Tenants</h2>

        <div className="sl1-steps">
          {HOW_IT_WORKS.map((item) => (
            <div className="sl1-step-card" key={item.step}>
              <div className="sl1-step-num">{item.step}</div>
              <div className="sl1-step-icon">{item.icon}</div>
              <h4 className="sl1-step-title">{item.title}</h4>
              <p className="sl1-step-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="sl1-benefits-section">
        <div className="sl1-benefits-inner">
          <div className="sl1-benefits-left">
            <div className="sl1-section-tag">Why Buy Leads</div>
            <h2 className="sl1-section-title" style={{ textAlign: 'left' }}>
              Verified Tenants.<br />
              Zero Middlemen.
            </h2>
            <p className="sl1-benefits-sub">
              Stop waiting for your listing to be discovered. We connect you directly
              with tenants who are actively looking for a property in Noida &amp;
              Greater Noida — right now.
            </p>
          </div>

          <div className="sl1-benefits-right">
            {BENEFITS.map((b, i) => (
              <div className="sl1-benefit-item" key={i}>
                <span className="sl1-benefit-icon">{b.icon}</span>
                <span className="sl1-benefit-text">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Subs1;
