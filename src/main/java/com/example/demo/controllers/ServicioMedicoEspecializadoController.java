package com.example.demo.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.*;
import com.example.demo.models.servicios.AtencionMedica;
import com.example.demo.models.servicios.ExamenLaboratorio;
import com.example.demo.models.servicios.ImagenRayosX;
import com.example.demo.models.servicios.ProcedimientoMedico;
import com.example.demo.models.servicios.SuministroMedico;
import com.example.demo.repositories.tipoServicio.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@RestController
@RequestMapping("/api/servicios/especializados")
public class ServicioMedicoEspecializadoController {

    @Autowired private AtencionMedicaRepository atencionRepo;
    @Autowired private ImagenRayosXRepository rayosRepo;
    @Autowired private ExamenLaboratorioRepository examenRepo;
    @Autowired private SuministroMedicoRepository suministroRepo;
    @Autowired private ProcedimientoMedicoRepository procedimientoRepo;

    private final ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());


    @PostMapping
    public ServicioMedico guardarServicioEspecializado(@RequestBody Map<String, Object> body) {
        String tipo = (String) body.get("tipoServicio");

        if (tipo == null) {
            throw new RuntimeException("Falta el campo 'tipoServicio'");
        }

        switch (tipo.toUpperCase()) {
            case "ATENCION":
                return atencionRepo.save(mapper.convertValue(body, AtencionMedica.class));
            case "RAYOS_X":
                return rayosRepo.save(mapper.convertValue(body, ImagenRayosX.class));
            case "EXAMEN":
                return examenRepo.save(mapper.convertValue(body, ExamenLaboratorio.class));
            case "SUMINISTRO":
                return suministroRepo.save(mapper.convertValue(body, SuministroMedico.class));
            case "PROCEDIMIENTO":
                return procedimientoRepo.save(mapper.convertValue(body, ProcedimientoMedico.class));
            default:
                throw new RuntimeException("Tipo de servicio no reconocido: " + tipo);
        }
    }
}
