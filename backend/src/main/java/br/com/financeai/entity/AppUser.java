package br.com.financeai.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private boolean ativo = true;

    @OneToMany(mappedBy = "usuario")
    private List<FinancialAnalysis> analisesFinanceiras = new ArrayList<>();

//    private LocalDateTime dataCriacao;

//    @UpdateTimestamp
//    private LocalDateTime dataAtualizacao;

}

