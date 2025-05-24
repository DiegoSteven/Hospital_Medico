package com.example.demo.models.servicios;

import javax.persistence.Entity;

import com.example.demo.models.ServicioMedico;

@Entity
public class SuministroMedico extends ServicioMedico {

    private String nombreMedicamento;
    private int cantidad;
    private String dosis;

    public String getNombreMedicamento() {
        return nombreMedicamento;
    }

    public void setNombreMedicamento(String nombreMedicamento) {
        this.nombreMedicamento = nombreMedicamento;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public String getDosis() {
        return dosis;
    }

    public void setDosis(String dosis) {
        this.dosis = dosis;
    }
}