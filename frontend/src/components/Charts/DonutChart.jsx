import React, { useState } from 'react';

const COLORS = [
  '#2563EB', // Blue
  '#0EA5E9', // Sky
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#64748B', // Slate
];

export function DonutChart({ data = [], totalAmount = 0, title = 'Category Spending' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '13px',
      }}>
        No spending recorded for this period.
      </div>
    );
  }

  const total = totalAmount > 0 
    ? totalAmount 
    : data.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      padding: '8px 0',
      flexWrap: 'wrap',
    }}>
      {/* SVG Donut */}
      <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
        <svg viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {data.map((item, index) => {
            const value = Number(item.total) || 0;
            const percentage = total > 0 ? value / total : 0;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedAngle;
            accumulatedAngle += percentage * circumference;
            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={index}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                  cursor: 'pointer',
                  opacity: hoveredIndex === null || isHovered ? 1 : 0.6,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '500' }}>
            {hoveredIndex !== null ? data[hoveredIndex].category : 'Total'}
          </span>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-main)' }}>
            ₹{hoveredIndex !== null ? Number(data[hoveredIndex].total).toLocaleString() : Number(total).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        flex: 1,
        minWidth: '160px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '190px',
        overflowY: 'auto',
        paddingRight: '4px',
      }}>
        {data.map((item, index) => {
          const value = Number(item.total) || 0;
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isHovered ? 'var(--bg-surface-subtle)' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.12s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: COLORS[index % COLORS.length],
                }} />
                <span style={{
                  fontSize: '13px',
                  color: isHovered ? 'var(--color-text-main)' : 'var(--color-text-body)',
                  fontWeight: isHovered ? '600' : '500',
                }}>
                  {item.category}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  ₹{value.toLocaleString()}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
