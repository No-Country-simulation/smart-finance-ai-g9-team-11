package br.com.financeai.controller;

import br.com.financeai.dto.request.UserRegisterDto;
import br.com.financeai.dto.request.UserUpdateDto;
import br.com.financeai.dto.response.UserResponseDto;
import br.com.financeai.entity.AppUser;
import br.com.financeai.exception.ApiErrorResponse;
import br.com.financeai.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Endpoints de gestão do próprio perfil do usuário autenticado:
 * consulta, atualização parcial e desativação de conta.
 */
@Tag(
        name = "Users",
        description = "Protected endpoints for managing the authenticated user's profile."
)
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

    @PostMapping
    public ResponseEntity<UserResponseDto> cadastrar(@RequestBody @Valid UserRegisterDto dto, UriComponentsBuilder uriBuilder) {
        UserResponseDto response = userService.cadastrar(dto);
        var uri = uriBuilder.path("/users/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @Operation(
            summary = "Get authenticated user",
            description = """
                Returns the profile information of the currently authenticated user.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Identifies the user from the token and returns their profile data
                without exposing sensitive information such as the password.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> obterPerfil(@AuthenticationPrincipal AppUser usuarioLogado) {
        UserResponseDto response = userService.buscarPerfil(usuarioLogado);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Update authenticated user",
            description = """
                Updates the profile information of the currently authenticated user.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Allows the authenticated user to update their own account information.
                If the email is changed, the new address must not already belong to
                another user. A new password is encrypted before being stored.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class)
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
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
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
    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> atualizarPerfil(
            @AuthenticationPrincipal AppUser usuarioLogado,
            @RequestBody @Valid UserUpdateDto dto) {
        UserResponseDto response = userService.atualizarPerfil(usuarioLogado, dto);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Deactivate authenticated user",
            description = """
                Deactivates the currently authenticated user's account.

                Authentication:
                Requires a valid JWT access token in the Authorization header using
                the format: Bearer {token}.

                Behavior:
                Performs a logical deletion by marking the account as inactive.
                The user record remains stored in the database, but the account
                must no longer be authorized to access protected endpoints.
                """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "User deactivated successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ApiErrorResponse.class)
                    )
            )
    })
    @DeleteMapping("/me")
    public ResponseEntity<Void> desativarConta(@AuthenticationPrincipal AppUser usuarioLogado) {
        userService.desativarConta(usuarioLogado);
        return ResponseEntity.noContent().build();
    }
}