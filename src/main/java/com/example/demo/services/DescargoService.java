package com.example.demo.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.DTO.DescargoRequestDTO;
import com.DTO.LineaDescargoDTO;
import com.example.demo.models.Descargo;
import com.example.demo.models.Paciente;
import com.example.demo.models.Producto;
import com.example.demo.models.ServicioMedico;
import com.example.demo.models.estados.EstadoDocumento;
import com.example.demo.models.Lineas.LineaDescargo;
import com.example.demo.repositories.DescargoRepository;

@Service
public class DescargoService {

    private final DescargoRepository descargoRepository;
    private final PacienteService pacienteService;
    private final ProductoService productoService;
    private final ServicioMedicoService servicioMedicoService;

    public DescargoService(
            DescargoRepository descargoRepository,
            PacienteService pacienteService,
            ProductoService productoService,
            ServicioMedicoService servicioMedicoService) {
        this.descargoRepository = descargoRepository;
        this.pacienteService = pacienteService;
        this.productoService = productoService;
        this.servicioMedicoService = servicioMedicoService;
    }

    public Descargo crearDesdeDTO(DescargoRequestDTO dto) {
        Descargo descargo = new Descargo();
        descargo.setFecha(dto.getFecha());
        descargo.setMotivo(dto.getMotivo());
        descargo.setResponsable(dto.getResponsable());

        Paciente paciente = pacienteService.buscarPorId(dto.getPacienteId());
        descargo.setPaciente(paciente);

        List<LineaDescargo> lineas = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (LineaDescargoDTO lineaDTO : dto.getLineasDescargo()) {
            LineaDescargo linea = new LineaDescargo();
            linea.setCantidad(lineaDTO.getCantidad());

            if (lineaDTO.getProductoId() != null) {
                Producto producto = productoService.buscarPorId(lineaDTO.getProductoId());
                linea.setProducto(producto);
                linea.setSubtotal(producto.getPrecio().multiply(BigDecimal.valueOf(linea.getCantidad())));
            } else if (lineaDTO.getServicioId() != null) {
                ServicioMedico servicio = servicioMedicoService.buscarPorId(lineaDTO.getServicioId());
                linea.setServicio(servicio);
                linea.setSubtotal(servicio.getCosto().multiply(BigDecimal.valueOf(linea.getCantidad())));
            }

            linea.setDescargo(descargo);
            total = total.add(linea.getSubtotal());
            lineas.add(linea);
        }

        descargo.setLineasDescargo(lineas);
        descargo.setEstado(EstadoDocumento.DESCARGADO);

        return descargoRepository.save(descargo);
    }

    public Descargo guardarDescargo(Descargo descargo) {
        // Buscar paciente completo
        descargo.setPaciente(
                pacienteService.buscarPorId(descargo.getPaciente().getId()));

        List<LineaDescargo> lineasProcesadas = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (LineaDescargo linea : descargo.getLineasDescargo()) {
            BigDecimal subtotal = BigDecimal.ZERO;

            if (linea.getProducto() != null) {
                var producto = productoService.buscarPorId(linea.getProducto().getId());
                linea.setProducto(producto);
                subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(linea.getCantidad()));
            } else if (linea.getServicio() != null) {
                var servicio = servicioMedicoService.buscarPorId(linea.getServicio().getId());
                linea.setServicio(servicio);
                subtotal = servicio.getCosto().multiply(BigDecimal.valueOf(linea.getCantidad()));
            }

            linea.setSubtotal(subtotal);
            linea.setDescargo(descargo);
            total = total.add(subtotal);
            lineasProcesadas.add(linea);
        }

        descargo.setLineasDescargo(lineasProcesadas);
        descargo.setEstado(com.example.demo.models.estados.EstadoDocumento.DESCARGADO);
        descargo.getTotal();

        return descargoRepository.save(descargo);
    }

    public List<Descargo> obtenerTodos() {
        return descargoRepository.findAll();
    }

    public Optional<Descargo> obtenerPorId(Long id) {
        return descargoRepository.findById(id);
    }

    public Optional<Descargo> actualizarDescargo(Long id, Descargo actualizado) {
        return descargoRepository.findById(id).map(descargoExistente -> {
            descargoExistente.setMotivo(actualizado.getMotivo());
            descargoExistente.setResponsable(actualizado.getResponsable());
            descargoExistente.setEstado(actualizado.getEstado());
            if (actualizado.getLineasDescargo() != null) {
                for (LineaDescargo linea : actualizado.getLineasDescargo()) {
                    linea.setDescargo(descargoExistente);
                }
            }
            descargoExistente.setLineasDescargo(actualizado.getLineasDescargo());
            return descargoRepository.save(descargoExistente);
        });
    }

    public boolean eliminarDescargo(Long id) {
        return descargoRepository.findById(id).map(descargo -> {
            descargoRepository.delete(descargo);
            return true;
        }).orElse(false);
    }
}