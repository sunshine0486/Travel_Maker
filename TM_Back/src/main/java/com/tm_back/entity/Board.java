package com.tm_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
    @Id
    @Column(name = "board_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
}
