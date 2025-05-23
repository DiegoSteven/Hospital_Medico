package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;
import com.example.demo.services.PacienteService;



@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PostMapping
    public Paciente crear(@RequestBody Paciente paciente) {
        return pacienteService.crearPaciente(paciente);
    }

    @GetMapping
    public List<Paciente> listar() {
        return pacienteService.listarPacientes();
    }

    @PutMapping("/{id}/tratamiento")
    public Paciente aplicarTratamiento(@PathVariable Integer id, @RequestBody Tratamiento tratamiento) {
        return pacienteService.aplicarTratamiento(id, tratamiento);
    }
}