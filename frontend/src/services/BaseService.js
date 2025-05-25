import axios from 'axios';

const API_URL = 'http://localhost:8080';

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
    const res = await this.api.get(`/api/${this.endpoint}`);
    return res.data;
  }

  async getById(id) {
    const res = await this.api.get(`/api/${this.endpoint}/${id}`);
    return res.data;
  }

  async create(data) {
    const res = await this.api.post(`/api/${this.endpoint}`, data);
    return res.data;
  }

  async update(id, data) {
    const res = await this.api.put(`/api/${this.endpoint}/${id}`, data);
    return res.data;
  }

  async delete(id) {
    const res = await this.api.delete(`/api/${this.endpoint}/${id}`);
    return res.data;
  }
}
