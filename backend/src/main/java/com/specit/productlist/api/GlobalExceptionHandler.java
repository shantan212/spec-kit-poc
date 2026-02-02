package com.specit.productlist.api;

import com.specit.productlist.api.dto.ErrorResponseDto;
import com.specit.productlist.api.dto.ValidationErrorDto;
import com.specit.productlist.api.exception.EmailAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        log.warn("Email already exists: {}", ex.getEmail());
        
        var errorBody = new ErrorResponseDto.ErrorBody(
            "EMAIL_ALREADY_EXISTS",
            "A user with this email address already exists",
            MDC.get("correlationId")
        );
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponseDto(errorBody));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationErrors(MethodArgumentNotValidException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        
        List<ValidationErrorDto> details = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> new ValidationErrorDto(error.getField(), error.getDefaultMessage()))
            .toList();
        
        var errorBody = new ErrorResponseDto.ErrorBody(
            "VALIDATION_ERROR",
            "Invalid request parameters",
            MDC.get("correlationId"),
            details
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDto(errorBody));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);
        
        var errorBody = new ErrorResponseDto.ErrorBody(
            "INTERNAL_ERROR",
            "An unexpected error occurred",
            MDC.get("correlationId")
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDto(errorBody));
    }
}
