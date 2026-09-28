import React, { useState } from 'react';

export function LineChart({ data = [], height = 220 }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '13px',
      }}>
        No monthly trend data available.
      </div>
    );
  }

  const values = data.map((d) => Number(d.total) || 0);
  const maxValue = Math.max(...values, 1000);
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;
  const chartWidth = 500;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / Math.max(data.length - 1, 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((Number(d.total) || 0) / maxValue) * innerHeight;
    return { x, y, month: d.month, total: Number(d.total) || 0 };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`
    : '';

  // 4 Y-axis guide ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    value: Math.round(maxValue * pct),
    y: paddingTop + innerHeight - pct * innerHeight,
  }));

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={chartWidth - paddingRight}
              y2={tick.y}
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 8}
              y={tick.y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#94A3B8"
              fontFamily="Inter, sans-serif"
            >
              ₹{tick.value >= 1000 ? `${(tick.value / 1000).toFixed(0)}k` : tick.value}
            </text>
          </g>
        ))}

        {/* Gradient Area Fill */}
        {areaD && <path d={areaD} fill="url(#lineGrad)" />}

        {/* Trend Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data Points */}
        {points.map((pt, i) => {
          const isHovered = hoveredPoint === i;
          return (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4}
                fill="#FFFFFF"
                stroke="#2563EB"
                strokeWidth={isHovered ? 3 : 2}
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* X-axis Month Label */}
              <text
                x={pt.x}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="11"
                fill={isHovered ? '#0F172A' : '#64748B'}
                fontWeight={isHovered ? '600' : '400'}
                fontFamily="Inter, sans-serif"
              >
                {pt.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint !== null && (
        <div style={{
          position: 'absolute',
          left: `${(points[hoveredPoint].x / chartWidth) * 100}%`,
          top: `${(points[hoveredPoint].y / chartHeight) * 100}%`,
          transform: 'translate(-50%, -120%)',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '6px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          fontWeight: '500',
          boxShadow: 'var(--shadow-md)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>{points[hoveredPoint].month}</div>
          <div style={{ fontWeight: '700' }}>₹{points[hoveredPoint].total.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
