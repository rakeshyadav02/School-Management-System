import { baseApi } from "../../api/baseApi";

export const announcementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: (audience) => ({
        url: "/announcements",
        params: audience ? { audience } : {},
      }),
      providesTags: ["Announcements"],
    }),
    postAnnouncement: builder.mutation({
      query: (data) => ({
        url: "/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcements"],
    }),
  }),
});

export const { useGetAnnouncementsQuery, usePostAnnouncementMutation } = announcementsApi;
