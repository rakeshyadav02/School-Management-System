import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../utils/notifications';

export const healthDisciplineApi = createApi({
  reducerPath: 'healthDisciplineApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/health-discipline',
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Health', 'Discipline'],
  endpoints: (builder) => ({
    getHealthRecords: builder.query({
      query: (studentId) => `/health/${studentId}`,
      providesTags: ['Health'],
    }),
    addHealthRecord: builder.mutation({
      query: (body) => ({
        url: '/health',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Health'],
    }),
    getDisciplineRecords: builder.query({
      query: (studentId) => `/discipline/${studentId}`,
      providesTags: ['Discipline'],
    }),
    addDisciplineRecord: builder.mutation({
      query: (body) => ({
        url: '/discipline',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Discipline'],
    }),
  }),
});

export const {
  useGetHealthRecordsQuery,
  useAddHealthRecordMutation,
  useGetDisciplineRecordsQuery,
  useAddDisciplineRecordMutation,
} = healthDisciplineApi;
