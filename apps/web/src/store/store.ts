// apps/web/src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import clockReducer from "./features/clockSlice";
import timeEntriesReducer from "./features/timeEntriesSlice";
import dashboardReducer from "./features/dashboardSlice";

// Create the store with reducers but NO middleware
const store = configureStore({
  reducer: {
    clock: clockReducer,
    dashboard: dashboardReducer,
    timeEntries: timeEntriesReducer,
  },
  // Disable all Redux Thunk and serializable check middleware to prevent any loops
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      thunk: false,
    }),
});

// NO state syncing, NO subscription, NO dispatch overriding
// Let components handle their own state synchronization through hooks

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
