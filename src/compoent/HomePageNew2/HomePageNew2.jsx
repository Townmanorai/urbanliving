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
    price: 'Starting ₹799/night',
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
    price: 'Starting ₹1,499/night',
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
    price: 'Starting ₹2,499/night',
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
    price: 'Starting ₹3,999/night',
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
    price: 'Starting ₹4,999/month',
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
    price: 'Starting ₹8,999/month',
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
    price: 'Starting ₹15,999/month',
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
    price: 'Starting ₹25,999/month',
    btnText: 'View Signature',
    img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80&auto=format&fit=crop',
    imgFallback: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80',
    rentalType: 'long',
    category: 'Signature Stays',
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

  const handleNav = (cat) => {
    const p = new URLSearchParams();
    p.set('rentalType', cat.rentalType);
    if (cat.category) p.set('category', cat.category);
    sessionStorage.setItem('ovika_rental_type', cat.rentalType);
    navigate(`/properties?${p}`);
  };

  const isMobile = bp === 'mobile';
  const cols = isMobile ? 2 : bp === 'tablet' ? 2 : 4;

  return (
    <section style={{
      background: 'linear-gradient(160deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%)',
      padding: isMobile ? '28px 14px 36px' : bp === 'tablet' ? '36px 24px 48px' : '44px 40px 56px',
      fontFamily: "'Poppins', sans-serif",
      boxSizing: 'border-box',
    }}>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 28 }}>
        <div style={{ display: 'inline-flex', background: 'rgba(194,119,43,0.1)', border: '1px solid rgba(194,119,43,0.25)', borderRadius: 20, padding: '4px 16px', marginBottom: 10 }}>
          <span style={{ fontSize: isMobile ? '0.58rem' : '0.62rem', color: '#c2772b', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600 }}>✦ Browse by Category</span>
        </div>
        <h2 style={{ color: '#1a1209', fontSize: isMobile ? '1.3rem' : bp === 'tablet' ? '1.6rem' : '1.9rem', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.2 }}>
          Explore Stay Options
        </h2>
        <p style={{ color: '#6b5540', fontSize: isMobile ? '0.76rem' : '0.86rem', margin: 0, lineHeight: 1.6 }}>
          From budget PGs to luxury villas — find exactly what fits you
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? 20 : 28 }}>
        <div style={{
          background: '#fff', borderRadius: 50, padding: 4, display: 'flex', gap: 0,
          boxShadow: '0 4px 18px rgba(0,0,0,0.08)', border: '1.5px solid #f0e8da',
        }}>
          {[['nightly', '🌙 Nightly Stay'], ['monthly', '🏠 Monthly Stay']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: isMobile ? '8px 18px' : '10px 28px',
              borderRadius: 50, border: 'none', cursor: 'pointer',
              fontSize: isMobile ? '0.76rem' : '0.84rem', fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              background: activeTab === key ? '#c2772b' : 'transparent',
              color: activeTab === key ? '#fff' : '#8a6a3a',
              transition: 'all 0.22s ease',
              letterSpacing: 0.2,
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: isMobile ? 12 : bp === 'tablet' ? 18 : 22,
        maxWidth: 1280, margin: '0 auto',
      }}>
        {cats.map((cat) => (
          <div key={cat.id}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: '#fff', borderRadius: isMobile ? 16 : 20,
              overflow: 'hidden', cursor: 'pointer',
              boxShadow: hovered === cat.id
                ? '0 16px 48px rgba(194,119,43,0.18)'
                : '0 4px 20px rgba(0,0,0,0.08)',
              border: hovered === cat.id ? '1.5px solid rgba(194,119,43,0.35)' : '1.5px solid #f0e8da',
              transition: 'all 0.25s ease',
              transform: hovered === cat.id ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onClick={() => handleNav(cat)}
          >
            {/* Image */}
            <div style={{ height: isMobile ? 130 : bp === 'tablet' ? 180 : 200, position: 'relative', overflow: 'hidden' }}>
              <img
                src={cat.img} alt={cat.title}
                onError={e => { e.currentTarget.src = cat.imgFallback; }}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  transition: 'transform 0.4s ease',
                  transform: hovered === cat.id ? 'scale(1.06)' : 'scale(1)',
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.28) 100%)' }} />
              {/* Badge on image */}
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(194,119,43,0.9)', borderRadius: 20, padding: '3px 10px' }}>
                <span style={{ fontSize: isMobile ? '0.52rem' : '0.58rem', color: '#fff', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{cat.badge}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: isMobile ? '12px 12px 14px' : '16px 18px 18px' }}>
              <h3 style={{ color: '#1a1209', fontSize: isMobile ? '0.88rem' : '1rem', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.2 }}>
                {cat.title}
              </h3>
              <p style={{ color: '#8a6a3a', fontSize: isMobile ? '0.66rem' : '0.74rem', margin: '0 0 10px', fontWeight: 400, lineHeight: 1.4 }}>
                {cat.sub}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 10 : 14 }}>
                <div>
                  <div style={{ fontSize: isMobile ? '0.56rem' : '0.6rem', color: '#c2772b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>Starts at</div>
                  <div style={{ fontSize: isMobile ? '0.82rem' : '0.92rem', fontWeight: 600, color: '#1a1209', marginTop: 1 }}>{cat.price.replace('Starting ', '')}</div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={e => { e.stopPropagation(); handleNav(cat); }}
                style={{
                  width: '100%', padding: isMobile ? '8px 0' : '10px 0', borderRadius: 10,
                  border: 'none', background: hovered === cat.id ? '#a8631f' : '#c2772b',
                  color: '#fff', fontSize: isMobile ? '0.74rem' : '0.82rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                {cat.btnText} <ArrowRight size={isMobile ? 12 : 14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
