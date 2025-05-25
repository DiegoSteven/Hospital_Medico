package com.example.demo.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.example.demo.models.Descargo;
import com.example.demo.models.Factura;
import com.example.demo.models.estados.EstadoDocumento;
import com.example.demo.models.lineas.LineDocTransaccion;
import com.example.demo.models.lineas.LineaFactura;
import com.example.demo.repositories.DescargoRepository;
import com.example.demo.repositories.FacturaRepository;

@Service
@Transactional
public class FacturacionService {

    private final DescargoRepository descargoRepository;
    private final FacturaRepository facturaRepository;

    public FacturacionService(DescargoRepository descargoRepository, FacturaRepository facturaRepository) {
        this.descargoRepository = descargoRepository;
        this.facturaRepository = facturaRepository;
    }

    public Factura facturarDescargo(Long descargoId) {
        Descargo descargo = descargoRepository.findById(descargoId)
                .orElseThrow(() -> new RuntimeException("Descargo no encontrado"));

        if (!EstadoDocumento.DESCARGADO.equals(descargo.getEstado())) {
            throw new RuntimeException("El descargo debe estar en estado DESCARGADO para ser facturado.");
        }

        if (descargo.getFactura() != null) {
            throw new RuntimeException("Este descargo ya ha sido facturado.");
        }

        if (descargo.getLineasDescargo() == null || descargo.getLineasDescargo().isEmpty()) {
            throw new RuntimeException("El descargo no contiene líneas.");
        }

        Factura factura = new Factura();
        factura.setFecha(LocalDate.now());
        factura.setEstado(EstadoDocumento.FACTURADO);
        factura.setDescargo(descargo);

        List<LineaFactura> lineasFactura = clonarLineas(descargo, factura);
        factura.setLineasFactura(lineasFactura);

        descargo.setEstado(EstadoDocumento.FACTURADO);
        descargo.setFactura(factura); // relación inversa

        facturaRepository.save(factura);
        descargoRepository.save(descargo);

        return factura;
    }

    private List<LineaFactura> clonarLineas(Descargo descargo, Factura factura) {
    return descargo.getLineasDescargo().stream().map(linea -> {
        LineaFactura lf = new LineaFactura();

        // Reutiliza el LineDocTransaccion de la línea de descargo
        LineDocTransaccion original = linea.getLineDocTransaccion();

        LineDocTransaccion ldt = new LineDocTransaccion();
        ldt.setProducto(original.getProducto());
        ldt.setServicio(original.getServicio());
        ldt.setCantidad(original.getCantidad());
        ldt.setPrecioUnitario(original.getSubtotal());

        lf.setLineDocTransaccion(ldt);
        lf.setFactura(factura);

        return lf;
    }).collect(Collectors.toList());
}


    public List<Factura> listarFacturas() {
        return facturaRepository.findAll();
    }

    public Optional<Factura> obtenerFacturaPorId(Long id) {
        return facturaRepository.findById(id);
    }

    public Optional<Factura> obtenerFacturaPorDescargo(Long descargoId) {
        return facturaRepository.findAll().stream()
                .filter(factura -> factura.getDescargo() != null && factura.getDescargo().getId().equals(descargoId))
                .findFirst();
    }
}
