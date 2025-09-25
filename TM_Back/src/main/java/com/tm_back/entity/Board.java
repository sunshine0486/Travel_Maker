package com.tm_back.entity;

import com.tm_back.constant.DeleteStatus;
import com.tm_back.constant.Category;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board extends BaseTimeEntity {
    @Id
    @Column(name = "board_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Category category;  // 여행1, 여행2

    @Column(nullable = false)
    @Builder.Default
    private Long views = 0L;

    @Enumerated(EnumType.STRING)
    @Column(name = "del_yn", nullable = false, length = 1)
    @Builder.Default
    private DeleteStatus delYn = DeleteStatus.N;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;  // 작성자

}
