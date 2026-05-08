package com.barberpro.controller;

import com.barberpro.dto.AuthRequest;
import com.barberpro.dto.AuthResponse;
import com.barberpro.entity.Usuario;
import com.barberpro.repository.UsuarioRepository;
import com.barberpro.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        Usuario usuario = usuarioRepo.findByEmail(req.email())
            .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        if (!passwordEncoder.matches(req.senha(), usuario.getSenha())) {
            return ResponseEntity.status(401).build();
        }

        String token = jwtService.gerarToken(usuario.getEmail(), usuario.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, usuario.getNome(), usuario.getRole().name()));
    }
}
