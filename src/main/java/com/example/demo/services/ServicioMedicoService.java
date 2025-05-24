package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.ServicioMedico;
import com.example.demo.repositories.ServicioMedicoRepository;

@Service
public class ServicioMedicoService {

    @Autowired
    private ServicioMedicoRepository repository;

    public ServicioMedico guardar(ServicioMedico servicio) {
        return repository.save(servicio);
    }

    public List<ServicioMedico> listar() {
        return repository.findAll();
    }

    public ServicioMedico obtenerPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }
}
