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

    private org.springframework.http.HttpEntity<Object> buildRequest(Object body) {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("apikey", apiKey);
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        return new org.springframework.http.HttpEntity<>(body, headers);
    }

    public void enviarConfirmacao(Agendamento ag) {
        String data = ag.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'as' HH:mm"));
        String barbeiro = ag.getBarbeiro() != null ? ag.getBarbeiro().getNome() : "a equipe";
        String msg = String.format(
            "✅ *BarberPro* - Agendamento confirmado!\n\n" +
            "Ola, *%s*! Seu horario foi marcado.\n\n" +
            "📅 *Data:* %s\n" +
            "✂️ *Servico:* %s\n" +
            "💈 *Barbeiro:* %s",
            ag.getClienteNome(), data, ag.getServico().getNome(), barbeiro
        );
        enviar(ag.getClienteTelefone(), msg);
    }

    public void enviarRecusa(Agendamento ag) {
        String data = ag.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'as' HH:mm"));
        String msg = String.format(
            "❌ *BarberPro* - Agendamento nao confirmado.\n\n" +
            "Ola, *%s*! Infelizmente o horario *%s* nao esta disponivel.\n\n" +
            "🔄 Acesse o site novamente e escolha outra data para seu atendimento.",
            ag.getClienteNome(), data
        );
        enviar(ag.getClienteTelefone(), msg);
    }

    public void enviarLembrete(Agendamento ag) {
        String hora = ag.getDataHora().format(DateTimeFormatter.ofPattern("HH:mm"));
        String msg = String.format(
            "Lembrete BarberPro\n\nOla, %s! Seu horario e hoje as %s.",
            ag.getClienteNome(), hora
        );
        enviar(ag.getClienteTelefone(), msg);
    }

    private void enviar(String telefone, String mensagem) {
        try {
            String url = apiUrl + "/message/sendText/" + instance;
            Map<String, Object> body = Map.of(
                "number", telefone,
                "textMessage", Map.of("text", mensagem)
            );
            log.info("WhatsApp -> {} | {}", telefone, mensagem);
            restTemplate.postForObject(url, buildRequest(body), Object.class);
        } catch (Exception e) {
            log.error("Falha ao enviar WhatsApp para {}: {}", telefone, e.getMessage());
        }
    }
}
