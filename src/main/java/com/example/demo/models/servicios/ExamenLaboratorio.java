package com.example.demo.models.servicios;

import javax.persistence.Entity;

import com.example.demo.models.ServicioMedico;

@Entity
public class ExamenLaboratorio extends ServicioMedico {

    private String tipoExamen;
    private String resultado;

    public String getTipoExamen() {
        return tipoExamen;
    }

    public void setTipoExamen(String tipoExamen) {
        this.tipoExamen = tipoExamen;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }
}