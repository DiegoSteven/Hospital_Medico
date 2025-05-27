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
} from "@mui/icons-material";
import {
  pacienteService,
  servicioService,
  documentoService,
} from "../services/api";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPacientes: 0,
    totalServicios: 0,
    totalDocumentos: 0,
    totalFacturado: 0,
  });
  const [recentPacientes, setRecentPacientes] = useState([]);
  const [recentDocumentos, setRecentDocumentos] = useState([]);
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
      const [pacientesRes, serviciosRes, documentosRes] = await Promise.all([
        pacienteService.getAll(),
        servicioService.getAll(),
        documentoService.getAll(),
      ]);

      // Validar que las respuestas sean arrays
      const pacientes = Array.isArray(pacientesRes) ? pacientesRes : [];
      const servicios = Array.isArray(serviciosRes) ? serviciosRes : [];
      const documentos = Array.isArray(documentosRes) ? documentosRes : [];

      // Calcular total facturado
      const totalFacturado = documentos.reduce(
        (sum, doc) => sum + (parseFloat(doc.valor_total) || 0),
        0
      );

      // Actualizar estadísticas
      setStats({
        totalPacientes: pacientes.length,
        totalServicios: servicios.length,
        totalDocumentos: documentos.length,
        totalFacturado,
      });

      // Obtener pacientes recientes (últimos 5)
      const pacientesRecientes = [...pacientes]
        .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
        .slice(0, 5);
      setRecentPacientes(pacientesRecientes);

      // Obtener documentos recientes (últimos 5)
      const documentosRecientes = [...documentos]
        .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
        .slice(0, 5);
      setRecentDocumentos(documentosRecientes);

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
            title="Total Documentos"
            value={stats.totalDocumentos}
            icon={<DescriptionIcon />}
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

        {/* Lista de documentos recientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Documentos Recientes
            </Typography>
            <List>
              {recentDocumentos.length > 0 ? (
                recentDocumentos.map((documento, index) => (
                  <React.Fragment key={documento.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <DescriptionIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Documento #${documento.numero || documento.id}`}
                        secondary={`Total: ${(documento.valor_total || 0).toLocaleString(
                          "es-ES",
                          {
                            style: "currency",
                            currency: "EUR",
                          }
                        )} - ${new Date(documento.fecha || Date.now()).toLocaleDateString(
                          "es-ES"
                        )}`}
                      />
                    </ListItem>
                    {index < recentDocumentos.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No hay documentos recientes" />
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
