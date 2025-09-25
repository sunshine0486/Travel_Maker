package com.tm_back.dto;

import com.tm_back.entity.BoardFile;
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

    private Integer downloadCount;

    public static BoardFileDto toDto(BoardFile boardFile) {
        return BoardFileDto.builder()
                .id(boardFile.getId())
                .fileName(boardFile.getFileName())
                .oriFileName(boardFile.getOriFileName())
                .fileUrl(boardFile.getFileUrl())
                .fileSize(boardFile.getFileSize())
                .downloadCount(boardFile.getDownCnt())
                .build();
    }
}
