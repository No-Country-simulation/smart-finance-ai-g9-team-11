package br.com.financeai.controller;

import br.com.financeai.dto.request.UserUpdateDto;
import br.com.financeai.dto.response.UserResponseDto;
import br.com.financeai.entity.AppUser;
import br.com.financeai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> obterPerfil(@AuthenticationPrincipal AppUser usuarioLogado) {
        UserResponseDto response = userService.buscarPerfil(usuarioLogado);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> atualizarPerfil(
            @AuthenticationPrincipal AppUser usuarioLogado,
            @RequestBody @Valid UserUpdateDto dto) {
        UserResponseDto response = userService.atualizarPerfil(usuarioLogado, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> desativarConta(@AuthenticationPrincipal AppUser usuarioLogado) {
        userService.desativarConta(usuarioLogado);
        return ResponseEntity.noContent().build();
    }
}