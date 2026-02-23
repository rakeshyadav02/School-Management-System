import { baseApi } from "../../api/baseApi";

export const teachersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTeachers: builder.query({
      query: (params) => ({
        url: "teachers",
        params
      }),
      providesTags: (result) =>
        result?.items
          ? [
              { type: "Teachers", id: "LIST" },
              ...result.items.map((item) => ({ type: "Teachers", id: item._id }))
            ]
          : [{ type: "Teachers", id: "LIST" }]
    }),
    createTeacher: builder.mutation({
      query: (payload) => ({
        url: "teachers",
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Teachers", id: "LIST" }]
    }),
    updateTeacher: builder.mutation({
      query: ({ id, data }) => ({
        url: `teachers/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Teachers", id: arg.id },
        { type: "Teachers", id: "LIST" }
      ]
    }),
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `teachers/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Teachers", id: "LIST" }]
    })
  })
});

export const {
  useListTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation
} = teachersApi;
