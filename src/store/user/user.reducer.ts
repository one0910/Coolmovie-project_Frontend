import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLogout } from "./user.action";

export const USER_INITIAL_STATE = {
  token: '',
  mail: '',
  role: ''
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
  /*
  extraReducers算是可以不透過原本的reducer，額外設置方法來操作其state
  如下所示另外加入一個userLogout的function，來將其狀態state reset
  */
  extraReducers: (builder) => {
    builder.addCase(userLogout, () => USER_INITIAL_STATE); // 處理登出 action
  },
})

export const { setUser } = userSlice.actions
export const userReducer = userSlice.reducer