package br.com.financeai.repository;

import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Acesso a dados de transações.
 */
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Busca uma transação somente quando ela pertence ao usuário informado.
     * <p>
     * Essa consulta evita que um usuário acesse uma transação de outro
     * usuário apenas conhecendo o identificador do registro.
     */
    Optional<Transaction> findByIdAndUsuarioId(Long transactionId, Long usuarioId
    );

    /**
     * Lista todas as transações do usuário, ordenando primeiro
     * pelas movimentações mais recentes.
     */
    List<Transaction> findAllByUsuarioIdOrderByDataDescIdDesc(Long usuarioId
    );

    /**
     * Lista as transações do usuário dentro de um período.
     */
    List<Transaction>
    findAllByUsuarioIdAndDataBetweenOrderByDataDescIdDesc(Long usuarioId, LocalDate dataInicial, LocalDate dataFinal
    );

    /**
     * Busca as transações do usuário dentro de um período — usada pela
     * análise financeira para montar o histórico que será enviado à IA.
     */
    List<Transaction> findByUsuarioAndDataBetween(AppUser user, LocalDate dataInical, LocalDate dataFinal);

    /**
     * Verifica se já existe uma transação idêntica (mesmo usuário, descrição,
     * valor e data) — usada para evitar cadastro duplicado por reenvio
     * acidental (double-click, retry do frontend, etc.).
     */
    boolean existsByUsuarioAndDescricaoAndValorAndData(AppUser usuario, String descricao, BigDecimal valor, LocalDate data);
}