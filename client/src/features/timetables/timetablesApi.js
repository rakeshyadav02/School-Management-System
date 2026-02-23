import { baseApi } from "../../api/baseApi";

export const timetablesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimetables: builder.query({
      query: (params) => ({
        url: "/timetables",
        params,
      }),
      providesTags: ["Timetables"],
    }),
    postTimetable: builder.mutation({
      query: (data) => ({
        url: "/timetables",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Timetables"],
    }),
    updateTimetable: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/timetables/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Timetables"],
    }),
  }),
});

export const {
  useGetTimetablesQuery,
  usePostTimetableMutation,
  useUpdateTimetableMutation,
} = timetablesApi;
