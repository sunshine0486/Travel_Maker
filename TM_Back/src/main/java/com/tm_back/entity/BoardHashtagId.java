package com.tm_back.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardHashtagId implements Serializable {
    private Long boardId;
    private Long hashtagId;
}
