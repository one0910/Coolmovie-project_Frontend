import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user/user.reducer';
import { orderApi } from '../services/orderService';
import { movieApi } from '../services/movieService';
import { memberApi } from '../services/memberService';

export const rootReducer = combineReducers({
  user: userReducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [movieApi.reducerPath]: movieApi.reducer,
  [memberApi.reducerPath]: memberApi.reducer,
});
