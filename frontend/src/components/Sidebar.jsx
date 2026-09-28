import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  WalletCards, 
  ChartNoAxesCombined, 
  Settings,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'budgets', label: 'Budgets', icon: WalletCards },
  { id: 'reports', label: 'Reports', icon: ChartNoAxesCombined },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            zIndex: 40,
            display: 'none',
          }}
        />
      )}

      <aside style={{
        width: 'var(--sidebar-width)',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        zIndex: 50,
        transition: 'transform 0.2s ease',
      }}>
        {/* Brand Header */}
        <div style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          borderBottom: '1px solid var(--border-light)',
          gap: '10px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Layers size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{
              fontSize: '17px',
              fontWeight: '700',
              color: 'var(--color-text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              ExpenseJar
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              Finance SaaS
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div style={{
          padding: '16px 12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-text-subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 12px 8px',
          }}>
            Menu
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsOpen) setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--color-primary-light)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-body)',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
                    e.currentTarget.style.color = 'var(--color-text-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-body)';
                  }
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Settings */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid var(--border-light)',
        }}>
          <button
            onClick={() => {
              setActiveTab('settings');
              if (setIsOpen) setIsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'settings' ? 'var(--color-primary-light)' : 'transparent',
              color: activeTab === 'settings' ? 'var(--color-primary)' : 'var(--color-text-body)',
              fontSize: '13.5px',
              fontWeight: activeTab === 'settings' ? '600' : '500',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'settings') {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-subtle)';
                e.currentTarget.style.color = 'var(--color-text-main)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'settings') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-body)';
              }
            }}
          >
            <Settings size={18} strokeWidth={activeTab === 'settings' ? 2.2 : 1.8} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
