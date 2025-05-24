package com.example.demo.models.productos;

import javax.persistence.Entity;

import com.example.demo.models.Producto;

@Entity
public class Estadia extends Producto {

    private String fechaInicio;
    private String fechaFin;

    // Getter y Setter para fechaInicio
    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    // Getter y Setter para fechaFin
    public String getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(String fechaFin) {
        this.fechaFin = fechaFin;
    }
}