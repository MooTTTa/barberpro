package com.barberpro.service;

import com.barberpro.dto.AgendamentoRequest;
import com.barberpro.dto.AgendamentoResponse;
import com.barberpro.entity.Agendamento;
import com.barberpro.entity.Servico;
import com.barberpro.entity.Usuario;
import com.barberpro.repository.AgendamentoRepository;
import com.barberpro.repository.ServicoRepository;
import com.barberpro.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepo;
    private final ServicoRepository servicoRepo;
    private final UsuarioRepository usuarioRepo;
    private final WhatsAppService whatsAppService;

    public List<String> horariosOcupados(LocalDate data) {
        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim    = data.atTime(23, 59, 59);
        return agendamentoRepo.findByPeriodo(inicio, fim)
            .stream()
            .filter(a -> a.getStatus() != Agendamento.StatusAgendamento.CANCELADO)
            .map(a -> a.getDataHora().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm")))
            .toList();
    }

    private void validarHorarioAtendimento(LocalDateTime dataHora) {
        java.time.DayOfWeek dia = dataHora.getDayOfWeek();
        int hora = dataHora.getHour();

        if (dia == java.time.DayOfWeek.SUNDAY) {
            throw new RuntimeException("Não atendemos aos domingos.");
        }
        if (dia == java.time.DayOfWeek.SATURDAY) {
            if (hora < 8 || hora >= 13) {
                throw new RuntimeException("Sábado: atendemos das 08h às 13h.");
            }
        } else {
            if (hora < 9 || hora >= 19) {
                throw new RuntimeException("Segunda a sexta: atendemos das 09h às 19h.");
            }
        }
    }

    public AgendamentoResponse criar(AgendamentoRequest req) {
        validarHorarioAtendimento(req.dataHora());

        List<Agendamento> conflitos = agendamentoRepo.findHorarioOcupado(req.dataHora());
        if (!conflitos.isEmpty()) {
            throw new RuntimeException("Horário indisponível. Por favor, escolha outro horário.");
        }

        Servico servico = servicoRepo.findById(req.servicoId())
            .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        Usuario barbeiro = usuarioRepo.findById(req.barbeiroId())
            .orElseThrow(() -> new RuntimeException("Barbeiro não encontrado"));

        Agendamento agendamento = Agendamento.builder()
            .clienteNome(req.clienteNome())
            .clienteTelefone(req.clienteTelefone())
            .barbeiro(barbeiro)
            .servico(servico)
            .dataHora(req.dataHora())
            .observacao(req.observacao())
            .status(Agendamento.StatusAgendamento.PENDENTE)
            .build();

        agendamento = agendamentoRepo.save(agendamento);

        return AgendamentoResponse.from(agendamento);
    }

    public List<AgendamentoResponse> listarPorSemana(LocalDate inicio, LocalDate fim) {
        return agendamentoRepo.findByPeriodo(inicio.atStartOfDay(), fim.atTime(23, 59, 59))
            .stream().map(AgendamentoResponse::from).toList();
    }

    public List<AgendamentoResponse> listarTodos() {
        return agendamentoRepo.findAll(org.springframework.data.domain.Sort.by("dataHora"))
            .stream().map(AgendamentoResponse::from).toList();
    }

    public List<AgendamentoResponse> listarPorDia(LocalDate data) {
        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim    = data.atTime(23, 59, 59);
        return agendamentoRepo.findByPeriodo(inicio, fim)
            .stream().map(AgendamentoResponse::from).toList();
    }

    public AgendamentoResponse confirmar(Long id) {
        Agendamento ag = agendamentoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        ag.setStatus(Agendamento.StatusAgendamento.CONFIRMADO);
        ag = agendamentoRepo.save(ag);
        whatsAppService.enviarConfirmacao(ag);
        return AgendamentoResponse.from(ag);
    }

    public AgendamentoResponse recusar(Long id) {
        Agendamento ag = agendamentoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        ag.setStatus(Agendamento.StatusAgendamento.CANCELADO);
        ag = agendamentoRepo.save(ag);
        whatsAppService.enviarRecusa(ag);
        return AgendamentoResponse.from(ag);
    }

    public AgendamentoResponse cancelar(Long id) {
        Agendamento ag = agendamentoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        ag.setStatus(Agendamento.StatusAgendamento.CANCELADO);
        return AgendamentoResponse.from(agendamentoRepo.save(ag));
    }
}
