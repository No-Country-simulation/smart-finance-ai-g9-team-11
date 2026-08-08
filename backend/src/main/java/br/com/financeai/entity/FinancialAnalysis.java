package br.com.financeai.entity;

import br.com.financeai.enums.Source;
import br.com.financeai.enums.FinancialProfile;
import br.com.financeai.enums.SavingFrequency;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "analises_financeiras")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class FinancialAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 5, scale = 3)
    private BigDecimal nivelEndividamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SavingFrequency frequenciaPoupanca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FinancialProfile perfilFinanceiro;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal probabilidade;

    @Column(nullable = false)
    private LocalDate dataAnalise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private AppUser usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Source origem;

}
