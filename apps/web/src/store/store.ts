// apps/web/src/store/store.ts
import { configureStore, createAction, Middleware } from "@reduxjs/toolkit";
import clockReducer, { setState } from "./features/clockSlice";
import timeEntriesReducer from "./features/timeEntriesSlice";

// Create a properly typed middleware
const syncStateMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only run this for timeEntries actions
  if (
    typeof action.type === "string" &&
    action.type.startsWith("timeEntries/")
  ) {
    const state = store.getState();
    const { isActive, isPaused } = state.timeEntries;

    // Sync state between slices if they don't match
    if (
      isActive !== state.clock.isActive ||
      isPaused !== state.clock.isPaused
    ) {
      store.dispatch(setState({ isActive, isPaused }));
    }
  }

  return result;
};

const store = configureStore({
  reducer: {
    clock: clockReducer,
    timeEntries: timeEntriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(syncStateMiddleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
