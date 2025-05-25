package com.example.demo.models;

import javax.persistence.*;

import com.example.demo.models.estados.EstadoDocumento;
import com.example.demo.models.lineas.DocumentoTransaccion;
import com.example.demo.models.lineas.LineaDescargo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Descargo extends DocumentoTransaccion {

    @Column(nullable = false)
    private String motivo;

    @Column(nullable = false)
    private String responsable;

    @Enumerated(EnumType.STRING)
    private EstadoDocumento estado;

 @OneToMany(mappedBy = "descargo", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonManagedReference
private List<LineaDescargo> lineasDescargo;

    @OneToOne(mappedBy = "descargo")
    @JsonIgnore
    private Factura factura;

    public Descargo() {
        super();
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public EstadoDocumento getEstado() {
        return estado;
    }

    public void setEstado(EstadoDocumento estado) {
        this.estado = estado;
    }

    public List<LineaDescargo> getLineasDescargo() {
        return lineasDescargo;
    }

    public void setLineasDescargo(List<LineaDescargo> lineasDescargo) {
        this.lineasDescargo = lineasDescargo;
    }

    public Factura getFactura() {
        return factura;
    }

    public void setFactura(Factura factura) {
        this.factura = factura;
    }

    public BigDecimal getTotal() {
        return lineasDescargo.stream()
                .map(LineaDescargo::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}
