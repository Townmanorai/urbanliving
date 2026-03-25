
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./Home2.css";

// const Home2 = () => {
//   const navigate = useNavigate();

//   const cards = [
//      {
//       img: "/newnew.jpeg",
//       title: "Luxury Living Spaces",
//       text:"Ovika Signature offers premium fully furnished apartments and suites designed for refined urban living. Enjoy stylish interiors, a kitchenette, and the freedom of seamless self check-in and check-out. Perfect for families, executives, and business travelers seeking privacy, comfort, and a luxurious stay in prime locations.",
//       // text: "Ovika Luxe offers high-end, fully serviced apartments for those who value elegance, comfort, and privacy. With sophisticated interiors, modern amenities, and prime locations, Ovika Luxe is crafted for families, business travelers, and individuals seeking a luxurious living experience.",
//       btn: "Know more",
//       link: "/tmluxe"
//     },
//     {
//       img: "/pglivingspace.jpeg",
//       title: "PG Living Spaces",
//       text:"Ovika PG helps you discover verified and trusted PG accommodations across Noida & Greater Noida. Our platform aggregates a wide range of comfortable and affordable PG options for students and working professionals. Browse listings, compare amenities, and choose the stay that suits your lifestyle - all in one place.",
//       // text: "Ovika Stay offers fully managed and affordable PG rentals tailored for students and working professionals. With clean, secure, and comfortable living spaces, we ensure a hassle-free stay that feels just like home – only better.",
//       btn: "View PGs",
//       link: "/properties?category=PG"
//     },
//     {
//       img: "/colivingspace.jpeg",
//       title: "Co- Living Spaces",
//       text:"Ovika Co-Living brings modern community-driven co-living spaces for young professionals and urban residents. perience shared living that blends comfort, flexibility, and connection in thoughtfully designed homes",
//       // text: "Ovika Hive brings together vibrant communities in thoughtfully designed shared spaces. Whether you’re a young professional, a remote worker, or a creative soul, our co-living homes offer the perfect blend of privacy, social connection, and flexibility – so you can live, work, and grow together.",
//       btn: "Coming Soon",
//       link: "/coliving-space"
//     },
   
//   ];

//   const handleButtonClick = (url) => {
//     navigate(url); // 👈 usage of useNavigate for client-side routing
//   };

//   return (
//     <div className="living-container">
//       <h2 className="living-heading">
//         Explore <span className="highlight">Living</span> Options
//       </h2>
//       <p className="living-subtext">
//         OvikaLiving offers a range of living options to suit your lifestyle from cosy PG
//         rentals to luxurious service apartments. <br /> Discover the perfect fit for you.
//       </p>
//       <div className="living-card-container">
//         {cards.map((card, index) => (
//           <div key={index} className="living-card">
//             <img src={card.img} alt={card.title} className="living-img" />
//             <div className="living-content">
//               <h3 className="living-title">{card.title}</h3>
//               <p className="living-text">{card.text}</p>
//               <button
//                 className="living-btn"
//                 onClick={() => handleButtonClick(card.link)}
                
//               >
//                 {card.btn} <span className="arrow-main-new">→</span>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home2;
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
        Explore <span className="highlight">Living</span> Options
      </h2>
      <p className="living-subtext">
        OvikaLiving offers a range of living options to suit your lifestyle from cosy PG
        rentals to luxurious service apartments. <br /> Discover the perfect fit for you.
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