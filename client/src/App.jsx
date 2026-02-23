import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./routes/AppRoutes";
import { theme } from "./theme";
import { useGetMeQuery } from "./features/auth/authApi";

const App = () => {
  const { isLoading } = useGetMeQuery();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <AppRoutes isAuthLoading={isLoading} />
    </ThemeProvider>
  );
};

export default App;
