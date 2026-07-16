

import { UserCircle2, LogOut, Home, Moon, CalendarDays, Star, Building2, TrendingUp, BarChart3, Shield, MessageCircle, Phone, Briefcase, CheckCircle, Map, MapPin, Hotel } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../Login/AuthContext";
import { navClick, auxNavClick } from '../../utils/navClick';

const globalCSS = `
@keyframes slideDownSidebar {
  from { transform: translateY(-40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
`;

const panelButtonStyle = {
  border: "none", background: "transparent", padding: "10px 4px",
  display: "flex", alignItems: "center", gap: 12, cursor: "pointer", width: "100%",
};

const iconBoxStyle = {
  width: 32, height: 32, borderRadius: 12, background: "#f4f4f4",
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
};

const hoverIn = (e) => {
  e.currentTarget.style.transform = "translateY(-1px)";
  e.currentTarget.style.boxShadow = "0 3px 10px rgba(194,119,43,0.2)";
  e.currentTarget.style.background = "#fef9f2";
};
const hoverOut = (e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 2px 6px rgba(194,119,43,0.12)";
  e.currentTarget.style.background = "#fff";
};

export default function Navbar() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [rentalCategoryPopup, setRentalCategoryPopup] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [logoutToast, setLogoutToast] = useState(false);
  const navigate = useNavigate();
  const { user, logout, login } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("scrollToSignature") !== "true") return;
    sessionStorage.removeItem("scrollToSignature");
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById("signature-stays-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempt < 15) {
        setTimeout(() => tryScroll(attempt + 1), 200);
      }
    };
    setTimeout(() => tryScroll(), 400);
  });

  useEffect(() => {
    const handleRentalPopupEvent = () => setRentalCategoryPopup(true);
    window.addEventListener("openRentalCategoryPopup", handleRentalPopupEvent);
    return () => window.removeEventListener("openRentalCategoryPopup", handleRentalPopupEvent);
  }, []);

  const STORAGE_KEYS = ["user", "tm_user"];

  useEffect(() => {
    if (user) return;
    for (const k of STORAGE_KEYS) {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.id || parsed._id || parsed.owner_id || parsed.userId || parsed.uid)) {
          if (typeof login === "function") login(parsed);
          else { try { localStorage.setItem("tm_user", JSON.stringify(parsed)); } catch (_) { } }
          break;
        }
      } catch (_) { }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignatureStaysClick = (e) => {
    setSideMenuOpen(false);
    setHamburgerMenuOpen(false);
    navClick(e, "/properties?category=Signature+Stays", navigate);
  };

  const handleLogin = (e) => navClick(e, "/login", navigate);
  const goDashboard = (e) => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navClick(e, "/dashboard", navigate); };
  const goListingPage = (e) => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navClick(e || {}, "/list-category", navigate); };
  const goOwnerDashboard = (e) => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navClick(e, "/admindashboard", navigate); };
  const handleBecomeHostClick = (e) => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navClick(e || {}, "/list-category", navigate); };
  const goCareer = (e) => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navClick(e, "/career-support", navigate); };
  const goOvikaVerified = (e) => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navClick(e, "/ovika-verified", navigate); };
  const goSelfVerified  = (e) => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navClick(e, "/ovika-self-verified", navigate); };

  const handleRentalCategorySelect = (path) => {
    setRentalCategoryPopup(false);
    setSideMenuOpen(false);
    setHamburgerMenuOpen(false);
    navigate(path);
  };

  // Scroll lock when any menu/popup is open
  useEffect(() => {
    const anyOpen = hamburgerMenuOpen || sideMenuOpen || rentalCategoryPopup;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [hamburgerMenuOpen, sideMenuOpen, rentalCategoryPopup]);

  const openLogoutConfirm = () => {
    setSideMenuOpen(false);
    setHamburgerMenuOpen(false);
    setLogoutConfirm(true);
  };

  const handleLogout = () => {
    setLogoutConfirm(false);
    setLogoutToast(true);
    try {
      STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
      try { sessionStorage.removeItem("user"); sessionStorage.removeItem("tm_user"); } catch (_) { }
    } catch (_) { }
    try { logout(); } catch (_) { }
    setTimeout(() => { window.location.href = "/"; }, 1800);
  };

  const navBtnStyle = {
    border: "1.5px solid #b8860b",
    background: "#fff",
    color: "#232323",
    fontWeight: 500,
    fontSize: 13,
    borderRadius: 20,
    padding: "7px 18px",
    height: 36,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: 4,
    boxShadow: "0 1px 4px rgba(194,119,43,0.10)",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    fontFamily: "Poppins, sans-serif",
  };

  // ─────────────────────────────────────────────
  // MOBILE LAYOUT
  // ─────────────────────────────────────────────
  // close helper for single mobile panel
  const closeMobileMenu = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); };

  if (isMobile) {
    return (
      <>
        <style>{globalCSS}</style>

        {/* ── NAVBAR: Logo | Host + Menu icon ── */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, fontFamily: "Poppins, sans-serif", background: "#fff", borderBottom: "1px solid #f0e8d8" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 52 }}>

            {/* Logo — left */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", cursor: "pointer" }} onClick={(e) => navClick(e, "/", navigate)} onAuxClick={(e) => auxNavClick(e, "/")}>
              <img src="/ovikaliving_logo_clean.png" alt="OvikaLiving" style={{ height: 26, objectFit: "contain", background: "transparent", display: "block" }} />
            </div>

            {/* Right: Host button + menu icon */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <button
                onClick={handleBecomeHostClick}
                style={{ border: "1.5px solid rgba(194,119,43,0.6)", background: "#fdf8f2", color: "#8B5E2A", fontWeight: 600, fontSize: 11, borderRadius: 20, padding: "5px 12px", height: 30, display: "flex", alignItems: "center", cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#c2772b"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fdf8f2"; e.currentTarget.style.color = "#8B5E2A"; }}
              >
                Host
              </button>
              {/* Single menu icon — opens right panel */}
              <button
                onClick={() => setSideMenuOpen(true)}
                style={{ border: "1px solid #f0e8d8", background: "#fdf8f2", cursor: "pointer", width: 34, height: 34, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}
              >
                <span style={{ display: "block", width: 16, height: 1.5, background: "#3a2410", borderRadius: 2 }} />
                <span style={{ display: "block", width: 12, height: 1.5, background: "#c2772b", borderRadius: 2 }} />
                <span style={{ display: "block", width: 16, height: 1.5, background: "#3a2410", borderRadius: 2 }} />
              </button>
            </div>
          </div>
        </div>

        {/* ── RENTAL CATEGORY POPUP ── */}
        {rentalCategoryPopup && (
          <>
            <div onClick={() => setRentalCategoryPopup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000005 }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(320px, 90vw)", background: "#fff", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,0.2)", zIndex: 1000006, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg, #C98B3E 0%, #a06a28 100%)", padding: "12px 16px 10px", textAlign: "center", position: "relative" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>Listing Category</h3>
                <button onClick={() => setRentalCategoryPopup(false)} style={{ position: "absolute", top: 8, right: 10, border: "none", background: "rgba(255,255,255,0.2)", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", color: "#fff" }}>✕</button>
              </div>
              <div style={{ padding: "12px 12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { title: "Short Term Rental", desc: "Nightly stays & PG", emoji: <Moon size={22} color="#c2772b"/>, path: "/listed1" },
                  { title: "Long Term Rental", desc: "Monthly rentals & PG", emoji: <CalendarDays size={22} color="#c2772b"/>, path: "/list-pg" },
                ].map((item) => (
                  <div key={item.title}
                    style={{ border: "1.5px solid #e8d9c0", borderRadius: 12, padding: "12px 10px 10px", textAlign: "center", cursor: "pointer", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}
                    onClick={() => handleRentalCategorySelect(item.path)}
                  >
                    <div style={{ width: 42, height: 42, background: "#FFF6EE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "1.5px solid rgba(201,139,62,0.2)" }}>{item.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af", lineHeight: 1.4 }}>{item.desc}</div>
                    <button style={{ border: "none", background: "#C98B3E", color: "#fff", fontWeight: 600, fontSize: 11.5, borderRadius: 8, padding: "7px 0", cursor: "pointer", width: "100%" }}>List Property</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── LOGOUT CONFIRMATION POPUP (Mobile) ── */}
        {logoutConfirm && (
          <>
            <div onClick={() => setLogoutConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000000 }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(300px, 86vw)", background: "#fff", borderRadius: 16, boxShadow: "0 16px 48px rgba(58,36,16,0.18)", zIndex: 2000001, overflow: "hidden", animation: "scaleIn .22s ease-out" }}>
              <div style={{ padding: "28px 24px 20px", textAlign: "center", borderBottom: "1px solid #f5ede0" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fdf3e7", border: "1.5px solid #e8d5b7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <LogOut size={20} color="#c2772b" strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", fontFamily: "Poppins, sans-serif", marginBottom: 6 }}>Log Out</div>
                <div style={{ fontSize: 12.5, color: "#888", fontWeight: 400, fontFamily: "Poppins, sans-serif", lineHeight: 1.5 }}>Are you sure you want to log out?</div>
              </div>
              <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", gap: 9 }}>
                <button onClick={handleLogout} style={{ border: "none", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", fontWeight: 500, fontSize: 13.5, borderRadius: 10, padding: "11px 0", cursor: "pointer", width: "100%", fontFamily: "Poppins, sans-serif", letterSpacing: "0.2px" }}>
                  Yes, Log Out
                </button>
                <button onClick={() => setLogoutConfirm(false)} style={{ border: "1.5px solid #e8d5b7", background: "#fdf8f2", color: "#7a5c35", fontWeight: 400, fontSize: 13.5, borderRadius: 10, padding: "11px 0", cursor: "pointer", width: "100%", fontFamily: "Poppins, sans-serif" }}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── LOGOUT SUCCESS TOAST (Mobile) ── */}
        {logoutToast && (
          <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#2d1f0e", color: "#fff", padding: "11px 22px", borderRadius: 30, fontSize: 13, fontWeight: 400, fontFamily: "Poppins, sans-serif", zIndex: 2000002, display: "flex", alignItems: "center", gap: 9, boxShadow: "0 4px 20px rgba(58,36,16,0.3)", whiteSpace: "nowrap", animation: "fadeIn 0.3s ease-out" }}>
            <LogOut size={14} color="#c2772b" strokeWidth={2} />
            Logged out successfully
          </div>
        )}

        {/* ── FULL-SCREEN MOBILE MENU ── */}
        {sideMenuOpen && (
          <>
            <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", background: "#fff", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .25s ease-out", overflowY: "auto" }}>

              {/* Header */}
              <div style={{ background: "#fdf8f2", borderBottom: "1px solid #f0e8d8", padding: "14px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 1 }}>
                {user ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{user.username?.[0]?.toUpperCase() || "U"}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{user.username}</div>
                      <div style={{ fontSize: 10, color: "#c2772b", fontWeight: 500 }}>● Logged in</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Welcome</div>
                )}
                <button onClick={closeMobileMenu} style={{ border: "none", background: "#f3f3f3", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", flexShrink: 0, color: "#555" }}>✕</button>
              </div>

              {user ? (
                <>
                  {/* Nav items — only when logged in */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "14px 20px 8px", flex: 1 }}>
                    {[
                      { icon: <Home size={16} color="#c2772b"/>, label: "Home", path: "/", action: (e) => { closeMobileMenu(); navClick(e, "/", navigate); } },
                      { icon: <Moon size={16} color="#c2772b"/>, label: "Nightly Stays", path: "/nightly-stays", action: (e) => { closeMobileMenu(); navClick(e, "/nightly-stays", navigate); } },
                      { icon: <CalendarDays size={16} color="#c2772b"/>, label: "Monthly Rental", path: "/monthly-rentals", action: (e) => { closeMobileMenu(); navClick(e, "/monthly-rentals", navigate); } },
                      { icon: <Star size={16} color="#c2772b"/>, label: "Signature Stays", path: "/properties?category=Signature+Stays", action: (e) => { closeMobileMenu(); handleSignatureStaysClick(e); } },
                      { icon: <Building2 size={16} color="#c2772b"/>, label: "List Property", path: "/list-category", action: (e) => { closeMobileMenu(); navClick(e, "/list-category", navigate); } },
                      { icon: <TrendingUp size={16} color="#c2772b"/>, label: "ROI Calculator", path: "/roi-calculator", action: (e) => { closeMobileMenu(); navClick(e, "/roi-calculator", navigate); } },
                      { icon: <BarChart3 size={16} color="#c2772b"/>, label: "Profile", path: "/dashboard", action: (e) => { closeMobileMenu(); navClick(e, "/dashboard", navigate); } },
                      { icon: <Shield size={16} color="#c2772b"/>, label: "Owner Dashboard", path: "/admindashboard", action: (e) => { closeMobileMenu(); navClick(e, "/admindashboard", navigate); } },
                      { icon: <MessageCircle size={16} color="#c2772b"/>, label: "Buy Leads", path: "/buy-leads", action: (e) => { closeMobileMenu(); navClick(e, "/buy-leads", navigate); } },
                      { icon: <Phone size={16} color="#c2772b"/>, label: "Contact / Support", path: "/contactus", action: (e) => { closeMobileMenu(); navClick(e, "/contactus", navigate); } },
                      { icon: <Briefcase size={16} color="#c2772b"/>, label: "Career", path: "/career-support", action: (e) => { closeMobileMenu(); goCareer(e); } },
                      { icon: <img src="/ovikaver.png" alt="ovika-verified" style={{ width: 18, height: "auto" }} />, label: "OvikaLiving Verified", path: "/ovika-verified", action: (e) => { closeMobileMenu(); goOvikaVerified(e); } },
                      { icon: <CheckCircle size={16} color="#c2772b"/>, label: "Self Verification", path: "/ovika-self-verified", action: (e) => { closeMobileMenu(); goSelfVerified(e); } },
                      { icon: <Map size={16} color="#c2772b"/>, label: "Explore Townmanor", action: () => { closeMobileMenu(); window.open("https://www.townmanor.ai/", "_blank"); } },
                    ].map((item) => (
                      <button key={item.label} onClick={(e) => item.action(e)}
                        onAuxClick={(e) => item.path ? auxNavClick(e, item.path) : null}
                        style={{ border: "1.5px solid #f0e8d8", background: "#fff", padding: "11px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", width: "100%", borderRadius: 14, transition: "border-color 0.15s, background 0.15s", textAlign: "left", boxShadow: "0 1px 4px rgba(194,119,43,0.07)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#fef9f2"; e.currentTarget.style.borderColor = "#c2772b"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#f0e8d8"; }}
                      >
                        <span style={{ width: 36, height: 36, borderRadius: 10, background: "#fdf2e4", border: "1px solid #f0d8b0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#232323" }}>{item.label}</div>
                        <span style={{ marginLeft: "auto", fontSize: 13, color: "#c2772b", opacity: 0.5 }}>›</span>
                      </button>
                    ))}
                  </div>

                  {/* Footer: logout */}
                  <div style={{ padding: "12px 20px 32px", borderTop: "1px solid #f0e8d8" }}>
                    <button onClick={openLogoutConfirm} style={{ border: "1.5px solid #f0ddd0", background: "#fff8f5", padding: "11px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", width: "100%", borderRadius: 14, boxShadow: "0 1px 4px rgba(194,119,43,0.07)" }}>
                      <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#fdf3e7", display: "flex", alignItems: "center", justifyContent: "center", color: "#c2772b" }}>
                        <LogOut size={14} strokeWidth={2} color="#c2772b" />
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#c2772b" }}>Log Out</span>
                    </button>
                  </div>
                </>
              ) : (
                /* ── NOT LOGGED IN: Sign In screen ── */
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px 40px" }}>
                  {/* SVG illustration */}
                  <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 24 }}>
                    <circle cx="55" cy="55" r="54" fill="#fdf3e7" stroke="#e8d5b7" strokeWidth="1.5" />
                    {/* House */}
                    <path d="M30 62 L55 38 L80 62" stroke="#c2772b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <rect x="36" y="62" width="38" height="26" rx="2" fill="#fff" stroke="#c2772b" strokeWidth="2" />
                    {/* Door */}
                    <rect x="49" y="72" width="12" height="16" rx="2" fill="#fdf3e7" stroke="#c2772b" strokeWidth="1.5" />
                    {/* Window left */}
                    <rect x="39" y="67" width="8" height="7" rx="1.5" fill="#fdf3e7" stroke="#c2772b" strokeWidth="1.5" />
                    {/* Window right */}
                    <rect x="63" y="67" width="8" height="7" rx="1.5" fill="#fdf3e7" stroke="#c2772b" strokeWidth="1.5" />
                    {/* Person */}
                    <circle cx="55" cy="30" r="6" fill="#c2772b" opacity="0.15" stroke="#c2772b" strokeWidth="1.5" />
                    <path d="M49 53 Q55 48 61 53" stroke="#c2772b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>

                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", fontFamily: "Poppins, sans-serif", marginBottom: 8, textAlign: "center" }}>
                    Sign in to OvikaLiving
                  </div>
                  <div style={{ fontSize: 12.5, color: "#888", fontWeight: 400, fontFamily: "Poppins, sans-serif", textAlign: "center", lineHeight: 1.6, marginBottom: 28 }}>
                    Access your bookings, listings,<br />and account settings
                  </div>

                  <button
                    onClick={(e) => { closeMobileMenu(); handleLogin(e); }}
                    style={{ border: "none", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", fontWeight: 500, fontSize: 14, borderRadius: 12, padding: "13px 0", cursor: "pointer", width: "100%", fontFamily: "Poppins, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, letterSpacing: "0.2px", boxShadow: "0 4px 16px rgba(194,119,43,0.3)" }}
                  >
                    <UserCircle2 size={18} strokeWidth={1.8} color="#fff" />
                    Sign In
                  </button>

                  <div style={{ marginTop: 14, fontSize: 11.5, color: "#aaa", fontFamily: "Poppins, sans-serif", textAlign: "center" }}>
                    New here? Sign in to get started
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  }

  // ─────────────────────────────────────────────
  // DESKTOP LAYOUT
  // ─────────────────────────────────────────────
  return (
    <>
      <style>{globalCSS}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 100, fontFamily: "Poppins, sans-serif", background: "#fff", borderBottom: "1px solid #f0e8d8", boxShadow: "0 2px 18px rgba(71,38,9,0.09)" }}>

        {/* ── SINGLE ROW: Logo | Nav Links | Actions ── */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 36px", height: 60 }}>

          {/* LEFT: Logo */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", cursor: "pointer", flexShrink: 0, marginRight: 40 }}
            onClick={(e) => navClick(e, "/", navigate)}
            onAuxClick={(e) => auxNavClick(e, "/")}
          >
            <img
              src="/ovikaliving_logo_clean.png"
              alt="OvikaLiving"
              style={{ height: 28, objectFit: "contain", background: "transparent", display: "block" }}
            />
          </div>

          {/* RIGHT-ALIGNED: Nav text links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
            {[
              { label: "Signature Stays", path: "/properties?category=Signature+Stays", action: handleSignatureStaysClick },
              { label: "List Your Property", action: handleBecomeHostClick },
              { label: "Help", action: (e) => navClick(e, "/faq", navigate) },
            ].map(({ label, path, action }) => (
                <button
                  key={label}
                  onClick={(e) => path ? navClick(e, path, navigate) : action(e)}
                  onAuxClick={(e) => path ? auxNavClick(e, path) : null}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: "#232323",
                    padding: "8px 14px",
                    borderRadius: 8,
                    transition: "all 0.18s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#c2772b"; e.currentTarget.style.background = "#fdf8f2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#232323"; e.currentTarget.style.background = "transparent"; }}
                >
                  {label}
                </button>
            ))}
          </nav>

          {/* RIGHT: auth */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, marginLeft: 12 }}>
            {user ? (
              <button
                onClick={() => setSideMenuOpen(true)}
                style={{ border: "1.5px solid #c2772b", background: "#fff", color: "#232323", fontWeight: 500, fontSize: 13, borderRadius: 22, padding: "6px 14px", height: 34, display: "flex", alignItems: "center", cursor: "pointer", gap: 7, fontFamily: "Poppins, sans-serif", transition: "all 0.25s", boxShadow: "0 1px 6px rgba(194,119,43,0.12)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fef9f2"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(194,119,43,0.22)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(194,119,43,0.12)"; }}
              >
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{user.username?.[0]?.toUpperCase() || "U"}</span>
                <span>{user.username}</span>
                <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                onAuxClick={(e) => auxNavClick(e, "/login")}
                style={{ border: "none", background: "#f7e6cd", color: "#3a2c18", fontWeight: 600, fontSize: 13, borderRadius: 22, padding: "9px 20px", height: 36, display: "flex", alignItems: "center", cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.25s", letterSpacing: "0.2px" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0d9b5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f7e6cd"; }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── RENTAL CATEGORY POPUP (Desktop) ── */}
      {rentalCategoryPopup && (
        <>
          <div onClick={() => setRentalCategoryPopup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000005 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(420px, 92vw)", background: "#fff", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,0.2)", zIndex: 1000006, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #C98B3E 0%, #a06a28 100%)", padding: "16px 20px 14px", textAlign: "center", position: "relative" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Listing Category</h3>
              <button onClick={() => setRentalCategoryPopup(false)} style={{ position: "absolute", top: 10, right: 12, border: "none", background: "rgba(255,255,255,0.2)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", color: "#fff" }}>✕</button>
            </div>
            <div style={{ padding: "16px 16px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { title: "Short Term Rental", desc: "Nightly stays & PG", emoji: <Moon size={22} color="#c2772b"/>, path: "/listed1" },
                { title: "Long Term Rental", desc: "Monthly rentals & PG", emoji: <CalendarDays size={22} color="#c2772b"/>, path: "/list-pg" },
              ].map((item) => (
                <div key={item.title}
                  style={{ border: "1.5px solid #e8d9c0", borderRadius: 14, padding: "16px 12px 14px", textAlign: "center", cursor: "pointer", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}
                  onClick={() => handleRentalCategorySelect(item.path)}
                >
                  <div style={{ width: 54, height: 54, background: "#FFF6EE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: "1.5px solid rgba(201,139,62,0.2)" }}>{item.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{item.title}</div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af", lineHeight: 1.4 }}>{item.desc}</div>
                  <button style={{ border: "none", background: "#C98B3E", color: "#fff", fontWeight: 600, fontSize: 12.5, borderRadius: 9, padding: "9px 0", cursor: "pointer", width: "100%" }}>List Property</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── HAMBURGER PANEL (Desktop) ── */}
      {hamburgerMenuOpen && (
        <>
          <div onClick={() => setHamburgerMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1000000 }} />
          <div style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "260px", background: "#fff", borderRadius: "0 20px 20px 0", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", padding: "16px 16px 20px", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .28s ease-out", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1f1f1f" }}>Menu</div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>Navigate through Ovika</div>
              </div>
              <button onClick={() => setHamburgerMenuOpen(false)} style={{ border: "none", background: "#f3f3f3", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              {[
                { icon: <Home size={14} color="#c2772b"/>, label: "Home", path: "/", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/", navigate); } },
                { icon: <Moon size={14} color="#c2772b"/>, label: "Nightly Stays", path: "/nightly-stays", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/nightly-stays", navigate); } },
                { icon: <CalendarDays size={14} color="#c2772b"/>, label: "Monthly Rental", path: "/monthly-rentals", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/monthly-rentals", navigate); } },
                { icon: <Star size={14} color="#c2772b"/>, label: "Signature Stays", path: "/properties?category=Signature+Stays", action: handleSignatureStaysClick },
                { icon: <Building2 size={14} color="#c2772b"/>, label: "List Property", path: "/list-category", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/list-category", navigate); } },
                { icon: <TrendingUp size={14} color="#c2772b"/>, label: "ROI Calculator", path: "/roi-calculator", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/roi-calculator", navigate); } },
                { icon: <BarChart3 size={14} color="#c2772b"/>, label: "Profile", path: "/dashboard", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/dashboard", navigate); } },
                { icon: <Shield size={14} color="#c2772b"/>, label: "Owner Dashboard", path: "/admindashboard", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/admindashboard", navigate); } },
                { icon: <MessageCircle size={14} color="#c2772b"/>, label: "Buy Leads", path: "/buy-leads", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/buy-leads", navigate); } },
                { icon: <Phone size={14} color="#c2772b"/>, label: "Contact / Support", path: "/contactus", action: (e) => { setHamburgerMenuOpen(false); navClick(e, "/contactus", navigate); } },
                { icon: <Briefcase size={14} color="#c2772b"/>, label: "Career", path: "/career-support", action: goCareer },
                { icon: <img src="/ovikaver.png" alt="ovika-verified" style={{ width: '20px', height: 'auto' }} />, label: "OvikaLiving Verified", path: "/ovika-verified", action: goOvikaVerified },
                { icon: <CheckCircle size={14} color="#c2772b"/>, label: "Property Self Verification", path: "/ovika-self-verified", action: goSelfVerified },
                { icon: <Map size={14} color="#c2772b"/>, label: "Explore Townmanor", action: () => { setHamburgerMenuOpen(false); window.open("https://www.townmanor.ai/", "_blank"); } },
              ].map((item) => (
                <button key={item.label} onClick={(e) => item.action(e)} onAuxClick={(e) => item.path ? auxNavClick(e, item.path) : null} style={{ border: "none", background: "transparent", padding: "7px 4px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", width: "100%", borderRadius: 8, transition: "background 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fef9f2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    background: "#f4f4f4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#232323" }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: "#8a8a8a" }}>{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── LOGOUT CONFIRMATION POPUP ── */}
      {logoutConfirm && (
        <>
          <div onClick={() => setLogoutConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000000 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(300px, 88vw)", background: "#fff", borderRadius: 16, boxShadow: "0 16px 48px rgba(58,36,16,0.18)", zIndex: 2000001, overflow: "hidden", animation: "scaleIn .22s ease-out" }}>
            <div style={{ padding: "28px 24px 20px", textAlign: "center", borderBottom: "1px solid #f5ede0" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fdf3e7", border: "1.5px solid #e8d5b7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <LogOut size={20} color="#c2772b" strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", fontFamily: "Poppins, sans-serif", marginBottom: 6 }}>Log Out</div>
              <div style={{ fontSize: 12.5, color: "#888", fontWeight: 400, fontFamily: "Poppins, sans-serif", lineHeight: 1.5 }}>Are you sure you want to log out?</div>
            </div>
            <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", gap: 9 }}>
              <button
                onClick={handleLogout}
                style={{ border: "none", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", fontWeight: 500, fontSize: 13.5, borderRadius: 10, padding: "11px 0", cursor: "pointer", width: "100%", fontFamily: "Poppins, sans-serif", letterSpacing: "0.2px", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setLogoutConfirm(false)}
                style={{ border: "1.5px solid #e8d5b7", background: "#fdf8f2", color: "#7a5c35", fontWeight: 400, fontSize: 13.5, borderRadius: 10, padding: "11px 0", cursor: "pointer", width: "100%", fontFamily: "Poppins, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── LOGOUT SUCCESS TOAST ── */}
      {logoutToast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#2d1f0e", color: "#fff", padding: "11px 24px", borderRadius: 30, fontSize: 13, fontWeight: 400, fontFamily: "Poppins, sans-serif", zIndex: 2000002, display: "flex", alignItems: "center", gap: 9, boxShadow: "0 4px 20px rgba(58,36,16,0.3)", whiteSpace: "nowrap", animation: "fadeIn 0.3s ease-out" }}>
          <LogOut size={14} color="#c2772b" strokeWidth={2} />
          Logged out successfully
        </div>
      )}

      {/* ── RIGHT USER PANEL (Desktop) ── */}
      {user && sideMenuOpen && (
        <>
          <div onClick={() => setSideMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1000000 }} />
          <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(380px, 88vw)", background: "#fff", borderRadius: "24px 0 0 24px", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", padding: "22px 22px 30px", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .28s ease-out", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>{user.username?.[0]?.toUpperCase() || "U"}</div>
                  <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: "#c2772b", border: "2px solid #fff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{user.username}</div>
                  <div style={{ fontSize: 11, color: "#c2772b", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>● Logged in</div>
                </div>
              </div>
              <button onClick={() => setSideMenuOpen(false)} style={{ border: "none", background: "#f3f3f3", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ background: "#fbf5ec", borderRadius: 18, padding: "14px 14px 16px", marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#3a2c18" }}>Manage your hosting</div>
              <div style={{ fontSize: 12, color: "#7a6b57", lineHeight: 1.5 }}>Quickly access your dashboard, listings and account actions.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {[
                { icon: <MapPin size={16} color="#c2772b"/>, label: "Book a Stay", path: "/properties", sub: "Browse and book properties", action: (e) => { setSideMenuOpen(false); navClick(e, "/properties", navigate); } },
                { icon: <Star size={16} color="#c2772b"/>, label: "Signature Stays", path: "/properties?category=Signature+Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
                { icon: <Building2 size={16} color="#c2772b"/>, label: "Become a Host", sub: "List your property and earn", action: goListingPage },
                { icon: <TrendingUp size={16} color="#c2772b"/>, label: "ROI Calculator", path: "/roi-calculator", sub: "See how much your flat can earn", action: (e) => { setSideMenuOpen(false); navClick(e, "/roi-calculator", navigate); } },
                { icon: <BarChart3 size={16} color="#c2772b"/>, label: "Profile", path: "/dashboard", sub: "View your bookings & performance", action: goDashboard },
                { icon: <Shield size={16} color="#c2772b"/>, label: "Owner Dashboard", path: "/admindashboard", sub: "Access owner controls", action: goOwnerDashboard },
                { icon: <Briefcase size={16} color="#c2772b"/>, label: "Career", path: "/career-support", sub: "Join our growing team", action: goCareer },
                { icon: <img src="/ovikaver.png" alt="ovika-verified" style={{ width: '20px', height: 'auto' }} />, label: "OvikaLiving Verified", path: "/ovika-verified", sub: "Know about our verification process", action: goOvikaVerified },
                { icon: <CheckCircle size={16} color="#c2772b"/>, label: "Property Self Verification", path: "/ovika-self-verified", sub: "Verify your property yourself", action: goSelfVerified },
              ].map((item) => (
                <button key={item.label} onClick={(e) => item.action(e)} onAuxClick={(e) => item.path ? auxNavClick(e, item.path) : null} style={panelButtonStyle}>
                  <span style={{
                    ...iconBoxStyle,
                    width: 32,
                    height: 32,
                    borderRadius: 12
                  }}>
                    {item.icon}
                  </span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#232323" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#8a8a8a" }}>{item.sub}</div>
                  </div>
                </button>
              ))}
              <button onClick={(e) => { setSideMenuOpen(false); navClick(e, "/buy-leads", navigate); }} onAuxClick={(e) => auxNavClick(e, "/buy-leads")} style={panelButtonStyle}>
                <span style={iconBoxStyle}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="#c2772b" strokeWidth="1.8" /><path d="M3 9H21" stroke="#c2772b" strokeWidth="1.8" /><circle cx="8" cy="14" r="1.4" fill="#c2772b" /><circle cx="12" cy="14" r="1.4" fill="#c2772b" /><circle cx="16" cy="14" r="1.4" fill="#c2772b" /></svg></span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#232323" }}>Buy Leads</div>
                  <div style={{ fontSize: 12, color: "#8a8a8a" }}>Get Verified Tenant Enquiries</div>
                </div>
              </button>
              <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "13px 0" }} />
              <button onClick={openLogoutConfirm} style={{ border: "none", background: "transparent", padding: "8px 4px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, background: "#fdeceb", display: "flex", alignItems: "center", justifyContent: "center", color: "#c23e3e" }}><LogOut size={14} color="#c23e3e"/></span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#c23e3e" }}>Log out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}