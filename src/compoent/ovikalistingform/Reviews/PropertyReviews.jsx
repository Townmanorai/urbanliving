import React, { useEffect, useState } from "react";
import "./PropertyReviews.css";

const API_BASE = "https://townmanor.ai/api/feedback";

/* ── Avatar background colors ── */
const AVATAR_COLORS = [
  "#8b0000", "#166534", "#1d4ed8", "#7c3aed",
  "#b45309", "#0f766e", "#be185d", "#374151",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ── Helpers ── */
const avg = (reviews, field) => {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + (Number(r[field]) || 0), 0) / reviews.length;
};

const overallAvg = (reviews) =>
  avg(reviews, "overall_experience");

const ratingLabel = (score) => {
  if (score >= 4.7) return "FABULOUS";
  if (score >= 4.3) return "VERY GOOD";
  if (score >= 3.7) return "GOOD";
  if (score >= 3.0) return "AVERAGE";
  return "BELOW AVERAGE";
};

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const CATEGORIES = [
  { key: "cleanliness",        label: "Cleanliness" },
  { key: "location",           label: "Location" },
  { key: "value_for_money",    label: "Value for Money" },
  { key: "amenities",          label: "Amenities" },
  { key: "staff_behavior",     label: "Staff / Owner" },
  { key: "overall_experience", label: "Overall" },
];

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function PropertyReviews({ propertyId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}?property_id=${propertyId}&status=approved&limit=100`
        );
        const data = await res.json();
        const list =
          data?.feedbacks || data?.reviews || data?.data || data || [];
        const approved = Array.isArray(list)
          ? list.filter(r => !r.review_status || r.review_status === 'approved')
          : [];
        setReviews(approved);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [propertyId]);

  if (loading) return <div className="pr-loading">Loading reviews...</div>;

  const totalCount = reviews.length;
  const score = overallAvg(reviews);
  const scoreDisplay = totalCount ? score.toFixed(1) : "—";

  /* star distribution */
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => Math.round(r.overall_experience) === s).length,
    pct: totalCount
      ? Math.round(
          (reviews.filter((r) => Math.round(r.overall_experience) === s).length /
            totalCount) *
            100
        )
      : 0,
  }));

  const displayed = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="pr-wrapper">
      {/* ── Heading ── */}
      <h3 className="pr-heading">
        Ratings &amp; Reviews
      </h3>

      {/* ── Summary Row ── */}
      <div className="pr-summary">
        <div className="pr-score-box">
          {totalCount > 0 ? (
            <>
              <div className="pr-score-number">{scoreDisplay}<span className="pr-score-star">★</span></div>
              <div className="pr-score-label">{ratingLabel(score)}</div>
              <div className="pr-score-count">{totalCount} ratings</div>
            </>
          ) : (
            <>
              <div className="pr-score-number" style={{ fontSize: 22 }}>★★★★★</div>
              <div className="pr-score-label">NEW</div>
              <div className="pr-score-count">Be first to rate</div>
            </>
          )}
        </div>
        <div className="pr-bars">
          {starCounts.map(({ star, pct }) => (
            <div className="pr-bar-row" key={star}>
              <span className="pr-bar-label">{star}</span>
              <span className="pr-bar-star">★</span>
              <div className="pr-bar-track">
                <div className="pr-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="pr-bar-pct">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pr-inner-divider" />

      {/* ── Review Cards ── */}
      {totalCount === 0 ? (
        <div className="pr-empty" style={{ textAlign: 'left', padding: '8px 0 32px', color: '#94a3b8' }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#374151', marginBottom: 6 }}>No guest reviews yet</p>
          <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 420 }}>
            This property hasn't received any reviews yet. Be among the first to stay and share your experience.
          </p>
        </div>
      ) : (
        <>
          <div className="pr-review-list">
            {displayed.map((r) => {
              const initials = (r.username || "U")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2);
              const starVal = Math.round(r.overall_experience) || 5;
              return (
                <div className="pr-review-card" key={r.id || r._id}>
                  <div className="pr-review-header">
                    <div className="pr-reviewer">
                      <div
                        className="pr-avatar"
                        style={{ background: avatarColor(r.username) }}
                      >
                        {initials}
                      </div>
                      <div className="pr-reviewer-info">
                        <span className="pr-reviewer-name">{r.username}</span>
                        <span className="pr-reviewer-date">
                          {formatDate(r.created_at)}
                        </span>
                      </div>
                    </div>
                    <span className={`pr-star-badge star-${starVal}`}>
                      {starVal} ★
                    </span>
                  </div>
                  {r.remarks && (
                    <p className="pr-review-text">{r.remarks}</p>
                  )}
                </div>
              );
            })}
          </div>

          {reviews.length > 3 && (
            <div className="pr-see-all">
              <button
                className="pr-see-all-btn"
                onClick={() => setShowAll((p) => !p)}
              >
                {showAll
                  ? "Show less reviews"
                  : `See all ${totalCount} reviews`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
