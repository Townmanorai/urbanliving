import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './ROICalculator.css';

const DAYS = 30;

function inr(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const abs = Math.abs(Math.round(n));
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(2)}L`;
  return `₹${abs.toLocaleString('en-IN')}`;
}

function DonutChart({ slices }) {
  const R = 70, cx = 90, cy = 90, stroke = 22;
  const circ = 2 * Math.PI * R;
  const total = slices.reduce((s, x) => s + Math.max(x.value, 0), 0);
  let offset = 0;
  const segs = slices.map((sl) => {
    const v = Math.max(sl.value, 0);
    const pct = total > 0 ? v / total : 0;
    const dash = pct * circ;
    const gap = circ - dash;
    const seg = { ...sl, dash, gap, offset: offset * circ };
    offset += pct;
    return seg;
  });

  return (
    <svg viewBox="0 0 180 180" className="roi-donut-svg">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f0ebe3" strokeWidth={stroke} />
      {segs.map((seg, i) => (
        <circle
          key={i} cx={cx} cy={cy} r={R} fill="none"
          stroke={seg.color} strokeWidth={stroke}
          strokeDasharray={`${seg.dash} ${seg.gap}`}
          strokeDashoffset={-seg.offset}
          strokeLinecap="butt"
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px`, transition: 'stroke-dasharray 0.5s ease' }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#6b7280" fontFamily="Poppins,sans-serif">Net Earning</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a1209" fontFamily="Poppins,sans-serif">
        {inr(slices[0]?.value)}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="Poppins,sans-serif">/month</text>
    </svg>
  );
}

function SliderRow({ label, value, min, max, step, onChange, display, hint }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="roi-slider-block">
      <div className="roi-slider-top">
        <span className="roi-slider-label">{label}</span>
        <span className="roi-slider-display">{display}</span>
      </div>
      <div className="roi-slider-track-wrap">
        <div className="roi-slider-filled" style={{ width: `${pct}%` }} />
        <input
          type="range" min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="roi-range"
        />
      </div>
      {hint && <span className="roi-slider-hint">{hint}</span>}
    </div>
  );
}

export default function ROICalculator() {
  const navigate = useNavigate();
  const [nightlyRate, setRate]      = useState(3000);
  const [occupancy, setOccupancy]   = useState(70);
  const [platformFee, setPlatformFee] = useState(15);
  const [expenses, setExpenses]     = useState(3000);
  const [propValue, setPropValue]   = useState('');

  const calc = useMemo(() => {
    const nights      = Math.round((occupancy / 100) * DAYS);
    const gross       = nightlyRate * nights;
    const fee         = Math.round(gross * platformFee / 100);
    const net         = Math.max(gross - fee - expenses, 0);
    const annual      = net * 12;
    const pv          = Number(propValue) || 0;
    const roiPct      = pv > 0 ? ((annual / pv) * 100).toFixed(2) : null;
    return { nights, gross, fee, net, annual, roiPct };
  }, [nightlyRate, occupancy, platformFee, expenses, propValue]);

  const slices = [
    { label: 'Net Earning',   value: calc.net,   color: '#c2772b' },
    { label: 'Platform Fee',  value: calc.fee,   color: '#e5e7eb' },
    { label: 'Your Expenses', value: expenses,   color: '#f0ebe3' },
  ];

  const roiJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.ovikaliving.com/roi-calculator",
        "url": "https://www.ovikaliving.com/roi-calculator",
        "name": "ROI Calculator for Rental Properties in Noida | OvikaLiving",
        "description": "Calculate how much you can earn monthly by listing your vacant flat or property on OvikaLiving. Free ROI calculator for short-term rentals in Noida, Greater Noida, Delhi & Gurugram.",
        "inLanguage": "en-IN",
        "isPartOf": { "@id": "https://www.ovikaliving.com/#website" },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ovikaliving.com/" },
            { "@type": "ListItem", "position": 2, "name": "ROI Calculator", "item": "https://www.ovikaliving.com/roi-calculator" }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the ROI Calculator on OvikaLiving?",
            "acceptedAnswer": { "@type": "Answer", "text": "The OvikaLiving ROI Calculator helps property owners in Noida, Greater Noida, Delhi, and Gurugram estimate their monthly and annual earnings from short-term rentals. Enter your nightly rate, expected occupancy, and monthly expenses to see your net take-home income." }
          },
          {
            "@type": "Question",
            "name": "How much can I earn by listing my flat on OvikaLiving?",
            "acceptedAnswer": { "@type": "Answer", "text": "Earnings depend on your nightly rate and occupancy. At 70% occupancy and ₹3,000/night, a 2 BHK in Noida can earn approximately ₹40,000–₹55,000 per month net after platform fee and expenses — significantly more than a traditional long-term lease." }
          },
          {
            "@type": "Question",
            "name": "What is OvikaLiving's platform fee?",
            "acceptedAnswer": { "@type": "Answer", "text": "OvikaLiving charges a 15% platform fee on your gross rental income. This covers listing management, guest support, payment processing, and marketing exposure." }
          },
          {
            "@type": "Question",
            "name": "Is short-term rental more profitable than long-term rent in Noida?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes, in most cases. At 65–75% occupancy, short-term rentals can earn 30–80% more than traditional long-term leases in Noida and Greater Noida, especially for furnished apartments and premium locations." }
          },
          {
            "@type": "Question",
            "name": "How do I calculate the ROI on my property?",
            "acceptedAnswer": { "@type": "Answer", "text": "Enter your property's current market value in the optional field. The calculator divides your annual net rental income by the property value to give you the annual ROI percentage — a key metric for evaluating your investment." }
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "OvikaLiving ROI Calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
        "description": "Free online tool to calculate rental income and ROI for property owners in NCR — Noida, Greater Noida, Delhi, Gurugram.",
        "url": "https://www.ovikaliving.com/roi-calculator"
      }
    ]
  };

  return (
    <>
    <Helmet>
      <title>ROI Calculator for Rental Property in Noida | Earn from Vacant Flat | OvikaLiving</title>
      <meta name="description" content="Calculate how much you can earn monthly by listing your vacant flat on OvikaLiving. Free rental ROI calculator for property owners in Noida, Greater Noida, Delhi & Gurugram. See net earnings, platform fee breakdown & annual ROI instantly." />
      <meta name="keywords" content="roi calculator property noida, rental income calculator noida, how much can i earn listing flat noida, short term rental income calculator india, property roi calculator india, ovikaliving roi, earn from vacant flat noida, rental yield calculator noida, airbnb calculator noida, property investment return noida, monthly rental income calculator, nightly rental income calculator, flat rental income noida, property earning calculator greater noida, rent vs short term rental india, co living income calculator, furnished flat income noida, listing property income calculator, vacancy rental calculator, real estate roi noida, property yield calculator india, short stay income noida, holiday rental income calculator india, earn from flat noida, property rent calculator delhi, gurugram rental income calculator, NCR property roi" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href="https://www.ovikaliving.com/roi-calculator" />
      <meta name="author" content="OvikaLiving — Townmanor Technologies Pvt. Ltd." />
      <meta name="language" content="en" />
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Noida, Uttar Pradesh" />
      <meta name="geo.position" content="28.5355;77.3910" />
      <meta name="ICBM" content="28.5355, 77.3910" />
      <meta name="revisit-after" content="7 days" />
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Free Rental ROI Calculator for Property Owners in Noida | OvikaLiving" />
      <meta property="og:description" content="See exactly how much your vacant flat can earn per month on OvikaLiving. Adjust nightly rate, occupancy & expenses — get instant net income & annual ROI." />
      <meta property="og:url" content="https://www.ovikaliving.com/roi-calculator" />
      <meta property="og:site_name" content="OvikaLiving" />
      <meta property="og:image" content="https://www.ovikaliving.com/og-roi-calculator.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@OvikaLiving" />
      <meta name="twitter:title" content="Free Property ROI Calculator | How Much Can Your Flat Earn? | OvikaLiving" />
      <meta name="twitter:description" content="Use OvikaLiving's free ROI calculator to estimate monthly rental income from your vacant property in Noida, Greater Noida, Delhi & Gurugram." />
      <meta name="twitter:image" content="https://www.ovikaliving.com/og-roi-calculator.jpg" />
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(roiJsonLd)}</script>
    </Helmet>

    <div className="roi-wrap">
      <div className="roi-inner">

        <div className="roi-page-header">
          <h1 className="roi-page-title">ROI Calculator</h1>
          <p className="roi-page-sub">See how much you can earn monthly by listing your vacant flat on OvikaLiving</p>
        </div>

        {/* ── Main card ── */}
        <div className="roi-main-card">

          {/* LEFT: sliders */}
          <div className="roi-left">
            <SliderRow
              label="Nightly Rate"
              value={nightlyRate}
              min={500} max={15000} step={100}
              onChange={setRate}
              display={<><span className="roi-rupee">₹</span>{nightlyRate.toLocaleString('en-IN')}</>}
              hint="Expected price per night you'll charge guests"
            />
            <SliderRow
              label="Occupancy Rate"
              value={occupancy}
              min={10} max={100} step={5}
              onChange={setOccupancy}
              display={<>{occupancy}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}> %</span></>}
              hint={`${calc.nights} nights booked per month at ${occupancy}% occupancy`}
            />
            <SliderRow
              label="Platform Fee"
              value={platformFee}
              min={0} max={30} step={1}
              onChange={setPlatformFee}
              display={<>{platformFee}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}> %</span></>}
              hint="OvikaLiving standard: 15%. Adjust if your deal differs."
            />
            <SliderRow
              label="Monthly Expenses"
              value={expenses}
              min={0} max={20000} step={500}
              onChange={setExpenses}
              display={<><span className="roi-rupee">₹</span>{expenses.toLocaleString('en-IN')}</>}
              hint="Cleaning, maintenance, electricity, etc."
            />

            {/* Property value — text input */}
            <div className="roi-slider-block">
              <div className="roi-slider-top">
                <span className="roi-slider-label">Property Value <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></span>
              </div>
              <input
                type="number"
                placeholder="e.g. 5000000"
                value={propValue}
                onChange={e => setPropValue(e.target.value)}
                className="roi-value-input"
              />
              <span className="roi-slider-hint">Enter to see annual ROI % on your investment</span>
            </div>
          </div>

          {/* RIGHT: donut */}
          <div className="roi-right">
            <DonutChart slices={slices} />
            <div className="roi-legend">
              {slices.map((s, i) => (
                <div className="roi-legend-row" key={i}>
                  <span className="roi-legend-dot" style={{ background: s.color }} />
                  <span className="roi-legend-text">{s.label}</span>
                  <span className="roi-legend-val">{inr(Math.max(s.value, 0))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="roi-stats-row">
          <div className="roi-stat-box">
            <span className="roi-stat-label">Gross Monthly</span>
            <span className="roi-stat-val">{inr(calc.gross)}</span>
          </div>
          <div className="roi-stat-box">
            <span className="roi-stat-label">Platform Fee ({platformFee}%)</span>
            <span className="roi-stat-val neg">−{inr(calc.fee)}</span>
          </div>
          <div className="roi-stat-box">
            <span className="roi-stat-label">Your Expenses</span>
            <span className="roi-stat-val neg">−{inr(expenses)}</span>
          </div>
          <div className="roi-stat-box highlight">
            <span className="roi-stat-label">Net Monthly</span>
            <span className="roi-stat-val gold">{inr(calc.net)}</span>
          </div>
          <div className="roi-stat-box">
            <span className="roi-stat-label">Annual Earning</span>
            <span className="roi-stat-val">{inr(calc.annual)}</span>
          </div>
          {calc.roiPct && (
            <div className="roi-stat-box">
              <span className="roi-stat-label">ROI on Property</span>
              <span className="roi-stat-val pos">{calc.roiPct}%</span>
            </div>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="roi-cta-bar">
          <div>
            <p className="roi-cta-title">Ready to earn from your vacant flat?</p>
            <p className="roi-cta-sub">List on OvikaLiving — free setup, no lock-in</p>
          </div>
          <button className="roi-cta-btn" onClick={() => navigate('/listed1')}>
            List My Property →
          </button>
        </div>

        <p className="roi-disclaimer">
          * Estimated figures based on average market data. Actual earnings vary by location, condition, amenities & demand.
        </p>

        {/* ── Explanation Section ── */}
        <div className="roi-info-section">

          <div className="roi-info-card">
            <div className="roi-info-icon">📊</div>
            <div>
              <h3 className="roi-info-title">What is an ROI Calculator?</h3>
              <p className="roi-info-text">
                ROI stands for <strong>Return on Investment</strong>. This calculator tells you how much money
                your vacant flat or property can generate every month by listing it on OvikaLiving as a
                short-term rental — instead of letting it sit empty or giving it on a traditional long-term lease.
              </p>
            </div>
          </div>

          <div className="roi-info-card">
            <div className="roi-info-icon">⚙️</div>
            <div>
              <h3 className="roi-info-title">How does it work?</h3>
              <p className="roi-info-text">
                Set your expected nightly rate and occupancy using the sliders. The calculator multiplies your
                nightly rate by the number of nights booked to get <strong>gross monthly revenue</strong>.
                It then deducts the platform fee ({platformFee}%) and your monthly running expenses
                to show your <strong>real net take-home income</strong>. Optionally enter your property value
                to see the annual ROI percentage.
              </p>
            </div>
          </div>

          <div className="roi-info-card">
            <div className="roi-info-icon">💡</div>
            <div>
              <h3 className="roi-info-title">Why is this useful for you?</h3>
              <ul className="roi-info-list">
                <li><strong>Vacant flat?</strong> See exact earning potential before you decide what to do with it.</li>
                <li><strong>Currently on long-term rent?</strong> Compare and decide if switching to short-term makes more sense.</li>
                <li><strong>Planning to invest?</strong> Use the ROI % field to evaluate rental yield before buying.</li>
                <li><strong>Already listed?</strong> Adjust occupancy to see how improving bookings impacts monthly income.</li>
                <li><strong>Transparent pricing:</strong> The platform fee ({platformFee}%) is clearly shown so you always know your actual take-home.</li>
              </ul>
            </div>
          </div>

          <div className="roi-info-card">
            <div className="roi-info-icon">📈</div>
            <div>
              <h3 className="roi-info-title">Tips to maximise your ROI</h3>
              <ul className="roi-info-list">
                <li>Keep your property <strong>well-furnished and clean</strong> — higher quality listings get 30–40% better occupancy.</li>
                <li>Weekends typically earn <strong>20–40% more</strong> — set a higher weekend rate.</li>
                <li>Aim for at least <strong>65–75% occupancy</strong> to consistently earn more.</li>
                <li>Add amenities like Wi-Fi, AC, and kitchen appliances — they directly impact your nightly rate.</li>
                <li>Professional photos increase booking rates by up to <strong>40%</strong>.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
