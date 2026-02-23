import { baseApi } from "../../api/baseApi";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAttendance: builder.query({
      query: (params) => ({
        url: "attendance",
        params
      }),
      providesTags: (result) =>
        result?.items
          ? [
              { type: "Attendance", id: "LIST" },
              ...result.items.map((item) => ({ type: "Attendance", id: item._id }))
            ]
          : [{ type: "Attendance", id: "LIST" }]
    }),
    createAttendance: builder.mutation({
      query: (payload) => ({
        url: "attendance",
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Attendance", id: "LIST" }]
    }),
    updateAttendance: builder.mutation({
      query: ({ id, data }) => ({
        url: `attendance/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Attendance", id: arg.id },
        { type: "Attendance", id: "LIST" }
      ]
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `attendance/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Attendance", id: "LIST" }]
    }),
    bulkMarkAttendance: builder.mutation({
      query: (payload) => ({
        url: "attendance/bulk-mark",
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Attendance", id: "LIST" }]
    })
  })
});

export const {
  useListAttendanceQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useBulkMarkAttendanceMutation
} = attendanceApi;
