"use client";

import React from "react";
import Link from "next/link";

const AuthRequired: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-4 text-gray-700">
          You need to be logged in to view the dashboard.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Log In
          </Link>
          <Link
            href="/debug-dashboard"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Debug Authentication
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;
