package com.specit.productlist.api.dto;

import java.util.List;

public record ProductListResponseDto(
        List<ProductDto> items,
        int page,
        int pageSize,
        long totalItems,
        int totalPages
) {
}
