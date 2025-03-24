import React from "react";
import { TimeEntry } from "shared";
import {
  FaClock,
  FaPauseCircle,
  FaEdit,
  FaTrash,
  FaStickyNote,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface TimeEntryItemProps {
  entry: TimeEntry;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  onEdit?: (entry: TimeEntry) => void;
  onDelete?: (id: string) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatDuration: (
    startTime: Date,
    endTime: Date,
    breakTime?: number
  ) => string;
}

const TimeEntryItem: React.FC<TimeEntryItemProps> = ({
  entry,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
  formatDate,
  formatTime,
  formatDuration,
}) => {
  return (
    <div className="hover:bg-gray-50 transition-colors">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mr-3">
              <FaClock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-gray-800">
                {formatDate(entry.startTime)}
              </div>
              <div className="text-sm text-gray-500">
                {formatTime(entry.startTime)} -{" "}
                {entry.endTime ? formatTime(entry.endTime) : "ongoing"}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {entry.endTime && (
              <div className="mr-4 text-right">
                <div className="font-semibold text-indigo-600">
                  {formatDuration(
                    entry.startTime,
                    entry.endTime,
                    entry.breakTime || 0
                  )}
                </div>
                {entry.breakTime && entry.breakTime > 0 && (
                  <div className="text-xs text-gray-500 flex items-center justify-end">
                    <FaPauseCircle className="h-2 w-2 text-yellow-500 mr-1" />
                    <span>
                      Break: {Math.floor(entry.breakTime / (1000 * 60))}m
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => onToggleExpand(entry.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? (
                <FaChevronUp className="h-4 w-4" />
              ) : (
                <FaChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Note indicator */}
        {(entry.checkInNotes || entry.checkOutNotes) && !expanded && (
          <div className="ml-13 pl-13 flex items-center text-xs text-gray-500">
            <div className="ml-13">
              <FaStickyNote className="h-3 w-3 text-indigo-400 inline mr-1" />
              <span>Has notes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeEntryItem;
