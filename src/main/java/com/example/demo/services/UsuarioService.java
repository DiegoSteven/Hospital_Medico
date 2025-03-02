package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import com.example.demo.models.UsuarioModel;
import com.example.demo.repositories.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    UsuarioRepository usuarioRepository;

    public ArrayList<UsuarioModel> obtenerUsuarios() {
        return (ArrayList<UsuarioModel>) usuarioRepository.findAll();
    }

    public UsuarioModel guardarUsuario(UsuarioModel usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<UsuarioModel> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // Buscar usuario por email
    public Optional<UsuarioModel> obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public boolean eliminarUsuario(Long id) {
        try {
            usuarioRepository.deleteById(id);
            return true;
        } catch (Exception err) {
            return false;
        }
    }

    // Método para verificar la contraseña
    public boolean verificarContraseña(UsuarioModel usuario, String password) {
        return usuario.getPassword().equals(password); // O aquí podrías usar un sistema de hashing para comparar contraseñas.
    }
    
    public boolean existeCorreo(String email) {
        Optional<UsuarioModel> usuarioExistente = usuarioRepository.findByEmail(email);
        return usuarioExistente.isPresent(); // Devuelve true si el correo ya está registrado
    }
    
}
