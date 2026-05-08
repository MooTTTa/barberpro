package com.barberpro.service;

import com.barberpro.entity.Agendamento;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhatsAppService {

    @Value("${whatsapp.api.url}")
    private String apiUrl;

    @Value("${whatsapp.api.key}")
    private String apiKey;

    @Value("${whatsapp.instance}")
    private String instance;

    private final RestTemplate restTemplate = new RestTemplate();

    public void enviarConfirmacao(Agendamento ag) {
        String data = ag.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'as' HH:mm"));
        String msg = String.format(
            "BarberPro - Agendamento confirmado!\n\n" +
            "Ola, %s! Seu horario foi marcado.\n\n" +
            "Data: %s\n" +
            "Servico: %s\n\n" +
            "Para cancelar, responda CANCELAR.",
            ag.getCliente().getNome(), data, ag.getServico().getNome()
        );
        enviar(ag.getCliente().getTelefone(), msg);
    }

    public void enviarLembrete(Agendamento ag) {
        String hora = ag.getDataHora().format(DateTimeFormatter.ofPattern("HH:mm"));
        String msg = String.format(
            "Lembrete BarberPro\n\nOla, %s! Seu horario e hoje as %s.",
            ag.getCliente().getNome(), hora
        );
        enviar(ag.getCliente().getTelefone(), msg);
    }

    private void enviar(String telefone, String mensagem) {
        try {
            String url = apiUrl + "/message/sendText/" + instance;
            Map<String, Object> body = Map.of(
                "number", telefone,
                "text", mensagem
            );
            log.info("WhatsApp -> {} | {}", telefone, mensagem);
            // restTemplate.postForObject(url, body, Object.class);
        } catch (Exception e) {
            log.error("Falha ao enviar WhatsApp para {}: {}", telefone, e.getMessage());
        }
    }
}
