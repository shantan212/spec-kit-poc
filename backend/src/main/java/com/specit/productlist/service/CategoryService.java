package com.specit.productlist.service;

import com.specit.productlist.api.dto.CategoryDto;
import com.specit.productlist.repository.CategoryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> listCategories() {
        return categoryRepository.findAll(Sort.by(Sort.Order.asc("name")))
                .stream()
                .map(c -> new CategoryDto(c.getId(), c.getName()))
                .toList();
    }
}
