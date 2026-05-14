import React, { useState } from "react";
import "./Subs3.css";

const faqData = [
  {
    q: "What is a lead?",
    a: "A lead is a verified tenant enquiry. You receive the tenant's name, phone number, location preference, budget, and property type requirement. These are individuals actively searching for a rental property in Noida or Greater Noida."
  },
  {
    q: "Which property types are covered?",
    a: "Leads are available for all property types listed on OvikaLiving — PG, flat, villa, co-living spaces, and more. You will receive enquiries relevant to your property category."
  },
  {
    q: "When will I receive my leads after payment?",
    a: "Leads are delivered to your Owner Dashboard within 24 hours of payment confirmation. If you experience any delay, please contact our support team."
  },
  {
    q: "Are the leads verified and genuine?",
    a: "Yes. Our team reviews every lead before delivery. Fake numbers, duplicate entries, and spam are filtered out. Only genuine, active tenant enquiries are delivered to you."
  },
  {
    q: "Is 18% GST applicable on all plans?",
    a: "Yes, 18% GST is applicable on all plans. For example, the ₹500 plan will be billed as ₹590 (₹500 + ₹90 GST). If you require a GST invoice against your GSTIN, please contact our support team."
  },
  {
    q: "What is the validity of each plan?",
    a: "Starter (25 leads) — valid for 30 days. Growth (75 leads) — valid for 60 days. Pro (200 leads) — valid for 90 days. Leads must be accessed within the validity period."
  },
  {
    q: "Can I get a refund for unused leads?",
    a: "Leads are a digital service and are non-refundable once purchased. We recommend choosing a plan that matches your current requirement. For guidance, reach out to our team before purchasing."
  },
  {
    q: "What if I need more than 200 leads?",
    a: "We offer custom plans for high-volume requirements. Contact our team via WhatsApp or the support page. Bulk orders receive preferential pricing and a dedicated account manager."
  },
];

const Subs3 = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="sl3-wrapper">
      <div className="sl3-inner">

        {/* ── FAQ ── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="sl3-tag">FAQ</div>
          <h2 className="sl3-title">Frequently Asked Questions</h2>
          <p className="sl3-sub">Everything you need to know before purchasing a leads plan.</p>
        </div>

        <div className="sl3-faq-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`sl3-faq-item ${activeIndex === index ? "sl3-faq-open" : ""}`}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <div className="sl3-faq-q">
                <span className="sl3-faq-num">{String(index + 1).padStart(2, "0")}</span>
                <p>{item.q}</p>
                <span className="sl3-faq-toggle">{activeIndex === index ? "−" : "+"}</span>
              </div>
              {activeIndex === index && (
                <div className="sl3-faq-a">{item.a}</div>
              )}
            </div>
          ))}
        </div>

        {/* ── Contact CTA ── */}
        <div className="sl3-cta-box">
          <div className="sl3-cta-left">
            <h3 className="sl3-cta-title">Still have questions?</h3>
            <p className="sl3-cta-desc">
              Our team is happy to help you choose the right plan for your property.
              We typically respond within a few hours.
            </p>
          </div>
          <div className="sl3-cta-right">
            <a
              href="https://wa.me/919999999999?text=Hi%20OvikaLiving%20Team%2C%20I%20have%20a%20question%20about%20the%20leads%20plans."
              target="_blank"
              rel="noreferrer"
              className="sl3-whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Subs3;
