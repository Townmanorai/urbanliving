import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Login/AuthContext';
import './OwnerVerificationForm.css';
import { useStepBackNav } from '../../utils/useStepBackNav';

const API_BASE = 'https://www.townmanor.ai/api';
const SUREPASS_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg';

// ── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ current }) {
  const labels = ['Mobile Verify', 'Upload Media', 'Location & Submit'];
  return (
    <div className="ovf-stepbar">
      {labels.map((label, i) => (
        <React.Fragment key={i}>
          <div className={`ovf-step ${current === i ? 'active' : current > i ? 'done' : ''}`}>
            <div className="ovf-step-circle">
              {current > i ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="ovf-step-label">{label}</span>
          </div>
          {i < labels.length - 1 && <div className={`ovf-step-line ${current > i ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── File Upload Box ───────────────────────────────────────────────────────────
function FileUploadBox({ label, accept, multiple, files, onChange, hint, required }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = multiple ? Array.from(e.dataTransfer.files) : [e.dataTransfer.files[0]];
    onChange(dropped);
  };

  const handleChange = (e) => {
    const selected = multiple ? Array.from(e.target.files) : [e.target.files[0]];
    onChange(selected);
  };

  return (
    <div
      className={`ovf-upload-box ${files.length > 0 ? 'has-files' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {files.length === 0 ? (
        <>
          <div className="ovf-upload-icon">
            {accept.includes('video') ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="5" width="15" height="14" rx="2" />
                <path d="M17 9l5-3v12l-5-3V9z" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            )}
          </div>
          <p className="ovf-upload-label">{label} {required && <span className="ovf-req">*</span>}</p>
          <p className="ovf-upload-hint">{hint}</p>
          <button type="button" className="ovf-upload-btn">Choose File{multiple ? 's' : ''}</button>
        </>
      ) : (
        <div className="ovf-file-list">
          <div className="ovf-file-count">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {files.length} file{files.length > 1 ? 's' : ''} selected
          </div>
          <ul>
            {files.slice(0, 5).map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
            {files.length > 5 && <li>+{files.length - 5} more...</li>}
          </ul>
          <button type="button" className="ovf-upload-btn change">Change</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OwnerVerificationForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Try every possible ID field + fallback to raw localStorage
  const rawUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  })();
  const ownerId = user?.id || user?._id || user?.owner_id ||
                  rawUser?.id || rawUser?._id || rawUser?.owner_id || '';
  const prefillEmail = user?.email || rawUser?.email || '';

  // Step: 0 = mobile+OTP, 1 = media upload, 2 = location+submit
  const [step, setStep] = useState(0);
  const prevStep = () => setStep(s => Math.max(0, s - 1));
  useStepBackNav(step, prevStep);

  // Step 0 state
  const [mobile, setMobile] = useState('');
  const [ownerEmail, setOwnerEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [clientId, setClientId] = useState('');

  // Step 1 state
  const [exteriorPhoto, setExteriorPhoto] = useState([]);
  const [interiorPhotos, setInteriorPhotos] = useState([]);
  const [walkthroughVideo, setWalkthroughVideo] = useState([]);

  // Step 2 state
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [mapAddress, setMapAddress] = useState('');
  const [propertyLink, setPropertyLink] = useState('');
  const [propertyId, setPropertyId] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ── Step 0: Send OTP (Surepass) ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    setError('');
    if (!mobile || mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'https://kyc-api.surepass.app/api/v1/telecom/generate-otp',
        { id_number: mobile },
        { headers: { Authorization: SUREPASS_TOKEN } }
      );
      if (response.data?.success && response.data?.data?.client_id) {
        setClientId(response.data.data.client_id);
        setOtpSent(true);
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (e) {
      if (e.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(e.response?.data?.message || e.message || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 0: Verify OTP (Surepass) ───────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setError('');
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP.');
      return;
    }
    if (!clientId) {
      setError('Client ID missing. Please request OTP again.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'https://kyc-api.surepass.app/api/v1/telecom/submit-otp',
        { client_id: clientId, otp },
        { headers: { Authorization: SUREPASS_TOKEN } }
      );
      if (response.data?.success) {
        setMobileVerified(true);
        setTimeout(() => setStep(1), 700);
      } else {
        throw new Error(response.data?.message || 'OTP verification failed');
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1 → Step 2 validation ──────────────────────────────────────────────
  const handleMediaNext = () => {
    setError('');
    if (exteriorPhoto.length === 0) { setError('Please upload the exterior photo.'); return; }
    if (interiorPhotos.length < 3) { setError('Please upload at least 3 interior photos.'); return; }
    if (walkthroughVideo.length === 0) { setError('Please upload the walkthrough video.'); return; }
    setStep(2);
  };

  // ── Step 2: Use My Location ─────────────────────────────────────────────────
  const handleGetLocation = () => {
    setError('');
    if (!navigator.geolocation) { setError('Geolocation not supported by your browser.'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
      },
      () => setError('Could not get location. Please enter manually.')
    );
  };

  // ── Step 2: Final Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!propertyId.trim()) { setError('Please enter your Property ID.'); return; }
    if (!lat || !lng) { setError('Please provide property latitude and longitude.'); return; }

    const formData = new FormData();
    formData.append('owner_id', ownerId);
    if (ownerEmail.trim()) formData.append('owner_email', ownerEmail.trim());
    formData.append('mobile_number', mobile);
    formData.append('lat', lat);
    formData.append('lng', lng);
    if (mapAddress) formData.append('map_address', mapAddress);
    if (propertyLink) formData.append('property_link', propertyLink);
    if (propertyId.trim()) formData.append('property_id', propertyId.trim());
    formData.append('exterior_photo', exteriorPhoto[0]);
    interiorPhotos.forEach((f) => formData.append('interior_photos', f));
    formData.append('walkthrough_video', walkthroughVideo[0]);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/owner-verification`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Backend response:', data);
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      setSuccess(true);
    } catch (e) {
      console.error('Submit error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="ovf-root">
        <div className="ovf-success">
          <div className="ovf-success-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Verification Submitted!</h2>
          <p>Our team will review your details and get back to you. Your listing will receive the <strong>Self-Verified</strong> badge once approved.</p>
          <button className="ovf-btn-primary" onClick={() => navigate('/ovika-self-verified')}>
            Back to Self-Verification Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ovf-root">
      <div className="ovf-container">

        {/* Header */}
        <div className="ovf-header">
          <button className="ovf-back-btn" onClick={() => navigate('/ovika-self-verified')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
          <div className="ovf-header-text">
            <h1>Property Self-Verification</h1>
            <p>Complete all steps to get your verified badge</p>
          </div>
        </div>

        {/* Step Bar */}
        <StepBar current={step} />

        {/* Error */}
        {error && (
          <div className="ovf-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" />
            </svg>
            {error}
          </div>
        )}

        {/* ── STEP 0: Mobile Verification ──────────────────────────────────── */}
        {step === 0 && (
          <div className="ovf-card">
            <div className="ovf-card-icon">📱</div>
            <h2>Verify Your Mobile Number</h2>
            <p className="ovf-card-desc">We'll send a 6-digit OTP to confirm your number.</p>
            {!ownerId && (
              <div className="ovf-error" style={{ marginBottom: 16 }}>
                You are not logged in. Please <span style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/login')}>login first</span> to submit verification.
              </div>
            )}

            <div className="ovf-field">
              <label>Email Address <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>(for approval/rejection notification)</span></label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
              />
            </div>

            <div className="ovf-field">
              <label>Mobile Number <span className="ovf-req">*</span></label>
              <div className="ovf-phone-row">
                <span className="ovf-phone-code">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  disabled={otpSent}
                />
              </div>
            </div>

            {!otpSent ? (
              <button className="ovf-btn-primary full" onClick={handleSendOtp} disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            ) : (
              <>
                {mobileVerified ? (
                  <div className="ovf-verified-msg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mobile verified! Proceeding...
                  </div>
                ) : (
                  <>
                    <div className="ovf-otp-hint">OTP sent to +91 {mobile}</div>
                    <div className="ovf-field">
                      <label>Enter OTP <span className="ovf-req">*</span></label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="ovf-otp-input"
                      />
                    </div>
                    <div className="ovf-otp-actions">
                      <button className="ovf-btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      <button className="ovf-btn-ghost" onClick={() => { setOtpSent(false); setOtp(''); }} disabled={loading}>
                        Resend
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ── STEP 1: Media Upload ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="ovf-card">
            <div className="ovf-card-icon">📷</div>
            <h2>Upload Photos & Video</h2>
            <p className="ovf-card-desc">These help renters trust your listing.</p>

            <div className="ovf-field">
              <label>Exterior Photo <span className="ovf-req">*</span></label>
              <FileUploadBox
                label="Building Exterior / Entrance"
                accept="image/jpeg,image/png,image/webp"
                multiple={false}
                files={exteriorPhoto}
                onChange={setExteriorPhoto}
                hint="1 photo · JPG, PNG, or WEBP"
                required
              />
            </div>

            <div className="ovf-field">
              <label>Interior Photos <span className="ovf-req">*</span> <span className="ovf-label-hint">(minimum 3)</span></label>
              <FileUploadBox
                label="Bedroom, Living Room, Bathroom, Kitchen"
                accept="image/jpeg,image/png,image/webp"
                multiple={true}
                files={interiorPhotos}
                onChange={setInteriorPhotos}
                hint="Min 3, max 40 photos · JPG, PNG, WEBP"
                required
              />
              {interiorPhotos.length > 0 && interiorPhotos.length < 3 && (
                <p className="ovf-field-warn">Need at least 3 photos ({3 - interiorPhotos.length} more required)</p>
              )}
            </div>

            <div className="ovf-field">
              <label>Walkthrough Video <span className="ovf-req">*</span></label>
              <FileUploadBox
                label="30–60 second property walkthrough"
                accept="video/mp4,video/quicktime,video/x-msvideo"
                multiple={false}
                files={walkthroughVideo}
                onChange={setWalkthroughVideo}
                hint="MP4, MOV, or AVI · Max 100MB"
                required
              />
            </div>

            <div className="ovf-nav-row">
              <button className="ovf-btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button className="ovf-btn-primary" onClick={handleMediaNext}>Next: Location</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Location & Submit ────────────────────────────────────── */}
        {step === 2 && (
          <form className="ovf-card" onSubmit={handleSubmit}>
            <div className="ovf-card-icon">📍</div>
            <h2>Property Location</h2>
            <p className="ovf-card-desc">Confirm where your property is on the map.</p>

            <button type="button" className="ovf-locate-btn" onClick={handleGetLocation}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                <circle cx="12" cy="12" r="9" />
              </svg>
              Use My Current Location
            </button>

            <div className="ovf-row">
              <div className="ovf-field">
                <label>Latitude <span className="ovf-req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 28.6139"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>
              <div className="ovf-field">
                <label>Longitude <span className="ovf-req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 77.2090"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="ovf-field">
              <label>Full Address <span className="ovf-label-hint">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. Sector 18, Noida, Uttar Pradesh"
                value={mapAddress}
                onChange={(e) => setMapAddress(e.target.value)}
              />
            </div>

            <div className="ovf-field">
              <label>Property ID <span className="ovf-req">*</span></label>
              <input
                type="text"
                placeholder="Enter your Property ID (e.g. 718)"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
              />
            </div>

            <div className="ovf-field">
              <label>Property Link <span className="ovf-label-hint">(optional)</span></label>
              <input
                type="url"
                placeholder="e.g. https://ovikaliving.com/property/123"
                value={propertyLink}
                onChange={(e) => setPropertyLink(e.target.value)}
              />
            </div>

            <div className="ovf-summary">
              <h4>Submission Summary</h4>
              <ul>
                <li><span>Mobile</span><span className="ok">✓ Verified</span></li>
                <li><span>Exterior Photo</span><span className="ok">✓ {exteriorPhoto[0]?.name}</span></li>
                <li><span>Interior Photos</span><span className="ok">✓ {interiorPhotos.length} uploaded</span></li>
                <li><span>Walkthrough Video</span><span className="ok">✓ {walkthroughVideo[0]?.name}</span></li>
                <li><span>Location</span><span className={lat && lng ? 'ok' : 'pending'}>{lat && lng ? `✓ ${lat}, ${lng}` : 'Pending'}</span></li>
              </ul>
            </div>

            <div className="ovf-nav-row">
              <button type="button" className="ovf-btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button type="submit" className="ovf-btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Verification'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
