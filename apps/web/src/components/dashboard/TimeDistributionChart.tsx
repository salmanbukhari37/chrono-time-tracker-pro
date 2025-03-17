import React, { CSSProperties } from "react";

interface TimeDistribution {
  label: string;
  hours: number;
  color: string;
}

interface TimeDistributionChartProps {
  data: TimeDistribution[];
  className?: string;
  style?: CSSProperties;
}

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({
  data,
  className = "",
  style,
}) => {
  const total = data.reduce((sum, item) => sum + item.hours, 0);

  // Calculate the percentage and degrees for each segment
  const segments = data.map((item) => {
    const percentage = (item.hours / total) * 100;
    return {
      ...item,
      percentage,
    };
  });

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 ${className}`}
      style={style}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Time Distribution
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Chart visualization - simplified version */}
        <div className="relative w-48 h-48 mb-6 md:mb-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full bg-white shadow-inner"></div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* This is a simplified chart - in a real app, you'd calculate the actual SVG paths */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
            />
            {segments.map((segment, index) => {
              // This is a simplified representation
              // In a real app, you'd calculate the actual SVG paths for each segment
              const offset = segments
                .slice(0, index)
                .reduce((sum, s) => sum + s.percentage, 0);
              const dashArray = 251.2; // Circumference of circle with r=40
              const dashOffset =
                dashArray - (dashArray * segment.percentage) / 100;

              return (
                <circle
                  key={segment.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="20"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(${offset * 3.6} 50 50)`}
                  style={{ transition: "all 0.3s ease" }}
                />
              );
            })}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold text-gray-700"
            >
              {total}h
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-3 w-full md:w-auto md:ml-6">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div className="flex justify-between w-full">
                <span className="text-sm text-gray-600 mr-4">
                  {segment.label}
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-1">
                    {segment.hours}h
                  </span>
                  <span className="text-xs text-gray-500">
                    ({segment.percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
