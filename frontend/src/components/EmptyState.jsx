import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'No data found', 
  description = 'Get started by creating your first entry.',
  actionLabel, 
  onAction 
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={24} strokeWidth={1.8} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          <Plus size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
