package com.DTO;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.models.estados.EstadoDocumento;

public class DocumentoTransaccionDTO {

    private LocalDate fecha;
    private String motivo;
    private String responsable;
    private EstadoDocumento estado;
    private List<LineDocTransaccionDTO> lineas = new ArrayList<>();

    // Getters y Setters

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

    public EstadoDocumento getEstado() {
        return estado;
    }

    public void setEstado(EstadoDocumento estado) {
        this.estado = estado;
    }

    public List<LineDocTransaccionDTO> getLineas() {
        return lineas;
    }

    public void setLineas(List<LineDocTransaccionDTO> lineas) {
        this.lineas = lineas;
    }

    // Métodos de ayuda

    public void addLinea(LineDocTransaccionDTO linea) {
        this.lineas.add(linea);
    }

    public void removeLinea(LineDocTransaccionDTO linea) {
        this.lineas.remove(linea);
    }
}
