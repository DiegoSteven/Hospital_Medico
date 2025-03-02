package com.example.demo.repositories;

import java.util.Optional;

import com.example.demo.models.UsuarioModel;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends CrudRepository<UsuarioModel, Long> {
    // Método para encontrar usuarios por email
    Optional<UsuarioModel> findByEmail(String email);
}
