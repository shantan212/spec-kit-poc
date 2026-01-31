package com.specit.productlist.api;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class OpenApiContractTest {

    @Test
    void openApiContractFileExistsAndHasExpectedPaths() throws IOException {
        Path openApi = findRepoRoot().resolve("specs/001-product-list/contracts/openapi.yaml");
        assertTrue(Files.exists(openApi), "Missing OpenAPI contract at: " + openApi);

        String yaml = Files.readString(openApi);
        assertTrue(yaml.contains("/api/v1/products"), "Contract missing /api/v1/products path");
        assertTrue(yaml.contains("/api/v1/categories"), "Contract missing /api/v1/categories path");
    }

    private Path findRepoRoot() {
        Path current = Path.of("").toAbsolutePath();
        for (int i = 0; i < 6; i++) {
            if (Files.exists(current.resolve("specs")) && Files.exists(current.resolve(".specify"))) {
                return current;
            }
            current = current.getParent();
            if (current == null) {
                break;
            }
        }
        return Path.of("").toAbsolutePath();
    }
}
