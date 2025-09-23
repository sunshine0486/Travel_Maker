package com.tm_back.board.dto;
import com.tm_back.board.constant.Category;
import com.tm_back.board.constant.Del_YN;
import com.tm_back.board.entity.Board;
import com.tm_back.board.entity.Member;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BoardFormDto {
    private Long id;

    @NotNull(message = "카테고리는 필수 입력 값입니다.")
    private Category category;

    @NotBlank(message = "제목은 필수 입력 값입니다.")
    private String title;

    @NotBlank(message = "내용은 필수 입력 값입니다.")
    private String content;

    private List<BoardFileDto> boardFileDtoList = new ArrayList<>();

    private String hashTag;

    private LocalDateTime regTime;


    // dto -> entity (게시글 첫 작성시)
    public Board toEntity(Member member) {
        return Board.builder()
                .title(this.title)
                .content(this.content)
                .category(this.category)
                .hashTag(this.hashTag)
                .views(0)
                .delYn(Del_YN.N)
                .regTime(LocalDateTime.now())
                .member(member)
                .build();
    }
}
