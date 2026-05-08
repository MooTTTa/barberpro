package com.barberpro.dto;

import com.barberpro.entity.Agendamento;
import java.time.LocalDateTime;

public record AgendamentoResponse(
    Long id,
    String clienteNome,
    String clienteTelefone,
    String servicoNome,
    Integer duracaoMinutos,
    LocalDateTime dataHora,
    String status,
    String observacao
) {
    public static AgendamentoResponse from(Agendamento a) {
        return new AgendamentoResponse(
            a.getId(),
            a.getCliente().getNome(),
            a.getCliente().getTelefone(),
            a.getServico().getNome(),
            a.getServico().getDuracaoMinutos(),
            a.getDataHora(),
            a.getStatus().name(),
            a.getObservacao()
        );
    }
}
