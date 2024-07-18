import { createSelector } from 'reselect';
import { RootState } from '../store';
import { OrderItem } from './order.type';
import { convertPlayDateFormat } from '../../utilities';

export const selectOrderReducer = (state: RootState) => {
  return state.order
}


export const selectOrdersLoading = createSelector(
  [selectOrderReducer],
  (ordersSlice) => {
    return ordersSlice.isLoading
  }
)

export const selectOrders = createSelector(
  [selectOrderReducer],
  (ordersSlice) => {
    return ordersSlice.orders
  }
)

export const selectOrderArrange = createSelector(
  [selectOrders],
  (ordersDatas: OrderItem[]) => {
    return ordersDatas?.map((orderdata: OrderItem, index: number) => {
      const { dateNoweekday, time } = convertPlayDateFormat(orderdata.createTime)
      return {
        ...orderdata,
        index: index,
        createTime: `${dateNoweekday} ${time}`,
      }
    })
  })