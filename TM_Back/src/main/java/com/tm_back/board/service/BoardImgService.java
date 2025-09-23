package com.tm_back.board.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class BoardImgService {

    @Value("${boardFileLocation}")
    private String boardFileLocation;


    public String getImgUrl(MultipartFile boardImgFile) {
        if (boardImgFile.isEmpty()) {
            return null;
        }

        try {
            // 1. 업로드한 파일의 원본 이름 (사용자가 업로드한 파일명)
            String oriImgName = boardImgFile.getOriginalFilename();
            // 2. 확장자 추출
            String extension = oriImgName.substring(oriImgName.lastIndexOf("."));
            // 3. 새로 만든 파일명 (명 + 확장자)
            String savedFileName = UUID.randomUUID() + extension;

            // 4. 저장할 실제 경로(File 객체 생성)
            File dest = new File(boardFileLocation, savedFileName);

            // 5. 파일을 로컬에 저장
            boardImgFile.transferTo(dest);

            // URL 반환
            String imgUrl = "/image/board/" + savedFileName;
            return imgUrl;

        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 중 오류 발생", e);
        }
    }
}
