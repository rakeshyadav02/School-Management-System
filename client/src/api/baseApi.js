import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    credentials: "include"
  }),
  tagTypes: [
    "Auth",
    "Users",
    "Students",
    "Teachers",
    "Classes",
    "Attendance",
    "Exams",
    "Fees"
  ],
  endpoints: () => ({})
});
