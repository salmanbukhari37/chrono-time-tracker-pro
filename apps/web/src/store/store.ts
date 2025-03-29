// apps/web/src/store/store.ts
import {
  configureStore,
  Middleware,
  Action,
  MiddlewareAPI,
  Dispatch,
} from "@reduxjs/toolkit";
import clockReducer, {
  setState,
  setCheckInNote,
  setCheckOutNote,
} from "./features/clockSlice";
import timeEntriesReducer from "./features/timeEntriesSlice";
import dashboardReducer from "./features/dashboardSlice";

type AppState = {
  clock: ReturnType<typeof clockReducer>;
  timeEntries: ReturnType<typeof timeEntriesReducer>;
  dashboard: ReturnType<typeof dashboardReducer>;
};

// Middleware to sync clock state with time entries state
const syncStateMiddleware = ((store: MiddlewareAPI<Dispatch, AppState>) =>
  (next: Dispatch) =>
  (action: Action) => {
    const result = next(action);

    // Sync states after any timeEntries action
    if (action.type.startsWith("timeEntries/")) {
      const state = store.getState();
      const { isActive, isPaused, currentEntry } = state.timeEntries;

      // Sync active/paused state
      if (
        isActive !== state.clock.isActive ||
        isPaused !== state.clock.isPaused
      ) {
        store.dispatch(setState({ isActive, isPaused }));
      }

      // Sync notes when time entry is completed
      if (action.type === "timeEntries/completeTimeEntry") {
        store.dispatch(setCheckInNote(""));
        store.dispatch(setCheckOutNote(""));
      }

      // Sync notes when time entry is started
      if (action.type === "timeEntries/startTimeEntry" && currentEntry) {
        store.dispatch(setCheckInNote(currentEntry.checkInNotes || ""));
      }
    }

    return result;
  }) as Middleware;

// Store initialization middleware to sync initial state
const initializationMiddleware = ((store: MiddlewareAPI<Dispatch, AppState>) =>
  (next: Dispatch) =>
  (action: Action) => {
    const result = next(action);

    // Sync initial state after store is created (only once)
    if (action.type === "@@INIT") {
      const state = store.getState();
      const { isActive, isPaused, currentEntry } = state.timeEntries;

      // Initial sync of clock state from time entries
      store.dispatch(setState({ isActive, isPaused }));

      // Initial sync of notes
      if (currentEntry && currentEntry.checkInNotes) {
        store.dispatch(setCheckInNote(currentEntry.checkInNotes));
      }
    }

    return result;
  }) as Middleware;

const store = configureStore({
  reducer: {
    clock: clockReducer,
    dashboard: dashboardReducer,
    timeEntries: timeEntriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      syncStateMiddleware,
      initializationMiddleware,
    ]),
});

// Run initial state sync immediately after store creation
store.dispatch({ type: "@@INIT" });

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
