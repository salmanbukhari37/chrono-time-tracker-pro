import React, { useState } from "react";
import { TimeEntry } from "shared";
import TimeEntryItem from "./TimeEntryItem";
import TimeEntryDetails from "./TimeEntryDetails";
import NoEntries from "./NoEntries";

interface TimeEntriesHistoryProps {
  className?: string;
  timeEntries: TimeEntry[];
  onDelete?: (id: string) => void;
  onEdit?: (entry: TimeEntry) => void;
  style?: React.CSSProperties;
}

export const TimeEntriesHistory: React.FC<TimeEntriesHistoryProps> = ({
  className = "",
  timeEntries,
  onDelete,
  onEdit,
  style,
}) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (
    startTime: Date,
    endTime: Date,
    breakTime: number = 0
  ) => {
    const totalMs = endTime.getTime() - startTime.getTime();
    const netMs = totalMs - breakTime;

    const hours = Math.floor(netMs / (1000 * 60 * 60));
    const minutes = Math.floor((netMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      style={style}
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
        <h2 className="text-lg font-bold">Recent Time Entries</h2>
      </div>

      {timeEntries.length === 0 ? (
        <NoEntries />
      ) : (
        <div className="divide-y divide-gray-100">
          {timeEntries.map((entry) => (
            <div key={entry.id}>
              <TimeEntryItem
                entry={entry}
                expanded={expandedEntry === entry.id}
                onToggleExpand={toggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                formatDate={formatDate}
                formatTime={formatTime}
                formatDuration={formatDuration}
              />
              {expandedEntry === entry.id && (
                <TimeEntryDetails
                  entry={entry}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
