package api.transport.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler
{
    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomErrorResponse> handleAllException(Exception ex, WebRequest request){
        CustomErrorResponse err = new CustomErrorResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));
        log.info(ex.getMessage());
        return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ModelNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleModelNotFoundException(ModelNotFoundException ex, WebRequest request){
        CustomErrorResponse err = new CustomErrorResponse(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));

        return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField().toUpperCase().concat(": ").concat(Objects.requireNonNull(e.getDefaultMessage()))
                ).collect(Collectors.joining(","));

        CustomErrorResponse err = new CustomErrorResponse(LocalDateTime.now(), msg, request.getDescription(false));

        return new ResponseEntity<>(err, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(LoadRequestStatusException.class)
    public ResponseEntity<CustomErrorResponse> handleLoadRequestStatus(LoadRequestStatusException ex, WebRequest req) {
        CustomErrorResponse err = new CustomErrorResponse(
                LocalDateTime.now(),
                ex.getMessage(),
                req.getDescription(false)
        );
        return new ResponseEntity<>(err, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<CustomErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            WebRequest request) {

        // Como getMostSpecificCause() nunca es null, podemos invocar getMessage() directamente
        String rootMsg = ex.getMostSpecificCause().getMessage();

        // Extraemos sólo la parte "Detail:..." si existe
        String userMessage = Optional.ofNullable(rootMsg)
                .filter(msg -> msg.contains("Detail:"))
                .map(msg -> msg.substring(msg.indexOf("Detail:") + 7).trim())
                .orElse(rootMsg);

        CustomErrorResponse err = new CustomErrorResponse(
                LocalDateTime.now(),
                userMessage,
                request.getDescription(false)
        );

        log.error("Violación de integridad: {}", userMessage);
        return new ResponseEntity<>(err, HttpStatus.CONFLICT);
    }
}
