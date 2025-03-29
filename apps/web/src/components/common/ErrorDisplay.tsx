"use client";

import React from "react";
import Link from "next/link";

interface ErrorDisplayProps {
  error: string | null;
  renderStage: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, renderStage }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-red-600 mb-4">Dashboard Error</h1>
        <p className="mb-4 text-gray-700">{error}</p>
        <p className="mb-4 text-gray-700">Render stage: {renderStage}</p>
        <div className="flex space-x-4">
          <Link
            href="/debug-dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Debug Page
          </Link>
          <Link
            href="/login"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
