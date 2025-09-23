package com.tm_back.board.controller;

import com.tm_back.board.dto.BoardFormDto;
import com.tm_back.board.service.BoardImgService;
import com.tm_back.board.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardImgService boardImgService;
    private final BoardService boardService;

    // 이미지 url 반환
    @PostMapping("/image")
    public ResponseEntity<?> getImgUrl(@RequestParam(value = "boardImgFile") MultipartFile boardImgFile){
        try{
            String url = boardImgService.getImgUrl(boardImgFile);
            return ResponseEntity.ok(url);
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("이미지 업로드 중 에러가 발생했습니다.");
        }
    }

    // 게시글 작성
    @PostMapping("/new")
    public ResponseEntity<?> createBoard(
            @Valid @ModelAttribute BoardFormDto boardFormDto,
            BindingResult bindingResult,
            @RequestParam(value = "boardFile", required = false) List<MultipartFile> boardFileList
//            ,Authentication authentication
    ) {

        // 유효성 검증
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("필수 입력값이 누락되었습니다.");
        }

        try {
            ///  loginId가 user일때
            Long boardId = boardService.saveBoard(boardFormDto, boardFileList, "user"
//                    ,authentication.getName()
            );
            System.out.println(boardFormDto);
            return ResponseEntity. ok(boardId); // 게시글아이디 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("게시글 등록 중 에러가 발생했습니다.");
        }
    }


}
