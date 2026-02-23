import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFound = () => (
  <Box textAlign="center" mt={10}>
    <Typography variant="h4" gutterBottom>
      Page not found
    </Typography>
    <Typography color="text.secondary" gutterBottom>
      The page you are looking for does not exist.
    </Typography>
    <Button component={RouterLink} to="/dashboard" variant="contained">
      Back to dashboard
    </Button>
  </Box>
);

export default NotFound;
