import { BaseService } from "./BaseService";
import axios from "axios";

const API_URL = "http://localhost:8080";

// Servicios para entidades del sistema
export const pacienteService = new BaseService("pacientes");
export const servicioService = new BaseService("servicios");
export const documentoService = new BaseService("documentos");
export const facturaService = new BaseService("facturas");
export const productoService = new BaseService("productos");
export const lineaDocTransaccionService = new BaseService("lineas");
export const descargoService = new BaseService("descargos");

productoService.createComida = (data) =>
  axios.post(`${API_URL}/api/productos/comida`, data).then((res) => res.data);

productoService.createEstadia = (data) =>
  axios.post(`${API_URL}/api/productos/estadia`, data).then((res) => res.data);

productoService.createMedicamento = (data) =>
  axios
    .post(`${API_URL}/api/productos/medicamento`, data)
    .then((res) => res.data);

// ✅ Actualizar producto de cualquier tipo con ProductoUpdateDTO
productoService.update = (id, data) =>
  axios.put(`${API_URL}/api/productos/${id}`, data).then((res) => res.data);

// ✅ Agregar método personalizado
descargoService.createFromDTO = async (data) => {
  const res = await axios.post(
    `${API_URL}/api/descargos/lineas/descargo`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};
