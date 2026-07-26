import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './PropertyDetailPage.css';
import './apartment-villa-detail.css';

const FURNISHING_ITEMS = ["AC", "TV", "Beds", "Wardrobe", "Geyser", "Light", "Fans", "Sofa", "Washing Machine", "Stove", "Fridge", "Water Purifier", "Microwave", "Modular Kitchen", "Chimney", "Dinning Table"];

function asArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

function formatDate(d) {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const ApartmentVillaDetailView = ({ property: apt }) => {
  const navigate = useNavigate();
  const [showViewer, setShowViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const photos = asArray(apt.photos).filter(Boolean);
  const amenities = asArray(apt.amenities);
  const propertyFeatures = asArray(apt.property_features);
  const furnishingItems = asArray(apt.furnishing_items);
  const meta = (() => { if (apt.meta && typeof apt.meta === 'object') return apt.meta; try { return JSON.parse(apt.meta || '{}'); } catch { return {}; } })();

  const bedrooms = Number(apt.bedrooms) || 0;
  const bathrooms = Number(apt.bathrooms) || 0;

  const openViewer = (i) => { setViewerIndex(i); setShowViewer(true); };
  const nextPhoto = () => setViewerIndex((i) => (i + 1) % photos.length);
  const prevPhoto = () => setViewerIndex((i) => (i - 1 + photos.length) % photos.length);

  const address = [apt.address, apt.locality, apt.city, apt.state, apt.pincode].filter(Boolean).join(', ');
  const furnishing = meta.furnishing || '';

  const whyConsider = [
    meta.balconies > 1 ? `${meta.balconies} Balconies` : null,
    furnishing || null,
    (Number(meta.coveredParking) > 0 || Number(meta.openParking) > 0)
      ? `${meta.coveredParking || 0} Covered Parking & ${meta.openParking || 0} Open Parking` : null,
    ...propertyFeatures,
    apt.flooring_type ? `${apt.flooring_type} Flooring` : null,
    apt.facing_road_width ? `On ${apt.facing_road_width} Feet Wide Road` : null,
    meta.propertyAge === '0-1 years' ? 'Newly Constructed' : null,
  ].filter(Boolean);

  return (
    <div className="detail-page-wrapper avd-root">
      <Helmet>
        <title>{apt.property_name ? `${apt.property_name} in ${apt.city || ''} | OvikaLiving` : 'Property | OvikaLiving'}</title>
      </Helmet>

      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft size={16} /><span>Back to search results</span></button>
      </div>

      <div className="avd-breadcrumb">
        <Link to="/">Home</Link> <span>›</span> <Link to="/properties">Apartments &amp; Villas</Link> <span>›</span>
        <span>{apt.property_name}</span>
      </div>

      {/* ── Gallery ── */}
      <div className="pdp-gallery-host-row">
        <section className="image-gallery">
          {photos.length <= 1 ? (
            <div className="gallery-airbnb" style={{ display: 'block' }}>
              <div style={{ position: 'relative', overflow: 'hidden', width: '100%', borderRadius: 12, aspectRatio: '16/7' }} onClick={() => photos[0] && openViewer(0)}>
                {photos[0] ? <img src={photos[0]} alt={apt.property_name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8' }}>Photos Under Screening</div>}
              </div>
            </div>
          ) : (
            <div className="gallery-airbnb">
              <div className="gallery-main" style={{ position: 'relative', overflow: 'hidden' }} onClick={() => openViewer(0)}>
                <img src={photos[apt.cover_photo_index || 0]} alt={apt.property_name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="gallery-side gallery-side-grid">
                {[1, 2, 3, 4].map((n, pos) => {
                  const idx = n % photos.length;
                  return (
                    <div key={pos} className={`gallery-side-cell gallery-grid-cell gallery-grid-cell--${pos}`} style={{ position: 'relative', overflow: 'hidden' }} onClick={() => openViewer(idx)}>
                      {photos[idx] && <img src={photos[idx]} alt={`${apt.property_name} ${idx + 1}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── Price / Config header ── */}
      <section className="avd-header">
        <div className="avd-header-top">
          <div className="avd-price-block">
            <span className="avd-price">₹{Number(apt.price || 0).toLocaleString('en-IN')}</span>
            <span className="avd-price-unit">Per Month</span>
          </div>
          <div className="avd-config">{bedrooms}BHK {bathrooms}Baths</div>
        </div>
        <div className="avd-subline">{apt.property_type || 'Flat/Apartment'} for Rent{furnishing ? ` · ${furnishing}` : ''}</div>
        <div className="location-row"><span>{address}</span></div>
      </section>

      <div className="avd-info-card">
        <div className="avd-info-grid">
          <div className="avd-info-item">
            <span className="avd-info-label">Configuration</span>
            <span className="avd-info-value">
              {bedrooms} Bedroom{bedrooms !== 1 ? 's' : ''}, {bathrooms} Bathroom{bathrooms !== 1 ? 's' : ''}
              {meta.balconies ? `, ${meta.balconies} Balcon${meta.balconies !== 1 ? 'ies' : 'y'}` : ''}
              {Array.isArray(meta.otherRooms) && meta.otherRooms.length > 0 ? ` with ${meta.otherRooms.join(', ')}` : ''}
            </span>
          </div>
          <div className="avd-info-item">
            <span className="avd-info-label">Rent</span>
            <span className="avd-info-value">₹{Number(apt.price || 0).toLocaleString('en-IN')}{meta.priceNegotiable ? ' (Negotiable)' : ''}</span>
          </div>
          <div className="avd-info-item">
            <span className="avd-info-label">Area</span>
            <span className="avd-info-value">Carpet Area: {apt.carpet_area || 'N/A'} {apt.carpet_area_unit || 'sq.ft.'}</span>
          </div>
          <div className="avd-info-item">
            <span className="avd-info-label">Address</span>
            <span className="avd-info-value">{[meta.society, apt.locality, apt.city].filter(Boolean).join(', ')}</span>
          </div>
          <div className="avd-info-item">
            <span className="avd-info-label">Furnishing</span>
            <span className="avd-info-value">{furnishing || 'Not specified'}</span>
          </div>
          <div className="avd-info-item">
            <span className="avd-info-label">Available For</span>
            <span className="avd-info-value">{Array.isArray(meta.rentOutTo) && meta.rentOutTo.length > 0 ? meta.rentOutTo.join(', ') : 'Anyone'}</span>
          </div>
          {meta.availableFrom && (
            <div className="avd-info-item">
              <span className="avd-info-label">Available From</span>
              <span className="avd-info-value">{formatDate(meta.availableFrom)}</span>
            </div>
          )}
        </div>
      </div>

      {whyConsider.length > 0 && (
        <div className="avd-why-card">
          <h3 className="avd-why-title">Why should you consider this property?</h3>
          <div className="avd-why-chips">
            {whyConsider.map((w, i) => <span key={i} className="avd-why-chip"><FiCheck size={12} /> {w}</span>)}
          </div>
        </div>
      )}

      <div className="avd-facts-grid">
        {apt.floor_number && <div className="avd-fact"><span>Floor Number</span><strong>{apt.floor_number}{apt.total_floors ? ` of ${apt.total_floors} Floors` : ''}</strong></div>}
        {apt.flooring_type && <div className="avd-fact"><span>Flooring</span><strong>{apt.flooring_type}</strong></div>}
        {apt.facing_road_width ? <div className="avd-fact"><span>Width of facing road</span><strong>{apt.facing_road_width} Feet</strong></div> : null}
        {(Number(meta.coveredParking) > 0 || Number(meta.openParking) > 0) && <div className="avd-fact"><span>Parking</span><strong>{meta.coveredParking || 0} Covered, {meta.openParking || 0} Open</strong></div>}
        <div className="avd-fact"><span>Electricity &amp; Water Charges</span><strong>{meta.electricityWaterExcluded ? 'Charges not included' : 'Included'}</strong></div>
        {meta.powerBackup && <div className="avd-fact"><span>Power Backup</span><strong>{meta.powerBackup}</strong></div>}
        {meta.propertyAge && <div className="avd-fact"><span>Property Age</span><strong>{meta.propertyAge}</strong></div>}
        {Number(apt.security_deposit) > 0 && <div className="avd-fact"><span>Security Deposit</span><strong>₹{Number(apt.security_deposit).toLocaleString('en-IN')}</strong></div>}
        {meta.openSides && <div className="avd-fact"><span>No. of Open Sides</span><strong>{meta.openSides}</strong></div>}
        {apt.facing && <div className="avd-fact"><span>Facing</span><strong>{apt.facing}</strong></div>}
      </div>

      {apt.description && (
        <div className="avd-card">
          <h3 className="avd-card-title">About Property</h3>
          <p className="avd-address-line"><strong>Address:</strong> {address}</p>
          <p className="avd-description">{apt.description}</p>
        </div>
      )}

      {(furnishing === 'Furnished' || furnishing === 'Semi-furnished') && (
        <div className="avd-card">
          <h3 className="avd-card-title">Furnishing Details</h3>
          <div className="avd-furnish-grid">
            {FURNISHING_ITEMS.map((item) => {
              const has = furnishingItems.includes(item);
              return (
                <div key={item} className={`avd-furnish-item ${has ? '' : 'off'}`}>
                  {has ? <FiCheck size={16} /> : <FiX size={16} />}
                  <span>{has ? item : `No ${item}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {amenities.length > 0 && (
        <div className="avd-card">
          <h3 className="avd-card-title">Amenities</h3>
          <div className="avd-amenity-grid">
            {amenities.map((a) => (
              <div key={a} className="avd-amenity-item"><FiCheck size={15} /><span>{a}</span></div>
            ))}
          </div>
        </div>
      )}

      <div className="pdp-location-card">
        <h3 className="pdp-location-title">Location</h3>
        <p className="pdp-location-addr">{address}</p>
        {apt.latitude && apt.longitude && (
          <div className="pdp-map-wrap" style={{ position: 'relative' }}>
            <iframe title="Property Location" src={`https://maps.google.com/maps?q=${apt.latitude},${apt.longitude}&z=15&output=embed`} width="100%" height="200" style={{ border: 0, borderRadius: 10, display: 'block' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
      </div>

      {showViewer && photos.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowViewer(false)}>
          <button onClick={() => setShowViewer(false)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><FiX size={24} /></button>
          <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer' }}><FiChevronLeft size={24} /></button>
          <img src={photos[viewerIndex]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer' }}><FiChevronRight size={24} /></button>
        </div>
      )}
    </div>
  );
};

export default ApartmentVillaDetailView;
