
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home2.css";

const Home2 = () => {
  const navigate = useNavigate();

  const handleButtonClick = (url) => {
    navigate(url);
  };

  return (
    <div className="living-container">
      <h2 className="living-heading">
        Explore <span className="highlight">Co- Living </span> Spaces
      </h2>
      <p className="living-subtext">
        {/* OvikaLiving offers a range of living options to suit your lifestyle from cosy PG */}
        {/* rentals to luxurious service apartments. <br /> Discover the perfect fit for you. */}
      </p>
      <div className="living-card-container">
        <div className="living-card">
          <img
            src="/colivingspace.jpeg"
            alt="Co-Living Spaces"
            className="living-img"
          />
          <div className="living-content">
            <h3 className="living-title">Co- Living Spaces</h3>
            <p className="living-text">
              {/* Ovika Co-Living brings modern community-driven co-living spaces for
              young professionals and urban residents. Experience shared living
              that blends comfort, flexibility, and connection in thoughtfully
              designed homes. */}
              Ovika Co-Living redefines modern urban living by offering thoughtfully designed, community-driven co-living spaces tailored for young professionals and dynamic city residents. With a perfect blend of comfort, flexibility, and convenience, Ovika creates an environment where individuals can thrive both personally and professionally.

Experience a new way of living where fully furnished homes, smart amenities, and vibrant shared spaces come together to foster meaningful connections and a strong sense of community. Whether you're seeking hassle-free living, networking opportunities, or a balanced lifestyle, Ovika Co-Living ensures a seamless and enriching living experience in the heart of the city.
            </p>
            <button
              className="living-btn"
              onClick={() => handleButtonClick("/coliving-space")}
            >
              Coming Soon <span className="arrow-main-new">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home2;