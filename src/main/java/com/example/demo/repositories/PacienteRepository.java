package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
}