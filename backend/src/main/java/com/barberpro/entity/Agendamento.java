package com.barberpro.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Agendamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cliente_nome", nullable = false)
    private String clienteNome;

    @Column(name = "cliente_telefone", nullable = false)
    private String clienteTelefone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barbeiro_id")
    private Usuario barbeiro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private StatusAgendamento status = StatusAgendamento.PENDENTE;

    private String observacao;

    @Builder.Default
    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();

    public enum StatusAgendamento {
        PENDENTE, CONFIRMADO, CANCELADO, CONCLUIDO
    }
}
