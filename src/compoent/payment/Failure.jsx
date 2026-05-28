import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

function Failure() {
  const navigate = useNavigate();

  const propertyId = localStorage.getItem('property_id');
  const isLeads = !!localStorage.getItem('pending_leads_purchase');

  useEffect(() => {
    // Leads failure: notify via email then clear
    if (isLeads) {
      try {
        const raw = localStorage.getItem('pending_leads_purchase');
        const pending = raw ? JSON.parse(raw) : null;
        if (pending?.buyerEmail) {
          fetch('https://townmanor.ai/api/lead-invoices/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'incomplete',
              to_email: pending.buyerEmail,
              to_name: pending.buyerName || 'there',
              plan: pending.plan,
              amount: pending.totalAmount,
            }),
          }).catch(() => {});
        }
      } catch (_) {}
      localStorage.removeItem('pending_leads_purchase');
    }
  }, [isLeads]);

  const handleTryAgain = () => {
    if (isLeads) {
      navigate('/buy-leads');
    } else if (propertyId) {
      // Flag so property page can push a buffer history entry (prevents back → PayU)
      sessionStorage.setItem('ovika_from_failure', propertyId);
      // replace:true removes /failure from history stack
      navigate(`/property/${propertyId}`, { replace: true });
    } else {
      navigate('/properties');
    }
  };

  return (
    <>
      <Helmet>
        <title>Transaction Declined | OvikaLiving</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Full-screen overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}>
        {/* Popup card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '40px 36px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          animation: 'fadeInUp 0.35s ease',
        }}>
          {/* Declined icon */}
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.54 13.46a1 1 0 0 1-1.41 1.41L12 14.83l-2.13 2.04a1 1 0 0 1-1.41-1.41L10.59 13 8.46 10.88a1 1 0 1 1 1.41-1.41L12 11.59l2.12-2.12a1 1 0 0 1 1.41 1.41L13.41 13l2.13 2.46Z"/>
            </svg>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
            Transaction Declined
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '8px', lineHeight: 1.55 }}>
            Your payment could not be completed.{' '}
            <strong style={{ color: '#16a34a' }}>No money has been deducted</strong> from your account.
          </p>
          <p style={{ color: '#999', fontSize: '0.82rem', marginBottom: '20px' }}>
            This can happen due to a declined card, timeout, or if you pressed back. Please try again.
          </p>

          <div style={{ height: '1px', background: '#f0f0f0', margin: '0 0 20px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleTryAgain}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #b62305, #8b0000)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(139,0,0,0.3)',
              }}
            >
              🔄 Try Again
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                padding: '14px',
                background: '#f8fafc',
                color: '#333',
                border: '1.5px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🏠 Go to Home
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default Failure
