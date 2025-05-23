package com.example.demo.models.estados;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;

public class EstadoBueno implements EstadoPacienteBehavior {
    public void manejarEstado(Paciente paciente, Tratamiento tratamiento) {
         // Si el tratamiento es muy fuerte, puede desestabilizar al paciente
        if (tratamiento.getSeveridad() > 3) {
            paciente.aplicarEstadoInterno(new EstadoRegular());
        }
    }

    public String getNombreEstado() {
        return "BUENO";
    }
}