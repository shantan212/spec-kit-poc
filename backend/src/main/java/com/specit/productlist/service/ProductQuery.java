package com.specit.productlist.service;

import java.util.UUID;

public record ProductQuery(
        String q,
        UUID categoryId,
        Sort sort,
        int page,
        int pageSize
) {
    public enum Sort {
        name_asc,
        price_asc
    }
}
