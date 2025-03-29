import { useDispatch, useSelector } from "react-redux";
import { TimeEntry } from "shared";
import { generateId } from "shared";
import {
  startTimeEntry as startTimeEntryAction,
  pauseTimeEntry as pauseTimeEntryAction,
  resumeTimeEntry as resumeTimeEntryAction,
  completeTimeEntry as completeTimeEntryAction,
  updateCurrentEntryNotes as updateCurrentEntryNotesAction,
  calculateTotalBreakTime,
} from "../store/features/timeEntriesSlice";

interface RootState {
  timeEntries: {
    currentEntry: TimeEntry | null;
    entries: TimeEntry[];
    isActive: boolean;
    isPaused: boolean;
    totalBreakTime: number;
  };
}

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
  const dispatch = useDispatch();
  const {
    currentEntry,
    entries: timeEntries,
    isActive,
    isPaused,
    totalBreakTime,
  } = useSelector((state: RootState) => state.timeEntries);

  const startTimeEntry = (checkInNotes: string = "") => {
    dispatch(startTimeEntryAction({ userId, notes: checkInNotes }));
    return currentEntry;
  };

  const pauseTimeEntry = () => {
    dispatch(pauseTimeEntryAction());
    return currentEntry;
  };

  const resumeTimeEntry = () => {
    dispatch(resumeTimeEntryAction());
    return currentEntry;
  };

  const completeTimeEntry = (checkOutNotes: string = "") => {
    dispatch(completeTimeEntryAction(checkOutNotes));
    return currentEntry;
  };

  const updateCurrentEntryNotes = (checkInNotes: string = "") => {
    dispatch(updateCurrentEntryNotesAction(checkInNotes));
    return currentEntry;
  };

  const calculateElapsedTime = (): number => {
    if (!currentEntry) return 0;

    const now = new Date();
    const startTime = new Date(currentEntry.startTime);
    const rawElapsed = now.getTime() - startTime.getTime();

    // Calculate break time using the Redux state
    dispatch(calculateTotalBreakTime());
    return rawElapsed - totalBreakTime;
  };

  const getTotalBreakTime = (): number => {
    if (!currentEntry) return 0;
    dispatch(calculateTotalBreakTime());
    return totalBreakTime;
  };

  return {
    timeEntries,
    currentEntry,
    isActive,
    isPaused,
    startTimeEntry,
    pauseTimeEntry,
    resumeTimeEntry,
    completeTimeEntry,
    updateCurrentEntryNotes,
    calculateElapsedTime,
    getTotalBreakTime,
  };
};
