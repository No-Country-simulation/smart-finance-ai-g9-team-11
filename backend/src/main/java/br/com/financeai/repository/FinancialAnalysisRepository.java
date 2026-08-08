package br.com.financeai.repository;

import br.com.financeai.entity.FinancialAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FinancialAnalysisRepository extends JpaRepository<FinancialAnalysis, Long> {


    Optional<FinancialAnalysis> findByIdAndUsuarioId(
            Long analysisId,
            Long usuarioId
    );

    List<FinancialAnalysis> findAllByUsuarioIdOrderByDataAnaliseDescIdDesc(
            Long usuarioId
    );

}
