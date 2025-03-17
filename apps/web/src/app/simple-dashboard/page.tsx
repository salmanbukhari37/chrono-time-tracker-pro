"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/utils/auth";

export default function SimpleDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useRequireAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setMounted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Error Loading Dashboard
          </h1>
          <p className="mb-4 text-gray-700">{error}</p>
          <Link
            href="/debug-dashboard"
            className="text-blue-600 hover:underline"
          >
            Go to Debug Page
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-4 text-gray-700">
            You need to be logged in to view this page.
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
              className="text-blue-600 hover:underline flex items-center"
            >
              Debug Authentication
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Simple Dashboard</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-4">
            Welcome, {user?.name || "User"}!
          </h2>
          <p>This is a simplified dashboard with minimal dependencies.</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Your Profile:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="flex space-x-4">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Full Dashboard
          </Link>
          <Link
            href="/debug-dashboard"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Debug Page
          </Link>
        </div>
      </div>
    </div>
  );
}
