ALTER TABLE agendamentos ADD COLUMN barbeiro_id BIGINT REFERENCES usuarios(id);
ALTER TABLE agendamentos ADD COLUMN cliente_nome VARCHAR(255);
ALTER TABLE agendamentos ADD COLUMN cliente_telefone VARCHAR(20);
