package com.tm_back.controller;

import com.tm_back.dto.CommentResponseDto;
import com.tm_back.dto.CreateCommentDto;
import com.tm_back.dto.UpdateCommentDto;
import com.tm_back.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;

    // 댓글 목록 조회
    @GetMapping("/board/{boardId}")
    public List<CommentResponseDto> getComments(@PathVariable Long boardId) {
        return commentService.getCommentsByBoardId(boardId);
    }

    // 댓글 등록
    @PostMapping("/new")
    public CommentResponseDto createComment(@RequestBody CreateCommentDto dto) {
        return commentService.createComment(dto);
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public CommentResponseDto updateComment(
            @PathVariable Long commentId,
            @RequestBody UpdateCommentDto dto,
            @RequestParam Long memberId
    ) {
        return commentService.updateComment(commentId, dto, memberId);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public void deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long memberId
    ) {
        commentService.deleteComment(commentId, memberId);
    }
}
