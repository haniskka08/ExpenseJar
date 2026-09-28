import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Receipt, 
  Filter, 
  Calendar,
  AlertCircle 
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  expenseService, 
  categoryService, 
  userService 
} from '../api/services';

export function ExpensesPage({ onNotify }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    userId: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      const [expData, catData, userData] = await Promise.all([
        expenseService.getAll(),
        categoryService.getAll(),
        userService.getAll(),
      ]);
      setExpenses(expData || []);
      setCategories(catData || []);
      setUsers(userData || []);

      if (catData && catData.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: catData[0].id }));
      }
      if (userData && userData.length > 0) {
        setFormData(prev => ({ ...prev, userId: userData[0].id }));
      }
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to load expenses data');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingExpense(null);
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: categories.length > 0 ? categories[0].id : '',
      userId: users.length > 0 ? users[0].id : '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  }

  function handleOpenEdit(exp) {
    setEditingExpense(exp);
    setFormData({
      amount: exp.amount,
      date: exp.date,
      categoryId: exp.category?.id || '',
      userId: exp.user?.id || '',
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
    if (!formData.date) {
      errors.date = 'Date is required';
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
        date: formData.date,
        category: { id: Number(formData.categoryId) },
        user: { id: Number(formData.userId) },
      };

      if (editingExpense) {
        await expenseService.update(editingExpense.id, payload);
        onNotify?.('success', 'Expense updated successfully');
      } else {
        await expenseService.create(payload);
        onNotify?.('success', 'Expense recorded successfully');
      }

      setIsModalOpen(false);
      const updated = await expenseService.getAll();
      setExpenses(updated || []);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await expenseService.delete(id);
      onNotify?.('success', 'Expense deleted successfully');
      setExpenses(prev => prev.filter(e => e.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to delete expense');
    }
  }

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = 
      (exp.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.date || '').includes(searchQuery) ||
      exp.amount.toString().includes(searchQuery);

    const matchesCategory = 
      selectedCategoryFilter === 'ALL' || 
      (exp.category?.id?.toString() === selectedCategoryFilter);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSkeleton rows={6} type="table" />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track and manage your spending</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="table-container">
        {/* Table Toolbar */}
        <div className="table-toolbar">
          <div className="table-search-box">
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="table-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} color="var(--color-text-muted)" />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 10px', fontSize: '13px' }}
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expenses Table */}
        {filteredExpenses.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No expenses found"
            description="Add your first expense to start tracking your spending."
            actionLabel="Add Expense"
            onAction={handleOpenCreate}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th className="text-right">Amount</th>
                  <th>User</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td style={{ color: 'var(--color-text-body)', whiteSpace: 'nowrap' }}>
                      {exp.date}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {exp.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="text-right font-semibold" style={{ color: 'var(--color-text-main)' }}>
                      ₹{Number(exp.amount).toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                      {exp.user?.name || 'Default User'}
                    </td>
                    <td className="text-right">
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit expense"
                          onClick={() => handleOpenEdit(exp)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          title="Delete expense"
                          onClick={() => setDeleteConfirmId(exp.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Amount */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-amount">Amount (₹)</label>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                className={`form-input ${formErrors.amount ? 'is-invalid' : ''}`}
                placeholder="e.g. 1500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              {formErrors.amount && <div className="form-error">{formErrors.amount}</div>}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-date">Date</label>
              <input
                id="expense-date"
                type="date"
                className={`form-input ${formErrors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              {formErrors.date && <div className="form-error">{formErrors.date}</div>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-category">Category</label>
              <select
                id="expense-category"
                className={`form-select ${formErrors.category ? 'is-invalid' : ''}`}
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {formErrors.category && <div className="form-error">{formErrors.category}</div>}
            </div>

            {/* User */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-user">User</label>
              <select
                id="expense-user"
                className={`form-select ${formErrors.user ? 'is-invalid' : ''}`}
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              >
                <option value="">Select a user</option>
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
              {submitting ? 'Saving...' : editingExpense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Expense"
      >
        <div className="modal-body">
          <p style={{ color: 'var(--color-text-body)', fontSize: '14px' }}>
            Are you sure you want to delete this expense? This action cannot be undone.
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
