package com.tm_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CommentResponseDto {
    private Long id;
    private String content;

    @JsonProperty("createdAt")
    private LocalDateTime regTime;

    @JsonProperty("updatedAt")
    private LocalDateTime updateTime;

    private Long boardId;
    private Long memberId;

    @JsonProperty("author")
    private String memberNickname;

    private List<CommentResponseDto> replies;
}

