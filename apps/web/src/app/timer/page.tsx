"use client";

import { useEffect } from "react";
import Link from "next/link";
import Timer from "@/components/Timer";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addTimeEntry } from "@/store/features/timeEntriesSlice";
import { generateId } from "shared";
import { formatDate, formatDuration } from "shared";

export default function TimerPage() {
  const dispatch = useAppDispatch();
  const timeEntries = useAppSelector((state) => state.timeEntries.entries);

  const handleSaveTimeEntry = (
    duration: number,
    title: string,
    description: string
  ) => {
    const now = new Date();
    const startTime = new Date(now.getTime() - duration).toISOString();
    const endTime = now.toISOString();

    const newEntry = {
      id: generateId(),
      title,
      description,
      startTime,
      endTime,
      userId: "user-1", // In a real app, this would come from authentication
      breaks: [],
    };

    dispatch(addTimeEntry(newEntry)); // Dispatch action to add time entry
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Time Tracker</h1>
        <Link href="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Timer onSave={handleSaveTimeEntry} />

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Recent Time Entries</h2>

          {timeEntries.length === 0 ? (
            <p className="text-gray-500 italic">
              No time entries yet. Start tracking to see your entries here.
            </p>
          ) : (
            <div className="space-y-4">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{entry.title}</h3>
                    <span className="text-gray-600">
                      {entry.endTime &&
                        formatDuration(
                          new Date(entry.endTime).getTime() -
                            new Date(entry.startTime).getTime()
                        )}
                    </span>
                  </div>
                  {entry.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {entry.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {formatDate(new Date(entry.startTime))} -{" "}
                    {entry.endTime && formatDate(new Date(entry.endTime))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
