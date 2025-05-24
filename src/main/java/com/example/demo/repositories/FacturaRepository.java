package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Factura;

public interface FacturaRepository extends JpaRepository<Factura, Long> {
}
