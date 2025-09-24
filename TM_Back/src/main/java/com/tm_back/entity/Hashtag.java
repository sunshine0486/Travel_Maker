package com.tm_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hashtag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hashtag_id")
    private Long id;

    @Column(name = "hashtag_name", unique = true, nullable = false, length = 20)
    private String hashtagName;
}
