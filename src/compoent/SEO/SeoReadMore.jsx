import React, { useState, useRef } from 'react';

const css = `
.seo-rm-wrap { position: relative; }
.seo-rm-collapsed { max-height: 420px; overflow: hidden; }
.seo-rm-collapsed::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 90px;
  background: linear-gradient(180deg, rgba(253,249,243,0) 0%, #fdf9f3 85%);
  pointer-events: none;
}
.seo-rm-btn {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 18px;
  background: #fff; border: 1px solid #e8dcc8; color: #8a5a1f;
  font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 700;
  padding: 9px 18px; border-radius: 24px; cursor: pointer; transition: all 0.2s ease;
}
.seo-rm-btn:hover { background: #c2772b; border-color: #c2772b; color: #fff; }
.seo-rm-btn svg { transition: transform 0.2s ease; }
.seo-rm-btn.open svg { transform: rotate(180deg); }
`;

/* Wraps long SEO body copy so the page shows a short preview with a
   "Read more" toggle instead of dumping the full block on load. The full
   text stays in the DOM either way, so it's still crawlable. */
const SeoReadMore = ({ children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <div className="seo-rm-wrap" ref={ref}>
      <style>{css}</style>
      <div className={open ? '' : 'seo-rm-collapsed'}>
        {children}
      </div>
      <button
        type="button"
        className={`seo-rm-btn${open ? ' open' : ''}`}
        onClick={() => {
          const wasOpen = open;
          setOpen(!open);
          if (wasOpen && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      >
        {open ? 'Show less' : 'Read more'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default SeoReadMore;
