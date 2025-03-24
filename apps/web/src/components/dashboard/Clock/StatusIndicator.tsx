"use client";

import React from "react";

interface StatusIndicatorProps {
  isActive: boolean;
  isPaused: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isActive,
  isPaused,
}) => {
  return (
    <div className="px-4 py-3 flex items-center border-b border-gray-100">
      <div
        className={`h-3 w-3 rounded-full mr-2 ${
          isActive
            ? "bg-green-500 animate-pulse"
            : isPaused
            ? "bg-yellow-500 animate-pulse"
            : "bg-gray-300"
        }`}
      />
      <span className="text-sm font-medium text-gray-700">
        {isActive
          ? "Currently working"
          : isPaused
          ? "On break"
          : "Not clocked in"}
      </span>
    </div>
  );
};

export default StatusIndicator;
