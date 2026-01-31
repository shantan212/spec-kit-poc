package com.specit.productlist.api.dto;

import java.util.UUID;

public record ProductDto(
        UUID id,
        String name,
        String descriptionSummary,
        String imageUrl,
        MoneyDto price,
        boolean isAvailable,
        CategoryDto category
) {
}
