package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.DocumentoContable;

public interface DocumentoContableRepository extends JpaRepository<DocumentoContable, Long> {
}
