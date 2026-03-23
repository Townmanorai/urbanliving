
// import React, { useEffect, useState } from "react";
// import "./Home4.css";
// import { useNavigate } from "react-router";

// const Home4 = () => {
//   const navigate = useNavigate();

//   // Define each property separately for better control
//   const property1 = {
//     id: 2,
//     img: "/tmluxe1.jpeg",
//     city: "Noida Sector 137",
//     title: "TM Luxe - 1",
//     text: "Experience refined urban living at TM Luxe 1, where thoughtfully designed spaces combine comfort, style, and convenience. Ideal for business executives, professionals, families, and tourists, the accommodation is fully furnished and features a comfortable living area with sofa, Google TV, air-conditioning, and a private balcony. A fully loaded kitchen and laundry provisions with washing machine, iron, and ironing board ensure a homelike experience. Guests also enjoy the ease of self check-in and check-out for a seamless and independent stay.",
//     rating: "⭐ 4.7 (120 reviews)",
//     price: "₹4,200 / night",
//     btn: "View Property"
//   };

//   const property2 = {
//     id: 1,
//     img: "/tmluxe22.jpg",
//     city: "Greater Noida Knowledge Park",
//     title: "TM Luxe - 2",
//     text: "TM Luxe 2 is a private luxury room within a premium apartment, offering comfort and privacy for modern travelers. The room features an attached toilet and a private balcony, providing a relaxing personal space. It is equipped with an air conditioner, sofa, Google TV, and a coffeemaker for added convenience. The metro station is just a five-minute walk away, and popular shopping and entertainment centers are located in close vicinity.",
//     rating: "⭐ 4.9 (85 reviews)",
//     price: "₹2,400 / night",
//     btn: "View Property"
//   };

//   const property3 = {
//     id: 3,
//     img: "/tm3image.jpeg",
//     city: "Noida Extension",
//     title: "TM Luxe - 3",
//     text: "TM Luxe 3 is a super-luxury studio overlooking the golf courses, stadium, and Jaypee Greens resorts. Spanning 710 sq. ft., the studio features a fitted kitchen, dining counter with high chairs, a modern toilet, and a private balcony. The space is elegantly furnished with sofas, Google TV, Wi-Fi, and other contemporary comforts. Guests can also enjoy the convenience of self check-in and check-out facilities.",
//     rating: "⭐ 4.8 (43 reviews)",
//     price: "₹4,000 / night",
//     btn: "View Property"
//   };

//   // Default properties that will always show
//   const defaultProperties = [property1, property2, property3];

//   const [properties, setProperties] = useState(defaultProperties); // Show default properties first
//   const [loading, setLoading] = useState(false); // no delay
//   const [error, setError] = useState("");

//   // ✅ 2. Try fetching API but always keep dummy visible
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const res = await fetch("https://townmanor.ai/api/properties/all");

//         if (!res.ok) throw new Error("Failed to fetch properties");
//         const data = await res.json();

//         let fetchedProps = [];
//         if (Array.isArray(data)) fetchedProps = data;
//         else if (data?.properties && Array.isArray(data.properties))
//           fetchedProps = data.properties;

//         if (fetchedProps.length === 0) {
//           console.warn("API empty, keeping dummy data");
//           setProperties(defaultProperties);
//           return;
//         }

//         const formatted = fetchedProps.map((prop) => {
//           const id = prop.id ?? prop.ID;
//           const name = prop.name ?? prop.NAME;
//           const imageArray =
//             Array.isArray(prop.images) && prop.images.length > 0
//               ? prop.images
//               : Array.isArray(prop.IMAGES)
//               ? prop.IMAGES
//               : [];
//           const imageSrc = imageArray[0] || "/p1.png";
//           const city = prop.city ?? prop.CITY ?? "Unknown Location";
//           const description =
//             prop.description ??
//             prop.DESCRIPTION ??
//             "Discover contemporary living with premium amenities.";
//           const rawPrice = prop.monthly_price ?? prop.MONTHLY_PRICE;
//           const priceText = rawPrice
//             ? `₹${parseFloat(rawPrice).toLocaleString("en-IN")} / Month`
//             : "Price on Request";

//           return {
//             id,
//             img: imageSrc,
//             city,
//             title: name,
//             text: description,
//             rating: "⭐ 4.8 (120 reviews)",
//             price: priceText,
//             btn: "View Property",
//           };
//         });

//         // Merge API properties with default properties, avoiding duplicates by ID
//         const mergedProperties = [...defaultProperties];
        
//         formatted.forEach(apiProp => {
//           // Only add if not already in default properties
//           if (!defaultProperties.some(p => p.id === apiProp.id)) {
//             mergedProperties.push(apiProp);
//           }
//         });
        
//         setProperties(mergedProperties);
//       } catch (err) {
//         console.error("❌ Error fetching properties:", err);
//         setError("Unable to load properties.");
//         setProperties(defaultProperties);
//       }
//     };

//     fetchProperties();
//   }, []);

//   return (
//     <div className="featured-container">
//       <h2 className="featured-heading">
//         Featured <span className="highlight">OvikaLiving</span> Stays
//       </h2>

//       <div className="featured-card-container">
//         {properties.map((item, index) => (
//           <div
//             key={index}
//             className="featured-card"
//             onClick={() =>
//               item.btn !== "Coming Soon" &&
//               navigate(`/tmluxespecific/${item.id}`, {
//                 state: { propertyId: item.id },
//               })
//             }
//             style={{
//               cursor: item.btn !== "Coming Soon" ? "pointer" : "default",
//             }}
//           >
//             <img src={item.img} alt={item.title} className="featured-img" />
//             <div className="featured-content">
//               {/* <p className="featured-city">{item.city}</p> */}
//               <h3 className="featured-title">{item.title}</h3>
//               <p className="featured-text">{item.text}</p>
//               <div className="featured-bottom">
//                 <p className="featured-rating">{item.rating}</p>
//                 <h4 className="featured-price">{item.price}</h4>
//                 <button className="featured-btn">{item.btn}</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home4;

import React, { useEffect, useState } from "react";
import "./Home4.css";
import { useNavigate } from "react-router";

const Home4 = () => {
  const navigate = useNavigate();

  const property1 = {
    id: 2,
    img: "/tmluxe1.jpeg",
    city: "Noida Sector 137",
    title: "OvikaLiving Signature- 1",
    text: "Experience refined urban living at OvikaLiving Signature 1, where thoughtfully designed spaces combine comfort, style, and convenience. Ideal for business executives, professionals, families, and tourists, the accommodation is fully furnished and features a comfortable living area with sofa, Google TV, air-conditioning, and a private balcony. A fully loaded kitchen and laundry provisions with washing machine, iron, and ironing board ensure a homelike experience. Guests also enjoy the ease of self check-in and check-out for a seamless and independent stay.",
    rating: "⭐ 4.7 (120 reviews)",
    price: "₹4,200 / night",
    btn: "View Property"
  };

  const property2 = {
    id: 1,
    img: "/tmluxe22.jpg",
    city: "Greater Noida Knowledge Park",
    title: "OvikaLiving Signature- 2",
    text: "OvikaLiving Signature 2 is a private luxury room within a premium apartment, offering comfort and privacy for modern travelers. The room features an attached toilet and a private balcony, providing a relaxing personal space. It is equipped with an air conditioner, sofa, Google TV, and a coffeemaker for added convenience. The metro station is just a five-minute walk away, and popular shopping and entertainment centers are located in close vicinity.",
    rating: "⭐ 4.9 (85 reviews)",
    price: "₹2,400 / night",
    btn: "View Property"
  };

  // TM Luxe 3 — id:287, data from ovika API JSON
  const property3 = {
    id: 287,
    img: "https://s3.ap-south-1.amazonaws.com/townamnor.ai/tm-luxe-3/photos/WhatsApp%20Image%202026-02-25%20at%2011.39.39%20AM%20%281%29-1772109906818-19581457.jpeg",
    city: "Greater Noida, Sector 27 — Godrej Golf Links",
    title: "OvikaLiving Signature- 3",
    text: "OvikaLiving Signature 3 is a super-luxury studio overlooking the golf courses, stadium, and Jaypee Greens resorts. Spanning 710 sq. ft., the studio features a fitted kitchen, dining counter with high chairs, a modern toilet, and a private balcony. The space is elegantly furnished with sofas, Google TV, Wi-Fi, and other contemporary comforts. Guests can also enjoy the convenience of self check-in and check-out facilities.",
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
        const res = await fetch("https://www.townmanor.ai/api/properties/all");
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();

        let fetchedProps = [];
        if (Array.isArray(data)) fetchedProps = data;
        else if (data?.properties && Array.isArray(data.properties))
          fetchedProps = data.properties;

        if (fetchedProps.length === 0) {
          setProperties(defaultProperties);
          return;
        }

        const formatted = fetchedProps.map((prop) => {
          const id = prop.id ?? prop.ID;
          const name = prop.name ?? prop.NAME;
          const imageArray =
            Array.isArray(prop.images) && prop.images.length > 0
              ? prop.images
              : Array.isArray(prop.IMAGES)
              ? prop.IMAGES
              : [];
          const imageSrc = imageArray[0] || "/p1.png";
          const city = prop.city ?? prop.CITY ?? "Unknown Location";
          const description =
            prop.description ??
            prop.DESCRIPTION ??
            "Discover contemporary living with premium amenities.";
          const rawPrice = prop.monthly_price ?? prop.MONTHLY_PRICE;
          const priceText = rawPrice
            ? `₹${parseFloat(rawPrice).toLocaleString("en-IN")} / Month`
            : "Price on Request";

          return {
            id,
            img: imageSrc,
            city,
            title: name,
            text: description,
            rating: "⭐ 4.8 (120 reviews)",
            price: priceText,
            btn: "View Property",
          };
        });

        // Sirf naye properties add karo — default 3 hamesha rahenge
        const mergedProperties = [...defaultProperties];
        formatted.forEach(apiProp => {
          if (!defaultProperties.some(p => p.id === apiProp.id)) {
            mergedProperties.push(apiProp);
          }
        });

        setProperties(mergedProperties);
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