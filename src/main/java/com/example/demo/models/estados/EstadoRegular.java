package com.example.demo.models.estados;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;

public class EstadoRegular implements EstadoPacienteBehavior {

    @Override
    public void manejarEstado(Paciente paciente, Tratamiento tratamiento) {
        // Si el tratamiento es fuerte, el paciente puede empeorar
        if (tratamiento.getSeveridad() >= 6) {
            paciente.aplicarEstadoInterno(new EstadoGrave());
        // Si el tratamiento es leve, mejora a estado BUENO
        } else if (tratamiento.getSeveridad() <= 2) {
            paciente.aplicarEstadoInterno(new EstadoBueno());
        }
    }

    @Override
    public String getNombreEstado() {
        return "REGULAR";
    }
}