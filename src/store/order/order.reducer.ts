import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderItem, OrderStateType } from "./order.type";

const ORDER_INITIAL_STATE: OrderStateType = {
  orders: [],
  isLoading: true
};


export const orderSlice = createSlice({
  name: 'order',
  initialState: ORDER_INITIAL_STATE,
  reducers: {
    setOrderData: (state, action: PayloadAction<OrderItem[]>) => {
      state.orders = action.payload
      state.isLoading = false
    },

    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  },
})

export const { setOrderData, setOrderLoading } = orderSlice.actions
export const orderReducer = orderSlice.reducer