import { baseApi } from "../../api/baseApi";

export const classesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listClasses: builder.query({
      query: (params) => ({
        url: "classes",
        params
      }),
      providesTags: (result) =>
        result?.items
          ? [
              { type: "Classes", id: "LIST" },
              ...result.items.map((item) => ({ type: "Classes", id: item._id }))
            ]
          : [{ type: "Classes", id: "LIST" }]
    }),
    createClass: builder.mutation({
      query: (payload) => ({
        url: "classes",
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Classes", id: "LIST" }]
    }),
    updateClass: builder.mutation({
      query: ({ id, data }) => ({
        url: `classes/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Classes", id: arg.id },
        { type: "Classes", id: "LIST" }
      ]
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `classes/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Classes", id: "LIST" }]
    })
  })
});

export const {
  useListClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation
} = classesApi;
