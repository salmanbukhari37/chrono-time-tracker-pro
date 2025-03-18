"use client";

import React, { useState, useEffect } from "react";
import { FaClock, FaPlay, FaPause, FaStop } from "react-icons/fa";
import { useLocationPermission } from "@/hooks/useLocationPermission";

interface ClockProps {
  className?: string;
}

export const Clock: React.FC<ClockProps> = ({ className = "" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const { hasPermission, handleLocationGranted, handleLocationDenied } =
    useLocationPermission();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update elapsed time when checked in
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCheckedIn && !isPaused && checkInTime) {
      timer = setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - checkInTime.getTime();
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isCheckedIn, isPaused, checkInTime]);

  const handleCheckIn = () => {
    if (hasPermission !== true) {
      navigator.geolocation.getCurrentPosition(
        handleLocationGranted,
        handleLocationDenied
      );
      return;
    }
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    setElapsedTime(0);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (hasPermission !== true) {
      navigator.geolocation.getCurrentPosition(
        handleLocationGranted,
        handleLocationDenied
      );
      return;
    }
    setIsPaused(!isPaused);
  };

  const handleCheckOut = () => {
    if (hasPermission !== true) {
      navigator.geolocation.getCurrentPosition(
        handleLocationGranted,
        handleLocationDenied
      );
      return;
    }
    setIsCheckedIn(false);
    setCheckInTime(null);
    setElapsedTime(0);
    setIsPaused(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatElapsedTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Location Denied Notification */}
      {locationDenied && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
          <p className="text-sm text-red-800">
            ⚠️ Location access has been denied. Some features may be limited.{" "}
            <button
              onClick={() =>
                navigator.geolocation.getCurrentPosition(
                  handleLocationGranted,
                  handleLocationDenied
                )
              }
              className="text-primary-600 hover:underline font-medium"
            >
              Enable Location
            </button>
          </p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        {/* Current Time Display */}
        <div className="text-4xl font-bold text-gray-800 font-mono">
          {formatTime(currentTime)}
        </div>

        {/* Date Display */}
        <div className="text-gray-500">
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* Timer Display */}
        {isCheckedIn && (
          <div className="text-2xl font-mono text-primary-600">
            {formatElapsedTime(elapsedTime)}
          </div>
        )}

        {/* Status Display */}
        <div className="flex items-center space-x-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isCheckedIn
                ? isPaused
                  ? "bg-yellow-500"
                  : "bg-green-500 animate-pulse"
                : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium text-gray-600">
            {isCheckedIn
              ? isPaused
                ? "On Break"
                : "Checked In"
              : "Checked Out"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <FaPlay className="h-4 w-4" />
              <span>Check In</span>
            </button>
          ) : (
            <>
              <button
                onClick={handlePause}
                className={`flex items-center space-x-2 px-4 py-2 ${
                  isPaused
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white rounded-md transition-colors`}
              >
                {isPaused ? (
                  <>
                    <FaPlay className="h-4 w-4" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <FaPause className="h-4 w-4" />
                    <span>Break</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCheckOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <FaStop className="h-4 w-4" />
                <span>Check Out</span>
              </button>
            </>
          )}
        </div>

        {/* Location Warning */}
        {hasPermission === false && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg w-full">
            <p className="text-sm text-yellow-800">
              ⚠️ Location access is required for time tracking. Some features
              may be limited.{" "}
              <button
                onClick={() =>
                  navigator.geolocation.getCurrentPosition(
                    handleLocationGranted,
                    handleLocationDenied
                  )
                }
                className="text-primary-600 hover:underline font-medium"
              >
                Enable Location
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
