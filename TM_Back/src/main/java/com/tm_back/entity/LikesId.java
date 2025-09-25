package com.tm_back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class LikesId implements Serializable {

    @Column(name = "board_id")
    private Long boardId;

    @Column(name = "member_id")
    private Long memberId;

    // hashCode()와 equals()는 필수
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LikesId likesId = (LikesId) o;
        return Objects.equals(boardId, likesId.boardId) &&
                Objects.equals(memberId, likesId.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(boardId, memberId);
    }
}
