package com.specit.productlist.service;

import com.specit.productlist.api.dto.CategoryDto;
import com.specit.productlist.api.dto.MoneyDto;
import com.specit.productlist.api.dto.ProductDto;
import com.specit.productlist.api.dto.ProductListResponseDto;
import com.specit.productlist.model.Category;
import com.specit.productlist.model.Product;
import com.specit.productlist.repository.ProductRepository;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductListResponseDto listAvailableProducts(ProductQuery query) {
        ProductQuery normalized = normalize(query);

        PageRequest pageRequest = PageRequest.of(
                normalized.page() - 1,
                normalized.pageSize(),
                toSpringSort(normalized.sort())
        );

        Specification<Product> spec = (root, q, cb) -> {
            root.fetch("category", JoinType.LEFT);
            q.distinct(true);

            var predicates = cb.conjunction();
            predicates = cb.and(predicates, cb.isTrue(root.get("isAvailable")));

            if (normalized.categoryId() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("category").get("id"), normalized.categoryId()));
            }

            if (normalized.q() != null && !normalized.q().isBlank()) {
                String like = "%" + normalized.q().trim().toLowerCase() + "%";
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("name")), like));
            }

            return predicates;
        };

        Page<Product> page = productRepository.findAll(spec, pageRequest);

        return new ProductListResponseDto(
                page.getContent().stream().map(this::toDto).toList(),
                normalized.page(),
                normalized.pageSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    private ProductDto toDto(Product p) {
        Category category = p.getCategory();
        CategoryDto categoryDto = category == null ? null : new CategoryDto(category.getId(), category.getName());

        MoneyDto money = null;
        if (p.getPriceAmount() != null) {
            money = new MoneyDto(p.getPriceAmount(), p.getPriceCurrency());
        }

        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getDescriptionSummary(),
                p.getImageUrl(),
                money,
                p.isAvailable(),
                categoryDto
        );
    }

    private ProductQuery normalize(ProductQuery q) {
        if (q == null) {
            return new ProductQuery(null, null, ProductQuery.Sort.name_asc, 1, 20);
        }

        ProductQuery.Sort sort = Objects.requireNonNullElse(q.sort(), ProductQuery.Sort.name_asc);
        int page = q.page() <= 0 ? 1 : q.page();
        int pageSize = q.pageSize() <= 0 ? 20 : Math.min(q.pageSize(), 200);

        return new ProductQuery(q.q(), q.categoryId(), sort, page, pageSize);
    }

    private Sort toSpringSort(ProductQuery.Sort sort) {
        if (sort == ProductQuery.Sort.price_asc) {
            return Sort.by(Sort.Order.asc("priceAmount"), Sort.Order.asc("name"));
        }
        return Sort.by(Sort.Order.asc("name"));
    }
}
