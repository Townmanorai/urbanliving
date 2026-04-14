import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function getBreakpoint() {
  const w = window.innerWidth;
  if (w <= 640) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

const NIGHTLY = [
  {
    id: 'pg',
    title: 'PGs',
    sub: 'Affordable shared living',
    badge: 'Nightly Rental',
    price: '₹799/night',
    btnText: 'View PGs',
    img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
    rentalType: 'long',
    category: 'PG',
  },
  {
    id: 'economy',
    title: 'Economy Stay',
    sub: 'Budget private rooms',
    badge: 'Nightly Rental',
    price: '₹1,499/night',
    btnText: 'View Economy',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    rentalType: 'short',
    category: 'Economy Stay',
  },
  {
    id: 'premium',
    title: 'Premium Stay',
    sub: 'Business class studios',
    badge: 'Nightly Rental',
    price: '₹2,499/night',
    btnText: 'View Premium',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    rentalType: 'short',
    category: 'Premium Stay',
  },
  {
    id: 'signature',
    title: 'Signature Stays',
    sub: 'Luxury curated homes',
    badge: 'Nightly Rental',
    price: '₹3,999/night',
    btnText: 'View Signature',
    img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80',
    rentalType: 'short',
    category: 'Signature Stays',
  },
];

const MONTHLY = [
  {
    id: 'pg',
    title: 'PGs',
    sub: 'Affordable shared living',
    badge: 'Monthly Rental',
    price: '₹4,999/month',
    btnText: 'View PGs',
    img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
    rentalType: 'long',
    category: 'PG',
  },
  {
    id: 'economy',
    title: 'Economy Stay',
    sub: 'Budget private rooms',
    badge: 'Monthly Rental',
    price: '₹8,999/month',
    btnText: 'View Economy',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    rentalType: 'long',
    category: 'Economy Stay',
  },
  {
    id: 'premium',
    title: 'Premium Stay',
    sub: 'Business class studios',
    badge: 'Monthly Rental',
    price: '₹15,999/month',
    btnText: 'View Premium',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    rentalType: 'long',
    category: 'Premium Stay',
  },
  {
    id: 'signature',
    title: 'Signature Stays',
    sub: 'Luxury curated homes',
    badge: 'Monthly Rental',
    price: '₹25,999/month',
    btnText: 'View Signature',
    img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80',
    rentalType: 'long',
    category: 'Signature Stays',
  },
];

/* ── Shared Tab Switcher ── */
function TabSwitcher({ activeTab, setActiveTab, size }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: size === 'sm' ? 18 : 28 }}>
      <div style={{
        background: '#fff', borderRadius: 50, padding: 4, display: 'flex',
        boxShadow: '0 4px 18px rgba(0,0,0,0.08)', border: '1.5px solid #f0e8da',
      }}>
        {[['nightly', '🌙 Nightly Stay'], ['monthly', '🏠 Monthly Stay']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            padding: size === 'sm' ? '8px 16px' : size === 'md' ? '9px 22px' : '10px 28px',
            borderRadius: 50, border: 'none', cursor: 'pointer',
            fontSize: size === 'sm' ? '0.74rem' : size === 'md' ? '0.8rem' : '0.84rem',
            fontWeight: 600, fontFamily: "'Poppins', sans-serif",
            background: activeTab === key ? '#c2772b' : 'transparent',
            color: activeTab === key ? '#fff' : '#8a6a3a',
            transition: 'all 0.22s ease',
          }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

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

  const handleNav = (cat) => {
    const p = new URLSearchParams();
    p.set('rentalType', cat.rentalType);
    if (cat.category) p.set('category', cat.category);
    sessionStorage.setItem('ovika_rental_type', cat.rentalType);
    navigate(`/properties?${p}`);
  };

  const sectionBg = {
    background: 'linear-gradient(160deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%)',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box',
    overflow: 'visible',
  };

  /* ════════ MOBILE (≤640px) ════════ */
  if (bp === 'mobile') {
    return (
      <section style={{ ...sectionBg, padding: '26px 14px 60px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ display: 'inline-flex', background: 'rgba(194,119,43,0.1)', border: '1px solid rgba(194,119,43,0.25)', borderRadius: 20, padding: '4px 14px', marginBottom: 10 }}>
            <span style={{ fontSize: '0.58rem', color: '#c2772b', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600 }}>✦ Browse by Category</span>
          </div>
          <h2 style={{ color: '#1a1209', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 6px', lineHeight: 1.2 }}>
            Explore Stay Options
          </h2>
          <p style={{ color: '#6b5540', fontSize: '0.74rem', margin: 0, lineHeight: 1.55 }}>
            PGs, Economy, Premium &amp; Signature — all in one place
          </p>
        </div>

        {/* Tab switcher */}
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} size="sm" />

        {/* Cards – 2-column grid, full-width image-on-top cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 4 }}>
          {cats.map((cat) => (
            <div key={cat.id}
              onClick={() => handleNav(cat)}
              style={{
                background: '#fff', borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(0,0,0,0.09)',
                border: '1.5px solid #f0e8da', cursor: 'pointer',
              }}>
              {/* Image */}
              <div style={{ height: 115, position: 'relative', overflow: 'hidden' }}>
                <img src={cat.img} alt={cat.title}
                  onError={e => { e.currentTarget.src = cat.imgFallback; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.32) 100%)' }} />
                <div style={{ position: 'absolute', top: 7, left: 7, background: 'rgba(194,119,43,0.9)', borderRadius: 20, padding: '2px 8px' }}>
                  <span style={{ fontSize: '0.48rem', color: '#fff', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{cat.badge}</span>
                </div>
              </div>
              {/* Content */}
              <div style={{ padding: '11px 11px 13px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1209', lineHeight: 1.2, marginBottom: 3 }}>{cat.title}</div>
                <div style={{ fontSize: '0.62rem', color: '#8a6a3a', lineHeight: 1.3, marginBottom: 9, fontWeight: 400 }}>{cat.sub}</div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '0.52rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 600 }}>Starts at</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1209', marginTop: 1 }}>{cat.price}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleNav(cat); }}
                  style={{
                    width: '100%', padding: '8px 0', borderRadius: 9, border: 'none',
                    background: '#c2772b', color: '#fff',
                    fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}>
                  {cat.btnText} <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust badges */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 22, padding: '14px 8px', background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f0e8da' }}>
          {[['✦', 'Fully Furnished'], ['⚡', 'Instant Move-in'], ['🛡', 'Zero Brokerage']].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              <span style={{ fontSize: '0.6rem', color: '#5a4a3a', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
            </div>
          ))}
        </div>

      </section>
    );
  }


  /* ════════ TABLET (641–1024px) ════════ */
  if (bp === 'tablet') {
    return (
      <section style={{ ...sectionBg, padding: '36px 24px 72px' }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ display: 'inline-flex', background: 'rgba(194,119,43,0.1)', border: '1px solid rgba(194,119,43,0.25)', borderRadius: 20, padding: '4px 16px', marginBottom: 10 }}>
            <span style={{ fontSize: '0.6rem', color: '#c2772b', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600 }}>✦ Browse by Category</span>
          </div>
          <h2 style={{ color: '#1a1209', fontSize: '1.65rem', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.2 }}>Explore Stay Options</h2>
          <p style={{ color: '#6b5540', fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>From budget PGs to luxury villas — find exactly what fits you</p>
        </div>

        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} size="md" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, maxWidth: 900, margin: '0 auto', paddingBottom: 8 }}>
          {cats.map((cat) => (
            <div key={cat.id}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleNav(cat)}
              style={{
                background: '#fff', borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
                boxShadow: hovered === cat.id ? '0 16px 48px rgba(194,119,43,0.18)' : '0 4px 20px rgba(0,0,0,0.08)',
                border: hovered === cat.id ? '1.5px solid rgba(194,119,43,0.35)' : '1.5px solid #f0e8da',
                transition: 'all 0.25s ease',
                transform: hovered === cat.id ? 'translateY(-4px)' : 'translateY(0)',
              }}>
              <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                <img src={cat.img} alt={cat.title}
                  onError={e => { e.currentTarget.src = cat.imgFallback; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', transform: hovered === cat.id ? 'scale(1.05)' : 'scale(1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.3) 100%)' }} />
                <div style={{ position: 'absolute', top: 12, left: 14, background: 'rgba(194,119,43,0.9)', borderRadius: 20, padding: '3px 12px' }}>
                  <span style={{ fontSize: '0.58rem', color: '#fff', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{cat.badge}</span>
                </div>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <h3 style={{ color: '#1a1209', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.2 }}>{cat.title}</h3>
                <p style={{ color: '#8a6a3a', fontSize: '0.74rem', margin: '0 0 12px', lineHeight: 1.4 }}>{cat.sub}</p>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '0.58rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1209', marginTop: 2 }}>{cat.price}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); handleNav(cat); }}
                  style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: hovered === cat.id ? '#a8631f' : '#c2772b', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {cat.btnText} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }


  /* ════════ DESKTOP (>1024px) ════════ */
  return (
    <section style={{ ...sectionBg, padding: '44px 40px 80px' }}>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', background: 'rgba(194,119,43,0.1)', border: '1px solid rgba(194,119,43,0.25)', borderRadius: 20, padding: '4px 16px', marginBottom: 12 }}>
          <span style={{ fontSize: '0.62rem', color: '#c2772b', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600 }}>✦ Browse by Category</span>
        </div>
        <h2 style={{ color: '#1a1209', fontSize: '1.9rem', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2 }}>Explore Stay Options</h2>
        <p style={{ color: '#6b5540', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>From budget PGs to luxury villas — find exactly what fits you</p>
      </div>

      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} size="lg" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, maxWidth: 1280, margin: '0 auto', paddingBottom: 12 }}>
        {cats.map((cat) => (
          <div key={cat.id}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleNav(cat)}
            style={{
              background: '#fff', borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
              boxShadow: hovered === cat.id ? '0 16px 48px rgba(194,119,43,0.18)' : '0 4px 20px rgba(0,0,0,0.08)',
              border: hovered === cat.id ? '1.5px solid rgba(194,119,43,0.35)' : '1.5px solid #f0e8da',
              transition: 'all 0.25s ease',
              transform: hovered === cat.id ? 'translateY(-6px)' : 'translateY(0)',
            }}>
            <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
              <img src={cat.img} alt={cat.title}
                onError={e => { e.currentTarget.src = cat.imgFallback; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', transform: hovered === cat.id ? 'scale(1.06)' : 'scale(1)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.3) 100%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 14, background: 'rgba(194,119,43,0.9)', borderRadius: 20, padding: '3px 12px' }}>
                <span style={{ fontSize: '0.58rem', color: '#fff', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{cat.badge}</span>
              </div>
            </div>
            <div style={{ padding: '18px 20px 20px' }}>
              <h3 style={{ color: '#1a1209', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 5px', lineHeight: 1.2 }}>{cat.title}</h3>
              <p style={{ color: '#8a6a3a', fontSize: '0.76rem', margin: '0 0 14px', lineHeight: 1.4 }}>{cat.sub}</p>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.6rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1209', marginTop: 3 }}>{cat.price}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); handleNav(cat); }}
                style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: hovered === cat.id ? '#a8631f' : '#c2772b', color: '#fff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                {cat.btnText} <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
