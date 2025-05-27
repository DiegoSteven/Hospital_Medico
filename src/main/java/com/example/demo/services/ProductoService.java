package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.DTO.ProductoDTO;
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

    @Autowired
    private ProductoRepository productoRepo;
    @Autowired
    private ComidaRepository comidaRepo;
    @Autowired
    private EstadiaRepository estadiaRepo;
    @Autowired
    private MedicamentoRepository medicamentoRepo;

    public Producto crearDesdeDTO(ProductoDTO dto) {
        switch (dto.getTipo().toUpperCase()) {
            case "COMIDA":
                Comida comida = new Comida();
                comida.setDescripcion(dto.getDescripcion());
                comida.setPrecio(dto.getPrecio());
                comida.setCategoria(dto.getCategoria());
                return comidaRepo.save(comida);

            case "ESTADIA":
                Estadia estadia = new Estadia();
                estadia.setDescripcion(dto.getDescripcion());
                estadia.setPrecio(dto.getPrecio());
                estadia.setFechaInicio(dto.getFechaInicio());
                estadia.setFechaFin(dto.getFechaFin());
                return estadiaRepo.save(estadia);

            case "MEDICAMENTO":
                Medicamento medicamento = new Medicamento();
                medicamento.setDescripcion(dto.getDescripcion());
                medicamento.setPrecio(dto.getPrecio());
                medicamento.setCaducidad(dto.getCaducidad());
                return medicamentoRepo.save(medicamento);

            default:
                throw new IllegalArgumentException("Tipo de producto no válido: " + dto.getTipo());
        }
    }

    public List<Producto> listar() {
        return productoRepo.findAll();
    }

    public Producto buscarPorId(Integer id) {
        return productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public Optional<Producto> actualizarProducto(Integer id, ProductoDTO dto) {
        return productoRepo.findById(id).map(productoExistente -> {
            productoExistente.setDescripcion(dto.getDescripcion());
            productoExistente.setPrecio(dto.getPrecio());

            if (productoExistente instanceof Comida && "COMIDA".equalsIgnoreCase(dto.getTipo())) {
                Comida comida = (Comida) productoExistente;
                comida.setCategoria(dto.getCategoria());
                return comidaRepo.save(comida);
            } else if (productoExistente instanceof Estadia && "ESTADIA".equalsIgnoreCase(dto.getTipo())) {
                Estadia estadia = (Estadia) productoExistente;
                estadia.setFechaInicio(dto.getFechaInicio());
                estadia.setFechaFin(dto.getFechaFin());
                return estadiaRepo.save(estadia);
            } else if (productoExistente instanceof Medicamento && "MEDICAMENTO".equalsIgnoreCase(dto.getTipo())) {
                Medicamento medicamento = (Medicamento) productoExistente;
                medicamento.setCaducidad(dto.getCaducidad());
                return medicamentoRepo.save(medicamento);
            }

            return productoRepo.save(productoExistente);
        });
    }

    public void eliminar(Integer id) {
        if (!productoRepo.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productoRepo.deleteById(id);
    }
}
