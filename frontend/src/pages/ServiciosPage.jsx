import React, { useState, useEffect } from "react";
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
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { servicioService } from "../services/api";

const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState(getInitialFormData());

  const tiposServicio = [
    { value: "ATENCION", label: "Atención Médica" },
    { value: "EXAMEN", label: "Examen de Laboratorio" },
    { value: "RAYOS_X", label: "Imagen Radiológica" },
    { value: "SUMINISTRO", label: "Suministro de Medicamento" },
    { value: "PROCEDIMIENTO", label: "Procedimiento" },
  ];

  useEffect(() => {
    cargarServicios();
  }, []);

  function getInitialFormData() {
    return {
      descripcion: "",
      costo: "",
      tipoServicio: "",
      duracion: "",
      medico: "",
      especialidad: "",
      laboratorio: "",
      tipo_examen: "",
      tiempo_resultado: "",
      tipo_imagen: "",
      area_cuerpo: "",
      requiere_contraste: false,
      medicamento: "",
      cantidad: "",
      unidad_medida: "",
      nombre_procedimiento: "",
      requiere_anestesia: false,
    };
  }

  const cargarServicios = async () => {
    try {
      const data = await servicioService.getAll();
      setServicios(data);
    } catch (error) {
      setError("Error al cargar los servicios: " + error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(getInitialFormData());
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (servicio) => {
    setFormData({
      ...getInitialFormData(),
      ...servicio,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este servicio?")) {
      await servicioService.delete(id);
      cargarServicios();
    }
  };

  const validarFormulario = () => {
    const { tipoServicio } = formData;

    if (!formData.descripcion || !formData.costo || !tipoServicio) {
      setError("Por favor complete todos los campos requeridos");
      return false;
    }

    switch (tipoServicio) {
      case "ATENCION":
        if (!formData.duracion || !formData.medico || !formData.especialidad) {
          setError("Complete los campos específicos de Atención Médica");
          return false;
        }
        break;
      case "EXAMEN":
        if (
          !formData.laboratorio ||
          !formData.tipo_examen ||
          !formData.tiempo_resultado
        ) {
          setError("Complete los campos específicos de Examen de Laboratorio");
          return false;
        }
        break;
      case "RAYOS_X":
        if (!formData.tipo_imagen || !formData.area_cuerpo) {
          setError("Complete los campos de Imagen Radiológica");
          return false;
        }
        break;
      case "SUMINISTRO":
        if (
          !formData.medicamento ||
          !formData.cantidad ||
          !formData.unidad_medida
        ) {
          setError("Complete los campos de Suministro de Medicamento");
          return false;
        }
        break;
      case "PROCEDIMIENTO":
        if (!formData.nombre_procedimiento || !formData.duracion) {
          setError("Complete los campos de Procedimiento");
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
        fecha: formData.fecha || today,
        costo: parseFloat(formData.costo),
        duracion: formData.duracion ? parseInt(formData.duracion) : undefined,
        cantidad: formData.cantidad ? parseInt(formData.cantidad) : undefined,
      };

      await servicioService.create(dataToSend);
      handleClose();
      cargarServicios();
    } catch (error) {
      setError("Error al crear el servicio: " + error);
    }
  };

  const renderCamposEspecificos = () => {
    switch (formData.tipoServicio) {
      case "ATENCION":
        return (
          <>
            <TextField name="duracion" label="Duración (minutos)" type="number" value={formData.duracion} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="medico" label="Médico" value={formData.medico} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="especialidad" label="Especialidad" value={formData.especialidad} onChange={handleChange} fullWidth margin="normal" required />
          </>
        );
      case "EXAMEN":
        return (
          <>
            <TextField name="laboratorio" label="Laboratorio" value={formData.laboratorio} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="tipo_examen" label="Tipo de Examen" value={formData.tipo_examen} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="tiempo_resultado" label="Tiempo de Resultado" value={formData.tiempo_resultado} onChange={handleChange} fullWidth margin="normal" required />
          </>
        );
      case "RAYOS_X":
        return (
          <>
            <TextField name="tipo_imagen" label="Tipo de Imagen" value={formData.tipo_imagen} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="area_cuerpo" label="Área del Cuerpo" value={formData.area_cuerpo} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="requiere_contraste" label="Requiere Contraste" select value={formData.requiere_contraste} onChange={handleChange} fullWidth margin="normal">
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
          </>
        );
      case "SUMINISTRO":
        return (
          <>
            <TextField name="medicamento" label="Medicamento" value={formData.medicamento} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="cantidad" label="Cantidad" type="number" value={formData.cantidad} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="unidad_medida" label="Unidad de Medida" value={formData.unidad_medida} onChange={handleChange} fullWidth margin="normal" required />
          </>
        );
      case "PROCEDIMIENTO":
        return (
          <>
            <TextField name="nombre_procedimiento" label="Nombre del Procedimiento" value={formData.nombre_procedimiento} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="duracion" label="Duración (minutos)" type="number" value={formData.duracion} onChange={handleChange} fullWidth margin="normal" required />
            <TextField name="requiere_anestesia" label="Requiere Anestesia" select value={formData.requiere_anestesia} onChange={handleChange} fullWidth margin="normal">
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

      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen} sx={{ mb: 2 }}>
        Nuevo Servicio
      </Button>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicios.map((servicio) => (
              <TableRow key={servicio.id}>
                <TableCell>{servicio.tipoServicio}</TableCell>
                <TableCell>{servicio.descripcion}</TableCell>
                <TableCell>{servicio.fecha}</TableCell>
                <TableCell>${servicio.costo?.toFixed(2)}</TableCell>
                <TableCell>
                  {servicio.tipoServicio === "ATENCION" && `Médico: ${servicio.medico}`}
                  {servicio.tipoServicio === "RAYOS_X" && (
                    <>
                      Zona: {servicio.zona} <br />
                      Obs: {servicio.observaciones}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(servicio)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(servicio.id)}>
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
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField name="descripcion" label="Descripción" value={formData.descripcion} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="costo" label="Costo" type="number" value={formData.costo} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="tipoServicio" label="Tipo de Servicio" select value={formData.tipoServicio} onChange={handleChange} fullWidth required>
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
            <Button type="submit" variant="contained" color="primary">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ServiciosPage;
