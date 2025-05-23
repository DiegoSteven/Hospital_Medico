package com.example.demo.models.estados;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;

public class EstadoMuerto implements EstadoPacienteBehavior {

    @Override
    public void manejarEstado(Paciente paciente, Tratamiento tratamiento) {
        // Ya no cambia de estado
        System.out.println("Advertencia: Se intentó tratar a un paciente fallecido.");
    }

    @Override
    public String getNombreEstado() {
        return "MUERTO";
    }
}