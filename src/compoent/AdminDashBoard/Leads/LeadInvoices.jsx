import React, { useState, useEffect } from "react";
import "./LeadInvoices.css";

/* ── jsPDF loader ── */
const ensureJsPDF = (() => {
  let p = null;
  return () => {
    if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if (p) return p;
    p = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
      s.async = true;
      s.onload = () => res(window.jspdf.jsPDF);
      s.onerror = () => rej(new Error("Failed"));
      document.head.appendChild(s);
    });
    return p;
  };
})();

async function generatePDF(inv) {
  try {
    const jsPDF = await ensureJsPDF();
    const doc = new jsPDF();
    const W = 210;

    try {
      const img = new Image(); img.src = "/ovikaliving_logo_clean.png";
      await new Promise((r, j) => { img.onload = r; img.onerror = j; });
      const lh = 17; const lw = lh * (img.width / img.height);
      doc.addImage(img, "PNG", 16, 12, lw, lh);
    } catch (_) {}

    doc.setFillColor(194,119,43); doc.rect(0,46,W,1.5,"F");

    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(100,100,100);
    doc.text("OvikaLiving by TownManor", W-16, 20, { align:"right" });
    doc.setFont("helvetica","normal"); doc.setFontSize(8);
    doc.text("Sector 62, Noida, Uttar Pradesh — 201309", W-16, 26, { align:"right" });
    doc.text("support@ovikaliving.com  |  ovikaliving.com", W-16, 31, { align:"right" });
    doc.text("GSTIN: 09AAACT1234F1ZA", W-16, 36, { align:"right" });

    doc.setFont("helvetica","bold"); doc.setFontSize(22); doc.setTextColor(30,30,30);
    doc.text("TAX INVOICE", 16, 62);
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(90,90,90);
    doc.text(`Invoice No.  : ${inv.invoiceNo}`, 16, 72);
    doc.text(`Date           : ${inv.date}`, 16, 78);
    doc.text(`Transaction  : ${inv.txnId}`, 16, 84);

    doc.setFillColor(22,101,52); doc.roundedRect(W-55,68,38,10,2,2,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(255,255,255);
    doc.text("PAID", W-36, 74.5, { align:"center" });

    doc.setDrawColor(220,220,220); doc.line(16,90,W-16,90);
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(100,100,100);
    doc.text("BILLED TO", 16, 100);
    doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(30,30,30);
    doc.text(inv.buyerName || "—", 16, 107);
    doc.setFontSize(9); doc.setTextColor(90,90,90);
    if (inv.buyerEmail) doc.text(inv.buyerEmail, 16, 113);
    if (inv.buyerPhone) doc.text(inv.buyerPhone, 16, 119);

    doc.setFillColor(245,245,245); doc.rect(16,132,W-32,10,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(80,80,80);
    doc.text("Description", 20, 139);
    doc.text("Qty", 120, 139, { align:"center" });
    doc.text("Rate", 150, 139, { align:"center" });
    doc.text("Amount", W-20, 139, { align:"right" });

    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(30,30,30);
    const rate = inv.leads ? (inv.baseAmount / inv.leads).toFixed(1) : "—";
    doc.text(`Tenant Leads — ${inv.plan} Plan`, 20, 150);
    doc.text(`${inv.leads}`, 120, 150, { align:"center" });
    doc.text(`₹${rate}`, 150, 150, { align:"center" });
    doc.text(`₹${Number(inv.baseAmount).toFixed(2)}`, W-20, 150, { align:"right" });

    doc.setDrawColor(220,220,220); doc.line(16,158,W-16,158);
    const tY = 165;
    doc.setTextColor(90,90,90);
    doc.text("Subtotal", 120, tY);
    doc.text(`₹${Number(inv.baseAmount).toFixed(2)}`, W-20, tY, { align:"right" });
    doc.text("GST @ 18%", 120, tY+8);
    doc.text(`₹${Number(inv.gstAmount).toFixed(2)}`, W-20, tY+8, { align:"right" });

    doc.setFillColor(248,244,237); doc.rect(100,tY+13,W-116,12,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(30,30,30);
    doc.text("Total Payable", 120, tY+21);
    doc.setTextColor(194,119,43);
    doc.text(`₹${Number(inv.totalAmount).toFixed(2)}`, W-20, tY+21, { align:"right" });

    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(90,90,90);
    doc.text(`Lead Validity: ${inv.validity}`, 16, tY+22);
    doc.text(`Leads: ${inv.leads} verified tenant leads`, 16, tY+29);

    doc.setFillColor(194,119,43); doc.rect(0,272,W,1,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(120,120,120);
    doc.text("This is a computer-generated invoice and does not require a physical signature.", W/2, 278, { align:"center" });
    doc.text("For support: support@ovikaliving.com  |  ovikaliving.com", W/2, 283, { align:"center" });

    doc.save(`OvikaLiving-Invoice-${inv.invoiceNo}.pdf`);
  } catch (e) {
    alert("Could not generate invoice. Please try again.");
    console.error(e);
  }
}

/* ════════════════════════════════════════
   COMPONENT
════════════════════════════════════════ */
const getUserId = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw)?.id || null;
  } catch { return null; }
};

const normalizeInvoice = (inv) => ({
  invoiceNo:   inv.invoice_no   || inv.invoiceNo   || "",
  txnId:       inv.txn_id       || inv.txnId       || "",
  plan:        inv.plan         || "",
  leads:       inv.leads        || 0,
  baseAmount:  inv.base_amount  ?? inv.baseAmount  ?? 0,
  gstAmount:   inv.gst_amount   ?? inv.gstAmount   ?? 0,
  totalAmount: inv.total_amount ?? inv.totalAmount ?? 0,
  validity:    inv.validity     || "",
  buyerName:   inv.buyer_name   || inv.buyerName   || "",
  buyerEmail:  inv.buyer_email  || inv.buyerEmail  || "",
  buyerPhone:  inv.buyer_phone  || inv.buyerPhone  || "",
  date:        inv.date         || "",
  status:      inv.status       || "paid",
});

export default function LeadInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      const userId = getUserId();

      // Try backend first
      if (userId) {
        try {
          const res = await fetch(
            `https://townmanor.ai/api/lead-invoices?user_id=${userId}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.success && Array.isArray(data.invoices) && data.invoices.length > 0) {
              setInvoices(data.invoices.map(normalizeInvoice));
              setLoading(false);
              return;
            }
          }
        } catch (_) {
          // silently fall through to localStorage
        }
      }

      // Fallback to localStorage
      try {
        const raw = localStorage.getItem("ol_lead_invoices");
        setInvoices(raw ? JSON.parse(raw).map(normalizeInvoice) : []);
      } catch (_) { setInvoices([]); }
      setLoading(false);
    };

    fetchInvoices();
  }, []);

  const handleDownload = async (inv) => {
    setDownloading(inv.invoiceNo);
    await generatePDF(inv);
    setDownloading(null);
  };

  return (
    <div className="li-wrapper">
      {/* ── Header ── */}
      <div className="li-header">
        <div className="li-header-left">
          <h2 className="li-title">Invoices</h2>
          <p className="li-subtitle">Download your lead purchase receipts anytime.</p>
        </div>
      </div>

      {/* ── Empty ── */}
      {loading ? (
        <div className="li-empty">
          <p className="li-empty-title" style={{ fontSize: 15, color: "#94a3b8" }}>Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="li-empty">
          <div className="li-empty-icon">🧾</div>
          <p className="li-empty-title">No invoices yet</p>
          <p className="li-empty-sub">
            Your invoices will appear here after you purchase a leads plan.
          </p>
        </div>
      ) : (
        <div className="li-list">
          {invoices.map((inv, i) => (
            <div className="li-card" key={inv.invoiceNo || i}>

              {/* Left */}
              <div className="li-card-icon">🧾</div>
              <div className="li-card-info">
                <div className="li-inv-no">{inv.invoiceNo}</div>
                <div className="li-inv-tags">
                  <span className="li-tag">{inv.plan} Plan</span>
                  <span className="li-tag">{inv.leads} Leads</span>
                  <span className="li-tag">{inv.validity}</span>
                  <span className="li-tag li-tag-date">{inv.date}</span>
                </div>
              </div>

              {/* Right */}
              <div className="li-card-right">
                <div className="li-amount">₹{inv.totalAmount}</div>
                <span className="li-paid-badge">PAID</span>
                <button
                  className="li-download-btn"
                  onClick={() => handleDownload(inv)}
                  disabled={downloading === inv.invoiceNo}
                >
                  {downloading === inv.invoiceNo ? "Generating…" : "⬇ Download PDF"}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
