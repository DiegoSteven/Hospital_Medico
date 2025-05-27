package com.example.demo.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.ServicioMedico;
import com.example.demo.services.ServicioMedicoService;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*") // útil para pruebas locales con frontend
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
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public ServicioMedico actualizar(@PathVariable Integer id, @RequestBody ServicioMedico servicio) {
        servicio.setId(id);
        return service.guardar(servicio);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
