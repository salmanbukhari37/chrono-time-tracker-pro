"use client";

import React from "react";
import { FaPlay, FaStop, FaPause } from "react-icons/fa";

interface ActionButtonsProps {
  isActive: boolean;
  isPaused: boolean;
  onCheckIn: () => void;
  onPause: () => void;
  onCheckOut: () => void;
  showNotes: boolean;
  locationDenied: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isActive,
  isPaused,
  onCheckIn,
  onPause,
  onCheckOut,
  showNotes,
  locationDenied,
}) => {
  return (
    <div className="p-4 grid grid-cols-2 gap-3">
      {!isActive && !isPaused ? (
        <button
          onClick={onCheckIn}
          className={`col-span-2 flex items-center justify-center space-x-2 py-3 ${
            locationDenied ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } text-white rounded-md transition-colors shadow-sm`}
          disabled={showNotes || locationDenied}
        >
          <FaPlay className="h-4 w-4" />
          <span className="font-medium">Clock In</span>
        </button>
      ) : (
        <>
          <button
            onClick={onPause}
            className={`flex items-center justify-center space-x-2 py-3 ${
              isPaused
                ? "bg-green-500 hover:bg-green-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white rounded-md transition-colors shadow-sm`}
            disabled={showNotes}
          >
            {isPaused ? (
              <>
                <FaPlay className="h-4 w-4" />
                <span className="font-medium">Resume</span>
              </>
            ) : (
              <>
                <FaPause className="h-4 w-4" />
                <span className="font-medium">Break</span>
              </>
            )}
          </button>
          <button
            onClick={onCheckOut}
            className="flex items-center justify-center space-x-2 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm"
            disabled={showNotes}
          >
            <FaStop className="h-4 w-4" />
            <span className="font-medium">Clock Out</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ActionButtons;
