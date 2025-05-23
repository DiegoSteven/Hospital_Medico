package com.example.demo.models.estados;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;

public class EstadoCritico implements EstadoPacienteBehavior {
// Este método se llama cuando se aplica un tratamiento al paciente que está en estado crítico.
    @Override
    public void manejarEstado(Paciente paciente, Tratamiento tratamiento) {
        // Si el tratamiento es muy severo (ej: cirugías de alto riesgo), el paciente puede morir
        if (tratamiento.getSeveridad() >= 10) {
            paciente.aplicarEstadoInterno(new EstadoMuerto());
         // Si el tratamiento es moderado, mejora su condición a "GRAVE"
        } else if (tratamiento.getSeveridad() <= 4) {
            paciente.aplicarEstadoInterno(new EstadoGrave());
        }
    }

    @Override
    public String getNombreEstado() {
        return "CRITICO";
    }
}