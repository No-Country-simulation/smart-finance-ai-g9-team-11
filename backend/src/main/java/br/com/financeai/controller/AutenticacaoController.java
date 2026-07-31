package br.com.financeai.controller;

import br.com.financeai.dto.request.DadosAutenticacao;
import br.com.financeai.dto.response.DadosTokenJWT;
import br.com.financeai.entity.AppUser;
import br.com.financeai.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity efectuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        var usuario = (AppUser) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken(usuario.getEmail()); // ou usuario.getUsername()

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }
}
