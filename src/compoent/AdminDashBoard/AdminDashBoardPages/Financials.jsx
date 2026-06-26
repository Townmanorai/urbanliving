import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { AuthContext } from "../../Login/AuthContext";
import { Loader } from "lucide-react";

/* ================= HELPERS ================= */
const extractOwnerId = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  return (
    obj.owner_id ||
    obj.ownerId ||
    obj.id ||
    obj.user_id ||
    obj.userId ||
    (obj.user && extractOwnerId(obj.user)) ||
    null
  );
};

const Financials = () => {
  const { user } = useContext(AuthContext);
  const [ownerId, setOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    totalProperties: 0,
    totalBookings: 0,
    lifetimeIncome: 0,
    pendingPayments: 0,
    completedPayments: 0,
    currentMonthEarnings: 0,
    recentTransactions: []
  });

  const resolveOwnerId = useCallback(() => {
    const idFromContext = extractOwnerId(user);
    if (idFromContext) return String(idFromContext);
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return extractOwnerId(parsed)?.toString() || null;
    } catch {
      return null;
    }
  }, [user]);

  useEffect(() => {
    const id = resolveOwnerId();
    setOwnerId(id);
  }, [resolveOwnerId]);

  const fetchData = useCallback(async () => {
    if (!ownerId) return;
    try {
      setLoading(true);
      // 1. Fetch Owner Properties
      const propsRes = await axios.get("https://www.townmanor.ai/api/ovika/properties");
      const allProps = Array.isArray(propsRes.data) ? propsRes.data : (propsRes.data?.data || []);
      const ownerProps = allProps.filter(p => String(p.owner_id || p.ownerId) === String(ownerId));
      const ownerPropIds = ownerProps.map(p => Number(p.id || p._id));

      // 2. Fetch All Bookings (Inquiries & Bookings)
      const bookingsRes = await axios.get("https://www.townmanor.ai/api/booking-request");
      const allBookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : (bookingsRes.data?.data || []);
      const ownerBookings = allBookings.filter(b => ownerPropIds.includes(Number(b.property_id)));

      // 3. Calculate Stats
      let totalRevenue = 0;
      let completedRev = 0;
      let pendingRev = 0;
      let currentMonthRev = 0;
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const cancelled = [];
      const transactions = ownerBookings.map(b => {
        const amount = Number(b.total_price || b.total_amount || b.amount || 0);
        const commission = amount * 0.15;
        const net = amount - commission;
        const bDate = new Date(b.created_at || b.start_date);
        const isPaid = b.status === 'confirmed' || b.status === 'paid' || b.payment_status === 'paid';
        const isAccepted = b.status === 'accepted'; 
        const isCancelled = b.status === 'cancelled' || b.cancelled === 1;

        if (isPaid) {
          totalRevenue += amount;
          completedRev += net;
          if (bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear) {
            currentMonthRev += net;
          }
        } else if (b.status === 'pending' || isAccepted) {
          pendingRev += net;
        }

        const tObj = {
          id: b.id,
          bookingId: `BK-${b.id}`,
          propertyName: b.property_name || b.property?.name || `Property #${b.property_id}`,
          date: b.updated_at || b.created_at || b.start_date,
          listingAmount: amount,
          commissionAmount: commission,
          ownerAmount: net,
          status: isPaid ? 'completed' : isCancelled ? 'cancelled' : 'pending'
        };

        if (isCancelled) cancelled.push(tObj);
        return tObj;
      }).filter(t => t.status !== 'cancelled').sort((a, b) => new Date(b.date) - new Date(a.date));

      setFinancialData({
        totalProperties: ownerProps.length,
        totalBookings: ownerBookings.length,
        lifetimeIncome: totalRevenue,
        pendingPayments: pendingRev,
        completedPayments: completedRev,
        currentMonthEarnings: currentMonthRev,
        recentTransactions: transactions,
        cancelledTransactions: cancelled.sort((a, b) => new Date(b.date) - new Date(a.date))
      });

    } catch (err) {
      console.error("Financial Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "12px" }}>
        <Loader size={40} style={{ animation: "spin 1s linear infinite", color: "#3b82f6" }} />
        <p style={{ fontSize: "16px", color: "#6b7280", fontWeight: 500 }}>Calculating financials...</p>
      </div>
    );
  }

  if (!ownerId) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Please login as a property owner to view financials.</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Helmet>
        <title>Financials | OvikaLiving Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Financial Dashboard</h1>
        <p style={styles.subtitle}>Monitor your property revenue and transactions</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Total Revenue</span>
            <svg style={styles.icon} fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p style={styles.statValue}>{formatCurrency(financialData.lifetimeIncome)}</p>
          <span style={styles.statSubtext}>Lifetime earnings</span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Total Bookings</span>
            <svg style={styles.icon} fill="none" stroke="#10b981" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p style={styles.statValue}>{financialData.totalBookings}</p>
          <span style={styles.statSubtext}>{financialData.totalProperties} properties listed</span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Pending</span>
            <svg style={styles.icon} fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p style={{...styles.statValue, color: '#f59e0b'}}>{formatCurrency(financialData.pendingPayments)}</p>
          <span style={styles.statSubtext}>Processing</span>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Completed</span>
            <svg style={styles.icon} fill="none" stroke="#10b981" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p style={{...styles.statValue, color: '#10b981'}}>{formatCurrency(financialData.completedPayments)}</p>
          <span style={styles.statSubtext}>Transferred</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>Recent Transactions</h2>
          <button style={styles.button}>Export Report</button>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Property Details</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Booking Amount</th>
                <th style={styles.th}>Commission (15%)</th>
                <th style={styles.th}>Net Earnings</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {financialData.recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>
                    <div style={styles.emptyContent}>
                      <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p style={styles.emptyText}>No transactions yet</p>
                      <p style={styles.emptySubtext}>Your transaction history will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                financialData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div>
                        <div style={styles.propertyName}>{transaction.propertyName}</div>
                        <div style={styles.bookingId}>{transaction.bookingId}</div>
                      </div>
                    </td>
                    <td style={styles.td}>{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                    <td style={styles.td}>{formatCurrency(transaction.listingAmount)}</td>
                    <td style={{...styles.td, color: '#ef4444'}}>-{formatCurrency(transaction.commissionAmount)}</td>
                    <td style={{...styles.td, fontWeight: '600', color: '#10b981'}}>{formatCurrency(transaction.ownerAmount)}</td>
                    <td style={styles.td}>
                      <span style={transaction.status === 'completed' ? styles.statusCompleted : styles.statusPending}>
                        {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Monthly Performance</h3>
          <p style={styles.summaryAmount}>{formatCurrency(financialData.currentMonthEarnings)}</p>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: '0%'}}></div>
          </div>
          <span style={styles.progressLabel}>0% of monthly target</span>
        </div>

        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Commission Structure</h3>
          <div style={styles.commissionGrid}>
            <div style={styles.commissionItem}>
              <span style={styles.commissionLabel}>Platform Fee</span>
              <span style={styles.commissionValue}>15%</span>
            </div>
            <div style={styles.commissionDivider}></div>
            <div style={styles.commissionItem}>
              <span style={styles.commissionLabel}>Your Share</span>
              <span style={{...styles.commissionValue, color: '#10b981', fontWeight: '700'}}>85%</span>
            </div>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Key Metrics</h3>
          <div style={styles.metricsGrid}>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Avg. Booking</span>
              <span style={styles.metricValue}>{formatCurrency(0)}</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Active Properties</span>
              <span style={styles.metricValue}>{financialData.totalProperties}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Records Table */}
      <div style={{...styles.tableSection, marginTop: '40px', borderTop: '4px solid #ef4444'}}>
        <div style={styles.tableHeader}>
          <h2 style={{...styles.sectionTitle, color: '#ef4444'}}>Cancellation Records</h2>
          <span style={{fontSize: '14px', color: '#64748b'}}>{financialData.cancelledTransactions?.length || 0} cancellations recorded</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Property Details</th>
                <th style={styles.th}>Cancellation Date</th>
                <th style={styles.th}>Original Amount</th>
                <th style={styles.th}>Potential Net</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {!financialData.cancelledTransactions || financialData.cancelledTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyState}>
                    <p style={styles.emptyText}>No cancellation records</p>
                  </td>
                </tr>
              ) : (
                financialData.cancelledTransactions.map((transaction) => (
                  <tr key={transaction.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div>
                        <div style={styles.propertyName}>{transaction.propertyName}</div>
                        <div style={styles.bookingId}>{transaction.bookingId}</div>
                      </div>
                    </td>
                    <td style={styles.td}>{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                    <td style={styles.td}>{formatCurrency(transaction.listingAmount)}</td>
                    <td style={{...styles.td, color: '#94a3b8'}}>{formatCurrency(transaction.ownerAmount)}</td>
                    <td style={styles.td}>
                      <span style={{...styles.statusPending, background: '#fee2e2', color: '#b91c1c'}}>
                        Cancelled
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '40px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    maxWidth: '1400px',
    margin: '0 auto 40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto 40px',
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
  },
  statSubtext: {
    fontSize: '13px',
    color: '#94a3b8',
  },
  tableSection: {
    maxWidth: '1400px',
    margin: '0 auto 40px',
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0f172a',
  },
  button: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    borderBottom: '2px solid #e2e8f0',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#334155',
  },
  propertyName: {
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: '4px',
  },
  bookingId: {
    fontSize: '12px',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  statusCompleted: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    background: '#d1fae5',
    color: '#065f46',
  },
  statusPending: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    background: '#fef3c7',
    color: '#92400e',
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    color: '#cbd5e1',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#64748b',
    marginBottom: '4px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  summaryCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '16px',
  },
  summaryAmount: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: '16px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: '#3b82f6',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontSize: '13px',
    color: '#64748b',
  },
  commissionGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  commissionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#f8fafc',
    borderRadius: '8px',
  },
  commissionLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  commissionValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
  },
  commissionDivider: {
    height: '1px',
    background: '#e2e8f0',
  },
  metricsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  metricItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#f8fafc',
    borderRadius: '8px',
  },
  metricLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
  },
};

export default Financials;