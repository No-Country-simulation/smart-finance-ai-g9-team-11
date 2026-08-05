package br.com.financeai.controller;

import br.com.financeai.dto.request.DadosAutenticacao;
import br.com.financeai.dto.request.UserRegisterDto;
import br.com.financeai.dto.response.DadosTokenJWT;
import br.com.financeai.dto.response.UserResponseDto;
import br.com.financeai.entity.AppUser;
import br.com.financeai.exception.AuthenticationException;
import br.com.financeai.security.TokenService;
import br.com.financeai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {

        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());

            try {
                var authentication = manager.authenticate(authenticationToken);

                var usuario = (AppUser) authentication.getPrincipal();
                var tokenJWT = tokenService.gerarToken(usuario.getEmail());

            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));

        } catch (BadCredentialsException ex) {
            // Traduz o erro do Spring Security para a exceção de domínio do projeto,
            // que já é tratada de forma padronizada pelo GlobalExceptionHandler.
            throw new AuthenticationException(ex.getMessage());
        }
    }

    @PostMapping("/reactivate")
    public ResponseEntity<Void> reativarConta(@RequestBody @Valid DadosAutenticacao dados) {
        userService.reativarConta(dados);
        return ResponseEntity.noContent().build();
    }

}
