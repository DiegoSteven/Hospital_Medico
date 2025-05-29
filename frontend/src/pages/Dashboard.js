import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  MedicalServices as MedicalServicesIcon,
  Description as DescriptionIcon,
  Money as MoneyIcon,
  Receipt as ReceiptIcon,
  ImportExport as ImportExportIcon,
} from "@mui/icons-material";
import {
  pacienteService,
  servicioService,
  facturaService,
  descargoService,
} from "../services/api";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPacientes: 0,
    totalServicios: 0,
    totalFacturas: 0,
    totalDescargos: 0,
    totalFacturado: 0,
  });
  const [recentPacientes, setRecentPacientes] = useState([]);
  const [recentFacturas, setRecentFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [pacientesRes, serviciosRes, facturasRes, descargosRes] = await Promise.all([
        pacienteService.getAll(),
        servicioService.getAll(),
        facturaService.getAll(),
        descargoService.getAll(),
      ]);

      // Validar que las respuestas sean arrays
      const pacientes = Array.isArray(pacientesRes) ? pacientesRes : [];
      const servicios = Array.isArray(serviciosRes) ? serviciosRes : [];
      const facturas = Array.isArray(facturasRes) ? facturasRes : [];
      const descargos = Array.isArray(descargosRes) ? descargosRes : [];

      // Calcular total facturado
      const totalFacturado = facturas.reduce(
        (sum, factura) => sum + (parseFloat(factura.total) || 0),
        0
      );

      // Actualizar estadísticas
      setStats({
        totalPacientes: pacientes.length,
        totalServicios: servicios.length,
        totalFacturas: facturas.length,
        totalDescargos: descargos.length,
        totalFacturado,
      });

      // Obtener pacientes recientes (últimos 5)
      const pacientesRecientes = [...pacientes]
        .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
        .slice(0, 5);
      setRecentPacientes(pacientesRecientes);

      // Obtener facturas recientes (últimos 5)
      const facturasRecientes = [...facturas]
        .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
        .slice(0, 5);
      setRecentFacturas(facturasRecientes);

    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError("Error al cargar los datos del dashboard. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Tarjetas de estadísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Pacientes"
            value={stats.totalPacientes}
            icon={<PeopleIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Servicios"
            value={stats.totalServicios}
            icon={<MedicalServicesIcon />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Facturas"
            value={stats.totalFacturas}
            icon={<ReceiptIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Facturado"
            value={stats.totalFacturado.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
            icon={<MoneyIcon />}
            color="warning.main"
          />
        </Grid>

        {/* Lista de pacientes recientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Pacientes Recientes
            </Typography>
            <List>
              {recentPacientes.length > 0 ? (
                recentPacientes.map((paciente, index) => (
                  <React.Fragment key={paciente.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PeopleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={paciente.nombre || 'Sin nombre'}
                        secondary={paciente.correo || 'Sin correo'}
                      />
                    </ListItem>
                    {index < recentPacientes.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No hay pacientes recientes" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Lista de facturas recientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Facturas Recientes
            </Typography>
            <List>
              {recentFacturas.length > 0 ? (
                recentFacturas.map((factura, index) => (
                  <React.Fragment key={factura.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <ReceiptIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Factura #${factura.id}`}
                        secondary={`${factura.descargo?.paciente?.nombre || 'Sin paciente'} - ${(factura.total || 0).toLocaleString(
                          "es-ES",
                          {
                            style: "currency",
                            currency: "EUR",
                          }
                        )}`}
                      />
                    </ListItem>
                    {index < recentFacturas.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No hay facturas recientes" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
