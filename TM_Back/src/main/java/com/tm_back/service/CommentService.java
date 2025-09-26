package com.tm_back.service;

import com.tm_back.config.CommentConfig;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.constant.Role;
import com.tm_back.dto.CommentResponseDto;
import com.tm_back.dto.CreateCommentDto;
import com.tm_back.dto.UpdateCommentDto;
import com.tm_back.entity.Board;
import com.tm_back.entity.Comment;
import com.tm_back.entity.Member;
import com.tm_back.repository.BoardRepository;
import com.tm_back.repository.CommentRepository;
import com.tm_back.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final CommentConfig commentConfig;

    /**
     * 현재 로그인한 Member 조회 (username 기반)
     */
    private Member getCurrentMember() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }

        String loginId = authentication.getName(); // JwtFilter에서 set한 loginId
        return memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("해당 username의 멤버가 존재하지 않습니다: " + loginId));
    }

    public List<CommentResponseDto> getCommentsByBoardId(Long boardId) {
        List<Comment> comments = commentRepository.findByBoardIdAndParentIsNullOrderByRegTimeAsc(boardId);
        return comments.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public CommentResponseDto createComment(CreateCommentDto dto) {
        int maxLength = commentConfig.getMaxLength();
        if (dto.getContent().length() > maxLength) {
            throw new IllegalArgumentException("댓글은 " + maxLength + "자 이내로 작성해야 합니다.");
        }

        Member member = getCurrentMember();

        Board board = boardRepository.findById(dto.getBoardId())
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        Comment parent = null;
        if (dto.getParentCommentId() != null) {
            parent = commentRepository.findById(dto.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("부모 댓글 없음"));
        }

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .board(board)
                .member(member)
                .parent(parent)
                .delYn(DeleteStatus.N)
                .build();

        Comment saved = commentRepository.saveAndFlush(comment);
        log.info("댓글 저장 완료: id={}, board={}, member={}, parent={}",
                saved.getId(), saved.getBoard().getId(), saved.getMember().getId(),
                saved.getParent() != null ? saved.getParent().getId() : null);

        return toDto(saved);
    }

    @Transactional
    public CommentResponseDto updateComment(Long id, UpdateCommentDto dto) {
        Member member = getCurrentMember();

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        if (!comment.getMember().getId().equals(member.getId())
                && member.getRole() != Role.ADMIN) {
            throw new RuntimeException("권한이 없습니다.");
        }

        comment.setContent(dto.getContent());
        return toDto(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long id) {
        Member member = getCurrentMember();

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        if (!comment.getMember().getId().equals(member.getId())
                && member.getRole() != Role.ADMIN) {
            throw new RuntimeException("권한이 없습니다.");
        }

        if (comment.getParent() == null) {
            long activeChildCount = commentRepository.countByParentIdAndDelYn(comment.getId(), DeleteStatus.N);
            if (activeChildCount > 0) {
                comment.setContent("삭제된 댓글입니다.");
                comment.setDelYn(DeleteStatus.Y);
                commentRepository.save(comment);
            } else {
                commentRepository.delete(comment);
            }
        } else {
            Comment parent = comment.getParent();
            commentRepository.delete(comment);
            commentRepository.flush();

            if (parent != null && parent.getDelYn() == DeleteStatus.Y) {
                long aliveChildCount = commentRepository.countByParentIdAndDelYn(parent.getId(), DeleteStatus.N);
                if (aliveChildCount == 0) {
                    commentRepository.delete(parent);
                }
            }
        }
    }

    private CommentResponseDto toDto(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getDelYn() == DeleteStatus.Y ? "삭제된 댓글입니다" : comment.getContent());
        dto.setRegTime(comment.getRegTime());
        dto.setUpdateTime(comment.getUpdateTime());


        if (comment.getBoard() != null) {
            dto.setBoardId(comment.getBoard().getId());
        }
        if (comment.getMember() != null) {
            dto.setMemberId(comment.getMember().getId());
            dto.setMemberNickname(comment.getMember().getNickname());
            dto.setLoginId(comment.getMember().getLoginId());
        }

        dto.setDelYn(comment.getDelYn() != null ? comment.getDelYn().name() : "N");

        List<Comment> children = comment.getChildren() != null ? comment.getChildren() : Collections.emptyList();
        dto.setReplies(
                children.stream()
                        .filter(child -> !child.getId().equals(comment.getId()))
                        .map(this::toDto)
                        .collect(Collectors.toList())
        );

        return dto;
    }
}
