package br.com.financeai.service;

import br.com.financeai.dto.request.AuthenticationRequest;
import br.com.financeai.dto.request.UserRegisterDto;
import br.com.financeai.dto.request.UserUpdateDto;
import br.com.financeai.dto.response.UserResponseDto;
import br.com.financeai.entity.AppUser;
import br.com.financeai.exception.*;
import br.com.financeai.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Responsável pelo ciclo de vida da conta do usuário: cadastro, consulta
 * e atualização de perfil, desativação e reativação de conta.
 * <p>
 * A conta é removida via soft delete ({@code ativo = false}) em vez de
 * exclusão física, preservando o histórico de transações e análises
 * vinculado ao usuário.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Cadastra um novo usuário, criptografando a senha antes de persistir.
     *
     * @param dto dados de cadastro (nome, e-mail e senha em texto puro).
     * @return resposta contendo os dados públicos do usuário recém-criado.
     * @throws BusinessException caso o e-mail informado pertença a uma conta desativada.
     * @throws UserAlreadyExistsException caso o e-mail já esteja em uso por uma conta ativa.
     * @throws DatabaseException caso duas requisições concorrentes cadastrem o mesmo e-mail
     *         simultaneamente, e a constraint de unicidade do banco rejeite o registro.
     */
    @Transactional
    public UserResponseDto cadastrar(UserRegisterDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            AppUser existente = userRepository.findByEmail(dto.email()).get();
            if (!existente.isAtivo()) {
                throw new BusinessException("Este e-mail pertence a uma conta desativada. Entre em contato com o suporte para reativação.");
            }
            throw new UserAlreadyExistsException("E-mail já cadastrado no sistema.");
        }

        AppUser usuario = new AppUser();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setAtivo(true);

        try {
            userRepository.save(usuario);
        } catch (DataIntegrityViolationException ex) {

            throw new DatabaseException("E-mail já cadastrado no sistema.", ex);
        }

        return new UserResponseDto(usuario);
    }

    /**
     * Retorna o perfil do usuário autenticado.
     *
     * @param usuarioLogado usuário extraído do token JWT.
     * @return resposta contendo os dados públicos do usuário.
     */
    public UserResponseDto buscarPerfil(AppUser usuarioLogado) {
        return new UserResponseDto(usuarioLogado);
    }

    /**
     * Atualiza parcialmente o perfil do usuário autenticado — apenas os
     * campos enviados (não nulos e não vazios) são alterados.
     *
     * @param usuarioLogado usuário extraído do token JWT.
     * @param dto campos a serem atualizados (nome, e-mail e/ou senha), todos opcionais.
     * @return resposta contendo os dados públicos do usuário após a atualização.
     * @throws UserNotFoundException caso o usuário não seja encontrado no banco de dados.
     * @throws UserAlreadyExistsException caso o novo e-mail informado já esteja em uso por outra conta.
     */
    @Transactional
    public UserResponseDto atualizarPerfil(AppUser usuarioLogado, UserUpdateDto dto) {
        AppUser usuario = userRepository.findById(usuarioLogado.getId())
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));

        if (dto.email() != null && !dto.email().isBlank() && !dto.email().equalsIgnoreCase(usuario.getEmail())) {
            if (userRepository.existsByEmail(dto.email())) {
                throw new UserAlreadyExistsException("O e-mail informado já está em uso.");
            }
            usuario.setEmail(dto.email());
        }

        if (dto.nome() != null && !dto.nome().isBlank()) {
            usuario.setNome(dto.nome());
        }

        if (dto.senha() != null && !dto.senha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.senha()));
        }

        return new UserResponseDto(usuario);
    }

    /**
     * Desativa a conta do usuário autenticado (soft delete).
     *  <p>
     * Uma conta desativada não consegue mais autenticar — nem via login
     * normal, nem através de um token JWT emitido antes da desativação.
     *
     * @param usuarioLogado usuário extraído do token JWT.
     * @throws UserNotFoundException caso o usuário não seja encontrado no banco de dados.
     * @throws BusinessException caso a conta já esteja desativada.
     */
    @Transactional
    public void desativarConta(AppUser usuarioLogado) {
        AppUser usuario = userRepository.findById(usuarioLogado.getId())
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));

        if (!usuario.isAtivo()) {
            throw new BusinessException("Esta conta já está desativada.");
        }

        usuario.setAtivo(false);
        userRepository.save(usuario);
    }

    /**
     * Reativa uma conta desativada, validando a senha diretamente contra o
     * hash salvo — não passa pelo {@code AuthenticationManager}, já que ele
     * rejeitaria a autenticação de uma conta desabilitada por padrão.
     *
     * @param dados e-mail e senha da conta a ser reativada.
     * @throws UserNotFoundException caso não exista usuário com o e-mail informado.
     * @throws BusinessException caso a conta já esteja ativa.
     * @throws AuthenticationException caso a senha informada esteja incorreta.
     */
    @Transactional
    public void reativarConta(AuthenticationRequest dados) {
        AppUser usuario = userRepository.findByEmail(dados.email())
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));

        if (usuario.isAtivo()) {
            throw new BusinessException("Esta conta já está ativa.");
        }

        if (!passwordEncoder.matches(dados.senha(), usuario.getSenha())) {
            throw new AuthenticationException("E-mail ou senha inválidos.");
        }

        usuario.setAtivo(true);
        userRepository.save(usuario);
    }
}
