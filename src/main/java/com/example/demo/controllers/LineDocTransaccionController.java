package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.DTO.DocumentoTransaccionDTO;
import com.DTO.LineDocTransaccionDTO;
import com.example.demo.models.Descargo;
import com.example.demo.models.lineas.LineDocTransaccion;
import com.example.demo.services.LineDocTransaccionService;

@RestController
@RequestMapping("/api/lineas")
public class LineDocTransaccionController {

    @Autowired
    private LineDocTransaccionService service;

    // Crear una sola línea suelta
    @PostMapping
    public LineDocTransaccion crear(@RequestBody LineDocTransaccionDTO dto) {
        return service.guardarDesdeDTO(dto);
    }

    // Crear un Descargo con líneas desde DTO
    @PostMapping("/descargo")
    public Descargo crearDescargo(@RequestBody DocumentoTransaccionDTO dto) {
        return service.guardarDescargoDesdeDTO(dto);
    }

    // Listar líneas
    @GetMapping
    public List<LineDocTransaccion> listar() {
        return service.listar();
    }

    // Obtener una línea por ID
    @GetMapping("/{id}")
    public LineDocTransaccion obtener(@PathVariable Integer id) {
        return service.obtenerPorId(id);
    }
}
