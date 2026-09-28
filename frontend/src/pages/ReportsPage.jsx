import React, { useState, useEffect } from 'react';
import { 
  ChartNoAxesCombined, 
  Receipt, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Layers 
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DonutChart } from '../components/Charts/DonutChart';
import { LineChart } from '../components/Charts/LineChart';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { expenseService } from '../api/services';

export function ReportsPage({ onNotify }) {
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  useEffect(() => {
    loadReportsData();
  }, []);

  async function loadReportsData() {
    setLoading(true);
    try {
      const [tot, catSpend, trends] = await Promise.all([
        expenseService.getTotal(),
        expenseService.getCurrentMonthByCategory(),
        expenseService.getMonthlyTrends(),
      ]);

      setTotalExpenses(tot || 0);
      setCategorySpending(catSpend || []);
      setMonthlyTrends(trends || []);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to load report analytics');
    } finally {
      setLoading(false);
    }
  }

  // Analytics calculations
  const monthsCount = monthlyTrends.length || 1;
  const avgMonthlySpend = totalExpenses / Math.max(monthsCount, 1);
  
  // Find highest spending month
  const peakMonth = monthlyTrends.reduce(
    (max, item) => (item.total > (max?.total || 0) ? item : max),
    null
  );

  // Top category
  const topCategory = categorySpending.reduce(
    (max, item) => (item.total > (max?.total || 0) ? item : max),
    null
  );

  if (loading) {
    return (
      <div>
        <LoadingSkeleton type="cards" />
        <div style={{ marginTop: '24px' }}>
          <LoadingSkeleton type="charts" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Reports & Analytics</h1>
          <p className="page-subtitle">Detailed insights into your spending patterns and trends</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Historical Spend"
          value={`₹${Number(totalExpenses).toLocaleString()}`}
          subtext="All recorded transactions"
          icon={Receipt}
        />
        <StatCard
          label="Average Monthly Spend"
          value={`₹${Math.round(avgMonthlySpend).toLocaleString()}`}
          subtext={`Across ${monthsCount} recorded month(s)`}
          icon={TrendingUp}
        />
        <StatCard
          label="Peak Spending Month"
          value={peakMonth ? `₹${Number(peakMonth.total).toLocaleString()}` : '₹0'}
          subtext={peakMonth ? `Recorded in ${peakMonth.month}` : 'No trend data'}
          icon={Calendar}
        />
        <StatCard
          label="Top Category"
          value={topCategory ? topCategory.category : 'None'}
          subtext={topCategory ? `₹${Number(topCategory.total).toLocaleString()} current month` : 'No category data'}
          icon={PieChart}
        />
      </div>

      {/* Main Charts */}
      <div className="charts-grid">
        {/* Monthly Trend Full Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Month-over-Month Spending Trend</h2>
              <p className="card-description">Expenditure progression over time</p>
            </div>
          </div>
          <LineChart data={monthlyTrends} height={240} />
        </div>

        {/* Current Month Breakdown Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Category Distribution</h2>
              <p className="card-description">Current month spending by category</p>
            </div>
          </div>
          <DonutChart data={categorySpending} totalAmount={categorySpending.reduce((s, c) => s + (Number(c.total) || 0), 0)} />
        </div>
      </div>

      {/* Monthly Breakdown Data Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <h2 className="card-title" style={{ fontSize: '15px' }}>Monthly Breakdown Summary</h2>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Chronological order</span>
        </div>

        {monthlyTrends.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No monthly data recorded yet.
          </div>
        ) : (
          <table className="saas-table">
            <thead>
              <tr>
                <th>Billing Period</th>
                <th className="text-right">Total Expenditure</th>
                <th className="text-right">Comparison vs Average</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTrends.map((m, idx) => {
                const diff = m.total - avgMonthlySpend;
                const isAboveAvg = diff > 0;
                return (
                  <tr key={idx}>
                    <td className="font-medium" style={{ color: 'var(--color-text-main)' }}>
                      {m.month}
                    </td>
                    <td className="text-right font-semibold" style={{ color: 'var(--color-text-main)' }}>
                      ₹{Number(m.total).toLocaleString()}
                    </td>
                    <td className="text-right">
                      <span className={`badge ${isAboveAvg ? 'badge-warning' : 'badge-success'}`}>
                        {isAboveAvg ? `+₹${Math.round(diff).toLocaleString()}` : `-₹${Math.round(Math.abs(diff)).toLocaleString()}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
