package com.example.demo.models.estados;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;

public class EstadoIndeterminado implements EstadoPacienteBehavior {

    @Override
    public void manejarEstado(Paciente paciente, Tratamiento tratamiento) {
        // Si el tratamiento es leve, asumimos que está bien
        if (tratamiento.getSeveridad() <= 2) {
            paciente.aplicarEstadoInterno(new EstadoBueno());
        // Si el tratamiento es leve, asumimos que está bien
        } else {
            paciente.aplicarEstadoInterno(new EstadoRegular());
        }
    }

    @Override
    public String getNombreEstado() {
        return "INDETERMINADO";
    }
}