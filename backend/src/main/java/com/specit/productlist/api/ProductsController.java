package com.specit.productlist.api;

import com.specit.productlist.api.dto.ProductListResponseDto;
import com.specit.productlist.service.ProductQuery;
import com.specit.productlist.service.ProductService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@Validated
public class ProductsController {

    private final ProductService productService;

    public ProductsController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ProductListResponseDto listProducts(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "categoryId", required = false) UUID categoryId,
            @RequestParam(name = "sort", required = false) ProductQuery.Sort sort,
            @RequestParam(name = "page", required = false, defaultValue = "1") @Min(1) int page,
            @RequestParam(name = "pageSize", required = false, defaultValue = "20") @Min(1) @Max(200) int pageSize
    ) {
        return productService.listAvailableProducts(new ProductQuery(q, categoryId, sort, page, pageSize));
    }
}
