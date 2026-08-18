package br.com.financeai.service;

import br.com.financeai.enums.TransactionCategory;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Locale;

/**
 * Responsável pela classificação local de transações (fallback), usada
 * quando o serviço de Machine Learning está indisponível.
 * <p>
 * A categoria é inferida por correspondência de palavras-chave na
 * descrição da transação — uma aproximação simples, não tão precisa
 * quanto o modelo de IA, mas suficiente para manter o cadastro de
 * transações funcionando durante uma indisponibilidade externa.
 */
@Service
public class TransactionClassificationService {

    private String normalizar(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .trim();
    }

    /**
     * Executa a classificação de uma transação utilizando regras estáticas locais (fallback).
     * Acionado exclusivamente quando o serviço externo de Machine Learning está indisponível.
     *
     * @param request dados financeiros da transação que requer classificação.
     * @return resposta com a transação e a categoria inferida através do mapeamento interno de palavras-chave.
     */
    public MlTransactionResponse classifyTransactionFallback(
            MlTransactionRequest request
    ) {

        TransactionCategory categoria = inferirCategoria(request.descricao());

        return new MlTransactionResponse(
                request.descricao(),
                request.valor(),
                request.tipo(),
                categoria,
                request.data()
        );
    }

    private TransactionCategory inferirCategoria(String descricao) {

        if (descricao == null || descricao.isBlank()) {
            return TransactionCategory.OUTROS;
        }


        String texto = normalizar(descricao);

        // Alimentação
        if (texto.contains("mercado")
                || texto.contains("supermercado")
                || texto.contains("padaria")
                || texto.contains("restaurante")
                || texto.contains("lanchonete")
                || texto.contains("ifood")
                || texto.contains("pizza")
                || texto.contains("hamburguer")
                || texto.contains("cafeteria")) {
            return TransactionCategory.ALIMENTACAO;
        }

        // Utilitários
        if (texto.contains("energia")
                || texto.contains("luz")
                || texto.contains("agua")
                || texto.contains("internet")
                || texto.contains("telefone")
                || texto.contains("celular")
                || texto.matches(".*\\bgas\\b.*")) {
            return TransactionCategory.UTILITARIOS;
        }

        // Moradia
        if (texto.contains("aluguel")
                || texto.contains("condominio")
                || texto.contains("imovel")) {
            return TransactionCategory.MORADIA;
        }

        // Investimentos
        if (texto.contains("investimento")
                || texto.contains("acao")
                || texto.contains("acoes")
                || texto.contains("tesouro")
                || texto.contains("cdb")
                || texto.contains("fii")
                || texto.contains("bitcoin")
                || texto.contains("cripto")) {
            return TransactionCategory.INVESTIMENTO;
        }

        // Compras
        if (texto.contains("amazon")
                || texto.contains("mercado livre")
                || texto.contains("magalu")
                || texto.contains("shopping")
                || texto.contains("loja")
                || texto.contains("roupa")
                || texto.contains("tenis")
                || texto.contains("sapato")) {
            return TransactionCategory.COMPRAS;
        }

        // Saúde
        if (texto.contains("farmacia")
                || texto.contains("consulta")
                || texto.contains("hospital")
                || texto.contains("clinica")
                || texto.contains("dentista")
                || texto.contains("plano de saude")
                || texto.contains("exame")) {
            return TransactionCategory.SAUDE;
        }

        // Entretenimento
        if (texto.contains("cinema")
                || texto.contains("netflix")
                || texto.contains("spotify")
                || texto.contains("show")
                || texto.contains("bar")
                || texto.contains("viagem")
                || texto.contains("jogo")
                || texto.contains("steam")) {
            return TransactionCategory.ENTRETENIMENTO;
        }

        // Transporte
        if (texto.contains("uber")
                || texto.contains("99")
                || texto.contains("taxi")
                || texto.contains("onibus")
                || texto.contains("metro")
                || texto.contains("combustivel")
                || texto.contains("gasolina")
                || texto.contains("estacionamento")
                || texto.contains("pedagio")) {
            return TransactionCategory.TRAJETO;
        }

        // Salário
        if (texto.contains("salario")
                || texto.contains("pagamento")
                || texto.contains("empresa")
                || texto.contains("folha")
                || texto.contains("bonus")) {
            return TransactionCategory.SALARIO;
        }

        return TransactionCategory.OUTROS;
    }

}
