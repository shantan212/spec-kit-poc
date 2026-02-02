package com.specit.productlist.service;

import com.specit.productlist.api.dto.CreateUserRequestDto;
import com.specit.productlist.api.dto.UserResponseDto;
import com.specit.productlist.api.exception.EmailAlreadyExistsException;
import com.specit.productlist.model.User;
import com.specit.productlist.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder(12);
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    void createUser_hashesPasswordWithBCrypt() {
        CreateUserRequestDto request = new CreateUserRequestDto(
            "test@example.com",
            "Test User",
            "SecurePass123"
        );

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            return user;
        });

        userService.createUser(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getPasswordHash()).isNotEqualTo("SecurePass123");
        assertThat(savedUser.getPasswordHash()).startsWith("$2a$12$");
        assertThat(passwordEncoder.matches("SecurePass123", savedUser.getPasswordHash())).isTrue();
    }

    @Test
    void createUser_samePasswordDifferentHashes() {
        String password = "SecurePass123";

        CreateUserRequestDto request1 = new CreateUserRequestDto("user1@example.com", "User 1", password);
        CreateUserRequestDto request2 = new CreateUserRequestDto("user2@example.com", "User 2", password);

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.createUser(request1);
        userService.createUser(request2);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(2)).save(userCaptor.capture());

        var savedUsers = userCaptor.getAllValues();
        String hash1 = savedUsers.get(0).getPasswordHash();
        String hash2 = savedUsers.get(1).getPasswordHash();

        assertThat(hash1).isNotEqualTo(hash2);
        assertThat(passwordEncoder.matches(password, hash1)).isTrue();
        assertThat(passwordEncoder.matches(password, hash2)).isTrue();
    }

    @Test
    void userResponse_doesNotContainPassword() {
        CreateUserRequestDto request = new CreateUserRequestDto(
            "test@example.com",
            "Test User",
            "SecurePass123"
        );

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDto response = userService.createUser(request);

        assertThat(response).hasNoNullFieldsOrPropertiesExcept("id", "createdAt");
        assertThat(response.toString()).doesNotContain("SecurePass123");
        assertThat(response.toString()).doesNotContain("password");
    }

    @Test
    void createUser_withExistingEmail_throwsException() {
        CreateUserRequestDto request = new CreateUserRequestDto(
            "existing@example.com",
            "Test User",
            "SecurePass123"
        );

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(request))
            .isInstanceOf(EmailAlreadyExistsException.class)
            .hasMessageContaining("existing@example.com");

        verify(userRepository, never()).save(any());
    }
}
