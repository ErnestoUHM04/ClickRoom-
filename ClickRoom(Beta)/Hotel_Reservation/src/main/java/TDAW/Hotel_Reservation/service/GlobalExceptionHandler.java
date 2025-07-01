package TDAW.Hotel_Reservation.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntimeException(RuntimeException ex, WebRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                "RuntimeException",
                ex.getMessage(),
                System.currentTimeMillis()
        );
        // Puedes cambiar el status si lo consideras (400, 500, etc.)
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        // Extraemos todos los mensajes de error y los unimos en una sola cadena
        String joinedMessages = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> "[" + fe.getField() + ": " + fe.getDefaultMessage() + "]")
                .collect(Collectors.joining(" "));

        ApiErrorResponse body = new ApiErrorResponse(
                "MethodArgumentNotValidException",
                joinedMessages,
                System.currentTimeMillis()
        );
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex) {
        ApiErrorResponse body = new ApiErrorResponse(
                "UnexpectedException",
                ex.getMessage() != null ? ex.getMessage() : "Error desconocido",
                System.currentTimeMillis()
        );
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}