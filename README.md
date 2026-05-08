# ✂️ BarberPro

Sistema completo de agendamento para barbearias com painel administrativo e notificação automática via WhatsApp.

---

## 🚀 Funcionalidades

### Para o cliente (público)
- Agendamento de horário sem necessidade de cadastro ou login
- Seleção de serviço com exibição de preço e duração
- Confirmação automática via WhatsApp após o agendamento
- Validação de conflito de horário em tempo real

### Para o barbeiro (autenticado)
- Login seguro com JWT
- Painel com agenda do dia filtrável por data
- Visualização de cliente, serviço, duração, telefone e status
- Cancelamento de agendamentos diretamente pelo painel

---

## 🔄 Fluxo do sistema

```
Cliente acessa /          →  Preenche o formulário
                          →  Backend valida conflito de horário
                          →  Agendamento salvo no banco
                          →  Notificação enviada via WhatsApp

Barbeiro acessa /login    →  Autentica com email e senha
                          →  Recebe token JWT (24h)
                          →  Acessa /painel
                          →  Visualiza e gerencia agenda do dia
```

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Java | 17 | Linguagem principal |
| Spring Boot | 3.2.5 | Framework principal |
| Spring Security | 6.2 | Autenticação e autorização |
| Spring Data JPA | 3.2.5 | Camada de persistência |
| Flyway | 9.22.3 | Migrations e seed do banco |
| PostgreSQL | 16 | Banco de dados relacional |
| JJWT | 0.11.5 | Geração e validação de tokens JWT |
| Lombok | 1.18 | Redução de boilerplate |
| Maven | 3.9.15 | Gerenciamento de dependências |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | Interface do usuário |
| Vite | 5 | Build tool e dev server |
| TailwindCSS | 4 | Estilização utilitária |
| Axios | 1.x | Cliente HTTP com interceptor JWT |
| React Router DOM | 6 | Roteamento SPA |
| React Hook Form | 7 | Gerenciamento de formulários |
| date-fns | 3 | Formatação de datas |

### Infraestrutura
| Tecnologia | Uso |
|---|---|
| Docker + Docker Compose | Banco de dados em container |
| Evolution API | Integração WhatsApp (configurável) |

---

## 📁 Estrutura do projeto

```
barberpro/
├── backend/
│   └── src/main/java/com/barberpro/
│       ├── config/        # CORS e DataInitializer
│       ├── controller/    # Endpoints REST
│       ├── dto/           # Records de request/response
│       ├── entity/        # Entidades JPA
│       ├── repository/    # Interfaces Spring Data
│       ├── security/      # JWT Filter e Security Config
│       └── service/       # Regras de negócio
├── frontend/
│   └── src/
│       ├── api/           # Cliente Axios e chamadas
│       ├── context/       # AuthContext
│       └── pages/         # Agendamento, Login, Painel
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- Java 17+
- Maven 3.8+
- Node 18+
- Docker

### 1. Banco de dados
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```

API disponível em `http://localhost:8080`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

App disponível em `http://localhost:5173`

---

## 🔐 Endpoints principais

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/login` | Não | Login do barbeiro |
| GET | `/api/servicos` | Não | Lista serviços |
| GET | `/api/clientes` | Não | Lista clientes |
| POST | `/api/agendamentos` | Não | Criar agendamento |
| GET | `/api/agendamentos/dia?data=` | Sim | Agenda do dia |
| PATCH | `/api/agendamentos/{id}/cancelar` | Sim | Cancelar agendamento |

---

## 📱 Integração WhatsApp

O sistema usa a [Evolution API](https://github.com/EvolutionAPI/evolution-api) para envio de mensagens. Configure em `application.properties`:

```properties
whatsapp.api.url=http://localhost:8081
whatsapp.api.key=SUA_CHAVE
whatsapp.instance=barberpro
```

---

## 🗄️ Configuração do banco (application.properties)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/barberpro
spring.datasource.username=postgres
spring.datasource.password=postgres
jwt.secret=troque-em-producao
jwt.expiration=86400000
```

> O Flyway cria as tabelas e insere os dados iniciais automaticamente na primeira execução.

---

## 🔑 Acesso padrão

| Campo | Valor |
|---|---|
| Email | `barbeiro@barberpro.com` |
| Senha | `123456` |
