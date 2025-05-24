package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Producto;
import com.example.demo.models.productos.Comida;
import com.example.demo.models.productos.Estadia;
import com.example.demo.models.productos.Medicamento;
import com.example.demo.repositories.ProductoRepository;
import com.example.demo.repositories.tipoProducto.ComidaRepository;
import com.example.demo.repositories.tipoProducto.EstadiaRepository;
import com.example.demo.repositories.tipoProducto.MedicamentoRepository;

@Service
public class ProductoService {

    @Autowired private ProductoRepository productoRepo;
    @Autowired private ComidaRepository comidaRepo;
    @Autowired private EstadiaRepository estadiaRepo;
    @Autowired private MedicamentoRepository medicamentoRepo;

    public Producto guardar(Producto producto) {
        return productoRepo.save(producto);
    }

    public List<Producto> listar() {
        return productoRepo.findAll();
    }

    public Comida guardarComida(Comida comida) {
        return comidaRepo.save(comida);
    }

    public Estadia guardarEstadia(Estadia estadia) {
        return estadiaRepo.save(estadia);
    }

    public Medicamento guardarMedicamento(Medicamento medicamento) {
        return medicamentoRepo.save(medicamento);
    }
}