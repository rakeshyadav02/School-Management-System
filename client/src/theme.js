import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1b5e20"
    },
    secondary: {
      main: "#ff8f00"
    },
    background: {
      default: "#f6f7fb",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: "Poppins, Segoe UI, sans-serif",
    h5: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 10
  }
});
