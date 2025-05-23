package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Tratamiento;

public interface TratamientoRepository extends JpaRepository<Tratamiento, Integer> {
}