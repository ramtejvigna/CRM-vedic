import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import "./index.css";
import { createTheme } from "@mui/material";
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from "./context/SocketContext";
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none', // Remove browser outline globally
            boxShadow: 'none', // Remove any shadow
          },
        },
      },
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
          <SocketProvider>
            <App />
            <ToastContainer/>
          </SocketProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
