package com.specit.productlist.api.dto;

public record ValidationErrorDto(
    String field,
    String message
) {}
