import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClockState {
  isActive: boolean;
  isPaused: boolean;
  showNotes: boolean;
  locationDenied: boolean;
  checkInNote: string;
  checkOutNote: string;
}

const initialState: ClockState = {
  isActive: false,
  isPaused: false,
  showNotes: false,
  locationDenied: false,
  checkInNote: "",
  checkOutNote: "",
};

const clockSlice = createSlice({
  name: "clock",
  initialState,
  reducers: {
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    setIsPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
    setShowNotes: (state, action: PayloadAction<boolean>) => {
      state.showNotes = action.payload;
    },
    setLocationDenied: (state, action: PayloadAction<boolean>) => {
      state.locationDenied = action.payload;
    },
    setCheckInNote: (state, action: PayloadAction<string>) => {
      state.checkInNote = action.payload;
    },
    setCheckOutNote: (state, action: PayloadAction<string>) => {
      state.checkOutNote = action.payload;
    },
    setState: (
      state,
      action: PayloadAction<{ isActive: boolean; isPaused: boolean }>
    ) => {
      state.isActive = action.payload.isActive;
      state.isPaused = action.payload.isPaused;
    },
  },
});

export const {
  setIsActive,
  setIsPaused,
  setShowNotes,
  setLocationDenied,
  setCheckInNote,
  setCheckOutNote,
  setState,
} = clockSlice.actions;

export default clockSlice.reducer;
