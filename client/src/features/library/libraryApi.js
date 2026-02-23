import { baseApi } from "../../api/baseApi";

export const libraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => "/library/books",
      providesTags: ["Books"],
    }),
    addBook: builder.mutation({
      query: (data) => ({
        url: "/library/books",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),
    issueBook: builder.mutation({
      query: (data) => ({
        url: "/library/issue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),
    returnBook: builder.mutation({
      query: (data) => ({
        url: "/library/return",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),
    getIssues: builder.query({
      query: () => "/library/issues",
      providesTags: ["Issues"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useAddBookMutation,
  useIssueBookMutation,
  useReturnBookMutation,
  useGetIssuesQuery,
} = libraryApi;
