package com.tm_back.controller;

import com.tm_back.dto.BoardFormDto;
import com.tm_back.entity.Member;
import com.tm_back.repository.MemberRepository;
import com.tm_back.service.BoardFileService;
import com.tm_back.service.BoardImgService;
import com.tm_back.service.BoardService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BoardController {

    private final BoardImgService boardImgService;
    private final BoardService boardService;
    private final BoardFileService boardFileService;
    private final MemberRepository memberRepository;

    // 이미지 url 반환
    @PostMapping("/board/image")
    public ResponseEntity<?> getImgUrl(@RequestParam(value = "boardImgFile") MultipartFile boardImgFile) {
        try {
            String url = boardImgService.getImgUrl(boardImgFile);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("이미지 업로드 중 에러가 발생했습니다.");
        }
    }

    // 게시글 작성
    @PostMapping("/board/new")
    public ResponseEntity<?> createBoard(
            @Valid @ModelAttribute BoardFormDto boardFormDto,
            BindingResult bindingResult,
            @RequestParam(value = "boardFile", required = false) List<MultipartFile> boardFileList
//            ,Authentication authentication
    ) {
        System.out.println(boardFormDto.getContent());
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
            return ResponseEntity.ok(boardId); // 게시글아이디 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("게시글 등록 중 에러가 발생했습니다.");
        }
    }

    // 게시글 상세 조회
    @GetMapping("/board/show/{boardId}")
    public BoardFormDto getBoardDtl(
            @PathVariable Long boardId
//            ,Authentication authentication
    ) {
        Long memberId = null; // 비회원이면 null
//        if (authentication != null && authentication.isAuthenticated() &&
//                !(authentication instanceof AnonymousAuthenticationToken)) {
        // 로그인한 회원이면 memberId 세팅
//            Member member = memberRepository.findByLoginId(authentication.getName())
        String loginId = "user";
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(EntityNotFoundException::new);
        memberId = member.getId();
//        }

        return boardService.getBoardDtl(boardId, memberId);
    }


    // 파일 다운로드 횟수 증가
    @PostMapping("/board/show/{boardFileId}/downCnt")
    public ResponseEntity<Integer> increaseDownloadCount(@PathVariable Long boardFileId) {
        int updatedCount = boardFileService.increaseDownloadCount(boardFileId);
        return ResponseEntity.ok(updatedCount);
    }

    // 좋아요
    @PostMapping("/board/{boardId}/like")
    public void likeBoard(@PathVariable Long boardId
//            , Authentication authentication
    ) {
        Long memberId = null; // 비회원이면 null
//        if (authentication != null && authentication.isAuthenticated() &&
//                !(authentication instanceof AnonymousAuthenticationToken)) {
        // 로그인한 회원이면 memberId 세팅
//            Member member = memberRepository.findByLoginId(authentication.getName())
        String loginId = "user2";
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(EntityNotFoundException::new);
        memberId = member.getId();
//        }

        boardService.likeBoard(boardId, memberId);
    }

    // 수정일도 확인해야함
    @PutMapping("/board/{boardId}")
    public ResponseEntity<?> updateBoard(
            @Valid @ModelAttribute BoardFormDto boardFormDto,
            BindingResult bindingResult,
            @RequestParam(value = "boardFile", required = false) List<MultipartFile> boardFileList
//            Authentication authentication
    ) {
        // 유효성 검증
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("필수 입력값이 누락되었습니다.");
        }
        System.out.println("파일개수!!!!!!!!!!!!!!!!!!!"+boardFileList.toArray().length);
        try {
            Long boardId = boardService.updateBoard(boardFormDto, boardFileList);
            return ResponseEntity.ok(boardId); // 게시글아이디 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("게시글 등록 중 에러가 발생했습니다.");
        }
    }

    @DeleteMapping("/board/{boardId}")
    public Long deleteBoard(@PathVariable("boardId") Long boardId) throws Exception {
        return boardService.deleteBoard(boardId);
    }

}
