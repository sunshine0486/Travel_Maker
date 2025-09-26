package com.tm_back.dto;

import com.tm_back.constant.Category;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.entity.Board;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
    private List<String> hashtags; // 해시태그
    private LocalDateTime regTime;
    private LocalDateTime updateTime;
    private DeleteStatus delYn;

    public static BoardDto from(Board board) {
        List<String> hashtagNames = board.getBoardHashtags().stream()
                .map(bh -> bh.getHashtag().getHashtagName())
                .toList();

        return BoardDto.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .category(board.getCategory())
                .memberId(board.getMember().getId())
                .nickname(board.getMember().getNickname())
                .views(board.getViews())
                .regTime(board.getRegTime())
                .updateTime(board.getUpdateTime())
                .delYn(board.getDelYn())
                .hashtags(hashtagNames)
                .build();
    }
}