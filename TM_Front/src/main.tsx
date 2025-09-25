import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.ts";
import { CssBaseline } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <App />
  </ThemeProvider>
);
