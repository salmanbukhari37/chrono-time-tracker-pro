import { useState, useEffect } from "react";
import { TimeEntry } from "shared";
import { generateId } from "shared";

type TimeEntryStatus = "active" | "paused" | "completed";

interface CurrentTimeEntry {
  id: string;
  startTime: Date;
  checkInNotes?: string;
  checkOutNotes?: string;
  breakPeriods: { start: Date; end?: Date }[];
  status: TimeEntryStatus;
}

export const useTimeEntries = (userId: string) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<CurrentTimeEntry | null>(
    null
  );

  // Load time entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(`timeEntries_${userId}`);
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        // Convert string dates back to Date objects
        const entries = parsed.map((entry: any) => ({
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : undefined,
        }));
        setTimeEntries(entries);
      } catch (error) {
        console.error("Error loading time entries from localStorage", error);
      }
    }

    // Check for active entry
    const activeEntry = localStorage.getItem(`activeTimeEntry_${userId}`);
    if (activeEntry) {
      try {
        const parsed = JSON.parse(activeEntry);
        setCurrentEntry({
          ...parsed,
          startTime: new Date(parsed.startTime),
          breakPeriods: parsed.breakPeriods.map((period: any) => ({
            start: new Date(period.start),
            end: period.end ? new Date(period.end) : undefined,
          })),
        });
      } catch (error) {
        console.error(
          "Error loading active time entry from localStorage",
          error
        );
      }
    }
  }, [userId]);

  // Save time entries to localStorage when they change
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem(
        `timeEntries_${userId}`,
        JSON.stringify(timeEntries)
      );
    }
  }, [timeEntries, userId]);

  // Save active entry to localStorage when it changes
  useEffect(() => {
    if (currentEntry) {
      localStorage.setItem(
        `activeTimeEntry_${userId}`,
        JSON.stringify(currentEntry)
      );
    } else {
      localStorage.removeItem(`activeTimeEntry_${userId}`);
    }
  }, [currentEntry, userId]);

  const startTimeEntry = (checkInNotes?: string) => {
    const newEntry: CurrentTimeEntry = {
      id: generateId(),
      startTime: new Date(),
      checkInNotes,
      breakPeriods: [],
      status: "active",
    };

    setCurrentEntry(newEntry);
    return newEntry;
  };

  const pauseTimeEntry = () => {
    if (!currentEntry) return null;

    const updatedEntry: CurrentTimeEntry = {
      ...currentEntry,
      breakPeriods: [...currentEntry.breakPeriods, { start: new Date() }],
      status: "paused",
    };

    setCurrentEntry(updatedEntry);
    return updatedEntry;
  };

  const resumeTimeEntry = () => {
    if (!currentEntry || currentEntry.status !== "paused") return null;

    const updatedBreakPeriods = [...currentEntry.breakPeriods];
    const lastBreak = updatedBreakPeriods[updatedBreakPeriods.length - 1];

    if (lastBreak && !lastBreak.end) {
      lastBreak.end = new Date();
    }

    const updatedEntry: CurrentTimeEntry = {
      ...currentEntry,
      breakPeriods: updatedBreakPeriods,
      status: "active",
    };

    setCurrentEntry(updatedEntry);
    return updatedEntry;
  };

  const completeTimeEntry = (checkOutNotes?: string) => {
    if (!currentEntry) return null;

    // Ensure all breaks are properly ended
    const updatedBreakPeriods = [...currentEntry.breakPeriods];
    const lastBreak = updatedBreakPeriods[updatedBreakPeriods.length - 1];

    if (lastBreak && !lastBreak.end && currentEntry.status === "paused") {
      lastBreak.end = new Date();
    }

    // Calculate total break time
    const totalBreakTime = updatedBreakPeriods.reduce((total, period) => {
      if (!period.end) return total;
      return total + (period.end.getTime() - period.start.getTime());
    }, 0);

    // Create the completed time entry
    const completedEntry: TimeEntry = {
      id: currentEntry.id,
      title: "Time Entry", // This could be customizable
      startTime: currentEntry.startTime,
      endTime: new Date(),
      userId,
      checkInNotes: currentEntry.checkInNotes,
      checkOutNotes,
      breakTime: totalBreakTime,
    };

    setTimeEntries((prev) => [completedEntry, ...prev]);
    setCurrentEntry(null);

    return completedEntry;
  };

  const updateCurrentEntryNotes = (checkInNotes?: string) => {
    if (!currentEntry) return null;

    const updatedEntry: CurrentTimeEntry = {
      ...currentEntry,
      checkInNotes,
    };

    setCurrentEntry(updatedEntry);
    return updatedEntry;
  };

  const calculateElapsedTime = (): number => {
    if (!currentEntry) return 0;

    const now = new Date();
    const rawElapsed = now.getTime() - currentEntry.startTime.getTime();

    // Calculate break time
    const breakTime = currentEntry.breakPeriods.reduce((total, period) => {
      if (!period.end && currentEntry.status === "paused") {
        // Ongoing break
        return total + (now.getTime() - period.start.getTime());
      } else if (period.end) {
        // Completed break
        return total + (period.end.getTime() - period.start.getTime());
      }
      return total;
    }, 0);

    return rawElapsed - breakTime;
  };

  const getTotalBreakTime = (): number => {
    if (!currentEntry) return 0;

    const now = new Date();

    return currentEntry.breakPeriods.reduce((total, period) => {
      if (!period.end && currentEntry.status === "paused") {
        // Ongoing break
        return total + (now.getTime() - period.start.getTime());
      } else if (period.end) {
        // Completed break
        return total + (period.end.getTime() - period.start.getTime());
      }
      return total;
    }, 0);
  };

  return {
    timeEntries,
    currentEntry,
    isActive: !!currentEntry && currentEntry.status === "active",
    isPaused: !!currentEntry && currentEntry.status === "paused",
    startTimeEntry,
    pauseTimeEntry,
    resumeTimeEntry,
    completeTimeEntry,
    updateCurrentEntryNotes,
    calculateElapsedTime,
    getTotalBreakTime,
  };
};
