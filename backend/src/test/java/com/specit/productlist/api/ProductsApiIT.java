package com.specit.productlist.api;

import com.specit.productlist.model.Product;
import com.specit.productlist.repository.ProductRepository;
import com.specit.productlist.testsupport.PostgresTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class ProductsApiIT extends PostgresTestBase {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ProductRepository productRepository;

    @Test
    void listsOnlyAvailableProducts() throws Exception {
        productRepository.deleteAll();

        Product available = new Product();
        available.setName("Available A");
        available.setAvailable(true);

        Product unavailable = new Product();
        unavailable.setName("Unavailable B");
        unavailable.setAvailable(false);

        productRepository.save(available);
        productRepository.save(unavailable);

        mockMvc.perform(get("/api/v1/products").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].name", is("Available A")))
                .andExpect(jsonPath("$.page", is(1)))
                .andExpect(jsonPath("$.pageSize", is(20)));
    }

    @Test
    void returnsEmptyItemsWhenNoAvailableProducts() throws Exception {
        productRepository.deleteAll();

        mockMvc.perform(get("/api/v1/products").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)))
                .andExpect(jsonPath("$.totalItems", is(0)));
    }
}
