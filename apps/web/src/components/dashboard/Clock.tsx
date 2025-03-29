"use client";

import React, { useEffect } from "react";
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
  const {
    isActive,
    isPaused,
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

  // Location permission
  const { hasPermission } = useLocationPermission();

  // Ensure clock state and time entries state are always synced
  useEffect(() => {
    if (isActive !== timeEntriesIsActive || isPaused !== timeEntriesIsPaused) {
      dispatch(
        setState({
          isActive: timeEntriesIsActive,
          isPaused: timeEntriesIsPaused,
        })
      );
    }
  }, [timeEntriesIsActive, timeEntriesIsPaused, isActive, isPaused, dispatch]);

  // Update locationDenied state based on permission, but only for new clock-ins
  useEffect(() => {
    // Only update if we have definitive permission info and we're not already active
    if (hasPermission !== null && !currentEntry) {
      dispatch(setLocationDenied(!hasPermission));
    }
  }, [hasPermission, dispatch, currentEntry]);

  // Update notes when current entry changes
  useEffect(() => {
    if (currentEntry && currentEntry.checkInNotes) {
      dispatch(setCheckInNote(currentEntry.checkInNotes));
    }
  }, [currentEntry, dispatch]);

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
    // If location is denied and we're not already active, show the warning
    if (!hasPermission && !currentEntry) {
      dispatch(setLocationDenied(true));
      return;
    }

    if (checkInNote.trim()) {
      dispatch(startTimeEntry({ userId, notes: checkInNote }));
      dispatch(setShowNotes(false));
    } else {
      dispatch(setShowNotes(true));
    }
  };

  const handlePause = () => {
    if (!isPaused) {
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
    if (!isActive && !isPaused) {
      if (!hasPermission && !currentEntry) {
        dispatch(setLocationDenied(true));
        return;
      }
      dispatch(startTimeEntry({ userId, notes: checkInNote }));
    } else if (isActive || isPaused) {
      if (isActive && !showNotes) {
        dispatch(updateCurrentEntryNotes(checkInNote));
      } else if (showNotes) {
        dispatch(completeTimeEntry(checkOutNote || ""));
        dispatch(setCheckOutNote(""));
        dispatch(setCheckInNote(""));
      }
    }
  };

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          dispatch(setLocationDenied(false));
          localStorage.setItem("locationStatus", "allowed");
        },
        () => {
          dispatch(setLocationDenied(true));
          localStorage.setItem("locationStatus", "skipped");
        }
      );
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <ClockDisplay />
      <StatusIndicator isActive={isActive} isPaused={isPaused} />
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
        isActive={isActive}
        isPaused={isPaused}
        onCheckIn={handleCheckIn}
        onPause={handlePause}
        onCheckOut={handleCheckOut}
        showNotes={showNotes}
        locationDenied={locationDenied && !currentEntry} // Only disable button if no current entry
      />
      {/* Location Warning */}
      {locationDenied &&
        !currentEntry && ( // Only show warning if no current entry
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
