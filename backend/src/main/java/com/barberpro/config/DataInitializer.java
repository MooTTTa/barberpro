package com.barberpro.config;

import com.barberpro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        usuarioRepo.findByEmail("barbeiro@barberpro.com").ifPresent(u -> {
            if (!passwordEncoder.matches("123456", u.getSenha())) {
                u.setSenha(passwordEncoder.encode("123456"));
                usuarioRepo.save(u);
            }
        });
    }
}
