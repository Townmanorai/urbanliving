import React from 'react'
import './Failure.css'
function Failure() {
  return (
    <>
     <main className="failure-page" role="main" aria-label="Failure notification">
      <section className="failure-card" role="alert" aria-live="assertive">
        {/* Gradient ring with white inner circle */}
        <div className="icon-ring" aria-hidden="true">
          <div className="icon-circle">
            {/* Inline SVG for Playground. In your app, replace with FaTimesCircle from react-icons. */}
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

        <h1 className="title">Something went wrong</h1>
        <p className="message">
          We couldn't complete your request. Please try again, or return to the home page.
        </p>

        <div className="actions">
          <button className="btn btn-primary" aria-label="Try again">
            Try Again
          </button>
          <button className="btn btn-secondary" aria-label="Go back to home">
            Back to Home
          </button>
        </div>
      </section>

     
    </main>
    </>
  )
}

export default Failure