package br.com.financeai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(
            name = "nome",
            nullable = false,
            length = 100
    )
    private String nome;

    @Column(
            name = "email",
            nullable = false,
            unique = true,
            length = 150
    )
    private String email;

    @Column(
            name = "senha",
            nullable = false,
            length = 255
    )
    private String senha;

    @Column(
            name = "ativo",
            nullable = false
    )
    private boolean ativo = true;

    @OneToMany(mappedBy = "usuario")
    private List<FinancialAnalysis> analisesFinanceiras = new ArrayList<>();

    /*
     * O mappedBy aponta para o atributo "usuario" da entidade Transaction.
     * O usuário passa a ser o proprietário lógico de suas movimentações.
     */
    @OneToMany(mappedBy = "usuario")
    private List<Transaction> transacoes = new ArrayList<>();
}