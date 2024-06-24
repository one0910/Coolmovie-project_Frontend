import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLogout } from "./user.action";

export const USER_INITIAL_STATE = {
  token: '',
  mail: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState: USER_INITIAL_STATE,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userLogout, () => USER_INITIAL_STATE); // 處理登出 action
  },
})

export const { setUser } = userSlice.actions
export const userReducer = userSlice.reducer