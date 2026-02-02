package com.specit.productlist.api.dto;

import java.util.List;

public record ErrorResponseDto(ErrorBody error) {
    public record ErrorBody(
        String code, 
        String message, 
        String correlationId,
        List<ValidationErrorDto> details
    ) {
        public ErrorBody(String code, String message, String correlationId) {
            this(code, message, correlationId, null);
        }
    }
}
