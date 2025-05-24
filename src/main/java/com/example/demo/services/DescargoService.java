package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.models.Descargo;
import com.example.demo.models.lineas.LineaDescargo;
import com.example.demo.repositories.DescargoRepository;

@Service
public class DescargoService {

    private final DescargoRepository descargoRepository;

    public DescargoService(DescargoRepository descargoRepository) {
        this.descargoRepository = descargoRepository;
    }

    public Descargo guardarDescargo(Descargo descargo) {
        if (descargo.getLineasDescargo() != null) {
            for (LineaDescargo linea : descargo.getLineasDescargo()) {
                linea.setDescargo(descargo);
            }
        }
        return descargoRepository.save(descargo);
    }

    public List<Descargo> obtenerTodos() {
        return descargoRepository.findAll();
    }

    public Optional<Descargo> obtenerPorId(Long id) {
        return descargoRepository.findById(id);
    }

    public Optional<Descargo> actualizarDescargo(Long id, Descargo actualizado) {
        return descargoRepository.findById(id).map(descargoExistente -> {
            descargoExistente.setMotivo(actualizado.getMotivo());
            descargoExistente.setResponsable(actualizado.getResponsable());
            descargoExistente.setEstado(actualizado.getEstado());
            if (actualizado.getLineasDescargo() != null) {
                for (LineaDescargo linea : actualizado.getLineasDescargo()) {
                    linea.setDescargo(descargoExistente);
                }
            }
            descargoExistente.setLineasDescargo(actualizado.getLineasDescargo());
            return descargoRepository.save(descargoExistente);
        });
    }

    public boolean eliminarDescargo(Long id) {
        return descargoRepository.findById(id).map(descargo -> {
            descargoRepository.delete(descargo);
            return true;
        }).orElse(false);
    }
}