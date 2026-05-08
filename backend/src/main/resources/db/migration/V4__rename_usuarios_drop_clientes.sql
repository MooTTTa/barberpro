ALTER TABLE agendamentos DROP COLUMN IF EXISTS cliente_id;
ALTER TABLE usuarios RENAME TO barbeiros;
DROP TABLE IF EXISTS clientes;
