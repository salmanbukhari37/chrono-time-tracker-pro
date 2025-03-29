import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeEntry } from "shared";

interface Break {
  start: Date;
  end?: Date;
}

interface CurrentTimeEntry extends TimeEntry {
  breaks: Break[];
}

interface TimeEntriesState {
  currentEntry: CurrentTimeEntry | null;
  entries: TimeEntry[];
  isActive: boolean;
  isPaused: boolean;
  totalBreakTime: number;
}

// Get userId from localStorage if available
const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.id || null;
    }
  } catch (error) {
    console.error("Error getting userId from localStorage:", error);
  }
  return null;
};

// Helper function to safely convert string to Date
const safeParseDate = (dateString: string | undefined): Date | undefined => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) return undefined;
    return date;
  } catch (e) {
    console.error("Error parsing date:", e);
    return undefined;
  }
};

// Load initial state from localStorage
const loadState = (): TimeEntriesState => {
  if (typeof window === "undefined") {
    return {
      currentEntry: null,
      entries: [],
      isActive: false,
      isPaused: false,
      totalBreakTime: 0,
    };
  }

  try {
    const userId = getUserId();
    const timeEntriesKey = userId ? `timeEntries_${userId}` : "timeEntries";
    const activeEntryKey = userId
      ? `activeTimeEntry_${userId}`
      : "activeTimeEntry";

    // Load entries
    const savedEntries = localStorage.getItem(timeEntriesKey);
    let entries: TimeEntry[] = [];

    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        entries = parsed.map((entry: any) => ({
          ...entry,
          startTime: safeParseDate(entry.startTime) || new Date(),
          endTime: safeParseDate(entry.endTime),
        }));
      } catch (e) {
        console.error("Error parsing saved entries:", e);
      }
    }

    // Load active entry
    const savedActiveEntry = localStorage.getItem(activeEntryKey);
    let currentEntry: CurrentTimeEntry | null = null;
    let isActive = false;
    let isPaused = false;

    if (savedActiveEntry) {
      try {
        const parsed = JSON.parse(savedActiveEntry);

        // Process breaks with extra validation
        const breaks = Array.isArray(parsed.breaks)
          ? parsed.breaks
              .map((b: any) => {
                // Ensure both start and end dates are valid if they exist
                const startDate = safeParseDate(b.start);
                const endDate = safeParseDate(b.end);

                // Only include break if it has a valid start date
                if (!startDate) return null;

                return {
                  start: startDate,
                  end: endDate,
                };
              })
              .filter(Boolean) // Remove any null entries
          : [];

        currentEntry = {
          ...parsed,
          startTime: safeParseDate(parsed.startTime) || new Date(),
          endTime: safeParseDate(parsed.endTime),
          breaks,
        };

        isActive = parsed.status === "active";
        isPaused = parsed.status === "paused";

        // Consistency check - if we're paused, there should be an ongoing break
        if (isPaused && breaks.length > 0) {
          const lastBreak = breaks[breaks.length - 1];
          if (lastBreak.end) {
            // The last break is completed, but we're still paused
            // Add a new break starting now
            breaks.push({
              start: new Date(),
            });
          }
        }
      } catch (e) {
        console.error("Error parsing active entry:", e);
      }
    }

    return {
      currentEntry,
      entries,
      isActive,
      isPaused,
      totalBreakTime: 0, // This will be calculated when needed
    };
  } catch (error) {
    console.error("Error loading time entries from localStorage:", error);
  }

  return {
    currentEntry: null,
    entries: [],
    isActive: false,
    isPaused: false,
    totalBreakTime: 0,
  };
};

const initialState: TimeEntriesState = loadState();

// Save state to localStorage
const saveState = (state: TimeEntriesState) => {
  if (typeof window === "undefined") return;

  try {
    const userId = getUserId();
    const timeEntriesKey = userId ? `timeEntries_${userId}` : "timeEntries";
    const activeEntryKey = userId
      ? `activeTimeEntry_${userId}`
      : "activeTimeEntry";

    // Save entries
    localStorage.setItem(timeEntriesKey, JSON.stringify(state.entries));

    // Save active entry with proper date handling
    if (state.currentEntry) {
      const status = state.isPaused ? "paused" : "active";

      // Use a sanitized version of the current entry to avoid circular references
      const sanitizedEntry = {
        ...state.currentEntry,
        status,
        // Ensure breaks are properly formatted for serialization
        breaks: state.currentEntry.breaks.map((b) => ({
          start: b.start.toISOString(),
          end: b.end ? b.end.toISOString() : undefined,
        })),
      };

      localStorage.setItem(activeEntryKey, JSON.stringify(sanitizedEntry));
    } else {
      localStorage.removeItem(activeEntryKey);
    }
  } catch (error) {
    console.error("Error saving time entries to localStorage:", error);
  }
};

const timeEntriesSlice = createSlice({
  name: "timeEntries",
  initialState,
  reducers: {
    startTimeEntry: (
      state,
      action: PayloadAction<{ userId: string; notes: string }>
    ) => {
      const { userId, notes } = action.payload;
      state.currentEntry = {
        id: Date.now().toString(),
        userId,
        startTime: new Date(),
        title: `Work Session - ${new Date().toLocaleDateString()}`,
        description: notes,
        checkInNotes: notes,
        breaks: [],
      };
      state.isActive = true;
      state.isPaused = false;
      saveState(state);
    },
    pauseTimeEntry: (state) => {
      if (state.currentEntry) {
        // Add a new break only if we're not already paused
        if (!state.isPaused) {
          state.currentEntry.breaks.push({
            start: new Date(),
          });
        }
        state.isPaused = true;
        state.isActive = false;
        saveState(state);
      }
    },
    resumeTimeEntry: (state) => {
      if (state.currentEntry && state.isPaused) {
        if (state.currentEntry.breaks.length > 0) {
          const lastBreak =
            state.currentEntry.breaks[state.currentEntry.breaks.length - 1];
          if (lastBreak && !lastBreak.end) {
            lastBreak.end = new Date();
          }
        }
        state.isPaused = false;
        state.isActive = true;
        saveState(state);
      }
    },
    completeTimeEntry: (state, action: PayloadAction<string>) => {
      if (state.currentEntry) {
        const endTime = new Date();

        // Ensure all breaks are ended
        if (state.isPaused && state.currentEntry.breaks.length > 0) {
          const lastBreak =
            state.currentEntry.breaks[state.currentEntry.breaks.length - 1];
          if (!lastBreak.end) {
            lastBreak.end = endTime;
          }
        }

        // Calculate total break time
        const totalBreakTime = state.currentEntry.breaks.reduce(
          (total, breakPeriod) => {
            if (breakPeriod.end) {
              return (
                total +
                (breakPeriod.end.getTime() - breakPeriod.start.getTime())
              );
            }
            return total + (endTime.getTime() - breakPeriod.start.getTime());
          },
          0
        );

        const completedEntry: TimeEntry = {
          ...state.currentEntry,
          endTime,
          checkOutNotes: action.payload,
          breakTime: totalBreakTime,
        };

        state.entries.unshift(completedEntry);
        state.currentEntry = null;
        state.isActive = false;
        state.isPaused = false;
        saveState(state);
      }
    },
    updateCurrentEntryNotes: (state, action: PayloadAction<string>) => {
      if (state.currentEntry) {
        state.currentEntry.checkInNotes = action.payload;
        saveState(state);
      }
    },
    calculateTotalBreakTime: (state) => {
      if (state.currentEntry && state.currentEntry.breaks) {
        const now = new Date();
        try {
          const totalBreakTime = state.currentEntry.breaks.reduce(
            (total, breakPeriod) => {
              if (!breakPeriod.start) return total;

              if (breakPeriod.end) {
                return (
                  total +
                  (breakPeriod.end.getTime() - breakPeriod.start.getTime())
                );
              }
              return total + (now.getTime() - breakPeriod.start.getTime());
            },
            0
          );
          state.totalBreakTime = totalBreakTime;
        } catch (e) {
          console.error("Error calculating break time:", e);
          state.totalBreakTime = 0;
        }
      }
    },
    addTimeEntry: (state, action: PayloadAction<TimeEntry>) => {
      state.entries.unshift(action.payload);
      saveState(state);
    },
  },
});

export const {
  startTimeEntry,
  pauseTimeEntry,
  resumeTimeEntry,
  completeTimeEntry,
  updateCurrentEntryNotes,
  calculateTotalBreakTime,
  addTimeEntry,
} = timeEntriesSlice.actions;

export default timeEntriesSlice.reducer;
