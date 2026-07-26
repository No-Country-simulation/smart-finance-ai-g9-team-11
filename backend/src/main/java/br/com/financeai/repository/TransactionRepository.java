package br.com.financeai.repository;

import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.Transaction;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUsuarioAndDataTransacaoBetween(AppUser user, LocalDate dataInical, LocalDate dataFinal);
}
