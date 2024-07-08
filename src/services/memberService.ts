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
    checkEmail: builder.mutation({
      query: (mail) => {
        return {
          url: `api/member/checkEmail`,
          method: 'POST',
          body: { email: mail },
        }
      },
    }),
    createAccount: builder.mutation({
      query: (data) => {
        return {
          url: `api/member/createAccount`,
          method: 'POST',
          body: data,
        }
      },
    }),
    updateUserData: builder.mutation({
      query: ({ memberID, ...data }) => {
        return {
          url: `api/member/updateUser/${memberID}`,
          method: 'PATCH',
          body: data,
        }
      },
    }),
    deleteUserData: builder.mutation({
      query: (memberID) => {
        console.log('memberID => ', memberID)
        return {
          url: `api/member/deleteUser/${memberID}`,
          method: 'DELETE'
        }
      },
    }),
  }),
});
export const {
  useGetUserDataQuery,
  useUpdateUserDataMutation,
  useCheckEmailMutation,
  useCreateAccountMutation,
  useDeleteUserDataMutation
} = memberApi;