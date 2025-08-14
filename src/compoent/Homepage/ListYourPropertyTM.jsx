import React from "react";
import "./ListYourPropertyTM.css";
import { MdBedroomParent, MdOutlineLocationCity } from "react-icons/md";
import { PiCityLight } from "react-icons/pi";
import { FaTreeCity } from "react-icons/fa6";

const ListYourPropertyTM = () => {
  return (
    <div className="tm-list-container">
      <h1 className="tm-list-title">List Your Property with TM</h1>

      <div className="tm-list-section">
        <div>
          <div className="tm-list-question">What type of place will you list ?</div>
          <a href="#" className="tm-list-link">Apartment</a>
          <div className="tm-list-desc">Share your apartment with Townmanor</div>
          <a href="#" className="tm-list-sub-link">Earn money by renting out your apartment to guests</a>
          <br></br>
          <button className="tm-list-btn">List your Apartment</button>
        </div>

        <div className="tm-list-img-wrap">
          <img src="/image 92.png" alt="Apartment" className="tm-list-img" />
        </div>
      </div>
      <div className="tm-list-section">
        <div className="tm-list-img-wrap tm-list-img-wrap-2">
          <img src="/image 89.png" alt="PG" className="tm-list-img" />
        </div>
        <div>
          <div className="tm-list-question">What type of place will you list ?</div>
        <a href="#" className="tm-list-link">Luxury Apartment</a>
        <div className="tm-list-desc">Share your apartment with Townmanor</div>
        <a href="#" className="tm-list-sub-link">Provide Your lavish apartment for Luxury Stays</a>
        <br></br>
        <button className="tm-list-btn">List your Apartment</button>
        </div>
      </div>

      <div className="tm-list-section">
        <div>
        <div className="tm-list-question">What type of place will you list ?</div>
        <a href="#" className="tm-list-link">Luxury Apartment</a>
        <div className="tm-list-desc">Share your apartment with Townmanor</div>
        <a href="#" className="tm-list-sub-link">Provide Your lavish apartment for Luxury Stays</a>
        <br></br>
        <button className="tm-list-btn">List your Apartment</button>
         </div>
      <div className="tm-list-img-wrap">
        <img src="/Luxe.png" alt="Luxury" className="tm-list-img" />
      </div>
      </div>
      <div className="tm-list-footer">
        <div className="tm-list-footer-item">
          <span className="tm-list-footer-icon"><FaTreeCity size={50} color="#C5393A" /></span>
          <span className="tm-list-footer-text">15+ Cities</span>
        </div>
        <div className="tm-list-footer-item">
          <span className="tm-list-footer-icon"><PiCityLight size={50}  color="#C5393A" /></span>
          <span className="tm-list-footer-text">450+ Residence</span>
        </div>
        <div className="tm-list-footer-item">
          <span className="tm-list-footer-icon"><MdBedroomParent size={50} color="#C5393A" /></span>
          <span className="tm-list-footer-text">40000+ Rooms</span>
        </div>
      </div>
    </div>
  );
};

export default ListYourPropertyTM;
