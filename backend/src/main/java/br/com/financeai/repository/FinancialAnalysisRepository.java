package br.com.financeai.repository;

import br.com.financeai.entity.FinancialAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Acesso a dados de análises financeiras.
 */
public interface FinancialAnalysisRepository extends JpaRepository<FinancialAnalysis, Long> {

    /**
     * Busca uma análise somente quando ela pertence ao usuário informado,
     * evitando exposição de dados de terceiros.
     */
    Optional<FinancialAnalysis> findByIdAndUsuarioId(Long analysisId, Long usuarioId);

    /**
     * Lista o histórico de análises do usuário, da mais recente para a mais antiga.
     */
    List<FinancialAnalysis> findAllByUsuarioIdOrderByDataAnaliseDescIdDesc(Long usuarioId);
}
