import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShield, FiTag, FiHeadphones, FiUsers,
  FiTrendingUp, FiClock, FiArrowRight, FiPhoneCall, FiStar,
  FiGift, FiCreditCard, FiEyeOff, FiHome,
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import LeadForm from './LeadForm';
import CountdownTimer from './CountdownTimer';
import StatCounter from './StatCounter';
import { navClick, auxNavClick } from '../../utils/navClick';
import './LandingPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const TOP_BADGES = [
  { icon: FiShield, label: 'Verified Stays' },
  { icon: FaRupeeSign, label: 'Zero Brokerage' },
  { icon: FiTag, label: 'Best Price Guarantee' },
];

const HERO_BADGES = [
  { icon: FiShield, title: '100% Verified', sub: 'For your safety' },
  { icon: FaRupeeSign, title: 'Zero Brokerage', sub: 'No extra charges' },
  { icon: FiTrendingUp, title: 'Best Prices', sub: 'Guaranteed' },
  { icon: FiHeadphones, title: '24x7 Support', sub: "We're always here" },
];

const HERO_BG_SLIDES = [
  { label: 'Signature Stays', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1800&q=80' },
  { label: 'Hotel Stays', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80' },
  { label: 'Homestays & BnB', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=80' },
  { label: 'Apartments & Villas', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=80' },
  { label: 'PG & Co-Living', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1800&q=80' },
];

const CATEGORIES = [
  { label: '1 BHK Apartments', price: 'Starting ₹8,000/mo', img: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=500&q=75', hue: 'orange' },
  { label: '2 BHK Apartments', price: 'Starting ₹12,000/mo', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=75', hue: 'blue' },
  { label: '3 BHK Apartments', price: 'Starting ₹18,000/mo', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=500&q=75', hue: 'violet' },
  { label: 'PG & Co-living', price: 'Starting ₹5,000/mo', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=75', hue: 'teal' },
  { label: 'Homestays', price: 'Starting ₹1,000/night', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=75', hue: 'rose' },
  { label: 'Hotels', price: 'Up to 50% OFF', img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=500&q=75', hue: 'amber' },
  { label: 'Villas', price: 'Starting ₹15,000/night', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=500&q=75', hue: 'orange' },
  { label: 'Studio Apartments', price: 'Starting ₹9,000/mo', img: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=500&q=75', hue: 'blue' },
  { label: 'Independent Houses', price: 'Starting ₹20,000/mo', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=500&q=75', hue: 'teal' },
  { label: 'Guest Houses', price: 'Starting ₹1,200/night', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=75', hue: 'violet' },
  { label: 'Farmhouses', price: 'Starting ₹25,000/night', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=500&q=75', hue: 'rose' },
];

const OWNER_FEATURES = [
  { icon: FiTrendingUp, title: 'Higher Earnings', desc: 'Get more bookings & earn up to 2x more returns.', hue: 'teal' },
  { icon: FiEyeOff, title: 'Zero Brokerage', desc: 'Keep 100% of what you earn. No hidden deductions.', hue: 'orange' },
  { icon: FiShield, title: 'Verified Tenants', desc: 'We verify every tenant for a safe and secure stay.', hue: 'violet' },
  { icon: FiClock, title: 'Timely Payouts', desc: 'Get paid on time, every time. No delays.', hue: 'blue' },
  { icon: FiUsers, title: 'Hassle-free Support', desc: 'We handle everything from bookings to support.', hue: 'rose' },
];

const HERO_STATS = [
  { value: 2000, suffix: '+', label: 'Properties', hue: 'amber' },
  { value: 5, suffix: '', label: 'Cities Covered', hue: 'teal' },
  { value: 99, suffix: '%', label: 'Positive Reviews', hue: 'rose' },
];

const SAFETY_FEATURES = [
  { icon: FiShield, title: 'ID Verified', sub: 'Owners & Properties' },
  { icon: FiCreditCard, title: 'Secure Payments', sub: '100% Protected' },
  { icon: FiEyeOff, title: 'No Hidden Charges', sub: 'What you see is what you pay' },
  { icon: FiHeadphones, title: '24x7 Customer Support', sub: 'Always Here' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const scrollToForm = () => {
    document.getElementById('lp-hero-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const goHome = (e) => navClick(e, '/', navigate);
  const goListProperty = (e) => navClick(e, '/list-category', navigate);

  // Shared countdown target for both banners — 2 days 14 hours from first render.
  const dealDeadline = useMemo(() => new Date(Date.now() + (2 * 24 + 14) * 60 * 60 * 1000), []);

  // Auto-rotating hero background carousel — cycles through category images.
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIndex(i => (i + 1) % HERO_BG_SLIDES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lp-root">
      <Helmet>
        <title>Better Stays. Bigger Savings. — OvikaLiving</title>
        <meta name="description" content="Verified apartments, homestays, PGs & villas across Delhi NCR with amazing discounts and zero-hassle booking." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* ── Hero ── */}
      <section className="lp-hero-wrap">
        <div className="lp-hero-frame">
          <div className="lp-hero-card">
            {HERO_BG_SLIDES.map((slide, i) => (
              <div
                key={slide.label}
                className="lp-hero-bg"
                style={{ backgroundImage: `url(${slide.img})`, opacity: i === bgIndex ? 1 : 0 }}
              />
            ))}
            <div className="lp-hero-overlay" />

            {/* Top bar: logo + trust badges */}
            <div className="lp-hero-nav">
              <a href="/" onClick={goHome} onAuxClick={(e) => auxNavClick(e, '/')} className="lp-brand-link">
                <img src="/ovikaliving_logo_clean.png" alt="OvikaLiving" className="lp-brand-logo" />
                <span className="lp-brand-domain">ovikaliving.com</span>
              </a>
              <div className="lp-hero-navlinks">
                {TOP_BADGES.map(b => {
                  const Icon = b.icon;
                  return <span key={b.label} className="lp-topbadge"><Icon size={13} /> {b.label}</span>;
                })}
              </div>
              <div className="lp-hero-rating">
                <FiStar size={14} className="lp-hero-rating-star" />
                <div>
                  <strong>4.8/5</strong>
                  <span>10,000+ Reviews</span>
                </div>
              </div>
            </div>

            <div className="lp-hero-body--wide">
              <motion.div className="lp-hero-copy" initial="hidden" animate="show" variants={staggerParent}>
                <motion.h1 variants={fadeUp}>
                  Better Stays. <span className="lp-accent-gradient">Bigger Savings.</span>
                </motion.h1>
                <motion.p className="lp-hero-sub" variants={fadeUp}>
                  Verified apartments, homestays, PGs & villas across Delhi NCR with amazing
                  discounts and zero-hassle booking.
                </motion.p>
                <motion.div className="lp-hero-badges" variants={staggerParent}>
                  {HERO_BADGES.map(b => {
                    const Icon = b.icon;
                    return (
                      <motion.div key={b.title} className="lp-hero-badge" variants={fadeUp}>
                        <span className="lp-hero-badge-icon"><Icon size={22} color="#f0a84e" /></span>
                        <div>
                          <strong>{b.title}</strong>
                          <span>{b.sub}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
                <motion.div className="lp-hero-trustrow" variants={fadeUp}>
                  <FiUsers size={16} />
                  <span>Trusted by 2,000+ properties</span>
                  <span className="lp-hero-trustrow-stars">★★★★★ <b>4.8/5</b></span>
                </motion.div>

                <div className="lp-hero-stats">
                  {HERO_STATS.map(s => (
                    <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} hue={s.hue} />
                  ))}
                  <div className="lp-stat lp-hue--violet">
                    <div className="lp-stat-number">4.8/5</div>
                    <div className="lp-stat-label">Average Rating</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="lp-hero-right"
                initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Discount banner with countdown */}
                <div className="lp-deal-banner" onClick={scrollToForm}>
                  <div className="lp-deal-banner-left">
                    <span className="lp-deal-tag">🔥 LIMITED TIME OFFER!</span>
                    <div className="lp-deal-percent">UP TO <b>50% OFF</b></div>
                    <span className="lp-deal-sub">on selected properties</span>
                  </div>
                  <div className="lp-deal-banner-right">
                    <span className="lp-deal-ends">Offer ends in</span>
                    <CountdownTimer target={dealDeadline} />
                  </div>
                  <span className="lp-deal-gift"><FiGift size={22} /></span>
                </div>

                {/* Search widget */}
                <div id="lp-hero-form">
                  <LeadForm id="lp-hero-form-el" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore by Category ── */}
      <section className="lp-section lp-section--tight">
        <motion.h2 className="lp-cat-heading" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}>
          Explore by Category
        </motion.h2>
        <div className="lp-cat-scroll">
          <div className="lp-cat-track">
            {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
              <button key={`${c.label}-${i}`} className="lp-cat-card2" onClick={scrollToForm}>
                <div className="lp-cat-card2-img" style={{ backgroundImage: `url(${c.img})` }}>
                  <span className={`lp-cat-card2-icon lp-hue--${c.hue}`}><FiHome size={14} /></span>
                </div>
                <div className="lp-cat-card2-label">{c.label}</div>
                <div className="lp-cat-card2-price">{c.price}</div>
              </button>
            ))}
          </div>
        </div>
      </section>


      {/* ── For Property Owners ── */}
      <section className="lp-owner-section">
        <div className="lp-owner-inner">
          <motion.div className="lp-owner-copy" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={staggerParent}>
            <motion.div className="lp-eyebrow lp-eyebrow--red" variants={fadeUp}>For Property Owners</motion.div>
            <motion.h2 className="lp-owner-heading" variants={fadeUp}>
              List Once. <span className="lp-accent-gradient">Earn More.</span> Worry Less.
            </motion.h2>
            <motion.p variants={fadeUp}>
              Join thousands of owners earning more, hassle-free.
            </motion.p>
            <motion.button className="lp-owner-cta" variants={fadeUp} onClick={goListProperty} whileTap={{ scale: 0.97 }}>
              List Your Property Now <FiArrowRight size={15} />
            </motion.button>

            <motion.div className="lp-owner-trust" variants={fadeUp}>
              <FiUsers size={14} /> 10,000+ Owners trust OvikaLiving
            </motion.div>
          </motion.div>

          <motion.div className="lp-owner-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={staggerParent}>
            {OWNER_FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} className={`lp-owner-card lp-hue--${f.hue}`} variants={fadeUp}>
                  <span className="lp-owner-card-icon"><Icon size={18} /></span>
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Second countdown banner ── */}
      <section className="lp-deal-strip">
        <div className="lp-deal-strip-bg" />
        <motion.span
          className="lp-deal-strip-icon"
          animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
        >
          ⏰
        </motion.span>
        <div className="lp-deal-strip-mid">
          <span className="lp-deal-strip-hurry">HURRY!</span>
          <h3>LIMITED TIME OFFER</h3>
          <p>Book now & save big on the best stays near you.</p>
        </div>
        <div className="lp-deal-strip-timer">
          <span className="lp-deal-ends">Offer Ends In</span>
          <CountdownTimer target={dealDeadline} dark />
        </div>
        <div className="lp-deal-strip-right">
          <div className="lp-deal-strip-percent">UP TO <b>50% OFF</b></div>
          <span className="lp-deal-sub">on selected properties</span>
          <button className="lp-deal-strip-btn" onClick={scrollToForm}>Grab The Deal Now <FiArrowRight size={14} /></button>
        </div>
      </section>


      {/* ── Safety footer strip ── */}
      <section className="lp-safety-strip">
        <div className="lp-safety-heading">
          <strong>Your Safety. Our Priority.</strong>
          <span>We ensure a safe, secure and reliable stay experience for everyone.</span>
        </div>
        <div className="lp-safety-grid">
          {SAFETY_FEATURES.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="lp-safety-item">
                <span className="lp-safety-icon"><Icon size={18} /></span>
                <div>
                  <strong>{s.title}</strong>
                  <span>{s.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Mini footer ── */}
      <footer className="lp-footer">
        <img src="/ovikaliving_logo_clean.png" alt="OvikaLiving" className="lp-footer-logo" />
        <p>Noida & Greater Noida · <a href="tel:+919319392227">+91 93193 92227</a></p>
        <p className="lp-footer-links">
          <a href="/privacy-policy">Privacy Policy</a> · <a href="/terms-and-conditions">Terms</a>
        </p>
        <p className="lp-footer-copy">© {new Date().getFullYear()} OvikaLiving. All rights reserved.</p>
      </footer>

      {/* ── Sticky mobile CTA bar ── */}
      <div className="lp-sticky-bar">
        <a href="tel:+919319392227" className="lp-sticky-call"><FiPhoneCall size={16} /> Call</a>
        <button className="lp-sticky-cta" onClick={scrollToForm}>Search Stays</button>
      </div>
    </div>
  );
}
