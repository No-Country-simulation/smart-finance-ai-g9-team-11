package br.com.financeai.repository;

import br.com.financeai.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Acesso a dados de usuários.
 */
public interface UserRepository extends JpaRepository<AppUser, Long> {

    /**
     * Verifica se já existe um usuário cadastrado com o e-mail informado.
     */
    boolean existsByEmail(String email);

    /**
     * Busca um usuário pelo e-mail — usado tanto na autenticação
     * quanto na validação de duplicidade de cadastro.
     */
    Optional<AppUser> findByEmail(String email);
}