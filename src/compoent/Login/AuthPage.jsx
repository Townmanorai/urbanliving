
import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import "./AuthPage.css";
import { useNavigate, useLocation, Navigate } from "react-router";
import { AuthContext } from "./AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const API_BASE = "https://www.townmanor.ai/api";
const STORAGE_KEY = "user"; // keep same as AuthContext

export default function AuthPage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  // Already logged in — send away, replacing this entry so back won't return here
  if (user) return <Navigate to={redirectTo} replace />;

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // NEW: Confirm password field
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot password states (not modified)
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newPwd2, setNewPwd2] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  // Helper: normalize possible response shapes into a user object (if present)
  const extractUserFromResponse = (data) => {
    if (!data) return null;
    if (data.user) return data.user;
    if (data.data?.user) return data.data.user;
    if (data.data && typeof data.data === "object" && (data.data._id || data.data.id)) return data.data;
    if (data.userData) return data.userData;
    if (data._id || data.id) return data;
    return null;
  };

  // Perform a login request (used by manual login only)
  const performLoginRequest = async (emailParam, passwordParam) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam, password: passwordParam }),
        credentials: "include",
      });
      const d = await res.json().catch(() => ({}));
      console.log("performLoginRequest:", res.status, d);
      if (!res.ok) throw d;
      return extractUserFromResponse(d) || d;
    } catch (err) {
      console.error("performLoginRequest error:", err);
      return null;
    }
  };

  // Wait for localStorage/context to sync (small helper) — returns parsed user or null
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function waitForLocalUser(timeout = 5000, interval = 200) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      // 1) context
      if (user && (user.id || user._id || user.owner_id)) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch (e) {}
        return user;
      }
      // 2) localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.id || parsed._id || parsed.owner_id)) return parsed;
        }
      } catch (e) { /* ignore parse errors */ }
      await sleep(interval);
    }
    return null;
  }

  // ---------- SIGNUP ----------
  const handleSignup = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please enter the same password in both fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, phone_number: phone || null }),
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = data?.message || data?.error || data?.errors?.[0]?.msg || "Account creation failed. Please try again.";
        setErrorMsg(msg);
        setSubmitting(false);
        return;
      }
      setSuccessMsg("Account created successfully! Please sign in to continue.");
      setIsLogin(true);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMsg("Unable to connect to server. Please check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- LOGIN ----------
  const handleLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = data?.message || data?.error || data?.errors?.[0]?.msg || "Invalid email or password. Please try again.";
        setErrorMsg(msg);
        setSubmitting(false);
        return;
      }
      const userObj = extractUserFromResponse(data) || data;
      try {
        await login(userObj);
      } catch (err) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj)); } catch (e) {}
      }
      let synced = null;
      try { synced = await waitForLocalUser(5000, 200); } catch (e) {}
      if (!synced) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj)); synced = userObj; } catch (e) {}
      }
      if (!synced) {
        setErrorMsg("Login succeeded but session could not be saved. Please try again.");
        setSubmitting(false);
        return;
      }
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMsg("Unable to connect to server. Please check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // submit handler
  const onSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (isLogin) handleLogin();
    else handleSignup();
  };

  // ---------- Forgot password handlers (kept same) ----------
  const openForgot = (e) => {
    e.preventDefault();
    setForgotOpen(true);
    setForgotStep(1);
    setForgotEmail("");
    setNewPwd("");
    setNewPwd2("");
  };
  const closeForgot = () => {
    if (forgotSubmitting) return;
    setForgotOpen(false);
  };
  const [forgotError, setForgotError] = useState("");
  const proceedForgotStep1 = () => {
    const emailTrim = (forgotEmail || "").trim();
    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setForgotError("Please enter a valid email address.");
      return;
    }
    setForgotError("");
    setForgotStep(2);
  };
  const submitForgot = async () => {
    const pwd = (newPwd || "").trim();
    const pwd2 = (newPwd2 || "").trim();
    if (pwd.length < 6) {
      setForgotError("New password must be at least 6 characters.");
      return;
    }
    if (pwd !== pwd2) {
      setForgotError("Passwords do not match.");
      return;
    }
    setForgotError("");
    setForgotSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim(), newPassword: pwd }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || data?.errors?.[0]?.msg || "Password reset failed. Please try again.";
        setForgotError(msg);
        setForgotSubmitting(false);
        return;
      }
      setForgotOpen(false);
      setEmail(forgotEmail.trim());
      setPassword("");
      setIsLogin(true);
      setSuccessMsg(data?.message || "Password reset successfully! Please sign in with your new password.");
    } catch (err) {
      setForgotError("Unable to connect to server. Please try again.");
    } finally {
      setForgotSubmitting(false);
    }
  };

  // ---------- JSX ----------
  return (
    <div className="auth-container">
      <Helmet>
        <title>Login / Sign Up | OvikaLiving – Book PG & Co-Living in Noida</title>
        <meta name="description" content="Sign in or create your OvikaLiving account to book PG, co-living spaces and furnished stays in Noida & Greater Noida. Fast, secure login for tenants and property owners." />
        <meta name="keywords" content="ovikaliving login, ovika sign up, pg booking login noida, co-living login noida, ovika account, tenant login noida, property owner login ovika, लॉगिन ओविका, ओविका अकाउंट बनाएं, पीजी बुकिंग लॉगिन नोएडा, किरायेदार लॉगिन नोएडा, नोएडा पीजी साइन अप, ओविका लिविंग लॉगिन" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="auth-illustration">
        <img src="/ill.webp" alt="illustration" />
      </div>

      <div className="auth-form-container">
        <div className="auth-toggle">
          <button className={isLogin ? "auth-toggle-btn active" : "auth-toggle-btn"} onClick={() => { setIsLogin(true); setErrorMsg(""); setSuccessMsg(""); }}>Sign In</button>
          <button className={!isLogin ? "auth-toggle-btn active" : "auth-toggle-btn"} onClick={() => { setIsLogin(false); setErrorMsg(""); setSuccessMsg(""); }}>Sign Up</button>
        </div>

        <h2 className="auth-title">{isLogin ? "Welcome back" : "Create an account"}</h2>
        <p className="auth-subtitle">{isLogin ? "Please enter your details to sign in" : "Please enter your details to sign up"}</p>

        <form className="auth-form" onSubmit={onSubmit}>
          {!isLogin && (
            <>
              <label>Username</label>
              <input type="text" placeholder="Enter your name" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <label>Phone</label>
              <input type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </>
          )}

          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password</label>
          <div className="password-input">
            <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="toggle-visibility" onClick={() => setShowPassword((p) => !p)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {/* NEW: Confirm Password field (only shown during signup) */}
          {!isLogin && (
            <>
              <label>Confirm Password</label>
              <div className="password-input">
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="button" className="toggle-visibility" onClick={() => setShowConfirmPassword((p) => !p)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </>
          )}

          {isLogin && (
            <div className="auth-options">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="button" className="auth-forgot btn-link" onClick={openForgot}>Forgot password?</button>
            </div>
          )}

          {errorMsg && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8,
              padding: '10px 14px', marginBottom: 12,
              display: 'flex', alignItems: 'flex-start', gap: 8,
              fontSize: '0.85rem', color: '#b91c1c', lineHeight: 1.5,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8,
              padding: '10px 14px', marginBottom: 12,
              display: 'flex', alignItems: 'flex-start', gap: 8,
              fontSize: '0.85rem', color: '#15803d', lineHeight: 1.5,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>✅</span>
              <span>{successMsg}</span>
            </div>
          )}
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? (isLogin ? "Signing In..." : "Signing Up...") : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {forgotOpen && (
          <div role="dialog" aria-modal="true" aria-labelledby="forgot-title" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeForgot(); }}>
            <div className="modal">
              <div className="modal-header">
                <h3 id="forgot-title" style={{ margin: 0 }}>{forgotStep === 1 ? "Reset your password" : "Set a new password"}</h3>
                <button type="button" onClick={closeForgot} className="modal-close" aria-label="Close">×</button>
              </div>

              {forgotError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: '0.82rem', color: '#b91c1c', display: 'flex', gap: 6 }}>
                  <span>⚠️</span><span>{forgotError}</span>
                </div>
              )}

              {forgotStep === 1 && (
                <div>
                  <label>Email</label>
                  <input type="email" placeholder="Enter your account email" value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value); setForgotError(""); }} style={{ width: "100%", marginTop: 6, marginBottom: 14 }} className="auth-password-input" />
                  <button type="button" onClick={proceedForgotStep1} disabled={forgotSubmitting} className="auth-submit" style={{ width: "100%" }}>Continue</button>
                </div>
              )}

              {forgotStep === 2 && (
                <div>
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" value={newPwd} onChange={(e) => { setNewPwd(e.target.value); setForgotError(""); }} style={{ width: "100%", marginTop: 6, marginBottom: 12 }} className="auth-password-input" />
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Re-enter new password" value={newPwd2} onChange={(e) => { setNewPwd2(e.target.value); setForgotError(""); }} style={{ width: "100%", marginTop: 6, marginBottom: 14 }} className="auth-password-input" />
                  <button type="button" onClick={submitForgot} disabled={forgotSubmitting} className="auth-submit" style={{ width: "100%" }}>{forgotSubmitting ? "Submitting..." : "Reset Password"}</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}