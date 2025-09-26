package com.tm_back.entity;

import com.tm_back.constant.Category;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.dto.BoardFormDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "board")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Board extends BaseTimeEntity {

    @Id
    @Column(name = "board_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private Integer views; //초기값 0

    //    private String hashTag; // null 허용
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardHashtag> boardHashtags = new ArrayList<>();

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DeleteStatus delYn; // 초기값 N

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    public void updateBoard(BoardFormDto boardFormDto) {
        this.category = boardFormDto.getCategory();
        this.title = boardFormDto.getTitle();
        this.content = boardFormDto.getContent();
//        this.hashTag = boardFormDto.getHashTag();
    }
}
