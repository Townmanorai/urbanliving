import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Sucess.css'

function Sucess() {
  const [bookingId, setBookingId] = useState(localStorage.getItem('bookingId') || 6)
  const [confirmation, setConfirmation] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const patchBookingStatus = async () => {
      try {
        const id = bookingId || 6
        const response = await fetch(`https://townmanor.ai/api/booking/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking_status: 'confirmed' }),
        })

        if (!response.ok) {
          throw new Error('Failed to update booking status')
        }

        // Show exactly the expected response shape
        setConfirmation({ booking_status: 'confirmed' })

        // Redirect to dashboard after successful update
        navigate('/dashboard')
      } catch (error) {
        console.error('Update booking status error:', error)
      }
    }
    patchBookingStatus()
  }, [bookingId])

  return (
    <>
      <main className="success-page" role="main" aria-label="Success confirmation">
        <section className="success-card" role="status" aria-live="polite">
          {/* Gradient ring with white inner circle */}
          <div className="icon-ring" aria-hidden="true">
            <div className="icon-circle">
              {/* Inline SVG used here for Playground preview. In your app, replace with FaCheckCircle from react-icons. */}
              <svg
                className="success-icon"
                width="70"
                height="70"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1.003 14.2a1 1 0 0 1-1.414 0l-3.2-3.2a1 1 0 1 1 1.414-1.414l2.493 2.493 5.4-5.4a1 1 0 1 1 1.414 1.414l-6.1 6.107Z" />
              </svg>
            </div>
          </div>

          <h1 className="title">Success!</h1>
          <p className="message">
            Your action was completed successfully. You can continue or head back home.
          </p>

          {confirmation && (
            <div className="confirmation">
              <pre>{JSON.stringify(confirmation)}</pre>
            </div>
          )}

          <div className="actions">
            <button className="btn btn-primary" aria-label="Continue">
              Continue
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

export default Sucess