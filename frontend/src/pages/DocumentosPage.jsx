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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Receipt as ReceiptIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { documentoService, pacienteService, servicioService } from '../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DocumentosPage = () => {
  const [documentos, setDocumentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    valor_total: 0,
    estado: 'borrador',
    paciente_id: '',
    lineas: [],
  });
  const [lineaActual, setLineaActual] = useState({
    servicio_id: '',
    cantidad: 1,
    precio_unitario: 0,
    subtotal: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [documentosRes, pacientesRes, serviciosRes] = await Promise.all([
        documentoService.getAll(),
        pacienteService.getAll(),
        servicioService.getAll(),
      ]);
      setDocumentos(documentosRes.data);
      setPacientes(pacientesRes.data);
      setServicios(serviciosRes.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (documento = null) => {
    if (documento) {
      setSelectedDocumento(documento);
      setFormData({
        ...documento,
        fecha: format(new Date(documento.fecha), 'yyyy-MM-dd'),
      });
    } else {
      setSelectedDocumento(null);
      setFormData({
        numero: '',
        fecha: format(new Date(), 'yyyy-MM-dd'),
        valor_total: 0,
        estado: 'borrador',
        paciente_id: '',
        lineas: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocumento(null);
    setFormData({
      numero: '',
      fecha: format(new Date(), 'yyyy-MM-dd'),
      valor_total: 0,
      estado: 'borrador',
      paciente_id: '',
      lineas: [],
    });
    setLineaActual({
      servicio_id: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
    });
  };

  const handleAddLinea = () => {
    if (!lineaActual.servicio_id || !lineaActual.cantidad || !lineaActual.precio_unitario) {
      setError('Por favor complete todos los campos de la línea');
      return;
    }

    const subtotal = lineaActual.cantidad * lineaActual.precio_unitario;
    const nuevaLinea = {
      ...lineaActual,
      subtotal,
    };

    setFormData({
      ...formData,
      lineas: [...formData.lineas, nuevaLinea],
      valor_total: formData.valor_total + subtotal,
    });

    setLineaActual({
      servicio_id: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
    });
  };

  const handleRemoveLinea = (index) => {
    const lineas = [...formData.lineas];
    const subtotalRemovido = lineas[index].subtotal;
    lineas.splice(index, 1);
    setFormData({
      ...formData,
      lineas,
      valor_total: formData.valor_total - subtotalRemovido,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDocumento) {
        await documentoService.update(selectedDocumento.id, formData);
      } else {
        await documentoService.create(formData);
      }
      handleCloseDialog();
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el documento');
      console.error(err);
    }
  };

  const handleClonarAFactura = async (id) => {
    try {
      await documentoService.clonarAFactura(id);
      loadData();
    } catch (err) {
      setError('Error al clonar a factura');
      console.error(err);
    }
  };

  const handleClonarADescargo = async (id) => {
    try {
      await documentoService.clonarADescargo(id);
      loadData();
    } catch (err) {
      setError('Error al clonar a descargo');
      console.error(err);
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
        <Typography variant="h4">Documentos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Documento
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
              <TableCell>Número</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentos.map((documento) => (
              <TableRow key={documento.id}>
                <TableCell>{documento.numero}</TableCell>
                <TableCell>
                  {format(new Date(documento.fecha), 'dd/MM/yyyy', { locale: es })}
                </TableCell>
                <TableCell>
                  {pacientes.find(p => p.id === documento.paciente_id)?.nombre || '-'}
                </TableCell>
                <TableCell>{documento.estado}</TableCell>
                <TableCell>€{documento.valor_total}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(documento)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleClonarAFactura(documento.id)}
                  >
                    <ReceiptIcon />
                  </IconButton>
                  <IconButton
                    color="warning"
                    onClick={() => handleClonarADescargo(documento.id)}
                  >
                    <CancelIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedDocumento ? 'Editar Documento' : 'Nuevo Documento'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Número"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  required
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Paciente</InputLabel>
                  <Select
                    value={formData.paciente_id}
                    onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
                    label="Paciente"
                    required
                  >
                    {pacientes.map((paciente) => (
                      <MenuItem key={paciente.id} value={paciente.id}>
                        {`${paciente.nombre} ${paciente.apellido}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Líneas del Documento
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <FormControl fullWidth>
                    <InputLabel>Servicio</InputLabel>
                    <Select
                      value={lineaActual.servicio_id}
                      onChange={(e) => {
                        const servicio = servicios.find(s => s.id === e.target.value);
                        setLineaActual({
                          ...lineaActual,
                          servicio_id: e.target.value,
                          precio_unitario: servicio?.precio || 0,
                        });
                      }}
                      label="Servicio"
                    >
                      {servicios.map((servicio) => (
                        <MenuItem key={servicio.id} value={servicio.id}>
                          {servicio.descripcion} - €{servicio.precio}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={lineaActual.cantidad}
                    onChange={(e) => {
                      const cantidad = parseInt(e.target.value) || 0;
                      setLineaActual({
                        ...lineaActual,
                        cantidad,
                        subtotal: cantidad * lineaActual.precio_unitario,
                      });
                    }}
                    fullWidth
                  />
                  <TextField
                    label="Precio Unitario"
                    type="number"
                    value={lineaActual.precio_unitario}
                    onChange={(e) => {
                      const precio = parseFloat(e.target.value) || 0;
                      setLineaActual({
                        ...lineaActual,
                        precio_unitario: precio,
                        subtotal: lineaActual.cantidad * precio,
                      });
                    }}
                    fullWidth
                    InputProps={{
                      startAdornment: '€',
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddLinea}
                  >
                    Agregar
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Servicio</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Precio Unitario</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.lineas.map((linea, index) => {
                        const servicio = servicios.find(s => s.id === linea.servicio_id);
                        return (
                          <TableRow key={index}>
                            <TableCell>{servicio?.descripcion}</TableCell>
                            <TableCell>{linea.cantidad}</TableCell>
                            <TableCell>€{linea.precio_unitario}</TableCell>
                            <TableCell>€{linea.subtotal}</TableCell>
                            <TableCell>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleRemoveLinea(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="right">
                  Total: €{formData.valor_total}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedDocumento ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default DocumentosPage; 