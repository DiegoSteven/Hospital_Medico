package com.DTO;

import java.time.LocalDate;
import java.util.List;

public class DescargoRequestDTO {
    private LocalDate fecha;
    private String motivo;
    private String responsable;
    private Integer pacienteId;
    private List<LineaDescargoDTO> lineasDescargo;

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public Integer getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Integer pacienteId) {
        this.pacienteId = pacienteId;
    }

    public List<LineaDescargoDTO> getLineasDescargo() {
        return lineasDescargo;
    }

    public void setLineasDescargo(List<LineaDescargoDTO> lineasDescargo) {
        this.lineasDescargo = lineasDescargo;
    }
}
