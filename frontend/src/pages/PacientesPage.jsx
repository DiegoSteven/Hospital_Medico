import React, { useState, useEffect } from "react";
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
  InputAdornment,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { pacienteService } from "../services/api";

const PacientesPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    estado: { estadoNombre: "INDETERMINADO" }
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    console.log('Componente montado, cargando pacientes...');
    loadPacientes();
  }, []);

  useEffect(() => {
    console.log('Estado de pacientes actualizado:', pacientes);
  }, [pacientes]);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      const response = await pacienteService.getAll();
      console.log('Respuesta de la API:', response);
      
      // La respuesta ya es el array de pacientes, no necesitamos .data
      const pacientesValidos = Array.isArray(response) 
        ? response.filter(paciente => {
            console.log('Paciente a filtrar:', paciente);
            return paciente && (
              paciente.nombre || 
              paciente.direccion || 
              paciente.telefono || 
              paciente.correo
            );
          })
        : [];
      
      console.log('Pacientes válidos:', pacientesValidos);
      setPacientes(pacientesValidos);
      setError(null);
    } catch (err) {
      console.error('Error completo:', err);
      setError("Error al cargar los pacientes");
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    } else if (!nameRegex.test(formData.nombre)) {
      errors.nombre = "El nombre debe contener solo letras y tener entre 3 y 50 caracteres";
    }

    if (formData.correo && !emailRegex.test(formData.correo)) {
      errors.correo = "Ingrese un correo electrónico válido";
    }

    if (formData.telefono && !phoneRegex.test(formData.telefono)) {
      errors.telefono = "Ingrese un número de teléfono válido (mínimo 8 dígitos)";
    }

    if (formData.direccion && formData.direccion.length > 100) {
      errors.direccion = "La dirección no puede exceder los 100 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (paciente = null) => {
    if (paciente) {
      setSelectedPaciente(paciente);
      setFormData({
        nombre: paciente.nombre || "",
        direccion: paciente.direccion || "",
        telefono: paciente.telefono || "",
        correo: paciente.correo || "",
        estado: paciente.estado || { estadoNombre: "INDETERMINADO" }
      });
    } else {
      setSelectedPaciente(null);
      setFormData({
        nombre: "",
        direccion: "",
        telefono: "",
        correo: "",
        estado: { estadoNombre: "INDETERMINADO" }
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPaciente(null);
    setFormData({
      nombre: "",
      direccion: "",
      telefono: "",
      correo: "",
      estado: { estadoNombre: "INDETERMINADO" }
    });
    setFormErrors({});
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (selectedPaciente) {
        await pacienteService.update(selectedPaciente.id, formData);
      } else {
        await pacienteService.create(formData);
      }
      handleCloseDialog();
      loadPacientes();
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar el paciente");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este paciente?")) {
      try {
        await pacienteService.delete(id);
        loadPacientes();
      } catch (err) {
        setError("Error al eliminar el paciente");
        console.error(err);
      }
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
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
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
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(pacientes) && pacientes.length > 0 ? (
              pacientes.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell>{paciente.nombre || 'No especificado'}</TableCell>
                  <TableCell>{paciente.direccion || 'No especificada'}</TableCell>
                  <TableCell>{paciente.telefono || 'No especificado'}</TableCell>
                  <TableCell>{paciente.correo || 'No especificado'}</TableCell>
                  <TableCell>{paciente.estado?.estadoNombre || 'No especificado'}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(paciente)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(paciente.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay pacientes registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPaciente ? "Editar Paciente" : "Nuevo Paciente"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
                fullWidth
                error={!!formErrors.nombre}
                helperText={formErrors.nombre}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Dirección"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                fullWidth
                error={!!formErrors.direccion}
                helperText={formErrors.direccion}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                fullWidth
                error={!!formErrors.telefono}
                helperText={formErrors.telefono}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Correo"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                fullWidth
                error={!!formErrors.correo}
                helperText={formErrors.correo}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado.estadoNombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: { estadoNombre: e.target.value }
                    })
                  }
                  label="Estado"
                >
                  <MenuItem value="INDETERMINADO">Indeterminado</MenuItem>
                  <MenuItem value="ACTIVO">Activo</MenuItem>
                  <MenuItem value="INACTIVO">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedPaciente ? "Actualizar" : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PacientesPage;
