package com.specit.productlist.api.dto;

import com.specit.productlist.model.User;

import java.time.Instant;
import java.util.UUID;

public record UserResponseDto(
    UUID id,
    String email,
    String name,
    String status,
    Instant createdAt
) {
    public static UserResponseDto from(User user) {
        return new UserResponseDto(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getStatus().name(),
            user.getCreatedAt()
        );
    }
}
