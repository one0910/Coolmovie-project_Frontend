import { combineReducers } from '@reduxjs/toolkit';
import { commonReducer } from './common/common.reducer';
import { userReducer } from './user/user.reducer';
import { orderReducer } from './order/order.reducer';
import { orderApi } from '../services/orderService';
import { movieApi } from '../services/movieService';
import { memberApi } from '../services/memberService';

export const rootReducer = combineReducers({
  common: commonReducer,
  user: userReducer,
  order: orderReducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [movieApi.reducerPath]: movieApi.reducer,
  [memberApi.reducerPath]: memberApi.reducer,
});
