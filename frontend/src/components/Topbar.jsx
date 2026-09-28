import React from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your personal finances' },
  expenses: { title: 'Expenses', subtitle: 'Track and manage your spending' },
  categories: { title: 'Categories', subtitle: 'Manage your expense categories' },
  budgets: { title: 'Budgets', subtitle: 'Set and monitor your monthly spending limits' },
  reports: { title: 'Reports', subtitle: 'Understand your spending patterns' },
  settings: { title: 'Settings', subtitle: 'Configure users and system settings' },
};

export function Topbar({ activeTab, onRefresh, isRefreshing, alertsCount = 0, onOpenAlerts }) {
  const pageInfo = PAGE_TITLES[activeTab] || { title: 'Dashboard', subtitle: 'Personal Finance' };

  return (
    <header style={{
      height: 'var(--topbar-height)',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      flexShrink: 0,
      zIndex: 30,
    }}>
      {/* Left: Title & Subtitle */}
      <div>
        <h1 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--color-text-main)',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}>
          {pageInfo.title}
        </h1>
        <p style={{
          fontSize: '12.5px',
          color: 'var(--color-text-muted)',
          margin: 0,
        }}>
          {pageInfo.subtitle}
        </p>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Backend Connected Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-success-bg)',
          border: '1px solid var(--color-success-border)',
          fontSize: '12px',
          fontWeight: '500',
          color: 'var(--color-success-text)',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success)',
          }} />
          <span>API Connected (8081)</span>
        </div>

        {/* Sync Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-icon"
            title="Refresh data"
            style={{
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw 
              size={16} 
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }} 
            />
          </button>
        )}

        {/* Budget Alert Bell */}
        <button
          onClick={onOpenAlerts}
          className="btn-icon"
          style={{
            position: 'relative',
          }}
          title={alertsCount > 0 ? `${alertsCount} Budget alert(s)` : 'No alerts'}
        >
          <Bell size={17} />
          {alertsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-danger)',
              border: '2px solid #FFFFFF',
            }} />
          )}
        </button>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '24px',
          backgroundColor: 'var(--border-light)',
        }} />

        {/* User Profile Avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
          }}>
            <User size={18} />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--color-text-main)',
              lineHeight: 1.2,
            }}>
              Personal Account
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
            }}>
              Active Workspace
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
