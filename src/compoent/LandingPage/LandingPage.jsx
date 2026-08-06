import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  FiShield, FiZap, FiHeadphones, FiCreditCard, FiMapPin, FiHome,
  FiStar, FiPhoneCall, FiArrowRight, FiArrowDown,
} from 'react-icons/fi';
import { Building2, Home as HomeIcon, Building, Users } from 'lucide-react';
import LeadForm from './LeadForm';
import StatCounter from './StatCounter';
import FaqAccordion from './FaqAccordion';
import './LandingPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const CATEGORIES = [
  { icon: FiStar, label: 'Signature Stays', desc: 'Handpicked premium homes, personally verified.', hue: 'amber' },
  { icon: Building2, label: 'Hotel Stays', desc: 'Verified hotels with premium amenities.', hue: 'blue' },
  { icon: HomeIcon, label: 'Homestays & BnB', desc: 'Warm, hosted homes — no brokerage.', hue: 'rose' },
  { icon: Building, label: 'Apartments & Villas', desc: 'Furnished apartments for every budget.', hue: 'teal' },
  { icon: Users, label: 'PG & Co-Living', desc: 'Verified PGs with meals included.', hue: 'violet' },
];

const WHY_US = [
  { icon: FiShield, title: 'Zero Brokerage', desc: 'Connect with property owners directly — we never charge tenants a brokerage fee.', hue: 'orange', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80' },
  { icon: FiZap, title: 'Verified Listings', desc: 'Every property is checked before it goes live, so what you see is what you get.', hue: 'teal', img: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=900&q=80' },
  { icon: FiHeadphones, title: '30-Minute Callback', desc: 'Share your requirement and our team calls you back within 30 minutes.', hue: 'blue', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80' },
  { icon: FiCreditCard, title: 'Secure Payments', desc: 'Book and pay online safely, with clear pricing and no hidden charges.', hue: 'violet', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80' },
  { icon: FiMapPin, title: 'Pan-NCR Coverage', desc: 'Noida, Greater Noida, Gurugram, Delhi & Ghaziabad — one platform, every city.', hue: 'rose', img: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=900&q=80' },
  { icon: FiHome, title: 'Every Stay Type', desc: 'Nightly stays, PGs, or long-term apartments — all in one place.', hue: 'amber', img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80' },
];

export default function LandingPage() {
  const scrollToForm = () => {
    document.getElementById('lp-hero-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="lp-root">
      <Helmet>
        <title>Find Verified PGs, Apartments & Stays in Noida — OvikaLiving</title>
        <meta name="description" content="Zero brokerage. Verified PGs, apartments, hotels & homestays across Noida & Greater Noida. Share your requirement and get a callback in 30 minutes." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* ── Hero (framed card, HotelHub-style layout) ── */}
      <section className="lp-hero-wrap">
        <div className="lp-hero-frame">
          <div className="lp-hero-card">
            <div className="lp-hero-bg" style={{ backgroundImage: 'url(/landingpageimage2.jpg)' }} />
            <div className="lp-hero-overlay" />

            {/* corner brackets — decorative */}
            <span className="lp-corner lp-corner--tl" />
            <span className="lp-corner lp-corner--tr" />
            <span className="lp-corner lp-corner--bl" />
            <span className="lp-corner lp-corner--br" />

            {/* top nav row inside the card */}
            <div className="lp-hero-nav">
              <span className="lp-logo">Ovika<span>Living</span></span>
              <nav className="lp-hero-navlinks">
                {['Signature Stays', 'Hotels', 'Homestays', 'PG & Co-Living'].map(l => (
                  <button key={l} onClick={scrollToForm}>{l}</button>
                ))}
              </nav>
              <div className="lp-hero-navbtns">
                <a href="tel:+919319392227" className="lp-navbtn lp-navbtn--outline"><FiPhoneCall size={13} /> Call Us</a>
                <button className="lp-navbtn lp-navbtn--solid" onClick={scrollToForm}>Get Callback</button>
              </div>
            </div>

            <div className="lp-hero-body">
              <motion.div className="lp-hero-copy" initial="hidden" animate="show" variants={staggerParent}>
                <motion.div className="lp-promo-pill" variants={fadeUp} onClick={scrollToForm}>
                  ✦ Noida's Trusted Stay Platform <FiArrowRight size={13} />
                </motion.div>
                <motion.h1 variants={fadeUp}>
                  Fast, Verified<br />Stays Made<br /><span className="lp-accent-gradient">Simple</span>
                </motion.h1>
                <motion.p className="lp-hero-sub" variants={fadeUp}>
                  Effortlessly find your ideal PG, apartment, hotel or homestay across Delhi NCR —
                  zero brokerage, every listing verified.
                </motion.p>
                <motion.button className="lp-explore-btn" variants={fadeUp} onClick={scrollToForm} whileTap={{ scale: 0.96 }}>
                  Explore Now <FiArrowDown />
                </motion.button>
              </motion.div>

              <motion.div
                id="lp-hero-form"
                className="lp-hero-form-slot"
                initial={{ opacity: 0, x: 36, rotate: 1.5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <LeadForm id="lp-hero-form-el" />
              </motion.div>
            </div>

            <div className="lp-hero-trust">Trusted by 2,000+ tenants across Delhi NCR</div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="lp-stats-bar">
        <div className="lp-stats-inner">
          <StatCounter value={2000} suffix="+" label="Verified Stays" hue="amber" />
          <StatCounter value={5} suffix="" label="Cities Covered" hue="teal" />
          <StatCounter value={0} suffix="%" label="Brokerage" hue="rose" />
          <StatCounter value={30} suffix=" min" label="Avg. Callback Time" hue="violet" />
        </div>
      </section>

      {/* ── Categories (About-style: image + copy) ── */}
      <section className="lp-about">
        <div className="lp-about-inner">
          <motion.div
            className="lp-about-media"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lp-about-shape" />
            <img src="/signature1.png" alt="A premium OvikaLiving apartment interior" className="lp-about-img" />
          </motion.div>

          <motion.div
            className="lp-about-copy"
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={staggerParent}
          >
            <motion.div className="lp-eyebrow lp-eyebrow--dark" variants={fadeUp}>Choose Your Space</motion.div>
            <motion.h2 variants={fadeUp}>Every Kind of Stay, <span className="lp-accent-gradient">One Platform</span></motion.h2>
            <motion.p className="lp-about-desc" variants={fadeUp}>
              From nightly Signature Stays to long-term PGs, OvikaLiving brings every verified stay
              type across Delhi NCR onto one platform — zero brokerage, every listing checked.
            </motion.p>
            <motion.ul className="lp-about-list" variants={staggerParent}>
              {CATEGORIES.map(c => {
                const Icon = c.icon;
                return (
                  <motion.li key={c.label} className={`lp-hue--${c.hue}`} variants={fadeUp}>
                    <span className="lp-about-list-icon"><Icon size={16} /></span>
                    {c.label}
                  </motion.li>
                );
              })}
            </motion.ul>
            <motion.div className="lp-about-ctas" variants={fadeUp}>
              <button className="lp-explore-btn lp-explore-btn--dark" onClick={scrollToForm}>
                Get Free Assistance <FiArrowRight size={15} />
              </button>
              <a href="tel:+919319392227" className="lp-about-call">
                <span className="lp-about-call-icon"><FiPhoneCall size={13} /></span> Call Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Why OvikaLiving ── */}
      <section className="lp-section">
        <motion.div className="lp-section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <div className="lp-eyebrow lp-eyebrow--dark">Why OvikaLiving</div>
          <h2>Built for a <span className="lp-accent-gradient">Stress-Free Move</span></h2>
        </motion.div>
        <motion.div className="lp-why-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={staggerParent}>
          {WHY_US.map(w => {
            const Icon = w.icon;
            return (
              <motion.div
                key={w.title} className={`lp-why-card lp-hue--${w.hue}`} variants={fadeUp}
                whileHover={{ y: -6 }} style={{ backgroundImage: `url(${w.img})` }}
              >
                <div className="lp-why-card-overlay" />
                <div className="lp-why-icon"><Icon size={20} /></div>
                <div className="lp-why-card-text">
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Final CTA ── */}
      <section className="lp-final-cta">
        <div className="lp-blob lp-blob--c" />
        <div className="lp-blob lp-blob--d" />
        <motion.div
          className="lp-final-cta-inner"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
        >
          <div className="lp-final-cta-copy">
            <div className="lp-eyebrow">Last Step</div>
            <h2>Ready to Find <span className="lp-accent-gradient">Your Stay?</span></h2>
            <p>Tell us your requirement — get a free callback within 30 minutes, no brokerage, no obligation.</p>
          </div>
          <LeadForm compact />
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section">
        <motion.div className="lp-section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <div className="lp-eyebrow lp-eyebrow--dark">FAQs</div>
          <h2>Common <span className="lp-accent-gradient">Questions</span></h2>
        </motion.div>
        <div className="lp-faq-wrap">
          <FaqAccordion />
        </div>
      </section>

      {/* ── Mini footer ── */}
      <footer className="lp-footer">
        <span className="lp-logo lp-logo--footer">Ovika<span>Living</span></span>
        <p>Noida & Greater Noida · <a href="tel:+919319392227">+91 93193 92227</a></p>
        <p className="lp-footer-links">
          <a href="/privacy-policy">Privacy Policy</a> · <a href="/terms-and-conditions">Terms</a>
        </p>
        <p className="lp-footer-copy">© {new Date().getFullYear()} OvikaLiving. All rights reserved.</p>
      </footer>

      {/* ── Sticky mobile CTA bar ── */}
      <div className="lp-sticky-bar">
        <a href="tel:+919319392227" className="lp-sticky-call"><FiPhoneCall size={16} /> Call</a>
        <button className="lp-sticky-cta" onClick={scrollToForm}>Get Free Callback</button>
      </div>
    </div>
  );
}
