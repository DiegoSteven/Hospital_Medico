package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
}