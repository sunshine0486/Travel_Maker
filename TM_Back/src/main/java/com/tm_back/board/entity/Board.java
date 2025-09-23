package com.tm_back.board.entity;

import com.tm_back.board.constant.Category;
import com.tm_back.board.constant.Del_YN;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class Board {

    @Id
    @Column(name="board_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private Integer views; //초기값 0

    private String hashTag; // null 허용

    @Column(nullable = false)
    private LocalDateTime regTime;

    private LocalDateTime updateTime; // null 허용

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Del_YN delYn; // 초기값 N

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
}
