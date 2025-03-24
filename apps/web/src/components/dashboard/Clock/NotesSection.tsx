"use client";

import React, { useRef } from "react";

interface NotesSectionProps {
  showNotes: boolean;
  checkInNote: string;
  checkOutNote: string;
  onCheckInNoteChange: (note: string) => void;
  onCheckOutNoteChange: (note: string) => void;
  onShowNotesChange: (show: boolean) => void;
  onSaveNote: () => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  showNotes,
  checkInNote,
  checkOutNote,
  onCheckInNoteChange,
  onCheckOutNoteChange,
  onShowNotesChange,
  onSaveNote,
}) => {
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  return (
    showNotes && (
      <div className="px-4 py-3 bg-blue-50">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Update your work notes:
          </label>
          <textarea
            ref={noteInputRef}
            value={checkInNote}
            onChange={(e) => onCheckInNoteChange(e.target.value)}
            placeholder="Describe your tasks, goals, or any irregularities..."
            className="w-full p-2 border border-gray-300 rounded-md h-20 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onShowNotesChange(false)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onSaveNote}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Note
          </button>
        </div>
      </div>
    )
  );
};

export default NotesSection;
