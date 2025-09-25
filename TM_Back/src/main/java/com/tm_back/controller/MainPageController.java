package com.tm_back.controller;

import com.tm_back.dto.BoardDto;
import com.tm_back.dto.BoardFormDto;
import com.tm_back.entity.Board;
import com.tm_back.service.MainPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
public class MainPageController {

    private final MainPageService mainPageService;

    // ===== 최신게시글 top3 =====
    @GetMapping("/current")
    public ResponseEntity<List<BoardFormDto>> getCurrentBoards() {
        return mainPageService.getCurrentBoards();
    }

    // ===== 인기게시글 top5 =====
    @GetMapping("/hot")
    public ResponseEntity<List<BoardDto>> getHotBoards() {
        return mainPageService.getHotBoards();
    }

    // ===== 토탈: 전체 게시글수, 회원수, 오늘 방문자수 =====
    @GetMapping("/totalcnt")
    public ResponseEntity<Map<String, Object>> getTotalcnt() {
        return mainPageService.getTotalcnt();
    }
}
