"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, isAuthenticated } from "@/utils/auth";

export default function DebugDashboardPage() {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
    token: "",
    cookieToken: "",
    user: null as any,
    error: "",
  });

  useEffect(() => {
    try {
      // Check authentication status
      const authenticated = isAuthenticated();

      // Get token from localStorage
      const token = localStorage.getItem("token") || "";

      // Get token from cookie
      const cookieToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || "";

      // Get current user
      const user = getCurrentUser();

      setAuthStatus({
        isLoading: false,
        isAuthenticated: authenticated,
        token: token ? `${token.substring(0, 10)}...` : "(none)",
        cookieToken: cookieToken
          ? `${cookieToken.substring(0, 10)}...`
          : "(none)",
        user,
        error: "",
      });
    } catch (error) {
      setAuthStatus({
        isLoading: false,
        isAuthenticated: false,
        token: "",
        cookieToken: "",
        user: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, []);

  const clearTokens = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Debug Page</h1>

        {authStatus.isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold mb-2">Authentication Status</h2>
                <p className="mb-1">
                  Is Authenticated:{" "}
                  <span
                    className={
                      authStatus.isAuthenticated
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {String(authStatus.isAuthenticated)}
                  </span>
                </p>
                <p className="mb-1">
                  Token (localStorage):{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {authStatus.token}
                  </code>
                </p>
                <p className="mb-1">
                  Token (cookie):{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {authStatus.cookieToken}
                  </code>
                </p>
              </div>

              {authStatus.user && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h2 className="font-semibold mb-2">User Information</h2>
                  <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(authStatus.user, null, 2)}
                  </pre>
                </div>
              )}

              {authStatus.error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <h2 className="font-semibold mb-2">Error</h2>
                  <p className="text-red-700">{authStatus.error}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={clearTokens}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear All Tokens & Reload
              </button>

              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/login"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Go to Login
                </Link>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-semibold mb-2">Next Steps</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    If both tokens are missing, you're not properly logged in.
                    Try logging in again.
                  </li>
                  <li>
                    If localStorage token exists but cookie token is missing,
                    the cookie isn't being set correctly. Check browser cookie
                    settings.
                  </li>
                  <li>
                    If both tokens exist but dashboard still doesn't load, there
                    might be rendering errors in the dashboard components.
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
