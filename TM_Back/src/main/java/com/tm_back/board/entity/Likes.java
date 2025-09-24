package com.tm_back.board.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "Likes")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Likes {

    @EmbeddedId //복합 키 클래스 임베딩
    private LikesId id;

    @MapsId("boardId") // LikesId의 boardId와 매핑
    @ManyToOne
    @JoinColumn(name="board_id")
    private Board board;

    @MapsId("memberId") // LikesId의 memberId와 매핑
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

}
