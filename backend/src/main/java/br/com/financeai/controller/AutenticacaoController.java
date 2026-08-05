package br.com.financeai.controller;

import br.com.financeai.dto.request.DadosAutenticacao;
import br.com.financeai.dto.request.UserRegisterDto;
import br.com.financeai.dto.response.DadosTokenJWT;
import br.com.financeai.dto.response.UserResponseDto;
import br.com.financeai.entity.AppUser;
import br.com.financeai.security.TokenService;
import br.com.financeai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
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
        name="Authentication",
        description = "Public endpoints for user registration and authentication"
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
        var authentication = manager.authenticate(authenticationToken);

        var usuario = (AppUser) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken(usuario.getEmail()); // ou usuario.getUsername()

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }

    @Operation(
            summary = "Register a new user",
            description = """
                Creates a new user account.

                Authentication:
                This endpoint is public and does not require a JWT token.

                Behavior:
                Validates the registration data, requires a unique email address
                and encrypts the password before storing it. The password is never
                included in the API response.
                """
    )
    @SecurityRequirements
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid registration data",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Email address already registered",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> cadastrar(@RequestBody @Valid UserRegisterDto dto, UriComponentsBuilder uriBuilder) {
        UserResponseDto response = userService.cadastrar(dto);
        var uri = uriBuilder.path("/users/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }
}
