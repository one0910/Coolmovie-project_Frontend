import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { RTKQuery_DataType } from "../interface/rtk-query";
const url = process.env.REACT_APP_REMOTE_URL

export const memberApi = createApi({
  reducerPath: "memberApi",
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
    getUserData: builder.query<RTKQuery_DataType, { parameter: string, daterange: string }>({
      query: ({ parameter, daterange }) => {
        return `api/member/getUserData/${parameter}/${daterange}`;
      }
    }),

  }),
});
export const { useGetUserDataQuery } = memberApi;