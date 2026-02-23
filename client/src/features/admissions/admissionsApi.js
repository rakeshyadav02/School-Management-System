import { baseApi } from "../../api/baseApi";

export const admissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAdmission: builder.mutation({
      query: (data) => ({
        url: "/admissions",
        method: "POST",
        body: data,
      }),
    }),
    getAdmissions: builder.query({
      query: () => "/admissions",
      providesTags: ["Admissions"],
    }),
    updateAdmissionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admissions/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Admissions"],
    }),
  }),
});

export const {
  useSubmitAdmissionMutation,
  useGetAdmissionsQuery,
  useUpdateAdmissionStatusMutation,
} = admissionsApi;
