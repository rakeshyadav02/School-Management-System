import { baseApi } from "../../api/baseApi";

export const feeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeeStructures: builder.query({
      query: () => "/fees/structures",
      providesTags: ["FeeStructures"],
    }),
    addFeeStructure: builder.mutation({
      query: (data) => ({
        url: "/fees/structures",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FeeStructures"],
    }),
    getPayments: builder.query({
      query: () => "/fees/payments",
      providesTags: ["Payments"],
    }),
    payFee: builder.mutation({
      query: (data) => ({
        url: "/fees/payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const {
  useGetFeeStructuresQuery,
  useAddFeeStructureMutation,
  useGetPaymentsQuery,
  usePayFeeMutation,
} = feeApi;
