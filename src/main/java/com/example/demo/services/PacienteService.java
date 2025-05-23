package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;
import com.example.demo.repositories.PacienteRepository;



@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente crearPaciente(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public List<Paciente> listarPacientes() {
        return pacienteRepository.findAll();
    }

    public Paciente aplicarTratamiento(Integer id, Tratamiento tratamiento) {
        Paciente paciente = pacienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        paciente.aplicarTratamiento(tratamiento);
        return pacienteRepository.save(paciente);
    }
}