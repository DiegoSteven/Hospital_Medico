import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { pacienteService } from '../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PacientesPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
  });

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      const response = await pacienteService.getAll();
      setPacientes(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pacientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (paciente = null) => {
    if (paciente) {
      setSelectedPaciente(paciente);
      setFormData({
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        cedula: paciente.cedula,
        fecha_nacimiento: paciente.fecha_nacimiento ? format(new Date(paciente.fecha_nacimiento), 'yyyy-MM-dd') : '',
        direccion: paciente.direccion || '',
        telefono: paciente.telefono || '',
      });
    } else {
      setSelectedPaciente(null);
      setFormData({
        nombre: '',
        apellido: '',
        cedula: '',
        fecha_nacimiento: '',
        direccion: '',
        telefono: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPaciente(null);
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      fecha_nacimiento: '',
      direccion: '',
      telefono: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPaciente) {
        await pacienteService.update(selectedPaciente.id, formData);
      } else {
        await pacienteService.create(formData);
      }
      handleCloseDialog();
      loadPacientes();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el paciente');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este paciente?')) {
      try {
        await pacienteService.delete(id);
        loadPacientes();
      } catch (err) {
        setError('Error al eliminar el paciente');
        console.error(err);
      }
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
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Pacientes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Paciente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Fecha de Nacimiento</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacientes.map((paciente) => (
              <TableRow key={paciente.id}>
                <TableCell>{paciente.nombre}</TableCell>
                <TableCell>{paciente.apellido}</TableCell>
                <TableCell>{paciente.cedula}</TableCell>
                <TableCell>
                  {paciente.fecha_nacimiento
                    ? format(new Date(paciente.fecha_nacimiento), 'dd/MM/yyyy', { locale: es })
                    : '-'}
                </TableCell>
                <TableCell>{paciente.direccion || '-'}</TableCell>
                <TableCell>{paciente.telefono || '-'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(paciente)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(paciente.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPaciente ? 'Editar Paciente' : 'Nuevo Paciente'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Cédula"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                fullWidth
              />
              <TextField
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedPaciente ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PacientesPage; 