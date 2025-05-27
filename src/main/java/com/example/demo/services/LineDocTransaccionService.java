package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.DTO.DocumentoTransaccionDTO;
import com.DTO.LineDocTransaccionDTO;
import com.example.demo.models.Descargo;
import com.example.demo.models.Producto;
import com.example.demo.models.ServicioMedico;
import com.example.demo.models.lineas.LineaDescargo;
import com.example.demo.repositories.DescargoRepository;
import com.example.demo.repositories.LineaDescargoRepository;
import com.example.demo.repositories.ProductoRepository;
import com.example.demo.repositories.ServicioMedicoRepository;

@Service
public class LineDocTransaccionService {

    private final LineaDescargoRepository lineaDescargoRepository;
    private final ServicioMedicoRepository servicioRepository;
    private final ProductoRepository productoRepository;
    private final DescargoRepository descargoRepository;

    public LineDocTransaccionService(
            LineaDescargoRepository lineaDescargoRepository,
            ServicioMedicoRepository servicioRepository,
            ProductoRepository productoRepository,
            DescargoRepository descargoRepository) {
        this.lineaDescargoRepository = lineaDescargoRepository;
        this.servicioRepository = servicioRepository;
        this.productoRepository = productoRepository;
        this.descargoRepository = descargoRepository;
    }

    // ✅ Guardar UNA sola línea de descargo desde DTO
    public LineaDescargo guardarDesdeDTO(LineDocTransaccionDTO dto) {
        ServicioMedico servicio = null;
        if (dto.getServicioId() != null) {
            servicio = servicioRepository.findById(dto.getServicioId())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        }

        Producto producto = null;
        if (dto.getProductoId() != null) {
            producto = productoRepository.findById(dto.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        }

        if ((producto != null && servicio != null) || (producto == null && servicio == null)) {
            throw new RuntimeException("Debe especificarse solo un producto o solo un servicio.");
        }

        LineaDescargo linea = new LineaDescargo();
        linea.setServicio(servicio);
        linea.setProducto(producto);
        linea.setCantidad(dto.getCantidad() != null ? dto.getCantidad() : 1);

        return lineaDescargoRepository.save(linea);
    }

    // ✅ Guardar descargo completo desde DTO
    public Descargo guardarDescargoDesdeDTO(DocumentoTransaccionDTO dto) {
        Descargo descargo = new Descargo();
        descargo.setFecha(dto.getFecha());
        descargo.setMotivo(dto.getMotivo());
        descargo.setResponsable(dto.getResponsable());
        descargo.setEstado(dto.getEstado());

        List<LineaDescargo> lineas = new ArrayList<>();

        for (LineDocTransaccionDTO lineaDto : dto.getLineas()) {
            if ((lineaDto.getProductoId() != null && lineaDto.getServicioId() != null)
                    || (lineaDto.getProductoId() == null && lineaDto.getServicioId() == null)) {
                throw new RuntimeException("Cada línea debe contener solo productoId o solo servicioId");
            }

            LineaDescargo linea = new LineaDescargo();

            if (lineaDto.getProductoId() != null) {
                Producto producto = productoRepository.findById(lineaDto.getProductoId())
                        .orElseThrow(() -> new RuntimeException(
                                "Producto no encontrado con ID: " + lineaDto.getProductoId()));
                linea.setProducto(producto);
            }

            if (lineaDto.getServicioId() != null) {
                ServicioMedico servicio = servicioRepository.findById(lineaDto.getServicioId())
                        .orElseThrow(() -> new RuntimeException(
                                "Servicio no encontrado con ID: " + lineaDto.getServicioId()));
                linea.setServicio(servicio);
            }

            linea.setCantidad(lineaDto.getCantidad() != null ? lineaDto.getCantidad() : 1);
            linea.setDescargo(descargo);

            lineas.add(linea);
        }

        descargo.setLineasDescargo(lineas);
        return descargoRepository.save(descargo);
    }

    // ✅ Métodos auxiliares

    public List<LineaDescargo> listar() {
        return lineaDescargoRepository.findAll();
    }

    public LineaDescargo obtenerPorId(Integer id) {
        return lineaDescargoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Línea no encontrada"));
    }
}
