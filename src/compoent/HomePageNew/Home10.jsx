import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./Home10.css";
import { navClick, auxNavClick } from '../../utils/navClick';

const accommodations = [
  {
    id: 1,
    title: "PGs",
    description: "Budget-friendly rooms, perfect for solo travelers & students.",
    image: "./pg2.jpeg",
    alt: "PG Room",
    filterPath: "/properties?rentalType=long&category=PG",
  },
  {
    id: 2,
    title: "Apartments & Villas",
    description: "Fully furnished, private homes for families & groups.(Premium and Economy Stays)",
    image: "./apartmnet2.png",
    alt: "Apartment Living Room",
    filterPath: "/properties?rentalType=long&category=Economy Stay",
  },
  {
    id: 3,
    title: "Signature Stays",
    description: "Luxury homes with premium amenities. Designed for comfort and convenience.",
    image: "./signature2.jpeg",
    alt: "Luxury Suite",
    filterPath: "/properties?rentalType=long&category=Premium Stay",
  },
];

const Home10 = () => {
  const navigate = useNavigate();

  return (
    <>
    <Helmet>
      <title>Monthly Rentals in Noida & Greater Noida | Best PG & Co-Living (Under ₹20K) | OvikaLiving</title>
      <meta name="description" content="Find the best monthly rental PG, co-living spaces & furnished apartments in Noida & Greater Noida. Fully furnished, managed, flexible lease. Best monthly accommodation for working professionals, students, remote workers & startup founders. No brokerage!" />
      <meta name="keywords" content="monthly rentals noida, monthly stay noida, monthly pg noida, monthly co living noida, furnished apartment monthly rent noida, monthly rental homes greater noida, long term pg noida, long term co living noida, monthly furnished flat noida, flexible stay noida, managed monthly rentals noida, affordable monthly pg noida, monthly co living spaces noida, monthly rental apartments noida, long term stay noida, furnished pg monthly noida, best monthly pg noida under 20000, co living monthly rent noida, monthly accommodation noida, long term furnished apartment noida, monthly rental working professionals noida, monthly rental students noida, monthly rental remote workers noida, monthly rental startup founders noida, monthly rental interns noida, monthly rental corporate employees noida, monthly rental freelancers noida, monthly rental digital nomads noida, monthly rental it professionals noida, monthly rental mba students noida, monthly pg sector 62 noida, monthly pg sector 63 noida, monthly pg sector 18 noida, monthly pg sector 16 noida, monthly pg sector 50 noida, monthly pg sector 51 noida, monthly pg sector 52 noida, monthly pg sector 44 noida, monthly pg sector 45 noida, monthly pg sector 46 noida, monthly pg sector 47 noida, monthly pg sector 48 noida, monthly pg sector 49 noida, monthly pg sector 15 noida, monthly pg sector 22 noida, monthly pg sector 27 noida, monthly pg sector 29 noida, monthly pg sector 30 noida, monthly pg sector 32 noida, monthly pg sector 33 noida, monthly pg sector 34 noida, monthly pg sector 35 noida, monthly pg sector 36 noida, monthly pg sector 37 noida, monthly pg sector 38 noida, monthly pg sector 39 noida, monthly pg sector 40 noida, monthly pg sector 41 noida, monthly pg sector 42 noida, monthly pg sector 43 noida, monthly pg sector 53 noida, monthly pg sector 54 noida, monthly pg sector 55 noida, monthly pg sector 56 noida, monthly pg sector 57 noida, monthly pg sector 58 noida, monthly pg sector 59 noida, monthly pg sector 60 noida, monthly pg sector 61 noida, monthly pg sector 100 noida, monthly pg sector 119 noida, monthly pg sector 120 noida, monthly pg sector 121 noida, monthly pg sector 122 noida, monthly pg sector 125 noida, monthly pg sector 126 noida, monthly pg sector 128 noida, monthly pg knowledge park greater noida, monthly pg alpha greater noida, monthly pg beta greater noida, monthly pg gamma greater noida, monthly pg delta greater noida, monthly pg omega greater noida, monthly pg pari chowk greater noida, monthly pg greater noida west, monthly pg noida extension, मासिक किराया नोएडा, मंथली पीजी नोएडा, मंथली रेंटल नोएडा, मासिक किराये का कमरा नोएडा, लॉन्ग टर्म पीजी नोएडा, फर्निश्ड फ्लैट मंथली नोएडा, मासिक को-लिविंग नोएडा, मंथली एकोमोडेशन नोएडा, को लिविंग नोएडा, किराये का कमरा नोएडा, नोएडा में पीजी, ग्रेटर नोएडा पीजी, सस्ता पीजी नोएडा, वाईफाई वाला पीजी, खाने वाला पीजी, लड़कों के लिए पीजी, लड़कियों के लिए पीजी, नोएडा में कमरा किराये पर, रिमोट वर्कर नोएडा, स्टार्टअप फाउंडर नोएडा, इंटर्न के लिए पीजी, pg under 10000 noida monthly, pg under 15000 noida monthly, pg under 20000 noida monthly, furnished flat under 25000 noida monthly, studio apartment monthly noida, 1bhk monthly rental noida, 2bhk monthly rental noida, fully furnished monthly rental noida, semi-furnished monthly rental noida, serviced apartment monthly noida, paying guest monthly noida, shared accommodation monthly noida, private room monthly noida, single occupancy monthly noida, double occupancy monthly noida, wifi included monthly pg noida, meals included monthly pg noida, ac room monthly pg noida, gym monthly pg noida, housekeeping monthly rental noida, laundry monthly rental noida, parking monthly rental noida, 24x7 security monthly pg noida, cctv monthly pg noida, power backup monthly pg noida, best monthly pg noida no brokerage, verified monthly rental noida, flexible monthly lease noida" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.ovikaliving.com/monthly-rentals" />
      <meta name="author" content="OvikaLiving" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Noida" />
      <meta name="geo.position" content="28.5355;77.3910" />
      <meta name="ICBM" content="28.5355, 77.3910" />
      <meta property="og:title" content="Monthly Rentals in Noida | Best PG & Co-Living (Under ₹20K) | OvikaLiving" />
      <meta property="og:description" content="Best monthly PG, co-living & furnished apartments in Noida & Greater Noida. Flexible lease, fully furnished, verified. No brokerage. Book now!" />
      <meta property="og:url" content="https://www.ovikaliving.com/monthly-rentals" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="OvikaLiving" />
      <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Monthly Rentals Noida | Best PG & Co-Living | OvikaLiving" />
      <meta name="twitter:description" content="Best monthly PG, co-living & furnished apartments in Noida & Greater Noida. Flexible lease, no brokerage. Book now!" />
      <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
    </Helmet>
    <section className="monthly-rentals">
      <div className="monthly-rentals__header">
        <h1 className="monthly-rentals__title">
          Monthly <span className="monthly-rentals__title--highlight">Rentals</span>
        </h1>
        <p className="monthly-rentals__subtitle">
          Choose your type of accommodation for long-term stays,
          <br />
          ideal for students, professionals, and families.
        </p>
      </div>

      <div className="monthly-rentals__grid">
        {accommodations.map((item) => (
          <div className="monthly-rentals__card" key={item.id}>

            {/* Desktop only — title above image */}
            <div className="monthly-rentals__card-top">
              <h2 className="monthly-rentals__card-title">{item.title}</h2>
            </div>

            <div className="monthly-rentals__image-wrapper">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.alt}
                  className="monthly-rentals__image"
                />
              ) : (
                <div className="monthly-rentals__image-placeholder">
                  <span>{item.alt}</span>
                </div>
              )}
            </div>

            {/* Desktop + Mobile bottom — title shown here on mobile */}
            <div className="monthly-rentals__card-bottom">
              <h2 className="monthly-rentals__card-title monthly-rentals__card-title--mobile">
                {item.title}
              </h2>
              <p className="monthly-rentals__card-desc">{item.description}</p>
              <button
                className="monthly-rentals__btn"
                onClick={(e) => navClick(e, item.filterPath, navigate)}
                onAuxClick={(e) => auxNavClick(e, item.filterPath)}
              >
                View All Listings{" "}
                <span className="monthly-rentals__btn-arrow">→</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default Home10;