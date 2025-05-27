package com.example.demo.models.lineas;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.example.demo.models.Descargo;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class LineaDescargo extends LineaDocTransaccion {

    @ManyToOne
    @JoinColumn(name = "descargo_id")
    @JsonBackReference
    private Descargo descargo;

    public Descargo getDescargo() {
        return descargo;
    }

    public void setDescargo(Descargo descargo) {
        this.descargo = descargo;
    }
}