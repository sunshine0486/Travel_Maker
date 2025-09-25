package com.tm_back.dto;

import com.tm_back.constant.Category;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.entity.Board;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BoardDto {
    private Long id;
    private String title;
    private String content;
    private Category category;
    private Long memberId;
    private Integer views;
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
        dto.setViews(board.getViews());
        dto.setRegTime(board.getRegTime());
        dto.setUpdateTime(board.getUpdateTime());
        dto.setDelYn(board.getDelYn());
        return dto;
    }

}