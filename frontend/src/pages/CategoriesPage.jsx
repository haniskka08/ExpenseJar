import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Tags 
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { categoryService } from '../api/services';

export function CategoriesPage({ onNotify }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingCategory(null);
    setName('');
    setError('');
    setIsModalOpen(true);
  }

  function handleOpenEdit(cat) {
    setEditingCategory(cat);
    setName(cat.name);
    setError('');
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, { name: name.trim() });
        onNotify?.('success', 'Category updated successfully');
      } else {
        await categoryService.create({ name: name.trim() });
        onNotify?.('success', 'Category created successfully');
      }

      setIsModalOpen(false);
      const updated = await categoryService.getAll();
      setCategories(updated || []);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await categoryService.delete(id);
      onNotify?.('success', 'Category deleted successfully');
      setCategories(prev => prev.filter(c => c.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      onNotify?.('error', err.message || 'Failed to delete category');
    }
  }

  const filteredCategories = categories.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSkeleton rows={5} type="table" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Manage your expense categories</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-box">
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search categories..."
              className="table-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'}
          </span>
        </div>

        {filteredCategories.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No categories found"
            description="Create categories like Food, Travel, Housing to organize your expenses."
            actionLabel="Add Category"
            onAction={handleOpenCreate}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '13px', fontWeight: '500' }}>
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit category"
                          onClick={() => handleOpenEdit(cat)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          title="Delete category"
                          onClick={() => setDeleteConfirmId(cat.id)}
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="cat-name">Category Name</label>
              <input
                id="cat-name"
                type="text"
                className={`form-input ${error ? 'is-invalid' : ''}`}
                placeholder="e.g. Groceries, Entertainment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {error && <div className="form-error">{error}</div>}
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
              {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Category"
      >
        <div className="modal-body">
          <p style={{ color: 'var(--color-text-body)', fontSize: '14px' }}>
            Are you sure you want to delete this category? Any associated expenses may also be affected.
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
