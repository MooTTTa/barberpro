package com.barberpro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record AgendamentoRequest(
    @NotBlank String clienteNome,
    @NotBlank String clienteTelefone,
    @NotNull Long barbeiroId,
    @NotNull Long servicoId,
    @NotNull LocalDateTime dataHora,
    String observacao
) {}
