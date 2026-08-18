package br.com.financeai.exception;

/**
 * Lançada quando os dados de uma requisição são estruturalmente inválidos
 * (ex: datas fora de ordem, campos obrigatórios ausentes em uma combinação).
 */
public class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }
}
