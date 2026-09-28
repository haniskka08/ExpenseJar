import React from 'react';

export function StatCard({ label, value, subtext, icon: Icon, badge, color = 'primary' }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>

      <div className="stat-value">{value}</div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
      }}>
        {subtext && <span className="stat-subtext">{subtext}</span>}
        {badge && (
          <span className={`badge ${badge.type ? `badge-${badge.type}` : 'badge-neutral'}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}
