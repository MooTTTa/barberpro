package com.barberpro.controller;

import com.barberpro.dto.AgendamentoRequest;
import com.barberpro.dto.AgendamentoResponse;
import com.barberpro.service.AgendamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor

public class AgendamentoController {

    private final AgendamentoService service;

    @PostMapping
    public ResponseEntity<AgendamentoResponse> criar(@Valid @RequestBody AgendamentoRequest req) {
        return ResponseEntity.ok(service.criar(req));
    }

    @GetMapping("/dia")
    public ResponseEntity<List<AgendamentoResponse>> listarPorDia(
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(service.listarPorDia(data));
    }

    @GetMapping("/todos")
    public ResponseEntity<List<AgendamentoResponse>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/horarios-ocupados")
    public ResponseEntity<List<String>> horariosOcupados(
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(service.horariosOcupados(data));
    }

    @GetMapping("/semana")
    public ResponseEntity<List<AgendamentoResponse>> listarPorSemana(
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fim") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return ResponseEntity.ok(service.listarPorSemana(inicio, fim));
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<AgendamentoResponse> confirmar(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.confirmar(id));
    }

    @PatchMapping("/{id}/recusar")
    public ResponseEntity<AgendamentoResponse> recusar(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.recusar(id));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponse> cancelar(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.cancelar(id));
    }
}
