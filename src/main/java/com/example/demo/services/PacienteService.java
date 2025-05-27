package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

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

    public Paciente buscarPorId(Integer id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
    }

    public Paciente aplicarTratamiento(Integer id, Tratamiento tratamiento) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        paciente.aplicarTratamiento(tratamiento);
        return pacienteRepository.save(paciente);
    }

    public Paciente actualizarPaciente(Integer id, Paciente pacienteActualizado) {
        Paciente existente = buscarPorId(id);
        existente.setNombre(pacienteActualizado.getNombre());
        existente.setDireccion(pacienteActualizado.getDireccion());
        existente.setTelefono(pacienteActualizado.getTelefono());
        existente.setCorreo(pacienteActualizado.getCorreo());
        return pacienteRepository.save(existente);
    }

    public void eliminarPaciente(Integer id) {
        if (!pacienteRepository.existsById(id)) {
            throw new RuntimeException("Paciente no encontrado");
        }
        pacienteRepository.deleteById(id);
    }

}