package com.barberpro.controller;

import com.barberpro.entity.Cliente;
import com.barberpro.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    private final ClienteRepository repo;

    @GetMapping
    public List<Cliente> listar() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity<Cliente> criar(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(repo.save(cliente));
    }
}
