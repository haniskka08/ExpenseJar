import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Calendar, 
  WalletCards, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  PieChart,
  LineChart as LineChartIcon
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DonutChart } from '../components/Charts/DonutChart';
import { LineChart } from '../components/Charts/LineChart';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { 
  expenseService, 
  budgetService, 
  categoryService 
} from '../api/services';

export function DashboardPage({ onNavigate, onAddExpense, onAddBudget }) {
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [budgetUsage, setBudgetUsage] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [
        totalRes, 
        catSpendRes, 
        trendsRes, 
        usageRes, 
        alertsRes
      ] = await Promise.allSettled([
        expenseService.getTotal(),
        expenseService.getCurrentMonthByCategory(),
        expenseService.getMonthlyTrends(),
        budgetService.getUsage(),
        budgetService.getAlerts(),
      ]);

      if (totalRes.status === 'fulfilled') setTotalExpense(totalRes.value || 0);
      if (catSpendRes.status === 'fulfilled') setCategorySpending(catSpendRes.value || []);
      if (trendsRes.status === 'fulfilled') setMonthlyTrends(trendsRes.value || []);
      if (usageRes.status === 'fulfilled') setBudgetUsage(usageRes.value || []);
      if (alertsRes.status === 'fulfilled') setBudgetAlerts(alertsRes.value || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate current month total spending from category breakdown
  const currentMonthTotal = categorySpending.reduce(
    (sum, item) => sum + (Number(item.total) || 0), 
    0
  );

  // Total active budget amount for current month
  const totalMonthlyBudget = budgetUsage.reduce(
    (sum, item) => sum + (Number(item.budget) || 0), 
    0
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
      {/* 90%+ Budget Alerts Banner if any exist */}
      {budgetAlerts.length > 0 && (
        <div className="alert-banner alert-warning" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={20} color="var(--color-warning)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '600', color: 'var(--color-warning-text)' }}>
                {budgetAlerts.length} Category {budgetAlerts.length === 1 ? 'Budget Alert' : 'Budget Alerts'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#78350F' }}>
                {budgetAlerts.map(a => `${a.category} (${a.usagePercentage}%)`).join(', ')} — Budget usage has reached 90% or more.
              </div>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ fontSize: '12px', padding: '5px 12px', backgroundColor: '#FFFFFF' }}
            onClick={() => onNavigate('budgets')}
          >
            Review Budgets
          </button>
        </div>
      )}

      {/* Top Stat Cards Grid */}
      <div className="stat-grid">
        <StatCard
          label="Total Expenses"
          value={`₹${Number(totalExpense).toLocaleString()}`}
          subtext="All recorded expenses"
          icon={Receipt}
        />
        <StatCard
          label="Current Month"
          value={`₹${Number(currentMonthTotal).toLocaleString()}`}
          subtext={currentMonthName}
          icon={Calendar}
          badge={{ text: 'This Month', type: 'primary' }}
        />
        <StatCard
          label="Monthly Budget"
          value={`₹${Number(totalMonthlyBudget).toLocaleString()}`}
          subtext={`${budgetUsage.length} active categories`}
          icon={WalletCards}
        />
        <StatCard
          label="Budget Alerts"
          value={budgetAlerts.length.toString()}
          subtext={budgetAlerts.length > 0 ? '90%+ threshold reached' : 'All budgets healthy'}
          icon={AlertTriangle}
          badge={budgetAlerts.length > 0 ? { text: 'Action Required', type: 'warning' } : { text: 'Optimal', type: 'success' }}
        />
      </div>

      {/* Two-Column Charts Section */}
      <div className="charts-grid">
        {/* Left: Category Spending */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Category Spending</h2>
              <p className="card-description">Current month distribution</p>
            </div>
            <button 
              type="button" 
              className="btn-ghost" 
              style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onNavigate('reports')}
            >
              Details
            </button>
          </div>
          <DonutChart data={categorySpending} totalAmount={currentMonthTotal} />
        </div>

        {/* Right: Monthly Spending Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Monthly Spending Trend</h2>
              <p className="card-description">Month-over-month expenditure</p>
            </div>
            <button 
              type="button" 
              className="btn-ghost" 
              style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onNavigate('reports')}
            >
              Analytics
            </button>
          </div>
          <LineChart data={monthlyTrends} height={200} />
        </div>
      </div>

      {/* Budget Usage Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Monthly Budget Usage</h2>
            <p className="card-description">Spending vs allocated budget for current month</p>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => onNavigate('budgets')}
          >
            Manage Budgets
          </button>
        </div>

        {budgetUsage.length === 0 ? (
          <EmptyState
            icon={WalletCards}
            title="No budgets set for this month"
            description="Create your monthly category budgets to monitor spending limits."
            actionLabel="Add Budget"
            onAction={onAddBudget}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {budgetUsage.map((usage, idx) => {
              const spent = Number(usage.spent) || 0;
              const budget = Number(usage.budget) || 0;
              const percentage = Number(usage.usagePercentage) || 0;
              const isOver = percentage >= 100;
              const isWarning = percentage >= 90 && percentage < 100;

              return (
                <div 
                  key={idx} 
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: isOver ? 'var(--color-danger-bg)' : isWarning ? 'var(--color-warning-bg)' : 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-text-main)' }}>
                        {usage.category}
                      </span>
                      {isOver && (
                        <span className="badge badge-danger">Exceeded</span>
                      )}
                      {isWarning && (
                        <span className="badge badge-warning">90%+ Alert</span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                        ₹{spent.toLocaleString()}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {' '}/ ₹{budget.toLocaleString()}
                      </span>
                      <span style={{ fontWeight: '600', marginLeft: '10px', color: isOver ? 'var(--color-danger)' : isWarning ? 'var(--color-warning-text)' : 'var(--color-text-main)' }}>
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <ProgressBar value={spent} max={budget} height={8} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '8px',
      }}>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onAddBudget}
        >
          <Plus size={16} />
          <span>Set Budget</span>
        </button>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={onAddExpense}
        >
          <Plus size={16} />
          <span>Record Expense</span>
        </button>
      </div>
    </div>
  );
}
