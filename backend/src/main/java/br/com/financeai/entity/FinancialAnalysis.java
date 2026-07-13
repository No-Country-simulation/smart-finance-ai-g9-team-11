package br.com.financeai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "financial_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class FinancialAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal rendaMensal;

    private int nivelEndividamento;

    private String frequenciaPoupanca;

    private String perfilFinanceiro;

    private int probabilidade;

    private LocalDateTime dataAnalise;

    List<Transaction> transacoes;

    List<Recommendation> recomendacoes;

}
