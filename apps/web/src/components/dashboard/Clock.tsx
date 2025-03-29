"use client";

import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setCheckInNote,
  setCheckOutNote,
  setShowNotes,
  setLocationDenied,
  setState,
} from "@/store/features/clockSlice";
import {
  startTimeEntry,
  pauseTimeEntry,
  resumeTimeEntry,
  completeTimeEntry,
  updateCurrentEntryNotes,
} from "@/store/features/timeEntriesSlice";
import ClockDisplay from "./Clock/ClockDisplay";
import StatusIndicator from "./Clock/StatusIndicator";
import NotesSection from "./Clock/NotesSection";
import ActionButtons from "./Clock/ActionButtons";
import { useLocationPermission } from "@/hooks/useLocationPermission";

interface ClockProps {
  className?: string;
  userId: string;
}

export const Clock: React.FC<ClockProps> = ({ className = "", userId }) => {
  const dispatch = useAppDispatch();
  const isSyncingRef = useRef(false);

  // Clock state
  const {
    isActive: clockIsActive,
    isPaused: clockIsPaused,
    checkInNote,
    checkOutNote,
    showNotes,
    locationDenied,
  } = useAppSelector((state) => state.clock);

  // Time entries state
  const {
    currentEntry,
    isActive: timeEntriesIsActive,
    isPaused: timeEntriesIsPaused,
  } = useAppSelector((state) => state.timeEntries);

  // Location permission with improved hook
  const {
    status: locationStatus,
    hasPermission,
    promptForLocation,
    resetLocationStatus,
  } = useLocationPermission();

  // Safe dispatch function to prevent infinite loops
  const safeDispatch = (action: any) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      dispatch(action);
    } finally {
      // Use setTimeout to break the synchronous call chain
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 0);
    }
  };

  // Sync time entries -> clock (one way only, to prevent loops)
  useEffect(() => {
    if (isSyncingRef.current) return;

    if (
      clockIsActive !== timeEntriesIsActive ||
      clockIsPaused !== timeEntriesIsPaused
    ) {
      safeDispatch(
        setState({
          isActive: timeEntriesIsActive,
          isPaused: timeEntriesIsPaused,
        })
      );
    }
  }, [timeEntriesIsActive, timeEntriesIsPaused, clockIsActive, clockIsPaused]);

  // Update location denied state based on permission status
  useEffect(() => {
    // Only update if we have a valid status
    if (locationStatus === "skipped" || locationStatus === "denied") {
      dispatch(setLocationDenied(true));
    } else if (locationStatus === "allowed") {
      dispatch(setLocationDenied(false));
    }
  }, [locationStatus, dispatch]);

  // Update notes when current entry changes
  useEffect(() => {
    if (!isSyncingRef.current && currentEntry && currentEntry.checkInNotes) {
      safeDispatch(setCheckInNote(currentEntry.checkInNotes));
    }
  }, [currentEntry]);

  // Sync user data with localStorage
  useEffect(() => {
    if (userId) {
      try {
        // Store userId in localStorage for persistence
        const userData = { id: userId };
        localStorage.setItem("userData", JSON.stringify(userData));
      } catch (error) {
        console.error("Error saving user data to localStorage:", error);
      }
    }
  }, [userId]);

  const handleCheckIn = () => {
    // If location is not allowed and we're not already active, enforce permission
    if (locationStatus !== "allowed" && !currentEntry) {
      // If skipped or denied, show warning
      if (locationStatus === "skipped" || locationStatus === "denied") {
        dispatch(setLocationDenied(true));
        return;
      }
      // If unknown, prompt for location now
      else if (locationStatus === "unknown") {
        handleRequestLocation();
        return;
      }
    }

    if (checkInNote.trim()) {
      dispatch(startTimeEntry({ userId, notes: checkInNote }));
      dispatch(setShowNotes(false));
    } else {
      dispatch(setShowNotes(true));
    }
  };

  const handlePause = () => {
    if (!clockIsPaused) {
      dispatch(pauseTimeEntry());
    } else {
      dispatch(resumeTimeEntry());
    }
  };

  const handleCheckOut = () => {
    if (currentEntry) {
      dispatch(completeTimeEntry(checkOutNote || ""));
      dispatch(setCheckOutNote(""));
      dispatch(setCheckInNote(""));
    }
  };

  const handleSaveNote = () => {
    dispatch(setShowNotes(false));

    if (!clockIsActive && !clockIsPaused) {
      // Starting a new time entry - check location permission
      if (locationStatus !== "allowed" && !currentEntry) {
        dispatch(setLocationDenied(true));
        return;
      }
      dispatch(startTimeEntry({ userId, notes: checkInNote }));
    } else if (clockIsActive || clockIsPaused) {
      if (clockIsActive && !showNotes) {
        // Just updating notes on current entry
        dispatch(updateCurrentEntryNotes(checkInNote));
      } else if (showNotes) {
        // Completing the entry
        dispatch(completeTimeEntry(checkOutNote || ""));
        dispatch(setCheckOutNote(""));
        dispatch(setCheckInNote(""));
      }
    }
  };

  const handleRequestLocation = () => {
    // Use the improved promptForLocation function
    promptForLocation()
      .then(() => {
        dispatch(setLocationDenied(false));
      })
      .catch(() => {
        dispatch(setLocationDenied(true));
      });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <ClockDisplay />
      <StatusIndicator isActive={clockIsActive} isPaused={clockIsPaused} />
      <NotesSection
        showNotes={showNotes}
        checkInNote={checkInNote}
        checkOutNote={checkOutNote}
        onCheckInNoteChange={(note) => dispatch(setCheckInNote(note))}
        onCheckOutNoteChange={(note) => dispatch(setCheckOutNote(note))}
        onShowNotesChange={(show) => dispatch(setShowNotes(show))}
        onSaveNote={handleSaveNote}
      />
      <ActionButtons
        isActive={clockIsActive}
        isPaused={clockIsPaused}
        onCheckIn={handleCheckIn}
        onPause={handlePause}
        onCheckOut={handleCheckOut}
        showNotes={showNotes}
        locationDenied={locationDenied && !currentEntry} // Only disable button if no current entry
      />
      {/* Location Warning */}
      {locationDenied && !currentEntry && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg w-full">
            <p className="text-sm text-yellow-800">
              ⚠️ Location access is required for time tracking. Some features
              may be limited.{" "}
              <button
                onClick={handleRequestLocation}
                className="text-blue-600 hover:underline font-medium"
              >
                Enable Location
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
