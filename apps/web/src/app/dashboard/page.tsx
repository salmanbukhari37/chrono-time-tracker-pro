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
  TimeEntriesHistory,
} from "@/components/dashboard";
import { useRequireAuth } from "@/utils/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LocationModalWrapper } from "@/components/LocationModalWrapper";
import { useTimeEntries } from "@/hooks/useTimeEntries";
import Loading from "@/components/common/Loading";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import AuthRequired from "@/components/common/AuthRequired";
import { useSelector } from "react-redux";
import { selectDashboard } from "@/store/features/dashboardSlice"; // Fixed import path
import { getIconComponent } from "@/utils/iconUtils"; // Import the utility function

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, isLoading } = useRequireAuth();
  const [error, setError] = useState<string | null>(null);
  const [renderStage, setRenderStage] = useState("initial");
  const { timeEntries } = useTimeEntries(user?.id || "user-1");
  const dashboard = useSelector(selectDashboard);

  // Map stats with icon components
  const statsWithIcons = dashboard.stats.map((stat) => ({
    ...stat,
    icon: getIconComponent(stat.iconName),
  }));

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
    return <Loading renderStage={renderStage} />;
  }

  // If there's an error, show error state
  if (error) {
    return <ErrorDisplay error={error} renderStage={renderStage} />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <AuthRequired />;
  }

  // Rest of your dashboard code...
  try {
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
              <Clock className="animate-fadeIn" userId={user?.id || "user-1"} />
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsWithIcons.map((stat, index) => (
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
                  activities={dashboard.activities}
                  className="animate-fadeIn"
                  style={{ animationDelay: "400ms" }}
                />
                <TimeDistributionChart
                  data={dashboard.timeDistribution}
                  className="animate-fadeIn"
                  style={{ animationDelay: "500ms" }}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <ProjectList
                  projects={dashboard.projects}
                  className="animate-fadeIn"
                  style={{ animationDelay: "600ms" }}
                />

                {/* Time Entries History */}
                <TimeEntriesHistory
                  timeEntries={timeEntries}
                  className="animate-fadeIn"
                  style={{ animationDelay: "700ms" }}
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
