package com.tm_back.service;

import com.tm_back.dto.CommentResponseDto;
import com.tm_back.dto.CreateCommentDto;
import com.tm_back.dto.UpdateCommentDto;

import java.util.List;

public interface CommentService {
    List<CommentResponseDto> getCommentsByBoardId(Long boardId);
    CommentResponseDto createComment(CreateCommentDto dto);
    CommentResponseDto updateComment(Long id, UpdateCommentDto dto, Long memberId);
    void deleteComment(Long id, Long memberId);
}

