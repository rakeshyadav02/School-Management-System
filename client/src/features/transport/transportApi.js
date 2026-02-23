import { baseApi } from "../../api/baseApi";

export const transportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoutes: builder.query({
      query: () => "/transport/routes",
      providesTags: ["Routes"],
    }),
    addRoute: builder.mutation({
      query: (data) => ({
        url: "/transport/routes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Routes"],
    }),
    assignStudent: builder.mutation({
      query: ({ id, studentId }) => ({
        url: `/transport/routes/${id}/assign-student`,
        method: "PATCH",
        body: { studentId },
      }),
      invalidatesTags: ["Routes"],
    }),
    assignDriver: builder.mutation({
      query: ({ id, driverId }) => ({
        url: `/transport/routes/${id}/assign-driver`,
        method: "PATCH",
        body: { driverId },
      }),
      invalidatesTags: ["Routes"],
    }),
  }),
});

export const {
  useGetRoutesQuery,
  useAddRouteMutation,
  useAssignStudentMutation,
  useAssignDriverMutation,
} = transportApi;
