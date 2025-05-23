import axios from 'axios';

const API_URL = 'http://localhost:5000';

export class BaseService {
  constructor(endpoint) {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.endpoint = endpoint;

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Error en la petición:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async getAll() {
    return this.api.get(`/api/${this.endpoint}`);
  }

  async getById(id) {
    return this.api.get(`/api/${this.endpoint}/${id}`);
  }

  async create(data) {
    return this.api.post(`/api/${this.endpoint}`, data);
  }

  async update(id, data) {
    return this.api.put(`/api/${this.endpoint}/${id}`, data);
  }

  async delete(id) {
    return this.api.delete(`/api/${this.endpoint}/${id}`);
  }
} 