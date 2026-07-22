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

    @Column(nullable = false)
    private BigDecimal rendaMensal;

    @Column(nullable = false)
    private Integer nivelEndividamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SavingFrequency frequenciaPoupanca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FinancialProfile perfilFinanceiro;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal probabilidade;

    @OneToMany(mappedBy = "analise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transacoes = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime dataAnalise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private AppUser usuario;

    public void addTransaction(Transaction transaction) {
        transacoes.add(transaction);
        transaction.setAnalise(this);
    }
}
