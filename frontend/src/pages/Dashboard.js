import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  MedicalServices as MedicalServicesIcon,
  Description as DescriptionIcon,
  Money as MoneyIcon,
} from '@mui/icons-material';
import { pacienteService, servicioService, documentoService } from '../services/api';
import StatCard from '../components/StatCard';

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
      const [pacientes, servicios, documentos] = await Promise.all([
        pacienteService.getAll(),
        servicioService.getAll(),
        documentoService.getAll()
      ]);

      const pacientesData = pacientes.data;
      const serviciosData = servicios.data;
      const documentosData = documentos.data;

      // Calcular total facturado
      const totalFacturado = documentosData.reduce(
        (sum, doc) => sum + (doc.valor_total || 0),
        0
      );

      setStats({
        totalPacientes: pacientesData.length,
        totalServicios: serviciosData.length,
        totalDocumentos: documentosData.length,
        totalFacturado,
      });

      // Obtener pacientes recientes (últimos 5)
      setRecentPacientes(pacientesData.slice(-5).reverse());

      // Obtener documentos recientes (últimos 5)
      setRecentDocumentos(documentosData.slice(-5).reverse());
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
            value={stats.totalFacturado.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
            icon={<MoneyIcon />}
            color="warning.main"
          />
        </Grid>

        {/* Lista de pacientes recientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pacientes Recientes
            </Typography>
            <List>
              {recentPacientes.map((paciente, index) => (
                <React.Fragment key={paciente.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PeopleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={paciente.nombre}
                      secondary={`DNI: ${paciente.dni}`}
                    />
                  </ListItem>
                  {index < recentPacientes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Lista de documentos recientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Documentos Recientes
            </Typography>
            <List>
              {recentDocumentos.map((documento, index) => (
                <React.Fragment key={documento.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <DescriptionIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Documento #${documento.numero}`}
                      secondary={`Total: ${documento.valor_total?.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}`}
                    />
                  </ListItem>
                  {index < recentDocumentos.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 