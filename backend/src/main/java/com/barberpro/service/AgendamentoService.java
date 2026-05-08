package com.barberpro.service;

import com.barberpro.dto.AgendamentoRequest;
import com.barberpro.dto.AgendamentoResponse;
import com.barberpro.entity.Agendamento;
import com.barberpro.entity.Cliente;
import com.barberpro.entity.Servico;
import com.barberpro.repository.AgendamentoRepository;
import com.barberpro.repository.ClienteRepository;
import com.barberpro.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepo;
    private final ClienteRepository clienteRepo;
    private final ServicoRepository servicoRepo;
    private final WhatsAppService whatsAppService;

    public AgendamentoResponse criar(AgendamentoRequest req) {
        List<Agendamento> conflitos = agendamentoRepo.findHorarioOcupado(req.dataHora());
        if (!conflitos.isEmpty()) {
            throw new RuntimeException("Horário já ocupado: " + req.dataHora());
        }

        Cliente cliente = clienteRepo.findById(req.clienteId())
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Servico servico = servicoRepo.findById(req.servicoId())
            .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        Agendamento agendamento = Agendamento.builder()
            .cliente(cliente)
            .servico(servico)
            .dataHora(req.dataHora())
            .observacao(req.observacao())
            .status(Agendamento.StatusAgendamento.CONFIRMADO)
            .build();

        agendamento = agendamentoRepo.save(agendamento);
        whatsAppService.enviarConfirmacao(agendamento);

        return AgendamentoResponse.from(agendamento);
    }

    public List<AgendamentoResponse> listarPorDia(LocalDate data) {
        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim    = data.atTime(23, 59, 59);
        return agendamentoRepo.findByPeriodo(inicio, fim)
            .stream().map(AgendamentoResponse::from).toList();
    }

    public AgendamentoResponse cancelar(Long id) {
        Agendamento ag = agendamentoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        ag.setStatus(Agendamento.StatusAgendamento.CANCELADO);
        return AgendamentoResponse.from(agendamentoRepo.save(ag));
    }
}
