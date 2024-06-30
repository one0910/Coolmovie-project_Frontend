import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
  isMoblieScreen: boolean;
}

export const COMMON_INITIAL_STATE: CommonState = {
  isMoblieScreen: window.matchMedia('(max-width: 768px)').matches,
};

const commonSlice = createSlice({
  name: 'common',
  initialState: COMMON_INITIAL_STATE,
  reducers: {
    setIsMobileScreen(state, action: PayloadAction<boolean>) {
      state.isMoblieScreen = action.payload;
    },
  },
});

export const { setIsMobileScreen } = commonSlice.actions;
export const commonReducer = commonSlice.reducer;