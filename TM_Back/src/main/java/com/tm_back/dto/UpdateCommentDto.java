package com.tm_back.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCommentDto {

    private Long id;

    @NotNull(message = "내용을 작성해주세요.")
    private String content;
}
