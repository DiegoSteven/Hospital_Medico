import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import { facturaService, descargoService } from '../services/api';

const FacturasPage = () => {
  const [facturas, setFacturas] = useState([]);
  const [descargos, setDescargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDescargo, setSelectedDescargo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [facturasRes, descargosRes] = await Promise.all([
          facturaService.getAll(),
          descargoService.getAll()
        ]);
        setFacturas(facturasRes);
        setDescargos(descargosRes.filter(d => d.estado === 'DESCARGADO'));
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar facturas o descargos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOpenDialog = () => {
    setSelectedDescargo(null);
    setOpenDialog(true);
    setError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDescargo(null);
  };

  const handleFacturar = async () => {
    if (!selectedDescargo) {
      setError('Seleccione un descargo válido');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await facturaService.facturar(selectedDescargo.id);
      const nuevasFacturas = await facturaService.getAll();
      setFacturas(nuevasFacturas);
      setOpenDialog(false);
    } catch (err) {
      console.error('Error al generar factura:', err);
      setError('Error al generar la factura');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Facturas</Typography>

      <Button variant="contained" onClick={handleOpenDialog} startIcon={<ReceiptIcon />}>
        Nueva Factura desde Descargo
      </Button>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell>{factura.id}</TableCell>
                <TableCell>{factura.fecha}</TableCell>
                <TableCell>{factura.descargo?.paciente?.nombre}</TableCell>
                <TableCell>${factura.valor_total}</TableCell>
                <TableCell>{factura.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Seleccionar Descargo para Factura</DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {descargos.map((descargo) => (
                <TableRow key={descargo.id}>
                  <TableCell>{descargo.id}</TableCell>
                  <TableCell>{descargo.fecha}</TableCell>
                  <TableCell>{descargo.paciente?.nombre}</TableCell>
                  <TableCell>{descargo.motivo}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedDescargo(descargo)}
                      disabled={selectedDescargo?.id === descargo.id}
                    >
                      {selectedDescargo?.id === descargo.id ? 'Seleccionado' : 'Seleccionar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleFacturar}
            disabled={!selectedDescargo}
          >
            Generar Factura
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacturasPage;