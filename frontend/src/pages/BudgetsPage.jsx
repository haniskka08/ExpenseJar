import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  WalletCards, 
  AlertTriangle,
  Calendar,
  CheckCircle2 
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  budgetService, 
  categoryService, 
  userService 
} from '../api/services';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export function BudgetsPage({ onNotify }) {
  const [budgets, setBudgets] = useState([]);
  const [budgetUsage, setBudgetUsage] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentDate = new Date();
  const [formData, setFormData] = useState({
    amount: '',
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    categoryId: '',
    userId: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadBudgetsData();
  }, []);

  async function loadBudgetsData() {
    setLoading(true);
    try {
      const [bList, usageList, alertsList, catList, userList] = await Promise.all([
        budgetService.getAll(),
        budgetService.getUsage(),
        budgetService.getAlerts(),
        categoryService.getAll(),
        userService.getAll(),
      ]);

      setBudgets(bList || []);
      setBudgetUsage(usageList || []);
      setBudgetAlerts(alertsList || []);
      setCategories(catList || []);
      setUsers(userList || []);

      if (catList && catList.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: catList[0].id }));
      }
      if (userList && userList.length > 0) {
        setFormData(prev => ({ ...prev, userId: userList[0].id }));
      }
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to load budgets data');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingBudget(null);
    setFormData({
      amount: '',
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      categoryId: categories.length > 0 ? categories[0].id : '',
      userId: users.length > 0 ? users[0].id : '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  }

  function handleOpenEdit(b) {
    setEditingBudget(b);
    setFormData({
      amount: b.amount,
      month: b.month,
      year: b.year,
      categoryId: b.category?.id || '',
      userId: b.user?.id || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  }

  function validateForm() {
    const errors = {};
    const amt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    const m = parseInt(formData.month, 10);
    if (isNaN(m) || m < 1 || m > 12) {
      errors.month = 'Month must be between 1 and 12';
    }
    const y = parseInt(formData.year, 10);
    if (isNaN(y) || y < 1900) {
      errors.year = 'Year must be valid positive value';
    }
    if (!formData.categoryId) {
      errors.category = 'Category is required';
    }
    if (!formData.userId) {
      errors.user = 'User is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10),
        category: { id: Number(formData.categoryId) },
        user: { id: Number(formData.userId) },
      };

      if (editingBudget) {
        await budgetService.update(editingBudget.id, payload);
        onNotify?.('success', 'Budget updated successfully');
      } else {
        await budgetService.create(payload);
        onNotify?.('success', 'Budget limit set successfully');
      }

      setIsModalOpen(false);
      await loadBudgetsData();
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to save budget');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await budgetService.delete(id);
      onNotify?.('success', 'Budget deleted successfully');
      setDeleteConfirmId(null);
      await loadBudgetsData();
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to delete budget');
    }
  }

  const filteredBudgets = budgets.filter(b => 
    (b.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.year.toString().includes(searchQuery)
  );

  if (loading) {
    return <LoadingSkeleton rows={6} type="table" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">Set and monitor your monthly spending limits</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Budget</span>
        </button>
      </div>

      {/* 90%+ Budget Alerts Banner if triggered */}
      {budgetAlerts.length > 0 && (
        <div className="alert-banner alert-warning">
          <AlertTriangle size={20} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: '600', color: 'var(--color-warning-text)' }}>
              Budget Alerts Active ({budgetAlerts.length})
            </div>
            <div style={{ fontSize: '13px', color: '#78350F', marginTop: '2px' }}>
              The following categories have reached or exceeded 90% of their allocated monthly budget:
            </div>
            <ul style={{ paddingLeft: '18px', marginTop: '6px', fontSize: '12.5px' }}>
              {budgetAlerts.map((a, i) => (
                <li key={i}>
                  <strong>{a.category}</strong>: ₹{Number(a.spent).toLocaleString()} of ₹{Number(a.budget).toLocaleString()} ({a.usagePercentage}%)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Monthly Budget Usage Cards Grid */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Live Monthly Usage</h2>
            <p className="card-description">Real-time expenditure tracked against monthly thresholds</p>
          </div>
        </div>

        {budgetUsage.length === 0 ? (
          <EmptyState
            icon={WalletCards}
            title="No active budgets for this month"
            description="Add your category limits to begin tracking budget health."
            actionLabel="Add Budget"
            onAction={handleOpenCreate}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {budgetUsage.map((item, idx) => {
              const spent = Number(item.spent) || 0;
              const budget = Number(item.budget) || 0;
              const pct = Number(item.usagePercentage) || 0;
              const isOver = pct >= 100;
              const isAlert = pct >= 90;

              return (
                <div 
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: isOver ? 'var(--color-danger-bg)' : isAlert ? 'var(--color-warning-bg)' : 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-text-main)' }}>
                      {item.category}
                    </span>
                    <span className={`badge ${isOver ? 'badge-danger' : isAlert ? 'badge-warning' : 'badge-primary'}`}>
                      {pct}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Spent: <strong>₹{spent.toLocaleString()}</strong></span>
                    <span style={{ color: 'var(--color-text-muted)' }}>Limit: <strong>₹{budget.toLocaleString()}</strong></span>
                  </div>

                  <ProgressBar value={spent} max={budget} height={7} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Budgets Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-box">
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search budgets..."
              className="table-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {filteredBudgets.length} {filteredBudgets.length === 1 ? 'Budget' : 'Budgets'} Recorded
          </span>
        </div>

        {filteredBudgets.length === 0 ? (
          <EmptyState
            icon={WalletCards}
            title="No budgets configured"
            description="Create budgets to establish monthly financial limits."
            actionLabel="Add Budget"
            onAction={handleOpenCreate}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="text-right">Budget Amount</th>
                  <th>Period</th>
                  <th>Assigned User</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map((b) => {
                  const monthName = MONTHS.find(m => m.value === b.month)?.label || `Month ${b.month}`;
                  return (
                    <tr key={b.id}>
                      <td>
                        <span className="badge badge-primary">
                          {b.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="text-right font-semibold" style={{ color: 'var(--color-text-main)' }}>
                        ₹{Number(b.amount).toLocaleString()}
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text-body)', fontSize: '13px' }}>
                          {monthName} {b.year}
                        </span>
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                        {b.user?.name || 'Default User'}
                      </td>
                      <td className="text-right">
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Edit budget"
                            onClick={() => handleOpenEdit(b)}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-icon-danger"
                            title="Delete budget"
                            onClick={() => setDeleteConfirmId(b.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="budget-category">Category</label>
              <select
                id="budget-category"
                className={`form-select ${formErrors.category ? 'is-invalid' : ''}`}
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {formErrors.category && <div className="form-error">{formErrors.category}</div>}
            </div>

            {/* Budget Amount */}
            <div className="form-group">
              <label className="form-label" htmlFor="budget-amount">Budget Limit (₹)</label>
              <input
                id="budget-amount"
                type="number"
                step="0.01"
                min="0.01"
                className={`form-input ${formErrors.amount ? 'is-invalid' : ''}`}
                placeholder="e.g. 5000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              {formErrors.amount && <div className="form-error">{formErrors.amount}</div>}
            </div>

            {/* Month & Year in 2 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-group">
              <div>
                <label className="form-label" htmlFor="budget-month">Month</label>
                <select
                  id="budget-month"
                  className={`form-select ${formErrors.month ? 'is-invalid' : ''}`}
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                >
                  {MONTHS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                {formErrors.month && <div className="form-error">{formErrors.month}</div>}
              </div>

              <div>
                <label className="form-label" htmlFor="budget-year">Year</label>
                <input
                  id="budget-year"
                  type="number"
                  min="2000"
                  max="2100"
                  className={`form-input ${formErrors.year ? 'is-invalid' : ''}`}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
                {formErrors.year && <div className="form-error">{formErrors.year}</div>}
              </div>
            </div>

            {/* User */}
            <div className="form-group">
              <label className="form-label" htmlFor="budget-user">Assigned User</label>
              <select
                id="budget-user"
                className={`form-select ${formErrors.user ? 'is-invalid' : ''}`}
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              {formErrors.user && <div className="form-error">{formErrors.user}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingBudget ? 'Save Changes' : 'Set Budget'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Budget"
      >
        <div className="modal-body">
          <p style={{ color: 'var(--color-text-body)', fontSize: '14px' }}>
            Are you sure you want to delete this budget limit?
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteConfirmId(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleDelete(deleteConfirmId)}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
