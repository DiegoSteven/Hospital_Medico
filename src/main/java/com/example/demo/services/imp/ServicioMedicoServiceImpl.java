package com.example.demo.services.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.ServicioMedico;
import com.example.demo.repositories.ServicioMedicoRepository;
import com.example.demo.services.ServicioMedicoService;

@Service
public class ServicioMedicoServiceImpl implements ServicioMedicoService {

    @Autowired
    private ServicioMedicoRepository repository;

    @Override
    public ServicioMedico guardar(ServicioMedico servicio) {
        return repository.save(servicio);
    }

    @Override
    public List<ServicioMedico> listar() {
        return repository.findAll();
    }

    @Override
    public ServicioMedico buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
