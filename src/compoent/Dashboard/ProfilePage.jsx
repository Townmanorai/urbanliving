import React, { useState, useContext, useEffect } from "react";
import { FaEdit, FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./ProfilePage.css";

import { AuthContext } from "../Login/AuthContext";

const API_BASE_AUTH = "https://www.townmanor.ai/api/auth";
const API_BASE = "https://www.townmanor.ai/api"; // General API base

const ProfilePage = () => {
  const { user, login } = useContext(AuthContext);

  // password visibility
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // password values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // modal & editable profile fields
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editPhone, setEditPhone] = useState(user?.phone_number || "");

  // Verification & Extended Details
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panVerified, setPanVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Fetch extended user details on mount
  useEffect(() => {
    if (user?.id) {
      setEditUsername(user.username || "");
      setEditEmail(user.email || "");
      setEditPhone(user.phone_number || "");

      fetch(`${API_BASE}/users-list/${user.id}`, {
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
            const userData = data.data || data; // Handle potential wrapper
            
            // Helper to decode Buffer if present
            const decodeValue = (val) => {
                if (val && typeof val === 'object' && val.type === 'Buffer' && Array.isArray(val.data)) {
                    return String.fromCharCode(...val.data);
                }
                return val;
            };

          if (userData) { 
            if (userData.pan_number) setPanNumber(decodeValue(userData.pan_number));
            if (userData.aadhaar_number) setAadhaarNumber(decodeValue(userData.aadhaar_number));
            
            // Check verification status (boolean or 1/0)
            setPanVerified(!!userData.pan_verified);
            setAadhaarVerified(!!userData.aadhaar_verified);
          }
        })
        .catch(e => console.error("Error fetching user details", e));
    }
  }, [user]);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const verifyIdentity = async () => {
    if (!panNumber || !aadhaarNumber) {
      alert("Please enter both PAN and Aadhaar number to verify linkage.");
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch("https://kyc-api.surepass.io/api/v1/pan/pan-aadhaar-link-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE0NjA5NiwianRpIjoiNmM0YWMxNTMtNDE2MS00YzliLWI4N2EtZWIxYjhmNDRiOTU5IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJ5MTV1OWk0MW10bjR3eWpsaTh6b2p6eXZiZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMDE0NjA5NiwiZXhwIjoyMzQwODY2MDk2LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.DfipEQt4RqFBQbOK29jbQju3slpn0wF9aoccdmtIsPg"
        },
        body: JSON.stringify({
          pan_number: panNumber,
          aadhaar_number: aadhaarNumber
        })
      });
      const data = await res.json();
      
      if (data.success || data.status_code === 200) {
        setPanVerified(true);
        setAadhaarVerified(true);
        alert("Verification Successful! PAN and Aadhaar are linked.");
      } else {
        setPanVerified(false);
        setAadhaarVerified(false);
        alert("Verification Failed: " + (data.message || "Details mismatch or invalid"));
      }
    } catch (e) {
      console.error("Identity verification error", e);
      alert("Error contacting verification service.");
    } finally {
      setVerifying(false);
    }
  };

  const updateProfile = async () => {
    setLoadingProfile(true);
    try {
      // 1. Update Basic Info (Auth) - Only if changed
      const basicChanges = {};
      if (editUsername !== user?.username) basicChanges.username = editUsername;
      if (editEmail !== user?.email) basicChanges.email = editEmail;
      if (editPhone !== (user?.phone_number || "")) basicChanges.phone_number = editPhone || null;

      // Only call AUTH update-profile if there are actual changes to basic info
      if (Object.keys(basicChanges).length > 0) {
         if (user?.id) basicChanges.userId = user.id;
         
         const res = await fetch(`${API_BASE_AUTH}/update-profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(basicChanges),
        });
        const data = await res.json();
        
        if (!res.ok) {
           throw new Error(data?.message || "Failed to update basic info");
        }
        
        // Update local user context
        login({ ...(user || {}), ...data.user });
      }

      // 2. Update Verification/Extended Details via USERS-LIST API
      // Logic: Try POST first (create). If duplicate (400/500), try PUT (update).
      // 2. Update Verification/Extended Details via USER-DETAILS API
      // Since the screenshot shows the data is in 'user_details' table, we use that endpoint.
      let detailsSuccess = false;
      try {
        const basePayload = {
            user_id: user?.id, // Crucial for user_details table
            pan_number: panNumber,
            aadhaar_number: aadhaarNumber,
            pan_verified: panVerified ? 1 : 0,
            aadhaar_verified: aadhaarVerified ? 1 : 0
        };

        // Attempt POST (Create new entry in user_details)
        console.log("Attempting POST to user-details...");
        let resDetails = await fetch(`${API_BASE}/user-details`, {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(basePayload),
        });
        
        let dData = null;
        if(resDetails.ok) {
            dData = await resDetails.json();
            console.log("Details saved (POST):", dData);
            detailsSuccess = true;
        } else {
            const dErr = await resDetails.json();
            console.warn("POST failed:", resDetails.status, dErr);

            const sErrMsg = JSON.stringify(dErr).toLowerCase();
            
            // Checks for 'duplicate' or existing entry, then falls back to PUT
            // Since this is user_details, typical error is "Duplicate entry for user_id"
            if (resDetails.status === 500 || resDetails.status === 400 || resDetails.status === 409) {
                 if (sErrMsg.includes("duplicate") || sErrMsg.includes("already exists")) {
                     console.log("Entry exists, attempting PUT update to user-details...");
                     
                     // Fallback to PUT /user-details (which typically uses body, not ID in URL for this specific endpoint design seen before)
                     // Or if it follows standard REST: /user-details (PUT with user_id in body) or /user-details?user_id=...
                     // Based on previous context, we'll try the base endpoint with PUT or the logic we saw earlier.
                     // IMPORTANT: Your previous code used `api/user-details` for POST. Let's assume PUT works there too or we need to handle it.
                     // Actually, if POST fails, we just want to UPDATE.
                     
                     const resPut = await fetch(`${API_BASE}/user-details`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(basePayload),
                     });
                     
                     if (resPut.ok) {
                         dData = await resPut.json();
                         console.log("Details updated (Fallback PUT):", dData);
                         detailsSuccess = true;
                     } else {
                         const putErr = await resPut.json();
                         console.warn("Fallback PUT failed:", putErr);
                         alert("Warning: Could not save verification details. " + (putErr.message || ""));
                     }
                 } else {
                     alert("Warning: Verification details save failed. " + (dErr.message || ""));
                 }
            } else {
                 alert("Warning: Verification details save failed. Status: " + resDetails.status);
            }
        }
      } catch (e) {
         console.error("Secondary update failed", e);
         alert("Warning: Verification details could not be saved. Network error?");
      }

      alert("Profile updated successfully!");
      setShowModal(false);

    } catch (e) {
      console.error("Update profile error", e);
      alert("Error: " + e.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    setLoadingPassword(true);
    try {
      const res = await fetch(`${API_BASE_AUTH}/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword, userId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to update password");
        return;
      }
      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      console.error("Update password error", e);
      alert("Server error during password update");
    } finally {
      setLoadingPassword(false);
    }
  };

  const joinDateDisplay = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "-";

  return (
    <div className="profilePage__container">
      {/* Profile Details */}
      <div className="profilePage__card">
        <div className="profilePage__header">
          <h2 className="profilePage__title">Profile Details</h2>
          <button
            className="profilePage__editBtn"
            onClick={() => setShowModal(true)}
            disabled={!user}
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="profilePage__formGroup">
          <label className="profilePage__label">Username</label>
          <input className="profilePage__input" type="text" value={user?.username || ""} disabled />
        </div>

        <div className="profilePage__formGroup">
          <label className="profilePage__label">Email</label>
          <input className="profilePage__input" type="email" value={user?.email || ""} disabled />
        </div>

        <div className="profilePage__formGroup">
          <label className="profilePage__label">Phone</label>
          <input className="profilePage__input" type="tel" value={user?.phone_number || ""} disabled />
        </div>

         <div className="profilePage__formGroup">
          <label className="profilePage__label">PAN Number</label>
          <div style={{ display: "flex", alignItems: "center" }}>
             <input className="profilePage__input" type="text" value={panNumber || "Not Provided"} disabled style={{ flex: 1 }} />
             {panNumber && (
                panVerified ? 
                <span className="status-badge verified"><FaCheckCircle /> Verified</span> : 
                <span className="status-badge not-verified"><FaTimesCircle /> Not Verified</span>
             )}
          </div>
        </div>

         <div className="profilePage__formGroup">
          <label className="profilePage__label">Aadhaar Number</label>
           <div style={{ display: "flex", alignItems: "center" }}>
            <input className="profilePage__input" type="text" value={aadhaarNumber || "Not Provided"} disabled style={{ flex: 1 }} />
            {aadhaarNumber && (
                aadhaarVerified ? 
                <span className="status-badge verified"><FaCheckCircle /> Verified</span> : 
                <span className="status-badge not-verified"><FaTimesCircle /> Not Verified</span>
            )}
           </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="profilePage__card">
        <h2 className="profilePage__title">Change Password</h2>

        <div className="profilePage__formGroup profilePage__passwordField">
          <label className="profilePage__label">Current Password</label>
          <input
            className="profilePage__input"
            type={showPassword.current ? "text" : "password"}
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <FaEye onClick={() => togglePassword("current")} className="profilePage__icon" />
        </div>

        <div className="profilePage__formGroup profilePage__passwordField">
          <label className="profilePage__label">New Password</label>
          <input
            className="profilePage__input"
            type={showPassword.new ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FaEye onClick={() => togglePassword("new")} className="profilePage__icon" />
        </div>

        <div className="profilePage__formGroup profilePage__passwordField">
          <label className="profilePage__label">Confirm New Password</label>
          <input
            className="profilePage__input"
            type={showPassword.confirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FaEye onClick={() => togglePassword("confirm")} className="profilePage__icon" />
        </div>

        <p className="profilePage__note">
          Password must be at least 6 characters long.
        </p>

        <button className="profilePage__updateBtn" onClick={updatePassword} disabled={loadingPassword}>
          {loadingPassword ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="profilePage__modalOverlay">
          <div className="profilePage__modal">
            <h2 className="profilePage__modalTitle">Edit Profile & Verification</h2>

            <div className="profilePage__formGroup">
              <label className="profilePage__label">Username</label>
              <input
                className="profilePage__input"
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />
            </div>

            <div className="profilePage__formGroup">
              <label className="profilePage__label">Email</label>
              <input
                className="profilePage__input"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>

            <div className="profilePage__formGroup">
              <label className="profilePage__label">Phone</label>
              <input
                className="profilePage__input"
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>

            <hr style={{margin: '15px 0', border: 'none', borderTop: '1px solid #eee'}}/>
            <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Identity Verification</h3>
            
            <div className="profilePage__formGroup">
              <label className="profilePage__label">PAN Number</label>
              <input
                className="profilePage__input"
                type="text"
                placeholder="Enter PAN Number"
                value={panNumber}
                onChange={(e) => {
                    setPanNumber(e.target.value.toUpperCase());
                    setPanVerified(false); // Reset verification on change
                }}
              />
            </div>

             <div className="profilePage__formGroup">
              <label className="profilePage__label">Aadhaar Number</label>
              <input
                className="profilePage__input"
                type="text"
                placeholder="Enter Aadhaar Number"
                value={aadhaarNumber}
                onChange={(e) => {
                     setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12));
                     setAadhaarVerified(false); // Reset verification on change
                }}
              />
            </div>

             <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button 
                    className="profilePage__updateBtn" 
                    style={{ backgroundColor: (panVerified && aadhaarVerified) ? '#4CAF50' : '#2196F3', width: 'auto', padding: '0 20px' }}
                    onClick={verifyIdentity}
                    disabled={verifying || !panNumber || !aadhaarNumber}
                >
                    {verifying ? "Verifying..." : (panVerified && aadhaarVerified) ? "Verified" : "Verify PAN & Aadhaar"}
                </button>
             </div>


            <div className="profilePage__modalActions">
              <button className="profilePage__cancelBtn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="profilePage__saveBtn" onClick={updateProfile} disabled={loadingProfile}>
                {loadingProfile ? "Saving..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;