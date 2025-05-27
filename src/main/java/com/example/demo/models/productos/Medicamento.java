package com.example.demo.models.productos;

import java.time.LocalDate;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import com.example.demo.models.Producto;

@Entity
@DiscriminatorValue("medicamento")
public class Medicamento extends Producto {

    private LocalDate caducidad;

    // Getter y Setter para caducidad
    public LocalDate getCaducidad() {
        return caducidad;
    }

    public void setCaducidad(LocalDate caducidad) {
        this.caducidad = caducidad;
    }
}