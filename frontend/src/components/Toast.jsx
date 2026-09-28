import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = toast.type === 'error' 
          ? AlertCircle 
          : toast.type === 'success' 
            ? CheckCircle2 
            : Info;

        const iconColor = toast.type === 'error' 
          ? 'var(--color-danger)' 
          : toast.type === 'success' 
            ? 'var(--color-success)' 
            : 'var(--color-primary)';

        return (
          <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
            <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '13px' }}>{toast.message}</span>
            <button 
              type="button" 
              className="btn-icon" 
              style={{ width: '24px', height: '24px' }}
              onClick={() => onDismiss(toast.id)}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
