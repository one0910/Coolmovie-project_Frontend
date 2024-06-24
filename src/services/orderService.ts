import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { RTKQuery_DataType } from "../interface/rtk-query";
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


  endpoints: (builder) => ({
    getOrderCount: builder.query<RTKQuery_DataType, string>({
      query: (parameter) => {
        if (parameter === "count") {
          return `api/order/getOrderCount`;
        }
        return `api/order/getOrderCount`;
      }
    }),

  }),
});
export const { useGetOrderCountQuery } = orderApi;