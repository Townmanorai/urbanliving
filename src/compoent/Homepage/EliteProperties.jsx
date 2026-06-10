
import React, { useEffect, useState } from 'react';
import './tmxelite-prop.css';
import { useNavigate } from 'react-router';
import { FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function EliteProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  // Dummy properties for filling empty space
  const dummyProperties = [
    {
      id: 'dummy-1',
      name: 'TM Stay - 1',
      images: ['/12000.png'],
      monthly_price: 12000,
      pricing_type: 'month/bed'
    },
    {
      id: 'dummy-2',
      name: 'TM Stay - 2',
      images: ['/9000.png'],
      monthly_price: 9500,
      pricing_type: 'month/bed'
    },
    {
      id: 'dummy-3',
      name: 'TM Hive',
      images: ['/TMhive1.png'],
      monthly_price: 15000,
      pricing_type: 'month/bed'
    },
    {
      id: 'dummy-4',
      name: 'TM Luxe -3',
      images: ['/tmluxe3.png'],
      monthly_price: 5000,
      pricing_type: ' night'
    },
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('https://www.townmanor.ai/api/properties/all');
        if (!res.ok) throw new Error('Failed to load properties');
        const data = await res.json();

        let fetchedProps = [];
        if (Array.isArray(data)) {
          fetchedProps = data;
        } else if (data && Array.isArray(data.properties)) { 
          fetchedProps = data.properties;
        } else {
          setError('Invalid response format');
        }

        // Append dummy properties if less than 6
        if (fetchedProps.length < 6) {
          const needed = 6 - fetchedProps.length;
          fetchedProps = [...fetchedProps, ...dummyProperties.slice(0, needed)];
        }

        setProperties(fetchedProps);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);
  return (
    <section className="tmxelite-prop">
      <div className="tmxelite-prop-container">
        <div className="tmxelite-prop-head">
          <h2 style={{fontWeight:"400" , fontSize:"32px"}} className="tmxelite-prop-title">Trending Properties</h2>
          <span className="tmxelite-prop-chevron">›</span>
        </div>

        {loading && (
          <div className="tmxelite-prop-grid">
            <div className="tmxelite-prop-card">Loading...</div>
          </div>
        )}
        {error && !loading && (
          <div className="tmxelite-prop-grid">
            <div className="tmxelite-prop-card">{error}</div>
          </div>
        )}
        {!loading && !error && (
          <>
            {isMobile ? (
              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1.2}
                spaceBetween={16}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop
                pagination={{ clickable: true }}
                centeredSlides={true}  
              >
                {properties.map((prop) => {
                  const isDummy = prop.id?.toString().startsWith('dummy');

                  const imageArray = Array.isArray(prop.images)
                    ? prop.images
                    : Array.isArray(prop.IMAGES)
                    ? prop.IMAGES
                    : [];
                  const imageSrc = imageArray.length > 0 ? imageArray[0] : '/p1.png';

                  let priceText = '';
                  if (isDummy) {
                    const priceNumber = prop.monthly_price;
                    const pricingType = prop.pricing_type;
                    priceText = priceNumber
                      ? `₹ ${priceNumber.toLocaleString('en-IN')} per ${pricingType}`
                      : '';
                  } else {
                    const rawPrice = prop.per_night_price ?? prop.PER_NIGHT_PRICE;
                    const priceNumber =
                      typeof rawPrice === 'string'
                        ? parseFloat(rawPrice)
                        : rawPrice;
                    priceText = priceNumber
                      ? `₹ ${priceNumber.toLocaleString('en-IN')} per night`
                      : '';
                  }

                  const id = prop.id ?? prop.ID;
                  const name = prop.name ?? prop.NAME;

                  return (
                    <SwiperSlide key={id}>
                      <article
                        className="tmxelite-prop-card"
                        onClick={() => {
                          if (isDummy) return;
                          navigate(`/tmluxespecific/${id}`, { state: { propertyId: id } });
                        }}
                      >
                        <div className="tmxelite-prop-media">
                          <img src={imageSrc} alt={name} />
                          <span className="tmxelite-prop-badge">
                            {isDummy ? 'Coming Soon' : 'ready-to-book'}
                          </span>
                          <button className="tmxelite-prop-like" aria-label="save">
                            <FaHeart color="white" />
                          </button>
                        </div>
                        <div className="tmxelite-prop-body">
                          <h4 style={{fontWeight:"300"}} className="tmxelite-prop-name">{name}</h4>
                          <div className="tmxelite-prop-meta">
                            <span className="tmxelite-prop-price">{priceText}</span>
                          </div>
                        </div>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <div className="tmxelite-prop-desktop-container">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  slidesPerView={5}
                  spaceBetween={16}
                  navigation={{
                    nextEl: '.tmxelite-prop-next',
                    prevEl: '.tmxelite-prop-prev',
                  }}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 16,
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 16,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 16,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 16,
                    },
                    1280: {
                      slidesPerView: 5,
                      spaceBetween: 16,
                    },
                    1600: {
                      slidesPerView: 6,
                      spaceBetween: 16,
                    }
                  }}
                  className="tmxelite-prop-swiper"
                >
                  {properties.map((prop) => {
                    const isDummy = prop.id?.toString().startsWith('dummy');

                    const imageArray = Array.isArray(prop.images)
                      ? prop.images
                      : Array.isArray(prop.IMAGES)
                      ? prop.IMAGES
                      : [];
                    const imageSrc = imageArray.length > 0 ? imageArray[0] : '/p1.png';

                    let priceText = '';
                    if (isDummy) {
                      const priceNumber = prop.monthly_price;
                      const pricingType = prop.pricing_type;
                      priceText = priceNumber
                        ? `₹ ${priceNumber.toLocaleString('en-IN')} per ${pricingType}`
                        : '';
                    } else {
                      const rawPrice = prop.per_night_price ?? prop.PER_NIGHT_PRICE;
                      const priceNumber =
                        typeof rawPrice === 'string'
                          ? parseFloat(rawPrice)
                          : rawPrice;
                      priceText = priceNumber
                        ? `₹ ${priceNumber.toLocaleString('en-IN')} per night`
                        : '';
                    }

                    const id = prop.id ?? prop.ID;
                    const name = prop.name ?? prop.NAME;

                    return (
                      <SwiperSlide key={id}>
                        <article
                          className="tmxelite-prop-card"
                          onClick={() => {
                            // Prevent navigation for dummy properties
                            if (isDummy) return;
                            navigate(`/tmluxespecific/${id}`, { state: { propertyId: id } });
                          }}
                        >
                          <div className="tmxelite-prop-media">
                            <img src={imageSrc} alt={name} />
                            <span className="tmxelite-prop-badge">
                              {isDummy ? 'Coming Soon' : 'ready-to-book'}
                            </span>
                            <button className="tmxelite-prop-like" aria-label="save">
                              <FaHeart color="white" />
                            </button>
                          </div>
                          <div className="tmxelite-prop-body">
                            <h3 className="tmxelite-prop-name">{name}</h3>
                            <div className="tmxelite-prop-meta">
                              <span className="tmxelite-prop-price">{priceText}</span>
                            </div>
                          </div>
                        </article>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                
                {/* Navigation Buttons */}
                <button className="tmxelite-prop-prev tmxelite-prop-nav-btn">
                  <FaChevronLeft />
                </button>
                <button className="tmxelite-prop-next tmxelite-prop-nav-btn">
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default EliteProperties;
