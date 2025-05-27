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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  descargoService,
  pacienteService,
  servicioService,
} from "../services/api";

console.log("Métodos de descargoService:", descargoService);

const DescargosPage = () => {
  const [descargos, setDescargos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    motivo: "",
    responsable: "",
    paciente: "",
    lineasDescargo: [],
  });
  const [lineaActual, setLineaActual] = useState({
    servicioId: "",
    cantidad: 1,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [d, p, s] = await Promise.all([
          descargoService.getAll(),
          pacienteService.getAll(),
          servicioService.getAll(),
        ]);
        setDescargos(d);
        setPacientes(p);
        setServicios(s);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddLinea = () => {
    const servicio = servicios.find((s) => s.id === lineaActual.servicioId);
    if (!servicio || lineaActual.cantidad <= 0) return;
    const subtotal = servicio.costo * lineaActual.cantidad;
    setFormData((prev) => ({
      ...prev,
      lineasDescargo: [
        ...prev.lineasDescargo,
        {
          servicio: { id: servicio.id },
          cantidad: lineaActual.cantidad,
          subtotal,
        },
      ],
    }));
    setLineaActual({ servicioId: "", cantidad: 1 });
  };

  const handleRemoveLinea = (index) => {
    const lineas = [...formData.lineasDescargo];
    lineas.splice(index, 1);
    setFormData({ ...formData, lineasDescargo: lineas });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dtoPayload = {
        pacienteId: formData.paciente,
        motivo: formData.motivo,
        responsable: formData.responsable,
        lineas: formData.lineasDescargo.map((linea) => ({
          servicioId: linea.servicio.id,
          cantidad: linea.cantidad,
        })),
      };

      await descargoService.createFromDTO(dtoPayload);
      setOpenDialog(false);
      const nuevos = await descargoService.getAll();
      setDescargos(nuevos);
    } catch (err) {
      setError("Error al guardar el descargo");
      console.error(err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Descargos
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
      >
        Nuevo Descargo
      </Button>
      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {descargos.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.fecha}</TableCell>
                <TableCell>{d.paciente?.nombre}</TableCell>
                <TableCell>{d.motivo}</TableCell>
                <TableCell>{d.responsable}</TableCell>
                <TableCell>{d.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nuevo Descargo</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Paciente</InputLabel>
              <Select
                value={formData.paciente}
                onChange={(e) =>
                  setFormData({ ...formData, paciente: e.target.value })
                }
                required
              >
                {pacientes.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Motivo"
              fullWidth
              margin="normal"
              value={formData.motivo}
              onChange={(e) =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              required
            />
            <TextField
              label="Responsable"
              fullWidth
              margin="normal"
              value={formData.responsable}
              onChange={(e) =>
                setFormData({ ...formData, responsable: e.target.value })
              }
              required
            />

            <Box mt={3}>
              <Typography variant="h6">Servicios</Typography>
              <Box display="flex" gap={2} alignItems="center" my={2}>
                <Select
                  value={lineaActual.servicioId}
                  onChange={(e) =>
                    setLineaActual({
                      ...lineaActual,
                      servicioId: e.target.value,
                    })
                  }
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Seleccione un servicio
                  </MenuItem>
                  {servicios.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.descripcion}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  type="number"
                  label="Cantidad"
                  value={lineaActual.cantidad}
                  onChange={(e) =>
                    setLineaActual({
                      ...lineaActual,
                      cantidad: parseInt(e.target.value) || 1,
                    })
                  }
                />
                <Button variant="contained" onClick={handleAddLinea}>
                  Agregar
                </Button>
              </Box>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Servicio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.lineasDescargo.map((linea, index) => {
                    const servicio = servicios.find(
                      (s) => s.id === linea.servicio.id
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>{servicio?.descripcion}</TableCell>
                        <TableCell>{linea.cantidad}</TableCell>
                        <TableCell>${linea.subtotal}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveLinea(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default DescargosPage;
