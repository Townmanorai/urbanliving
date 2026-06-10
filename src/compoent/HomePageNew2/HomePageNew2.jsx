import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { navClick, auxNavClick } from '../../utils/navClick';

function getBreakpoint() {
  const w = window.innerWidth;
  if (w <= 768) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

const NIGHTLY = [
  {
    id: 'signature',
    title: 'Signature Stays',
    sub: 'Fully managed luxury homes',
    badge: 'Nightly Rental',
    price: '₹2,599/night',
    btnText: 'View Signature',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80',
    rentalType: 'short',
    category: 'Signature Stays',
  },
  {
    id: 'hotel',
    title: 'Hotel Stays',
    sub: '4-Star, 5-Star & Boutique Hotels',
    badge: 'Nightly Rental',
    price: '₹1,499/night',
    btnText: 'View Hotels',
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    rentalType: 'short',
    category: 'Hotel Stays',
  },
  {
    id: 'homestay',
    title: 'Homestays & BnB',
    sub: 'Villas, Flats & Serviced Homes',
    badge: 'Nightly Rental',
    price: '₹2,499/night',
    btnText: 'View Homestays',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    rentalType: 'short',
    category: 'Homestays & BnB',
  },
  {
    id: 'apartments',
    title: 'Apartments & Villas',
    sub: 'Furnished Flats, Studios & Villas',
    badge: 'Nightly Rental',
    price: '₹2,499/night',
    btnText: 'View Apartments',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
    rentalType: 'short',
    category: 'Apartments & Villas',
  },
  {
    id: 'pg',
    title: 'PG & Co-Living',
    sub: 'Boys, Girls & Community Living',
    badge: 'Nightly Rental',
    price: '₹799/night',
    btnText: 'View PG & Co-Living',
    img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    rentalType: 'long',
    category: 'PG & Co-Living',
  },
];

const MONTHLY = [
  {
    id: 'signature',
    title: 'Signature Stays',
    sub: 'Fully managed luxury homes',
    badge: 'Monthly Rental',
    price: '₹25,999/month',
    btnText: 'View Signature',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80',
    rentalType: 'long',
    category: 'Signature Stays',
  },
  {
    id: 'hotel',
    title: 'Hotel Stays',
    sub: '4-Star, 5-Star & Boutique Hotels',
    badge: 'Monthly Rental',
    price: '₹35,999/month',
    btnText: 'View Hotels',
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    rentalType: 'long',
    category: 'Hotel Stays',
  },
  {
    id: 'homestay',
    title: 'Homestays & BnB',
    sub: 'Villas, Flats & Serviced Homes',
    badge: 'Monthly Rental',
    price: '₹15,999/month',
    btnText: 'View Homestays',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    rentalType: 'long',
    category: 'Homestays & BnB',
  },
  {
    id: 'apartments',
    title: 'Apartments & Villas',
    sub: 'Furnished Flats, Studios & Villas',
    badge: 'Monthly Rental',
    price: '₹12,999/month',
    btnText: 'View Apartments',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
    rentalType: 'long',
    category: 'Apartments & Villas',
  },
  {
    id: 'pg',
    title: 'PG & Co-Living',
    sub: 'Boys, Girls & Community Living',
    badge: 'Monthly Rental',
    price: '₹4,999/month',
    btnText: 'View PG & Co-Living',
    img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    rentalType: 'long',
    category: 'PG & Co-Living',
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

  const handleNav = (e, cat) => {
    const p = new URLSearchParams();
    p.set('rentalType', cat.rentalType);
    if (cat.category) p.set('category', cat.category);
    sessionStorage.setItem('ovika_rental_type', cat.rentalType);
    navClick(e, `/properties?${p}`, navigate);
  };

  const sectionBg = {
    background: 'linear-gradient(160deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%)',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box',
    overflow: 'visible',
  };

  /* ════════ MOBILE (≤768px) ════════ */
  if (bp === 'mobile') {
    return (
      <section style={{ ...sectionBg, padding: '24px 16px 32px', background: 'linear-gradient(180deg, #f5ead6 0%, #ede4cf 100%)' }}>

        {/* Tab switcher */}
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} size="sm" />

        {/* Cards — single horizontal scroll row */}
        <style>{`.hw2-scroll::-webkit-scrollbar{display:none}`}</style>
        <div className="hw2-scroll" style={{ display: 'flex', overflowX: 'auto', gap: 9, marginBottom: 14, msOverflowStyle: 'none', scrollbarWidth: 'none', paddingBottom: 2 }}>
          {cats.map((cat) => (
            <div key={cat.id}
              onClick={(e) => handleNav(e, cat)}
              style={{
                flex: '0 0 44%',
                background: '#fff', borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 3px 14px rgba(0,0,0,0.08)',
                border: '1px solid #f0e8da', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
              }}>
              {/* Image */}
              <div style={{ position: 'relative', paddingTop: '58%', flexShrink: 0 }}>
                <img src={cat.img} alt={cat.title}
                  onError={e => { e.currentTarget.src = cat.imgFallback; }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.28) 100%)' }} />
                <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(194,119,43,0.9)', borderRadius: 20, padding: '2px 6px' }}>
                  <span style={{ fontSize: '0.38rem', color: '#fff', fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>{cat.badge}</span>
                </div>
              </div>
              {/* Content */}
              <div style={{ padding: '7px 8px 9px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#1a1209', lineHeight: 1.2, marginBottom: 1 }}>{cat.title}</div>
                <div style={{ fontSize: '0.5rem', color: '#8a6a3a', lineHeight: 1.3, marginBottom: 5, fontWeight: 400 }}>{cat.sub}</div>
                <div style={{ marginBottom: 7 }}>
                  <div style={{ fontSize: '0.42rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Starting</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 500, color: '#1a1209', marginTop: 1 }}>{cat.price}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleNav(e, cat); }}
                  style={{
                    marginTop: 'auto', width: '100%', padding: '6px 0', borderRadius: 7, border: 'none',
                    background: '#c2772b', color: '#fff',
                    fontSize: '0.52rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                  }}>
                  {cat.btnText} <ArrowRight size={9} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 8px', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0e8da' }}>
          {[['✦', 'Fully Furnished'], ['⚡', 'Instant Move-in'], ['🛡', 'Zero Brokerage']].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: '0.9rem' }}>{icon}</span>
              <span style={{ fontSize: '0.55rem', color: '#5a4a3a', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
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
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} size="md" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, maxWidth: 900, margin: '0 auto', paddingBottom: 8 }}>
          {cats.map((cat) => (
            <div key={cat.id}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => handleNav(e, cat)}
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
                  <span style={{ fontSize: '0.58rem', color: '#fff', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>{cat.badge}</span>
                </div>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <h3 style={{ color: '#1a1209', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px', lineHeight: 1.2 }}>{cat.title}</h3>
                <p style={{ color: '#8a6a3a', fontSize: '0.74rem', fontWeight: 400, margin: '0 0 12px', lineHeight: 1.4 }}>{cat.sub}</p>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '0.58rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1209', marginTop: 2 }}>{cat.price}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); handleNav(e, cat); }}
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

      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} size="lg" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, maxWidth: 1400, margin: '0 auto', paddingBottom: 12 }}>
        {cats.map((cat) => (
          <div key={cat.id}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleNav(e, cat)}
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
                <span style={{ fontSize: '0.58rem', color: '#fff', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>{cat.badge}</span>
              </div>
            </div>
            <div style={{ padding: '18px 20px 20px' }}>
              <h3 style={{ color: '#1a1209', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 5px', lineHeight: 1.2 }}>{cat.title}</h3>
              <p style={{ color: '#8a6a3a', fontSize: '0.76rem', fontWeight: 400, margin: '0 0 14px', lineHeight: 1.4 }}>{cat.sub}</p>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.6rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1209', marginTop: 3 }}>{cat.price}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); handleNav(e, cat); }}
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
