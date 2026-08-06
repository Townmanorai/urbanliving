import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  FiShield, FiZap, FiHeadphones, FiCreditCard, FiMapPin, FiHome,
  FiStar, FiPhoneCall,
} from 'react-icons/fi';
import { Building2, Home as HomeIcon, Building, Users } from 'lucide-react';
import LeadForm from './LeadForm';
import StatCounter from './StatCounter';
import FaqAccordion from './FaqAccordion';
import './LandingPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};
const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const CATEGORIES = [
  { icon: FiStar, label: 'Signature Stays', desc: 'Handpicked premium homes, personally verified.' },
  { icon: Building2, label: 'Hotel Stays', desc: 'Verified hotels with premium amenities.' },
  { icon: HomeIcon, label: 'Homestays & BnB', desc: 'Warm, hosted homes — no brokerage.' },
  { icon: Building, label: 'Apartments & Villas', desc: 'Furnished apartments for every budget.' },
  { icon: Users, label: 'PG & Co-Living', desc: 'Verified PGs with meals included.' },
];

const WHY_US = [
  { icon: FiShield, title: 'Zero Brokerage', desc: 'Connect with property owners directly — we never charge tenants a brokerage fee.' },
  { icon: FiZap, title: 'Verified Listings', desc: 'Every property is checked before it goes live, so what you see is what you get.' },
  { icon: FiHeadphones, title: '30-Minute Callback', desc: 'Share your requirement and our team calls you back within 30 minutes.' },
  { icon: FiCreditCard, title: 'Secure Payments', desc: 'Book and pay online safely, with clear pricing and no hidden charges.' },
  { icon: FiMapPin, title: 'Pan-NCR Coverage', desc: 'Noida, Greater Noida, Gurugram, Delhi & Ghaziabad — one platform, every city.' },
  { icon: FiHome, title: 'Every Stay Type', desc: 'Nightly stays, PGs, or long-term apartments — all in one place.' },
];

const STEPS = [
  { n: '01', title: 'Tell Us What You Need', desc: 'Share your city, budget, and move-in timeline in the form above.' },
  { n: '02', title: 'We Call You Back', desc: 'Our team calls within 30 minutes with shortlisted options that fit.' },
  { n: '03', title: 'Move In, Hassle-Free', desc: 'Confirm your favourite and move in — with support all the way.' },
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

      {/* ── Minimal top bar ── */}
      <div className="lp-topbar">
        <div className="lp-topbar-inner">
          <span className="lp-logo">Ovika<span>Living</span></span>
          <a href="tel:+919319392227" className="lp-topbar-call">
            <FiPhoneCall size={14} /> <span>+91 93193 92227</span>
          </a>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-bg" style={{ backgroundImage: 'url(/home1desktop.jpeg)' }} />
        <div className="lp-hero-overlay" />
        <div className="lp-hero-inner">
          <motion.div className="lp-hero-copy" initial="hidden" animate="show" variants={staggerParent}>
            <motion.div className="lp-eyebrow" variants={fadeUp}>✦ Noida & Greater Noida's Trusted Stay Platform</motion.div>
            <motion.h1 variants={fadeUp}>
              Find Your Perfect Stay — <span className="lp-accent">Zero Brokerage</span>, 100% Verified
            </motion.h1>
            <motion.p className="lp-hero-sub" variants={fadeUp}>
              PGs, apartments, hotels & homestays across Delhi NCR. Share your requirement once —
              our team does the rest.
            </motion.p>
            <motion.div className="lp-trust-row" variants={fadeUp}>
              {['Zero Brokerage', 'Verified Listings', '30-Min Callback', 'Pan-NCR Coverage'].map(t => (
                <span key={t} className="lp-trust-badge">{t}</span>
              ))}
            </motion.div>
            <motion.button className="lp-hero-cta lp-hero-cta--mobile" variants={fadeUp} onClick={scrollToForm}>
              Get Free Assistance ↓
            </motion.button>
          </motion.div>

          <motion.div
            id="lp-hero-form"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <LeadForm id="lp-hero-form-el" />
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="lp-stats-bar">
        <div className="lp-stats-inner">
          <StatCounter value={2000} suffix="+" label="Verified Stays" />
          <StatCounter value={5} suffix="" label="Cities Covered" />
          <StatCounter value={0} suffix="%" label="Brokerage" />
          <StatCounter value={30} suffix=" min" label="Avg. Callback Time" />
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="lp-section">
        <motion.div className="lp-section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <div className="lp-eyebrow lp-eyebrow--dark">Choose Your Space</div>
          <h2>Every Kind of Stay, One Platform</h2>
        </motion.div>
        <motion.div
          className="lp-cat-grid"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={staggerParent}
        >
          {CATEGORIES.map(c => {
            const Icon = c.icon;
            return (
              <motion.button key={c.label} className="lp-cat-card" variants={fadeUp} onClick={scrollToForm} whileHover={{ y: -6 }}>
                <div className="lp-cat-icon"><Icon size={26} /></div>
                <div className="lp-cat-label">{c.label}</div>
                <div className="lp-cat-desc">{c.desc}</div>
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-section lp-section--tinted">
        <motion.div className="lp-section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <div className="lp-eyebrow lp-eyebrow--dark">How It Works</div>
          <h2>Three Steps to Your New Stay</h2>
        </motion.div>
        <motion.div className="lp-steps" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={staggerParent}>
          {STEPS.map((s, i) => (
            <motion.div key={s.n} className="lp-step" variants={fadeUp}>
              <div className="lp-step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < STEPS.length - 1 && <div className="lp-step-connector" />}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Why OvikaLiving ── */}
      <section className="lp-section">
        <motion.div className="lp-section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <div className="lp-eyebrow lp-eyebrow--dark">Why OvikaLiving</div>
          <h2>Built for a Stress-Free Move</h2>
        </motion.div>
        <motion.div className="lp-why-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={staggerParent}>
          {WHY_US.map(w => {
            const Icon = w.icon;
            return (
              <motion.div key={w.title} className="lp-why-card" variants={fadeUp}>
                <div className="lp-why-icon"><Icon size={22} /></div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Final CTA ── */}
      <section className="lp-section lp-final-cta">
        <motion.div
          className="lp-final-cta-inner"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
        >
          <div className="lp-final-cta-copy">
            <h2>Ready to Find Your Stay?</h2>
            <p>Tell us your requirement — get a free callback within 30 minutes, no brokerage, no obligation.</p>
          </div>
          <LeadForm compact />
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section">
        <motion.div className="lp-section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
          <div className="lp-eyebrow lp-eyebrow--dark">FAQs</div>
          <h2>Common Questions</h2>
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
