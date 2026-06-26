import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './PropertyListingForm.css';

const PropertyListingForm = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('service');
    const [serviceType, setServiceType] = useState('list');
    const [propertyData, setPropertyData] = useState({
        serviceType: 'list',
        propertyType: 'pg',
        basicInfo: {
            propertyName: '',
            address: '',
            city: 'Noida',
            locality: '',
            pincode: '',
            landmark: '',
            totalFloors: '',
            propertyAge: '',
            propertyFacing: 'north',
            furnishing: 'semi-furnished',
            availableFrom: '',
            availableFor: 'both',
            preferredTenants: 'students',
            description: '',
        },
        propertyDetails: {
            propertyType: 'pg',
            roomType: 'single',
            sharingType: '1',
            totalRooms: 1,
            roomFacilities: [],
            commonAreas: [],
            amenities: {
                basic: [],
                security: [],
                additional: []
            },
            rules: [],
            additionalInfo: ''
        },
        pricing: {
            monthlyRent: '',
            securityDeposit: '',
            maintenance: '',
            electricityBill: 'included',
            foodIncluded: false,
            foodCost: '',
            otherCharges: []
        },
        photos: []
    });

    // Handle input changes for basic info
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPropertyData(prev => ({
            ...prev,
            basicInfo: {
                ...prev.basicInfo,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    // Handle property details changes
    const handleDetailsChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPropertyData(prev => ({
            ...prev,
            propertyDetails: {
                ...prev.propertyDetails,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    // Handle pricing changes
    const handlePricingChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPropertyData(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    // Handle checkbox changes for amenities
    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        const [category, item] = name.split('.');

        if (checked) {
            setPropertyData(prev => ({
                ...prev,
                propertyDetails: {
                    ...prev.propertyDetails,
                    [category]: [...prev.propertyDetails[category], item]
                }
            }));
        } else {
            setPropertyData(prev => ({
                ...prev,
                propertyDetails: {
                    ...prev.propertyDetails,
                    [category]: prev.propertyDetails[category].filter(x => x !== item)
                }
            }));
        }
    };

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        if (propertyData.photos.length + files.length > 20) {
            alert('Maximum 20 photos allowed');
            return;
        }
        setPropertyData(prev => ({
            ...prev,
            photos: [...prev.photos, ...files]
        }));
    };

    // Remove photo
    const handleRemovePhoto = (index) => {
        setPropertyData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Here you would typically make an API call to save the property
            console.log('Submitting property:', propertyData);
            // Navigate to success page or show success message
            // navigate('/success');
        } catch (error) {
            console.error('Error submitting property:', error);
        }
    };

    // Service Type Card Component
    const ServiceTypeCard = ({ title, description, value, icon }) => (
        <div 
            className={`service-card ${serviceType === value ? 'selected' : ''}`}
            onClick={() => {
                setServiceType(value);
                setPropertyData(prev => ({...prev, serviceType: value}));
            }}
        >
            <div className="service-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );

    // Render Service Type Selection
    const renderServiceType = () => (
        <div className="form-section">
            <h2>Choose Your Service Type</h2>
            <div className="service-grid">
                <ServiceTypeCard
                    title="List Your PG"
                    description="List your property and manage it yourself. Keep 100% of the rent."
                    value="list"
                    icon="🏠"
                />
                <ServiceTypeCard
                    title="List + Management"
                    description="We'll handle bookings, maintenance, and tenant management for you."
                    value="manage"
                    icon="🔑"
                />
                <ServiceTypeCard
                    title="List + Modification + Management"
                    description="We'll upgrade your property, handle bookings, and manage everything."
                    value="modify"
                    icon="✨"
                />
            </div>
            <div className="form-actions">
                <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('basic')}
                >
                    Continue to Basic Info
                </button>
            </div>
        </div>
    );

    // Render Basic Information Form
    const renderBasicInfo = () => (
        <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label>Property Name*</label>
                    <input
                        type="text"
                        name="propertyName"
                        value={propertyData.basicInfo.propertyName}
                        onChange={handleInputChange}
                        placeholder="e.g., Sunshine PG for Girls"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Address*</label>
                    <textarea
                        name="address"
                        value={propertyData.basicInfo.address}
                        onChange={handleInputChange}
                        placeholder="Full address of the property"
                        required
                        rows="3"
                    ></textarea>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>City*</label>
                        <input
                            type="text"
                            name="city"
                            value={propertyData.basicInfo.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Locality*</label>
                        <input
                            type="text"
                            name="locality"
                            value={propertyData.basicInfo.locality}
                            onChange={handleInputChange}
                            placeholder="e.g., Sector 62"
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Pincode*</label>
                        <input
                            type="text"
                            name="pincode"
                            value={propertyData.basicInfo.pincode}
                            onChange={handleInputChange}
                            pattern="[0-9]{6}"
                            title="Please enter a valid 6-digit pincode"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Landmark</label>
                        <input
                            type="text"
                            name="landmark"
                            value={propertyData.basicInfo.landmark}
                            onChange={handleInputChange}
                            placeholder="Nearby famous place"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Total Floors*</label>
                        <input
                            type="number"
                            name="totalFloors"
                            value={propertyData.basicInfo.totalFloors}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Property Age (years)</label>
                        <input
                            type="number"
                            name="propertyAge"
                            value={propertyData.basicInfo.propertyAge}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Property Facing*</label>
                        <select
                            name="propertyFacing"
                            value={propertyData.basicInfo.propertyFacing}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="north">North</option>
                            <option value="south">South</option>
                            <option value="east">East</option>
                            <option value="west">West</option>
                            <option value="north-east">North-East</option>
                            <option value="north-west">North-West</option>
                            <option value="south-east">South-East</option>
                            <option value="south-west">South-West</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Furnishing*</label>
                        <select
                            name="furnishing"
                            value={propertyData.basicInfo.furnishing}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="fully-furnished">Fully Furnished</option>
                            <option value="semi-furnished">Semi-Furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Available From*</label>
                        <input
                            type="date"
                            name="availableFrom"
                            value={propertyData.basicInfo.availableFrom}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Available For*</label>
                        <select
                            name="availableFor"
                            value={propertyData.basicInfo.availableFor}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="both">Both Boys & Girls</option>
                            <option value="boys">Boys Only</option>
                            <option value="girls">Girls Only</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Preferred Tenants*</label>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="preferredTenants"
                                value="students"
                                checked={propertyData.basicInfo.preferredTenants === 'students'}
                                onChange={handleInputChange}
                                required
                            />
                            <span>Students</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="preferredTenants"
                                value="professionals"
                                checked={propertyData.basicInfo.preferredTenants === 'professionals'}
                                onChange={handleInputChange}
                            />
                            <span>Professionals</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="preferredTenants"
                                value="both"
                                checked={propertyData.basicInfo.preferredTenants === 'both'}
                                onChange={handleInputChange}
                            />
                            <span>Both</span>
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Property Description*</label>
                    <textarea
                        name="description"
                        value={propertyData.basicInfo.description}
                        onChange={handleInputChange}
                        placeholder="Describe your property in detail..."
                        rows="4"
                        required
                    ></textarea>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('service')}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveTab('details')}
                >
                    Continue to Property Details
                </button>
            </div>
        </div>
    );

    // Render Property Details
    const renderPropertyDetails = () => (
        <div className="form-section">
            <h2>Property Details</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label>Property Type*</label>
                    <select
                        name="propertyType"
                        value={propertyData.propertyDetails.propertyType}
                        onChange={handleDetailsChange}
                        required
                    >
                        <option value="pg">PG/Hostel</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Room Type*</label>
                        <select
                            name="roomType"
                            value={propertyData.propertyDetails.roomType}
                            onChange={handleDetailsChange}
                            required
                        >
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="dormitory">Dormitory</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Sharing Type*</label>
                        <select
                            name="sharingType"
                            value={propertyData.propertyDetails.sharingType}
                            onChange={handleDetailsChange}
                            required
                        >
                            <option value="1">Single Occupancy</option>
                            <option value="2">Double Sharing</option>
                            <option value="3">Triple Sharing</option>
                            <option value="4">4+ Sharing</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Room Facilities*</label>
                    <div className="checkbox-group">
                        {['AC', 'TV', 'Geyser', 'Attached Bathroom', 'Wardrobe', 'Study Table'].map(item => (
                            <label key={item} className="checkbox-option">
                                <input
                                    type="checkbox"
                                    name={`roomFacilities.${item}`}
                                    checked={propertyData.propertyDetails.roomFacilities.includes(item)}
                                    onChange={handleCheckboxChange}
                                />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Common Areas</label>
                    <div className="checkbox-group">
                        {['Living Room', 'Kitchen', 'Dining Area', 'Balcony', 'Terrace', 'Garden'].map(area => (
                            <label key={area} className="checkbox-option">
                                <input
                                    type="checkbox"
                                    name={`commonAreas.${area}`}
                                    checked={propertyData.propertyDetails.commonAreas.includes(area)}
                                    onChange={handleCheckboxChange}
                                />
                                <span>{area}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Basic Amenities</label>
                    <div className="checkbox-group">
                        {['Water Supply', 'Power Backup', 'Lift', 'Housekeeping', 'Laundry'].map(amenity => (
                            <label key={amenity} className="checkbox-option">
                                <input
                                    type="checkbox"
                                    name={`amenities.basic.${amenity}`}
                                    checked={propertyData.propertyDetails.amenities.basic.includes(amenity)}
                                    onChange={handleCheckboxChange}
                                />
                                <span>{amenity}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Security Features</label>
                    <div className="checkbox-group">
                        {['CCTV', 'Security Guard', 'Fire Extinguisher', 'First Aid Kit'].map(security => (
                            <label key={security} className="checkbox-option">
                                <input
                                    type="checkbox"
                                    name={`amenities.security.${security}`}
                                    checked={propertyData.propertyDetails.amenities.security.includes(security)}
                                    onChange={handleCheckboxChange}
                                />
                                <span>{security}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Additional Rules</label>
                    <div className="checkbox-group">
                        {['No Smoking', 'No Pets', 'No Outside Food', 'No Alcohol', 'No Visitors'].map(rule => (
                            <label key={rule} className="checkbox-option">
                                <input
                                    type="checkbox"
                                    name={`rules.${rule}`}
                                    checked={propertyData.propertyDetails.rules.includes(rule)}
                                    onChange={handleCheckboxChange}
                                />
                                <span>{rule}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Additional Information</label>
                    <textarea
                        name="additionalInfo"
                        value={propertyData.propertyDetails.additionalInfo}
                        onChange={handleDetailsChange}
                        placeholder="Any other details about your property..."
                        rows="3"
                    ></textarea>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('basic')}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveTab('pricing')}
                >
                    Continue to Pricing
                </button>
            </div>
        </div>
    );

    // Render Pricing Section
    const renderPricing = () => (
        <div className="form-section">
            <h2>Pricing Details</h2>
            <div className="form-grid">
                <div className="form-row">
                    <div className="form-group">
                        <label>Monthly Rent (₹)*</label>
                        <input
                            type="number"
                            name="monthlyRent"
                            value={propertyData.pricing.monthlyRent}
                            onChange={handlePricingChange}
                            placeholder="e.g., 10000"
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>Security Deposit (₹)*</label>
                        <input
                            type="number"
                            name="securityDeposit"
                            value={propertyData.pricing.securityDeposit}
                            onChange={handlePricingChange}
                            placeholder="e.g., 20000"
                            required
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Maintenance (₹/month)</label>
                        <input
                            type="number"
                            name="maintenance"
                            value={propertyData.pricing.maintenance}
                            onChange={handlePricingChange}
                            placeholder="e.g., 1000"
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>Electricity Bill*</label>
                        <select
                            name="electricityBill"
                            value={propertyData.pricing.electricityBill}
                            onChange={handlePricingChange}
                            required
                        >
                            <option value="included">Included in Rent</option>
                            <option value="metered">Metered (Pay as per use)</option>
                            <option value="fixed">Fixed Amount (₹/unit)</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="checkbox-option">
                        <input
                            type="checkbox"
                            name="foodIncluded"
                            checked={propertyData.pricing.foodIncluded}
                            onChange={handlePricingChange}
                        />
                        <span>Food Included</span>
                    </label>
                </div>

                {propertyData.pricing.foodIncluded && (
                    <div className="form-group">
                        <label>Food Plan (₹/month)</label>
                        <input
                            type="number"
                            name="foodCost"
                            value={propertyData.pricing.foodCost}
                            onChange={handlePricingChange}
                            placeholder="e.g., 3000"
                            min="0"
                        />
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActiveTab('details')}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setActiveTab('photos')}
                    >
                        Continue to Photos
                    </button>
                </div>
            </div>
        </div>
    );

    // Render Photos Section
    const renderPhotos = () => (
        <div className="form-section">
            <h2>Upload Photos</h2>
            <div className="form-grid">
                <div className="photo-upload-container">
                    <div className="photo-upload-box">
                        <input
                            type="file"
                            id="property-photos"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="property-photos" className="photo-upload-label">
                            <div className="upload-icon">+</div>
                            <p>Click to upload photos or drag and drop</p>
                            <small>Minimum 5 photos required (Max 20)</small>
                        </label>
                    </div>
                    
                    <div className="photo-preview">
                        {propertyData.photos.map((photo, index) => (
                            <div key={index} className="photo-thumbnail">
                                <img src={URL.createObjectURL(photo)} alt={`Property ${index + 1}`} />
                                <button
                                    type="button"
                                    className="remove-photo"
                                    onClick={() => handleRemovePhoto(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActiveTab('pricing')}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setActiveTab('review')}
                        disabled={propertyData.photos.length < 5}
                    >
                        Review Your Listing
                    </button>
                </div>
            </div>
        </div>
    );

    // Render Review Section
    const renderReview = () => {
        const { basicInfo, propertyDetails, pricing, photos } = propertyData;

        return (
            <div className="form-section">
                <h2>Review Your Listing</h2>
                <div className="review-container">
                    <div className="review-section">
                        <h3>Basic Information</h3>
                        <div className="review-details">
                            <p><strong>Property Name:</strong> {basicInfo.propertyName}</p>
                            <p><strong>Address:</strong> {basicInfo.address}</p>
                            <p><strong>City:</strong> {basicInfo.city}</p>
                            <p><strong>Locality:</strong> {basicInfo.locality}</p>
                            <p><strong>Pincode:</strong> {basicInfo.pincode}</p>
                            <p><strong>Property Facing:</strong> {basicInfo.propertyFacing}</p>
                            <p><strong>Furnishing:</strong> {basicInfo.furnishing}</p>
                            <p><strong>Available From:</strong> {basicInfo.availableFrom}</p>
                            <p><strong>Available For:</strong> {basicInfo.availableFor}</p>
                            <p><strong>Preferred Tenants:</strong> {basicInfo.preferredTenants}</p>
                        </div>
                    </div>

                    <div className="review-section">
                        <h3>Property Details</h3>
                        <div className="review-details">
                            <p><strong>Property Type:</strong> {propertyDetails.propertyType}</p>
                            <p><strong>Room Type:</strong> {propertyDetails.roomType}</p>
                            <p><strong>Sharing Type:</strong> {propertyDetails.sharingType}</p>
                            <p><strong>Room Facilities:</strong> {propertyDetails.roomFacilities.join(', ')}</p>
                            <p><strong>Common Areas:</strong> {propertyDetails.commonAreas.join(', ')}</p>
                            <p><strong>Basic Amenities:</strong> {propertyDetails.amenities.basic.join(', ')}</p>
                            <p><strong>Security Features:</strong> {propertyDetails.amenities.security.join(', ')}</p>
                            <p><strong>Rules:</strong> {propertyDetails.rules.join(', ')}</p>
                        </div>
                    </div>

                    <div className="review-section">
                        <h3>Pricing</h3>
                        <div className="review-details">
                            <p><strong>Monthly Rent:</strong> ₹{pricing.monthlyRent}</p>
                            <p><strong>Security Deposit:</strong> ₹{pricing.securityDeposit}</p>
                            <p><strong>Maintenance:</strong> {pricing.maintenance ? `₹${pricing.maintenance}/month` : 'N/A'}</p>
                            <p><strong>Electricity Bill:</strong> {pricing.electricityBill}</p>
                            {pricing.foodIncluded && (
                                <p><strong>Food Plan:</strong> ₹{pricing.foodCost}/month</p>
                            )}
                        </div>
                    </div>

                    <div className="review-section">
                        <h3>Photos</h3>
                        <div className="photo-preview">
                            {photos.map((photo, index) => (
                                <div key={index} className="photo-thumbnail">
                                    <img src={URL.createObjectURL(photo)} alt={`Property ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setActiveTab('photos')}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Submit Property
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Handle step click
    const handleStepClick = (step) => {
        const steps = ['service', 'basic', 'details', 'pricing', 'photos', 'review'];
        const currentStepIndex = steps.indexOf(activeTab);
        const clickedStepIndex = steps.indexOf(step);
        
        // Allow going back to previous steps
        if (clickedStepIndex < currentStepIndex) {
            setActiveTab(step);
        }
    };

    // Get current step index
    const getCurrentStepIndex = () => {
        const steps = ['service', 'basic', 'details', 'pricing', 'photos', 'review'];
        return steps.indexOf(activeTab);
    };

    return (
        <div className="property-listing-container">
            <Helmet>
              <title>List Your PG Property | OvikaLiving</title>
              <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="form-header">
                <h1>List Your PG Property</h1>
                <p>Reach thousands of potential tenants with our platform</p>
            </div>
            
            <div className="property-form">
                <div className="progress-steps">
                    {['service', 'basic', 'details', 'pricing', 'photos', 'review'].map((step, index) => {
                        const stepNumber = index + 1;
                        const isActive = activeTab === step;
                        const isCompleted = getCurrentStepIndex() > index;
                        
                        return (
                            <div 
                                key={step} 
                                className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                onClick={() => handleStepClick(step)}
                            >
                                <div className="step-number">
                                    {isCompleted ? '✓' : stepNumber}
                                </div>
                                <div className="step-name">
                                    {step.charAt(0).toUpperCase() + step.slice(1)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="form-content">
                    {activeTab === 'service' && renderServiceType()}
                    {activeTab === 'basic' && renderBasicInfo()}
                    {activeTab === 'details' && renderPropertyDetails()}
                    {activeTab === 'pricing' && renderPricing()}
                    {activeTab === 'photos' && renderPhotos()}
                    {activeTab === 'review' && renderReview()}
                </div>
            </div>
        </div>
    );
};

export default PropertyListingForm;