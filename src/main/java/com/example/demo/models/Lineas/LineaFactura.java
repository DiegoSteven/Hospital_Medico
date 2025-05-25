package com.example.demo.models.lineas;

import java.math.BigDecimal;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.example.demo.models.Factura;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
public class LineaFactura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "line_doc_transaccion_id")
    private LineDocTransaccion lineDocTransaccion;

    @ManyToOne
    @JoinColumn(name = "factura_id")
    private Factura factura;

    private BigDecimal precioUnitario;

    public LineDocTransaccion getLineDocTransaccion() {
        return lineDocTransaccion;
    }

    public void setLineDocTransaccion(LineDocTransaccion lineDocTransaccion) {
        this.lineDocTransaccion = lineDocTransaccion;
    }

    public Factura getFactura() {
        return factura;
    }

    public void setFactura(Factura factura) {
        this.factura = factura;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
    public BigDecimal getSubtotal() {
    if (lineDocTransaccion != null) {
        return lineDocTransaccion.getSubtotal();
    } else {
        return BigDecimal.ZERO;
    }
}


}
