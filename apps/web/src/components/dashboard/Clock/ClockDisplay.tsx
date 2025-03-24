"use client";

import React, { useEffect, useState } from "react";

const ClockDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      <div>
        <h2 className="text-2xl font-bold">{formatTime(currentTime)}</h2>
        <p className="text-blue-100">{formatDate(currentTime)}</p>
      </div>
    </div>
  );
};

export default ClockDisplay;
