package com.example.demo.models.Lineas;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class DocumentoTransaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate fecha;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    
    @JoinColumn(name = "documento_id")
    @JsonManagedReference

    private List<LineDocTransaccion> lineas = new ArrayList<>();

    public BigDecimal getTotal() {
        return lineas.stream()
                     .map(LineDocTransaccion::getSubtotal)
                     .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Getters y Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public List<LineDocTransaccion> getLineas() {
        return lineas;
    }

    public void setLineas(List<LineDocTransaccion> lineas) {
        this.lineas = lineas;
    }

    // Métodos de ayuda para modificar la lista

    public void addLinea(LineDocTransaccion linea) {
        this.lineas.add(linea);
    }

    public void removeLinea(LineDocTransaccion linea) {
        this.lineas.remove(linea);
    }
}
