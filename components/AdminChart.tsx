"use client";

import { useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AdminChartProps {
  data: DataPoint[];
  type: 'bar' | 'pie' | 'line';
  title?: string;
  height?: number;
}

export default function AdminChart({ data, type, title, height = 300 }: AdminChartProps) {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
  
  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{item.label}</span>
            <span className="text-white font-medium">{item.value}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || undefined
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const radius = 80;
              const x = 100 + radius * Math.cos((angle - 90) * Math.PI / 180);
              const y = 100 + radius * Math.sin((angle - 90) * Math.PI / 180);
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                "M", 100, 100,
                "L", 100, 20,
                "A", radius, radius, 0, largeArcFlag, 1, x, y,
                "Z"
              ].join(" ");

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color || `hsl(${index * 60}, 70%, 50%)`}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-sm text-gray-300">{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 400 200">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1="40"
            y1={40 + (i * 32)}
            x2="360"
            y2={40 + (i * 32)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Data line */}
        <polyline
          fill="none"
          stroke="rgb(147, 51, 234)"
          strokeWidth="2"
          points={data.map((item, index) => {
            const x = 40 + (index * (320 / (data.length - 1)));
            const y = 180 - ((item.value / maxValue) * 140);
            return `${x},${y}`;
          }).join(' ')}
        />
        
        {/* Area fill */}
        <polygon
          fill="url(#gradient)"
          points={`40,180 ${data.map((item, index) => {
            const x = 40 + (index * (320 / (data.length - 1)));
            const y = 180 - ((item.value / maxValue) * 140);
            return `${x},${y}`;
          }).join(' ')} 360,180`}
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = 40 + (index * (320 / (data.length - 1)));
          const y = 180 - ((item.value / maxValue) * 140);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="rgb(147, 51, 234)"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Labels */}
        {data.map((item, index) => {
          const x = 40 + (index * (320 / (data.length - 1)));
          return (
            <text
              key={index}
              x={x}
              y={200}
              textAnchor="middle"
              className="fill-gray-400 text-xs"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-400">
          No data available
        </div>
      ) : (
        <>
          {type === 'bar' && renderBarChart()}
          {type === 'pie' && renderPieChart()}
          {type === 'line' && renderLineChart()}
        </>
      )}
    </div>
  );
}
