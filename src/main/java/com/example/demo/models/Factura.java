package com.example.demo.models;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.example.demo.models.estados.EstadoDocumento;
import com.example.demo.models.lineas.LineaFactura;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Factura extends DocumentoContable {

    public Factura() {
        super();
    }

    public Factura(Long id, LocalDate fecha, EstadoDocumento estado) {
        super(id, fecha, estado);
    }

    @OneToOne
    @JoinColumn(name = "descargo_id")
    @JsonManagedReference
    private Descargo descargo;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LineaFactura> lineasFactura;

    public Descargo getDescargo() {
        return descargo;
    }

    public void setDescargo(Descargo descargo) {
        this.descargo = descargo;
    }

    public List<LineaFactura> getLineasFactura() {
        return lineasFactura;
    }

    public void setLineasFactura(List<LineaFactura> lineasFactura) {
        this.lineasFactura = lineasFactura;
    }

    public BigDecimal getTotal() {
        return lineasFactura == null ? BigDecimal.ZERO
                : lineasFactura.stream()
                        .map(LineaFactura::getSubtotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
