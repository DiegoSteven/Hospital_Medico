package com.example.demo.models.servicios;

import javax.persistence.Entity;

import com.example.demo.models.ServicioMedico;

@Entity
public class ProcedimientoMedico extends ServicioMedico {

    private String nombreProcedimiento;
    private String tipo;

    public String getNombreProcedimiento() {
        return nombreProcedimiento;
    }

    public void setNombreProcedimiento(String nombreProcedimiento) {
        this.nombreProcedimiento = nombreProcedimiento;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}