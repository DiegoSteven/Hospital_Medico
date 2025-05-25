package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.DTO.DocumentoTransaccionDTO;
import com.DTO.LineDocTransaccionDTO;
import com.example.demo.models.Descargo;
import com.example.demo.models.Producto;
import com.example.demo.models.ServicioMedico;
import com.example.demo.models.lineas.DocumentoTransaccion;
import com.example.demo.models.lineas.LineDocTransaccion;
import com.example.demo.models.lineas.LineaDescargo;
import com.example.demo.repositories.DescargoRepository;
import com.example.demo.repositories.DocumentoTransaccionRepository;
import com.example.demo.repositories.LineDocTransaccionRepository;
import com.example.demo.repositories.ProductoRepository;
import com.example.demo.repositories.ServicioMedicoRepository;

@Service
public class LineDocTransaccionService {

    private final LineDocTransaccionRepository lineaRepository;
    private final ServicioMedicoRepository servicioRepository;
    private final ProductoRepository productoRepository;
    private final DocumentoTransaccionRepository documentoRepository;
    private final DescargoRepository descargoRepository;

    public LineDocTransaccionService(
            LineDocTransaccionRepository lineaRepository,
            ServicioMedicoRepository servicioRepository,
            ProductoRepository productoRepository,
            DocumentoTransaccionRepository documentoRepository,
            DescargoRepository descargoRepository) {
        this.lineaRepository = lineaRepository;
        this.servicioRepository = servicioRepository;
        this.productoRepository = productoRepository;
        this.documentoRepository = documentoRepository;
        this.descargoRepository = descargoRepository;
    }

    // ✅ Guardar UNA sola línea desde DTO
    public LineDocTransaccion guardarDesdeDTO(LineDocTransaccionDTO dto) {
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

        LineDocTransaccion linea = new LineDocTransaccion();
        linea.setServicio(servicio);
        linea.setProducto(producto);
        linea.setCantidad(dto.getCantidad());

        return lineaRepository.save(linea);
    }

    public Descargo guardarDescargoDesdeDTO(DocumentoTransaccionDTO dto) {
        Descargo descargo = new Descargo();
        descargo.setFecha(dto.getFecha());
        descargo.setMotivo(dto.getMotivo());
        descargo.setResponsable(dto.getResponsable());
        descargo.setEstado(dto.getEstado());

        List<LineaDescargo> lineas = new ArrayList<>();

        for (LineDocTransaccionDTO lineaDto : dto.getLineas()) {
            if (lineaDto.getProductoId() == null && lineaDto.getServicioId() == null) {
                throw new RuntimeException("Cada línea debe contener al menos productoId o servicioId");
            }

            // Crear transacción base
            LineDocTransaccion lineDoc = new LineDocTransaccion();

            if (lineaDto.getProductoId() != null) {
                Producto producto = productoRepository.findById(lineaDto.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + lineaDto.getProductoId()));
                lineDoc.setProducto(producto);
            }

            if (lineaDto.getServicioId() != null) {
                ServicioMedico servicio = servicioRepository.findById(lineaDto.getServicioId())
                        .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + lineaDto.getServicioId()));
                lineDoc.setServicio(servicio);
            }

            lineDoc.setCantidad(lineaDto.getCantidad() != null ? lineaDto.getCantidad() : 1);
            lineDoc.setPrecioUnitario(lineaDto.getPrecioUnitario() != null
                    ? lineaDto.getPrecioUnitario()
                    : (lineDoc.getServicio() != null
                        ? lineDoc.getServicio().getCosto()
                        : lineDoc.getProducto().getPrecio()));

            lineDoc = lineaRepository.save(lineDoc);

            // Componer la línea con la transacción
            LineaDescargo linea = new LineaDescargo();
            linea.setLineDocTransaccion(lineDoc);
            linea.setDescargo(descargo);

            lineas.add(linea);
        }

        descargo.setLineasDescargo(lineas);
        return descargoRepository.save(descargo);
    }
    
    
    // Métodos auxiliares
    public List<LineDocTransaccion> listar() {
        return lineaRepository.findAll();
    }

    public List<DocumentoTransaccion> listarDocumentos() {
        return documentoRepository.findAll();
    }

    public LineDocTransaccion obtenerPorId(Integer id) {
        return lineaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Línea no encontrada"));
    }
}