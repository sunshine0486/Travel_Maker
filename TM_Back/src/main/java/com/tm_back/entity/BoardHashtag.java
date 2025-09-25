package com.tm_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board_hashtag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardHashtag {

    @EmbeddedId
    private BoardHashtagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("boardId")
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("hashtagId")
    @JoinColumn(name = "hashtag_id")
    private Hashtag hashtag;
}
