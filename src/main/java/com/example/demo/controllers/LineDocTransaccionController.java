package com.example.demo.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.DTO.DocumentoTransaccionDTO;
import com.DTO.LineDocTransaccionDTO;
import com.example.demo.models.Descargo;
import com.example.demo.models.lineas.LineaDescargo;
import com.example.demo.services.LineDocTransaccionService;

@RestController
@RequestMapping("/api/lineas")
public class LineDocTransaccionController {

    @Autowired
    private LineDocTransaccionService service;

    // ✅ Crear una sola línea de descargo desde DTO
    @PostMapping
    public ResponseEntity<LineaDescargo> crearLinea(@RequestBody @Valid LineDocTransaccionDTO dto) {
        LineaDescargo linea = service.guardarDesdeDTO(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(linea);
    }

    // ✅ Crear un Descargo completo con sus líneas
    @PostMapping("/descargo")
    public ResponseEntity<Descargo> crearDescargo(@RequestBody @Valid DocumentoTransaccionDTO dto) {
        Descargo nuevo = service.guardarDescargoDesdeDTO(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // ✅ Listar todas las líneas de descargo
    @GetMapping
    public ResponseEntity<List<LineaDescargo>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    // ✅ Obtener una línea específica por ID
    @GetMapping("/{id}")
    public ResponseEntity<LineaDescargo> obtener(@PathVariable Integer id) {
        LineaDescargo linea = service.obtenerPorId(id);
        return ResponseEntity.ok(linea);
    }
}
