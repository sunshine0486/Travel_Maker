package com.tm_back.board.service;

import com.tm_back.board.entity.BoardFile;
import com.tm_back.board.repository.BoardFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoardFileService {

    @Value("${boardFileLocation}")
    private String boardFileLocation;

    private final BoardFileRepository boardFileRepository;

    public void saveBoardFile(BoardFile boardFile, MultipartFile multipartFile) throws Exception {
        try {
            // 원본 파일명
            String oriFileName = multipartFile.getOriginalFilename();

            // 확장자 추출
            String extension = "";
            if (oriFileName != null && oriFileName.contains(".")) {
                extension = oriFileName.substring(oriFileName.lastIndexOf("."));
            }

            // 서버 저장 파일명 (UUID + 확장자)
            String savedFileName = UUID.randomUUID() + extension;

            // 저장 경로
            File dest = new File(boardFileLocation, savedFileName);
            multipartFile.transferTo(dest);

            String fileUrl = "/image/board/" + savedFileName;

            // 엔티티에 값 세팅
            boardFile.setOriFileName(oriFileName);
            boardFile.setFileName(savedFileName);
            boardFile.setFileUrl(fileUrl);
            boardFile.setFileSize(multipartFile.getSize()); // 단위 : 바이트
            boardFile.setDownCnt(0);

            boardFileRepository.save(boardFile);


            //DB에 저장된 파일 정보 저장
            boardFileRepository.save(boardFile);
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류 발생", e);
        }
    }
}
