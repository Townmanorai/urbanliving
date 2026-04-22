
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { navClick, auxNavClick } from '../../utils/navClick';

// ✅ Real API data — 1 property per city (10 unique cities)
const PROPERTIES = [
  {
    id: 244,
    name: 'Hotel Noida International',
    city: 'Greater Noida',
    tag: 'Value Pick',
    nightPrice: 3500,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/hotel-noida-international/photos/22-1771589979293-628793480.jpeg',
    desc: 'Greater Noida · Sector 11 · Hotel · AC Room',
  },
  {
    id: 248,
    name: 'Hotel Noida International',
    city: 'Noida',
    tag: 'Most Booked',
    nightPrice: 2299,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/comfort-seamless-hospitality-at-hotel-noida-international/photos/WhatsApp%20Image%202026-02-20%20at%204.56.53%20PM-1771655830663-762673685.jpeg',
    desc: 'Noida Sector 11 · Hotel · AC Room · Dining',
  },
  {
    id: 275,
    name: 'Hari Kripa Dham',
    city: 'Vrindavan',
    tag: 'Spiritual',
    nightPrice: 2299,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/hari-kripa-dham-near-prem-mandir/photos/WhatsApp%20Image%202026-02-25%20at%204.56.17%20PM%20%281%29-1772023875086-737676942.jpeg',
    desc: 'Vrindavan · Near Prem Mandir · Pure Veg',
  },
  {
    id: 296,
    name: 'Fully Furnished Room for Girls',
    city: 'Noida Extension',
    tag: 'Popular',
    nightPrice: 15000,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/fully-furnished-room-for-girls-3-1-bhk-apartment-noida-extension/photos/ChatGPT%20Image%20Mar%202%2C%202026%2C%2004_11_59%20PM-1772791814677-78878695.png',
    desc: 'Noida Extension · 3+1 BHK · 1980 Sqft · AC',
  },
  {
    id: 282,
    name: 'KS Luxury PG',
    city: 'Ghaziabad',
    tag: 'Most Booked',
    nightPrice: 1099,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/ks-luxury-pg-in-crossing-republic-ghaziabad/photos/Screenshot%202026-02-26%20140541-1772096021985-660344627.png',
    desc: 'Ghaziabad · Crossing Republic · Meals · WiFi',
  },
  {
    id: 137,
    name: 'Kozi 3BHK Apartment',
    city: 'Nashik',
    tag: 'Wine Country',
    nightPrice: 5500,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/kozi-3bhk-apartment-for-family/photos/q1-1768390661453-674255833.jpeg',
    desc: 'Nashik · 3BHK · Wine-Themed · Vineyard Views',
  },
  {
    id: 90,
    name: 'Eurocottage 2BHK Villa',
    city: 'Lonavala',
    tag: 'Pool Villa',
    nightPrice: 7000,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/eurocottage-cozy-2bhk-villa-with-private-swimming-pool-in-lonavala/photos/WhatsApp%20Image%202025-05-22%20at%2011.54.18%20AM-1767459110947-540069756.jpeg',
    desc: 'Lonavala · 2BHK · Private Pool · Sahyadri',
  },
  {
    id: 92,
    name: 'Villa Casa Blanca Cinza',
    city: 'Goa',
    tag: 'Beach Stay',
    nightPrice: 4000,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/villa-casa-blanca-cinza-beautiful-1bhk-appartment-near-calangute-beach/photos/DSC03595-HDR-Edit-1767461037525-9453622.jpeg',
    desc: 'Calangute Goa · 1BHK · Near Beach · Pool',
  },
  {
    id: 167,
    name: '3AC Bed Rm Serenity Heaven',
    city: 'Bengaluru',
    tag: 'Luxury',
    nightPrice: 18000,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/3ac-bed-rm-serenity-heaven/photos/78e29480-d39d-45df-93c1-a8d1824c99c5-1769171637471-734429473.jpg',
    desc: 'Bengaluru · 3BHK · BBQ · Gym · Private',
  },
  {
    id: 170,
    name: 'Tree House Wooden Room',
    city: 'Amritsar',
    tag: 'Unique',
    nightPrice: 3000,
    photo: 'https://s3.ap-south-1.amazonaws.com/townamnor.ai/tree-house-wooden-room-with-pool-garden-view/photos/a1-1769518455131-772651126.jpeg',
    desc: 'Amritsar · Tree House · Pool & Garden View',
  },
];

const TAG_COLORS = {
  'Signature':    { bg: '#fce4ec', color: '#880e4f' },
  'Most Booked':  { bg: '#e8eaf6', color: '#283593' },
  'Value Pick':   { bg: '#e0f2f1', color: '#004d40' },
  'Spiritual':    { bg: '#f3e5f5', color: '#6a1b9a' },
  'Popular':      { bg: '#fff8e1', color: '#f57f17' },
  'Family Pick':  { bg: '#e8f5e9', color: '#1b5e20' },
  'Wine Country': { bg: '#fce4ec', color: '#6d1b2f' },
  'Pool Villa':   { bg: '#e3f2fd', color: '#0d47a1' },
  'Beach Stay':   { bg: '#e0f7fa', color: '#006064' },
  'Luxury':       { bg: '#fff3e0', color: '#e65100' },
  'Unique':       { bg: '#efebe9', color: '#4e342e' },
};

function formatPrice(n) {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(n % 100000 === 0 ? 0 : 2) + 'L';
  return '₹' + n.toLocaleString('en-IN');
}

export default function SignatureStays() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scroll = dir => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const handleImgError = (id) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const getFallbackImg = () =>
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80';

  return (
    <section
      id="signature-stays-section"
      style={{
        width: '100%',
        padding: 'clamp(2rem, 5vw, 3.5rem) 0 clamp(2.5rem, 5vw, 4rem)',
        background: 'white',
        boxSizing: 'border-box',
        fontFamily: 'Poppins, sans-serif',
        overflow: 'hidden',
      }}
    >

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(1.2rem, 3vw, 2rem)', padding: '0 1.5rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
          color: '#1a0f00',
          margin: '0 0 0.4rem',
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: '-0.3px',
        }}>
          OvikaLiving <span style={{ color: '#c2772b' }}>HandPicked Stays</span>
        </h2>
      </div>

      {/* ── Carousel wrapper ── */}
      <div style={{ position: 'relative', width: '100%' }}>

        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-60%)',
            zIndex: 10, width: 40, height: 40, borderRadius: '50%',
            border: '1.5px solid #e0c9a0',
            background: canLeft ? '#fff' : 'rgba(255,255,255,0.5)',
            boxShadow: canLeft ? '0 4px 16px rgba(194,119,43,0.18)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: canLeft ? 'pointer' : 'default',
            transition: 'all 0.2s',
            opacity: canLeft ? 1 : 0.35,
          }}
        >
          <ChevronLeft size={18} color="#c2772b"/>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-60%)',
            zIndex: 10, width: 40, height: 40, borderRadius: '50%',
            border: '1.5px solid #e0c9a0',
            background: canRight ? '#fff' : 'rgba(255,255,255,0.5)',
            boxShadow: canRight ? '0 4px 16px rgba(194,119,43,0.18)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: canRight ? 'pointer' : 'default',
            transition: 'all 0.2s',
            opacity: canRight ? 1 : 0.35,
          }}
        >
          <ChevronRight size={18} color="#c2772b"/>
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          style={{
            display: 'flex',
            gap: 'clamp(12px, 1.5vw, 20px)',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: isMobile
              ? '0.5rem 16px 1.5rem'
              : '0.5rem clamp(48px, 5vw, 64px) 1.5rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {PROPERTIES.map((p, i) => {
            const isHovered = hoveredIdx === i;
            const tagStyle = TAG_COLORS[p.tag] || { bg: '#f5f5f5', color: '#555' };
            const imgSrc = imgErrors[p.id] ? getFallbackImg() : p.photo;

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={(e) => navClick(e, `/property/${p.id}`, navigate)}
                onAuxClick={(e) => auxNavClick(e, `/property/${p.id}`)}
                style={{
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  width: 'clamp(220px, 22vw, 280px)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: '#fff',
                  cursor: 'pointer',
                  boxShadow: isHovered
                    ? '0 16px 48px rgba(194,119,43,0.22), 0 4px 16px rgba(0,0,0,0.1)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                  border: isHovered ? '1.5px solid rgba(194,119,43,0.3)' : '1.5px solid transparent',
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: 168, overflow: 'hidden' }}>
                  <img
                    src={imgSrc}
                    alt={p.name}
                    onError={() => handleImgError(p.id)}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  {p.name?.toLowerCase().includes('signature') && (
                    <img 
                      src="/ovikaver.png" 
                      alt="Verified" 
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 100,
                        height: 'auto',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                        pointerEvents: 'none',
                        zIndex: 10
                      }}
                    />
                  )}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(20,10,0,0.55) 0%, transparent 55%)',
                  }}/>
                  {/* Tag */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: tagStyle.bg, color: tagStyle.color,
                    fontSize: '0.6rem',
                    padding: '3px 9px', borderRadius: 20,
                    letterSpacing: '0.4px', textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    {p.tag}
                  </div>
                  {/* City name */}
                  <div style={{
                    position: 'absolute', bottom: 10, left: 12,
                    color: '#fff',
                    fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    letterSpacing: '0.2px',
                  }}>
                    {p.city}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '12px 14px 14px' }}>
                  {/* Property name */}
                  <p style={{
                    fontSize: '0.78rem', color: '#2a1a08', margin: '0 0 4px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    letterSpacing: '0.1px',
                  }}>
                    {p.name}
                  </p>
                  <p style={{
                    fontSize: '0.7rem', color: '#9a8a78', margin: '0 0 10px',
                    lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ color: '#c2772b', fontSize: '0.68rem' }}>📍</span>
                    {p.desc}
                  </p>

                  {/* Pricing row */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      {/* Night price */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <span style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.08rem)', color: '#1a0f00' }}>
                          {formatPrice(p.nightPrice)}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: '#aaa' }}>/night</span>
                      </div>
                    </div>

                    <div style={{
                      fontSize: '0.68rem', color: '#c2772b',
                      display: 'flex', alignItems: 'center', gap: 3,
                      opacity: isHovered ? 1 : 0.7,
                      transition: 'opacity 0.2s',
                    }}>
                      View →
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA Button ── */}
      <div style={{ textAlign: 'center', marginTop: 'clamp(0.5rem, 2vw, 1.2rem)' }}>
        <button
          onClick={(e) => navClick(e, '/properties', navigate)}
          onAuxClick={(e) => auxNavClick(e, '/properties')}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 32px rgba(194,119,43,0.55)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(194,119,43,0.4)';
          }}
          style={{
            background: 'linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 50,
            padding: 'clamp(10px, 1.5vw, 14px) clamp(24px, 3vw, 40px)',
            fontSize: 'clamp(0.78rem, 1vw, 0.92rem)',
            cursor: 'pointer',
            letterSpacing: '0.4px',
            boxShadow: '0 6px 24px rgba(194,119,43,0.4)',
            fontFamily: 'Poppins, sans-serif',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          Explore More ✦
        </button>
      </div>

    </section>
  );
}