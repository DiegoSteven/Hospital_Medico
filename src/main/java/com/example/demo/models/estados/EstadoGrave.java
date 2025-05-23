package com.example.demo.models.estados;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;

public class EstadoGrave implements EstadoPacienteBehavior {

    @Override
    public void manejarEstado(Paciente paciente, Tratamiento tratamiento) {
        // Si la severidad del tratamiento es muy alta (>= 8), el paciente puede empeorar a "CRITICO"
        if (tratamiento.getSeveridad() >= 8) {
            paciente.aplicarEstadoInterno(new EstadoCritico());
        // Si el tratamiento es efectivo (severidad baja), el paciente mejora a "REGULAR"
        } else if (tratamiento.getSeveridad() <= 3) {
            paciente.aplicarEstadoInterno(new EstadoRegular());
        }
    }

    @Override
    public String getNombreEstado() {
        return "GRAVE";
    }
}