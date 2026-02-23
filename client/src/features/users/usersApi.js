import { baseApi } from "../../api/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query({
      query: (params = {}) => ({
        url: "users",
        params
      }),
      providesTags: (result) =>
        result?.users
          ? [
              { type: "Users", id: "LIST" },
              ...result.users.map((item) => ({ type: "Users", id: item._id }))
            ]
          : [{ type: "Users", id: "LIST" }]
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `users/${id}`
      }),
      providesTags: (_result, _error, id) => [{ type: "Users", id }]
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "users",
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }]
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Users", id: arg.id },
        { type: "Users", id: "LIST" }
      ]
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }]
    }),
    resetPassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `users/${id}/reset-password`,
        method: "POST",
        body: { newPassword }
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }]
    })
  })
});

export const {
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetPasswordMutation
} = usersApi;
