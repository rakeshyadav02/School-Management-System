import { baseApi } from "../../api/baseApi";

export const admissionDocsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadDocument: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/admissions/${id}/documents`,
          method: "POST",
          body: formData,
        };
      },
    }),
    getDocuments: builder.query({
      query: (id) => `/admissions/${id}/documents`,
      providesTags: ["AdmissionDocs"],
    }),
    downloadDocument: builder.query({
      query: (filename) => ({
        url: `/admissions/documents/${filename}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  useGetDocumentsQuery,
  useDownloadDocumentQuery,
} = admissionDocsApi;
