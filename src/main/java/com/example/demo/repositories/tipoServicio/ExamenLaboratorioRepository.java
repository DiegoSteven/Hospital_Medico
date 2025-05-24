package com.example.demo.repositories.tipoServicio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.servicios.ExamenLaboratorio;

public interface ExamenLaboratorioRepository extends JpaRepository<ExamenLaboratorio, Integer> {
}
