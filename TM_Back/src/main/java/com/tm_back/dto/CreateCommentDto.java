package com.tm_back.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCommentDto {

    private Long id;

    @NotNull(message = "내용을 작성해주세요.")
    private String content;

    @NotNull
    private Long boardId;

    @NotNull
    private Long memberId;

    // 대댓글일 경우, 부모 댓글 ID (nullable)
    private Long parentCommentId;
}
