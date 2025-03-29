"use client";

import React from "react";

interface LoadingProps {
  renderStage: string;
}

const Loading: React.FC<LoadingProps> = ({ renderStage }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
        <p className="text-xs text-gray-500 mt-2">
          Render stage: {renderStage}
        </p>
      </div>
    </div>
  );
};

export default Loading;
