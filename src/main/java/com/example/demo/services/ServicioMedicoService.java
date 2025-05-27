package com.example.demo.services;

import java.util.List;
import com.example.demo.models.ServicioMedico;

public interface ServicioMedicoService {
    ServicioMedico guardar(ServicioMedico servicio);
    List<ServicioMedico> listar();
    ServicioMedico buscarPorId(Integer id);
    void eliminar(Integer id);
}
