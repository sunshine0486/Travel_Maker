package com.tm_back.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardFileDto {
    private Long id;

    private String fileName; //이미지 파일명

    private String fileUrl; // 이미지 조회 경로

    private String oriFileName; //원본 이미지 파일명

    private Long fileSize; // 파일 용량
}
