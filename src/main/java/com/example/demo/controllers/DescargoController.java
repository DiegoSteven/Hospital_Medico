package com.example.demo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Descargo;
import com.example.demo.services.DescargoService;
import com.DTO.DescargoRequestDTO;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/descargos")
public class DescargoController {

    private final DescargoService descargoService;

    @PostMapping("/lineas/descargo")
    public ResponseEntity<Descargo> crearDesdeDTO(@RequestBody DescargoRequestDTO dto) {
        Descargo nuevo = descargoService.crearDesdeDTO(dto);
        return ResponseEntity.ok(nuevo);
    }

    public DescargoController(DescargoService descargoService) {
        this.descargoService = descargoService;
    }

    @GetMapping
    public ResponseEntity<List<Descargo>> obtenerTodos() {
        return ResponseEntity.ok(descargoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Descargo> obtenerPorId(@PathVariable Long id) {
        return descargoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Descargo> actualizarDescargo(@PathVariable Long id,
            @RequestBody Descargo descargoActualizado) {
        return descargoService.actualizarDescargo(id, descargoActualizado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDescargo(@PathVariable Long id) {
        if (descargoService.eliminarDescargo(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
