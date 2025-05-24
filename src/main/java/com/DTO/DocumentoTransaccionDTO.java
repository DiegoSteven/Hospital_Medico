package com.DTO;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class DocumentoTransaccionDTO {

    private LocalDate fecha;
    private List<LineDocTransaccionDTO> lineas = new ArrayList<>();

    // Getters y Setters

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
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
