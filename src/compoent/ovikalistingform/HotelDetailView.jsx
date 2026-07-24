import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiShare, FiHeart, FiCheck, FiX, FiChevronLeft, FiChevronRight,
  FiCheckCircle, FiShield, FiUser,
} from 'react-icons/fi';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';
import {
  Wifi, Snowflake, Car, Waves, Utensils, Dumbbell, Shield, ArrowUpDown,
  Sparkles, Bell, Tv, PawPrint, Lightbulb, Wind, Camera, Coffee,
} from 'lucide-react';
// Reuses the SAME stylesheet/design system as the rest of the property detail
// page (same classes, same theme) — this is NOT a separate look-and-feel.
import './PropertyDetailPage.css';
import './hotel-extra-sections.css';

const CANCELLATION_LABELS = {
  free_till_checkin: 'Free Cancellation till check-in',
  free_24h: 'Free Cancellation till 24 hours before check-in',
  free_48h: 'Free Cancellation till 48 hours before check-in',
  free_72h: 'Free Cancellation till 72 hours before check-in',
  non_refundable: 'Non-Refundable',
};

const MEAL_PLAN_LABELS = {
  room_only: 'Room Only',
  breakfast_included: 'Breakfast Only',
  breakfast_dinner_included: 'Breakfast & Dinner',
  all_meals_included: 'All Meals Included',
};

const EXTRA_BED_LABELS = { no: 'No', yes: 'Yes', subject_to_availability: 'Subject to availability' };

const AMENITY_ICON_RULES = [
  [/wifi/i, Wifi], [/air ?conditioning|\bac\b/i, Snowflake], [/parking|transfer/i, Car],
  [/pool/i, Waves], [/restaurant|kitchen|room service|food|dining|breakfast/i, Utensils],
  [/gym|fitness/i, Dumbbell], [/security|cctv|guard|alarm/i, Shield], [/elevator|lift/i, ArrowUpDown],
  [/housekeeping|laundry|caretaker/i, Sparkles], [/reception/i, Bell], [/tv/i, Tv],
  [/pet/i, PawPrint], [/balcony|terrace|garden/i, Wind], [/photography|camera/i, Camera],
  [/coffee|cafe/i, Coffee],
];
function getAmenityIcon(name) {
  const hit = AMENITY_ICON_RULES.find(([re]) => re.test(name || ''));
  const Icon = hit ? hit[1] : Lightbulb;
  return <Icon size={16} style={{ color: '#c98b3e', flexShrink: 0 }} />;
}

function formatTime12h(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h)) return t;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m || 0).padStart(2, '0')} ${period}`;
}

const HotelDetailView = ({ hotel }) => {
  const navigate = useNavigate();
  const [showViewer, setShowViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);

  const photos = (Array.isArray(hotel.photos) ? hotel.photos : []).filter(Boolean);
  const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

  const lowestRoom = useMemo(() => {
    const withRate = rooms.filter((r) => Number(r.baseRate4Adults) > 0);
    if (!withRate.length) return null;
    return withRate.reduce((min, r) => (Number(r.baseRate4Adults) < Number(min.baseRate4Adults) ? r : min), withRate[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel.rooms]);

  const maxOccupancy = rooms.reduce((m, r) => Math.max(m, Number(r.occupancy?.maxOccupancy) || 0), 0);

  const openViewer = (i) => { setViewerIndex(i); setShowViewer(true); };
  const nextPhoto = () => setViewerIndex((i) => (i + 1) % photos.length);
  const prevPhoto = () => setViewerIndex((i) => (i - 1 + photos.length) % photos.length);

  const mainIdx = Math.min(hotel.cover_photo_index || 0, Math.max(photos.length - 1, 0));
  const sideIdx = [1, 2, 3, 4].map((n) => (mainIdx + n) % Math.max(photos.length, 1));

  const guestProfile = hotel.guest_profile || {};
  const restrictions = hotel.restrictions || {};
  const petPolicy = hotel.pet_policy || {};
  const checkinPolicy = hotel.checkin_policy || {};
  const infantPolicy = hotel.infant_policy || {};
  const extraBedPolicy = hotel.extra_bed_policy || {};
  const mealRack = hotel.meal_rack_prices || {};

  const address = [hotel.building_no, hotel.address, hotel.locality, hotel.city, hotel.state, hotel.pincode, hotel.country].filter(Boolean).join(', ');

  const goEnquire = () => navigate('/contactus');

  const amenitiesLimit = 9;
  const showAllAmenities = amenitiesExpanded || amenities.length <= 10;
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, amenitiesLimit);
  const remainingAmenities = amenities.length - visibleAmenities.length;

  return (
    <div className="detail-page-wrapper">
      <Helmet>
        <title>{hotel.property_name ? `${hotel.property_name} in ${hotel.city || ''} | OvikaLiving` : 'Hotel | OvikaLiving'}</title>
        <meta name="description" content={`${hotel.property_name || 'Hotel'} in ${hotel.city || ''}. ${(hotel.description || '').substring(0, 120)}`} />
      </Helmet>

      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} />
          <span>Back to search results</span>
        </button>
        <div className="header-actions">
          <button className="action-btn action-btn--icon" title="Share"><FiShare size={16} /></button>
          <button className="action-btn action-btn--icon" title="Save"><FiHeart size={16} /></button>
        </div>
      </div>

      {/* ── Gallery — same airbnb-style grid as regular properties ── */}
      <div className="pdp-gallery-host-row">
        <section className="image-gallery">
          {photos.length <= 1 ? (
            <div className="gallery-airbnb" style={{ display: 'block' }}>
              <div style={{ position: 'relative', overflow: 'hidden', width: '100%', borderRadius: 12, aspectRatio: '16/7' }} onClick={() => photos[0] && openViewer(0)}>
                {photos[0]
                  ? <img src={photos[0]} alt={hotel.property_name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8' }}>No photos yet</div>}
              </div>
            </div>
          ) : (
            <div className="gallery-airbnb">
              <div className="gallery-main" style={{ position: 'relative', overflow: 'hidden' }} onClick={() => openViewer(mainIdx)}>
                <img src={photos[mainIdx]} alt={hotel.property_name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="gallery-side gallery-side-grid">
                {sideIdx.map((idx, pos) => (
                  <div key={pos} className={`gallery-side-cell gallery-grid-cell gallery-grid-cell--${pos}`} style={{ position: 'relative', overflow: 'hidden' }} onClick={() => openViewer(idx)}>
                    {photos[idx] && <img src={photos[idx]} alt={`${hotel.property_name} ${idx + 1}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                ))}
              </div>
              <button className="gallery-show-all-btn" onClick={() => openViewer(0)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                <span className="gallery-show-all-text">Show all photos</span>
              </button>
            </div>
          )}
          <div className="thumbnail-strip">
            {photos.map((p, idx) => (
              <div key={idx} className="thumb-item" onClick={() => openViewer(idx)}>
                <img src={p} alt={`Thumb ${idx}`} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Title / tags / location ── */}
      <section className="title-section">
        <div className="pdp-title-row">
          <h1 className="pdp-title-h1" style={{ margin: 0 }}>{hotel.property_name}</h1>
        </div>
        <div className="pdp-tag-row">
          <span className="pdp-tag">{hotel.hotel_type}</span>
          {guestProfile.unmarried_couples && <span className="pdp-tag">👫 Couple Friendly</span>}
        </div>
        <div className="location-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c2772b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          <span>{address}</span>
        </div>
      </section>

      <div className="content-grid">
        <div className="details-column">

          {/* ── Stay details ── */}
          <div className="pdp-stay-details-card">
            <h3 className="pdp-stay-details-title">Stay details</h3>
            <div className="pdp-stay-details-grid">
              <div className="pdp-stay-detail-item">
                <span className="pdp-sd-label">CHECK-IN TIME</span>
                <span className="pdp-sd-value">{formatTime12h(hotel.check_in_time) || '—'}</span>
              </div>
              <div className="pdp-stay-detail-item">
                <span className="pdp-sd-label">CHECK-OUT TIME</span>
                <span className="pdp-sd-value">{formatTime12h(hotel.check_out_time) || '—'}</span>
              </div>
              <div className="pdp-stay-detail-item">
                <span className="pdp-sd-label">CANCELLATION</span>
                <span className="pdp-sd-value pdp-sd-green">{CANCELLATION_LABELS[hotel.cancellation_policy] || '—'}</span>
              </div>
            </div>
            <div className="pdp-stay-specs-row">
              {rooms.length > 0 && <span className="pdp-stay-spec-pill"><BiBed size={15} /> {rooms.length} Room Type{rooms.length !== 1 ? 's' : ''}</span>}
              {maxOccupancy > 0 && <span className="pdp-stay-spec-pill"><FiUser size={14} /> Up to {maxOccupancy} Guests</span>}
            </div>
          </div>

          {hotel.description && (
            <>
              <div className="divider"></div>
              <div className="text-section about-mobile-wrap">
                <h3>About this space</h3>
                <div className="about-mobile-card">
                  <p style={{ margin: 0 }}>{hotel.description}</p>
                </div>
              </div>
            </>
          )}

          {/* ── Room Arrangements — same rm-card layout as regular properties ── */}
          {rooms.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="text-section">
                <div className="rm-section-header">
                  <div className="rm-section-left">
                    <span className="rm-pill">Layout</span>
                    <h3 className="rm-section-title">Room Types</h3>
                  </div>
                </div>
                <div className="rm-cards-grid">
                  {rooms.map((r, i) => {
                    const roomAmenities = Object.entries(r.amenities || {}).filter(([, v]) => v?.enabled);
                    const isExpanded = expandedRoom === i;
                    return (
                      <div key={i} className="rm-card">
                        {photos[i % (photos.length || 1)] && (
                          <div className="rm-card-img">
                            <img src={photos[i % photos.length]} alt={r.roomName || r.roomType} />
                          </div>
                        )}
                        <div className="rm-card-body">
                          <div className="rm-card-toprow">
                            <span className="rm-card-title">{r.roomName || r.roomType}</span>
                            <span className="rm-card-included"><FiCheck size={12} /> {MEAL_PLAN_LABELS[r.mealPlan] || r.mealPlan}</span>
                          </div>
                          <div className="rm-card-specs">
                            {r.areaValue && <span>{r.areaValue} {r.areaUnit === 'sqm' ? 'sq.mt' : 'sqft'}</span>}
                            {r.areaValue && <span className="rm-card-dot">·</span>}
                            <span>{r.occupancy?.maxOccupancy || 2} Guest{(r.occupancy?.maxOccupancy || 2) !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="rm-card-tags">
                            {Array.isArray(r.bedArrangement) && r.bedArrangement.map((b, bi) => (
                              <span key={bi} className="rm-card-chip"><BiBed size={13} /> {b.count} {b.bedType}</span>
                            ))}
                            <span className="rm-card-chip"><BiBath size={13} /> {r.bathroomCount || 1}</span>
                            {r.roomView && <span className="rm-card-chip">{r.roomView}</span>}
                            {r.extraBedAllowed && <span className="rm-card-chip">+ Extra bed allowed</span>}
                          </div>
                          {r.description && (
                            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 8px' }}>{r.description}</p>
                          )}
                          {(r.occupancy?.baseAdults || r.occupancy?.baseChildren || r.occupancy?.maxAdults || r.occupancy?.maxChildren) && (
                            <div className="rm-card-specs" style={{ marginBottom: 6 }}>
                              {r.occupancy?.baseAdults ? <span>Base {r.occupancy.baseAdults} Adult{r.occupancy.baseAdults !== 1 ? 's' : ''}</span> : null}
                              {r.occupancy?.baseChildren ? <span className="rm-card-dot">· Base {r.occupancy.baseChildren} Child{r.occupancy.baseChildren !== 1 ? 'ren' : ''}</span> : null}
                              {r.occupancy?.maxAdults ? <span className="rm-card-dot">· Max {r.occupancy.maxAdults} Adult{r.occupancy.maxAdults !== 1 ? 's' : ''}</span> : null}
                              {r.occupancy?.maxChildren ? <span className="rm-card-dot">· Max {r.occupancy.maxChildren} Child{r.occupancy.maxChildren !== 1 ? 'ren' : ''}</span> : null}
                            </div>
                          )}
                          {r.hasAlternateArrangement && Array.isArray(r.alternateBedArrangement) && r.alternateBedArrangement.length > 0 && (
                            <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: 6 }}>
                              Alternate arrangement: {r.alternateBedArrangement.map((b) => `${b.count} ${b.bedType}`).join(', ')}
                            </div>
                          )}
                          {(r.inventory?.start || r.inventory?.end) && (
                            <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: 6 }}>
                              📅 Available {r.inventory?.start || '—'} to {r.inventory?.end || '—'}
                            </div>
                          )}
                          {roomAmenities.length > 0 && (
                            <button type="button" className="hxs-room-toggle" onClick={() => setExpandedRoom(isExpanded ? null : i)}>
                              {isExpanded ? 'Hide amenities ▲' : `View ${roomAmenities.length} amenities ▼`}
                            </button>
                          )}
                          {isExpanded && (
                            <div className="rm-card-tags" style={{ marginTop: 6 }}>
                              {roomAmenities.map(([name, v]) => (
                                <span key={name} className="rm-card-chip">
                                  {name}{v.subOption ? ` (${Array.isArray(v.subOption) ? v.subOption.join(', ') : v.subOption})` : ''}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="rm-card-bottomrow">
                            <div>
                              <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#1e293b' }}>₹{Number(r.baseRate4Adults || 0).toLocaleString('en-IN')}</span>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>/night</span>
                              {r.numberOfRooms ? <div className="rm-card-deposit">{r.numberOfRooms} room{r.numberOfRooms !== 1 ? 's' : ''} available</div> : null}
                              {Number(r.extraAdultCharge) > 0 && <div className="rm-card-deposit">+₹{Number(r.extraAdultCharge).toLocaleString('en-IN')} / extra adult</div>}
                              {Number(r.paidChildCharge) > 0 && <div className="rm-card-deposit">+₹{Number(r.paidChildCharge).toLocaleString('en-IN')} / child (7-17y)</div>}
                            </div>
                            <button className="rm-card-book-btn" onClick={goEnquire}>Book Now</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── Why guests love this place — top amenities preview ── */}
          {amenities.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="text-section">
                <h3>Why guests love this place</h3>
                <div className="pdp-love-grid">
                  {amenities.slice(0, 8).map((am, i) => (
                    <div key={i} className="pdp-love-item">
                      <div className="pdp-love-icon">{getAmenityIcon(am)}</div>
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Amenities & Features ── */}
          {amenities.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="text-section">
                <div className="pdp-amenities-header">
                  <h3 style={{ margin: 0 }}>Amenities &amp; features</h3>
                  {amenities.length > 10 && (
                    <button className="pdp-amenities-viewall" onClick={() => setAmenitiesExpanded((e) => !e)}>
                      {amenitiesExpanded ? 'Show less' : 'View all'}
                    </button>
                  )}
                </div>
                <div className="pdp-amenities-grid">
                  {visibleAmenities.map((am, i) => (
                    <div key={i} className="pdp-amenity-card">
                      <div className="pdp-amenity-icon">{getAmenityIcon(am)}</div>
                      <span>{am}</span>
                    </div>
                  ))}
                  {remainingAmenities > 0 && (
                    <button className="pdp-amenity-card pdp-amenity-more" onClick={() => setAmenitiesExpanded(true)}>
                      <span className="pdp-amenity-more-num">+{remainingAmenities}</span>
                      <span>more</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── House rules & policies — same rule-card grid, extended with hotel-only
                policy fields (infant / extra-bed / ID proofs / meal rack) that have no
                equivalent on the regular property page ── */}
          <div className="divider"></div>
          <div className="pdp-rules-guide-row">
            <div className="text-section" style={{ marginBottom: 0 }}>
              <h3>House rules &amp; policies</h3>
              <div className="pdp-rules-box">
                <div className="pdp-rules-grid2">
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">{restrictions.smoking_allowed ? '🚬' : '🚭'}</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Smoking</span><span className="pdp-rule-val2">{restrictions.smoking_allowed ? 'Allowed' : 'Not allowed'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🐾</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Pets (for guests)</span><span className="pdp-rule-val2">{petPolicy.pets_allowed_for_guests ? 'Allowed' : 'Not allowed'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🐕</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Pets living on property</span><span className="pdp-rule-val2">{petPolicy.pets_on_property ? 'Yes' : 'No'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🎉</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Events</span><span className="pdp-rule-val2">{restrictions.private_parties_allowed ? 'Allowed' : 'Not allowed'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">💑</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Couples</span><span className="pdp-rule-val2">{guestProfile.unmarried_couples ? 'Allowed' : 'Not allowed'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">👶</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Guests below 18</span><span className="pdp-rule-val2">{guestProfile.guests_below_18 ? 'Allowed' : 'Not allowed'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">👥</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Male-only groups</span><span className="pdp-rule-val2">{guestProfile.male_only_groups ? 'Allowed' : 'Not allowed'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">♿</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Wheelchair access</span><span className="pdp-rule-val2">{restrictions.wheelchair_accessible ? 'Yes' : 'No'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🚪</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Outside visitors</span><span className="pdp-rule-val2">{restrictions.outside_visitors_allowed ? 'Allowed' : 'Not allowed'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🕐</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">24-Hour check-in</span><span className="pdp-rule-val2">{checkinPolicy.is_24_hour ? 'Yes' : 'No'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">👶</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Infant (0-2y) policy</span><span className="pdp-rule-val2">{infantPolicy.excluded_from_occupancy ? 'Free, excl. occupancy' : 'Counted in occupancy'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🍼</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Complimentary infant food</span><span className="pdp-rule-val2">{infantPolicy.complimentary_food ? 'Yes' : 'No'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🛏️</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Extra bed included in rate</span><span className="pdp-rule-val2">{hotel.extra_bed_inclusion ? 'Yes' : 'No'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🛏️</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Extra bed (adults)</span><span className="pdp-rule-val2">{EXTRA_BED_LABELS[extraBedPolicy.for_adults] || '—'}</span></div></div>
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🛏️</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Extra bed (kids)</span><span className="pdp-rule-val2">{EXTRA_BED_LABELS[extraBedPolicy.for_kids] || '—'}</span></div></div>
                  {hotel.check_in_time && (
                    <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🕐</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Check-in time</span><span className="pdp-rule-val2">{formatTime12h(hotel.check_in_time)}{hotel.check_out_time ? ` - ${formatTime12h(hotel.check_out_time)}` : ''}</span></div></div>
                  )}
                  {Array.isArray(hotel.acceptable_id_proofs) && hotel.acceptable_id_proofs.length > 0 && (
                    <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🪪</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">Accepted ID proofs</span><span className="pdp-rule-val2">{hotel.acceptable_id_proofs.join(', ')}</span></div></div>
                  )}
                  <div className="pdp-rule-card2"><div className="pdp-rule-icon2">🏙️</div><div className="pdp-rule-info2"><span className="pdp-rule-lbl2">IDs of same city allowed</span><span className="pdp-rule-val2">{hotel.ids_same_city_allowed ? 'Yes' : 'No'}</span></div></div>
                </div>
                {hotel.cancellation_policy && (
                  <div className="pdp-rules-cancellation">
                    <span>Cancellation <strong>{CANCELLATION_LABELS[hotel.cancellation_policy] || hotel.cancellation_policy}</strong></span>
                    <a href="/refund-cancellation-policy" target="_blank" rel="noopener noreferrer">Read policies</a>
                  </div>
                )}
                {hotel.custom_policy && (
                  <p style={{ marginTop: 12, fontSize: '0.82rem', color: '#64748b' }}><strong>Additional:</strong> {hotel.custom_policy}</p>
                )}
                {(Number(mealRack.breakfast) > 0 || Number(mealRack.lunch) > 0 || Number(mealRack.dinner) > 0) && (
                  <p style={{ marginTop: 8, fontSize: '0.82rem', color: '#64748b' }}>
                    <strong>Meal rack prices:</strong>{' '}
                    {[
                      Number(mealRack.breakfast) > 0 && `Breakfast ₹${mealRack.breakfast}`,
                      Number(mealRack.lunch) > 0 && `Lunch ₹${mealRack.lunch}`,
                      Number(mealRack.dinner) > 0 && `Dinner ₹${mealRack.dinner}`,
                    ].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="pdp-location-card">
            <h3 className="pdp-location-title">Location</h3>
            <p className="pdp-location-addr">{address}</p>
            {hotel.latitude && hotel.longitude && (
              <div className="pdp-map-wrap" style={{ position: 'relative' }}>
                <iframe
                  title="Hotel Location"
                  src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
                  width="100%" height="200" style={{ border: 0, borderRadius: 10, display: 'block' }}
                  loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* ── Good to know (generic trust info, same on every listing) ── */}
          <div className="pdp-g2k-card">
            <h3 className="pdp-g2k-title">Good to know</h3>
            <div className="pdp-g2k-list">
              <div className="pdp-g2k-row">
                <div className="pdp-g2k-icon-circle">🕐</div>
                <div>
                  <div className="pdp-g2k-label-main">{CANCELLATION_LABELS[hotel.cancellation_policy] ? 'Flexible cancellation' : 'Cancellation policy'}</div>
                  <div className="pdp-g2k-label">{CANCELLATION_LABELS[hotel.cancellation_policy] || 'See policy above'}</div>
                </div>
              </div>
              <div className="pdp-g2k-row">
                <div className="pdp-g2k-icon-circle">🪪</div>
                <div>
                  <div className="pdp-g2k-label-main">Valid ID required</div>
                  <div className="pdp-g2k-label">Govt. photo ID at check-in</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Need help (real contact) ── */}
          <div className="pdp-need-help-card">
            <h3 className="pdp-g2k-title" style={{ marginBottom: 14 }}>Need help?</h3>
            <div className="pdp-need-help-row">
              <a href="https://wa.me/919319392227" target="_blank" rel="noopener noreferrer" className="pdp-help-btn">
                <div className="pdp-help-icon-wrap" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#25D366" d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.847L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                </div>
                <div>
                  <div className="pdp-help-title">WhatsApp</div>
                  <div className="pdp-help-sub">Replies in minutes</div>
                </div>
              </a>
              <a href="tel:+919319392227" className="pdp-help-btn">
                <div className="pdp-help-icon-wrap" style={{ background: '#fff8f0', border: '1px solid #f0d9b5' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2772b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                </div>
                <div>
                  <div className="pdp-help-title">Call us</div>
                  <div className="pdp-help-sub">+91 93193 92227</div>
                </div>
              </a>
            </div>
          </div>

          {/* ── Safe & secure (generic trust badges, same on every listing) ── */}
          <div className="pdp-safe-card">
            <h3 className="pdp-g2k-title" style={{ marginBottom: 14 }}>Safe &amp; secure</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '🛡️', text: 'Secure payment gateway' },
                { icon: '✅', text: 'Verified properties only' },
                { icon: '🕐', text: '24x7 support, always' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Booking sidebar ── */}
        <div className="booking-sidebar">
          <div className="booking-card pdp-price-card">
            <div className="pdp-price-row">
              <div className="pdp-price-left">
                {lowestRoom ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
                    <span className="pdp-price-amount">₹{Number(lowestRoom.baseRate4Adults).toLocaleString('en-IN')}</span>
                    <span className="pdp-price-unit">/night</span>
                  </div>
                ) : (
                  <span className="pdp-price-amount" style={{ fontSize: '1rem' }}>Price on request</span>
                )}
              </div>
              <button className="pdp-price-book-btn" onClick={goEnquire}>Book Now</button>
            </div>
            <p className="pdp-price-hint">You won&apos;t be charged yet</p>
            {(hotel.cancellation_policy === 'free_till_checkin' || hotel.cancellation_policy?.startsWith('free_')) && (
              <div className="pdp-trust-row">
                <span className="pdp-trust-item pdp-trust-item--green"><FiCheckCircle size={13} /> Free cancellation</span>
              </div>
            )}
            <div className="booking-details">
              <div className="date-picker-mock">
                <div className="date-box">
                  <label>CHECK-IN TIME</label>
                  <span>{formatTime12h(hotel.check_in_time) || '—'}</span>
                </div>
                <div className="date-box">
                  <label>CHECK-OUT TIME</label>
                  <span>{formatTime12h(hotel.check_out_time) || '—'}</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <FiShield className="shield-icon" />
              <span>Secure Booking Guaranteed</span>
            </div>
          </div>

          {/* ── Location card mirror (matches sidebar position on regular pages) ── */}
          <div className="pdp-location-card">
            <h3 className="pdp-location-title">Location</h3>
            <p className="pdp-location-addr">{address}</p>
            {hotel.latitude && hotel.longitude && (
              <div className="pdp-map-wrap" style={{ position: 'relative' }}>
                <iframe
                  title="Hotel Location Sidebar"
                  src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
                  width="100%" height="160" style={{ border: 0, borderRadius: 10, display: 'block' }}
                  loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Fullscreen viewer ── */}
      {showViewer && photos.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowViewer(false)}>
          <button onClick={() => setShowViewer(false)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><FiX size={24} /></button>
          <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer' }}><FiChevronLeft size={24} /></button>
          <img src={photos[viewerIndex]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer' }}><FiChevronRight size={24} /></button>
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: 13 }}>{viewerIndex + 1} / {photos.length}</div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailView;
