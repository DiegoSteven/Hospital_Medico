import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Configuración base de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

// Servicios para Pacientes
export const pacienteService = {
  getAll: () => api.get('/api/pacientes').then(res => res.data),
  getById: (id) => api.get(`/api/pacientes/${id}`).then(res => res.data),
  create: (data) => api.post('/api/pacientes', data).then(res => res.data),
  update: (id, data) => api.put(`/api/pacientes/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/api/pacientes/${id}`).then(res => res.data)
};

// Servicios para Servicios Médicos
export const servicioService = {
  getAll: () => api.get('/api/servicios').then(res => res.data),
  getById: (id) => api.get(`/api/servicios/${id}`).then(res => res.data),
  create: (data) => api.post('/api/servicios', data).then(res => res.data),
  getByTipo: (tipo) => api.get(`/api/servicios/tipo/${tipo}`).then(res => res.data),
  getAtencionesMedicas: () => api.get('/api/servicios/tipo/atencion_medica').then(res => res.data),
  getExamenesLaboratorio: () => api.get('/api/servicios/tipo/examen_laboratorio').then(res => res.data),
  getImagenesRadiologicas: () => api.get('/api/servicios/tipo/imagen_radiologica').then(res => res.data),
  getSuministrosMedicamentos: () => api.get('/api/servicios/tipo/suministro_medicamento').then(res => res.data),
  getProcedimientos: () => api.get('/api/servicios/tipo/procedimiento').then(res => res.data)
};

// Servicios para Documentos
export const documentoService = {
  getAll: () => api.get('/api/documentos').then(res => res.data),
  getById: (id) => api.get(`/api/documentos/${id}`).then(res => res.data),
  create: (data) => api.post('/api/documentos', data).then(res => res.data),
  agregarLinea: (docId, data) => api.post(`/api/documentos/${docId}/lineas`, data).then(res => res.data),
  clonarAFactura: (docId) => api.post(`/api/documentos/${docId}/clonar/factura`).then(res => res.data),
  clonarADescargo: (docId) => api.post(`/api/documentos/${docId}/clonar/descargo`).then(res => res.data)
};

// Servicios para Facturas
export const facturaService = {
  getAll: () => api.get('/api/facturas').then(res => res.data),
  getById: (id) => api.get(`/api/facturas/${id}`).then(res => res.data)
};

// Servicios para Descargos
export const descargoService = {
  getAll: () => api.get('/api/descargos').then(res => res.data),
  getById: (id) => api.get(`/api/descargos/${id}`).then(res => res.data)
}; 