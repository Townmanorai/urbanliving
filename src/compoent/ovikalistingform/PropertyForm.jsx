import React, { useState } from 'react';
import './tmx9pf-form.css';

const PropertyForm = () => {
  // Form state with all fields matching the API structure
  const [formData, setFormData] = useState({
    // Property Information
    property_name: "",
    property_type: "Villa",
    property_category: "Luxury",
    space_description: "",
    guest_access: "",
    interaction: "",
    neighborhood: "",
    other_notes: "",
    pin: "",
    zipcode: "",
    
    // Location
    country: "India",
    latitude: "",
    longitude: "",
    registration_number: "",
    local_compliance: "",
    
    // Property Details
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    area: "",
    amenities: [],
    
    // Policies
    check_in_time: "15:00:00",
    check_out_time: "11:00:00",
    smoking_allowed: 0,
    pets_allowed: 0,
    events_allowed: 0,
    quiet_hours: "22:00-07:00",
    max_guests: 2,
    
    // Pricing
    base_rate: "",
    weekend_rate: "",
    weekly_discount_pct: "",
    monthly_discount_pct: "",
    cleaning_fee: "",
    security_deposit: "",
    additional_guest_fee: "",
    min_stay: 1,
    max_stay: 30,
    booking_window_days: 365,
    
    // Check-in
    self_check_in: "",
    key_exchange: "",
    host_meetup: "",
    
    // Additional
    cover_photo_index: 0,
    cancellation_policy: "Flexible",
    insurance: 0,
    damage_protection: 0,
    host_id: 123
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  // Handle number inputs
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the data for API
      const payload = {
        ...formData,
        // Ensure numeric fields are properly formatted
        base_rate: Number(formData.base_rate) || 0,
        weekend_rate: Number(formData.weekend_rate) || 0,
        weekly_discount_pct: Number(formData.weekly_discount_pct) || 0,
        monthly_discount_pct: Number(formData.monthly_discount_pct) || 0,
        cleaning_fee: Number(formData.cleaning_fee) || 0,
        security_deposit: Number(formData.security_deposit) || 0,
        additional_guest_fee: Number(formData.additional_guest_fee) || 0,
      };

      // Remove any empty strings or null values
      Object.keys(payload).forEach(key => {
        if (payload[key] === '' || payload[key] === null) {
          delete payload[key];
        }
      });

      // Make API call
      const response = await fetch('https://www.townmanor.ai/api/ovika/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      console.log('Success:', data);
      alert('Property listed successfully!');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form field components
  const TextField = ({ name, label, type = 'text', placeholder = '' }) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const NumberField = ({ name, label, min = 0, step = 1 }) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="number"
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleNumberChange}
        min={min}
        step={step}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const Toggle = ({ name, label, value, onChange }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
        <label className={`btn btn-outline-secondary ${value === 1 ? 'active' : ''}`}>
          <input
            type="radio"
            name={name}
            checked={value === 1}
            onChange={() => onChange(1)}
          /> Yes
        </label>
        <label className={`btn btn-outline-secondary ${value === 0 ? 'active' : ''}`}>
          <input
            type="radio"
            name={name}
            checked={value === 0}
            onChange={() => onChange(0)}
          /> No
        </label>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Basic Information</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <TextField 
                  name="property_name" 
                  label="Property Name" 
                  placeholder="Enter property name"
                />
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Property Type</label>
                  <select 
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Cabin">Cabin</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="space_description"
                value={formData.space_description}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Describe your property"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Location</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <TextField 
                  name="country" 
                  label="Country" 
                  value="India" 
                  readOnly 
                />
              </div>
              <div className="col-md-6">
                <TextField 
                  name="pin" 
                  label="PIN Code" 
                  placeholder="Enter PIN code"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <TextField 
                  name="latitude" 
                  label="Latitude" 
                  type="number" 
                  step="0.000001"
                  placeholder="e.g. 19.0760"
                />
              </div>
              <div className="col-md-6">
                <TextField 
                  name="longitude" 
                  label="Longitude" 
                  type="number" 
                  step="0.000001"
                  placeholder="e.g. 72.8777"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Property Details</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <NumberField name="bedrooms" label="Bedrooms" min="1" />
              </div>
              <div className="col-md-4">
                <NumberField name="beds" label="Beds" min="1" />
              </div>
              <div className="col-md-4">
                <NumberField name="bathrooms" label="Bathrooms" min="1" step="0.5" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <TextField 
                  name="area" 
                  label="Area (sq ft)" 
                  type="number" 
                  placeholder="e.g. 1500"
                />
              </div>
              <div className="col-md-6">
                <NumberField 
                  name="max_guests" 
                  label="Maximum Guests" 
                  min="1" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Pricing</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <TextField 
                  name="base_rate" 
                  label="Base Rate (₹)" 
                  type="number" 
                  min="0"
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="col-md-4">
                <TextField 
                  name="weekend_rate" 
                  label="Weekend Rate (₹)" 
                  type="number" 
                  min="0"
                  placeholder="e.g. 6000"
                />
              </div>
              <div className="col-md-4">
                <TextField 
                  name="cleaning_fee" 
                  label="Cleaning Fee (₹)" 
                  type="number" 
                  min="0"
                  placeholder="e.g. 500"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <TextField 
                  name="security_deposit" 
                  label="Security Deposit (₹)" 
                  type="number" 
                  min="0"
                  placeholder="e.g. 2000"
                />
              </div>
              <div className="col-md-4">
                <TextField 
                  name="additional_guest_fee" 
                  label="Additional Guest Fee (₹)" 
                  type="number" 
                  min="0"
                  placeholder="e.g. 500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Policies</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Check-in Time</label>
                  <select
                    name="check_in_time"
                    value={formData.check_in_time}
                    onChange={handleChange}
                    className="form-control"
                  >
                    {Array.from({ length: 48 }, (_, i) => {
                      const h = Math.floor(i / 2);
                      const m = i % 2 === 0 ? '00' : '30';
                      const ampm = h < 12 ? 'AM' : 'PM';
                      const h12 = h % 12 === 0 ? 12 : h % 12;
                      const val = `${String(h).padStart(2,'0')}:${m}:00`;
                      return <option key={val} value={val}>{`${h12}:${m} ${ampm}`}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Check-out Time</label>
                  <select
                    name="check_out_time"
                    value={formData.check_out_time}
                    onChange={handleChange}
                    className="form-control"
                  >
                    {Array.from({ length: 48 }, (_, i) => {
                      const h = Math.floor(i / 2);
                      const m = i % 2 === 0 ? '00' : '30';
                      const ampm = h < 12 ? 'AM' : 'PM';
                      const h12 = h % 12 === 0 ? 12 : h % 12;
                      const val = `${String(h).padStart(2,'0')}:${m}:00`;
                      return <option key={val} value={val}>{`${h12}:${m} ${ampm}`}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Cancellation Policy</label>
                  <select 
                    name="cancellation_policy"
                    value={formData.cancellation_policy}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Flexible">Flexible</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Strict">Strict</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <NumberField 
                  name="min_stay" 
                  label="Minimum Stay (nights)" 
                  min="1" 
                />
              </div>
              <div className="col-md-4">
                <NumberField 
                  name="max_stay" 
                  label="Maximum Stay (nights)" 
                  min="1" 
                />
              </div>
              <div className="col-md-4">
                <NumberField 
                  name="booking_window_days" 
                  label="Booking Window (days)" 
                  min="1" 
                  max="365"
                />
              </div>
            </div>
          </div>
        </div>

        {/* House Rules */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>House Rules</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <Toggle 
                  name="smoking_allowed"
                  label="Smoking Allowed"
                  value={formData.smoking_allowed}
                  onChange={(value) => setFormData(prev => ({ ...prev, smoking_allowed: value }))}
                />
              </div>
              <div className="col-md-4">
                <Toggle 
                  name="pets_allowed"
                  label="Pets Allowed"
                  value={formData.pets_allowed}
                  onChange={(value) => setFormData(prev => ({ ...prev, pets_allowed: value }))}
                />
              </div>
              <div className="col-md-4">
                <Toggle 
                  name="events_allowed"
                  label="Events Allowed"
                  value={formData.events_allowed}
                  onChange={(value) => setFormData(prev => ({ ...prev, events_allowed: value }))}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <TextField 
                  name="quiet_hours" 
                  label="Quiet Hours (e.g., 22:00-07:00)" 
                  placeholder="e.g. 22:00-07:00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Additional Information</h4>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Guest Access</label>
              <textarea
                name="guest_access"
                value={formData.guest_access}
                onChange={handleChange}
                className="form-control"
                rows="2"
                placeholder="What areas of your property can guests access?"
              />
            </div>
            <div className="form-group">
              <label>Interaction with Guests</label>
              <textarea
                name="interaction"
                value={formData.interaction}
                onChange={handleChange}
                className="form-control"
                rows="2"
                placeholder="How much interaction will you have with guests?"
              />
            </div>
            <div className="form-group">
              <label>Neighborhood</label>
              <textarea
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                className="form-control"
                rows="2"
                placeholder="Describe the neighborhood"
              />
            </div>
            <div className="form-group">
              <label>Other Notes</label>
              <textarea
                name="other_notes"
                value={formData.other_notes}
                onChange={handleChange}
                className="form-control"
                rows="2"
                placeholder="Any other important information for guests?"
              />
            </div>
          </div>
        </div>

        {/* Host Information */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Host Information</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <NumberField 
                  name="host_id" 
                  label="Host ID" 
                  min="1" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mb-5">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
