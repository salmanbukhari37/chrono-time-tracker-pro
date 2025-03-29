"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { calculateTotalBreakTime } from "@/store/features/timeEntriesSlice";
import { useDispatch } from "react-redux";
import { formatDuration } from "shared";

const ClockDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const dispatch = useDispatch();

  const { isActive, isPaused } = useAppSelector((state) => state.clock);
  const { currentEntry, totalBreakTime } = useAppSelector(
    (state) => state.timeEntries
  );

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed time when clocked in
  useEffect(() => {
    if (!currentEntry) return;

    const calculateElapsed = () => {
      const now = new Date();
      const startTime = new Date(currentEntry.startTime);
      const rawElapsed = now.getTime() - startTime.getTime();

      // Calculate break time
      dispatch(calculateTotalBreakTime());
      return rawElapsed - totalBreakTime;
    };

    // Update elapsed time immediately
    setElapsedTime(calculateElapsed());

    // Update elapsed time every second when active
    if (isActive || isPaused) {
      const timer = setInterval(() => {
        setElapsedTime(calculateElapsed());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, isPaused, currentEntry, totalBreakTime, dispatch]);

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
