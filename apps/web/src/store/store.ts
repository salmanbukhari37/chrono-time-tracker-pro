// apps/web/src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import clockReducer from "./features/clockSlice";
import timeEntriesReducer from "./features/timeEntriesSlice";

export const store = configureStore({
  reducer: {
    clock: clockReducer,
    timeEntries: timeEntriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
