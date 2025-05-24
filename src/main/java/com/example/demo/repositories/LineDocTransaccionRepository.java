package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Lineas.LineDocTransaccion;

public interface LineDocTransaccionRepository extends JpaRepository<LineDocTransaccion, Integer> {
}