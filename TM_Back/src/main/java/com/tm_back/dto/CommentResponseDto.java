package com.tm_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tm_back.entity.Comment;
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
    private String loginId;

    @JsonProperty("author")
    private String memberNickname;

    private List<CommentResponseDto> replies;

    private String delYn;

    public static CommentResponseDto from(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setRegTime(comment.getRegTime());
        dto.setUpdateTime(comment.getUpdateTime());
        dto.setBoardId(comment.getBoard().getId());
        dto.setMemberId(comment.getMember().getId());
        dto.setMemberNickname(comment.getMember().getNickname());

        // Enum → String (N, Y)
        if (comment.getDelYn() != null) {
            dto.setDelYn(comment.getDelYn().name());
        } else {
            dto.setDelYn("N"); // 혹시 null일 경우 기본값
        }

        // 대댓글 처리
        if (comment.getChildren() != null) {
            dto.setReplies(
                    comment.getChildren().stream()
                            .map(CommentResponseDto::from)
                            .toList()
            );
        }

        return dto;
    }
}

