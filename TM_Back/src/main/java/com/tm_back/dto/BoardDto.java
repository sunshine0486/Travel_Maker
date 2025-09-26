package com.tm_back.dto;

import com.tm_back.constant.Category;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.entity.Board;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardDto {
    private Long id;
    private String title;
    private String content;
    private Category category;
    private Long memberId;
    private Integer views;
    private Integer likeCount; // 좋아요수
    private Integer commentCount; // 댓글 수
    private String nickname; // 닉네임 추가
    private LocalDateTime regTime;
    private LocalDateTime updateTime;
    private DeleteStatus delYn;

    public static BoardDto from(Board board) {
        BoardDto dto = new BoardDto();
        dto.setId(board.getId());
        dto.setTitle(board.getTitle());
        dto.setContent(board.getContent());
        dto.setCategory(board.getCategory());
        dto.setMemberId(board.getMember().getId());
        dto.setNickname(board.getMember().getNickname());
        dto.setViews(board.getViews());
        dto.setRegTime(board.getRegTime());
        dto.setUpdateTime(board.getUpdateTime());
        dto.setDelYn(board.getDelYn());
        return dto;
    }

}