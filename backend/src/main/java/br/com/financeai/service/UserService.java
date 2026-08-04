package br.com.financeai.service;

import br.com.financeai.dto.request.UserRegisterDto;
import br.com.financeai.dto.request.UserUpdateDto;
import br.com.financeai.dto.response.UserResponseDto;
import br.com.financeai.entity.AppUser;
import br.com.financeai.exception.UserAlreadyExistsException;
import br.com.financeai.exception.UserNotFoundException;
import br.com.financeai.repository.UserRepository;
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
            throw new UserAlreadyExistsException("E-mail já cadastrado no sistema.");
        }

        AppUser usuario = new AppUser();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setAtivo(true);

        userRepository.save(usuario);
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
        usuario.setAtivo(false);
    }
}
