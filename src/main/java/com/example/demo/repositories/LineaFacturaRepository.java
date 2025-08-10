package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Lineas.LineaFactura;

public interface LineaFacturaRepository extends JpaRepository<LineaFactura, Integer> {
}
