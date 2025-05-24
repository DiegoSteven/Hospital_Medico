package com.example.demo.repositories.tipoProducto;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.productos.Comida;

public interface ComidaRepository extends JpaRepository<Comida, Integer> {
}