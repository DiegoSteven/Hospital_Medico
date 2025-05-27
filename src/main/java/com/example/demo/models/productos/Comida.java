package com.example.demo.models.productos;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import com.example.demo.models.Producto;

@Entity
@DiscriminatorValue("comida")
public class Comida extends Producto {

    private String categoria;

    public Comida() {
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}
