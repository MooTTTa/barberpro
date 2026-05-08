package com.barberpro.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record AgendamentoRequest(
    @NotNull Long clienteId,
    @NotNull Long servicoId,
    @NotNull LocalDateTime dataHora,
    String observacao
) {}
