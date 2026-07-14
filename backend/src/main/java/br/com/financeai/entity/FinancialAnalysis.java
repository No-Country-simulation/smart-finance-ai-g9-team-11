package br.com.financeai.entity;

import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    private Double nivelEndividamento;

    @Enumerated(EnumType.STRING)
    private SavingFrequency frequenciaPoupanca;

    @Enumerated(EnumType.STRING)
    private FinancialProfile perfilFinanceiro;

    private BigDecimal probabilidade;

    @Column(nullable = false)
    private LocalDateTime dataAnalise;

    @OneToMany(
            mappedBy = "analysis",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Transaction> transacoes = new ArrayList<>();

    @OneToMany(
            mappedBy = "analysis",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Recommendation> recomendacoes = new ArrayList<>();

}
