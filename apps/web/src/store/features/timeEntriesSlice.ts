import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { TimeEntry } from "shared"; // Adjust the import based on your structure

interface Break {
  startTime: string;
  endTime?: string;
}

interface TimeEntry {
  id: string;
  userId: string;
  startTime: string; // Keep as string for easier serialization
  endTime?: string; // Keep as string for easier serialization
  checkInNotes?: string;
  checkOutNotes?: string;
  description?: string;
  title: string;
  breaks: Break[]; // Ensure breaks is included
}

interface TimeEntriesState {
  currentEntry: TimeEntry | null;
  entries: TimeEntry[];
  isActive: boolean;
  isPaused: boolean;
  totalBreakTime: number;
}

const initialState: TimeEntriesState = {
  currentEntry: null,
  entries: [],
  isActive: false,
  isPaused: false,
  totalBreakTime: 0,
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
        startTime: new Date().toISOString(),
        checkInNotes: notes,
        breaks: [],
        title: "",
      };
      state.isActive = true;
      state.isPaused = false;
    },
    pauseTimeEntry: (state) => {
      if (state.currentEntry) {
        state.currentEntry.breaks.push({
          startTime: new Date().toISOString(),
        });
        state.isPaused = true;
      }
    },
    resumeTimeEntry: (state) => {
      if (state.currentEntry && state.currentEntry.breaks.length > 0) {
        const lastBreak =
          state.currentEntry.breaks[state.currentEntry.breaks.length - 1];
        lastBreak.endTime = new Date().toISOString();
        state.isPaused = false;
      }
    },
    completeTimeEntry: (state, action: PayloadAction<string>) => {
      if (state.currentEntry) {
        state.currentEntry.endTime = new Date().toISOString();
        state.currentEntry.checkOutNotes = action.payload;
        state.entries.push(state.currentEntry);
        state.currentEntry = null;
        state.isActive = false;
        state.isPaused = false;
      }
    },
    updateCurrentEntryNotes: (state, action: PayloadAction<string>) => {
      if (state.currentEntry) {
        state.currentEntry.checkInNotes = action.payload;
      }
    },
    calculateTotalBreakTime: (state) => {
      if (state.currentEntry) {
        const totalBreakTime = state.currentEntry.breaks.reduce(
          (total, breakPeriod) => {
            if (breakPeriod.endTime) {
              return (
                total +
                (new Date(breakPeriod.endTime).getTime() -
                  new Date(breakPeriod.startTime).getTime())
              );
            }
            return (
              total +
              (new Date().getTime() - new Date(breakPeriod.startTime).getTime())
            );
          },
          0
        );
        state.totalBreakTime = totalBreakTime;
      }
    },
    addTimeEntry: (state, action: PayloadAction<TimeEntry>) => {
      state.entries.unshift(action.payload); // Add new entry to the beginning
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
