package com.example.demo.models;

import java.time.LocalDate;

import javax.persistence.*;

import com.example.demo.models.estados.EstadoDocumento;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class DocumentoContable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private EstadoDocumento estado;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    public DocumentoContable() {}

    public DocumentoContable(Long id, LocalDate fecha, EstadoDocumento estado) {
        this.id = id;
        this.fecha = fecha;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public EstadoDocumento getEstado() {
        return estado;
    }

    public void setEstado(EstadoDocumento estado) {
        this.estado = estado;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
}
