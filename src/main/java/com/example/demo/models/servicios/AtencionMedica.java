package com.example.demo.models.servicios;

import javax.persistence.Entity;

import com.example.demo.models.ServicioMedico;

@Entity
public class AtencionMedica extends ServicioMedico {

    private String medico;

    public String getMedico() {
        return medico;
    }

    public void setMedico(String medico) {
        this.medico = medico;
    }
}