"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setIsActive,
  setIsPaused,
  setCheckInNote,
  setCheckOutNote,
  setShowNotes,
  setLocationDenied,
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
  const { currentEntry } = useAppSelector((state) => state.timeEntries);

  const handleCheckIn = () => {
    if (checkInNote.trim()) {
      dispatch(startTimeEntry({ userId, notes: checkInNote }));
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
    dispatch(setShowNotes(true));
  };

  const handleSaveNote = () => {
    dispatch(setShowNotes(false));
    if (!isActive && !isPaused) {
      dispatch(startTimeEntry({ userId, notes: checkInNote }));
    } else if (isActive || isPaused) {
      if (isActive && !showNotes) {
        dispatch(updateCurrentEntryNotes(checkInNote));
      } else if (showNotes) {
        dispatch(completeTimeEntry(checkOutNote));
      }
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
      />
      <ActionButtons
        isActive={isActive}
        isPaused={isPaused}
        onCheckIn={handleCheckIn}
        onPause={handlePause}
        onCheckOut={handleCheckOut}
        showNotes={showNotes}
      />
      {/* Location Warning */}
      {locationDenied && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg w-full">
            <p className="text-sm text-yellow-800">
              ⚠️ Location access is required for time tracking. Some features
              may be limited.{" "}
              <button
                onClick={() => {
                  /* Implementation */
                }}
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
