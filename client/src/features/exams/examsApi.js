import { baseApi } from "../../api/baseApi";

export const examsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listExams: builder.query({
      query: (params) => ({
        url: "exams",
        params
      }),
      providesTags: (result) =>
        result?.items
          ? [
              { type: "Exams", id: "LIST" },
              ...result.items.map((item) => ({ type: "Exams", id: item._id }))
            ]
          : [{ type: "Exams", id: "LIST" }]
    }),
    createExam: builder.mutation({
      query: (payload) => ({
        url: "exams",
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Exams", id: "LIST" }]
    }),
    updateExam: builder.mutation({
      query: ({ id, data }) => ({
        url: `exams/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Exams", id: arg.id },
        { type: "Exams", id: "LIST" }
      ]
    }),
    deleteExam: builder.mutation({
      query: (id) => ({
        url: `exams/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Exams", id: "LIST" }]
    })
  })
});

export const {
  useListExamsQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation
} = examsApi;
