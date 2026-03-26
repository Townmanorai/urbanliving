// import React from "react";
// import "./Home9.css";

// const accommodations = [
//   {
//     id: 1,
//     title: "PGs",
//     description: "Budget-friendly rooms, perfect for solo travelers.",
//     image: "./pg3.png", // src yahan daalo
//     alt: "PG Room",
//   },
//   {
//     id: 2,
//     title: "Apartments & Villas",
//     description: "Fully furnished, private spaces for families & groups.",
//     image: "./apartment1.jpeg", // src yahan daalo
//     alt: "Apartment Living Room",
//   },
//   {
//     id: 3,
//     title: "Signature Stays",
//     description: "Luxury homes with premium amenities. Designed for comfort and convenience.",
//     image: "./signature1.png", // src yahan daalo
//     alt: "Luxury Suite",
//   },
// ];

// const Home9 = () => {
//   return (
//     <section className="nightly-stays">
//       <div className="nightly-stays__header">
//         <h1 className="nightly-stays__title">
//           Nightly <span className="nightly-stays__title--highlight">Stays</span>
//         </h1>
//         <p className="nightly-stays__subtitle">
//           Choose your type of accommodation for short Visits,
//           <br />
//           business trips, or travel.
//         </p>
//       </div>

//       <div className="nightly-stays__grid">
//         {accommodations.map((item) => (
//           <div className="nightly-stays__card" key={item.id}>
//             <div className="nightly-stays__card-top">
//               <h2 className="nightly-stays__card-title">{item.title}</h2>
//               <p className="nightly-stays__card-desc">{item.description}</p>
//             </div>

//             <div className="nightly-stays__image-wrapper">
//               {item.image ? (
//                 <img
//                   src={item.image}
//                   alt={item.alt}
//                   className="nightly-stays__image"
//                 />
//               ) : (
//                 <div className="nightly-stays__image-placeholder">
//                   <span>{item.alt}</span>
//                 </div>
//               )}
//             </div>

//             <div className="nightly-stays__card-bottom">
//               <h2 className="nightly-stays__card-title">{item.title}</h2>
//               <p className="nightly-stays__card-desc">{item.description}</p>
//               <button className="nightly-stays__btn">
//                 View All Listings <span className="nightly-stays__btn-arrow">→</span>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Home9;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home9.css";

const accommodations = [
  {
    id: 1,
    title: "PGs",
    description: "Budget-friendly rooms, perfect for solo travelers.",
    image: "./pg3.png",
    alt: "PG Room",
    // /properties?rentalType=short&category=PG
    filterPath: "/properties?rentalType=short&category=PG",
  },
  {
    id: 2,
    title: "Apartments & Villas ",
    description: "Fully furnished, private spaces for families & groups. (Premium and Economy Stays)",
    image: "./apartment1.jpeg",
    alt: "Apartment Living Room",
    // Economy + Premium both, nightly only
    // PropertyListPage CATEGORIES: Economy Stay & Premium Stay — no PG
    // We pass rentalType=short, no category filter = shows all non-PG nightly
    filterPath: "/properties?rentalType=short&category=Economy Stay",
  },
  {
    id: 3,
    title: "Signature Stays",
    description: "Luxury homes with premium amenities. Designed for comfort and convenience.",
    image: "./signature1.png",
    alt: "Luxury Suite",
    // Signature = Premium Stay category, nightly
    filterPath: "/properties?rentalType=short&category=Premium Stay",
  },
];

const Home9 = () => {
  const navigate = useNavigate();

  return (
    <section className="nightly-stays">
      <div className="nightly-stays__header">
        <h1 className="nightly-stays__title">
          Nightly <span className="nightly-stays__title--highlight">Stays</span>
        </h1>
        <p className="nightly-stays__subtitle">
          Choose your type of accommodation for short Visits,
          <br />
          business trips, or travel.
        </p>
      </div>

      <div className="nightly-stays__grid">
        {accommodations.map((item) => (
          <div className="nightly-stays__card" key={item.id}>
            <div className="nightly-stays__card-top">
              <h2 className="nightly-stays__card-title">{item.title}</h2>
              {/* <p className="nightly-stays__card-desc">{item.description}</p> */}
            </div>

            <div className="nightly-stays__image-wrapper">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.alt}
                  className="nightly-stays__image"
                />
              ) : (
                <div className="nightly-stays__image-placeholder">
                  <span>{item.alt}</span>
                </div>
              )}
            </div>

            <div className="nightly-stays__card-bottom">
              {/* <h2 className="nightly-stays__card-title">{item.title}</h2> */}
              <p className="nightly-stays__card-desc">{item.description}</p>
              <button
                className="nightly-stays__btn"
                onClick={() => navigate(item.filterPath)}
              >
                View All Listings <span className="nightly-stays__btn-arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home9;