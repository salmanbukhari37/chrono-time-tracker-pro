"use client";

import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaCalendarAlt,
  FaProjectDiagram,
  FaHourglassHalf,
} from "react-icons/fa";
import {
  DashboardLayout,
  StatCard,
  ActivityList,
  ProjectList,
  TimeDistributionChart,
  Clock,
} from "@/components/dashboard";
import { useRequireAuth } from "@/utils/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LocationModalWrapper } from "@/components/LocationModalWrapper";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, isLoading } = useRequireAuth();
  const [error, setError] = useState<string | null>(null);
  const [renderStage, setRenderStage] = useState("initial");

  useEffect(() => {
    try {
      setRenderStage("mounting");
      setMounted(true);
      setRenderStage("mounted");

      // Check authentication
      if (!isLoading && !isAuthenticated) {
        router.push("/login");
      }
    } catch (err) {
      setError(
        `Error in mount effect: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }, [isAuthenticated, isLoading, router]);

  // If loading or not mounted yet, show a loading state
  if (isLoading || !mounted) {
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
  }

  // If there's an error, show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Dashboard Error
          </h1>
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
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
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
  }

  // Rest of your dashboard code...
  try {
    // Mock data for the dashboard
    const stats = [
      {
        title: "Total Hours",
        value: "32.5h",
        icon: <FaClock className="text-primary-600 h-6 w-6" />,
        trend: { value: "12%", isPositive: true },
      },
      {
        title: "Projects",
        value: "8",
        icon: <FaProjectDiagram className="text-primary-600 h-6 w-6" />,
        trend: { value: "2", isPositive: true },
      },
      {
        title: "This Week",
        value: "18.2h",
        icon: <FaCalendarAlt className="text-primary-600 h-6 w-6" />,
        trend: { value: "5%", isPositive: false },
      },
      {
        title: "Average Daily",
        value: "4.6h",
        icon: <FaHourglassHalf className="text-primary-600 h-6 w-6" />,
        trend: { value: "8%", isPositive: true },
      },
    ];

    const activities = [
      {
        id: "1",
        title: "Website Redesign",
        project: "Client XYZ",
        duration: "2h 15m",
        time: "Today, 10:30 AM",
        status: "completed" as const,
      },
      {
        id: "2",
        title: "Backend Development",
        project: "Internal Project",
        duration: "1h 45m",
        time: "Today, 2:00 PM",
        status: "in-progress" as const,
      },
      {
        id: "3",
        title: "Client Meeting",
        project: "Client ABC",
        duration: "45m",
        time: "Yesterday, 3:30 PM",
        status: "completed" as const,
      },
      {
        id: "4",
        title: "Bug Fixing",
        project: "Mobile App",
        duration: "3h 20m",
        time: "Yesterday, 11:00 AM",
        status: "paused" as const,
      },
    ];

    const projects = [
      {
        id: "1",
        name: "Website Redesign",
        progress: 75,
        hoursLogged: "12.5h",
        color: "bg-blue-600",
      },
      {
        id: "2",
        name: "Mobile App Development",
        progress: 45,
        hoursLogged: "8.2h",
        color: "bg-purple-600",
      },
      {
        id: "3",
        name: "Internal Dashboard",
        progress: 90,
        hoursLogged: "6.8h",
        color: "bg-green-600",
      },
    ];

    const timeDistribution = [
      { label: "Website Redesign", hours: 12.5, color: "#2563eb" },
      { label: "Mobile App", hours: 8.2, color: "#9333ea" },
      { label: "Internal Dashboard", hours: 6.8, color: "#16a34a" },
      { label: "Client Meetings", hours: 3.5, color: "#f59e0b" },
      { label: "Other", hours: 1.5, color: "#6b7280" },
    ];

    return (
      <>
        <DashboardLayout title="Dashboard">
          <div
            className={`transition-opacity duration-500 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Debug Links (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-2 bg-yellow-50 rounded-lg border border-yellow-200 text-sm">
                <p>Debug Mode: Authenticated as {user?.name}</p>
                <div className="flex space-x-4 mt-2">
                  <Link
                    href="/debug-dashboard"
                    className="text-blue-600 hover:underline"
                  >
                    Debug Page
                  </Link>
                  <Link
                    href="/simple-dashboard"
                    className="text-blue-600 hover:underline"
                  >
                    Simple Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Clock Section */}
            <div className="mb-6">
              <Clock className="animate-fadeIn" />
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <ActivityList
                  activities={activities}
                  className="animate-fadeIn"
                  style={{ animationDelay: "400ms" }}
                />
                <TimeDistributionChart
                  data={timeDistribution}
                  className="animate-fadeIn"
                  style={{ animationDelay: "500ms" }}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <ProjectList
                  projects={projects}
                  className="animate-fadeIn"
                  style={{ animationDelay: "600ms" }}
                />
              </div>
            </div>
          </div>
        </DashboardLayout>
        <LocationModalWrapper />
      </>
    );
  } catch (err) {
    setError(
      `Error rendering dashboard: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    // Re-render will go to error state
    return null;
  }
}
