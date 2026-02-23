import { baseApi } from "../../api/baseApi";
import { clearUser, setUser } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({
        url: "auth/register",
        method: "POST",
        body: payload
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch {
          // ignore
        }
      },
      invalidatesTags: ["Auth"]
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: "auth/login",
        method: "POST",
        body: payload
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch {
          // ignore
        }
      },
      invalidatesTags: ["Auth"]
    }),
    getMe: builder.query({
      query: () => "auth/me",
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch {
          dispatch(clearUser());
        }
      },
      providesTags: ["Auth"]
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST"
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearUser());
        }
      },
      invalidatesTags: ["Auth"]
    })
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation
} = authApi;
