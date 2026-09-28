import React, { useState, useEffect } from 'react';
import { 
  User, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Server, 
  Database,
  Mail 
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { userService } from '../api/services';

export function SettingsPage({ onNotify }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingUser(null);
    setFormData({ name: '', email: '' });
    setFormErrors({});
    setIsModalOpen(true);
  }

  function handleOpenEdit(u) {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email });
    setFormErrors({});
    setIsModalOpen(true);
  }

  function validateForm() {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'User name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingUser) {
        await userService.update(editingUser.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
        });
        onNotify?.('success', 'User updated successfully');
      } else {
        await userService.create({
          name: formData.name.trim(),
          email: formData.email.trim(),
        });
        onNotify?.('success', 'User created successfully');
      }

      setIsModalOpen(false);
      const updated = await userService.getAll();
      setUsers(updated || []);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await userService.delete(id);
      onNotify?.('success', 'User deleted successfully');
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to delete user');
    }
  }

  if (loading) {
    return <LoadingSkeleton rows={4} type="table" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings & Accounts</h1>
          <p className="page-subtitle">Manage user accounts and view system configurations</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {/* User Accounts Management Card */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--color-text-muted)" />
            <h2 className="card-title" style={{ fontSize: '15px' }}>Active User Accounts</h2>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {users.length} {users.length === 1 ? 'Account' : 'Accounts'}
          </span>
        </div>

        <table className="saas-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium" style={{ color: 'var(--color-text-main)' }}>
                  {u.name}
                </td>
                <td style={{ color: 'var(--color-text-muted)' }}>
                  {u.email}
                </td>
                <td>
                  <span className="badge badge-success">
                    Active
                  </span>
                </td>
                <td className="text-right">
                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                    <button
                      type="button"
                      className="btn-icon"
                      title="Edit user"
                      onClick={() => handleOpenEdit(u)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon-danger"
                      title="Delete user"
                      onClick={() => setDeleteConfirmId(u.id)}
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

      {/* System Information Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">System & Connection Status</h2>
            <p className="card-description">Backend services and runtime parameters</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-light)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Server size={16} color="var(--color-primary)" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Spring Boot API
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
              http://localhost:8081
            </div>
          </div>

          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-light)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Database size={16} color="var(--color-success)" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Database Engine
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
              MySQL (expensejar)
            </div>
          </div>

          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-light)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle2 size={16} color="var(--color-primary)" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Theme & Layout
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
              Professional Light SaaS
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User Account' : 'Add New User'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="user-name">Full Name</label>
              <input
                id="user-name"
                type="text"
                className={`form-input ${formErrors.name ? 'is-invalid' : ''}`}
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoFocus
              />
              {formErrors.name && <div className="form-error">{formErrors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-email">Email Address</label>
              <input
                id="user-email"
                type="email"
                className={`form-input ${formErrors.email ? 'is-invalid' : ''}`}
                placeholder="e.g. john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {formErrors.email && <div className="form-error">{formErrors.email}</div>}
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
              {submitting ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete User"
      >
        <div className="modal-body">
          <p style={{ color: 'var(--color-text-body)', fontSize: '14px' }}>
            Are you sure you want to delete this user?
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
