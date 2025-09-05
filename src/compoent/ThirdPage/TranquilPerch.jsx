import React from "react";
import "./TranquilPerch.css";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router";

export default function TranquilPerch({ title, pricePerNight, mainImage, sideImages = [],id }) {
  const navigate = useNavigate();
  const handleBookNow = () => {
    const user = localStorage.getItem("user");
  
    if (!user) {
      // If user not logged in, redirect to login page
      navigate("/login");
      return;
    }
  
    // If logged in, proceed with booking
    localStorage.setItem("property_id", id);
    navigate("/payment");
  };
  return (
    <>
    <div className="tranquil-perch-container">
      {/* Title + Actions */}
      <div className="tranquil-perch-header">
        <h2 className="tranquil-perch-title">
          {title || 'Property'}
        </h2>
        <div className="tranquil-perch-actions">
          <button className="tranquil-perch-action"><FaRegShareFromSquare size={20} className="luxeicon"/>Share</button>
          <button className="tranquil-perch-action"><FaRegHeart size={20} className="luxeicon"/>Save</button>
        </div>
      </div>

      {/* Images Section */}
      <div className="tranquil-perch-images">
        {/* Main Image */}
        <div className="tranquil-perch-main-img">
          <img
            src={mainImage || "/image 71.png"}
            alt="Main Room"
          />
          {/* <div className="tranquil-perch-price-tag">
            ₹2399 <span>For 1 night</span>
          </div> */}
        </div>

        {/* Side Images */}
        <div className="tranquil-perch-side-imgs">
          <img src={(sideImages[0]) || "/image 120.png"} alt="Living Room" />
          {/* <img src="/l3.png" alt="Window Seat" /> */}
          <div className="tranquil-perch-last-img">
            <img src={(sideImages[1]) || "/image 121.png"} alt="Workspace" />
            <div className="tranquil-perch-showmore"><MdOutlineContentCopy size={20} />Show more</div>
          </div>
        </div>
      </div>
    </div>
    <div class="property-price-section">
  <div class="price-details">
    <h2>{pricePerNight ? `₹${pricePerNight}` : '₹4,999'} <span>/ per night</span></h2>
    <p>Taxes included • Free cancellation available</p>
  </div>
  <div class="book-button">
    <button class="book-now-btn" onClick={()=>{
      handleBookNow()
    }}>Book Now</button>
  </div>
</div>

    </>
  );
}
