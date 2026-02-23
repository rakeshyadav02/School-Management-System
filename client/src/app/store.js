import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "../api/baseApi";
import { healthDisciplineApi } from "../features/healthDiscipline/healthDisciplineApi";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [healthDisciplineApi.reducerPath]: healthDisciplineApi.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, healthDisciplineApi.middleware)
});
