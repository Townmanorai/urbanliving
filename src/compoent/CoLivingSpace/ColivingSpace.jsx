// // import React, { useState } from "react";

// // const styles = {
// //   root: {
// //     fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
// //     color: "#1a1a1a",
// //     background: "#ffffff",
// //     minHeight: "100vh",
// //   },
// //   gold: { color: "#b8832a" },

// //   /* ── NAVBAR ── */
// //   nav: {
// //     display: "flex",
// //     alignItems: "center",
// //     padding: "16px 48px",
// //     background: "#fff",
// //     borderBottom: "1px solid #e0d8cc",
// //   },
// //   logoWrap: { display: "flex", alignItems: "center" },
// //   logoImg: { height: "110px", width: "auto", display: "block", objectFit: "contain" },

// //   /* ── HERO ── */
// //   heroOuter: {
// //     background: "#f7f3ee",
// //     width: "100%",
// //   },
// //   hero: {
// //     display: "flex",
// //     alignItems: "normal",
// //     justifyContent: "center",
// //     minHeight: "520px",
// //     maxHeight: "620px",
// //     maxWidth: "1300px",
// //     margin: "0 auto",
// //     overflow: "hidden",
// //   },
// //   heroContent: {
// //     flex: "0 0 50%",
// //     padding: "56px 48px 48px 48px",
// //     display: "flex",
// //     flexDirection: "column",
// //     justifyContent: "center",
// //     zIndex: 2,
// //   },
// //   heroTitle: {
// //     fontFamily: "'Georgia', 'Times New Roman', serif",
// //     fontSize: "46px",
// //     fontWeight: 400,
// //     color: "#1a1a1a",
// //     lineHeight: 1.15,
// //     marginBottom: "12px",
// //   },
// //   heroSubtitle: {
// //     fontSize: "20px",
// //     color: "#1a1a1a",
// //     marginBottom: "16px",
// //     fontWeight: 400,
// //   },
// //   heroDesc: {
// //     fontSize: "15px",
// //     color: "#444444",
// //     lineHeight: 1.65,
// //     marginBottom: "32px",
// //     maxWidth: "480px",
// //   },
// //   heroBtns: { display: "flex", gap: "16px", flexWrap: "wrap" },
// //   heroImageWrap: { flex: "0 0 50%", position: "relative", overflow: "hidden" },
// //   heroImg: {
// //     width: "100%",
// //     height: "100%",
// //     objectFit: "cover",
// //     objectPosition: "center 15%",
// //     display: "block",
// //     minHeight: "380px",
// //     background: "#e8ddd0",
// //   },

// //   /* ── BUTTONS ── */
// //   btnPrimary: {
// //     background: "#b8832a",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "50px",
// //     padding: "14px 30px",
// //     fontSize: "15px",
// //     fontWeight: 600,
// //     cursor: "pointer",
// //     whiteSpace: "nowrap",
// //   },
// //   btnPrimaryFull: {
// //     background: "#b8832a",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "10px",
// //     padding: "16px",
// //     fontSize: "15px",
// //     fontWeight: 600,
// //     cursor: "pointer",
// //     width: "100%",
// //     textAlign: "center",
// //     marginTop: "20px",
// //   },
// //   btnPrimarySm: {
// //     background: "#b8832a",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "50px",
// //     padding: "10px 24px",
// //     fontSize: "14px",
// //     fontWeight: 600,
// //     cursor: "pointer",
// //   },
// //   btnOutline: {
// //     background: "transparent",
// //     color: "#1a1a1a",
// //     border: "2px solid #1a1a1a",
// //     borderRadius: "50px",
// //     padding: "13px 28px",
// //     fontSize: "15px",
// //     fontWeight: 500,
// //     cursor: "pointer",
// //   },

// //   /* ── FEATURES SECTION ── */
// //   featuresSection: {
// //     display: "grid",
// //     gridTemplateColumns: "320px 1fr 320px",
// //     gap: "40px",
// //     padding: "60px 48px",
// //     background: "#fff",
// //     alignItems: "start",
// //   },
// //   featuresImgWrap: {
// //     borderRadius: "20px",
// //     overflow: "hidden",
// //     boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
// //   },
// //   featuresImg: {
// //     width: "100%",
// //     height: "280px",
// //     objectFit: "cover",
// //     display: "block",
// //     background: "#e0d5c8",
// //   },
// //   featuresHeading: {
// //     fontFamily: "'Georgia', 'Times New Roman', serif",
// //     fontSize: "30px",
// //     fontWeight: 400,
// //     color: "#1a1a1a",
// //     lineHeight: 1.3,
// //     marginBottom: "8px",
// //   },
// //   featuresSub: {
// //     fontSize: "14px",
// //     marginBottom: "24px",
// //     fontStyle: "italic",
// //     color: "#b8832a",
// //   },
// //   checklist: { listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" },
// //   checklistItem: { display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#1a1a1a" },
// //   checklistItemSm: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#1a1a1a" },
// //   checkmark: { color: "#b8832a", fontWeight: 700, fontSize: "16px", flexShrink: 0 },

// //   /* ── PARTNER CARD ── */
// //   partnerCard: {
// //     background: "#faf7f2",
// //     border: "1px solid #e0d8cc",
// //     borderRadius: "20px",
// //     padding: "28px 28px 24px",
// //     display: "flex",
// //     flexDirection: "column",
// //   },
// //   partnerTitle: {
// //     fontFamily: "'Georgia', 'Times New Roman', serif",
// //     fontSize: "18px",
// //     fontWeight: 600,
// //     color: "#1a1a1a",
// //     marginBottom: "10px",
// //     lineHeight: 1.4,
// //   },
// //   partnerDesc: {
// //     fontSize: "14px",
// //     color: "#444444",
// //     lineHeight: 1.5,
// //     marginBottom: "16px",
// //   },
// //   browseBlock: {
// //     marginTop: "24px",
// //     paddingTop: "20px",
// //     borderTop: "1px solid #e0d8cc",
// //     textAlign: "center",
// //   },
// //   browseLabel: { fontSize: "13px", color: "#1a1a1a", marginBottom: "4px" },
// //   browseSub: { fontSize: "15px", color: "#1a1a1a", marginBottom: "14px", lineHeight: 1.4 },

// //   /* ── FORM SECTION ── */
// //   formSection: {
// //     background: "#fff",
// //     padding: "40px 48px 60px",
// //     display: "flex",
// //     justifyContent: "center",
// //   },
// //   formWrap: { width: "100%", maxWidth: "800px", textAlign: "center" },
// //   formTitle: {
// //     fontFamily: "'Georgia', 'Times New Roman', serif",
// //     fontSize: "24px",
// //     fontWeight: 400,
// //     color: "#1a1a1a",
// //     marginBottom: "6px",
// //   },
// //   formSub: { fontSize: "14px", color: "#777777", marginBottom: "24px" },
// //   formFields: {
// //     display: "grid",
// //     gridTemplateColumns: "1fr 1fr 1.5fr",
// //     gap: "14px",
// //     marginBottom: "18px",
// //   },
// //   input: {
// //     border: "1.5px solid #e0d8cc",
// //     borderRadius: "8px",
// //     padding: "12px 14px",
// //     fontSize: "14px",
// //     color: "#1a1a1a",
// //     background: "#fff",
// //     outline: "none",
// //     fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
// //   },
// //   radioGroup: {
// //     display: "flex",
// //     gap: "28px",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginTop: "10px",
// //   },
// //   radioLabel: {
// //     display: "flex",
// //     alignItems: "center",
// //     gap: "8px",
// //     fontSize: "14px",
// //     color: "#1a1a1a",
// //     cursor: "pointer",
// //   },
// //   radioInput: { accentColor: "#b8832a", width: "16px", height: "16px", cursor: "pointer" },

// //   /* ── FOOTER ── */
// //   footer: {
// //     background: "#fff",
// //     borderTop: "1px solid #e0d8cc",
// //     padding: "40px 48px",
// //     textAlign: "center",
// //   },
// //   footerText: {
// //     fontFamily: "'Georgia', 'Times New Roman', serif",
// //     fontSize: "22px",
// //     color: "#1a1a1a",
// //     marginBottom: "8px",
// //   },
// //   footerCity: { color: "#b8832a", fontWeight: 700 },
// //   footerSub: { fontSize: "16px", color: "#444444", marginBottom: "20px" },
// //   footerLogoWrap: { display: "flex", justifyContent: "center", alignItems: "center" },
// //   footerLogoImg: { height: "90px", width: "auto", objectFit: "contain" },
// // };

// // export default function OvikaLiving() {
// //   const [formData, setFormData] = useState({ name: "", phone: "", email: "", role: "" });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   return (
// //     <div style={styles.root}>

// //       {/* ── NAVBAR ── */}
// //       <nav style={styles.nav}>
// //         <div style={styles.logoWrap}>
// //           <img src="/colivingol.png" alt="OvikaLiving Logo" style={styles.logoImg} />
// //         </div>
// //       </nav>

// //       {/* ── HERO ── */}
// //       <div style={styles.heroOuter}>
// //       <section style={styles.hero}>
// //         <div style={styles.heroContent}>
// //           <h1 style={styles.heroTitle}>Ovika Co-Living Spaces</h1>
// //           <p style={styles.heroSubtitle}>
// //             <strong>Smart Community</strong> Living —{" "}
// //             <span style={styles.gold}>Launching Soon</span>
// //           </p>
// //           <p style={styles.heroDesc}>
// //             Premium shared living spaces designed for students, young professionals, and urban
// //             residents in Noida &amp; Greater Noida. Experience comfort, flexibility, and vibrant
// //             community living powered by the OvikaLiving platform.
// //           </p>
// //           <div style={styles.heroBtns}>
// //             <button style={styles.btnPrimary}>Get Early Access</button>
// //             <button style={styles.btnOutline}>List Your Property</button>
// //           </div>
// //         </div>
// //         <div style={styles.heroImageWrap}>
// //           <img src="/colivingmodel.png" alt="OvikaLiving model" style={styles.heroImg} />
// //         </div>
// //       </section>
// //       </div>

// //       {/* ── FEATURES + PARTNER ── */}
// //       <section style={styles.featuresSection}>

// //         {/* Left: image */}
// //         <div style={styles.featuresImgWrap}>
// //           <img src="/colivingspace.jpeg" alt="Co-living community" style={styles.featuresImg} />
// //         </div>

// //         {/* Center: checklist */}
// //         <div>
// //           <h2 style={styles.featuresHeading}>
// //             Live Smart. <span style={styles.gold}>Live Connected.</span>
// //           </h2>
// //           <p style={styles.featuresSub}>Worldwide co-living spaces in Noida or Greater Noida.</p>
// //           <ul style={styles.checklist}>
// //             {["Fully furnished homes", "Flexible monthly stays", "Community lifestyle", "Smart digital booking", "Prime locations near offices & metro"].map((item) => (
// //               <li key={item} style={styles.checklistItem}>
// //                 <span style={styles.checkmark}>✓</span> {item}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>

// //         {/* Right: partner card */}
// //         <div style={styles.partnerCard}>
// //           <h3 style={styles.partnerTitle}>Own a property in Noida or Greater Noida?</h3>
// //           <p style={styles.partnerDesc}>Convert it into a high-yield co-living space with OvikaLiving.</p>
// //           <ul style={styles.checklist}>
// //             {["Marketing", "Tenant management", "Property operations", "Payments & bookings"].map((item) => (
// //               <li key={item} style={styles.checklistItemSm}>
// //                 <span style={styles.checkmark}>✓</span> {item}
// //               </li>
// //             ))}
// //           </ul>
// //           <button style={styles.btnPrimaryFull}>Partner With OvikaLiving</button>

// //           <div style={styles.browseBlock}>
// //             <p style={styles.browseLabel}><strong>Launching Soon in</strong></p>
// //             <p style={styles.browseSub}>
// //               Explore Signature Stays on <span style={styles.gold}>OvikaLiving™</span>
// //             </p>
// //             <button style={styles.btnPrimarySm}>Browse Stays</button>
// //           </div>
// //         </div>
// //       </section>


// //       {/* ── FOOTER ── */}
// //       <footer style={styles.footer}>
// //         <p style={styles.footerText}>
// //           Launching Soon in{" "}
// //           <span style={styles.footerCity}>Noida &amp; Greater Noida</span> 🎉
// //         </p>
// //         <p style={styles.footerSub}>First 50 residents receive special launch benefits</p>
// //         <div style={styles.footerLogoWrap}>
// //           <img src="/ol.jpeg" alt="OvikaLiving Logo" style={styles.footerLogoImg} />
// //         </div>
// //       </footer>

// //     </div>
// //   );
// // }

// import React, { useState } from "react";

// const styles = {
//   root: {
//     fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
//     color: "#1a1a1a",
//     background: "#ffffff",
//     minHeight: "100vh",
//   },
//   gold: { color: "#b8832a" },

//   /* ── NAVBAR ── */
//   nav: {
//     display: "flex",
//     alignItems: "center",
//     padding: "16px 48px",
//     background: "#fff",
//     borderBottom: "1px solid #e0d8cc",
//   },
//   logoWrap: { display: "flex", alignItems: "center" },
//   logoImg: { height: "110px", width: "auto", display: "block", objectFit: "contain" },

//   /* ── HERO ── */
//   heroOuter: {
//     background: "#f7f3ee",
//     width: "100%",
//   },
//   hero: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: "520px",
//     maxHeight: "620px",
//     maxWidth: "1100px",
//     margin: "0 auto",
//     overflow: "hidden",
//   },
//   heroContent: {
//     flex: "0 0 50%",
//     padding: "56px 48px 48px 48px",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     zIndex: 2,
//   },
//   heroTitle: {
//     fontFamily: "'Georgia', 'Times New Roman', serif",
//     fontSize: "46px",
//     fontWeight: 400,
//     color: "#1a1a1a",
//     lineHeight: 1.15,
//     marginBottom: "12px",
//   },
//   heroSubtitle: {
//     fontSize: "20px",
//     color: "#1a1a1a",
//     marginBottom: "16px",
//     fontWeight: 400,
//   },
//   heroDesc: {
//     fontSize: "15px",
//     color: "#444444",
//     lineHeight: 1.65,
//     marginBottom: "32px",
//     maxWidth: "480px",
//   },
//   heroBtns: { display: "flex", gap: "16px", flexWrap: "wrap" },
//   heroImageWrap: { flex: "0 0 50%", position: "relative", overflow: "hidden" },
//   heroImg: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     objectPosition: "center 15%",
//     display: "block",
//     minHeight: "380px",
//     background: "#e8ddd0",
//   },

//   /* ── BUTTONS ── */
//   btnPrimary: {
//     background: "#b8832a",
//     color: "#fff",
//     border: "none",
//     borderRadius: "50px",
//     padding: "14px 30px",
//     fontSize: "15px",
//     fontWeight: 600,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },
//   btnPrimaryFull: {
//     background: "#b8832a",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     padding: "16px",
//     fontSize: "15px",
//     fontWeight: 600,
//     cursor: "pointer",
//     width: "100%",
//     textAlign: "center",
//     marginTop: "20px",
//   },
//   btnPrimarySm: {
//     background: "#b8832a",
//     color: "#fff",
//     border: "none",
//     borderRadius: "50px",
//     padding: "10px 24px",
//     fontSize: "14px",
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   btnOutline: {
//     background: "transparent",
//     color: "#1a1a1a",
//     border: "2px solid #1a1a1a",
//     borderRadius: "50px",
//     padding: "13px 28px",
//     fontSize: "15px",
//     fontWeight: 500,
//     cursor: "pointer",
//   },

//   /* ── FEATURES SECTION ── */
//   featuresSection: {
//     display: "grid",
//     gridTemplateColumns: "320px 1fr 320px",
//     gap: "40px",
//     padding: "60px 48px",
//     background: "#fff",
//     alignItems: "stretch",
//     maxWidth: "1100px",
//     margin: "0 auto",
//   },
//   featuresImgWrap: {
//     borderRadius: "20px",
//     overflow: "hidden",
//     boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
//   },
//   featuresImg: {
//     width: "100%",
//     height: "280px",
//     objectFit: "cover",
//     display: "block",
//     background: "#e0d5c8",
//   },
//   featuresHeading: {
//     fontFamily: "'Georgia', 'Times New Roman', serif",
//     fontSize: "30px",
//     fontWeight: 400,
//     color: "#1a1a1a",
//     lineHeight: 1.3,
//     marginBottom: "8px",
//   },
//   featuresSub: {
//     fontSize: "14px",
//     marginBottom: "24px",
//     fontStyle: "italic",
//     color: "#b8832a",
//   },
//   checklist: { listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" },
//   checklistItem: { display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#1a1a1a" },
//   checklistItemSm: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#1a1a1a" },
//   checkmark: { color: "#b8832a", fontWeight: 700, fontSize: "16px", flexShrink: 0 },

//   /* ── PARTNER CARD ── */
//   partnerCard: {
//     background: "#faf7f2",
//     border: "1px solid #e0d8cc",
//     borderRadius: "20px",
//     padding: "28px 28px 24px",
//     // width:"160%",
//     display: "flex",
//     flexDirection: "column",
//   },
//   partnerTitle: {
//     fontFamily: "'Georgia', 'Times New Roman', serif",
//     fontSize: "18px",
//     fontWeight: 600,
//     color: "#1a1a1a",
//     marginBottom: "10px",
//     lineHeight: 1.4,
//   },
//   partnerDesc: {
//     fontSize: "14px",
//     color: "#444444",
//     lineHeight: 1.5,
//     marginBottom: "16px",
//   },
//   browseBlock: {
//     marginTop: "24px",
//     paddingTop: "20px",
//     borderTop: "1px solid #e0d8cc",
//     textAlign: "center",
//   },
//   browseLabel: { fontSize: "13px", color: "#1a1a1a", marginBottom: "4px" },
//   browseSub: { fontSize: "15px", color: "#1a1a1a", marginBottom: "14px", lineHeight: 1.4 },

//   /* ── FORM SECTION ── */
//   formSection: {
//     background: "#fff",
//     padding: "40px 48px 60px",
//     display: "flex",
//     justifyContent: "center",
//   },
//   formWrap: { width: "100%", maxWidth: "800px", textAlign: "center" },
//   formTitle: {
//     fontFamily: "'Georgia', 'Times New Roman', serif",
//     fontSize: "24px",
//     fontWeight: 400,
//     color: "#1a1a1a",
//     marginBottom: "6px",
//   },
//   formSub: { fontSize: "14px", color: "#777777", marginBottom: "24px" },
//   formFields: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr 1.5fr",
//     gap: "14px",
//     marginBottom: "18px",
//   },
//   input: {
//     border: "1.5px solid #e0d8cc",
//     borderRadius: "8px",
//     padding: "12px 14px",
//     fontSize: "14px",
//     color: "#1a1a1a",
//     background: "#fff",
//     outline: "none",
//     fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
//   },
//   radioGroup: {
//     display: "flex",
//     gap: "28px",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: "10px",
//   },
//   radioLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     fontSize: "14px",
//     color: "#1a1a1a",
//     cursor: "pointer",
//   },
//   radioInput: { accentColor: "#b8832a", width: "16px", height: "16px", cursor: "pointer" },

//   /* ── FOOTER ── */
//   footer: {
//     background: "#fff",
//     borderTop: "1px solid #e0d8cc",
//     padding: "40px 48px",
//     textAlign: "center",
//   },
//   footerText: {
//     fontFamily: "'Georgia', 'Times New Roman', serif",
//     fontSize: "22px",
//     color: "#1a1a1a",
//     marginBottom: "8px",
//   },
//   footerCity: { color: "#b8832a", fontWeight: 700 },
//   footerSub: { fontSize: "16px", color: "#444444", marginBottom: "20px" },
//   footerLogoWrap: { display: "flex", justifyContent: "center", alignItems: "center" },
//   footerLogoImg: { height: "90px", width: "auto", objectFit: "contain" },
// };

// export default function OvikaLiving() {
//   const [formData, setFormData] = useState({ name: "", phone: "", email: "", role: "" });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div style={styles.root}>

//       {/* ── NAVBAR ── */}
//       <nav style={styles.nav}>
//         <div style={styles.logoWrap}>
//           <img src="/colivingol.png" alt="OvikaLiving Logo" style={styles.logoImg} />
//         </div>
//       </nav>

//       {/* ── HERO ── */}
//       <div style={styles.heroOuter}>
//       <section style={styles.hero}>
//         <div style={styles.heroContent}>
//           <h1 style={styles.heroTitle}>Ovika Co-Living Spaces</h1>
//           <p style={styles.heroSubtitle}>
//             <strong>Smart Community</strong> Living —{" "}
//             <span style={styles.gold}>Launching Soon</span>
//           </p>
//           <p style={styles.heroDesc}>
//             Premium shared living spaces designed for students, young professionals, and urban
//             residents in Noida &amp; Greater Noida. Experience comfort, flexibility, and vibrant
//             community living powered by the OvikaLiving platform.
//           </p>
//           <div style={styles.heroBtns}>
//             <button style={styles.btnPrimary}>Get Early Access</button>
//             <button style={styles.btnOutline}>List Your Property</button>
//           </div>
//         </div>
//         <div style={styles.heroImageWrap}>
//           <img src="/colivingmodel.png" alt="OvikaLiving model" style={styles.heroImg} />
//         </div>
//       </section>
//       </div>

//       {/* ── FEATURES + PARTNER ── */}
//       <section style={styles.featuresSection}>

//         {/* Left: image */}
//         <div style={styles.featuresImgWrap}>
//           <img src="/colivingspace.jpeg" alt="Co-living community" style={styles.featuresImg} />
//         </div>

//         {/* Center: checklist */}
//         <div>
//           <h2 style={styles.featuresHeading}>
//             Live Smart. <span style={styles.gold}>Live Connected.</span>
//           </h2>
//           <p style={styles.featuresSub}>Worldwide co-living spaces in Noida or Greater Noida.</p>
//           <ul style={styles.checklist}>
//             {["Fully furnished homes", "Flexible monthly stays", "Community lifestyle", "Smart digital booking", "Prime locations near offices & metro"].map((item) => (
//               <li key={item} style={styles.checklistItem}>
//                 <span style={styles.checkmark}>✓</span> {item}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right: partner card */}
//         <div style={styles.partnerCard}>
//           <h3 style={styles.partnerTitle}>Own a property in Noida or Greater Noida?</h3>
//           <p style={styles.partnerDesc}>Convert it into a high-yield co-living space with OvikaLiving.</p>
//           <ul style={styles.checklist}>
//             {["Marketing", "Tenant management", "Property operations", "Payments & bookings"].map((item) => (
//               <li key={item} style={styles.checklistItemSm}>
//                 <span style={styles.checkmark}>✓</span> {item}
//               </li>
//             ))}
//           </ul>
//           <button style={styles.btnPrimaryFull}>Partner With OvikaLiving</button>
//           <div style={styles.browseBlock}>
//             <p style={styles.browseLabel}><strong>Launching Soon in</strong></p>
//             <p style={styles.browseSub}>
//               Explore Signature Stays on <span style={styles.gold}>OvikaLiving™</span>
//             </p>
//             <button style={styles.btnPrimarySm}>Browse Stays</button>
//           </div>
//         </div>

//       </section>

//       {/* ── FORM ── */}
//       <section style={styles.formSection}>
//         <div style={styles.formWrap}>
//           <h2 style={styles.formTitle}>Be the First to Experience Ovika Co-Living</h2>
//           <p style={styles.formSub}>Launching Soon in Noida &amp; Greater Noida.</p>
//           <div style={styles.formFields}>
//             <input style={styles.input} type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
//             <input style={styles.input} type="tel" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} />
//             <input style={styles.input} type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
//           </div>
//           <div style={styles.radioGroup}>
//             <label style={styles.radioLabel}>
//               <input style={styles.radioInput} type="radio" name="role" value="stay" checked={formData.role === "stay"} onChange={handleChange} />
//               Looking for a stay
//             </label>
//             <label style={styles.radioLabel}>
//               <input style={styles.radioInput} type="radio" name="role" value="owner" checked={formData.role === "owner"} onChange={handleChange} />
//               Property Owner
//             </label>
//           </div>
//         </div>
//       </section>

//       {/* ── FOOTER ── */}
//       <footer style={styles.footer}>
//         <p style={styles.footerText}>
//           Launching Soon in{" "}
//           <span style={styles.footerCity}>Noida &amp; Greater Noida</span> 🎉
//         </p>
//         <p style={styles.footerSub}>First 50 residents receive special launch benefits</p>
//         <div style={styles.footerLogoWrap}>
//           <img src="/ol.jpeg" alt="OvikaLiving Logo" style={styles.footerLogoImg} />
//         </div>
//       </footer>

//     </div>
//   );
// }

import React from 'react'

import C1 from './C1'
// import C2 from './C2'


export default function ColivingSpace() {
  return (
    <div>
        <C1/>
        {/* <C2/> */}
    </div>
  )
}