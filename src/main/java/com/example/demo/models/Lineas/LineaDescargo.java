package com.example.demo.models.lineas;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.example.demo.models.Descargo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LineaDescargo extends LineaDocTransaccion {

    @ManyToOne
    @JoinColumn(name = "descargo_id")
    @JsonBackReference
    private Descargo descargo;

    private BigDecimal subtotal;

    public Descargo getDescargo() {
        return descargo;
    }

    public void setDescargo(Descargo descargo) {
        this.descargo = descargo;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}