import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
  isMoblieScreen: boolean;
  error: {
    isError: boolean
    errorMessage: string
  },
  alert: {
    isAlert: boolean
    alertMessage: string
  },
  viewMode: {
    account: string,
    password: string | undefined,
  }
}

export const COMMON_INITIAL_STATE: CommonState = {
  isMoblieScreen: window.matchMedia('(max-width: 768px)').matches,
  error: {
    isError: false,
    errorMessage: '',
  },
  alert: {
    isAlert: false,
    alertMessage: ''
  },
  viewMode: {
    account: '',
    password: '',
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
    },
    setAlert(state, action: PayloadAction<{ isAlert: boolean, alertMessage: string }>) {
      state.alert = action.payload
    },
    setViewMode(state, action: PayloadAction<{ account: string, password: string }>) {
      state.viewMode = action.payload
    }
  },
});

export const { setIsMobileScreen, setError, setAlert, setViewMode } = commonSlice.actions;
export const commonReducer = commonSlice.reducer;