package com.example.demo.models.wrappers;

import javax.persistence.*;

import com.example.demo.models.estados.EstadoBueno;
import com.example.demo.models.estados.EstadoCritico;
import com.example.demo.models.estados.EstadoGrave;
import com.example.demo.models.estados.EstadoIndeterminado;
import com.example.demo.models.estados.EstadoMuerto;
import com.example.demo.models.estados.EstadoPacienteBehavior;
import com.example.demo.models.estados.EstadoRegular;
import com.fasterxml.jackson.annotation.JsonIgnore;

// Clase que se embebe dentro de la entidad Paciente.
// Su propósito es encapsular el estado actual del paciente
// y manejar el comportamiento asociado al patrón State.
@Embeddable
public class EstadoPacienteWrapper {

    // Este campo NO se guarda en la base de datos.
    // Representa el comportamiento del estado actual (por ejemplo: EstadoBueno, EstadoGrave, etc.)
    @Transient
    @JsonIgnore // Evita que el objeto estadoInterno se exponga al convertir a JSON
    private EstadoPacienteBehavior estadoInterno;

    @Column(name = "estado_nombre")
    private String estadoNombre;

    // ✔ Constructor por defecto. Inicializa el estado como "INDETERMINADO".
    public EstadoPacienteWrapper() {
        // Es importante inicializar vacío para que Jackson pueda construirlo desde JSON
        // La lógica se aplicará cuando se invoque setEstadoNombre() o se cargue con @PostLoad
    }

    // Este switch se encarga de asignar la clase correcta que representa ese estado
    public void setEstadoNombre(String estadoNombre) {
        this.estadoNombre = estadoNombre;

        if (estadoNombre == null) {
            estadoInterno = new EstadoIndeterminado();
            return;
        }

        switch (estadoNombre.toUpperCase()) {
            case "BUENO":
                estadoInterno = new EstadoBueno();
                break;
            case "REGULAR":
                estadoInterno = new EstadoRegular();
                break;
            case "GRAVE":
                estadoInterno = new EstadoGrave();
                break;
            case "CRITICO":
                estadoInterno = new EstadoCritico();
                break;
            case "MUERTO":
                estadoInterno = new EstadoMuerto();
                break;
            default:
                estadoInterno = new EstadoIndeterminado();
                break;
        }
    }

    // Devuelve el nombre del estado (lo que se guarda en la base de datos)
    public String getEstadoNombre() {
        return estadoNombre;
    }

    // Devuelve el objeto que contiene el comportamiento asociado al estado actual
    // (por ejemplo, si está en EstadoCrítico, retorna una instancia de EstadoCritico)
    public EstadoPacienteBehavior getEstadoInterno() {
        return estadoInterno;
    }

    // ✔ Se ejecuta automáticamente cuando el objeto se carga desde la base de datos
    // Reconstruye el objeto lógico 'estadoInterno' a partir del nombre guardado
    @PostLoad
    public void reconstruirEstadoInterno() {
        setEstadoNombre(this.estadoNombre);
    }
}
