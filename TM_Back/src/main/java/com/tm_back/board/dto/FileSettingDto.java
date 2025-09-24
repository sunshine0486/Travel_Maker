package com.tm_back.board.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FileSettingDto {

    private Integer maxUploadCnt;
    private Long fileMaxUploadSize; // byte 단위
    private String allowedExtension;
}
