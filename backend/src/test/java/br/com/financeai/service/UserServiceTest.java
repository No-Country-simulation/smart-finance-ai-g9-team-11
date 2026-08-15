package br.com.financeai.service;

import br.com.financeai.dto.request.AuthenticationRequest;
import br.com.financeai.dto.request.UserRegisterDto;
import br.com.financeai.dto.request.UserUpdateDto;
import br.com.financeai.dto.response.UserResponseDto;
import br.com.financeai.entity.AppUser;
import br.com.financeai.exception.AuthenticationException;
import br.com.financeai.exception.BusinessException;
import br.com.financeai.exception.UserAlreadyExistsException;
import br.com.financeai.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService service;

    @Test
    void shouldRegisterUserSuccessfully() {
        UserRegisterDto dto = new UserRegisterDto(
                "Amanda",
                "amanda@email.com",
                "123456"
        );

        when(userRepository.existsByEmail(dto.email())).thenReturn(false);
        when(passwordEncoder.encode(dto.senha())).thenReturn("senha-criptografada");

        when(userRepository.save(any(AppUser.class))).thenAnswer(invocation -> {
            AppUser user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        UserResponseDto response = service.cadastrar(dto);

        assertEquals(1L, response.id());
        assertEquals("Amanda", response.nome());
        assertEquals("amanda@email.com", response.email());
        assertTrue(response.ativo());

        verify(userRepository).save(any(AppUser.class));
        verify(passwordEncoder).encode("123456");
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExistsForActiveUser() {
        UserRegisterDto dto = new UserRegisterDto(
                "Amanda",
                "amanda@email.com",
                "123456"
        );

        AppUser existingUser = createUser(1L, "Amanda", "amanda@email.com", "senha", true);

        when(userRepository.existsByEmail(dto.email())).thenReturn(true);
        when(userRepository.findByEmail(dto.email())).thenReturn(Optional.of(existingUser));

        assertThrows(UserAlreadyExistsException.class, () -> service.cadastrar(dto));

        verify(userRepository, never()).save(any(AppUser.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void shouldThrowBusinessExceptionWhenEmailBelongsToInactiveUser() {
        UserRegisterDto dto = new UserRegisterDto(
                "Amanda",
                "amanda@email.com",
                "123456"
        );

        AppUser inactiveUser = createUser(1L, "Amanda", "amanda@email.com", "senha", false);

        when(userRepository.existsByEmail(dto.email())).thenReturn(true);
        when(userRepository.findByEmail(dto.email())).thenReturn(Optional.of(inactiveUser));

        assertThrows(BusinessException.class, () -> service.cadastrar(dto));

        verify(userRepository, never()).save(any(AppUser.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void shouldUpdateUserProfileSuccessfully() {
        AppUser loggedUser = createUser(1L, "Amanda", "antigo@email.com", "senha-antiga", true);

        UserUpdateDto dto = new UserUpdateDto(
                "Amanda Cristiny",
                "novo@email.com",
                "654321"
        );

        when(userRepository.findById(loggedUser.getId())).thenReturn(Optional.of(loggedUser));
        when(userRepository.existsByEmail(dto.email())).thenReturn(false);
        when(passwordEncoder.encode(dto.senha())).thenReturn("nova-senha-criptografada");

        UserResponseDto response = service.atualizarPerfil(loggedUser, dto);

        assertEquals(1L, response.id());
        assertEquals("Amanda Cristiny", response.nome());
        assertEquals("novo@email.com", response.email());
        assertTrue(response.ativo());

        assertEquals("nova-senha-criptografada", loggedUser.getSenha());

        verify(passwordEncoder).encode("654321");
    }

    @Test
    void shouldDeactivateAccountSuccessfully() {
        AppUser loggedUser = createUser(1L, "Amanda", "amanda@email.com", "senha", true);

        when(userRepository.findById(loggedUser.getId())).thenReturn(Optional.of(loggedUser));

        service.desativarConta(loggedUser);

        assertFalse(loggedUser.isAtivo());
        verify(userRepository).save(loggedUser);
    }

    @Test
    void shouldReactivateAccountSuccessfully() {
        AuthenticationRequest request = new AuthenticationRequest(
                "amanda@email.com",
                "123456"
        );

        AppUser inactiveUser = createUser(1L, "Amanda", "amanda@email.com", "senha-criptografada", false);

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(inactiveUser));
        when(passwordEncoder.matches(request.senha(), inactiveUser.getSenha())).thenReturn(true);

        service.reativarConta(request);

        assertTrue(inactiveUser.isAtivo());
        verify(userRepository).save(inactiveUser);
    }

    @Test
    void shouldThrowExceptionWhenReactivationPasswordIsInvalid() {
        AuthenticationRequest request = new AuthenticationRequest(
                "amanda@email.com",
                "senha-errada"
        );

        AppUser inactiveUser = createUser(1L, "Amanda", "amanda@email.com", "senha-criptografada", false);

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(inactiveUser));
        when(passwordEncoder.matches(request.senha(), inactiveUser.getSenha())).thenReturn(false);

        assertThrows(AuthenticationException.class, () -> service.reativarConta(request));

        assertFalse(inactiveUser.isAtivo());
        verify(userRepository, never()).save(any(AppUser.class));
    }

    private AppUser createUser(
            Long id,
            String nome,
            String email,
            String senha,
            boolean ativo
    ) {
        AppUser user = new AppUser();
        user.setId(id);
        user.setNome(nome);
        user.setEmail(email);
        user.setSenha(senha);
        user.setAtivo(ativo);
        return user;
    }
}
