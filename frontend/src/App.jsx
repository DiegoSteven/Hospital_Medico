import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PacientesPage from "./pages/PacientesPage";
import Servicios from "./pages/ServiciosPage";
import DocumentosPage from "./pages/DocumentosPage";
import FacturasDescargosPage from "./pages/FacturasDescargosPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route
              path="/facturas-descargos"
              element={<FacturasDescargosPage />}
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
