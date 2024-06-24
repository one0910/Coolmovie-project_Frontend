import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";
import { orderApi } from "../services/orderService";
import { movieApi } from "../services/movieService";
import { memberApi } from "../services/memberService";

// const devMiddleWares = process.env.NODE_ENV === 'development' ? [logger] : [];
const devMiddleWares = [process.env.NODE_ENV === 'development' && logger].filter(
  Boolean
);


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(orderApi.middleware)
      .concat(movieApi.middleware)
      .concat(memberApi.middleware)
    // .concat(...devMiddleWares as any)
  }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;