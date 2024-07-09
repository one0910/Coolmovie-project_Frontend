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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserData: builder.query<RTKQuery_DataType, { parameter: string, daterange: string }>({
      query: ({ parameter, daterange }) => {
        return `api/member/getUserData/${parameter}/${daterange}`;
      },
      /*在這裡設置一組標記，用此標記來告知RTK-Query是烈需要更新(或是重新query)緩存的資料，通常只要在builder.query
      需要做標記設置，因為在需只做get API的地方設置標記才是比較合理的做法，而以下面的標記設置標說
      { type: 'User' as const, id: _id }: 這是用來將每資料做標記 , 通常都是用數據的主鍵或其他能唯一標識這條數據的屬性都做標記, 
      { type: 'User', id: 'LIST' }: 這是用來將整組資料做標記, 只要數據發生變化, 就啟重新啟動getUserData的query
      結論就是只要是{ type: 'User' as const, id: _id }或是{ type: 'User', id: 'LIST' }所設置的標記過期(invalidatesTags)
      則getUserData的query就需要被重新觸發
      */
      providesTags: (result) => {
        console.log('result => ', result)
        if (result?.data.dataForManagement) {
          return [
            ...result.data.dataForManagement.map(({ _id }) => {
              return { type: 'User' as const, id: _id }
            }),
            { type: 'User', id: 'LIST' },
          ]
        } else {
          return [{ type: 'User', id: 'LIST' }]
        }
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
      /*invalidatesTags的設置就是告知providesTags所對應的query要重新去觸發了，以此按例來說
       {type: 'User', id: 'LIST' }  和{ type: 'User', id: memberID } 都是告知RTK-Query要去重啟getUserData的query了
      */
      invalidatesTags: () => {
        return [{ type: 'User', id: 'LIST' }]
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
      invalidatesTags: (result, error, { memberID }) => {
        return [{ type: 'User', id: memberID }]
      }
    }),
    deleteUserData: builder.mutation({
      query: (memberID) => {
        return {
          url: `api/member/deleteUser/${memberID}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, memberID) => {
        return [{ type: 'User', id: memberID }]
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
