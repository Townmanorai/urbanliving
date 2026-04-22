import React from "react";
import "./TMFeaturesMobile.css";
import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { navClick, auxNavClick } from '../../utils/navClick';

const comingsoon = ()=>{
  alert("this part is Coming Soon Stay updated with us")
}

const TMFeaturesMobile = () => {
  const navigate = useNavigate();
  return (
  <div className="tm-features-mobile">
    <h1 className="tm-features-mobile__title">TM Features</h1>
    <p className="tm-features-mobile__subtitle">
      Where luxury, comfort, and community come together.
    </p>
     {/* ===== TM Luxe (Image Left) ===== */}
     <section className="tm-section left">
       <div className="tm-section__label">
         <span className="tm-watermark">TM</span>
         <span className="tm-small">Luxe</span>
       </div>
       <div className="tm-section__image">
         <img src="image 87.png" alt="Luxe" />
       </div>
     </section>

    <div className="tm-section__content">
      <h3 className="tm-subtitle">
      Luxury <span className="highlight">crafted —</span>for modern living
      </h3>
      <p className="tm-desc">
        TM Luxe offers high-end, fully serviced apartments for those who value elegance, comfort, and privacy. 
        With sophisticated interiors, modern amenities, and prime locations, TM Luxe is crafted for families,
        business travelers, and individuals seeking a luxurious living experience.
      </p>
      <button className="tm-btn" onClick={(e) => navClick(e, '/tmluxe', navigate)} onAuxClick={(e) => auxNavClick(e, '/tmluxe')}>
        Know more <IoArrowForward className="arrow-icon" />
      </button>
    </div>
   

    {/* ===== TM Hive (Image Right) ===== */}
    <section className="tm-section right">
      <div className="tm-section__label">
        <span className="tm-watermark">TM</span>
        <span className="tm-small">Hive</span>
      </div>
      <div className="tm-section__image">
        <img src="image 91.png" alt="Hive" />
      </div>
    </section>

    <div className="tm-section__content">
      <h3 className="tm-subtitle">
        <span className="tm-subtitle-text">Live together, <span className="highlight">grow </span> together.</span>
      </h3>
      <p className="tm-desc">
        TM Hive brings together vibrant communities in thoughtfully designed shared spaces.
        Whether you're a young professional, a remote worker, or a creative soul, our co-living
        homes offer the perfect blend of privacy, social, and flexibility.
      </p>
      <button className="tm-btn" onClick={()=>{
    comingsoon();
  }}>
        Know more <IoArrowForward className="arrow-icon" />
      </button>
    </div>
 {/* ===== TM Stay (Image Left) ===== */}
 <section className="tm-section left">
      <div className="tm-section__label">
        <span className="tm-watermark">TM</span>
        <span className="tm-small">Stay</span>
      </div>
      <div className="tm-section__image">
        <img src="image 86.png" alt="Stay" />
      </div>
    </section>

    <div className="tm-section__content">
      <h3 className="tm-subtitle">
      Flexible <span className="highlight">stays,</span> seamless<span className="highlight"> comfort</span>
      </h3>
      <p className="tm-desc">
        TM Stay offers fully managed and affordable PG rentals tailored for students and working professionals. 
        With clean, secure, and comfortable living spaces, we ensure a hassle-free stay that feels just like home – only better.
      </p>
      <button className="tm-btn" onClick={()=>{
    comingsoon();
  }}>
        Know more <IoArrowForward className="arrow-icon" />
      </button>
    </div>
   
  </div>
  );
};

export default TMFeaturesMobile;