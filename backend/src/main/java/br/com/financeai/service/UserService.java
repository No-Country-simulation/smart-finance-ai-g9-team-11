package br.com.financeai.service;

import br.com.financeai.dto.request.DadosAutenticacao;
import br.com.financeai.dto.request.UserRegisterDto;
import br.com.financeai.dto.request.UserUpdateDto;
import br.com.financeai.dto.response.UserResponseDto;
import br.com.financeai.entity.AppUser;
import br.com.financeai.exception.*;
import br.com.financeai.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

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

    public UserResponseDto buscarPerfil(AppUser usuarioLogado) {
        return new UserResponseDto(usuarioLogado);
    }

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

    @Transactional
    public void reativarConta(DadosAutenticacao dados) {
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
