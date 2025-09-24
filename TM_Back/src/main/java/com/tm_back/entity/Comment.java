package com.tm_back.entity;

import com.tm_back.constant.DeleteStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "del_yn", nullable = false, length = 1)
    @Builder.Default
    private DeleteStatus delYn = DeleteStatus.N;  // 기본값 N

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    @OneToMany(mappedBy = "parent", orphanRemoval = true)
    @Builder.Default
    private List<Comment> children = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.delYn == null) {
            this.delYn = DeleteStatus.N;
        }
    }
}
