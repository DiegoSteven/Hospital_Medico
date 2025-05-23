import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { servicioService } from '../services/api';

const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    precio: '',
    tipo: '',
    duracion: '',
    medico: '',
    especialidad: '',
    laboratorio: '',
    tipo_examen: '',
    tiempo_resultado: '',
    tipo_imagen: '',
    area_cuerpo: '',
    requiere_contraste: false,
    medicamento: '',
    cantidad: '',
    unidad_medida: '',
    nombre_procedimiento: '',
    requiere_anestesia: false
  });

  const tiposServicio = [
    { value: 'atencion_medica', label: 'Atención Médica' },
    { value: 'examen_laboratorio', label: 'Examen de Laboratorio' },
    { value: 'imagen_radiologica', label: 'Imagen Radiológica' },
    { value: 'suministro_medicamento', label: 'Suministro de Medicamento' },
    { value: 'procedimiento', label: 'Procedimiento' }
  ];

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const data = await servicioService.getAll();
      setServicios(data);
    } catch (error) {
      setError('Error al cargar los servicios: ' + error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      descripcion: '',
      precio: '',
      tipo: '',
      duracion: '',
      medico: '',
      especialidad: '',
      laboratorio: '',
      tipo_examen: '',
      tiempo_resultado: '',
      tipo_imagen: '',
      area_cuerpo: '',
      requiere_contraste: false,
      medicamento: '',
      cantidad: '',
      unidad_medida: '',
      nombre_procedimiento: '',
      requiere_anestesia: false
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validarFormulario = () => {
    if (!formData.descripcion || !formData.precio || !formData.tipo) {
      setError('Por favor complete todos los campos requeridos');
      return false;
    }

    switch (formData.tipo) {
      case 'atencion_medica':
        if (!formData.duracion || !formData.medico || !formData.especialidad) {
          setError('Por favor complete los campos específicos de Atención Médica');
          return false;
        }
        break;
      case 'examen_laboratorio':
        if (!formData.laboratorio || !formData.tipo_examen || !formData.tiempo_resultado) {
          setError('Por favor complete los campos específicos de Examen de Laboratorio');
          return false;
        }
        break;
      case 'imagen_radiologica':
        if (!formData.tipo_imagen || !formData.area_cuerpo) {
          setError('Por favor complete los campos específicos de Imagen Radiológica');
          return false;
        }
        break;
      case 'suministro_medicamento':
        if (!formData.medicamento || !formData.cantidad || !formData.unidad_medida) {
          setError('Por favor complete los campos específicos de Suministro de Medicamento');
          return false;
        }
        break;
      case 'procedimiento':
        if (!formData.nombre_procedimiento || !formData.duracion) {
          setError('Por favor complete los campos específicos de Procedimiento');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const dataToSend = {
        ...formData,
        precio: parseFloat(formData.precio),
        duracion: formData.duracion ? parseInt(formData.duracion) : undefined,
        cantidad: formData.cantidad ? parseInt(formData.cantidad) : undefined
      };

      await servicioService.create(dataToSend);
      handleClose();
      cargarServicios();
    } catch (error) {
      setError('Error al crear el servicio: ' + error);
    }
  };

  const renderCamposEspecificos = () => {
    switch (formData.tipo) {
      case 'atencion_medica':
        return (
          <>
            <TextField
              name="duracion"
              label="Duración (minutos)"
              type="number"
              value={formData.duracion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="medico"
              label="Médico"
              value={formData.medico}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="especialidad"
              label="Especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </>
        );
      case 'examen_laboratorio':
        return (
          <>
            <TextField
              name="laboratorio"
              label="Laboratorio"
              value={formData.laboratorio}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="tipo_examen"
              label="Tipo de Examen"
              value={formData.tipo_examen}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="tiempo_resultado"
              label="Tiempo de Resultado"
              value={formData.tiempo_resultado}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </>
        );
      case 'imagen_radiologica':
        return (
          <>
            <TextField
              name="tipo_imagen"
              label="Tipo de Imagen"
              value={formData.tipo_imagen}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="area_cuerpo"
              label="Área del Cuerpo"
              value={formData.area_cuerpo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="requiere_contraste"
              label="Requiere Contraste"
              select
              value={formData.requiere_contraste}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
          </>
        );
      case 'suministro_medicamento':
        return (
          <>
            <TextField
              name="medicamento"
              label="Medicamento"
              value={formData.medicamento}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="cantidad"
              label="Cantidad"
              type="number"
              value={formData.cantidad}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="unidad_medida"
              label="Unidad de Medida"
              value={formData.unidad_medida}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </>
        );
      case 'procedimiento':
        return (
          <>
            <TextField
              name="nombre_procedimiento"
              label="Nombre del Procedimiento"
              value={formData.nombre_procedimiento}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="duracion"
              label="Duración (minutos)"
              type="number"
              value={formData.duracion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="requiere_anestesia"
              label="Requiere Anestesia"
              select
              value={formData.requiere_anestesia}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Servicios Médicos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Nuevo Servicio
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicios.map((servicio) => (
              <TableRow key={servicio.id}>
                <TableCell>{servicio.id}</TableCell>
                <TableCell>{servicio.descripcion}</TableCell>
                <TableCell>{servicio.tipo}</TableCell>
                <TableCell>${servicio.precio}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Servicio</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="descripcion"
                label="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="precio"
                label="Precio"
                type="number"
                value={formData.precio}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="tipo"
                label="Tipo de Servicio"
                select
                value={formData.tipo}
                onChange={handleChange}
                fullWidth
                required
              >
                {tiposServicio.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {renderCamposEspecificos()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiciosPage; 