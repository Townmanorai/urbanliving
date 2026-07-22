import React from 'react';
import { ShieldCheck, BadgePercent, ClipboardCheck, CalendarCheck, MessageSquareText } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, title: 'Verified & Safe', desc: 'All properties verified for your safety' },
  { icon: BadgePercent, title: 'Best Price Guarantee', desc: 'Get the best deals at the best prices' },
  { icon: ClipboardCheck, title: 'Easy Booking', desc: 'Book instantly with secure payment' },
  { icon: CalendarCheck, title: 'Flexible Stays', desc: 'Daily, monthly or long term – your choice' },
  { icon: MessageSquareText, title: 'Trusted by Thousands', desc: '15,000+ happy guests trust us' },
];

const css = `
.wcu-section {
  background: #fff;
  padding: 44px 40px 20px;
  font-family: 'Poppins', sans-serif;
}
.wcu-inner { max-width: 1400px; margin: 0 auto; }
.wcu-eyebrow {
  font-size: 0.72rem;
  color: #c2772b;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.wcu-title {
  margin: 0 0 24px;
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a1209;
}
.wcu-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}
.wcu-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 16px;
  border-radius: 14px;
  border: 1px solid #f0e8da;
  background: #fff;
}
.wcu-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fdf2e4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c2772b;
}
.wcu-text-title {
  font-size: 0.86rem;
  font-weight: 700;
  color: #1a1209;
  margin: 0 0 3px;
}
.wcu-text-desc {
  font-size: 0.74rem;
  color: #8a8a8a;
  line-height: 1.4;
  margin: 0;
}
@media (max-width: 1024px) {
  .wcu-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .wcu-section { padding: 32px 18px 12px; }
  .wcu-title { font-size: 1.4rem; }
  .wcu-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .wcu-card { flex-direction: column; padding: 14px 12px; gap: 8px; }
  .wcu-text-title { font-size: 0.8rem; }
  .wcu-text-desc { font-size: 0.7rem; }
}
`;

export default function WhyChooseUs() {
  return (
    <section className="wcu-section">
      <style>{css}</style>
      <div className="wcu-inner">
        <div className="wcu-eyebrow">Why Choose OvikaLiving</div>
        <h2 className="wcu-title">Comfort, Convenience &amp; Confidence</h2>

        <div className="wcu-grid">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="wcu-card">
                <div className="wcu-icon"><Icon size={20} /></div>
                <div>
                  <p className="wcu-text-title">{f.title}</p>
                  <p className="wcu-text-desc">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
