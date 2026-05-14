import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeadsSuccess.css";

async function sendSuccessEmail(inv) {
  try {
    await fetch("https://townmanor.ai/api/lead-invoices/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type:        "success",
        to_email:    inv.buyerEmail,
        to_name:     inv.buyerName,
        invoice_no:  inv.invoiceNo,
        txn_id:      inv.txnId,
        plan:        inv.plan,
        leads:       inv.leads,
        total_amount: inv.totalAmount,
        validity:    inv.validity,
        date:        inv.date,
      }),
    });
  } catch (e) {
    console.warn("Success email failed:", e);
  }
}

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

async function downloadReceipt(inv) {
  try {
    const jsPDF = await ensureJsPDF();
    const doc = new jsPDF();
    const W = 210;

    /* logo */
    try {
      const img = new Image();
      img.src = "/ovikaliving_logo_clean.png";
      await new Promise((r, j) => { img.onload = r; img.onerror = j; });
      const lh = 17; const lw = lh * (img.width / img.height);
      doc.addImage(img, "PNG", 16, 12, lw, lh);
    } catch (_) {}

    /* gold bar */
    doc.setFillColor(194, 119, 43);
    doc.rect(0, 46, W, 1.5, "F");

    /* company */
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(100,100,100);
    doc.text("OvikaLiving by TownManor", W-16, 20, { align:"right" });
    doc.setFont("helvetica","normal"); doc.setFontSize(8);
    doc.text("Sector 62, Noida, Uttar Pradesh — 201309", W-16, 26, { align:"right" });
    doc.text("support@ovikaliving.com  |  ovikaliving.com", W-16, 31, { align:"right" });
    doc.text("GSTIN: 09AAACT1234F1ZA", W-16, 36, { align:"right" });

    /* title */
    doc.setFont("helvetica","bold"); doc.setFontSize(22); doc.setTextColor(30,30,30);
    doc.text("TAX INVOICE", 16, 62);
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(90,90,90);
    doc.text(`Invoice No.  : ${inv.invoiceNo}`, 16, 72);
    doc.text(`Date           : ${inv.date}`, 16, 78);
    doc.text(`Transaction  : ${inv.txnId}`, 16, 84);

    /* paid badge */
    doc.setFillColor(22,101,52);
    doc.roundedRect(W-55,68,38,10,2,2,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(255,255,255);
    doc.text("PAID", W-36, 74.5, { align:"center" });

    /* bill to */
    doc.setDrawColor(220,220,220); doc.line(16,90,W-16,90);
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(100,100,100);
    doc.text("BILLED TO", 16, 100);
    doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(30,30,30);
    doc.text(inv.buyerName || "—", 16, 107);
    doc.setFontSize(9); doc.setTextColor(90,90,90);
    doc.text(inv.buyerEmail || "", 16, 113);
    doc.text(inv.buyerPhone || "", 16, 119);

    /* table header */
    doc.setFillColor(245,245,245); doc.rect(16,132,W-32,10,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(80,80,80);
    doc.text("Description", 20, 139);
    doc.text("Qty", 120, 139, { align:"center" });
    doc.text("Rate", 150, 139, { align:"center" });
    doc.text("Amount", W-20, 139, { align:"right" });

    /* row */
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(30,30,30);
    const rate = inv.leads ? (inv.baseAmount/inv.leads).toFixed(1) : "—";
    doc.text(`Tenant Leads — ${inv.plan} Plan`, 20, 150);
    doc.text(`${inv.leads}`, 120, 150, { align:"center" });
    doc.text(`₹${rate}`, 150, 150, { align:"center" });
    doc.text(`₹${Number(inv.baseAmount).toFixed(2)}`, W-20, 150, { align:"right" });

    /* totals */
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
    doc.text(`Leads Included: ${inv.leads} verified tenant leads`, 16, tY+29);

    /* footer */
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

const saveInvoiceToBackend = async (inv, userId) => {
  try {
    await fetch("https://townmanor.ai/api/lead-invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id:      userId,
        invoice_no:   inv.invoiceNo,
        txn_id:       inv.txnId,
        plan:         inv.plan,
        leads:        inv.leads,
        base_amount:  inv.baseAmount,
        gst_amount:   inv.gstAmount,
        total_amount: inv.totalAmount,
        validity:     inv.validity,
        buyer_name:   inv.buyerName,
        buyer_email:  inv.buyerEmail,
        buyer_phone:  inv.buyerPhone,
        date:         inv.date,
        status:       "paid",
      }),
    });
  } catch (e) {
    console.warn("Backend save failed, invoice kept in localStorage only.", e);
  }
};

export default function LeadsSuccess() {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pending_leads_purchase");
      if (!raw) return;
      const pending = JSON.parse(raw);
      const inv = {
        ...pending,
        invoiceNo: `INV-OL-${Date.now()}`,
        date: new Date().toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit", hour12: true,
        }),
        status: "Paid",
      };

      // Save to localStorage (fallback)
      const existing = JSON.parse(localStorage.getItem("ol_lead_invoices") || "[]");
      existing.unshift(inv);
      localStorage.setItem("ol_lead_invoices", JSON.stringify(existing));
      localStorage.removeItem("pending_leads_purchase");
      setInvoice(inv);

      // Save to backend (cross-device sync)
      const userId = getUserId();
      if (userId) saveInvoiceToBackend(inv, userId);

      // Send success email
      if (inv.buyerEmail) sendSuccessEmail(inv);
    } catch (_) {}
  }, []);

  const handleDownload = async () => {
    if (!invoice) return;
    setDownloading(true);
    await downloadReceipt(invoice);
    setDownloading(false);
  };

  return (
    <div className="ls-page">
      <div className="ls-card">

        {/* ── Icon ── */}
        <div className="ls-icon-wrap">
          <div className="ls-check-circle">✓</div>
        </div>

        <h1 className="ls-title">Payment Successful!</h1>
        <p className="ls-subtitle">
          Your leads have been activated. You can view them in your Owner Dashboard.
        </p>

        {/* ── Invoice summary ── */}
        {invoice ? (
          <div className="ls-summary">
            <div className="ls-sum-row">
              <span>Invoice No.</span>
              <strong>{invoice.invoiceNo}</strong>
            </div>
            <div className="ls-sum-row">
              <span>Plan</span>
              <strong>{invoice.plan} Plan</strong>
            </div>
            <div className="ls-sum-row">
              <span>Leads</span>
              <strong>{invoice.leads} leads</strong>
            </div>
            <div className="ls-sum-row">
              <span>Validity</span>
              <strong>{invoice.validity}</strong>
            </div>
            <div className="ls-sum-divider" />
            <div className="ls-sum-row">
              <span>Amount Paid</span>
              <strong className="ls-sum-amount">₹{invoice.totalAmount}</strong>
            </div>
          </div>
        ) : (
          <div className="ls-summary ls-summary-generic">
            <p>Your payment has been processed. Your leads will be available in your dashboard shortly.</p>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="ls-actions">
          {invoice && (
            <button
              className="ls-btn-outline"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? "Generating…" : "⬇ Download Receipt"}
            </button>
          )}
          <button
            className="ls-btn-primary"
            onClick={() => navigate("/admindashboard/leads")}
          >
            Go to Dashboard →
          </button>
        </div>

        <p className="ls-note">
          Your invoice is also saved in the Invoices section of your Owner Dashboard.
        </p>
      </div>
    </div>
  );
}
