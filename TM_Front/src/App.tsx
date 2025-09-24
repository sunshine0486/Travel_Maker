import { Container, CssBaseline } from "@mui/material";
import "./App.css";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <AppRoutes />
      </Container>
    </>
  );
}

export default App;
