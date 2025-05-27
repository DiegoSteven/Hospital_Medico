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
import DescargosPage from "./pages/DescargosPage";
import FacturasPage from "./pages/FacturasPage";
import ProductosPage from "./pages/ProductosPage";

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
            <Route path="/descargos" element={<DescargosPage />} />
            <Route path="/facturas" element={<FacturasPage />} />
            <Route path="/productos" element={<ProductosPage />} />{" "}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
