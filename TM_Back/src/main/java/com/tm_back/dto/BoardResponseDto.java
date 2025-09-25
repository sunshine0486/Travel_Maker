package com.tm_back.dto;

import com.tm_back.entity.Board;
import com.tm_back.entity.Member;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BoardResponseDto {
    private Long id;
    private String title;
    private String content;
    private String category;   // ENUM → String
    private Long memberId;
    private Long views;
    private LocalDateTime regTime;
    private LocalDateTime updateTime;
    private String delYn;      // ENUM(‘Y’,‘N’) → String

    public static BoardResponseDto from(Board board) {
        BoardResponseDto dto = new BoardResponseDto();
        dto.setId(board.getId());
        dto.setTitle(board.getTitle());
        dto.setContent(board.getContent());
        dto.setCategory(board.getCategory().name()); // ENUM → String
        dto.setMemberId(board.getMember().getId());
        dto.setViews(board.getViews());
        dto.setRegTime(board.getRegTime());
        dto.setUpdateTime(board.getUpdateTime());
        dto.setDelYn(board.getDelYn().name()); // ENUM → String
        return dto;
    }

}
