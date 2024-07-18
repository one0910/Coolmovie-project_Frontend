import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { RTKQuery_DataType_Order } from "../interface/rtk-query";
const url = process.env.REACT_APP_REMOTE_URL

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers, { getState }) => {
      const token = ((getState() as RootState).user.token) ? (getState() as RootState).user.token : (localStorage.getItem("userToken") || "")
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrderData: builder.query<RTKQuery_DataType_Order, { parameter: string, daterange: string }>({
      query: ({ parameter, daterange }) => {
        return `api/order/getOrderData/${parameter}/${daterange}`;
      },
      providesTags: (result) => {
        if (result?.data.dataForManagement) {
          return [
            ...result.data.dataForManagement.map(({ id }) => {
              return { type: 'Order' as const, id: id }
            }),
            { type: 'Order', id: 'LIST' },
          ]
        } else {
          return [{ type: 'Order', id: 'LIST' }]
        }
      }
    }),
    updateOrderData: builder.mutation({
      query: ({ id, ...data }) => {
        return {
          url: `api/order/updateOrder/${id}`,
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, error, { id }) => {
        return [{ type: 'Order', id: id }]
      }
    }),
    deleteOrderData: builder.mutation({
      query: ({ id, ...data }) => {
        return {
          url: `api/order/deleteOrder/${id}`,
          method: 'DELETE',
          body: data,
        }
      },
      invalidatesTags: (result, error, { id }) => {
        return [{ type: 'Order', id: id }]
      },
    }),
  }),
});
export const { useGetOrderDataQuery, useUpdateOrderDataMutation, useDeleteOrderDataMutation } = orderApi;