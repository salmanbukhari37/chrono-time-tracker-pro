"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import { calculateTotalBreakTime } from "@/store/features/timeEntriesSlice";
import { useDispatch } from "react-redux";
import { formatDuration } from "shared";

interface ClockState {
  isActive: boolean;
  isPaused: boolean;
  showNotes: boolean;
  locationDenied: boolean;
  checkInNote: string;
  checkOutNote: string;
}

interface TimeEntriesState {
  currentEntry: any;
  entries: any[];
  isActive: boolean;
  isPaused: boolean;
  totalBreakTime: number;
}

const ClockDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const dispatch = useDispatch();
  const isCalculatingRef = useRef(false);

  const { isActive, isPaused } = useAppSelector(
    (state: { clock: ClockState }) => state.clock
  );
  const { currentEntry, totalBreakTime } = useAppSelector(
    (state: { timeEntries: TimeEntriesState }) => state.timeEntries
  );

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // A memoized function to calculate elapsed time efficiently
  const calculateElapsed = useCallback(() => {
    if (!currentEntry) return 0;

    try {
      const now = new Date();
      const startTime = new Date(currentEntry.startTime);

      // Verify that the date is valid
      if (isNaN(startTime.getTime())) {
        console.error("Invalid start time:", currentEntry.startTime);
        return 0;
      }

      const rawElapsed = now.getTime() - startTime.getTime();

      // Use the cached totalBreakTime for completed breaks
      let breakTime = totalBreakTime;

      // Only manually calculate the current break time if we're on a break
      if (isPaused && currentEntry.breaks && currentEntry.breaks.length > 0) {
        const lastBreak = currentEntry.breaks[currentEntry.breaks.length - 1];

        // If the last break doesn't have an end time, it's ongoing
        if (lastBreak && !lastBreak.end) {
          try {
            const breakStart = new Date(lastBreak.start);
            if (!isNaN(breakStart.getTime())) {
              const ongoingBreakTime = now.getTime() - breakStart.getTime();
              // Add the ongoing break time to our cached value
              breakTime += ongoingBreakTime;
            }
          } catch (e) {
            console.error("Error calculating ongoing break time:", e);
          }
        }
      }

      return Math.max(0, rawElapsed - breakTime);
    } catch (e) {
      console.error("Error in calculateElapsed:", e);
      return 0;
    }
  }, [currentEntry, isPaused, totalBreakTime]);

  // Safe way to calculate total break time without causing loops
  const safeCalculateTotalBreakTime = useCallback(() => {
    if (isCalculatingRef.current) return;
    isCalculatingRef.current = true;

    try {
      dispatch(calculateTotalBreakTime());
    } finally {
      // Use timeout to break potential synchronous loop
      setTimeout(() => {
        isCalculatingRef.current = false;
      }, 0);
    }
  }, [dispatch]);

  // Calculate elapsed time when clocked in
  useEffect(() => {
    if (!currentEntry) return;

    // Initial calculation when component mounts or currentEntry changes
    safeCalculateTotalBreakTime();
    setElapsedTime(calculateElapsed());

    // Only update on a timer if active or paused
    if (isActive || isPaused) {
      const timer = setInterval(() => {
        setElapsedTime(calculateElapsed());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [
    isActive,
    isPaused,
    currentEntry,
    calculateElapsed,
    safeCalculateTotalBreakTime,
  ]);

  // Recalculate break time when pausing or resuming
  useEffect(() => {
    if (currentEntry) {
      safeCalculateTotalBreakTime();
    }
  }, [isPaused, currentEntry, safeCalculateTotalBreakTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{formatTime(currentTime)}</h2>
          <p className="text-blue-100">{formatDate(currentTime)}</p>
        </div>
        {(isActive || isPaused) && currentEntry && (
          <div className="text-right">
            <h3 className="text-xl font-mono">{formatDuration(elapsedTime)}</h3>
            <p className="text-blue-100 text-sm">
              {isPaused ? "Paused" : "Time elapsed"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClockDisplay;
