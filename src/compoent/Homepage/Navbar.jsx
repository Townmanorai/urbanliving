
// import { UserCircle2 } from "lucide-react";
// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import { AuthContext } from "../Login/AuthContext";

// const globalCSS = `
// @keyframes slideDownSidebar {
//   from { transform: translateY(-40px); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// }
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// @keyframes scaleIn {
//   from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
//   to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
// }
// `;

// const panelButtonStyle = {
//   border: "none", background: "transparent", padding: "10px 4px",
//   display: "flex", alignItems: "center", gap: 12, cursor: "pointer", width: "100%",
// };

// const iconBoxStyle = {
//   width: 32, height: 32, borderRadius: 12, background: "#f4f4f4",
//   display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
// };

// const hoverIn = (e) => {
//   e.currentTarget.style.transform = "translateY(-1px)";
//   e.currentTarget.style.boxShadow = "0 3px 10px rgba(194,119,43,0.2)";
//   e.currentTarget.style.background = "#fef9f2";
// };
// const hoverOut = (e) => {
//   e.currentTarget.style.transform = "translateY(0)";
//   e.currentTarget.style.boxShadow = "0 2px 6px rgba(194,119,43,0.12)";
//   e.currentTarget.style.background = "#fff";
// };

// export default function Navbar() {
//   const [sideMenuOpen, setSideMenuOpen] = useState(false);
//   const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
//   const [rentalCategoryPopup, setRentalCategoryPopup] = useState(false);
//   const navigate = useNavigate();
//   const { user, logout, login } = useContext(AuthContext);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (sessionStorage.getItem("scrollToSignature") !== "true") return;
//     sessionStorage.removeItem("scrollToSignature");
//     const tryScroll = (attempt = 0) => {
//       const el = document.getElementById("signature-stays-section");
//       if (el) {
//         el.scrollIntoView({ behavior: "smooth", block: "start" });
//       } else if (attempt < 15) {
//         setTimeout(() => tryScroll(attempt + 1), 200);
//       }
//     };
//     setTimeout(() => tryScroll(), 400);
//   });

//   const STORAGE_KEYS = ["user", "tm_user"];

//   useEffect(() => {
//     if (user) return;
//     for (const k of STORAGE_KEYS) {
//       try {
//         const raw = localStorage.getItem(k);
//         if (!raw) continue;
//         const parsed = JSON.parse(raw);
//         if (parsed && (parsed.id || parsed._id || parsed.owner_id || parsed.userId || parsed.uid)) {
//           if (typeof login === "function") login(parsed);
//           else { try { localStorage.setItem("tm_user", JSON.stringify(parsed)); } catch (_) { } }
//           break;
//         }
//       } catch (_) { }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleSignatureStaysClick = () => {
//     setSideMenuOpen(false);
//     setHamburgerMenuOpen(false);
//     const isHome = window.location.pathname === "/" || window.location.pathname === "";
//     if (isHome) {
//       const el = document.getElementById("signature-stays-section");
//       if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//     } else {
//       sessionStorage.setItem("scrollToSignature", "true");
//       navigate("/");
//     }
//   };

//   const handleLogin = () => navigate("/login");
//   const goDashboard = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navigate("/dashboard"); };
//   const goListingPage = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); setRentalCategoryPopup(true); };
//   const goOwnerDashboard = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navigate("/admindashboard"); };
//   const handleBecomeHostClick = () => setRentalCategoryPopup(true);

//   // ── NEW: Career handler ──
//   const goCareer = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navigate("/career-support"); };

//   const handleRentalCategorySelect = (path) => {
//     setRentalCategoryPopup(false);
//     setSideMenuOpen(false);
//     setHamburgerMenuOpen(false);
//     navigate(path);
//   };

//   const handleLogout = () => {
//     setSideMenuOpen(false);
//     setHamburgerMenuOpen(false);
//     try {
//       STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
//       try { sessionStorage.removeItem("user"); sessionStorage.removeItem("tm_user"); } catch (_) { }
//     } catch (_) { }
//     try { logout(); } catch (_) { }
//     window.location.href = "/";
//   };

//   const navBtnStyle = {
//     border: "1.5px solid #b8860b",
//     background: "#fff",
//     color: "#232323",
//     fontWeight: 500,
//     fontSize: 13,
//     borderRadius: 20,
//     padding: "7px 18px",
//     height: 36,
//     display: "flex",
//     alignItems: "center",
//     cursor: "pointer",
//     gap: 4,
//     boxShadow: "0 1px 4px rgba(194,119,43,0.10)",
//     transition: "all 0.3s ease",
//     whiteSpace: "nowrap",
//     fontFamily: "Poppins, sans-serif",
//   };

//   // ─────────────────────────────────────────────
//   // MOBILE LAYOUT
//   // ─────────────────────────────────────────────
//   if (isMobile) {
//     return (
//       <>
//         <style>{globalCSS}</style>

//         <div style={{ position: "relative", zIndex: 99999, fontFamily: "Poppins, sans-serif", background: "#fff", borderBottom: "1px solid #f0e8d8" }}>

//           {/* ── ROW 1: Hamburger | Logo | User ── */}
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 4px 16px" }}>

//             {/* Hamburger */}
//             <button
//               onClick={() => setHamburgerMenuOpen(true)}
//               style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 22, padding: "4px 6px", display: "flex", alignItems: "center", color: "#232323" }}
//             >
//               ☰
//             </button>

//             {/* Logo center */}
//             <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
//                 {/* <span style={{ fontSize: 22, fontWeight: 400, color: "#c2772b", fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.5px" }}>OvikaLiving</span> */}
//                <img src="/ovikalivinglogonew.png" alt="OvikaLiving" style={{ height: 38, objectFit: "contain" }} />
//                 <span style={{ fontSize: 8, color: "#c2772b", fontWeight: 400, marginTop: 1, letterSpacing: "0.2px", opacity: 0.85 }}>A flagship rental brand of Townmonor Technologies Pvt. Ltd.</span>
//               </div>
//             </div>

//             {/* User / Sign In */}
//             <div>
//               {user ? (
//                 <button
//                   onClick={() => setSideMenuOpen(true)}
//                   style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px 6px", display: "flex", alignItems: "center", color: "#c2772b" }}
//                 >
//                   <UserCircle2 size={26} strokeWidth={1.5} color="#1a1a1a" />
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleLogin}
//                   style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px 6px", display: "flex", alignItems: "center" }}
//                 >
//                   <UserCircle2 size={26} strokeWidth={1.5} color="#1a1a1a" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* ── ROW 2: Nav Buttons ── */}
//           <div style={{ background: "linear-gradient(135deg, #2a1a08 0%, #3a2410 50%, #2a1a08 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 12px" }}>
//             {[
//               { label: "Book a Stay", action: () => navigate("/properties") },
//               { label: "Signature Stays", action: handleSignatureStaysClick },
//               { label: "Become a Host", action: handleBecomeHostClick },
//             ].map((btn) => (
              
//               <button
//                 key={btn.label}
//                 onClick={btn.action}
//                 style={{ border: "1.5px solid rgba(194,119,43,0.75)", background: "transparent", color: "#e8d5a3", fontWeight: 500, fontSize: 11, borderRadius: 20, padding: "5px 12px", height: 30, display: "flex", alignItems: "center", cursor: "pointer", fontFamily: "Poppins, sans-serif", letterSpacing: "0.2px", transition: "all 0.25s ease", whiteSpace: "nowrap" }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(194,119,43,0.18)"; e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.color = "#fff"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(194,119,43,0.75)"; e.currentTarget.style.color = "#e8d5a3"; }}
//               >
//                 {btn.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── RENTAL CATEGORY POPUP ── */}
//         {rentalCategoryPopup && (
//           <>
//             <div onClick={() => setRentalCategoryPopup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000005, animation: "fadeIn 0.3s ease-out" }} />
//             <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxHeight: "90vh", background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", zIndex: 1000006, overflow: "hidden", animation: "scaleIn 0.3s ease-out" }}>
//               <button onClick={() => setRentalCategoryPopup(false)} style={{ position: "absolute", top: 20, right: 20, border: "none", background: "#f3f3f3", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", zIndex: 10 }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = "#e0e0e0"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f3f3"; }}>✕</button>
//               <div style={{ background: "linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)", padding: "30px 20px", textAlign: "center" }}>
//                 <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1f1f1f", margin: 0 }}>Listing Category</h2>
//               </div>
//               <div style={{ padding: "30px 20px", display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
//                 {[
//                   { title: "Short Term Rental", desc: "PG, apartments, houses, and farmhouse accommodations - Nightly Rental", emoji: "🏠", bg: "linear-gradient(135deg, #fff4e6 0%, #ffe4cc 100%)", path: "/listed1" },
//                   { title: "Long Term Rental", desc: "PG, apartments, houses, and farmhouse accommodations - Monthly Rental", emoji: "🏢", bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", path: "/list-pg" },
//                 ].map((item) => (
//                   <div key={item.title}
//                     style={{ border: "2px solid #e0e0e0", borderRadius: 20, padding: "30px 20px", textAlign: "center", transition: "all 0.3s", cursor: "pointer", background: "#fff" }}
//                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(194,119,43,0.15)"; }}
//                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
//                     onClick={() => handleRentalCategorySelect(item.path)}
//                   >
//                     <div style={{ width: 80, height: 80, margin: "0 auto 20px", background: item.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{item.emoji}</div>
//                     <h3 style={{ fontSize: 20, fontWeight: 600, color: "#232323", marginBottom: 12 }}>{item.title}</h3>
//                     <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 25 }}>{item.desc}</p>
//                     <button style={{ border: "none", background: "linear-gradient(135deg, #c2772b 0%, #c2772b 100%)", color: "#fff", fontWeight: 600, fontSize: 14, borderRadius: 12, padding: "12px 24px", cursor: "pointer", width: "100%", transition: "all 0.3s" }}
//                       onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
//                       onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>List Properties</button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}

//         {/* ── HAMBURGER PANEL (Mobile) — Career added ── */}
//         {hamburgerMenuOpen && (
//           <>
//             <div onClick={() => setHamburgerMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1000000 }} />
//             <div style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "min(280px, 75vw)", background: "#fff", borderRadius: "0 24px 24px 0", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", padding: "18px 16px 24px", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .28s ease-out", overflowY: "auto" }}>
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
//                 <div>
//                   <div style={{ fontSize: 18, fontWeight: 600, color: "#1f1f1f" }}>Menu</div>
//                   <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>Navigate through Ovika</div>
//                 </div>
//                 <button onClick={() => setHamburgerMenuOpen(false)} style={{ border: "none", background: "#f3f3f3", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>✕</button>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
//                 {[
//                   { icon: "🏠", label: "Home", sub: "Return to homepage", action: () => { setHamburgerMenuOpen(false); navigate("/"); } },
//                   { icon: "🏖️", label: "Book a Stay", sub: "Browse and book properties", action: () => { setHamburgerMenuOpen(false); navigate("/properties"); } },
//                   { icon: "✨", label: "Signature Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
//                   { icon: "🏘️", label: "Become a Host", sub: "List your property and earn", action: () => { setHamburgerMenuOpen(false); setRentalCategoryPopup(true); } },
//                   { icon: "📊", label: "Profile", sub: "View your bookings & performance", action: () => { setHamburgerMenuOpen(false); navigate("/dashboard"); } },
//                   { icon: "🛡️", label: "Owner Dashboard", sub: "Access owner controls", action: () => { setHamburgerMenuOpen(false); navigate("/admindashboard"); } },
//                   { icon: "💬", label: "Subscription Plan", sub: "Grow Faster With the Right Plan", action: () => { setHamburgerMenuOpen(false); navigate("/subsription"); } },
//                   { icon: "📞", label: "Contact / Support", sub: "Get help and assistance", action: () => { setHamburgerMenuOpen(false); navigate("/contactus"); } },
//                   // ── NEW CAREER OPTION ──
//                   { icon: "💼", label: "Career", sub: "Join our growing team", action: goCareer },
//                   { icon: "🗺️", label: "Explore Townmanor", sub: "Discover amazing places", action: () => { setHamburgerMenuOpen(false); window.open("https://www.townmanor.ai/", "_blank"); } },
//                 ].map((item) => (
//                   <button key={item.label} onClick={item.action} style={{ ...panelButtonStyle, padding: "8px 4px" }}>
//                     <span style={{ ...iconBoxStyle, width: 28, height: 28, fontSize: 14 }}>{item.icon}</span>
//                     <div style={{ textAlign: "left" }}>
//                       <div style={{ fontSize: 13, fontWeight: 500, color: "#232323" }}>{item.label}</div>
//                       <div style={{ fontSize: 11, color: "#8a8a8a" }}>{item.sub}</div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}

//         {/* ── RIGHT USER PANEL (Mobile) — Career added ── */}
//         {user && sideMenuOpen && (
//           <>
//             <div onClick={() => setSideMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1000000 }} />
//             <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(280px, 80vw)", background: "#fff", borderRadius: "24px 0 0 24px", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", padding: "18px 16px 24px", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .28s ease-out", overflowY: "auto" }}>
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <div style={{ position: "relative" }}>
//                     <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>{user.username?.[0]?.toUpperCase() || "U"}</div>
//                     <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#c2772b", border: "2px solid #fff" }} />
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{user.username}</div>
//                     <div style={{ fontSize: 10, color: "#c2772b", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>● Logged in</div>
//                   </div>
//                 </div>
//                 <button onClick={() => setSideMenuOpen(false)} style={{ border: "none", background: "#f3f3f3", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>✕</button>
//               </div>
//               <div style={{ background: "#fbf5ec", borderRadius: 18, padding: "12px 12px 14px", marginBottom: 14 }}>
//                 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#3a2c18" }}>Manage your hosting</div>
//                 <div style={{ fontSize: 11, color: "#7a6b57", lineHeight: 1.5 }}>Quickly access your dashboard, listings and account actions.</div>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
//                 {[
//                   { icon: "🏖️", label: "Book a Stay", sub: "Browse and book properties", action: () => { setSideMenuOpen(false); navigate("/properties"); } },
//                   { icon: "✨", label: "Signature Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
//                   { icon: "🏘️", label: "Become a Host", sub: "List your property and earn", action: goListingPage },
//                   { icon: "📊", label: "Profile", sub: "View your bookings & performance", action: goDashboard },
//                   { icon: "🛡️", label: "Owner Dashboard", sub: "Access owner controls", action: goOwnerDashboard },
//                   // ── NEW CAREER OPTION ──
//                   { icon: "💼", label: "Career", sub: "Join our growing team", action: goCareer },
//                 ].map((item) => (
//                   <button key={item.label} onClick={item.action} style={{ ...panelButtonStyle, padding: "8px 4px" }}>
//                     <span style={{ ...iconBoxStyle, width: 28, height: 28, fontSize: 14 }}>{item.icon}</span>
//                     <div style={{ textAlign: "left" }}>
//                       <div style={{ fontSize: 13, fontWeight: 500, color: "#232323" }}>{item.label}</div>
//                       <div style={{ fontSize: 11, color: "#8a8a8a" }}>{item.sub}</div>
//                     </div>
//                   </button>
//                 ))}
//                 <button onClick={() => { setSideMenuOpen(false); navigate("/subsription"); }} style={{ ...panelButtonStyle, padding: "8px 4px" }}>
//                   <span style={{ ...iconBoxStyle, width: 28, height: 28 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="#c2772b" strokeWidth="1.8" /><path d="M3 9H21" stroke="#c2772b" strokeWidth="1.8" /><circle cx="8" cy="14" r="1.4" fill="#c2772b" /><circle cx="12" cy="14" r="1.4" fill="#c2772b" /><circle cx="16" cy="14" r="1.4" fill="#c2772b" /></svg></span>
//                   <div style={{ textAlign: "left" }}>
//                     <div style={{ fontSize: 13, fontWeight: 500, color: "#232323" }}>Subscription Plan</div>
//                     <div style={{ fontSize: 11, color: "#8a8a8a" }}>Grow Faster With the Right Plan</div>
//                   </div>
//                 </button>
//                 <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />
//                 <button onClick={handleLogout} style={{ border: "none", background: "transparent", padding: "8px 4px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
//                   <span style={{ width: 28, height: 28, borderRadius: 999, background: "#fdeceb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#c23e3e" }}>⬅</span>
//                   <span style={{ fontSize: 13, fontWeight: 500, color: "#c23e3e" }}>Log out</span>
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </>
//     );
//   }

//   // ─────────────────────────────────────────────
//   // DESKTOP LAYOUT
//   // ─────────────────────────────────────────────
//   return (
//     <>
//       <style>{globalCSS}</style>

//       <div style={{ position: "relative", zIndex: 99999, fontFamily: "Poppins, sans-serif", background: "#fff", borderBottom: "1px solid #f0e8d8", boxShadow: "0 2px 18px rgba(71,38,9,0.09)" }}>

//         {/* ── ROW 1 ── */}
//         <div style={{ display: "flex", alignItems: "center", padding: "10px 36px 6px 36px", position: "relative" }}>

//           {/* LEFT */}
//           <div style={{ width: 200, display: "flex", alignItems: "center", flexShrink: 0 }}>
//             <button
//               onClick={() => setHamburgerMenuOpen(true)}
//               style={{ border: "1px solid rgba(194,119,43,0.25)", background: "#fdf8f2", cursor: "pointer", padding: "6px 14px 6px 10px", display: "flex", alignItems: "center", gap: 8, color: "#3a2410", transition: "all 0.22s ease", borderRadius: 10, fontFamily: "Poppins, sans-serif" }}
//               onMouseEnter={(e) => { e.currentTarget.style.background = "#fef0dc"; e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(194,119,43,0.18)"; }}
//               onMouseLeave={(e) => { e.currentTarget.style.background = "#fdf8f2"; e.currentTarget.style.borderColor = "rgba(194,119,43,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
//             >
//               <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 18 }}>
//                 <span style={{ display: "block", height: 1.8, background: "#3a2410", borderRadius: 2, width: "100%" }} />
//                 <span style={{ display: "block", height: 1.8, background: "#c2772b", borderRadius: 2, width: "75%" }} />
//                 <span style={{ display: "block", height: 1.8, background: "#3a2410", borderRadius: 2, width: "100%" }} />
//               </div>
//               <span style={{ fontSize: 12.5, fontWeight: 500, color: "#3a2410", letterSpacing: "0.3px", whiteSpace: "nowrap" }}>Menu</span>
//             </button>
//           </div>

//           {/* CENTER logo */}
//           <div
//             style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: 2 }}
//             onClick={() => navigate("/")}
//           >

//   <img src="/ovikalivinglogonew.png" alt="OvikaLiving" style={{ height: 40, objectFit: "contain" }} />
//             <span style={{ fontSize: 9, color: "#c2772b", fontWeight: 400, letterSpacing: "0.3px", opacity: 0.7, whiteSpace: "nowrap", fontFamily: "Poppins, sans-serif" }}>A flagship rental brand of Townmonor Technologies Pvt. Ltd.</span>
//           </div>

//           {/* RIGHT auth */}
//           <div style={{ width: 200, display: "flex", alignItems: "center", justifyContent: "flex-end", flexShrink: 0, marginLeft: "auto" }}>
//             {user ? (
//               <button
//                 onClick={() => setSideMenuOpen(true)}
//                 style={{ border: "1.5px solid #c2772b", background: "#fff", color: "#232323", fontWeight: 500, fontSize: 13, borderRadius: 22, padding: "6px 14px", height: 34, display: "flex", alignItems: "center", cursor: "pointer", gap: 7, fontFamily: "Poppins, sans-serif", transition: "all 0.25s", boxShadow: "0 1px 6px rgba(194,119,43,0.12)" }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = "#fef9f2"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(194,119,43,0.22)"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(194,119,43,0.12)"; }}
//               >
//                 <span style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{user.username?.[0]?.toUpperCase() || "U"}</span>
//                 <span>{user.username}</span>
//                 <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
//               </button>
//             ) : (
//               <button
//                 onClick={handleLogin}
//                 style={{ border: "1.5px solid #c2772b", background: "#fff", color: "#c2772b", fontWeight: 500, fontSize: 13, borderRadius: 22, padding: "6px 20px", height: 34, display: "flex", alignItems: "center", cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.25s", boxShadow: "0 1px 6px rgba(194,119,43,0.12)", letterSpacing: "0.3px" }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = "#fef9f2"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(194,119,43,0.22)"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(194,119,43,0.12)"; }}
//               >
//                 Sign In
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── ROW 2: Nav strip ── */}
//         <div style={{ background: "linear-gradient(135deg, #2a1a08 0%, #3a2410 50%, #2a1a08 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "8px 44px 9px 44px" }}>
//           {[
//             { label: "Book a Stay", action: () => navigate("/properties") },
//             { label: "Signature Stays", action: handleSignatureStaysClick },
//             { label: "Become a Host", action: handleBecomeHostClick },
//           ].map((btn) => (
//             <button
//               key={btn.label}
//               onClick={btn.action}
//               style={{ border: "1.5px solid rgba(194,119,43,0.75)", background: "transparent", color: "#e8d5a3", fontWeight: 500, fontSize: 13, borderRadius: 22, padding: "6px 24px", height: 34, display: "flex", alignItems: "center", cursor: "pointer", fontFamily: "Poppins, sans-serif", letterSpacing: "0.3px", transition: "all 0.25s ease", whiteSpace: "nowrap" }}
//               onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(194,119,43,0.18)"; e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
//               onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(194,119,43,0.75)"; e.currentTarget.style.color = "#e8d5a3"; e.currentTarget.style.transform = "translateY(0)"; }}
//             >
//               {btn.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── RENTAL CATEGORY POPUP (Desktop) ── */}
//       {rentalCategoryPopup && (
//         <>
//           <div onClick={() => setRentalCategoryPopup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000005, animation: "fadeIn 0.3s ease-out" }} />
//           <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(950px, 90vw)", maxHeight: "90vh", background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", zIndex: 1000006, overflow: "hidden", animation: "scaleIn 0.3s ease-out" }}>
//             <button onClick={() => setRentalCategoryPopup(false)} style={{ position: "absolute", top: 20, right: 20, border: "none", background: "#f3f3f3", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", zIndex: 10 }}
//               onMouseEnter={(e) => { e.currentTarget.style.background = "#e0e0e0"; }}
//               onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f3f3"; }}>✕</button>
//             <div style={{ background: "linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)", padding: "40px 30px", textAlign: "center" }}>
//               <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1f1f1f", margin: 0 }}>Listing Category</h2>
//             </div>
//             <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 30 }}>
//               {[
//                 { title: "Short Term Rental", desc: "PG, apartments, houses, and farmhouse accommodations - Nightly Rental", emoji: "🏠", bg: "linear-gradient(135deg, #fff4e6 0%, #ffe4cc 100%)", path: "/listed1" },
//                 { title: "Long Term Rental", desc: "PG, apartments, houses, and farmhouse accommodations - Monthly Rental", emoji: "🏢", bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", path: "/list-pg" },
//               ].map((item) => (
//                 <div key={item.title}
//                   style={{ border: "2px solid #e0e0e0", borderRadius: 20, padding: "40px 30px", textAlign: "center", transition: "all 0.3s", cursor: "pointer", background: "#fff" }}
//                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(194,119,43,0.15)"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
//                   onClick={() => handleRentalCategorySelect(item.path)}
//                 >
//                   <div style={{ width: 100, height: 100, margin: "0 auto 20px", background: item.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>{item.emoji}</div>
//                   <h3 style={{ fontSize: 24, fontWeight: 600, color: "#232323", marginBottom: 12 }}>{item.title}</h3>
//                   <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6, marginBottom: 25 }}>{item.desc}</p>
//                   <button style={{ border: "none", background: "linear-gradient(135deg, #c2772b 0%, #c2772b 100%)", color: "#fff", fontWeight: 600, fontSize: 16, borderRadius: 12, padding: "14px 32px", cursor: "pointer", width: "100%", transition: "all 0.3s" }}
//                     onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
//                     onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>List Properties</button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       {/* ── HAMBURGER PANEL (Desktop) — Career added ── */}
//       {hamburgerMenuOpen && (
//         <>
//           <div onClick={() => setHamburgerMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1000000 }} />
//           <div style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "260px", background: "#fff", borderRadius: "0 20px 20px 0", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", padding: "16px 16px 20px", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .28s ease-out", overflowY: "auto" }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
//               <div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#1f1f1f" }}>Menu</div>
//                 <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>Navigate through Ovika</div>
//               </div>
//               <button onClick={() => setHamburgerMenuOpen(false)} style={{ border: "none", background: "#f3f3f3", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>✕</button>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
//               {[
//                 { icon: "🏠", label: "Home", sub: "Return to homepage", action: () => { setHamburgerMenuOpen(false); navigate("/"); } },
//                 { icon: "🏖️", label: "Book a Stay", sub: "Browse and book properties", action: () => { setHamburgerMenuOpen(false); navigate("/properties"); } },
//                 { icon: "✨", label: "Signature Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
//                 { icon: "🏘️", label: "Become a Host", sub: "List your property and earn", action: () => { setHamburgerMenuOpen(false); setRentalCategoryPopup(true); } },
//                 { icon: "📊", label: "Profile", sub: "View your bookings & performance", action: () => { setHamburgerMenuOpen(false); navigate("/dashboard"); } },
//                 { icon: "🛡️", label: "Owner Dashboard", sub: "Access owner controls", action: () => { setHamburgerMenuOpen(false); navigate("/admindashboard"); } },
//                 { icon: "💬", label: "Subscription Plan", sub: "Grow Faster With the Right Plan", action: () => { setHamburgerMenuOpen(false); navigate("/subsription"); } },
//                 { icon: "📞", label: "Contact / Support", sub: "Get help and assistance", action: () => { setHamburgerMenuOpen(false); navigate("/contactus"); } },
//                 // ── NEW CAREER OPTION ──
//                 { icon: "💼", label: "Career", sub: "Join our growing team", action: goCareer },
//                 { icon: "🗺️", label: "Explore Townmanor", sub: "Discover amazing places", action: () => { setHamburgerMenuOpen(false); window.open("https://www.townmanor.ai/", "_blank"); } },
//               ].map((item) => (
//                 <button key={item.label} onClick={item.action} style={{ border: "none", background: "transparent", padding: "7px 4px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", width: "100%", borderRadius: 8, transition: "background 0.15s" }}
//                   onMouseEnter={(e) => { e.currentTarget.style.background = "#fef9f2"; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
//                 >
//                   <span style={{ width: 28, height: 28, borderRadius: 10, background: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
//                   <div style={{ textAlign: "left" }}>
//                     <div style={{ fontSize: 13, fontWeight: 500, color: "#232323" }}>{item.label}</div>
//                     <div style={{ fontSize: 10, color: "#8a8a8a" }}>{item.sub}</div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       {/* ── RIGHT USER PANEL (Desktop) — Career added ── */}
//       {user && sideMenuOpen && (
//         <>
//           <div onClick={() => setSideMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1000000 }} />
//           <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(380px, 88vw)", background: "#fff", borderRadius: "24px 0 0 24px", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", padding: "22px 22px 30px", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .28s ease-out", overflowY: "auto" }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <div style={{ position: "relative" }}>
//                   <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>{user.username?.[0]?.toUpperCase() || "U"}</div>
//                   <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: "#c2772b", border: "2px solid #fff" }} />
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{user.username}</div>
//                   <div style={{ fontSize: 11, color: "#c2772b", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>● Logged in</div>
//                 </div>
//               </div>
//               <button onClick={() => setSideMenuOpen(false)} style={{ border: "none", background: "#f3f3f3", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>✕</button>
//             </div>
//             <div style={{ background: "#fbf5ec", borderRadius: 18, padding: "14px 14px 16px", marginBottom: 18 }}>
//               <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#3a2c18" }}>Manage your hosting</div>
//               <div style={{ fontSize: 12, color: "#7a6b57", lineHeight: 1.5 }}>Quickly access your dashboard, listings and account actions.</div>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
//               {[
//                 { icon: "🏖️", label: "Book a Stay", sub: "Browse and book properties", action: () => { setSideMenuOpen(false); navigate("/properties"); } },
//                 { icon: "✨", label: "Signature Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
//                 { icon: "🏘️", label: "Become a Host", sub: "List your property and earn", action: goListingPage },
//                 { icon: "📊", label: "Profile", sub: "View your bookings & performance", action: goDashboard },
//                 { icon: "🛡️", label: "Owner Dashboard", sub: "Access owner controls", action: goOwnerDashboard },
//                 // ── NEW CAREER OPTION ──
//                 { icon: "💼", label: "Career", sub: "Join our growing team", action: goCareer },
//               ].map((item) => (
//                 <button key={item.label} onClick={item.action} style={panelButtonStyle}>
//                   <span style={iconBoxStyle}>{item.icon}</span>
//                   <div style={{ textAlign: "left" }}>
//                     <div style={{ fontSize: 14, fontWeight: 500, color: "#232323" }}>{item.label}</div>
//                     <div style={{ fontSize: 12, color: "#8a8a8a" }}>{item.sub}</div>
//                   </div>
//                 </button>
//               ))}
//               <button onClick={() => { setSideMenuOpen(false); navigate("/subsription"); }} style={panelButtonStyle}>
//                 <span style={iconBoxStyle}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="#c2772b" strokeWidth="1.8" /><path d="M3 9H21" stroke="#c2772b" strokeWidth="1.8" /><circle cx="8" cy="14" r="1.4" fill="#c2772b" /><circle cx="12" cy="14" r="1.4" fill="#c2772b" /><circle cx="16" cy="14" r="1.4" fill="#c2772b" /></svg></span>
//                 <div style={{ textAlign: "left" }}>
//                   <div style={{ fontSize: 14, fontWeight: 500, color: "#232323" }}>Subscription Plan</div>
//                   <div style={{ fontSize: 12, color: "#8a8a8a" }}>Grow Faster With the Right Plan</div>
//                 </div>
//               </button>
//               <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "13px 0" }} />
//               <button onClick={handleLogout} style={{ border: "none", background: "transparent", padding: "8px 4px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
//                 <span style={{ width: 28, height: 28, borderRadius: 999, background: "#fdeceb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#c23e3e" }}>⬅</span>
//                 <span style={{ fontSize: 14, fontWeight: 500, color: "#c23e3e" }}>Log out</span>
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

import { UserCircle2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../Login/AuthContext";

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

  const handleSignatureStaysClick = () => {
    setSideMenuOpen(false);
    setHamburgerMenuOpen(false);
    const isHome = window.location.pathname === "/" || window.location.pathname === "";
    if (isHome) {
      const el = document.getElementById("signature-stays-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      sessionStorage.setItem("scrollToSignature", "true");
      navigate("/");
    }
  };

  const handleLogin = () => navigate("/login");
  const goDashboard = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navigate("/dashboard"); };
  const goListingPage = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); setRentalCategoryPopup(true); };
  const goOwnerDashboard = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navigate("/admindashboard"); };
  const handleBecomeHostClick = () => setRentalCategoryPopup(true);
  const goCareer = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navigate("/career-support"); };
  const goOvikaVerified = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navigate("/ovika-verified"); };
  const goSelfVerified  = () => { setSideMenuOpen(false); setHamburgerMenuOpen(false); navigate("/ovika-self-verified"); };

  const handleRentalCategorySelect = (path) => {
    setRentalCategoryPopup(false);
    setSideMenuOpen(false);
    setHamburgerMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setSideMenuOpen(false);
    setHamburgerMenuOpen(false);
    try {
      STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
      try { sessionStorage.removeItem("user"); sessionStorage.removeItem("tm_user"); } catch (_) { }
    } catch (_) { }
    try { logout(); } catch (_) { }
    window.location.href = "/";
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
  if (isMobile) {
    return (
      <>
        <style>{globalCSS}</style>

        <div style={{ position: "relative", zIndex: 99999, fontFamily: "Poppins, sans-serif", background: "#fff", borderBottom: "1px solid #f0e8d8" }}>

          {/* ── ROW 1: Hamburger | Logo | User ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 4px 16px" }}>

            {/* Hamburger */}
            <button
              onClick={() => setHamburgerMenuOpen(true)}
              style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 22, padding: "4px 6px", display: "flex", alignItems: "center", color: "#232323" }}
            >
              ☰
            </button>

            {/* Logo center */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
                {/* ── LOGO IMAGE (transparent background) ── */}
                <img
                  src="/ovikaliving_logo_clean.png"
                  alt="OvikaLiving"
                  style={{
                    height: 28,
                    objectFit: "contain",
                    background: "transparent",
                    display: "block",
                  }}
                />
                <span style={{ fontSize: 8, color: "#c2772b", fontWeight: 400, marginTop: 1, letterSpacing: "0.2px", opacity: 0.85 }}>A flagship rental brand of Townmonor Technologies Pvt. Ltd.</span>
              </div>
            </div>

            {/* User / Sign In */}
            <div>
              {user ? (
                <button
                  onClick={() => setSideMenuOpen(true)}
                  style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px 6px", display: "flex", alignItems: "center", color: "#c2772b" }}
                >
                  <UserCircle2 size={26} strokeWidth={1.5} color="#1a1a1a" />
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px 6px", display: "flex", alignItems: "center" }}
                >
                  <UserCircle2 size={26} strokeWidth={1.5} color="#1a1a1a" />
                </button>
              )}
            </div>
          </div>

          {/* ── ROW 2: Nav Buttons ── */}
          <div style={{ background: "linear-gradient(135deg, #2a1a08 0%, #3a2410 50%, #2a1a08 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 12px" }}>
            {[
              { label: "Book a Stay", action: () => navigate("/properties") },
              { label: "Signature Stays", action: handleSignatureStaysClick },
              { label: "Become a Host", action: handleBecomeHostClick },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                style={{ border: "1.5px solid rgba(194,119,43,0.75)", background: "transparent", color: "#e8d5a3", fontWeight: 500, fontSize: 11, borderRadius: 20, padding: "5px 12px", height: 30, display: "flex", alignItems: "center", cursor: "pointer", fontFamily: "Poppins, sans-serif", letterSpacing: "0.2px", transition: "all 0.25s ease", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(194,119,43,0.18)"; e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(194,119,43,0.75)"; e.currentTarget.style.color = "#e8d5a3"; }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── RENTAL CATEGORY POPUP ── */}
        {rentalCategoryPopup && (
          <>
            <div onClick={() => setRentalCategoryPopup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000005, animation: "fadeIn 0.3s ease-out" }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxHeight: "90vh", background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", zIndex: 1000006, overflow: "hidden", animation: "scaleIn 0.3s ease-out" }}>
              <button onClick={() => setRentalCategoryPopup(false)} style={{ position: "absolute", top: 20, right: 20, border: "none", background: "#f3f3f3", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", zIndex: 10 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f3f3"; }}>✕</button>
              <div style={{ background: "linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)", padding: "30px 20px", textAlign: "center" }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1f1f1f", margin: 0 }}>Listing Category</h2>
              </div>
              <div style={{ padding: "30px 20px", display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
                {[
                  { title: "Short Term Rental", desc: "PG, apartments, houses, and farmhouse accommodations - Nightly Rental", emoji: "🏠", bg: "linear-gradient(135deg, #fff4e6 0%, #ffe4cc 100%)", path: "/listed1" },
                  { title: "Long Term Rental", desc: "PG, apartments, houses, and farmhouse accommodations - Monthly Rental", emoji: "🏢", bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", path: "/list-pg" },
                ].map((item) => (
                  <div key={item.title}
                    style={{ border: "2px solid #e0e0e0", borderRadius: 20, padding: "30px 20px", textAlign: "center", transition: "all 0.3s", cursor: "pointer", background: "#fff" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(194,119,43,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    onClick={() => handleRentalCategorySelect(item.path)}
                  >
                    <div style={{ width: 80, height: 80, margin: "0 auto 20px", background: item.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{item.emoji}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: "#232323", marginBottom: 12 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 25 }}>{item.desc}</p>
                    <button style={{ border: "none", background: "linear-gradient(135deg, #c2772b 0%, #c2772b 100%)", color: "#fff", fontWeight: 600, fontSize: 14, borderRadius: 12, padding: "12px 24px", cursor: "pointer", width: "100%", transition: "all 0.3s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>List Properties</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── HAMBURGER PANEL (Mobile) ── */}
        {hamburgerMenuOpen && (
          <>
            <div onClick={() => setHamburgerMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1000000 }} />
            <div style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "min(280px, 75vw)", background: "#fff", borderRadius: "0 24px 24px 0", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", padding: "18px 16px 24px", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .28s ease-out", overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#1f1f1f" }}>Menu</div>
                  <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>Navigate through Ovika</div>
                </div>
                <button onClick={() => setHamburgerMenuOpen(false)} style={{ border: "none", background: "#f3f3f3", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {[
                  { icon: "🏠", label: "Home", sub: "Return to homepage", action: () => { setHamburgerMenuOpen(false); navigate("/"); } },
                  { icon: "🏖️", label: "Book a Stay", sub: "Browse and book properties", action: () => { setHamburgerMenuOpen(false); navigate("/properties"); } },
                  { icon: "✨", label: "Signature Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
                  { icon: "🏘️", label: "Become a Host", sub: "List your property and earn", action: () => { setHamburgerMenuOpen(false); setRentalCategoryPopup(true); } },
                  { icon: "📊", label: "Profile", sub: "View your bookings & performance", action: () => { setHamburgerMenuOpen(false); navigate("/dashboard"); } },
                  { icon: "🛡️", label: "Owner Dashboard", sub: "Access owner controls", action: () => { setHamburgerMenuOpen(false); navigate("/admindashboard"); } },
                  { icon: "💬", label: "Subscription Plan", sub: "Grow Faster With the Right Plan", action: () => { setHamburgerMenuOpen(false); navigate("/subsription"); } },
                  { icon: "📞", label: "Contact / Support", sub: "Get help and assistance", action: () => { setHamburgerMenuOpen(false); navigate("/contactus"); } },
                  { icon: "💼", label: "Career", sub: "Join our growing team", action: goCareer },
                  { icon: <img src="/ovikaver.png" alt="ovika-verified" style={{ width: '20px', height: 'auto' }} />, label: "OvikaLiving Verified", sub: "Know about our verification process", action: goOvikaVerified },
                  { icon: "✅", label: "Self Verification", sub: "Verify your property yourself", action: goSelfVerified },
                  { icon: "🗺️", label: "Explore Townmanor", sub: "Discover amazing places", action: () => { setHamburgerMenuOpen(false); window.open("https://www.townmanor.ai/", "_blank"); } },
                ].map((item) => (
                  <button key={item.label} onClick={item.action} style={{ ...panelButtonStyle, padding: "8px 4px" }}>
                    <span style={{
                      ...iconBoxStyle,
                      width: 28,
                      height: 28,
                      borderRadius: 12,
                      fontSize: 14
                    }}>
                      {item.icon}
                    </span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#232323" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "#8a8a8a" }}>{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── RIGHT USER PANEL (Mobile) ── */}
        {user && sideMenuOpen && (
          <>
            <div onClick={() => setSideMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1000000 }} />
            <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(280px, 80vw)", background: "#fff", borderRadius: "24px 0 0 24px", boxShadow: "0 10px 40px rgba(0,0,0,0.18)", padding: "18px 16px 24px", zIndex: 1000003, display: "flex", flexDirection: "column", animation: "slideDownSidebar .28s ease-out", overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #c2772b, #a85e1f)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>{user.username?.[0]?.toUpperCase() || "U"}</div>
                    <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#c2772b", border: "2px solid #fff" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{user.username}</div>
                    <div style={{ fontSize: 10, color: "#c2772b", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>● Logged in</div>
                  </div>
                </div>
                <button onClick={() => setSideMenuOpen(false)} style={{ border: "none", background: "#f3f3f3", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ background: "#fbf5ec", borderRadius: 18, padding: "12px 12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#3a2c18" }}>Manage your hosting</div>
                <div style={{ fontSize: 11, color: "#7a6b57", lineHeight: 1.5 }}>Quickly access your dashboard, listings and account actions.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {[
                  { icon: "🏖️", label: "Book a Stay", sub: "Browse and book properties", action: () => { setSideMenuOpen(false); navigate("/properties"); } },
                  { icon: "✨", label: "Signature Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
                  { icon: "🏘️", label: "Become a Host", sub: "List your property and earn", action: goListingPage },
                  { icon: "📊", label: "Profile", sub: "View your bookings & performance", action: goDashboard },
                  { icon: "🛡️", label: "Owner Dashboard", sub: "Access owner controls", action: goOwnerDashboard },
                  { icon: "💼", label: "Career", sub: "Join our growing team", action: goCareer },
                  { icon: <img src="/ovikaver.png" alt="ovika-verified" style={{ width: '20px', height: 'auto' }} />, label: "OvikaLiving Verified", sub: "Know about our verification process", action: goOvikaVerified },
                  { icon: "✅", label: "Self Verification", sub: "Verify your property yourself", action: goSelfVerified },
                ].map((item) => (
                  <button key={item.label} onClick={item.action} style={{ ...panelButtonStyle, padding: "8px 4px" }}>
                    <span style={{
                      ...iconBoxStyle,
                      width: 28,
                      height: 28,
                      borderRadius: 12,
                      fontSize: 14
                    }}>
                      {item.icon}
                    </span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#232323" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "#8a8a8a" }}>{item.sub}</div>
                    </div>
                  </button>
                ))}
                <button onClick={() => { setSideMenuOpen(false); navigate("/subsription"); }} style={{ ...panelButtonStyle, padding: "8px 4px" }}>
                  <span style={{ ...iconBoxStyle, width: 28, height: 28 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="#c2772b" strokeWidth="1.8" /><path d="M3 9H21" stroke="#c2772b" strokeWidth="1.8" /><circle cx="8" cy="14" r="1.4" fill="#c2772b" /><circle cx="12" cy="14" r="1.4" fill="#c2772b" /><circle cx="16" cy="14" r="1.4" fill="#c2772b" /></svg></span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#232323" }}>Subscription Plan</div>
                    <div style={{ fontSize: 11, color: "#8a8a8a" }}>Grow Faster With the Right Plan</div>
                  </div>
                </button>
                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />
                <button onClick={handleLogout} style={{ border: "none", background: "transparent", padding: "8px 4px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 999, background: "#fdeceb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#c23e3e" }}>⬅</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#c23e3e" }}>Log out</span>
                </button>
              </div>
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

      <div style={{ position: "relative", zIndex: 99999, fontFamily: "Poppins, sans-serif", background: "#fff", borderBottom: "1px solid #f0e8d8", boxShadow: "0 2px 18px rgba(71,38,9,0.09)" }}>

        {/* ── ROW 1 ── */}
        <div style={{ display: "flex", alignItems: "center", padding: "10px 36px 6px 36px", position: "relative" }}>

          {/* LEFT */}
          <div style={{ width: 200, display: "flex", alignItems: "center", flexShrink: 0 }}>
            <button
              onClick={() => setHamburgerMenuOpen(true)}
              style={{ border: "1px solid rgba(194,119,43,0.25)", background: "#fdf8f2", cursor: "pointer", padding: "6px 14px 6px 10px", display: "flex", alignItems: "center", gap: 8, color: "#3a2410", transition: "all 0.22s ease", borderRadius: 10, fontFamily: "Poppins, sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fef0dc"; e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(194,119,43,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fdf8f2"; e.currentTarget.style.borderColor = "rgba(194,119,43,0.25)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 18 }}>
                <span style={{ display: "block", height: 1.8, background: "#3a2410", borderRadius: 2, width: "100%" }} />
                <span style={{ display: "block", height: 1.8, background: "#c2772b", borderRadius: 2, width: "75%" }} />
                <span style={{ display: "block", height: 1.8, background: "#3a2410", borderRadius: 2, width: "100%" }} />
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "#3a2410", letterSpacing: "0.3px", whiteSpace: "nowrap" }}>Menu</span>
            </button>
          </div>

          {/* CENTER logo — PNG with transparent background */}
          <div
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: 2 }}
            onClick={() => navigate("/")}
          >
            {/* ── LOGO IMAGE ── */}
            <img
              src="/ovikaliving_logo_clean.png"
              alt="OvikaLiving"
              style={{
                height: 30,
                objectFit: "contain",
                background: "transparent",
                display: "block",
              }}
            />
            <span style={{ fontSize: 9, color: "#c2772b", fontWeight: 400, letterSpacing: "0.3px", opacity: 0.7, whiteSpace: "nowrap", fontFamily: "Poppins, sans-serif" }}>A flagship rental brand of Townmonor Technologies Pvt. Ltd.</span>
          </div>

          {/* RIGHT auth */}
          <div style={{ width: 200, display: "flex", alignItems: "center", justifyContent: "flex-end", flexShrink: 0, marginLeft: "auto" }}>
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
                style={{ border: "1.5px solid #c2772b", background: "#fff", color: "#c2772b", fontWeight: 500, fontSize: 13, borderRadius: 22, padding: "6px 20px", height: 34, display: "flex", alignItems: "center", cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.25s", boxShadow: "0 1px 6px rgba(194,119,43,0.12)", letterSpacing: "0.3px" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fef9f2"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(194,119,43,0.22)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(194,119,43,0.12)"; }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* ── ROW 2: Nav strip ── */}
        <div style={{ background: "linear-gradient(135deg, #2a1a08 0%, #3a2410 50%, #2a1a08 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "8px 44px 9px 44px" }}>
          {[
            { label: "Book a Stay", action: () => navigate("/properties") },
            { label: "Signature Stays", action: handleSignatureStaysClick },
            { label: "Become a Host", action: handleBecomeHostClick },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              style={{ border: "1.5px solid rgba(194,119,43,0.75)", background: "transparent", color: "#e8d5a3", fontWeight: 500, fontSize: 13, borderRadius: 22, padding: "6px 24px", height: 34, display: "flex", alignItems: "center", cursor: "pointer", fontFamily: "Poppins, sans-serif", letterSpacing: "0.3px", transition: "all 0.25s ease", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(194,119,43,0.18)"; e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(194,119,43,0.75)"; e.currentTarget.style.color = "#e8d5a3"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RENTAL CATEGORY POPUP (Desktop) ── */}
      {rentalCategoryPopup && (
        <>
          <div onClick={() => setRentalCategoryPopup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000005, animation: "fadeIn 0.3s ease-out" }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(950px, 90vw)", maxHeight: "90vh", background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", zIndex: 1000006, overflow: "hidden", animation: "scaleIn 0.3s ease-out" }}>
            <button onClick={() => setRentalCategoryPopup(false)} style={{ position: "absolute", top: 20, right: 20, border: "none", background: "#f3f3f3", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", zIndex: 10 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e0e0e0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f3f3"; }}>✕</button>
            <div style={{ background: "linear-gradient(135deg, #c2772b 0%, #a85e1f 100%)", padding: "40px 30px", textAlign: "center" }}>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1f1f1f", margin: 0 }}>Listing Category</h2>
            </div>
            <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 30 }}>
              {[
                { title: "Short Term Rental", desc: "PG, apartments, houses, and farmhouse accommodations - Nightly Rental", emoji: "🏠", bg: "linear-gradient(135deg, #fff4e6 0%, #ffe4cc 100%)", path: "/listed1" },
                { title: "Long Term Rental", desc: "PG, apartments, houses, and farmhouse accommodations - Monthly Rental", emoji: "🏢", bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", path: "/list-pg" },
              ].map((item) => (
                <div key={item.title}
                  style={{ border: "2px solid #e0e0e0", borderRadius: 20, padding: "40px 30px", textAlign: "center", transition: "all 0.3s", cursor: "pointer", background: "#fff" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c2772b"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(194,119,43,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  onClick={() => handleRentalCategorySelect(item.path)}
                >
                  <div style={{ width: 100, height: 100, margin: "0 auto 20px", background: item.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>{item.emoji}</div>
                  <h3 style={{ fontSize: 24, fontWeight: 600, color: "#232323", marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6, marginBottom: 25 }}>{item.desc}</p>
                  <button style={{ border: "none", background: "linear-gradient(135deg, #c2772b 0%, #c2772b 100%)", color: "#fff", fontWeight: 600, fontSize: 16, borderRadius: 12, padding: "14px 32px", cursor: "pointer", width: "100%", transition: "all 0.3s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>List Properties</button>
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
                { icon: "🏠", label: "Home", sub: "Return to homepage", action: () => { setHamburgerMenuOpen(false); navigate("/"); } },
                { icon: "🏖️", label: "Book a Stay", sub: "Browse and book properties", action: () => { setHamburgerMenuOpen(false); navigate("/properties"); } },
                { icon: "✨", label: "Signature Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
                { icon: "🏘️", label: "Become a Host", sub: "List your property and earn", action: () => { setHamburgerMenuOpen(false); setRentalCategoryPopup(true); } },
                { icon: "📊", label: "Profile", sub: "View your bookings & performance", action: () => { setHamburgerMenuOpen(false); navigate("/dashboard"); } },
                { icon: "🛡️", label: "Owner Dashboard", sub: "Access owner controls", action: () => { setHamburgerMenuOpen(false); navigate("/admindashboard"); } },
                { icon: "💬", label: "Subscription Plan", sub: "Grow Faster With the Right Plan", action: () => { setHamburgerMenuOpen(false); navigate("/subsription"); } },
                { icon: "📞", label: "Contact / Support", sub: "Get help and assistance", action: () => { setHamburgerMenuOpen(false); navigate("/contactus"); } },
                { icon: "💼", label: "Career", sub: "Join our growing team", action: goCareer },
                { icon: <img src="/ovikaver.png" alt="ovika-verified" style={{ width: '20px', height: 'auto' }} />, label: "OvikaLiving Verified", sub: "Know about our verification process", action: goOvikaVerified },
                { icon: "✅", label: "Self Verification", sub: "Verify your property yourself", action: goSelfVerified },
                { icon: "🗺️", label: "Explore Townmanor", sub: "Discover amazing places", action: () => { setHamburgerMenuOpen(false); window.open("https://www.townmanor.ai/", "_blank"); } },
              ].map((item) => (
                <button key={item.label} onClick={item.action} style={{ border: "none", background: "transparent", padding: "7px 4px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", width: "100%", borderRadius: 8, transition: "background 0.15s" }}
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
                { icon: "🏖️", label: "Book a Stay", sub: "Browse and book properties", action: () => { setSideMenuOpen(false); navigate("/properties"); } },
                { icon: "✨", label: "Signature Stays", sub: "Our curated premium properties", action: handleSignatureStaysClick },
                { icon: "🏘️", label: "Become a Host", sub: "List your property and earn", action: goListingPage },
                { icon: "📊", label: "Profile", sub: "View your bookings & performance", action: goDashboard },
                { icon: "🛡️", label: "Owner Dashboard", sub: "Access owner controls", action: goOwnerDashboard },
                { icon: "💼", label: "Career", sub: "Join our growing team", action: goCareer },
                { icon: <img src="/ovikaver.png" alt="ovika-verified" style={{ width: '20px', height: 'auto' }} />, label: "OvikaLiving Verified", sub: "Know about our verification process", action: goOvikaVerified },
                { icon: "✅", label: "Self Verification", sub: "Verify your property yourself", action: goSelfVerified },
              ].map((item) => (
                <button key={item.label} onClick={item.action} style={panelButtonStyle}>
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
              <button onClick={() => { setSideMenuOpen(false); navigate("/subsription"); }} style={panelButtonStyle}>
                <span style={iconBoxStyle}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="#c2772b" strokeWidth="1.8" /><path d="M3 9H21" stroke="#c2772b" strokeWidth="1.8" /><circle cx="8" cy="14" r="1.4" fill="#c2772b" /><circle cx="12" cy="14" r="1.4" fill="#c2772b" /><circle cx="16" cy="14" r="1.4" fill="#c2772b" /></svg></span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#232323" }}>Subscription Plan</div>
                  <div style={{ fontSize: 12, color: "#8a8a8a" }}>Grow Faster With the Right Plan</div>
                </div>
              </button>
              <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "13px 0" }} />
              <button onClick={handleLogout} style={{ border: "none", background: "transparent", padding: "8px 4px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, background: "#fdeceb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#c23e3e" }}>⬅</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#c23e3e" }}>Log out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}