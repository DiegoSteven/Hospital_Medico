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
import { productoService } from "../services/api";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    precio: "",
    tipo: "",
    categoria: "",
    fechaInicio: "",
    fechaFin: "",
    caducidad: "",
  });
  const [selectedProducto, setSelectedProducto] = useState(null);

  const tipos = [
    { value: "COMIDA", label: "Comida" },
    { value: "ESTADIA", label: "Estadía" },
    { value: "MEDICAMENTO", label: "Medicamento" },
  ];

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await productoService.getAll();
      setProductos(data);
    } catch (error) {
      setError("Error al cargar productos");
    }
  };

  const handleOpen = (producto = null) => {
    if (producto) {
      setSelectedProducto(producto);
      const tipo = producto.categoria
        ? "COMIDA"
        : producto.fechaInicio
        ? "ESTADIA"
        : "MEDICAMENTO";

      setFormData({
        descripcion: producto.descripcion || "",
        precio: producto.precio || "",
        tipo,
        categoria: producto.categoria || "",
        fechaInicio: producto.fechaInicio || "",
        fechaFin: producto.fechaFin || "",
        caducidad: producto.caducidad || "",
      });
    } else {
      setSelectedProducto(null);
      setFormData({
        descripcion: "",
        precio: "",
        tipo: "",
        categoria: "",
        fechaInicio: "",
        fechaFin: "",
        caducidad: "",
      });
    }
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProducto(null);
    setFormData({
      descripcion: "",
      precio: "",
      tipo: "",
      categoria: "",
      fechaInicio: "",
      fechaFin: "",
      caducidad: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        tipo,
        descripcion,
        precio,
        categoria,
        fechaInicio,
        fechaFin,
        caducidad,
      } = formData;

      let dataToSend = {
        tipo,
        descripcion,
        precio: parseFloat(precio),
        categoria: categoria || null,
        fechaInicio: fechaInicio || null,
        fechaFin: fechaFin || null,
        caducidad: caducidad || null,
      };

      if (selectedProducto) {
        await productoService.update(selectedProducto.id, dataToSend);
      } else {
        await productoService.create(dataToSend);
      }

      handleClose();
      cargarProductos();
    } catch (error) {
      console.error(error);
      setError("Error al guardar el producto");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      try {
        await productoService.delete(id);
        cargarProductos();
      } catch (error) {
        setError("Error al eliminar producto");
      }
    }
  };

  const renderCamposEspecificos = () => {
    switch (formData.tipo) {
      case "COMIDA":
        return (
          <TextField
            name="categoria"
            label="Categoría"
            value={formData.categoria}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        );
      case "ESTADIA":
        return (
          <>
            <TextField
              name="fechaInicio"
              label="Fecha Inicio"
              type="date"
              value={formData.fechaInicio}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              name="fechaFin"
              label="Fecha Fin"
              type="date"
              value={formData.fechaFin}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          </>
        );
      case "MEDICAMENTO":
        return (
          <TextField
            name="caducidad"
            label="Caducidad"
            type="date"
            value={formData.caducidad}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Productos
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
      >
        Nuevo Producto
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.descripcion}</TableCell>
                <TableCell>{prod.precio}</TableCell>
                <TableCell>
                  {prod.categoria && `Categoría: ${prod.categoria}`}
                  {prod.fechaInicio &&
                    `Desde: ${prod.fechaInicio} hasta ${prod.fechaFin}`}
                  {prod.caducidad && `Caduca: ${prod.caducidad}`}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(prod)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(prod.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProducto ? "Editar Producto" : "Nuevo Producto"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="precio"
              label="Precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="tipo"
              label="Tipo de Producto"
              select
              value={formData.tipo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              {tipos.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
            {renderCamposEspecificos()}
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

export default ProductosPage;
