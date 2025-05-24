package com.example.demo.models.servicios;

import javax.persistence.Entity;

import com.example.demo.models.ServicioMedico;

@Entity
public class ImagenRayosX extends ServicioMedico {

    private String zona;
    private String observaciones;

    public String getZona() {
        return zona;
    }

    public void setZona(String zona) {
        this.zona = zona;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}