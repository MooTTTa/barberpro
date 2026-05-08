package com.barberpro.controller;

import com.barberpro.entity.Servico;
import com.barberpro.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@RequiredArgsConstructor

public class ServicoController {

    private final ServicoRepository repo;

    @GetMapping
    public List<Servico> listar() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity<Servico> criar(@RequestBody Servico servico) {
        return ResponseEntity.ok(repo.save(servico));
    }
}
