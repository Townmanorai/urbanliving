import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { navClick } from '../../utils/navClick';

function getBreakpoint() {
  const w = window.innerWidth;
  if (w <= 640) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

const NIGHTLY = [
  {
    id: 'signature', title: 'Signature Stays', sub: 'Fully managed luxury villas & premium homes',
    badge: 'Nightly Rental', price: '₹2,599', unit: '/night', btnText: 'Explore Signature',
    icon: '✨', tags: ['Luxury', 'Verified', 'Fully Furnished'], popular: false,
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80',
    rentalType: 'short', category: 'Signature Stays', color: '#7c4a1a',
  },
  {
    id: 'hotel', title: 'Hotel Stays', sub: '4-Star, 5-Star & Boutique Hotels',
    badge: 'Nightly Rental', price: '₹1,499', unit: '/night', btnText: 'Explore Hotels',
    icon: '🏨', tags: ['4★ & 5★', 'Breakfast', 'Instant Book'], popular: true,
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    rentalType: 'short', category: 'Hotel Stays', color: '#1a3a5c',
  },
  {
    id: 'homestay', title: 'Homestays & BnB', sub: 'Villas, Flats & Serviced Homes',
    badge: 'Nightly Rental', price: '₹2,499', unit: '/night', btnText: 'Explore Homestays',
    icon: '🏡', tags: ['Homely', 'Kitchen', 'Private Space'], popular: false,
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    rentalType: 'short', category: 'Homestays & BnB', color: '#1a4a2e',
  },
];

const MONTHLY = [
  {
    id: 'signature', title: 'Signature Stays', sub: 'Fully managed luxury homes for long stays',
    badge: 'Monthly Rental', price: '₹25,999', unit: '/month', btnText: 'Explore Signature',
    icon: '✨', tags: ['Luxury', 'Verified', 'Fully Furnished'], popular: false,
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80',
    rentalType: 'long', category: 'Signature Stays', color: '#7c4a1a',
  },
  {
    id: 'apartments', title: 'Apartments & Villas', sub: 'Furnished, Semi-Furnished & Unfurnished',
    badge: 'Monthly Rental', price: '₹12,999', unit: '/month', btnText: 'Explore Apartments',
    icon: '🏢', tags: ['No Brokerage', 'Flexible', 'Furnished'], popular: true,
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
    rentalType: 'long', category: 'Apartments & Villas', color: '#1a3a5c',
  },
  {
    id: 'pg', title: 'PG & Co-Living', sub: 'Boys, Girls & Community Living spaces',
    badge: 'Monthly Rental', price: '₹4,999', unit: '/month', btnText: 'Explore PG',
    icon: '🤝', tags: ['Meals Included', 'Community', 'Zero Deposit'], popular: false,
    img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=700&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    rentalType: 'long', category: 'PG & Co-Living', color: '#2a1a5c',
  },
];

export default function HomePageNew2() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('nightly');
  const [bp, setBp] = useState(getBreakpoint());
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cats = activeTab === 'nightly' ? NIGHTLY : MONTHLY;
  const [hero, ...rest] = cats;

  const handleNav = (e, cat) => {
    const p = new URLSearchParams();
    p.set('rentalType', cat.rentalType);
    if (cat.category) p.set('category', cat.category);
    sessionStorage.setItem('ovika_rental_type', cat.rentalType);
    navClick(e, `/properties?${p}`, navigate);
  };

  /* ── MOBILE ── */
  if (bp === 'mobile') {
    return (
      <section style={{ background: 'linear-gradient(180deg,#fdf7ee 0%,#ede4cf 100%)', fontFamily: "'Poppins',sans-serif", paddingBottom: 20 }}>
        <style>{`
          .hw2-peek::-webkit-scrollbar { display: none; }
          .hw2-peek { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* ── TOP HEADER ── */}
        <div style={{ padding: '24px 18px 0' }}>
          <div style={{ fontSize: '0.58rem', color: '#c2772b', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4 }}>Curated for You</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#1a1209', lineHeight: 1.2 }}>
              Find Your<br /><span style={{ color: '#c2772b' }}>Perfect Stay</span>
            </h2>
            {/* Tab pill with labels */}
            <div style={{ display: 'inline-flex', background: '#fff', borderRadius: 40, padding: 4, border: '1.5px solid #f0e8da', boxShadow: '0 2px 10px rgba(194,119,43,0.1)', flexShrink: 0 }}>
              {[['nightly', '🌙', 'Nightly'], ['monthly', '🏠', 'Monthly']].map(([key, emoji, label]) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  padding: '7px 12px', borderRadius: 40, border: 'none', cursor: 'pointer',
                  background: activeTab === key ? 'linear-gradient(135deg,#c2772b,#e09a4f)' : 'transparent',
                  transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: 5,
                  boxShadow: activeTab === key ? '0 3px 10px rgba(194,119,43,0.4)' : 'none',
                }}>
                  <span style={{ fontSize: '0.85rem' }}>{emoji}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: activeTab === key ? '#fff' : '#8a6a3a', fontFamily: "'Poppins',sans-serif" }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Helper hint for new users */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(194,119,43,0.08)', borderRadius: 10, padding: '7px 11px', marginBottom: 14, border: '1px solid rgba(194,119,43,0.15)' }}>
            <span style={{ fontSize: '0.75rem' }}>💡</span>
            <span style={{ fontSize: '0.62rem', color: '#8a6a3a', fontWeight: 500, lineHeight: 1.4 }}>
              {activeTab === 'nightly' ? 'Short trips & getaways — pay per night' : 'Long stays — pay per month, save more'}
            </span>
          </div>
        </div>

        {/* ── PEEK SCROLL CARDS ── */}
        <div className="hw2-peek" style={{ display: 'flex', overflowX: 'auto', gap: 12, paddingLeft: 18, paddingRight: 18, paddingBottom: 6 }}>
          {cats.map((cat, i) => (
            <div key={cat.id} onClick={(e) => handleNav(e, cat)}
              style={{
                flex: '0 0 78%',
                borderRadius: 24, overflow: 'hidden', cursor: 'pointer',
                height: 340, position: 'relative',
                boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
              }}>
              {/* Full image */}
              <img src={cat.img} alt={cat.title} onError={e => { e.currentTarget.src = cat.imgFallback; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 45%, transparent 100%)' }} />

              {/* Top badges */}
              <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(194,119,43,0.9)', borderRadius: 20, padding: '4px 12px', backdropFilter: 'blur(4px)' }}>
                  <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{cat.badge}</span>
                </div>
                {cat.popular && (
                  <div style={{ background: 'linear-gradient(135deg,#c2772b,#e09a4f)', borderRadius: 20, padding: '4px 10px', boxShadow: '0 3px 10px rgba(194,119,43,0.5)' }}>
                    <span style={{ fontSize: '0.52rem', color: '#fff', fontWeight: 700 }}>⭐ TOP PICK</span>
                  </div>
                )}
                {i === 0 && !cat.popular && (
                  <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 20, padding: '4px 10px', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <span style={{ fontSize: '0.52rem', color: '#f0a050', fontWeight: 700 }}>✦ FEATURED</span>
                  </div>
                )}
              </div>

              {/* Bottom content */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px' }}>
                {/* Icon + title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
                    {cat.icon}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{cat.title}</div>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.72)', marginBottom: 10, lineHeight: 1.4 }}>{cat.sub}</div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'nowrap', overflow: 'hidden' }}>
                  {cat.tags.map(t => (
                    <span key={t} style={{ flexShrink: 0, fontSize: '0.55rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 9px', backdropFilter: 'blur(4px)' }}>{t}</span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Starts at</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f0a050', lineHeight: 1 }}>
                      {cat.price}<span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginLeft: 2 }}>{cat.unit}</span>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); handleNav(e, cat); }}
                    style={{ padding: '11px 18px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#c2772b,#e09a4f)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(194,119,43,0.55)', whiteSpace: 'nowrap' }}>
                    {cat.btnText} <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12, marginBottom: 16 }}>
          {cats.map((_, i) => (
            <div key={i} style={{ width: i === 0 ? 20 : 6, height: 6, borderRadius: 3, background: i === 0 ? '#c2772b' : 'rgba(194,119,43,0.25)', transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* ── TRUST BAR ── */}
        <div style={{ margin: '0 14px', background: '#fff', borderRadius: 18, padding: '14px 16px', border: '1px solid #f0e8da', boxShadow: '0 2px 12px rgba(194,119,43,0.08)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {[['🛡️','Zero Brokerage','No hidden fees'],['⚡','Instant Move-in','Ready today'],['✅','Verified','All listings checked'],['🏠','500+ Listings','Across NCR']].map(([ic,lb,desc]) => (
              <div key={lb} style={{ width: '50%', boxSizing: 'border-box', padding: '6px 8px 6px 0', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{ic}</span>
                <div>
                  <div style={{ fontSize: '0.64rem', color: '#1a1209', fontWeight: 700, lineHeight: 1.2 }}>{lb}</div>
                  <div style={{ fontSize: '0.54rem', color: '#8a6a3a' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    );
  }

  /* ── TABLET ── */
  if (bp === 'tablet') {
    return (
      <section style={{ background: 'linear-gradient(160deg,#fdf7ee 0%,#f5ead6 55%,#ede4cf 100%)', fontFamily: "'Poppins',sans-serif", padding: '32px 20px 28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#c2772b', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Curated for You</div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1a1209', lineHeight: 1.2 }}>
              Find Your <span style={{ color: '#c2772b' }}>Perfect Stay</span>
            </h2>
          </div>
          <div style={{ display: 'inline-flex', background: '#fff', borderRadius: 40, padding: 4, border: '1.5px solid #f0e8da', boxShadow: '0 2px 12px rgba(194,119,43,0.12)' }}>
            {[['nightly', '🌙 Nightly'], ['monthly', '🏠 Monthly']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding: '8px 18px', borderRadius: 40, border: 'none', cursor: 'pointer',
                fontSize: '0.76rem', fontWeight: 700, fontFamily: "'Poppins',sans-serif",
                background: activeTab === key ? 'linear-gradient(135deg,#c2772b,#e09a4f)' : 'transparent',
                color: activeTab === key ? '#fff' : '#8a6a3a', transition: 'all 0.25s',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Bento: hero left + 2 stacked right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gridTemplateRows: 'auto', gap: 10, marginBottom: 16 }}>
          {/* Hero */}
          <div onClick={(e) => handleNav(e, hero)} onMouseEnter={() => setHovered(hero.id)} onMouseLeave={() => setHovered(null)}
            style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', height: 380, gridRow: '1 / 3' }}>
            <img src={hero.img} alt={hero.title} onError={e => { e.currentTarget.src = hero.imgFallback; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovered === hero.id ? 'scale(1.05)' : 'scale(1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', top: 14, left: 16, background: 'rgba(194,119,43,0.9)', borderRadius: 20, padding: '4px 12px' }}>
              <span style={{ fontSize: '0.58rem', color: '#fff', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>{hero.badge}</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px' }}>
              <div style={{ fontSize: '0.6rem', color: '#f0a050', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>{hero.icon} Featured</div>
              <h3 style={{ margin: '0 0 5px', fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{hero.title}</h3>
              <p style={{ margin: '0 0 10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>{hero.sub}</p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                {hero.tags.map(t => (
                  <span key={t} style={{ fontSize: '0.58rem', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 20, padding: '3px 9px', backdropFilter: 'blur(4px)' }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>Starts at</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0a050' }}>{hero.price}<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>{hero.unit}</span></div>
                </div>
                <button onClick={e => { e.stopPropagation(); handleNav(e, hero); }}
                  style={{ padding: '10px 18px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#c2772b,#e09a4f)', color: '#fff', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(194,119,43,0.5)' }}>
                  {hero.btnText} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Side cards */}
          {rest.map((cat) => (
            <div key={cat.id} onClick={(e) => handleNav(e, cat)} onMouseEnter={() => setHovered(cat.id)} onMouseLeave={() => setHovered(null)}
              style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', height: 185 }}>
              <img src={cat.img} alt={cat.title} onError={e => { e.currentTarget.src = cat.imgFallback; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovered === cat.id ? 'scale(1.06)' : 'scale(1)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
              {cat.popular && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: '#c2772b', color: '#fff', fontSize: '0.52rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>⭐ TOP PICK</div>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginBottom: 2 }}>{cat.icon} {cat.title}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)' }}>{cat.sub}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f0a050' }}>{cat.price}</div>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.55)' }}>{cat.unit}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
          {[['🛡️','Zero Brokerage'],['⚡','Instant Move-in'],['✅','Verified Properties'],['🏠','500+ Listings']].map(([ic,lb]) => (
            <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.7)', border: '1px solid #f0e8da', borderRadius: 20, padding: '7px 14px', backdropFilter: 'blur(6px)' }}>
              <span style={{ fontSize: '0.85rem' }}>{ic}</span>
              <span style={{ fontSize: '0.65rem', color: '#5a4a3a', fontWeight: 600 }}>{lb}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── DESKTOP ── */
  return (
    <section style={{ background: 'linear-gradient(160deg,#fdf7ee 0%,#f5ead6 55%,#ede4cf 100%)', fontFamily: "'Poppins',sans-serif", padding: '48px 48px 44px' }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, maxWidth: 1400, margin: '0 auto 28px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#c2772b', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 7 }}>
            Curated for You
          </div>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1a1209', lineHeight: 1.15 }}>
            Find Your <span style={{ color: '#c2772b' }}>Perfect Stay</span>
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#8a6a3a', fontWeight: 400 }}>
            From quick getaways to long-term homes — verified, furnished & ready to move in
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'inline-flex', background: '#fff', borderRadius: 50, padding: 5, border: '1.5px solid #f0e8da', boxShadow: '0 4px 18px rgba(194,119,43,0.12)', flexShrink: 0 }}>
          {[['nightly', '🌙', 'Nightly Stay'], ['monthly', '🏠', 'Monthly Stay']].map(([key, emoji, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '10px 26px', borderRadius: 50, border: 'none', cursor: 'pointer',
              fontSize: '0.84rem', fontWeight: 700, fontFamily: "'Poppins',sans-serif",
              background: activeTab === key ? 'linear-gradient(135deg,#c2772b,#e09a4f)' : 'transparent',
              color: activeTab === key ? '#fff' : '#8a6a3a', transition: 'all 0.28s',
              boxShadow: activeTab === key ? '0 4px 18px rgba(194,119,43,0.4)' : 'none',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <span>{emoji}</span>{label}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr',
        gridTemplateRows: '280px 180px',
        gap: 12,
        maxWidth: 1400,
        margin: '0 auto',
      }}>

        {/* HERO card — spans 2 rows */}
        <div
          onClick={(e) => handleNav(e, hero)}
          onMouseEnter={() => setHovered(hero.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            gridColumn: '1', gridRow: '1 / 3',
            position: 'relative', borderRadius: 24, overflow: 'hidden', cursor: 'pointer',
          }}
        >
          <img src={hero.img} alt={hero.title} onError={e => { e.currentTarget.src = hero.imgFallback; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.55s', transform: hovered === hero.id ? 'scale(1.06)' : 'scale(1)', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 45%, transparent 100%)' }} />

          {/* Badge */}
          <div style={{ position: 'absolute', top: 18, left: 20, background: 'rgba(194,119,43,0.9)', borderRadius: 20, padding: '5px 14px', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.62rem', color: '#fff', fontWeight: 600, letterSpacing: 0.7, textTransform: 'uppercase' }}>{hero.badge}</span>
          </div>

          {/* Featured label */}
          <div style={{ position: 'absolute', top: 18, right: 20, background: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: '5px 12px', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontSize: '0.62rem', color: '#f0a050', fontWeight: 700, letterSpacing: 0.5 }}>✦ FEATURED</span>
          </div>

          {/* Content */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 26px' }}>
            <div style={{ fontSize: '0.64rem', color: '#f0a050', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{hero.icon} {hero.title}</div>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.7rem', fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>{hero.sub}</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
              {hero.tags.map(t => (
                <span key={t} style={{ fontSize: '0.64rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 11px', backdropFilter: 'blur(4px)', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Starts at</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f0a050', lineHeight: 1 }}>
                  {hero.price}<span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)', marginLeft: 3 }}>{hero.unit}</span>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); handleNav(e, hero); }}
                style={{
                  padding: '13px 22px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg,#c2772b,#e09a4f)', color: '#fff',
                  fontSize: '0.86rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif",
                  display: 'flex', alignItems: 'center', gap: 7,
                  boxShadow: '0 6px 22px rgba(194,119,43,0.55)',
                  transform: hovered === hero.id ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.2s',
                }}>
                {hero.btnText} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Side cards — each in its own cell */}
        {rest.map((cat, i) => (
          <div key={cat.id}
            onClick={(e) => handleNav(e, cat)}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              gridColumn: i === 0 ? '2' : '3',
              gridRow: '1',
              position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
            }}
          >
            <img src={cat.img} alt={cat.title} onError={e => { e.currentTarget.src = cat.imgFallback; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovered === cat.id ? 'scale(1.07)' : 'scale(1)', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
            {cat.popular && (
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg,#c2772b,#e09a4f)', color: '#fff', fontSize: '0.54rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20, boxShadow: '0 3px 10px rgba(194,119,43,0.5)' }}>⭐ TOP PICK</div>
            )}
            <div style={{ position: 'absolute', top: 12, left: 14, background: 'rgba(0,0,0,0.45)', borderRadius: 20, padding: '3px 10px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.54rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{cat.badge}</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px' }}>
              <div style={{ fontSize: '0.64rem', color: '#f0a050', fontWeight: 700, marginBottom: 3 }}>{cat.icon} {cat.title}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', marginBottom: 10, lineHeight: 1.4 }}>{cat.sub}</div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
                {cat.tags.slice(0, 2).map(t => (
                  <span key={t} style={{ fontSize: '0.55rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 20, padding: '2px 8px', backdropFilter: 'blur(4px)' }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.54rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Starts at</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f0a050' }}>{cat.price}<span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>{cat.unit}</span></div>
                </div>
                <button onClick={e => { e.stopPropagation(); handleNav(e, cat); }}
                  style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(6px)', transition: 'all 0.2s', ...(hovered === cat.id ? { background: 'linear-gradient(135deg,#c2772b,#e09a4f)', border: '1px solid transparent' } : {}) }}>
                  {cat.btnText} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom row — trust strip spans all 3 right cols */}
        <div style={{ gridColumn: '2 / 4', gridRow: '2', display: 'flex', alignItems: 'center', gap: 10 }}>
          {[['🛡️','Zero Brokerage','No hidden charges, ever'],['⚡','Instant Move-in','Ready homes, move today'],['✅','Verified Properties','Every listing is checked'],['🏠','500+ Listings','Across NCR & Noida']].map(([ic,lb,desc]) => (
            <div key={lb} style={{ flex: 1, background: 'rgba(255,255,255,0.75)', border: '1px solid #f0e8da', borderRadius: 14, padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(6px)' }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{ic}</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#1a1209', fontWeight: 700, marginBottom: 2 }}>{lb}</div>
                <div style={{ fontSize: '0.6rem', color: '#8a6a3a', lineHeight: 1.3 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
