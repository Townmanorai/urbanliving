import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import "./CareerSupport.css";

// react-icons imports
import { FiCode, FiTrendingUp, FiMapPin, FiArrowRight, FiX, FiCheck } from "react-icons/fi";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { BsBuildingsFill } from "react-icons/bs";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlinePaperAirplane,
  HiOutlineCurrencyRupee,
} from "react-icons/hi";

/* ── DATA ──────────────────────────────── */
const roles = [
  {
    title: "Software Intern",
    dept: "Engineering",
    type: "Internship · 3–4 Months",
    location: "Noida",
    Icon: FiCode,
    tags: ["React", "Node.js", "REST APIs"],
    desc: "Work directly with our product & engineering team to build features used by thousands of guests and hosts across India.",
  },
  {
    title: "AI Marketing Intern",
    dept: "Marketing & Growth",
    type: "Internship · 3–4 Months",
    location: "Noida",
    Icon: MdOutlineRocketLaunch,
    tags: ["AI Tools", "Content Strategy", "Growth Hacking"],
    desc: "Use cutting-edge AI tools to drive campaigns, create viral content, and grow OvikaLiving's digital presence at scale.",
  },
];

const perks = [
  { Icon: BsBuildingsFill,         title: "Industry-Level Work",     desc: "Ship real products used by 50,000+ guests. No dummy projects — you'll own features from day one." },
  { Icon: HiOutlineChartBar,       title: "Smart Leadership",        desc: "Work under founders and senior leaders who've built and scaled products across India's top proptech firms." },
  { Icon: FiCode,                  title: "Deep Tech Exposure",      desc: "Hands-on with modern stacks — React, Node, AI tooling, and cloud infra. Build skills that matter in 2025." },
  { Icon: HiOutlineAcademicCap,    title: "Learning & Mentorship",   desc: "Dedicated learning budget, weekly knowledge sessions, and 1:1 mentorship from domain experts." },
  { Icon: HiOutlinePaperAirplane,  title: "Travel Allowance",        desc: "Site visits, team offsites, and property tours covered — because great products need real-world context." },
  { Icon: HiOutlineCurrencyRupee,  title: "Genuine Pay & Perks",     desc: "Competitive stipends, performance bonuses, and a clear path to a full-time role with ESOP eligibility." },
];

const stats = [
  { number: "200+",  label: "Properties Listed" },
  { number: "50K+",  label: "Happy Guests"      },
  { number: "3",     label: "Cities & Growing"  },
  { number: "4.8★",  label: "Avg. Rating"       },
];

const stripImages = [
  { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80",  alt: "Premium living space"      },
  { src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", alt: "Cozy apartment interior" },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", alt: "Modern office workspace"  },
];

/* ── COMPONENT ─────────────────────────── */
export default function CareerSupport() {
  const [formData,     setFormData]     = useState({ name: "", email: "", phone_number: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [activeRole,   setActiveRole]   = useState(null);
  const [visible,      setVisible]      = useState({});
  const formRef     = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            setVisible((prev) => ({ ...prev, [e.target.dataset.section]: true }));
        }),
      { threshold: 0.13 }
    );
    document.querySelectorAll("[data-section]").forEach((el) =>
      observerRef.current.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name:          formData.name,
        phone_number:  formData.phone_number,
        purpose:       `Email: ${formData.email} | Application Details: ${formData.message}`,
        source:        "Career Support Form",
        city:          "N/A",
        property_id:   0,
        property_name: "Career Page",
      };
      const res = await fetch("https://www.townmanor.ai/api/formlead/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (res.ok) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", phone_number: "", message: "" });
      } else {
        throw new Error("failed");
      }
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const rv = (key) => `cs-reveal${visible[key] ? " cs-visible" : ""}`;

  return (
    <div className="cs-page">
      <Helmet>
        <title>Careers at OvikaLiving — Join Our Team | Townmanor Technologies</title>
        <meta name="description" content="Explore career opportunities at OvikaLiving by Townmanor Technologies. Join our team of innovators building India's smartest rental and co-living platform. Apply for tech, sales, operations & more roles." />
        <meta name="keywords" content="ovikaliving careers, jobs at ovikaliving, townmanor technologies careers, proptech jobs noida, software intern noida, marketing intern noida, real estate tech jobs, co-living platform jobs, startup jobs noida, apply ovikaliving, rental platform careers india" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/career-support" />
        <meta name="author" content="OvikaLiving" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Careers at OvikaLiving | Townmanor Technologies" />
        <meta property="og:description" content="Join OvikaLiving — India's smartest rental platform. Open roles in tech, sales, operations and more. Apply today." />
        <meta property="og:url" content="https://www.ovikaliving.com/career-support" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/careerdesktop.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OvikaLiving" />
        <meta name="twitter:title" content="Careers at OvikaLiving | Townmanor Technologies" />
        <meta name="twitter:description" content="Join OvikaLiving — open roles in tech, sales & operations. Apply today." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/careerdesktop.png" />
      </Helmet>

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className="cs-hero">
        <div className="cs-hero-img" />
        <div className="cs-hero-overlay" />
        <div className="cs-hero-content">
          <div className="cs-hero-badge">
            <span className="cs-hero-badge-dot" />
            We're Hiring
          </div>
          <h1 className="cs-hero-title">
            Build India’s <br />
            <span> Next Generation Living Platform</span>
          </h1>
          <p className="cs-hero-sub">
           Join OvikaLiving and help build a trusted platform aggregating short-term and long-term rental homes, co-living spaces, and premium stays across India.
          </p>
          <div className="cs-hero-btns">
            <button className="cs-btn-gold" onClick={scrollToForm}>
              Apply Now <FiArrowRight style={{ marginLeft: 6, verticalAlign: "middle" }} />
            </button>
            <button
              className="cs-btn-outline-white"
              onClick={() =>
                document.getElementById("cs-roles")?.scrollIntoView({ behavior: "smooth" })
                
              }
            >
              View Open Roles
            </button>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ══════════════════════════════════════ */}
      {/* <div className="cs-stats">
        {stats.map((s) => (
          <div className="cs-stat" key={s.label}>
            <span className="cs-stat-num">{s.number}</span>
            <span className="cs-stat-label">{s.label}</span>
          </div>
        ))}
      </div> */}

      {/* ═══ ABOUT / MISSION ════════════════════════════════ */}
      <div className="cs-about-wrap">
        <div className="cs-section" data-section="about">
          <div className={`cs-about-grid ${rv("about")}`}>

            {/* image — no float card */}
            <div className="cs-about-img-col">
              <div className="cs-about-img-main">
                <img
                  src="/mission.jpeg"
                  alt="OvikaLiving property"
                />
              </div>
            </div>

            {/* text */}
            <div>
              <div className="cs-section-tag">Our Mission</div>
              <h2 className="cs-section-title">
                More than a job.<br />A movement.
              </h2>
              <div className="cs-about-quote">
                "Luxury living, made accessible."
              </div>
              <p className="cs-about-text">
                OvikaLiving is a flagship rental brand of Townmanor Technologies
                Pvt. Ltd. We curate premium short- and long-term accommodations
                across India's fastest growing cities.
              </p>
              <div className="cs-about-divider" />
              <p className="cs-about-text">
                When you join us, you're not filling a seat — you're shaping how
                an entire generation will rent, live, and experience spaces.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ PHOTO STRIP ════════════════════════════════════ */}
      <div style={{ padding: "48px 0 0", background: "#fdf8f2" }}>
        <div className="cs-photo-strip">
          {stripImages.map((img) => (
            <div className="cs-photo-strip-item" key={img.src}>
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ OPEN ROLES ═════════════════════════════════════ */}
      <div className="cs-roles-wrap" id="cs-roles">
        <div className="cs-section" data-section="roles">

          <div className={`cs-roles-head ${rv("roles")}`}>
            <div>
              <div className="cs-section-tag">Open Positions</div>
              <h2 className="cs-section-title">
                Find your<br />perfect role
              </h2>
            </div>
            <p className="cs-section-desc" style={{ fontSize: 14, maxWidth: 260 }}>
              Can't find the right fit? Apply anyway — we'll reach out when
              something matches.
            </p>
          </div>

          <div className="cs-roles-grid">
            {roles.map((role, i) => {
              const RoleIcon = role.Icon;
              return (
                <div
                  key={role.title}
                  className={`cs-role-card cs-reveal cs-d${i + 1}${visible["roles"] ? " cs-visible" : ""}${activeRole === i ? " cs-active" : ""}`}
                >
                  <div className="cs-role-top">
                    <div className="cs-role-icon-box">
                      <RoleIcon size={22} />
                    </div>
                    <span className="cs-role-badge">{role.type}</span>
                  </div>

                  <div className="cs-role-title">{role.title}</div>
                  <div className="cs-role-dept">{role.dept}</div>
                  <p className="cs-role-desc">{role.desc}</p>

                  <div className="cs-role-location">
                    <FiMapPin size={12} />
                    {role.location}
                  </div>

                  <div className="cs-role-tags">
                    {role.tags.map((t) => (
                      <span className="cs-role-tag" key={t}>{t}</span>
                    ))}
                  </div>

                  <button
                    className="cs-role-apply-btn"
                    onClick={() => { setActiveRole(i); scrollToForm(); }}
                  >
                    Apply Now <FiArrowRight style={{ marginLeft: 6, verticalAlign: "middle" }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ PERKS ══════════════════════════════════════════ */}
      <div className="cs-perks-wrap">
        <div className="cs-section" data-section="perks">
          <div className={rv("perks")}>
            <div className="cs-section-tag">Why OvikaLiving</div>
            <h2 className="cs-section-title">Life at Ovika</h2>
            <p className="cs-section-desc">
              We invest in people who invest in our mission.
            </p>
          </div>
          <div className="cs-perks-grid">
            {perks.map((p, i) => {
              const PerkIcon = p.Icon;
              return (
                <div
                  key={p.title}
                  className={`cs-perk-card cs-reveal cs-d${(i % 3) + 1}${visible["perks"] ? " cs-visible" : ""}`}
                >
                  <div className="cs-perk-icon-box">
                    <PerkIcon size={22} />
                  </div>
                  <div className="cs-perk-title">{p.title}</div>
                  <div className="cs-perk-desc">{p.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ APPLICATION FORM ═══════════════════════════════ */}
      <div className="cs-form-wrap" ref={formRef}>
        <div className="cs-form-inner" data-section="form">

          <div className={`cs-form-header ${rv("form")}`}>
            <div className="cs-section-tag" style={{ justifyContent: "center" }}>
              Apply Now
            </div>
            <h2 className="cs-section-title">
              {activeRole !== null
                ? `Apply for ${roles[activeRole].title}`
                : "Submit Your Application"}
            </h2>
            <p className="cs-section-desc" style={{ margin: "0 auto", textAlign: "center" }}>
              Tell us who you are and why Ovika is where you belong.
            </p>
          </div>

          <div className={`cs-form-card cs-reveal cs-d1${visible["form"] ? " cs-visible" : ""}`}>

            {showSuccess ? (
              <div className="cs-success">
                <div className="cs-success-ring">
                  <FiCheck size={36} />
                </div>
                <h2 className="cs-success-title">Application Received!</h2>
                <p className="cs-success-desc">
                  Thank you for your interest in OvikaLiving. Our team will
                  review your application and reach out within 5–7 business days.
                </p>
                <button
                  className="cs-back-btn"
                  onClick={() => { setShowSuccess(false); setActiveRole(null); }}
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {activeRole !== null && (
                  <div className="cs-role-banner">
                    <span className="cs-role-banner-text">
                      Applying for: <strong>{roles[activeRole].title}</strong>
                    </span>
                    <button
                      type="button"
                      className="cs-role-banner-close"
                      onClick={() => setActiveRole(null)}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}

                <div className="cs-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="cs-form-row">
                  <div className="cs-form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@email.com"
                    />
                  </div>
                  <div className="cs-form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      placeholder="10-digit number"
                      pattern="[0-9]{10}"
                      maxLength="10"
                    />
                  </div>
                </div>

                <div className="cs-form-group">
                  <label>About You + Resume Link *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    maxLength={400}
                    placeholder="Tell us what you know about OvikaLiving and paste your resume link (Google Drive / LinkedIn)..."
                  />
                  <div className="cs-char-count">{formData.message.length} / 400</div>
                </div>

                <button type="submit" className="cs-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : (
                    <>Submit Application <FiArrowRight style={{ marginLeft: 6, verticalAlign: "middle" }} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ═══ FOOTER CTA ═════════════════════════════════════ */}
      <div className="cs-footer-cta">
        <h2 className="cs-footer-cta-title">
          Not ready to apply?<br />
          <span>Stay in touch.</span>
        </h2>
        <p className="cs-footer-cta-sub">
          Follow us for updates on new openings and life at OvikaLiving.
        </p>
        <button className="cs-btn-gold" onClick={scrollToForm}>
          Apply Anyway <FiArrowRight style={{ marginLeft: 6, verticalAlign: "middle" }} />
        </button>
      </div>

    </div>
  );
}