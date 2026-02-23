import { baseApi } from "../../api/baseApi";

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listStudents: builder.query({
      query: (params) => ({
        url: "students",
        params
      }),
      providesTags: (result) =>
        result?.items
          ? [
              { type: "Students", id: "LIST" },
              ...result.items.map((item) => ({ type: "Students", id: item._id }))
            ]
          : [{ type: "Students", id: "LIST" }]
    }),
    createStudent: builder.mutation({
      query: (payload) => ({
        url: "students",
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Students", id: "LIST" }]
    }),
    updateStudent: builder.mutation({
      query: ({ id, data }) => ({
        url: `students/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Students", id: arg.id },
        { type: "Students", id: "LIST" }
      ]
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `students/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Students", id: "LIST" }]
    })
  })
});

export const {
  useListStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation
} = studentsApi;
