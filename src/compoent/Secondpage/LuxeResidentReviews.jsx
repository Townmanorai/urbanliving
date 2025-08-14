import React from 'react'
import './tmxluxe-resident.css'
import { AiOutlineLike } from 'react-icons/ai';
import { FaRegComment, FaRegStar, FaStar, FaStarAndCrescent } from 'react-icons/fa6';
function LuxeResidentReviews() {
  const Star = ({ filled = true }) => (
    <span className={`tmxluxe-resi-star ${filled ? "is-filled" : ""}`}>★</span>
  );

  const LikeIcon = () => (
    <svg className="tmxluxe-resi-ic" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 21h3V9H2v12zm19-11h-6.31l1-4.52.02-.23a1.75 1.75 0 0 0-3.35-.77L9 10.5V20h9a2 2 0 0 0 2-2l1-6a2 2 0 0 0-2-2z" fill="currentColor"/>
    </svg>
  );

  const CommentIcon = () => (
    <svg className="tmxluxe-resi-ic" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 6h-18a1 1 0 0 0-1 1v12l4-3h15a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1z" fill="currentColor"/>
    </svg>
  );

  return (
    <section className="tmxluxe-resi">
      <div className="tmxluxe-resi-container">
        <h2 className="tmxluxe-resi-title">What Our Resident Says</h2>

        <div className="tmxluxe-resi-box">
          {/* Review 1 */}
          <article className="tmxluxe-resi-item">
            <img
              className="tmxluxe-resi-avatar"
              src="https://placehold.co/64x64/png"
              alt="avatar"
            />
            <div className="tmxluxe-resi-content">
              <div className="tmxluxe-resi-row">
                <h3 className="tmxluxe-resi-name">Roshan Mishra</h3>
                <span className="tmxluxe-resi-date">April 2025</span>
              </div>

              <div className="tmxluxe-resi-stars">
               <FaStar size={20} color='red' /><FaStar size={20} color='red' /> <FaStar size={20} color='red' /> <FaStar size={20} color='red' /> <FaRegStar color='grey' size={20} />
              </div>

              <p className="tmxluxe-resi-text">
                “From the moment I walked into TM Luxe, I felt like I had stepped into a magazine spread. The interiors were stunning, the linens felt like clouds, and the staff anticipated my needs before I even voiced them. I came for a weekend getaway and left feeling completely renewed.”
              </p>

              <div className="tmxluxe-resi-actions">
                <div className="tmxluxe-resi-act">
                  <AiOutlineLike size={20} /> <span>25</span>
                </div>
                <div className="tmxluxe-resi-act">
                 <FaRegComment size={20} /> <span>2</span>
                </div>
              </div>
            </div>
          </article>

          {/* Review 2 */}
          <article className="tmxluxe-resi-item">
            <img
              className="tmxluxe-resi-avatar"
              src="https://placehold.co/64x64/png"
              alt="avatar"
            />
            <div className="tmxluxe-resi-content">
              <div className="tmxluxe-resi-row">
                <h3 className="tmxluxe-resi-name">Riya Malhotra</h3>
                <span className="tmxluxe-resi-date">June 2025</span>
              </div>

              <div className="tmxluxe-resi-stars">
                {/* <FaStarAndCrescent size={20} color='green' /><FaStarAndCrescent size={20} color='green' /><FaStarAndCrescent size={20} color='green' /><FaStarAndCrescent size={20} color='green' /><FaStarAndCrescent size={20} color='green' /> */}
                 <FaStar size={20} color='red' /><FaStar size={20} color='red' /> <FaStar size={20} color='red' /> <FaStar size={20} color='red' /> <FaRegStar color='grey' size={20} />
              </div>

              <p className="tmxluxe-resi-text">
                “I've stayed in luxury hotels before, but TM Luxe has a soul. The private balcony overlooked the city skyline, the aroma of fresh flowers welcomed me daily, and every meal was an experience in itself. It wasn’t just a stay—it was a story I’ll tell for years.”
              </p>

              <div className="tmxluxe-resi-actions">
              <div className="tmxluxe-resi-act">
                  <AiOutlineLike size={20} /> <span>25</span>
                </div>
                <div className="tmxluxe-resi-act">
                 <FaRegComment size={20} /> <span>2</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

// export default LuxeResidentReviews;

export default LuxeResidentReviews