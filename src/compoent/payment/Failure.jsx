import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import './Failure.css'

function Failure() {
  const navigate = useNavigate();

  useEffect(() => {
    // Read pending purchase BEFORE clearing so we can email the customer
    try {
      const raw = localStorage.getItem("pending_leads_purchase");
      if (raw) {
        const pending = JSON.parse(raw);
        if (pending?.buyerEmail) {
          fetch("https://townmanor.ai/api/lead-invoices/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type:     "incomplete",
              to_email: pending.buyerEmail,
              to_name:  pending.buyerName || "there",
              plan:     pending.plan,
              amount:   pending.totalAmount,
            }),
          }).catch(() => {});
        }
      }
    } catch (_) {}
    localStorage.removeItem("pending_leads_purchase");
  }, []);

  return (
    <>
     <Helmet>
       <title>Payment Failed | OvikaLiving – Try Again</title>
       <meta name="description" content="Your payment could not be processed. Please try again to book your PG, co-living space or rental stay with OvikaLiving in Noida & Greater Noida." />
       <meta name="keywords" content="payment failed ovikaliving, booking failed noida, retry payment pg noida, ovika payment error" />
       <meta name="robots" content="noindex, nofollow" />
     </Helmet>
     <main className="failure-page" role="main" aria-label="Failure notification">
      <section className="failure-card" role="alert" aria-live="assertive">
        <div className="icon-ring" aria-hidden="true">
          <div className="icon-circle">
            <svg
              className="failure-icon"
              width="70"
              height="70"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm3.54 13.46a1 1 0 0 1-1.41 1.41L12 14.83l-2.12 2.04a1 1 0 0 1-1.41-1.41L10.59 13l-2.12-2.12a1 1 0 1 1 1.41-1.41L12 11.59l2.12-2.12a1 1 0 0 1 1.41 1.41L13.41 13l2.13 2.46Z" />
            </svg>
          </div>
        </div>

        <h1 className="title">Payment Declined</h1>
        <p className="message">
          Your payment could not be processed. Please try again — your money has not been deducted.
        </p>

        <div className="actions">
          <button
            className="btn btn-primary"
            aria-label="Try again"
            onClick={() => navigate("/buy-leads")}
          >
            Try Again
          </button>
          <button
            className="btn btn-secondary"
            aria-label="Go back to home"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </section>
    </main>
    </>
  )
}

export default Failure