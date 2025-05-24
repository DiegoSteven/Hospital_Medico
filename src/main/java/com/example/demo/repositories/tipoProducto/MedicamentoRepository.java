package com.example.demo.repositories.tipoProducto;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.productos.Medicamento;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {
}