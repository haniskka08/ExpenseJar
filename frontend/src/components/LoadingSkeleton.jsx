import React from 'react';

export function LoadingSkeleton({ rows = 5, type = 'table' }) {
  if (type === 'cards') {
    return (
      <div className="stat-grid">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="skeleton skeleton-card" />
        ))}
      </div>
    );
  }

  if (type === 'charts') {
    return (
      <div className="charts-grid">
        <div className="card" style={{ height: '320px' }}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton" style={{ height: '220px', width: '100%', marginTop: '16px' }} />
        </div>
        <div className="card" style={{ height: '320px' }}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton" style={{ height: '220px', width: '100%', marginTop: '16px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="table-container" style={{ padding: '20px' }}>
      <div className="skeleton skeleton-title" style={{ width: '200px', marginBottom: '20px' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
          <div className="skeleton" style={{ height: '20px', flex: 1 }} />
          <div className="skeleton" style={{ height: '20px', flex: 2 }} />
          <div className="skeleton" style={{ height: '20px', flex: 1 }} />
          <div className="skeleton" style={{ height: '20px', width: '80px' }} />
        </div>
      ))}
    </div>
  );
}
