package com.example.demo.controllers;

import com.example.demo.models.Factura;
import com.example.demo.services.FacturacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    private final FacturacionService facturacionService;

    public FacturaController(FacturacionService facturacionService) {
        this.facturacionService = facturacionService;
    }

    @PostMapping("/facturar/{descargoId}")
    public ResponseEntity<Factura> facturar(@PathVariable Long descargoId) {
        Factura factura = facturacionService.facturarDescargo(descargoId);
        return ResponseEntity.ok(factura);
    }

    @GetMapping
    public ResponseEntity<List<Factura>> listarFacturas() {
        return ResponseEntity.ok(facturacionService.listarFacturas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Factura> obtenerFacturaPorId(@PathVariable Long id) {
        Optional<Factura> factura = facturacionService.obtenerFacturaPorId(id);
        return factura.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/descargo/{descargoId}")
    public ResponseEntity<Factura> obtenerFacturaPorDescargo(@PathVariable Long descargoId) {
        Optional<Factura> factura = facturacionService.obtenerFacturaPorDescargo(descargoId);
        return factura.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
