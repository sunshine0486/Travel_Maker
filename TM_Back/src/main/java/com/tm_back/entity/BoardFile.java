package com.tm_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board_file")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class BoardFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_file_id")
    private Long id;

    @Column(nullable = false)
    private String fileName; //이미지 파일명

    @Column(nullable = false)
    private String fileUrl; // 이미지 조회 경로

    @Column(nullable = false)
    private String oriFileName; //원본 이미지 파일명

    @Column(nullable = false)
    private Integer downCnt; // 다운로드 횟수

    @Column(nullable = false)
    private Long fileSize; // 파일 용량

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;
}
