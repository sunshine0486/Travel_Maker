package com.tm_back.dto;
import com.tm_back.constant.Category;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.entity.Board;
import com.tm_back.entity.Member;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.modelmapper.ModelMapper;

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


    // 상세페이지 조회용
    private String nickname;
    private Integer views;
    private LocalDateTime updateTime;
    private Boolean isLiked; //어떤 회원이 불러온 게시글에 좋아요를 했는지 여부
    private Integer likeCount; // 게시글의 좋아요 개수
    private Boolean canEdit; //작성자면 수정가능
    private Boolean canDel; //작성자 및 관리자면 삭제가능
    private DeleteStatus delYn; // 삭제면 복원버튼 나오게

    // dto -> entity (게시글 첫 작성시)
    public Board toEntity(Member member) {
        return Board.builder()
                .title(this.title)
                .content(this.content)
                .category(this.category)
                .hashTag(this.hashTag)
                .views(0)
                .delYn(DeleteStatus.N)
                .member(member)
                .build();
    }

    // entity -> dto
    private static ModelMapper modelMapper = new ModelMapper();
    public static BoardFormDto toDto(Board board) {
        BoardFormDto dto = modelMapper.map(board, BoardFormDto.class);
        dto.setNickname(board.getMember() != null ? board.getMember().getNickname() : null);
        return dto;
    }


}
