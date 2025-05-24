package com.example.demo.repositories.tipoProducto;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.productos.Estadia;

public interface EstadiaRepository extends JpaRepository<Estadia, Integer> {
}