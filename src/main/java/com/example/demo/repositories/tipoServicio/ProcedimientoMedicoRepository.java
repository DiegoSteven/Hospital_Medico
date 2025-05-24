package com.example.demo.repositories.tipoServicio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.servicios.ProcedimientoMedico;

public interface ProcedimientoMedicoRepository extends JpaRepository<ProcedimientoMedico, Integer> {
}