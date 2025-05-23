package com.example.demo.models.estados;

import com.example.demo.models.Paciente;
import com.example.demo.models.Tratamiento;
// Se utiliza para implementar el patrón State en combinación con la clase Paciente
public interface EstadoPacienteBehavior {
    // Este método define cómo reacciona el paciente a un tratamiento dependiendo de su estado
    void manejarEstado(Paciente paciente, Tratamiento tratamiento);
    String getNombreEstado();
}
