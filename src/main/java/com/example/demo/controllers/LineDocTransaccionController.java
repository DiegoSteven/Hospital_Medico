package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.DTO.DocumentoTransaccionDTO;
import com.DTO.LineDocTransaccionDTO;
import com.example.demo.models.Lineas.DocumentoTransaccion;
import com.example.demo.models.Lineas.LineDocTransaccion;
import com.example.demo.services.LineDocTransaccionService;

@RestController
@RequestMapping("/api/lineas")
public class LineDocTransaccionController {

    @Autowired
    private LineDocTransaccionService service;

    @PostMapping
    public LineDocTransaccion crear(@RequestBody LineDocTransaccionDTO dto) {
        return service.guardarDesdeDTO(dto);
    }

    @PostMapping("/documento")
    public DocumentoTransaccion crearDocumento(@RequestBody DocumentoTransaccionDTO dto) {
        return service.guardarDocumentoDesdeDTO(dto);
    }
    @GetMapping("/documento")
public List<DocumentoTransaccion> listarDocumentos() {
    return service.listarDocumentos();
}


    @GetMapping
    public List<LineDocTransaccion> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public LineDocTransaccion obtener(@PathVariable Integer id) {
        return service.obtenerPorId(id);
    }
}