import { BaseService } from './BaseService';

// Servicios para entidades del sistema
export const pacienteService = new BaseService('pacientes');
export const servicioService = new BaseService('servicios');
export const documentoService = new BaseService('documentos');
export const facturaService = new BaseService('facturas');
export const descargoService = new BaseService('descargos');
export const productoService = new BaseService('productos');
export const lineaDocTransaccionService = new BaseService('lineas');
