package com.specit.productlist.api.dto;

public record ErrorResponseDto(ErrorBody error) {
    public record ErrorBody(String code, String message, String correlationId) {
    }
}
