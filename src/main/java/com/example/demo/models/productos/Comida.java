package com.example.demo.models.productos;

import javax.persistence.Entity;

import com.example.demo.models.Producto;

@Entity
public class Comida extends Producto {

    private String categoria;

    // Getter y Setter para categoria
    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}