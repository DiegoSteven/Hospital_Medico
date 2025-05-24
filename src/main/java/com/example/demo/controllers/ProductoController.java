package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Producto;
import com.example.demo.models.productos.Comida;
import com.example.demo.models.productos.Estadia;
import com.example.demo.models.productos.Medicamento;
import com.example.demo.services.ProductoService;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService service;

    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    @PostMapping("/comida")
    public Comida crearComida(@RequestBody Comida comida) {
        return service.guardarComida(comida);
    }

    @PostMapping("/estadia")
    public Estadia crearEstadia(@RequestBody Estadia estadia) {
        return service.guardarEstadia(estadia);
    }

    @PostMapping("/medicamento")
    public Medicamento crearMedicamento(@RequestBody Medicamento medicamento) {
        return service.guardarMedicamento(medicamento);
    }
}