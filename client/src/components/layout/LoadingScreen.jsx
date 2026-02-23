import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingScreen = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    minHeight="60vh"
  >
    <CircularProgress />
  </Box>
);

export default LoadingScreen;
