package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.ServicioMedico;
import com.example.demo.services.ServicioMedicoService;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/servicios")
public class ServicioMedicoController {

    @Autowired
    private ServicioMedicoService service;

    @PostMapping
    public ServicioMedico crear(@RequestBody ServicioMedico servicio) {
        return service.guardar(servicio);
    }

    @GetMapping
    public List<ServicioMedico> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ServicioMedico obtener(@PathVariable Integer id) {
        return service.obtenerPorId(id);
    }


}