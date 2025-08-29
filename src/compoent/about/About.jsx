import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="tm-about-container">
      {/* Hero Section */}
      <section className="tm-about-hero">
        <div className="tm-about-text">
          <h1>About TownManor</h1>
          <p>
            At <span className="tm-highlight">TownManor</span>, we believe in more than just providing rooms—
            we provide <strong>comfort, community, and care</strong>. 
            Our mission is to make living effortless, inclusive, and warm.
          </p>
        </div>
        <div className="tm-about-image">
          <img src="/f3.png" alt="About TownManor" />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="tm-about-section">
        <h2>Our Vision</h2>
        <p>
          To redefine modern living by blending <strong>hospitality, flexibility, and inclusivity</strong>. 
          Whether you are a student, professional, or traveler, we make sure you feel at home.
        </p>
      </section>

      <section className="tm-about-section">
        <h2>Our Mission</h2>
        <p>
          We aim to create a <strong>judgement-free space</strong> where people can live, work, and grow together.
          Every stay at TownManor is built on <em>trust, comfort, and care</em>.
        </p>
      </section>

      {/* Features */}
      <section className="tm-about-features">
        <h2>Why Choose TownManor?</h2>
        <div className="tm-feature-grid">
          <div className="tm-feature-card">
            <h3>Flexible Living</h3>
            <p>From PG stays to luxury apartments, choose the living style that fits you best.</p>
          </div>
          <div className="tm-feature-card">
            <h3>Safe & Secure</h3>
            <p>We ensure a hassle-free stay with safety, privacy, and comfort as top priorities.</p>
          </div>
          <div className="tm-feature-card">
            <h3>Community Living</h3>
            <p>Our co-living spaces bring together people with shared interests and lifestyles.</p>
          </div>
          <div className="tm-feature-card">
            <h3>Premium Experience</h3>
            <p>Enjoy modern amenities, prime locations, and personalized hospitality.</p>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="tm-about-closing">
        <h2>Welcome to the TownManor Family</h2>
        <p>
          Wherever life takes you, <strong>TownManor</strong> is here to make your journey
          smoother, warmer, and unforgettable.
        </p>
      </section>
    </div>
  );
};

export default About;
