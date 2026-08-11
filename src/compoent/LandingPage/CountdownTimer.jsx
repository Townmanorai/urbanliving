import React, { useEffect, useState } from 'react';

function getRemaining(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hrs, mins, secs };
}

const pad = (n) => String(n).padStart(2, '0');

export default function CountdownTimer({ target, dark = false }) {
  const [t, setT] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setT(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: 'Days', value: t.days },
    { label: 'Hrs', value: t.hrs },
    { label: 'Mins', value: t.mins },
    { label: 'Secs', value: t.secs },
  ];

  return (
    <div className={`lp-countdown ${dark ? 'lp-countdown--dark' : ''}`}>
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="lp-countdown-box">
            <span className="lp-countdown-num">{pad(u.value)}</span>
            <span className="lp-countdown-label">{u.label}</span>
          </div>
          {i < units.length - 1 && <span className="lp-countdown-colon">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
