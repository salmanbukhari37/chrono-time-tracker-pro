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
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : undefined,
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
        currentEntry = {
          ...parsed,
          startTime: new Date(parsed.startTime),
          endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
          breaks: parsed.breaks
            ? parsed.breaks.map((b: any) => ({
                start: new Date(b.start),
                end: b.end ? new Date(b.end) : undefined,
              }))
            : [],
        };
        isActive = parsed.status === "active";
        isPaused = parsed.status === "paused";
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

    // Save active entry
    if (state.currentEntry) {
      const status = state.isPaused ? "paused" : "active";
      localStorage.setItem(
        activeEntryKey,
        JSON.stringify({
          ...state.currentEntry,
          status,
        })
      );
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
        state.currentEntry.breaks.push({
          start: new Date(),
        });
        state.isPaused = true;
        state.isActive = false;
        saveState(state);
      }
    },
    resumeTimeEntry: (state) => {
      if (state.currentEntry && state.isPaused) {
        const lastBreak =
          state.currentEntry.breaks[state.currentEntry.breaks.length - 1];
        if (lastBreak && !lastBreak.end) {
          lastBreak.end = new Date();
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
      if (state.currentEntry) {
        const now = new Date();
        const totalBreakTime = state.currentEntry.breaks.reduce(
          (total, breakPeriod) => {
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
