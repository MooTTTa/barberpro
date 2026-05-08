package com.barberpro.controller;

import com.barberpro.entity.Usuario;
import com.barberpro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/barbeiros")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BarbeiroController {

    private final UsuarioRepository repo;

    @GetMapping
    public List<Usuario> listar() {
        return repo.findAll();
    }
}
