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
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import br.com.financeai.exception.ApiErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@Tag(
        name = "Authentication",
        description = "Public endpoints for user authentication and account reactivation."
)
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Operation(
            summary = "Authenticate user",
            description = """
                Authenticates a user and returns a JWT access token.

                Authentication:
                This endpoint is public and does not require a JWT token.

                Behavior:
                Validates the provided email and password. When the credentials are
                valid, returns a token that must be sent to protected endpoints in
                the Authorization header using the format: Bearer {token}.
                """
    )
    @SecurityRequirements
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User authenticated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DadosTokenJWT.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid email or password",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @PostMapping("/login")
    public ResponseEntity<DadosTokenJWT>  efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {

        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());

        try {
            var authentication = manager.authenticate(authenticationToken);

            var usuario = (AppUser) authentication.getPrincipal();
            var tokenJWT = tokenService.gerarToken(usuario.getEmail());

            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));

        } catch (DisabledException ex) {
            throw new AuthenticationException("Esta conta está desativada. Reative sua conta para continuar.");

        } catch (BadCredentialsException ex) {
            throw new AuthenticationException("E-mail ou senha inválidos.");
        }
    }

    @Operation(
            summary = "Reactivate user account",
            description = """
            Reactivates a previously deactivated user account.

            Authentication:
            This endpoint is public and does not require a JWT token.

            Behavior:
            Validates the provided email and password. If the credentials
            are correct and the account is currently inactive, the account
            is reactivated and can authenticate normally again.
            """
    )
    @SecurityRequirements
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "User account reactivated successfully"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid email or password",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "User account is already active",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    implementation = ApiErrorResponse.class
                            )
                    )
            )
    })
    @PostMapping("/reactivate")
    public ResponseEntity<Void> reativarConta(
            @RequestBody @Valid DadosAutenticacao dados
    ) {
        userService.reativarConta(dados);
        return ResponseEntity.noContent().build();
    }

}
