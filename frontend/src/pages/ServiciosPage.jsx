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
  InputAdornment,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Timer as TimerIcon,
  LocalHospital as HospitalIcon,
  Science as ScienceIcon,
  LocalPharmacy as PharmacyIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";
import { servicioService } from "../services/api";

const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState(getInitialFormData());

  const tiposServicio = [
    { value: "ATENCION", label: "Atención Médica", icon: <HospitalIcon /> },
    { value: "EXAMEN", label: "Examen de Laboratorio", icon: <ScienceIcon /> },
    { value: "RAYOS_X", label: "Imagen Radiológica", icon: <MedicalIcon /> },
    { value: "SUMINISTRO", label: "Suministro de Medicamento", icon: <PharmacyIcon /> },
    { value: "PROCEDIMIENTO", label: "Procedimiento", icon: <MedicalIcon /> },
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

  const validateForm = () => {
    const errors = {};
    const { tipoServicio } = formData;
    const descripcionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,-]{5,200}$/;
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;

    if (!formData.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria";
    } else if (!descripcionRegex.test(formData.descripcion)) {
      errors.descripcion = "La descripción debe tener entre 5 y 200 caracteres";
    }

    if (!formData.costo || formData.costo <= 0) {
      errors.costo = "El costo debe ser mayor a 0";
    } else if (formData.costo > 1000000) {
      errors.costo = "El costo no puede exceder 1,000,000";
    }

    if (!tipoServicio) {
      errors.tipoServicio = "Debe seleccionar un tipo de servicio";
    }

    switch (tipoServicio) {
      case "ATENCION":
        if (!formData.duracion || formData.duracion <= 0) {
          errors.duracion = "La duración debe ser mayor a 0";
        } else if (formData.duracion > 480) {
          errors.duracion = "La duración no puede exceder 8 horas (480 minutos)";
        }
        if (!formData.medico.trim()) {
          errors.medico = "El médico es obligatorio";
        } else if (!nombreRegex.test(formData.medico)) {
          errors.medico = "El nombre del médico debe contener solo letras y tener entre 3 y 50 caracteres";
        }
        if (!formData.especialidad.trim()) {
          errors.especialidad = "La especialidad es obligatoria";
        } else if (!nombreRegex.test(formData.especialidad)) {
          errors.especialidad = "La especialidad debe contener solo letras y tener entre 3 y 50 caracteres";
        }
        break;
      case "EXAMEN":
        if (!formData.laboratorio.trim()) {
          errors.laboratorio = "El laboratorio es obligatorio";
        } else if (!nombreRegex.test(formData.laboratorio)) {
          errors.laboratorio = "El nombre del laboratorio debe contener solo letras y tener entre 3 y 50 caracteres";
        }
        if (!formData.tipo_examen.trim()) {
          errors.tipo_examen = "El tipo de examen es obligatorio";
        }
        if (!formData.tiempo_resultado.trim()) {
          errors.tiempo_resultado = "El tiempo de resultado es obligatorio";
        }
        break;
      case "RAYOS_X":
        if (!formData.tipo_imagen.trim()) {
          errors.tipo_imagen = "El tipo de imagen es obligatorio";
        }
        if (!formData.area_cuerpo.trim()) {
          errors.area_cuerpo = "El área del cuerpo es obligatoria";
        }
        break;
      case "SUMINISTRO":
        if (!formData.medicamento.trim()) {
          errors.medicamento = "El medicamento es obligatorio";
        }
        if (!formData.cantidad || formData.cantidad <= 0) {
          errors.cantidad = "La cantidad debe ser mayor a 0";
        } else if (formData.cantidad > 1000) {
          errors.cantidad = "La cantidad no puede exceder 1000 unidades";
        }
        if (!formData.unidad_medida.trim()) {
          errors.unidad_medida = "La unidad de medida es obligatoria";
        }
        break;
      case "PROCEDIMIENTO":
        if (!formData.nombre_procedimiento.trim()) {
          errors.nombre_procedimiento = "El nombre del procedimiento es obligatorio";
        }
        if (!formData.duracion || formData.duracion <= 0) {
          errors.duracion = "La duración debe ser mayor a 0";
        } else if (formData.duracion > 480) {
          errors.duracion = "La duración no puede exceder 8 horas (480 minutos)";
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpen = () => {
    setOpen(true);
    setError(null);
    setFormErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(getInitialFormData());
    setFormErrors({});
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
      try {
        await servicioService.delete(id);
        cargarServicios();
      } catch (error) {
        setError("Error al eliminar el servicio");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
            <Grid item xs={12} sm={6}>
              <TextField
                name="duracion"
                label="Duración (minutos)"
                type="number"
                value={formData.duracion}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.duracion}
                helperText={formErrors.duracion}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimerIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="medico"
                label="Médico"
                value={formData.medico}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.medico}
                helperText={formErrors.medico}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HospitalIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="especialidad"
                label="Especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.especialidad}
                helperText={formErrors.especialidad}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MedicalIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </>
        );
      case "EXAMEN":
        return (
          <>
            <Grid item xs={12}>
              <TextField
                name="laboratorio"
                label="Laboratorio"
                value={formData.laboratorio}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.laboratorio}
                helperText={formErrors.laboratorio}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScienceIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="tipo_examen"
                label="Tipo de Examen"
                value={formData.tipo_examen}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.tipo_examen}
                helperText={formErrors.tipo_examen}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="tiempo_resultado"
                label="Tiempo de Resultado"
                value={formData.tiempo_resultado}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.tiempo_resultado}
                helperText={formErrors.tiempo_resultado}
              />
            </Grid>
          </>
        );
      case "RAYOS_X":
        return (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                name="tipo_imagen"
                label="Tipo de Imagen"
                value={formData.tipo_imagen}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.tipo_imagen}
                helperText={formErrors.tipo_imagen}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MedicalIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="area_cuerpo"
                label="Área del Cuerpo"
                value={formData.area_cuerpo}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.area_cuerpo}
                helperText={formErrors.area_cuerpo}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Requiere Contraste</InputLabel>
                <Select
                  name="requiere_contraste"
                  value={formData.requiere_contraste}
                  onChange={handleChange}
                  label="Requiere Contraste"
                >
                  <MenuItem value={true}>Sí</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        );
      case "SUMINISTRO":
        return (
          <>
            <Grid item xs={12}>
              <TextField
                name="medicamento"
                label="Medicamento"
                value={formData.medicamento}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.medicamento}
                helperText={formErrors.medicamento}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PharmacyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="cantidad"
                label="Cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.cantidad}
                helperText={formErrors.cantidad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="unidad_medida"
                label="Unidad de Medida"
                value={formData.unidad_medida}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.unidad_medida}
                helperText={formErrors.unidad_medida}
              />
            </Grid>
          </>
        );
      case "PROCEDIMIENTO":
        return (
          <>
            <Grid item xs={12}>
              <TextField
                name="nombre_procedimiento"
                label="Nombre del Procedimiento"
                value={formData.nombre_procedimiento}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.nombre_procedimiento}
                helperText={formErrors.nombre_procedimiento}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MedicalIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="duracion"
                label="Duración (minutos)"
                type="number"
                value={formData.duracion}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.duracion}
                helperText={formErrors.duracion}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimerIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Requiere Anestesia</InputLabel>
                <Select
                  name="requiere_anestesia"
                  value={formData.requiere_anestesia}
                  onChange={handleChange}
                  label="Requiere Anestesia"
                >
                  <MenuItem value={true}>Sí</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicios.map((servicio) => (
              <TableRow key={servicio.id}>
                <TableCell>{servicio.descripcion}</TableCell>
                <TableCell>
                  {tiposServicio.find(t => t.value === servicio.tipoServicio)?.label}
                </TableCell>
                <TableCell>${servicio.costo}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(servicio)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(servicio.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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
                <TextField
                  name="descripcion"
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.descripcion}
                  helperText={formErrors.descripcion}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="costo"
                  label="Costo"
                  type="number"
                  value={formData.costo}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.costo}
                  helperText={formErrors.costo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.tipoServicio}>
                  <InputLabel>Tipo de Servicio</InputLabel>
                  <Select
                    name="tipoServicio"
                    value={formData.tipoServicio}
                    onChange={handleChange}
                    label="Tipo de Servicio"
                  >
                    {tiposServicio.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box display="flex" alignItems="center">
                          {option.icon}
                          <Box ml={1}>{option.label}</Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.tipoServicio && (
                    <Typography color="error" variant="caption">
                      {formErrors.tipoServicio}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              {renderCamposEspecificos()}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ServiciosPage;
