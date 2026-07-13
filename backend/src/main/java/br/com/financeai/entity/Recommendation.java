package br.com.financeai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.security.PrivateKey;

@Entity
@Table(name = "recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mensagem;

    @ManyToOne
    @JoinColumn(name = "analysis_id")
    private FinancialAnalysis analysis;

}
