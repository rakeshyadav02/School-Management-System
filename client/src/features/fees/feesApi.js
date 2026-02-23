import { baseApi } from "../../api/baseApi";

export const feesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listFees: builder.query({
      query: (params) => ({
        url: "fees",
        params
      }),
      providesTags: (result) =>
        result?.items
          ? [
              { type: "Fees", id: "LIST" },
              ...result.items.map((item) => ({ type: "Fees", id: item._id }))
            ]
          : [{ type: "Fees", id: "LIST" }]
    }),
    createFee: builder.mutation({
      query: (payload) => ({
        url: "fees",
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Fees", id: "LIST" }]
    }),
    updateFee: builder.mutation({
      query: ({ id, data }) => ({
        url: `fees/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Fees", id: arg.id },
        { type: "Fees", id: "LIST" }
      ]
    }),
    deleteFee: builder.mutation({
      query: (id) => ({
        url: `fees/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Fees", id: "LIST" }]
    })
  })
});

export const {
  useListFeesQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useDeleteFeeMutation
} = feesApi;
