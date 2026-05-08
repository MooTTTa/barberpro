-- =============================================================
--  V1 — Estrutura inicial + dados de seed
-- =============================================================

-- Tabela de usuários (barbeiros/admin)
CREATE TABLE IF NOT EXISTS usuarios (
    id     BIGSERIAL PRIMARY KEY,
    email  VARCHAR(255) NOT NULL UNIQUE,
    senha  VARCHAR(255) NOT NULL,
    nome   VARCHAR(255),
    role   VARCHAR(20)  NOT NULL DEFAULT 'BARBEIRO'
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id         BIGSERIAL PRIMARY KEY,
    nome       VARCHAR(255) NOT NULL,
    telefone   VARCHAR(20)  NOT NULL UNIQUE,
    email      VARCHAR(255),
    criado_em  TIMESTAMP DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
    id                BIGSERIAL PRIMARY KEY,
    nome              VARCHAR(255)   NOT NULL,
    duracao_minutos   INT            NOT NULL,
    preco             NUMERIC(10, 2) NOT NULL,
    ativo             BOOLEAN        NOT NULL DEFAULT TRUE
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id          BIGSERIAL PRIMARY KEY,
    cliente_id  BIGINT       NOT NULL REFERENCES clientes(id),
    servico_id  BIGINT       NOT NULL REFERENCES servicos(id),
    data_hora   TIMESTAMP    NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDENTE',
    observacao  TEXT,
    criado_em   TIMESTAMP    DEFAULT NOW()
);

-- =============================================================
--  Seed — dados iniciais
-- =============================================================

-- Serviços
INSERT INTO servicos (nome, duracao_minutos, preco, ativo) VALUES
('Corte simples',  30, 35.00, true),
('Corte + barba',  60, 60.00, true),
('Barba',          30, 30.00, true),
('Corte degradê',  45, 45.00, true);

-- Clientes de exemplo
INSERT INTO clientes (nome, telefone, email) VALUES
('João Silva',   '5511999990001', 'joao@email.com'),
('Carlos Souza', '5511999990002', 'carlos@email.com'),
('Pedro Lima',   '5511999990003', 'pedro@email.com');

-- Usuário barbeiro padrão (senha: 123456)
INSERT INTO usuarios (email, senha, nome, role) VALUES
('barbeiro@barberpro.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi',
 'João Barbeiro', 'BARBEIRO');
