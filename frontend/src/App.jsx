import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ToastContainer } from './components/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { budgetService } from './api/services';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch alerts count for topbar notification badge
  const checkAlerts = useCallback(async () => {
    try {
      const alerts = await budgetService.getAlerts();
      setAlertsCount(alerts ? alerts.length : 0);
    } catch {
      // ignore on initial load if backend starting
    }
  }, []);

  useEffect(() => {
    checkAlerts();
  }, [checkAlerts, refreshKey]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    await checkAlerts();
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('info', 'Data refreshed from server');
    }, 400);
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main App Content Area */}
      <div className="app-main">
        {/* Top Header */}
        <Topbar
          activeTab={activeTab}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          alertsCount={alertsCount}
          onOpenAlerts={() => setActiveTab('budgets')}
        />

        {/* Scrollable Page Body */}
        <main className="app-content" key={refreshKey}>
          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onAddExpense={() => setActiveTab('expenses')}
              onAddBudget={() => setActiveTab('budgets')}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesPage onNotify={addToast} />
          )}

          {activeTab === 'categories' && (
            <CategoriesPage onNotify={addToast} />
          )}

          {activeTab === 'budgets' && (
            <BudgetsPage onNotify={addToast} />
          )}

          {activeTab === 'reports' && (
            <ReportsPage onNotify={addToast} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage onNotify={addToast} />
          )}
        </main>
      </div>

      {/* Floating Feedback Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
