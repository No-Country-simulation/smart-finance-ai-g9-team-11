CREATE TABLE usuarios (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    senha VARCHAR(255) NOT NULL,

    ativo BOOLEAN NOT NULL DEFAULT TRUE

);


CREATE TABLE analises_financeiras (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    renda_mensal DECIMAL(10,2) NOT NULL,

    nivel_endividamento INT NOT NULL,

    frequencia_poupanca VARCHAR(20) NOT NULL,

    perfil_financeiro VARCHAR(30),

    probabilidade DECIMAL(5,2),

    data_analise TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    usuario_id BIGINT NOT NULL,

    CONSTRAINT fk_analise_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)

);


CREATE TABLE transacoes (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    descricao VARCHAR(255) NOT NULL,

    valor DECIMAL(10,2) NOT NULL,

    categoria VARCHAR(30),

    analise_id BIGINT NOT NULL,

    CONSTRAINT fk_transacao_analise
        FOREIGN KEY (analise_id)
        REFERENCES analises_financeiras(id)

);