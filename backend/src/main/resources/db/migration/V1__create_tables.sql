-- Criando a tabela de análises financeiras
CREATE TABLE analises_financeiras (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    renda_mensal DECIMAL(38, 2) NOT NULL,
    nivel_endividamento INT NOT NULL,
    frequencia_poupanca VARCHAR(50) NOT NULL,
    perfil_financeiro VARCHAR(50) NOT NULL,
    probabilidade DECIMAL(3, 2) NOT NULL,
    data_analise DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criando a tabela de transações
CREATE TABLE transacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(38, 2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    analise_id BIGINT,
    CONSTRAINT fk_transacoes_analise
        FOREIGN KEY (analise_id)
        REFERENCES analises_financeiras (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;