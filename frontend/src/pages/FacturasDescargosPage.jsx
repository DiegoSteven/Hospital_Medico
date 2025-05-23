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
  Alert,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { facturaService, descargoService, documentoService } from '../services/api';

const FacturasDescargosPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [facturas, setFacturas] = useState([]);
  const [descargos, setDescargos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocumento, setSelectedDocumento] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [facturasData, descargosData, documentosData] = await Promise.all([
        facturaService.getAll(),
        descargoService.getAll(),
        documentoService.getAll()
      ]);
      setFacturas(facturasData);
      setDescargos(descargosData);
      setDocumentos(documentosData);
    } catch (error) {
      setError('Error al cargar los datos: ' + error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDocumento(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDocumentoSelect = (documento) => {
    setSelectedDocumento(documento);
  };

  const handleClonar = async () => {
    if (!selectedDocumento) {
      setError('Por favor seleccione un documento');
      return;
    }

    try {
      if (tabValue === 0) {
        await documentoService.clonarAFactura(selectedDocumento.id);
      } else {
        await documentoService.clonarADescargo(selectedDocumento.id);
      }
      handleClose();
      cargarDatos();
    } catch (error) {
      setError('Error al clonar el documento: ' + error);
    }
  };

  const renderTabla = (items, tipo) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Número</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Paciente</TableCell>
            <TableCell>Valor Total</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.numero}</TableCell>
              <TableCell>{new Date(item.fecha).toLocaleDateString()}</TableCell>
              <TableCell>{item.paciente?.nombre} {item.paciente?.apellido}</TableCell>
              <TableCell>${item.valor_total}</TableCell>
              <TableCell>{item.estado}</TableCell>
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
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Facturas y Descargos
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Facturas" />
          <Tab label="Descargos" />
        </Tabs>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        {tabValue === 0 ? 'Nueva Factura' : 'Nuevo Descargo'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {tabValue === 0 ? renderTabla(facturas, 'factura') : renderTabla(descargos, 'descargo')}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {tabValue === 0 ? 'Crear Factura' : 'Crear Descargo'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Seleccione un documento para clonar:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Número</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Paciente</TableCell>
                      <TableCell>Valor Total</TableCell>
                      <TableCell>Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documentos.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.numero}</TableCell>
                        <TableCell>
                          {new Date(doc.fecha).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {doc.paciente?.nombre} {doc.paciente?.apellido}
                        </TableCell>
                        <TableCell>${doc.valor_total}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleDocumentoSelect(doc)}
                            disabled={selectedDocumento?.id === doc.id}
                          >
                            {selectedDocumento?.id === doc.id
                              ? 'Seleccionado'
                              : 'Seleccionar'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleClonar}
            variant="contained"
            color="primary"
            disabled={!selectedDocumento}
          >
            {tabValue === 0 ? 'Crear Factura' : 'Crear Descargo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FacturasDescargosPage; 