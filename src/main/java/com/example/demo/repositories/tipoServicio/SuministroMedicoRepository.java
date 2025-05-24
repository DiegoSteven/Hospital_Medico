package com.example.demo.repositories.tipoServicio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.servicios.SuministroMedico;

public interface SuministroMedicoRepository extends JpaRepository<SuministroMedico, Integer> {
}