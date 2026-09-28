import { api } from './client';

export const userService = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (user) => api.post('/api/users', user),
  update: (id, user) => api.put(`/api/users/${id}`, user),
  delete: (id) => api.delete(`/api/users/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (category) => api.post('/api/categories', category),
  update: (id, category) => api.put(`/api/categories/${id}`, category),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export const expenseService = {
  getAll: () => api.get('/api/expenses'),
  getById: (id) => api.get(`/api/expenses/${id}`),
  create: (expense) => api.post('/api/expenses', expense),
  update: (id, expense) => api.put(`/api/expenses/${id}`, expense),
  delete: (id) => api.delete(`/api/expenses/${id}`),
  getTotal: () => api.get('/api/expenses/total'),
  getCurrentMonthByCategory: () => api.get('/api/expenses/current-month/category'),
  getMonthlyTrends: () => api.get('/api/expenses/monthly-trends'),
};

export const budgetService = {
  getAll: () => api.get('/api/budgets'),
  getById: (id) => api.get(`/api/budgets/${id}`),
  create: (budget) => api.post('/api/budgets', budget),
  update: (id, budget) => api.put(`/api/budgets/${id}`, budget),
  delete: (id) => api.delete(`/api/budgets/${id}`),
  getUsage: () => api.get('/api/budgets/usage'),
  getAlerts: () => api.get('/api/budgets/alerts'),
};
