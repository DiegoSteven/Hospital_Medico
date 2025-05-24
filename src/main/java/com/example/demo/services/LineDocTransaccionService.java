package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.DTO.DocumentoTransaccionDTO;
import com.DTO.LineDocTransaccionDTO;
import com.example.demo.models.Producto;
import com.example.demo.models.ServicioMedico;
import com.example.demo.models.Lineas.DocumentoTransaccion;
import com.example.demo.models.Lineas.LineDocTransaccion;
import com.example.demo.repositories.DocumentoTransaccionRepository;
import com.example.demo.repositories.LineDocTransaccionRepository;
import com.example.demo.repositories.ProductoRepository;
import com.example.demo.repositories.ServicioMedicoRepository;

@Service
public class LineDocTransaccionService {

    @Autowired
    private LineDocTransaccionRepository lineaRepository;

    @Autowired
    private ServicioMedicoRepository servicioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private DocumentoTransaccionRepository documentoRepository;

    // ✅ Guardar UNA sola línea desde DTO
    public LineDocTransaccion guardarDesdeDTO(LineDocTransaccionDTO dto) {
        ServicioMedico servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        LineDocTransaccion linea = new LineDocTransaccion();
        linea.setServicio(servicio);
        linea.setProducto(producto);
        linea.setCantidad(dto.getCantidad());

        return lineaRepository.save(linea);
    }

    // ✅ Guardar un DOCUMENTO completo con varias líneas
    public DocumentoTransaccion guardarDocumentoDesdeDTO(DocumentoTransaccionDTO dto) {
        DocumentoTransaccion doc = new DocumentoTransaccion();
        doc.setFecha(dto.getFecha());

        List<LineDocTransaccion> lineas = new ArrayList<>();

        for (LineDocTransaccionDTO lineaDto : dto.getLineas()) {
            // Buscar el servicio si viene el ID
            ServicioMedico servicio = null;
            if (lineaDto.getServicioId() != null) {
                servicio = servicioRepository.findById(lineaDto.getServicioId())
                        .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
            }

            // Buscar el producto si viene el ID
            Producto producto = null;
            if (lineaDto.getProductoId() != null) {
                producto = productoRepository.findById(lineaDto.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            }

            LineDocTransaccion linea = new LineDocTransaccion();
            linea.setServicio(servicio);
            linea.setProducto(producto);
            linea.setCantidad(lineaDto.getCantidad());
            linea.setDocumento(doc); // ✅ Relación inversa obligatoria

            lineas.add(linea);
        }

        doc.setLineas(lineas);

        return documentoRepository.save(doc);
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