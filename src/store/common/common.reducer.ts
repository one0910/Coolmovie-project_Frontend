import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
  isMoblieScreen: boolean;
  error: {
    isError: boolean
    errorMessage: string
  }
}

export const COMMON_INITIAL_STATE: CommonState = {
  isMoblieScreen: window.matchMedia('(max-width: 768px)').matches,
  error: {
    isError: false,
    errorMessage: ''
  }
};

const commonSlice = createSlice({
  name: 'common',
  initialState: COMMON_INITIAL_STATE,
  reducers: {
    setIsMobileScreen(state, action: PayloadAction<boolean>) {
      state.isMoblieScreen = action.payload;
    },
    setError(state, action: PayloadAction<{ isError: boolean, errorMessage: string }>) {
      state.error = action.payload
    }
  },
});

export const { setIsMobileScreen, setError } = commonSlice.actions;
export const commonReducer = commonSlice.reducer;