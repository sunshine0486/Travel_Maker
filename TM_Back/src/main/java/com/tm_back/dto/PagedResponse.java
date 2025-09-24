package com.tm_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@AllArgsConstructor
public class PagedResponse<T> {
    private List<T> content;
    private int totalPages;
    private long totalElements;

    public static <T, R> PagedResponse<R> of(Page<T> page, java.util.function.Function<T, R> mapper) {
        return new PagedResponse<>(
                page.getContent().stream().map(mapper).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}

