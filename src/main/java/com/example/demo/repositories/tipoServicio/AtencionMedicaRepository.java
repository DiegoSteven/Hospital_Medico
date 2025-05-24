package com.example.demo.repositories.tipoServicio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.servicios.AtencionMedica;

public interface AtencionMedicaRepository extends JpaRepository<AtencionMedica, Integer> {
}