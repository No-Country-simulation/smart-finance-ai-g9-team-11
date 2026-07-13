package br.com.financeai.repository;

import br.com.financeai.entity.FinancialAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialAnalysisRepository extends JpaRepository<FinancialAnalysis, Long> {
}
