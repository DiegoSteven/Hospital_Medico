package com.example.demo.models;

import javax.persistence.*;

import com.example.demo.models.estados.EstadoPacienteBehavior;
import com.example.demo.models.wrappers.EstadoPacienteWrapper;

@Entity
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private String direccion;
    private String telefono;
    private String correo;

    // Estado actual del paciente, representado con el patrón State
    @Embedded
    private EstadoPacienteWrapper estado;

    // 🧠 Método que aplica un tratamiento al paciente usando su estado actual (patrón State)
    public void aplicarTratamiento(Tratamiento tratamiento) {
        estado.getEstadoInterno().manejarEstado(this, tratamiento);
    }

    // ✅ Método interno para cambiar el estado del paciente con lógica, sin interferir con JSON
    public void aplicarEstadoInterno(EstadoPacienteBehavior nuevoEstado) {
        this.estado.setEstadoNombre(nuevoEstado.getNombreEstado());
    }

    // Getters y Setters estándar para persistencia y deserialización JSON

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public EstadoPacienteWrapper getEstado() {
        return estado;
    }

    // ✅ Setter usado por Spring Boot y Jackson al deserializar JSON
    public void setEstado(EstadoPacienteWrapper estado) {
        this.estado = estado;
    }
}
