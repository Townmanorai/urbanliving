import React, { useState } from "react";
import "./FeedbackDrawer.css";

const QUESTIONS = [
  {
    key: "overall_experience",
    label: "Overall Experience",
    hint: "Aapka overall stay experience kaisa tha?",
  },
  {
    key: "cleanliness",
    label: "Cleanliness",
    hint: "Property kitni clean thi?",
  },
  {
    key: "location",
    label: "Location",
    hint: "Location convenient tha ya nahi?",
  },
  {
    key: "value_for_money",
    label: "Value for Money",
    hint: "Price ke hisaab se value kaisi thi?",
  },
  {
    key: "amenities",
    label: "Amenities",
    hint: "Facilities (WiFi, AC, food, etc.) kaise the?",
  },
  {
    key: "staff_behavior",
    label: "Staff / Owner Behavior",
    hint: "Owner ya staff ka behavior kaisa tha?",
  },
];

const API_FEEDBACK = "https://townmanor.ai/api/feedback";

function StarRow({ questionKey, value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="fb-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={[
            "fb-star",
            star <= value ? "filled" : "",
            hovered >= star && star > value ? "hovered" : "",
          ]
            .join(" ")
            .trim()}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(questionKey, star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function FeedbackDrawer({ booking, user, onClose }) {
  const initialRatings = Object.fromEntries(QUESTIONS.map((q) => [q.key, 0]));
  const [ratings, setRatings] = useState(initialRatings);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleRating = (key, val) => {
    setRatings((prev) => ({ ...prev, [key]: val }));
  };

  const allRated = QUESTIONS.every((q) => ratings[q.key] > 0);

  const handleSubmit = async () => {
    if (!allRated) {
      setError("Please rate all categories before submitting.");
      return;
    }
    setError("");
    setSubmitting(true);

    const payload = {
      booking_id: booking.id,
      property_id: booking.property_id,
      property_name: booking.property_name,
      username: user?.username || "",
      user_id: user?.user_id || user?.id || "",
      ...ratings,
      remarks: remarks.trim(),
    };

    try {
      const res = await fetch(API_FEEDBACK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok || data?.success) {
        setSubmitted(true);
      } else {
        throw new Error(data?.message || "Submission failed");
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-IN");
  };

  return (
    <>
      <div className="fb-overlay" onClick={onClose} />

      <div className="fb-drawer" role="dialog" aria-modal="true">
        {/* ── Header ── */}
        <div className="fb-header">
          <h3>Rate Your Stay</h3>
          <button className="fb-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* ── Booking Strip ── */}
        <div className="fb-booking-strip">
          <div className="fb-prop-name">{booking.property_name}</div>
          <div className="fb-prop-dates">
            Check-in: {formatDate(booking.start_date)} &nbsp;·&nbsp; Check-out:{" "}
            {formatDate(booking.end_date)}
          </div>
        </div>

        {submitted ? (
          /* ── Success ── */
          <div className="fb-success">
            <div className="fb-success-icon">🎉</div>
            <h3>Thank You!</h3>
            <p>
              Your feedback has been submitted successfully.
              <br />
              It helps us improve your future stays.
            </p>
          </div>
        ) : (
          <>
            {/* ── Body ── */}
            <div className="fb-body">
              {QUESTIONS.map((q, idx) => (
                <div key={q.key}>
                  <div className="fb-question">
                    <div className="fb-question-label">
                      {idx + 1}. {q.label}
                    </div>
                    <div className="fb-question-hint">{q.hint}</div>
                    <StarRow
                      questionKey={q.key}
                      value={ratings[q.key]}
                      onChange={handleRating}
                    />
                  </div>
                  {idx < QUESTIONS.length - 1 && <div className="fb-divider" />}
                </div>
              ))}

              {/* Remarks */}
              <div className="fb-divider" />
              <label className="fb-remarks-label">Additional Remarks (Optional)</label>
              <textarea
                className="fb-remarks-input"
                placeholder="Kuch aur share karna chahte hain? (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={500}
              />
              {error && <div className="fb-error-msg">{error}</div>}
            </div>

            {/* ── Footer ── */}
            <div className="fb-footer">
              <button
                className="fb-submit-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
