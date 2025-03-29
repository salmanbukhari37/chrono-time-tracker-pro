"use client";

import React, { useState, useEffect } from "react";
import {
  useLocationPermission,
  LocationStatus,
} from "@/hooks/useLocationPermission";

export default function LocationPermissionsTest() {
  const [testResult, setTestResult] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const {
    status,
    hasPermission,
    promptForLocation,
    resetLocationStatus,
    getLocationStatusFromStorage,
  } = useLocationPermission();

  // Log status changes
  useEffect(() => {
    setTestResult((prev) => [...prev, `Status changed to: ${status}`]);

    if (status === "allowed") {
      setTestResult((prev) => [...prev, `✅ Location is ALLOWED`]);
    } else if (status === "skipped" || status === "denied") {
      setTestResult((prev) => [
        ...prev,
        `❌ Location is ${status.toUpperCase()}`,
      ]);
    }
  }, [status]);

  const runTest1 = async () => {
    setCurrentTest("Test 1: First Time Visit (Modal Popup)");
    setTestResult([`Starting Test 1: First Time Visit (Modal Popup)`]);

    // Clear any existing permission
    resetLocationStatus();
    setTestResult((prev) => [...prev, "Reset location status to unknown"]);

    // Verify we're in unknown state
    const currentStatus = getLocationStatusFromStorage();
    setTestResult((prev) => [...prev, `Current status: ${currentStatus}`]);

    // The LocationModalWrapper should automatically appear
    setTestResult((prev) => [
      ...prev,
      "If status is unknown, the modal should now appear",
    ]);
  };

  const runTest2 = async () => {
    setCurrentTest("Test 2: Cannot Clock-in Without Permission");
    setTestResult([`Starting Test 2: Cannot Clock-in Without Permission`]);

    // Make sure we're in skipped state
    localStorage.setItem("locationStatus", "skipped");
    window.location.reload();
  };

  const runTest3 = async () => {
    setCurrentTest("Test 3: Preserving Permission Across Page Loads");
    setTestResult([`Starting Test 3: Preserving Permission Across Page Loads`]);

    // Get current status
    const beforeStatus = getLocationStatusFromStorage();
    setTestResult((prev) => [...prev, `Status before reload: ${beforeStatus}`]);

    // Try to get location permission
    try {
      await promptForLocation();
      setTestResult((prev) => [...prev, "Successfully requested location"]);
    } catch (err) {
      setTestResult((prev) => [...prev, `Error requesting location: ${err}`]);
    }

    // Get status after permission change
    const afterStatus = getLocationStatusFromStorage();
    setTestResult((prev) => [
      ...prev,
      `Status after permission request: ${afterStatus}`,
    ]);

    // Reload page to test persistence
    setTestResult((prev) => [...prev, "Reloading page in 2 seconds..."]);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("locationStatus");
    setTestResult((prev) => [
      ...prev,
      "Cleared locationStatus from localStorage",
    ]);
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Location Permissions Test</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current Status</h2>
        <ul className="space-y-1">
          <li>
            <strong>Location Status:</strong> {status}
          </li>
          <li>
            <strong>Has Permission:</strong>{" "}
            {hasPermission === null
              ? "unknown"
              : hasPermission
              ? "true"
              : "false"}
          </li>
        </ul>
      </div>

      <div className="mb-6 space-x-4">
        <button
          onClick={runTest1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Test 1: First Visit Modal
        </button>
        <button
          onClick={runTest2}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Test 2: No Clock-in Without Permission
        </button>
        <button
          onClick={runTest3}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Test 3: Persist Across Reloads
        </button>
        <button
          onClick={clearLocalStorage}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear localStorage
        </button>
      </div>

      {currentTest && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{currentTest}</h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
            {testResult.map((line, index) => (
              <div
                key={index}
                className="py-1 border-b border-gray-100 last:border-0"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Test Instructions</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Test 1:</strong> Tests the modal display for first-time
            visitors by resetting the status to unknown.
          </li>
          <li>
            <strong>Test 2:</strong> Sets status to "skipped" and reloads the
            page to test that you cannot clock-in without permission.
          </li>
          <li>
            <strong>Test 3:</strong> Tests whether permission status persists
            across page reloads by getting permission and then reloading.
          </li>
        </ul>
      </div>
    </div>
  );
}
