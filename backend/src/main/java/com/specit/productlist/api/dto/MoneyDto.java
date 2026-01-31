package com.specit.productlist.api.dto;

import java.math.BigDecimal;

public record MoneyDto(BigDecimal amount, String currency) {
}
