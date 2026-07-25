-- ============================================================
-- Refatoração da tabela de transações para suportar o CRUD
-- ============================================================
--
-- A transação deixa de pertencer obrigatoriamente a uma análise
-- financeira e passa a pertencer diretamente ao usuário.
--
-- Os campos tipo e data_transacao também são adicionados para
-- permitir cálculo de saldo e consultas por período.
-- ============================================================

ALTER TABLE transacoes
    ADD COLUMN tipo VARCHAR(20) NULL,
    ADD COLUMN data_transacao DATE NULL,
    ADD COLUMN usuario_id BIGINT NULL;

-- Migração dos registros já existentes.
--
-- O usuário é recuperado por meio da análise financeira à qual
-- a transação estava anteriormente vinculada.
--
-- Como o modelo antigo não possuía o tipo da transação, os
-- registros antigos recebem DESPESA provisoriamente.
UPDATE transacoes AS transacao
INNER JOIN analises_financeiras AS analise
    ON analise.id = transacao.analise_id
SET
    transacao.usuario_id = analise.usuario_id,
    transacao.tipo = 'DESPESA',
    transacao.data_transacao = DATE(
        COALESCE(analise.data_analise, CURRENT_TIMESTAMP)
    );

ALTER TABLE transacoes
    MODIFY COLUMN tipo VARCHAR(20) NOT NULL,
    MODIFY COLUMN data_transacao DATE NOT NULL,
    MODIFY COLUMN usuario_id BIGINT NOT NULL,
    MODIFY COLUMN categoria VARCHAR(30) NOT NULL;

ALTER TABLE transacoes
    DROP FOREIGN KEY fk_transacao_analise;

ALTER TABLE transacoes
    DROP COLUMN analise_id;

ALTER TABLE transacoes
    ADD CONSTRAINT fk_transacao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id);