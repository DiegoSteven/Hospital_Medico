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
  productoService,
} from "../services/api";

console.log("Métodos de descargoService:", descargoService);

const DescargosPage = () => {
  const [descargos, setDescargos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    motivo: "",
    responsable: "",
    pacienteId: "",
    lineasDescargo: [],
  });
  const [lineaActual, setLineaActual] = useState({
    tipo: "servicio", // o "producto"
    id: "",
    cantidad: 1,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [d, p, s, prod] = await Promise.all([
          descargoService.getAll(),
          pacienteService.getAll(),
          servicioService.getAll(),
          productoService.getAll(),
        ]);
        setDescargos(d);
        setPacientes(p);
        setServicios(s);
        setProductos(prod);
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
    if (!lineaActual.id || lineaActual.cantidad <= 0) return;

    let subtotal = 0;
    if (lineaActual.tipo === "servicio") {
      const servicio = servicios.find((s) => s.id === lineaActual.id);
      if (!servicio) return;
      subtotal = servicio.costo * lineaActual.cantidad;
    } else {
      const producto = productos.find((p) => p.id === lineaActual.id);
      if (!producto) return;
      subtotal = producto.precio * lineaActual.cantidad;
    }

    setFormData((prev) => ({
      ...prev,
      lineasDescargo: [
        ...prev.lineasDescargo,
        {
          [lineaActual.tipo === "servicio" ? "servicioId" : "productoId"]: lineaActual.id,
          cantidad: lineaActual.cantidad,
          subtotal,
        },
      ],
    }));
    setLineaActual({ tipo: "servicio", id: "", cantidad: 1 });
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
        fecha: formData.fecha,
        pacienteId: formData.pacienteId,
        motivo: formData.motivo,
        responsable: formData.responsable,
        lineasDescargo: formData.lineasDescargo,
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
                value={formData.pacienteId}
                onChange={(e) =>
                  setFormData({ ...formData, pacienteId: e.target.value })
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
              <Typography variant="h6">Servicios y Productos</Typography>
              <Box display="flex" gap={2} alignItems="center" my={2}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={lineaActual.tipo}
                    onChange={(e) =>
                      setLineaActual({
                        ...lineaActual,
                        tipo: e.target.value,
                        id: "",
                      })
                    }
                  >
                    <MenuItem value="servicio">Servicio</MenuItem>
                    <MenuItem value="producto">Producto</MenuItem>
                  </Select>
                </FormControl>
                <Select
                  value={lineaActual.id}
                  onChange={(e) =>
                    setLineaActual({
                      ...lineaActual,
                      id: e.target.value,
                    })
                  }
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Seleccione un {lineaActual.tipo}
                  </MenuItem>
                  {lineaActual.tipo === "servicio"
                    ? servicios.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.descripcion} - ${s.costo}
                        </MenuItem>
                      ))
                    : productos.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.descripcion} - ${p.precio}
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
                    <TableCell>Tipo</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.lineasDescargo.map((linea, index) => {
                    const item = linea.servicioId
                      ? servicios.find((s) => s.id === linea.servicioId)
                      : productos.find((p) => p.id === linea.productoId);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {linea.servicioId ? "Servicio" : "Producto"}
                        </TableCell>
                        <TableCell>{item?.descripcion}</TableCell>
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
