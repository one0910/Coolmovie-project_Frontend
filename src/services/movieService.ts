import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { RTKQuery_DataType } from "../interface/rtk-query";

const url = process.env.REACT_APP_REMOTE_URL

export const movieApi = createApi({
  reducerPath: "movieApi",
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
    getMovieData: builder.query<any, { parameter: string, daterange: string }>({
      query: ({ parameter, daterange }) => {
        return `api/movie/getMovieData/${parameter}/${daterange}`;
      }
    }),

  }),
});

export const { useGetMovieDataQuery } = movieApi