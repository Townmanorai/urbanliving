
import React, { useEffect, useState } from "react";
import "./Home4.css";
import { useNavigate } from "react-router";

const Home4 = () => {
  const navigate = useNavigate();

  const property1 = {
    id: 77,
    img: "/tmluxe1.jpeg",
    city: "Greater Noida Knowledge Park 3",
    title: "OvikaLiving Signature- 1",
    text: "Experience refined urban living in this fully furnished premium space. It features a comfortable living area, private balcony, and a fully loaded kitchen—perfect for families and professionals seeking a homelike stay with seamless self check-in.",
    rating: "⭐ 4.7 (120 reviews)",
    price: "₹4,200 / night",
    btn: "View Property"
  };

  const property2 = {
    id: 78,
    img: "/tmluxe22.jpg",
    city: "Noida Sector 137",
    title: "OvikaLiving Signature- 2",
    text: "A private luxury room in a premium apartment offering ultimate comfort and privacy. Features include an ensuite bathroom, private balcony, and modern amenities. Located just five minutes from the metro and major shopping hubs.",
    rating: "⭐ 4.9 (85 reviews)",
    price: "₹2,400 / night",
    btn: "View Property"
  };

  // TM Luxe 3 — now ID 79 from ovika API
  const property3 = {
    id: 79,
    img: "https://s3.ap-south-1.amazonaws.com/townamnor.ai/tm-luxe-3/photos/WhatsApp%20Image%202026-02-25%20at%2011.39.39%20AM%20%281%29-1772109906818-19581457.jpeg",
    city: "Greater Noida, Sector 27 — Godrej Golf Links",
    title: "OvikaLiving Signature- 3",
    text: "Enjoy super-luxury living in this 710 sq. ft. studio with stunning golf course views. Features a fitted kitchen, dining counter, and elegant furnishings. Perfect for those seeking premium comfort with independent self check-in.",
    rating: "⭐ 4.8 (43 reviews)",
    price: "₹4,000 / night",
    btn: "View Property"
  };

  const defaultProperties = [property1, property2, property3];

  const [properties, setProperties] = useState(defaultProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("https://www.townmanor.ai/api/ovika/properties");
        if (!res.ok) throw new Error("Failed to fetch properties");
        const json = await res.json();
        const info = json.data || json;

        let fetchedProps = [];
        if (Array.isArray(info)) fetchedProps = info;
        else if (info?.properties && Array.isArray(info.properties))
          fetchedProps = info.properties;

        if (fetchedProps.length === 0) {
          setProperties(defaultProperties);
          return;
        }

        // Update default properties with dynamic data from API
        const updatedDefaults = defaultProperties.map(defProp => {
          const apiMatch = fetchedProps.find(p => (p.id ?? p.ID) === defProp.id);
          if (apiMatch) {
            const nightlyPrice = apiMatch.price ?? apiMatch.PRICE ?? apiMatch.base_rate ?? apiMatch.BASE_RATE;
            return {
              ...defProp,
              price: nightlyPrice ? `₹${parseFloat(nightlyPrice).toLocaleString("en-IN")} / night` : defProp.price,
            };
          }
          return defProp;
        });

        // Only show the three featured Signature stays
        setProperties(updatedDefaults);
      } catch (err) {
        console.error("❌ Error fetching properties:", err);
        setError("Unable to load properties.");
        setProperties(defaultProperties);
      }
    };

    fetchProperties();
  }, []);


  return (
    <div className="featured-container">
      <h2 className="featured-heading">
        Featured <span className="highlight">OvikaLiving Signature</span> Stays
      </h2>

      <div className="featured-card-container">
        {properties.map((item, index) => (
          <div
            key={index}
            className="featured-card"
            onClick={() =>
              item.btn !== "Coming Soon" &&
              navigate(`/tmluxespecific/${item.id}`, {
                state: { propertyId: item.id },
              })
            }
            style={{
              cursor: item.btn !== "Coming Soon" ? "pointer" : "default",
            }}
          >
            <div style={{ position: 'relative' }}>
              <img src={item.img} alt={item.title} className="featured-img" />
              {item.title?.toLowerCase().includes('signature') && (
                <img 
                  src="/ovikaver.png" 
                  alt="Verified" 
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 'clamp(55px, 15vw, 75px)',
                    height: 'auto',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    pointerEvents: 'none',
                    zIndex: 10,
                    borderRadius: '4px'
                  }}
                />
              )}
            </div>
            <div className="featured-content">
              <h3 className="featured-title">{item.title}</h3>
              <p className="featured-text">{item.text}</p>
              <div className="featured-bottom">
                <p className="featured-rating">{item.rating}</p>
                <h4 className="featured-price">{item.price}</h4>
                <button className="featured-btn">{item.btn}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home4;