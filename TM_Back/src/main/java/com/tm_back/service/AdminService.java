package com.tm_back.service;

import com.tm_back.constant.DeleteStatus;
import com.tm_back.dto.BoardResponseDto;
import com.tm_back.dto.CommentResponseDto;
import com.tm_back.dto.MemberResponseDto;
import com.tm_back.dto.PagedResponse;
import com.tm_back.entity.Comment;
import com.tm_back.entity.repository.BoardRepository;
import com.tm_back.entity.repository.CommentRepository;
import com.tm_back.entity.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;

    // ===== Member =====
    public PagedResponse<MemberResponseDto> getMembers(int page, int size) {
        var pageable = PageRequest.of(page, size);
        var result = memberRepository.findAll(pageable);
        return PagedResponse.of(result, MemberResponseDto::from);
    }

    // ===== Board =====
    public PagedResponse<BoardResponseDto> getBoards(int page, int size) {
        var pageable = PageRequest.of(page, size);
        var result = boardRepository.findAll(pageable);
        return PagedResponse.of(result, BoardResponseDto::from);
    }

    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    // ===== Comment =====
    public PagedResponse<CommentResponseDto> getComments(Long boardId, int page, int size) {
        var pageable = PageRequest.of(page, size);
        var result = commentRepository.findByBoardIdAndDelYn(boardId, DeleteStatus.N, pageable);
        return PagedResponse.of(result, CommentResponseDto::from);
    }

    public void softDeleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        comment.setDelYn(DeleteStatus.Y); // ✅ enum 값 사용
        commentRepository.save(comment);
    }
}
