import React from 'react';

interface RadarDataPoint {
  label: string;
  value: number; // 0 - 100
  fullMark?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  color?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 280,
  color = "#3b82f6",
}) => {
  const center = size / 2;
  const radius = (size / 2) - 45;
  const totalAxes = data.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Levels (concentric webs: 25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Calculate polygon coordinates for actual values
  const polygonPoints = data.map((d, i) => {
    const normalized = Math.min(100, Math.max(0, d.value)) / 100;
    const r = radius * normalized;
    const angle = i * angleSlice - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Concentric grid lines */}
        {levels.map((lvl, idx) => {
          const r = radius * lvl;
          return (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeDasharray={idx < 3 ? "3 3" : undefined}
              className="text-slate-200 dark:text-slate-700/60"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700/60"
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon filled shape */}
        <polygon
          points={polygonPoints}
          fill={color}
          fillOpacity={0.25}
          stroke={color}
          strokeWidth={2.5}
          className="transition-all duration-700 ease-out"
        />

        {/* Data dots on polygon */}
        {data.map((d, i) => {
          const normalized = Math.min(100, Math.max(0, d.value)) / 100;
          const r = radius * normalized;
          const angle = i * angleSlice - Math.PI / 2;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill="#ffffff"
              stroke={color}
              strokeWidth={2}
            />
          );
        })}

        {/* Axis Labels */}
        {data.map((d, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const labelDist = radius + 22;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          
          let textAnchor: 'middle' | 'start' | 'end' = "middle";
          if (Math.cos(angle) > 0.2) textAnchor = "start";
          else if (Math.cos(angle) < -0.2) textAnchor = "end";

          return (
            <text
              key={i}
              x={x}
              y={y + 4}
              textAnchor={textAnchor}
              className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300 select-none"
            >
              {d.label} ({d.value}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
};
