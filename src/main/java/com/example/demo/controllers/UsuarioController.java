package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.example.demo.models.UsuarioModel;
import com.example.demo.services.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
@CrossOrigin(origins = "*") // Permitir solicitudes de cualquier origen
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;

    @GetMapping()
    public ArrayList<UsuarioModel> obtenerUsuarios() {
        return usuarioService.obtenerUsuarios();
    }

    @PostMapping()
    public ResponseEntity<?> guardarUsuario(@RequestBody UsuarioModel usuario) {
        // Verificar si el correo ya está registrado
        if (usuarioService.existeCorreo(usuario.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "El correo ya está registrado");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        // Validación básica de email
        if (!isValidEmail(usuario.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "El formato de correo electrónico no es válido");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Guardar el usuario si el correo no existe
        UsuarioModel usuarioGuardado = usuarioService.guardarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
    }

    // Método auxiliar para validar formato de email
    private boolean isValidEmail(String email) {
        String regex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        return email != null && email.matches(regex);
    }

    @PostMapping("/batch")
    public ArrayList<UsuarioModel> guardarUsuarios(@RequestBody ArrayList<UsuarioModel> usuarios) {
        ArrayList<UsuarioModel> usuariosGuardados = new ArrayList<>();
        for (UsuarioModel usuario : usuarios) {
            usuariosGuardados.add(usuarioService.guardarUsuario(usuario));
        }
        return usuariosGuardados;
    }

    @GetMapping(path = "/{id}")
    public Optional<UsuarioModel> obtenerUsuarioPorId(@PathVariable("id") Long id) {
        return this.usuarioService.obtenerPorId(id);
    }

    @DeleteMapping(path = "/{id}")
    public String eliminarPorId(@PathVariable("id") Long id) {
        boolean ok = this.usuarioService.eliminarUsuario(id);
        if (ok) {
            return "Se eliminó el usuario con id " + id;
        } else {
            return "No pudo eliminar el usuario con id " + id;
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioModel usuario) {
        try {
            // Validación de datos
            if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty() ||
                usuario.getApellido() == null || usuario.getApellido().trim().isEmpty() ||
                usuario.getEmail() == null || usuario.getEmail().trim().isEmpty() ||
                usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
                
                Map<String, String> response = new HashMap<>();
                response.put("message", "Todos los campos son obligatorios");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Validar formato de correo
            if (!isValidEmail(usuario.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "El formato de correo electrónico no es válido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Verificar si el correo ya está registrado
            if (usuarioService.existeCorreo(usuario.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "El correo ya está registrado");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Encriptar la contraseña con BCrypt antes de guardarla
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

            usuarioService.guardarUsuario(usuario);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario registrado con éxito");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al registrar el usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioModel usuario) {
        try {
            // Validación básica
            if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty() ||
                usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
                
                Map<String, String> response = new HashMap<>();
                response.put("message", "El correo y la contraseña son obligatorios");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Optional<UsuarioModel> usuarioOpt = usuarioService.obtenerPorEmail(usuario.getEmail());

            if (usuarioOpt.isPresent()) {
                UsuarioModel usuarioEncontrado = usuarioOpt.get();
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

                // Compara la contraseña ingresada con la encriptada en la base de datos
                if (passwordEncoder.matches(usuario.getPassword(), usuarioEncontrado.getPassword())) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Inicio de sesión exitoso");
                    response.put("nombre", usuarioEncontrado.getNombre());
                    response.put("id", usuarioEncontrado.getId());
                    // Aquí podrías generar un token JWT si implementas seguridad
                    
                    return ResponseEntity.ok(response);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Contraseña incorrecta");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}