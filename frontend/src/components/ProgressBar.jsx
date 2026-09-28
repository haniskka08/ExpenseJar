import React from 'react';

export function ProgressBar({ value = 0, max = 100, showLabel = false, height = 8 }) {
  const percentage = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
  
  let fillClass = 'progress-fill-normal';
  if (percentage >= 100) {
    fillClass = 'progress-fill-danger';
  } else if (percentage >= 90) {
    fillClass = 'progress-fill-warning';
  }

  return (
    <div style={{ width: '100%' }}>
      <div 
        className="progress-bar-container" 
        style={{ height: `${height}px` }}
      >
        <div 
          className={`progress-bar-fill ${fillClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          marginTop: '4px',
        }}>
          <span>{percentage.toFixed(1)}% Used</span>
          <span>{percentage >= 90 ? 'High Usage' : 'Healthy'}</span>
        </div>
      )}
    </div>
  );
}
