import React, { useState } from 'react';
import { Apple, PlayCircle, Search, Home as HomeIcon, Building2, Users, ShieldCheck, Star, Clock, ChevronLeft, Bell, Compass, Heart, User, MapPin } from 'lucide-react';

const API_BASE = 'https://www.townmanor.ai/api';

const STATS = [
  { icon: Users, value: '15,000+', label: 'Happy Guests' },
  { icon: ShieldCheck, value: '1,000+', label: 'Verified Properties' },
  { icon: Star, value: '4.8', label: 'Average Rating', star: true },
  { icon: Clock, value: '24/7', label: 'Customer Support' },
];

const css = `
.ad-section {
  background: #fff;
  padding: 44px 40px 52px;
  font-family: 'Poppins', sans-serif;
}
.ad-inner { max-width: 1400px; margin: 0 auto; }

.ad-banner {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #fdf3e4 0%, #f8e6cc 100%);
  border-radius: 24px;
  display: grid;
  grid-template-columns: minmax(320px, 460px) 1fr;
  align-items: center;
  gap: 12px;
  padding: 52px 56px;
  min-height: 420px;
}
.ad-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(194,119,43,0.26) 1.5px, transparent 1.5px);
  background-size: 15px 15px;
  -webkit-mask-image: radial-gradient(ellipse 60% 90% at 62% 50%, #000 0%, transparent 75%);
  mask-image: radial-gradient(ellipse 60% 90% at 62% 50%, #000 0%, transparent 75%);
  pointer-events: none;
}
.ad-banner::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  left: -60px;
  bottom: -80px;
  background: radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.ad-blob {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 420px;
  height: 420px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(194,119,43,0.32) 0%, rgba(194,119,43,0.1) 55%, transparent 75%);
  border-radius: 50%;
  pointer-events: none;
}
.ad-blob--top {
  top: -140px;
  left: -60px;
  width: 260px;
  height: 260px;
  transform: none;
  background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(194,119,43,0.12) 55%, transparent 75%);
}

.ad-eyebrow {
  font-size: 0.72rem;
  color: #c2772b;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.ad-title {
  margin: 0 0 10px;
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a1209;
  line-height: 1.2;
}
.ad-subtext {
  margin: 0 0 24px;
  font-size: 0.9rem;
  color: #6b5540;
  max-width: 380px;
}

.ad-coming-soon-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(194,119,43,0.12);
  border: 1px solid rgba(194,119,43,0.35);
  color: #c2772b;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 4px 11px;
  border-radius: 20px;
  margin-bottom: 10px;
}
.ad-coming-soon-tag span.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c2772b;
}
.ad-badges-row {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  position: relative;
  max-width: 100%;
}
.ad-store-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px 16px;
  cursor: not-allowed;
  opacity: 0.92;
  font-family: 'Poppins', sans-serif;
}
.ad-store-btn .ad-store-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}
.ad-store-text small { font-size: 0.55rem; color: #d8d3cc; font-weight: 400; }
.ad-store-text span { font-size: 0.82rem; font-weight: 600; }

.ad-qr-wrap {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1px solid #ece2cc;
  border-radius: 14px;
  padding: 10px 14px;
  position: relative;
  z-index: 1;
}
.ad-qr-wrap img { width: 64px; height: 64px; display: block; border-radius: 6px; }
.ad-qr-caption { font-size: 0.68rem; color: #8a6a3a; max-width: 110px; line-height: 1.4; }

/* Phones */
.ad-phones {
  position: relative;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ad-phone {
  position: absolute;
  width: 208px;
  height: 416px;
  background: #0f0f0f;
  border-radius: 34px;
  padding: 9px;
  box-shadow: 0 24px 55px rgba(0,0,0,0.32);
}
.ad-phone-screen {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 26px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
.ad-phone--back {
  right: 2%;
  top: 4px;
  transform: rotate(7deg);
  z-index: 1;
}
.ad-phone--front {
  left: 4%;
  bottom: -4px;
  transform: rotate(-7deg);
  z-index: 2;
}
.ad-notch {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 16px;
  background: #0f0f0f;
  border-radius: 10px;
  z-index: 3;
}
.ad-screen-header {
  padding: 22px 13px 8px;
  font-size: 0.76rem;
  font-weight: 700;
  color: #c2772b;
}
.ad-screen-sub {
  font-size: 0.52rem;
  color: #9a9a9a;
  padding: 0 13px 10px;
}
.ad-screen-search {
  margin: 0 13px 10px;
  background: #f6f6f6;
  border-radius: 9px;
  padding: 7px 9px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #aaa;
  font-size: 0.5rem;
}
.ad-screen-cats {
  display: flex;
  gap: 8px;
  padding: 0 13px 12px;
}
.ad-screen-cat {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #fdf2e4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c2772b;
}
.ad-screen-label {
  font-size: 0.48rem;
  font-weight: 700;
  color: #444;
  padding: 0 13px 8px;
}
.ad-screen-thumbs {
  display: flex;
  gap: 7px;
  padding: 0 13px;
}
.ad-screen-thumbs img {
  width: 46%;
  height: 68px;
  object-fit: cover;
  border-radius: 9px;
  display: block;
}
.ad-tabs {
  display: flex;
  gap: 5px;
  padding: 20px 13px 10px;
}
.ad-tab {
  font-size: 0.5rem;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 20px;
}
.ad-tab--active { background: #c2772b; color: #fff; }
.ad-tab--inactive { color: #999; }
.ad-booking-card {
  margin: 6px 13px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  flex-shrink: 0;
}
.ad-booking-card img { width: 100%; height: 62px; object-fit: cover; display: block; }
.ad-booking-info { padding: 8px 10px; }
.ad-booking-name { font-size: 0.5rem; font-weight: 700; color: #1a1209; }
.ad-booking-dates { font-size: 0.42rem; color: #999; margin-top: 3px; }

.ad-list-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 13px 8px;
  flex-shrink: 0;
}
.ad-list-row img {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.ad-list-row-name { font-size: 0.44rem; font-weight: 700; color: #1a1209; }
.ad-list-row-meta { font-size: 0.38rem; color: #999; margin-top: 2px; display: flex; align-items: center; gap: 3px; }
.ad-list-row-price { margin-left: auto; font-size: 0.46rem; font-weight: 700; color: #c2772b; flex-shrink: 0; }

.ad-summary-card {
  margin: 5px 13px;
  border-radius: 10px;
  background: #fdf7ee;
  border: 1px solid #f0e2c4;
  padding: 6px 10px;
  flex-shrink: 0;
}
.ad-summary-row { display: flex; justify-content: space-between; font-size: 0.4rem; color: #6b5540; padding: 1px 0; }
.ad-summary-row strong { color: #1a1209; }

.ad-tabbar {
  margin-top: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 6px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.ad-tabbar-item { display: flex; flex-direction: column; align-items: center; gap: 2px; color: #bbb; }
.ad-tabbar-item.active { color: #c2772b; }
.ad-tabbar-item span { font-size: 0.34rem; font-weight: 600; }

/* Stats bar */
.ad-statsbar {
  margin-top: 28px;
  background: #fdfaf5;
  border: 1px solid #ece5db;
  border-radius: 20px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.ad-newsletter-title { font-size: 0.92rem; font-weight: 700; color: #1a1209; margin: 0 0 3px; }
.ad-newsletter-sub { font-size: 0.74rem; color: #8a8a8a; margin: 0; }
.ad-newsletter-form {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.ad-newsletter-form input {
  border: 1px solid #e0dcd3;
  border-radius: 30px;
  padding: 9px 16px;
  font-size: 0.8rem;
  width: 220px;
  font-family: 'Poppins', sans-serif;
  outline: none;
}
.ad-newsletter-form input:focus { border-color: #c2772b; }
.ad-newsletter-form button {
  background: #c2772b;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 9px 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  transition: background 0.2s ease;
}
.ad-newsletter-form button:hover { background: #a85e1f; }
.ad-newsletter-form button:disabled { opacity: 0.6; cursor: default; }
.ad-newsletter-msg { font-size: 0.72rem; color: #2e8b47; margin-top: 6px; }

.ad-stats-row { display: flex; align-items: stretch; gap: 14px; flex-wrap: wrap; }
.ad-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #ece5db;
  border-radius: 14px;
  padding: 12px 16px;
}
.ad-stat-icon {
  width: 40px; height: 40px; border-radius: 11px;
  background: #fdf2e4; display: flex; align-items: center; justify-content: center;
  color: #c2772b; flex-shrink: 0;
}
.ad-stat-value { font-size: 1rem; font-weight: 800; color: #1a1209; display: flex; align-items: center; gap: 3px; white-space: nowrap; }
.ad-stat-label { font-size: 0.7rem; color: #8a8a8a; white-space: nowrap; }

@media (max-width: 900px) {
  .ad-banner { grid-template-columns: 1fr; padding: 32px 28px; min-height: 0; }
  .ad-phones { height: 360px; margin-top: 16px; }
  .ad-statsbar { flex-direction: column; align-items: stretch; }
  .ad-stats-row { justify-content: flex-start; }
}

@media (max-width: 560px) {
  .ad-section { padding: 32px 18px 40px; }
  .ad-title { font-size: 1.4rem; }
  .ad-banner { padding: 26px 20px; border-radius: 18px; }
  .ad-phones { height: 300px; }
  .ad-phone { width: 168px; height: 336px; }
  .ad-statsbar { padding: 18px 18px; }
  .ad-newsletter-form { flex-direction: column; align-items: stretch; }
  .ad-newsletter-form input { width: 100%; box-sizing: border-box; }
  .ad-stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
  }
  .ad-stat { min-width: 0; }
  .ad-stat-value, .ad-stat-label { white-space: normal; }
}
`;

const PhoneSearchScreen = () => (
  <div className="ad-phone-screen">
    <div className="ad-notch" />
    <div className="ad-screen-header">OvikaLiving</div>
    <div className="ad-screen-sub">Find Your Perfect Stay</div>
    <div className="ad-screen-search"><Search size={9} /> Search Location...</div>
    <div className="ad-screen-cats">
      <div className="ad-screen-cat"><Users size={12} /></div>
      <div className="ad-screen-cat"><Building2 size={12} /></div>
      <div className="ad-screen-cat"><HomeIcon size={12} /></div>
    </div>
    <div className="ad-screen-label">Popular Stays</div>
    <div className="ad-screen-thumbs">
      <img src="/tmluxe1.jpeg" alt="Popular stay" />
      <img src="/apartment1.jpeg" alt="Popular stay" />
    </div>
    <div className="ad-screen-label" style={{ marginTop: 12 }}>Nearby You</div>
    <div className="ad-list-row">
      <img src="/p1.png" alt="Nearby stay" />
      <div>
        <div className="ad-list-row-name">Signature Stay, Noida</div>
        <div className="ad-list-row-meta"><MapPin size={7} /> Sector 62</div>
      </div>
      <div className="ad-list-row-price">₹2,599</div>
    </div>
    <div className="ad-list-row">
      <img src="/signature1.png" alt="Nearby stay" />
      <div>
        <div className="ad-list-row-name">Cozy PG, Sector 15</div>
        <div className="ad-list-row-meta"><MapPin size={7} /> Noida</div>
      </div>
      <div className="ad-list-row-price">₹5,999</div>
    </div>
    <div className="ad-tabbar">
      <div className="ad-tabbar-item active"><HomeIcon size={13} /><span>Home</span></div>
      <div className="ad-tabbar-item"><Compass size={13} /><span>Explore</span></div>
      <div className="ad-tabbar-item"><Heart size={13} /><span>Saved</span></div>
      <div className="ad-tabbar-item"><User size={13} /><span>Profile</span></div>
    </div>
  </div>
);

const PhoneBookingScreen = () => (
  <div className="ad-phone-screen">
    <div className="ad-notch" />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 13px 4px' }}>
      <ChevronLeft size={11} color="#444" />
      <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#1a1209' }}>Bookings</span>
      <Bell size={10} color="#444" />
    </div>
    <div className="ad-tabs">
      <span className="ad-tab ad-tab--active">Upcoming</span>
      <span className="ad-tab ad-tab--inactive">Completed</span>
    </div>
    <div className="ad-booking-card">
      <img src="/p1.png" alt="Booking" />
      <div className="ad-booking-info">
        <div className="ad-booking-name">Signature Stay 1, Greater Noida</div>
        <div className="ad-booking-dates">Check-in · Check-out</div>
      </div>
    </div>
    <div className="ad-summary-card">
      <div className="ad-summary-row"><span>Guests</span><strong>2 Adults</strong></div>
      <div className="ad-summary-row"><span>Duration</span><strong>3 Nights</strong></div>
      <div className="ad-summary-row"><span>Total Paid</span><strong>₹7,797</strong></div>
    </div>
    <div className="ad-screen-label" style={{ marginTop: 2 }}>Completed</div>
    <div className="ad-list-row">
      <img src="/apartment1.jpeg" alt="Past booking" />
      <div>
        <div className="ad-list-row-name">Cozy PG, Sector 15</div>
        <div className="ad-list-row-meta"><MapPin size={7} /> Noida</div>
      </div>
    </div>
    <div className="ad-tabbar">
      <div className="ad-tabbar-item"><HomeIcon size={13} /><span>Home</span></div>
      <div className="ad-tabbar-item"><Compass size={13} /><span>Explore</span></div>
      <div className="ad-tabbar-item active"><Bell size={13} /><span>Bookings</span></div>
      <div className="ad-tabbar-item"><User size={13} /><span>Profile</span></div>
    </div>
  </div>
);

export default function AppDownload() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      await fetch(`${API_BASE}/formlead/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          phone_number: '',
          purpose: email.trim(),
          source: 'Homepage Newsletter',
        }),
      });
    } catch (_) {
      // still show a friendly confirmation — this is a best-effort signup
    }
    setStatus('done');
    setEmail('');
  };

  return (
    <section className="ad-section">
      <style>{css}</style>
      <div className="ad-inner">
        <div className="ad-banner">
          <div className="ad-blob ad-blob--top" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="ad-eyebrow">On the Go?</div>
            <h2 className="ad-title">Download the OvikaLiving App</h2>
            <p className="ad-subtext">Book, manage and explore stays anytime, anywhere.</p>

            <div className="ad-coming-soon-tag"><span className="dot" /> App Launching Soon</div>
            <div className="ad-badges-row">
              <button className="ad-store-btn" disabled title="Coming soon">
                <Apple size={20} />
                <span className="ad-store-text"><small>Download on the</small><span>App Store</span></span>
              </button>
              <button className="ad-store-btn" disabled title="Coming soon">
                <PlayCircle size={18} />
                <span className="ad-store-text"><small>GET IT ON</small><span>Google Play</span></span>
              </button>
            </div>

            <div className="ad-qr-wrap">
              <img src="/ovikaliving-app-qr.png" alt="Scan to visit OvikaLiving" />
              <span className="ad-qr-caption">Scan to visit OvikaLiving on your phone</span>
            </div>
          </div>

          <div className="ad-phones">
            <div className="ad-blob" />
            <div className="ad-phone ad-phone--back"><PhoneBookingScreen /></div>
            <div className="ad-phone ad-phone--front"><PhoneSearchScreen /></div>
          </div>
        </div>

        <div className="ad-statsbar">
          <div>
            <p className="ad-newsletter-title">Stay Updated</p>
            <p className="ad-newsletter-sub">Get exclusive offers &amp; travel inspiration</p>
            <form className="ad-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'sending'}
              />
              <button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Submitting...' : 'Subscribe'}
              </button>
            </form>
            {status === 'done' && <p className="ad-newsletter-msg">Thanks! We'll keep you updated.</p>}
          </div>

          <div className="ad-stats-row">
            {STATS.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="ad-stat">
                  <div className="ad-stat-icon"><Icon size={16} /></div>
                  <div>
                    <div className="ad-stat-value">
                      {s.value}{s.star && <Star size={12} color="#f5a623" fill="#f5a623" />}
                    </div>
                    <div className="ad-stat-label">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
