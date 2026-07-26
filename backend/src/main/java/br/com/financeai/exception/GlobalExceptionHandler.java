package br.com.financeai.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {

                String message = ex.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .collect(Collectors.joining(", "));

                ApiErrorResponse error = new ApiErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        HttpStatus.BAD_REQUEST.getReasonPhrase(),
                        message,
                        request.getRequestURI()
                );

                return ResponseEntity.badRequest().body(error);

    }
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {

        ApiErrorResponse error = new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRequest(
            InvalidRequestException ex,
            HttpServletRequest request) {

        ApiErrorResponse error = new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ApiErrorResponse> handleExternalService(
            ExternalServiceException ex,
            HttpServletRequest request) {

        ApiErrorResponse error = new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    @ExceptionHandler({DatabaseException.class, DataAccessException.class})
    public ResponseEntity<ApiErrorResponse> handleDatabase(
            Exception ex,
            HttpServletRequest request) {

        ApiErrorResponse error = new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "Erro no Banco de Dados.",
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request) {

        ApiErrorResponse error = new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "Ocorreu um erro inesperado.",
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUserNotFound(UserNotFoundException ex, HttpServletRequest request){
        ApiErrorResponse error = new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
