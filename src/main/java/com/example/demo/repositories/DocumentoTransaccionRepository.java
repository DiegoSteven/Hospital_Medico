package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.lineas.DocumentoTransaccion;

public interface DocumentoTransaccionRepository extends JpaRepository<DocumentoTransaccion, Integer> {
}
