package com.specit.productlist.api;

import com.specit.productlist.api.dto.ErrorResponseDto;
import com.specit.productlist.infra.CorrelationIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler({ConstraintViolationException.class, MethodArgumentNotValidException.class, IllegalArgumentException.class})
    public ResponseEntity<ErrorResponseDto> handleBadRequest(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponseDto(new ErrorResponseDto.ErrorBody(
                        "BAD_REQUEST",
                        "Invalid request parameters",
                        correlationId()
                )));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGeneric(Exception ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDto(new ErrorResponseDto.ErrorBody(
                        "INTERNAL_ERROR",
                        "Unexpected server error",
                        correlationId()
                )));
    }

    private String correlationId() {
        String v = MDC.get(CorrelationIdFilter.MDC_KEY);
        return v == null || v.isBlank() ? null : v;
    }
}
