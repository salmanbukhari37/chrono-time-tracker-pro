import React, { ReactNode, CSSProperties } from "react";
import { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  style?: CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = "",
  style,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 ${className}`}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-100 rounded-full">{icon}</div>
      </div>
    </div>
  );
};
